import type { Chain } from "@graz-sh/types";
import * as fs from "fs/promises";
import { globby } from "globby";
import pMap from "p-map";
import * as path from "path";

import { concurrency } from "../constants/parallel";
import { makeRootVars } from "./make-root-vars";

export interface WriteRootSourcesArgs {
  data: { chain: Chain }[];
  destPath: string;
  merged: boolean;
}

export const writeRootSources = async ({ data, destPath, merged }: WriteRootSourcesArgs) => {
  const { keys, vars } = await makeRootVars({ data });

  const serialize = (v: object | string[]) => {
    if (Array.isArray(v)) return v.map((str) => `"${str}"`).join(",");
    return JSON.stringify(v);
  };

  const replaceVars = (source: string) => {
    for (const key of keys) {
      // eslint-disable-next-line no-param-reassign
      source = source.replaceAll(`"%${key}%"`, serialize(vars[key]));
    }
    return source;
  };

  const stubsDirname = path.resolve(__dirname, "../stubs");

  const loadSource = async (filename: string) => {
    return fs.readFile(path.resolve(stubsDirname, filename), { encoding: "utf-8" });
  };

  const [rootSource, rootTypeSource] = await Promise.all([
    loadSource(merged ? "index.merged.js" : "index.separate.js").then(replaceVars),
    loadSource(merged ? "index.merged.d.ts" : "index.separate.d.ts").then(replaceVars),
  ]);

  const filesToWrite = [
    {
      target: path.resolve(destPath, "index.js"),
      source: `${rootSource}\n`,
    },
    {
      target: path.resolve(destPath, "index.d.ts"),
      source: `${rootTypeSource}\n`,
    },
  ];

  await fs.mkdir(path.resolve(destPath), { recursive: true }).catch(() => void 0);

  const writeSource = ({ target, source }: (typeof filesToWrite)[number]) => {
    return fs.writeFile(target, source, { encoding: "utf-8" });
  };
  await pMap(filesToWrite, writeSource, { concurrency });

  const filePaths = await globby(["*", "!index.*"], {
    cwd: stubsDirname,
    onlyFiles: true,
  });

  const copyFiles = (filePath: string) => {
    return fs.copyFile(path.resolve(stubsDirname, filePath), path.resolve(destPath, filePath));
  };
  await pMap(filePaths, copyFiles, { concurrency });

  return {
    vars,
    files: filesToWrite,
  };
};
