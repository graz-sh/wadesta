import type { ModuleType } from "../types";

interface MakeDefinerSourceArgs {
  import: string;
  definer: string;
  data: any;
  type: ModuleType;
}

export const makeDefinerSource = ({ import: $import, definer, data, type }: MakeDefinerSourceArgs) => {
  const importLine =
    type === "esm" ? `import { ${definer} } from "${$import}";` : `const { ${definer} } = require("${$import}");`;

  const exportLine =
    type === "esm"
      ? `export default ${definer}(${JSON.stringify(data)});`
      : `module.exports = ${definer}(${JSON.stringify(data)});`;

  return `${importLine}\n${exportLine}\n`;
};

interface MakeEmptyDefinerSourceArgs {
  message: string;
  type: ModuleType;
}

export const makeEmptyDefinerSource = ({ message, type }: MakeEmptyDefinerSourceArgs) => {
  const logLine = `console.error("${message}");`;

  const exportLine = type === "esm" ? `export default {};` : `module.exports = {};`;

  return `${logLine}\n${exportLine}\n`;
};
