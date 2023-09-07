import * as fs from "fs/promises";
import pMap, { pMapSkip } from "p-map";
import * as path from "path";

import { concurrency } from "../constants/parallel";

export interface ValidateChainsPathsArgs {
  registryPath: string;
  chainPaths: string[];
}

export const validateChainsPaths = async ({ registryPath, chainPaths }: ValidateChainsPathsArgs) => {
  const filesToCheck = ["chain.json"];

  const checkFiles = async (chainPath: string) => {
    try {
      await Promise.all(
        filesToCheck.map((file) => {
          return fs.lstat(path.resolve(registryPath, chainPath, file));
        }),
      );
      return chainPath;
    } catch (error) {
      return pMapSkip;
    }
  };

  const validChainPaths = await pMap(chainPaths, checkFiles, { concurrency });

  return validChainPaths;
};
