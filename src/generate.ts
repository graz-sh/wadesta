import type EventEmitter from "events";
import pMap from "p-map";

import { cloneRegistry } from "./actions/clone-registry";
import { getChainsPaths } from "./actions/get-chains-paths";
import { graceFsRemove } from "./actions/grace-fs-remove";
import { makeTmpdir } from "./actions/make-tmpdir";
import { validateChainsPaths } from "./actions/validate-chains-paths";
import { writeChainSources } from "./actions/write-chain-sources";
import { writeRootSources } from "./actions/write-root-sources";
import * as constants from "./constants";
import { GenerateEvent } from "./constants/events";

export interface GenerateArgs {
  clean?: boolean;
  registry?: (string & {}) | "local";
  registrySrc?: string;
  outDir?: string;
  // ext?: FileExt;
  // type?: ModuleType;
  merged?: boolean;
}

export const generate = async (args: GenerateArgs = {}, emitter?: EventEmitter) => {
  args.registry ??= constants.DEFAULT_REGISTRY_SRC;

  const registryPromise =
    args.registry === "local" && args.registrySrc
      ? Promise.resolve(args.registrySrc)
      : cloneRegistry({
          src: args.registry,
          outDir: makeTmpdir(constants.DEFAULT_REGISTRY_TMP_PREFIX),
        });

  emitter?.emit(GenerateEvent.CloneRegistry);
  const registryPath = await registryPromise;
  emitter?.emit(GenerateEvent.CloneRegistryEnd);

  process.once("exit", () => {
    void graceFsRemove(registryPath);
  });

  const chainPaths = await getChainsPaths(registryPath);
  const validChainPaths = await validateChainsPaths({ registryPath, chainPaths });

  const outDir = args.outDir || constants.DEFAULT_OUT_DIR;
  if (args.clean) {
    emitter?.emit(GenerateEvent.Clean);
    await graceFsRemove(outDir);
    emitter?.emit(GenerateEvent.CleanEnd);
  }

  emitter?.emit(GenerateEvent.WriteChains);
  const chainData = await pMap(validChainPaths, async (chainPath) => {
    const result = await writeChainSources({
      registryPath,
      chainPath,
      destPath: outDir,
      ext: "js",
      type: "cjs",
    });
    return result.data;
  });
  emitter?.emit(GenerateEvent.WriteChainsEnd);

  emitter?.emit(GenerateEvent.WriteRoot);
  await writeRootSources({
    data: chainData,
    destPath: outDir,
    merged: args.merged ?? false,
  });
  emitter?.emit(GenerateEvent.WriteRootEnd);
};
