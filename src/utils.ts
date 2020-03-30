import { File } from "./interfaces";
import fs from "fs";
import path from "path";

export function readFiles(filePaths: string[], basePath?: string): File[] {
  return filePaths.map((filePath: string) => ({
    path: filePath,
    content: fs.readFileSync(getPath(filePath, basePath)).toString("utf8")
  }));
}

export function writeFiles(files: File[], basePath?: string): void {
  files.forEach((file: File) => {
    fs.writeFileSync(getPath(file.path, basePath), file.content, {
      encoding: "utf8",
      flag: "w"
    });
  });
}

function getPath(filePath: string, basePath?: string) {
  return path.join(basePath ? basePath : "", filePath);
}
