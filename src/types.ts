export type FileExt = "js" | "cjs" | "mjs" | "ts";
export type ModuleType = "cjs" | "esm";

export interface GenerateOptions {
  clean?: boolean;
  interactive?: boolean;
  merged?: boolean;
  outDir?: string;
  registry?: (string & {}) | "local";
  registrySrc?: string;

  // disabled until we can figure out how to make this work
  // ext?: FileExt;
  // type?: ModuleType;
}

export interface ParsedGenerateOptions extends GenerateOptions {
  isActuallyInteractive: boolean;
}
