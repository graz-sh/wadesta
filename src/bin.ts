#!/usr/bin/env node

import { cac } from "cac";
import { EventEmitter } from "events";

import { promptInputs } from "./actions/cli/prompt-inputs";
import { DEFAULT_OUT_DIR } from "./constants";
import { GenerateEvent } from "./constants/events";
import { generate } from "./generate";
import * as p from "./vendor/clack";
import { isInteractive } from "./vendor/utils";

const cli = cac("wadesta")
  .help()
  .version(process.env.WADESTA_VERSION || "0.0.0");

cli
  .command("generate", "Generate client")
  .option("-r, --registry <source>", "Chain registry source")
  .option("-s, --registry-src <path>", "Local chain registry path (if registry is `local`)")
  .option("-o, --out-dir <path>", "Generated client output directory")
  .option(
    "-m, --merged",
    "Merge variables (e.g. only `chainIds` instead of `mainnetChainIds`, `testnetChainIds`, and `chainIds`)",
  )
  .option("-c, --clean", "Clean output directory")
  .option("-i, --interactive", "Interactive mode")
  .action(async (options) => {
    const isActuallyInteractive = isInteractive();

    isActuallyInteractive && p.intro("wadesta generate");

    const inputs = await promptInputs(options, isActuallyInteractive);

    const emitter = new EventEmitter();
    if (isActuallyInteractive) {
      p.withSpinner((s) => {
        emitter.on(GenerateEvent.CloneRegistry, () => s.start("Loading registry"));
        emitter.on(GenerateEvent.CloneRegistryEnd, () => s.stop("✅ Loaded registry"));
      });
      p.withSpinner((s) => {
        emitter.on(GenerateEvent.Clean, () => s.start("Cleaning output directory"));
        emitter.on(GenerateEvent.CleanEnd, () => s.stop("✅ Cleaned output directory"));
      });
      p.withSpinner((s) => {
        emitter.on(GenerateEvent.WriteChains, () => s.start("Generating chain sources"));
        emitter.on(GenerateEvent.WriteChainsEnd, () => s.stop("✅ Generated chain sources"));
      });
      p.withSpinner((s) => {
        emitter.on(GenerateEvent.WriteRoot, () => s.start("Generating root sources"));
        emitter.on(GenerateEvent.WriteRootEnd, () => s.stop("✅ Generated root sources"));
      });
    }

    await generate(inputs, emitter);

    isActuallyInteractive && p.outro(`🎉 Chain registry client generated at "${inputs.outDir || DEFAULT_OUT_DIR}".`);
  });

cli.command("").action(() => cli.outputHelp());

cli.parse();
