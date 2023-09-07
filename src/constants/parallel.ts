import * as os from "os";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const concurrency = /* @__PURE__ */ Math.max(1, (os.cpus() || { length: 1 }).length - 1);
