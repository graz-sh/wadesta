import { globby } from "globby";

export const getIbcPaths = async (registryPath: string) => {
  const mainnetGlobs = ["_IBC/*.json"];
  const testnetGlobs = ["testnets/_IBC/*.json"];

  const paths = await globby([...mainnetGlobs, ...testnetGlobs], {
    cwd: registryPath,
    onlyFiles: true,
  });

  return paths;
};
