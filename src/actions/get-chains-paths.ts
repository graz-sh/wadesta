import { globby } from "globby";

export const getChainsPaths = async (registryPath: string) => {
  const mainnetGlobs = ["*", "!_*", "!testnets"];
  const testnetGlobs = ["testnets/*", "!testnets/_*"];

  const paths = await globby([...mainnetGlobs, ...testnetGlobs], {
    cwd: registryPath,
    onlyDirectories: true,
  });

  return paths;
};
