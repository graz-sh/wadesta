import type { AssetList, Chain, ChainInfo } from "@graz-sh/types";

export const mainnetChainIds = /* @__PURE__ */ ["%mainnetChainIds%"] as const;
export const testnetChainIds = /* @__PURE__ */ ["%testnetChainIds%"] as const;
export const chainIds = /* @__PURE__ */ [...mainnetChainIds, ...testnetChainIds] as const;

export type MainnetChainId = (typeof mainnetChainIds)[number];
export type TestnetChainId = (typeof testnetChainIds)[number];
export type ChainId = MainnetChainId | TestnetChainId;

export const mainnetChainNames = /* @__PURE__ */ ["%mainnetChainNames%"] as const;
export const testnetChainNames = /* @__PURE__ */ ["%testnetChainNames%"] as const;
export const chainNames = /* @__PURE__ */ [...mainnetChainNames, ...testnetChainNames] as const;

export type MainnetChainName = (typeof mainnetChainNames)[number];
export type TestnetChainName = (typeof testnetChainNames)[number];
export type ChainName = MainnetChainName | TestnetChainName;

export type MainnetChainIdOrName = MainnetChainId | MainnetChainName;
export type TestnetChainIdOrName = TestnetChainId | TestnetChainName;
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
    return require(`./${resolvedProp}/assetlist`);
  },
  get chain() {
    return require(`./${resolvedProp}/chain`);
  },
  get chainId() {
    return require(`./${resolvedProp}`).chainId;
  },
  get chainInfo() {
    return require(`./${resolvedProp}`);
  },
  get chainName() {
    return require(`./${resolvedProp}/chain`).chain_name;
  },
});

type GetChainDataTuple<T> = T extends readonly [ChainIdOrName, ...infer Rest]
  ? [ChainData, ...GetChainDataTuple<Rest>]
  : [];

type GetChainInfoTuple<T> = T extends readonly [ChainIdOrName, ...infer Rest]
  ? [ChainInfo, ...GetChainInfoTuple<Rest>]
  : [];

export const getChainData = <T extends ChainIdOrName>(pathOrPaths: T | readonly T[]) => {
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

export const getChainInfo = <T extends ChainIdOrName>(pathOrPaths: T | readonly T[]) => {
  const props: T[] = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
  const data: any = {};
  for (const prop of props) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const resolvedProp = chainIdToName[prop] || raise(`unknown chain id or name '${prop}'`);
    data[prop] = require(`./${resolvedProp}`);
  }
  return data as Record<T, ChainInfo>;
};

export const getChainInfoArray = <T extends ChainIdOrName, const U extends T | readonly T[]>(pathOrPaths: U) => {
  const props: T[] = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
  const data: any[] = [];
  for (const prop of props) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const resolvedProp = chainIdToName[prop] || raise(`unknown chain id or name '${prop}'`);
    data.push(require(`./${resolvedProp}`));
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
export const mainnetChainData = /* @__PURE__ */ $chainDataProxy as Record<MainnetChainIdOrName, ChainData>;
export const testnetChainData = /* @__PURE__ */ $chainDataProxy as Record<TestnetChainIdOrName, ChainData>;
export const chainData = /* @__PURE__ */ $chainDataProxy as Record<ChainIdOrName, ChainData>;

const $chainsProxy = /* @__PURE__ */ $makeProxy((resolvedProp) => require(`./${resolvedProp}/chain`));
export const mainnetChains = /* @__PURE__ */ $chainsProxy as Record<MainnetChainIdOrName, Chain>;
export const testnetChains = /* @__PURE__ */ $chainsProxy as Record<TestnetChainIdOrName, Chain>;
export const chains = /* @__PURE__ */ $chainsProxy as Record<ChainIdOrName, Chain>;

const $chainInfosProxy = /* @__PURE__ */ $makeProxy((resolvedProp) => require(`./${resolvedProp}`));
export const mainnetChainInfos = /* @__PURE__ */ $chainInfosProxy as Record<MainnetChainIdOrName, ChainInfo>;
export const testnetChainInfos = /* @__PURE__ */ $chainInfosProxy as Record<TestnetChainIdOrName, ChainInfo>;
export const chainInfos = /* @__PURE__ */ $chainInfosProxy as Record<ChainIdOrName, ChainInfo>;

export const raise = (message?: string): never => {
  throw new Error(message);
};
