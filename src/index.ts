import gitP, { SimpleGit } from "simple-git/promise";
import { File, SaveChangesResult } from "interfaces";
import path from "path";
import fs from "fs";

const gitPath = path.join(__dirname, "./git-test");
const git: SimpleGit = gitP();

async function saveChanges(files: File[], enviroment: string): Promise<SaveChangesResult> {
  await git.checkout(enviroment);
  files.forEach((file: File) => {
    fs.writeFileSync(path.join(gitPath, file.path), file.content, {
      encoding: "utf8",
      flag: "w"
    });
  });
  await git.commit(
    `Configuration Update: ${files.length} files commited!`,
    files.map(file => file.path)
  );
  try {
    await git.pull();
  } catch (err) {
    console.log(err.git.conflicts);
    console.error(`Pull resulted in ${err.git.conflicts.length} conflicts!`);
    return { isError: true, conflicts: err.git.conflicts };
  }

  await git.push();

  return { isError: false };
}
