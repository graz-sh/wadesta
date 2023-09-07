import type { Options as DegitOptions } from "degit";
import degit from "degit";

export type CloneRegistryArgs = DegitOptions & {
  src: string;
  outDir: string;
};

export const cloneRegistry = async ({ src, outDir, ...opts }: CloneRegistryArgs) => {
  const emitter = degit(src, { force: true, mode: "tar", ...opts });
  await emitter.clone(outDir);
  return outDir;
};
