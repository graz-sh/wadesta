import pMap from "p-map";

import { cloneRegistry } from "./actions/clone-registry";
import { getChainsPaths } from "./actions/get-chains-paths";
import { graceFsRemove } from "./actions/grace-fs-remove";
import { makeTmpdir } from "./actions/make-tmpdir";
import { validateChainsPaths } from "./actions/validate-chains-paths";
import { writeChainSources } from "./actions/write-chain-sources";
import { writeRootSources } from "./actions/write-root-sources";
import * as constants from "./constants";
import type { GenerateEventEmitter } from "./events";
import type { GenerateOptions } from "./types";

export const generate = async (args: GenerateOptions = {}, emitter?: GenerateEventEmitter) => {
  args.registry ??= constants.DEFAULT_REGISTRY_SRC;

  const registryPromise =
    args.registry === "local" && args.registrySrc
      ? Promise.resolve(args.registrySrc)
      : cloneRegistry({
          src: args.registry,
          outDir: makeTmpdir(constants.DEFAULT_REGISTRY_TMP_PREFIX),
        });

  emitter?.emit("cloneRegistry");
  const registryPath = await registryPromise;
  emitter?.emit("cloneRegistryEnd");

  process.once("exit", () => {
    void graceFsRemove(registryPath);
  });

  const chainPaths = await getChainsPaths(registryPath);
  const validChainPaths = await validateChainsPaths({ registryPath, chainPaths });

  const outDir = args.outDir || constants.DEFAULT_OUT_DIR;
  if (args.clean) {
    emitter?.emit("clean");
    await graceFsRemove(outDir);
    emitter?.emit("cleanEnd");
  }

  emitter?.emit("writeChains");
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
  emitter?.emit("writeChainsEnd");

  emitter?.emit("writeRoot");
  await writeRootSources({
    data: chainData,
    destPath: outDir,
    merged: args.merged ?? false,
  });
  emitter?.emit("writeRootEnd");
};
