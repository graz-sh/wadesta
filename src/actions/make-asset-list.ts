import type { AssetList } from "@graz-sh/types";
import * as fs from "fs/promises";
import * as path from "path";

import type { ModuleType } from "../types";
import { makeDefinerSource } from "./make-definer-source";

export interface MakeAssetListArgs {
  registryPath: string;
  chainPath: string;
  type: ModuleType;
}

export const makeAssetList = async ({ registryPath, chainPath, type }: MakeAssetListArgs) => {
  const jsonPath = path.resolve(registryPath, chainPath, "assetlist.json");

  let data: AssetList;
  try {
    const content = await fs.readFile(jsonPath, "utf-8");
    data = JSON.parse(content) as AssetList;
  } catch (error) {
    data = {
      chain_name: chainPath,
      assets: [],
    };
  }

  const source = makeDefinerSource({
    import: "@graz-sh/types/define",
    definer: "defineAssetList",
    data,
    type,
  });

  return {
    data,
    source,
  };
};
