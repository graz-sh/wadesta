import { EventEmitter } from "events";
import type TypedEmitter from "typed-emitter";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type GenerateEvents = {
  cloneRegistry: () => void;
  cloneRegistryEnd: () => void;
  clean: () => void;
  cleanEnd: () => void;
  writeChains: () => void;
  writeChainsEnd: () => void;
  writeRoot: () => void;
  writeRootEnd: () => void;
};

export class GenerateEventEmitter extends (EventEmitter as new () => TypedEmitter<GenerateEvents>) {}
