const fs = require("fs/promises");
const path = require("path");

const cleanReadme = async () => {
  const readmePath = path.resolve(__dirname, "../README.md");

  let readmeContent = await fs.readFile(readmePath, { encoding: "utf-8" });
  // capture <!-- NPM_CLEAN_BELOW --> and everything below it
  readmeContent = readmeContent.replace(/<!-- NPM_CLEAN_BELOW -->[\s\S]*/, "");

  await fs.writeFile(readmePath, readmeContent, { encoding: "utf-8" });
};

void cleanReadme();
