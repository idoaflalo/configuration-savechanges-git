import gitP, { SimpleGit } from "simple-git/promise";
import { File, SaveChangesResult } from "./interfaces";
import envToBranch from "./env-to-branch";
import path from "path";
import _ from "lodash";
import { writeFiles, readFiles } from "./utils";

const gitPath = path.join(__dirname, "./../git-test");
const git: SimpleGit = gitP(gitPath);

async function saveChanges(files: File[], enviroment: string): Promise<SaveChangesResult> {
  try {
    await git.checkout(envToBranch(enviroment));
  } catch (err) {
    return { isError: true, errorDetails: "Can't checkout, Probebly because of conflicts." };
  }

  writeFiles(files, gitPath);

  const diffFiles = (await git.diffSummary()).files.map(fileSource => fileSource.file);

  await git.commit(
    `Configuration Update: ${diffFiles.length} files updated!`,
    files.map(file => file.path)
  );

  try {
    const pullResult = await git.pull();

    if (!_.isEqual(pullResult.files, diffFiles)) {
      const conflictedFilePaths = _.xor(pullResult.files, diffFiles);
      console.error(`Pull resulted in ${conflictedFilePaths.length} conflicts!`);
      return { isError: true, conflictedFiles: readFiles(conflictedFilePaths, gitPath) };
    }

    await git.push();
  } catch (err) {
    console.error(err);
    return { isError: true, errorDetails: err };
  }

  return { isError: false };
}

const file: File = {
  path: "README.md",
  content: "hello123"
};

saveChanges([file], "production").then(console.log);
