import { isInteractive } from "../../vendor/utils";

export const parseOptions = (options: any) => {
  const isActuallyInteractive = isInteractive();
  return {
    registry: "registry" in options ? (options.registry as string) : undefined,
    registrySrc: "registrySrc" in options ? (options.registrySrc as string) : undefined,
    outDir: "outDir" in options ? (options.outDir as string) : undefined,
    merged: "merged" in options,
    clean: "clean" in options,
    isInteractive: "interactive" in options,
    isActuallyInteractive,
  };
};
