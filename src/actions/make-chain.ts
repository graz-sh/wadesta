import type { Chain } from "@graz-sh/types";
import * as fs from "fs/promises";
import * as path from "path";

import type { ModuleType } from "../types";
import { makeDefinerSource } from "./make-definer-source";

export interface MakeChainArgs {
  registryPath: string;
  chainPath: string;
  type: ModuleType;
}

export const makeChain = async ({ registryPath, chainPath, type }: MakeChainArgs) => {
  const jsonPath = path.resolve(registryPath, chainPath, "chain.json");

  const content = await fs.readFile(jsonPath, "utf-8");
  const data = JSON.parse(content) as Chain;

  const source = makeDefinerSource({
    import: "@graz-sh/types/define",
    definer: "defineChain",
    data,
    type,
  });

  return {
    data,
    source,
  };
};
