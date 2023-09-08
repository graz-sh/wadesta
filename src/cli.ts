import type { Command } from "cac";

import type { GenerateOptions, ParsedGenerateOptions } from "./types";
import { isInteractive } from "./vendor/utils";

///////////////////////////////////////////////////////////////////////////////

export const parseOptions = (options: any, overrides: Partial<ParsedGenerateOptions> = {}): ParsedGenerateOptions => {
  return {
    clean: "clean" in options,
    interactive: "interactive" in options,
    merged: "merged" in options,
    outDir: "outDir" in options ? (options.outDir as string) : undefined,
    registry: "registry" in options ? (options.registry as string) : undefined,
    registrySrc: "registrySrc" in options ? (options.registrySrc as string) : undefined,
    isActuallyInteractive: isInteractive(),
    ...overrides,
  };
};

///////////////////////////////////////////////////////////////////////////////

export function withDefaultGenerateFlags(command: Command): Command;

export function withDefaultGenerateFlags<T extends Partial<Record<keyof GenerateOptions, boolean>>>(
  command: Command,
  args: { overrides: T },
): Command;

// eslint-disable-next-line prefer-arrow-functions/prefer-arrow-functions
export function withDefaultGenerateFlags<T extends Partial<Record<keyof GenerateOptions, boolean>>>(
  command: Command,
  { overrides }: { overrides?: T } = {},
): Command {
  const check = (str: keyof T) => {
    if (!overrides) return true;
    return overrides[str] === true;
  };
  if (check("registry")) {
    command.option("-r, --registry <source>", "Chain registry source");
  }
  if (check("registrySrc")) {
    command.option("-s, --registry-src <path>", "Local chain registry path (if registry is `local`)");
  }
  if (check("outDir")) {
    command.option("-o, --out-dir <path>", "Generated client output directory");
  }
  if (check("merged")) {
    command.option(
      "-m, --merged",
      "Merge variables (e.g. only `chainIds` instead of `mainnetChainIds`, `testnetChainIds`, and `chainIds`)",
    );
  }
  if (check("clean")) {
    command.option("-c, --clean", "Clean output directory");
  }
  if (check("interactive")) {
    command.option("-i, --interactive", "Interactive mode");
  }
  return command;
}
