import type { AssetList, Chain, ChainInfo } from "@graz-sh/types";
import { chainToChainInfo } from "@graz-sh/types/convert";

import type { ModuleType } from "../types";
import { makeDefinerSource, makeEmptyDefinerSource } from "./make-definer-source";

export interface MakeChainInfoArgs {
  assetlist: AssetList;
  chain: Chain;
  type: ModuleType;
}

// eslint-disable-next-line @typescript-eslint/require-await
export const makeChainInfo = async ({ assetlist, chain, type }: MakeChainInfoArgs) => {
  let data: ChainInfo | undefined;

  if (assetlist.assets.length > 0) {
    data = chainToChainInfo({ assetlist, chain });
  }

  const source = data
    ? makeDefinerSource({
        import: "@graz-sh/types/define",
        definer: "defineChainInfo",
        data,
        type,
      })
    : makeEmptyDefinerSource({
        message: `chain info for '${chain.chain_name}' is not generated due to invalid assetlist`,
        type,
      });

  return {
    data,
    source,
  };
};
