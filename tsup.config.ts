import * as fs from "fs/promises";
import { globby } from "globby";
import pMap from "p-map";
import type { Options } from "tsup";
import { defineConfig } from "tsup";

import { version } from "./package.json";

const defaultOptions: Options = {
  cjsInterop: true,
  clean: true,
  dts: true,
  env: {
    WADESTA_VERSION: version,
  },
  format: ["cjs"],
  minify: true,
  shims: true,
  splitting: true,
  treeshake: true,
  tsconfig: "./tsconfig.build.json",
};

export default defineConfig(async () => {
  const filesToForceClean = await globby(["dist/*", "stubs/*"], { onlyFiles: true });
  await pMap(filesToForceClean, (file) => fs.unlink(file).catch(() => void 0));
  return [
    // main entrypoints
    {
      ...defaultOptions,
      entry: [
        "src/cli.ts",
        "src/events.ts",
        "src/index.ts",
        //
      ],
    },
    // precompiled stubs
    {
      ...defaultOptions,
      entry: ["src/stubs/*.ts"],
      outDir: "stubs",
    },
    // wadesta bin script
    {
      ...defaultOptions,
      entry: ["src/bin.ts"],
      dts: false,
    },
  ];
});
