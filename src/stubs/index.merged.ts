import type { AssetList, Chain, ChainInfo } from "@graz-sh/types";

export const chainIds = /* @__PURE__ */ ["%chainIds%"] as const;

export type ChainId = (typeof chainIds)[number];

export const chainNames = /* @__PURE__ */ ["%chainNames%"] as const;

export type ChainName = (typeof chainNames)[number];

export type ChainIdOrName = ChainId | ChainName;

// @ts-expect-error stub
export const chainIdToName: Record<ChainIdOrName, ChainName> = /* @__PURE__ */ "%chainIdToName%";
// @ts-expect-error stub
export const chainNameToId: Record<ChainIdOrName, ChainId> = /* @__PURE__ */ "%chainNameToId%";

export interface ChainData {
  assetlist: AssetList;
  chain: Chain;
  chainId: ChainId;
  chainInfo: ChainInfo;
  chainName: ChainName;
}

const $makeGetters = (resolvedProp: ChainIdOrName): ChainData => ({
  get assetlist() {
    return require(`./${resolvedProp}/assetlist`).default;
  },
  get chain() {
    return require(`./${resolvedProp}/chain`).default;
  },
  get chainId() {
    return require(`./${resolvedProp}`).default.chainId;
  },
  get chainInfo() {
    return require(`./${resolvedProp}`).default;
  },
  get chainName() {
    return require(`./${resolvedProp}/chain`).default.chain_name;
  },
});

type GetChainDataTuple<T> = T extends readonly [ChainIdOrName, ...infer Rest]
  ? [ChainData, ...GetChainDataTuple<Rest>]
  : [];

type GetChainInfoTuple<T> = T extends readonly [ChainIdOrName, ...infer Rest]
  ? [ChainInfo, ...GetChainInfoTuple<Rest>]
  : [];

export const getChainData = <T extends ChainIdOrName, const U extends T | readonly T[]>(pathOrPaths: U) => {
  const props: T[] = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
  const data: any = {};
  for (const prop of props) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const resolvedProp = chainIdToName[prop] || raise(`unknown chain id or name '${prop}'`);
    data[prop] = $makeGetters(resolvedProp);
  }
  return data as Record<T, ChainData>;
};

export const getChainDataArray = <T extends ChainIdOrName, const U extends T | readonly T[]>(pathOrPaths: U) => {
  const props: T[] = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
  const data: ChainData[] = [];
  for (const prop of props) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const resolvedProp = chainIdToName[prop] || raise(`unknown chain id or name '${prop}'`);
    data.push($makeGetters(resolvedProp));
  }
  return data as U extends T ? [ChainData] : U extends readonly T[] ? GetChainDataTuple<U> : never;
};

export const getChainInfo = <T extends ChainIdOrName, const U extends T | readonly T[]>(pathOrPaths: U) => {
  const props: T[] = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
  const data: any = {};
  for (const prop of props) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const resolvedProp = chainIdToName[prop] || raise(`unknown chain id or name '${prop}'`);
    data[prop] = require(`./${resolvedProp}`).default;
  }
  return data as Record<T, ChainInfo>;
};

export const getChainInfoArray = <T extends ChainIdOrName, const U extends T | readonly T[]>(pathOrPaths: U) => {
  const props: T[] = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
  const data: any[] = [];
  for (const prop of props) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const resolvedProp = chainIdToName[prop] || raise(`unknown chain id or name '${prop}'`);
    data.push(require(`./${resolvedProp}`).default);
  }
  return data as U extends T ? [ChainInfo] : U extends readonly T[] ? GetChainInfoTuple<U> : never;
};

const $makeProxy = (fn: (resolvedProp: ChainIdOrName) => any) => {
  const get = (_: {}, prop: ChainIdOrName): any => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const resolvedProp = chainIdToName[prop] || raise(`unknown chain id or name '${prop}'`);
    return fn(resolvedProp);
  };
  return new Proxy({}, { get });
};

const $chainDataProxy = /* @__PURE__ */ $makeProxy($makeGetters);
export const chainData = /* @__PURE__ */ $chainDataProxy as Record<ChainIdOrName, ChainData>;

const $chainsProxy = /* @__PURE__ */ $makeProxy((resolvedProp) => require(`./${resolvedProp}/chain`).default);
export const chains = /* @__PURE__ */ $chainsProxy as Record<ChainIdOrName, Chain>;

const $chainInfosProxy = /* @__PURE__ */ $makeProxy((resolvedProp) => require(`./${resolvedProp}`).default);
export const chainInfos = /* @__PURE__ */ $chainInfosProxy as Record<ChainIdOrName, ChainInfo>;

const raise = (message?: string): never => {
  throw new Error(message);
};