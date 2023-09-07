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
};

export default defineConfig(async () => {
  const filesToForceClean = await globby(["dist/*", "stubs/*"], { onlyFiles: true });
  await pMap(filesToForceClean, (file) => fs.unlink(file).catch(() => void 0));
  return [
    // main entrypoint
    {
      ...defaultOptions,
      entry: ["src/index.ts"],
    },
    // built stubs
    {
      ...defaultOptions,
      entry: ["src/stubs/*.ts"],
      outDir: "stubs",
    },
    {
      ...defaultOptions,
      entry: ["src/bin.ts"],
      dts: false,
    },
  ];
});
