import type { Chain } from "@graz-sh/types";
import pMap from "p-map";

import { concurrency } from "../constants/parallel";

export const makeRootVars = async ({ data }: { data: { chain: Chain }[] }) => {
  const mainnetChainIds: string[] = [];
  const testnetChainIds: string[] = [];
  const mainnetChainNames: string[] = [];
  const testnetChainNames: string[] = [];
  const chainIdToName: Record<string, string> = {};
  const chainNameToId: Record<string, string> = {};

  const loadVars = ({ chain }: (typeof data)[number]) => {
    const isTestnet = chain.network_type === "mainnet";
    (isTestnet ? testnetChainIds : mainnetChainIds).push(chain.chain_id);
    (isTestnet ? testnetChainNames : mainnetChainNames).push(chain.chain_name);
    chainIdToName[chain.chain_id] = chain.chain_name;
    chainIdToName[chain.chain_name] = chain.chain_name;
    chainNameToId[chain.chain_name] = chain.chain_id;
    chainNameToId[chain.chain_id] = chain.chain_id;
  };

  await pMap(data, loadVars, { concurrency });

  const vars = {
    mainnetChainIds: mainnetChainIds.sort(),
    testnetChainIds: testnetChainIds.sort(),
    chainIds: [...mainnetChainIds, ...testnetChainIds].sort(),
    mainnetChainNames: mainnetChainNames.sort(),
    testnetChainNames: testnetChainNames.sort(),
    chainNames: [...mainnetChainNames, ...testnetChainNames].sort(),
    chainIdToName,
    chainNameToId,
  } as const;

  const keys = Object.keys(vars) as (keyof typeof vars)[];

  return { keys, vars };
};
