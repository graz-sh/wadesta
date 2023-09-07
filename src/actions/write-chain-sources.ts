import * as fs from "fs/promises";
import { globby } from "globby";
import pMap from "p-map";
import * as path from "path";

import { concurrency } from "../constants/parallel";
import type { FileExt, ModuleType } from "../types";
import { makeAssetList } from "./make-asset-list";
import { makeChain } from "./make-chain";
import { makeChainInfo } from "./make-chain-info";

export interface WriteChainSourcesArgs {
  registryPath: string;
  chainPath: string;
  destPath: string;
  ext: FileExt;
  type: ModuleType;
}

export const writeChainSources = async (args: WriteChainSourcesArgs) => {
  const [assetlist, chain] = await Promise.all([makeAssetList(args), makeChain(args)]);

  const chainInfo = await makeChainInfo({
    assetlist: assetlist.data,
    chain: chain.data,
    type: args.type,
  });

  const actualChainPath = args.chainPath.replace(/^testnets\//, "");

  const destChainPath = path.resolve(args.destPath, actualChainPath);

  const filesToRemove = await globby([`${destChainPath}/*`]);
  await pMap(filesToRemove, (file) => fs.unlink(file).catch(() => void 0), { concurrency });

  await fs.mkdir(destChainPath, { recursive: true }).catch(() => void 0);

  const filesToWrite = [
    {
      target: path.resolve(args.destPath, actualChainPath, `assetlist.${args.ext}`),
      source: `${assetlist.source}\n`,
    },
    {
      target: path.resolve(args.destPath, actualChainPath, `chain.${args.ext}`),
      source: `${chain.source}\n`,
    },
    {
      target: path.resolve(args.destPath, actualChainPath, `chain-info.${args.ext}`),
      source: `${chainInfo.source}\n`,
    },
    {
      target: path.resolve(args.destPath, actualChainPath, `index.${args.ext}`),
      source: `${chainInfo.source}\n`,
    },
  ];

  const writeSource = ({ target, source }: (typeof filesToWrite)[number]) => {
    return fs.writeFile(target, source, { encoding: "utf-8" });
  };
  await pMap(filesToWrite, writeSource, { concurrency });

  return {
    data: {
      assetlist: assetlist.data,
      chain: chain.data,
      chainInfo: chainInfo.data,
      chainPath: args.chainPath,
    },
    files: filesToWrite,
  };
};
