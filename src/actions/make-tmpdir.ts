import * as os from "os";
import * as path from "path";

export const makeTmpdir = (prefix: string) => {
  return path.resolve(os.tmpdir(), `${prefix}-${Date.now()}`);
};
