import type { PathLike } from "fs";
import * as fs from "fs/promises";

export const graceFsRemove = async (path: PathLike) => {
  return fs.rm(path, { force: true, recursive: true }).catch(() => void 0);
};
