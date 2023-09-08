#!/usr/bin/env node

import { cac } from "cac";

import { promptParsedOptions } from "./actions/prompt-parsed-options";
import { parseOptions } from "./cli";
import { withDefaultGenerateFlags } from "./cli";
import { DEFAULT_OUT_DIR } from "./constants";
import { GenerateEventEmitter } from "./events";
import { generate } from "./generate";
import * as p from "./vendor/clack";

const cli = cac("wadesta")
  .help()
  .version(process.env.WADESTA_VERSION || "0.0.0");

const cmd = withDefaultGenerateFlags(cli.command("generate", "Generate client"));

cmd.action(
  async (options) => {
    const parsed = parseOptions(options);
    const { isActuallyInteractive } = parsed;

    isActuallyInteractive && p.intro("wadesta generate");

    const inputs = await promptParsedOptions(parsed);

    const emitter = new GenerateEventEmitter();
    if (isActuallyInteractive) {
      p.withSpinner((s) => {
        emitter.on("cloneRegistry", () => s.start("Loading registry"));
        emitter.on("cloneRegistryEnd", () => s.stop("✅ Loaded registry"));
      });
      p.withSpinner((s) => {
        emitter.on("clean", () => s.start("Cleaning output directory"));
        emitter.on("cleanEnd", () => s.stop("✅ Cleaned output directory"));
      });
      p.withSpinner((s) => {
        emitter.on("writeChains", () => s.start("Generating chain sources"));
        emitter.on("writeChainsEnd", () => s.stop("✅ Generated chain sources"));
      });
      p.withSpinner((s) => {
        emitter.on("writeRoot", () => s.start("Generating root sources"));
        emitter.on("writeRootEnd", () => s.stop("✅ Generated root sources"));
      });
    }

    await generate(inputs, emitter);

    isActuallyInteractive && p.outro(`🎉 Chain registry client generated at "${inputs.outDir || DEFAULT_OUT_DIR}".`);
  },
  //
);

cli.command("").action(() => cli.outputHelp());

cli.parse();
