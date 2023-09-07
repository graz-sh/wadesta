import * as fs from "fs";

import * as constants from "../../constants";
import type { GenerateArgs } from "../../generate";
import * as p from "../../vendor/clack";
import { parseOptions } from "./parse-options";

type ClackGenerateOptions = {
  [K in keyof GenerateArgs]: (NonNullable<GenerateArgs[K]> extends string ? string : GenerateArgs[K]) | symbol;
};

export const promptInputs = async (options: any, isActuallyInteractive?: boolean): Promise<GenerateArgs> => {
  const parsed = parseOptions(options);
  if (isActuallyInteractive === false) return parsed;
  if (!parsed.isInteractive) return parsed;
  return p.group<ClackGenerateOptions>(
    {
      registry: async () => {
        if (parsed.registrySrc) return "local";
        if (parsed.registry) return parsed.registry;
        return p.text({
          message: "Enter a chain registry source",
          placeholder: constants.DEFAULT_REGISTRY_SRC,
          defaultValue: constants.DEFAULT_REGISTRY_SRC,
        });
      },
      registrySrc: async ({ results }) => {
        if (parsed.registrySrc) return parsed.registrySrc;
        if (results.registry !== "local") return;
        return p.text({
          message: "Enter local registry path",
          placeholder: "./path/to/registry",
          validate: (val) => {
            try {
              fs.lstatSync(val);
            } catch {
              return "Enter a valid path";
            }
          },
        });
      },
      outDir: async () => {
        if (parsed.outDir) return parsed.outDir;
        return p.text({
          message: "Enter generated client output directory",
          placeholder: constants.DEFAULT_OUT_DIR,
          defaultValue: constants.DEFAULT_OUT_DIR,
        });
      },
      merged: async () => {
        if (parsed.merged) return parsed.merged;
        return p.confirm({
          message: "Merge variables? (true: `chainIds`, false: `mainnetChainIds`, `testnetChainIds`, and `chainIds`)",
          active: "merge",
          inactive: "do not merge",
        });
      },
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        process.exit(1);
      },
    },
  );
};
