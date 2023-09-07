// @ts-check

const { extendEslint } = require("@graz-sh/style-guide-core");

module.exports = extendEslint(["browser-node", "typescript", "tsup"], {
  ignorePatterns: ["dist", "generated", "stubs", "!src/stubs"],
  rules: {
    "@typescript-eslint/no-explicit-any": ["off"],
  },
  overrides: [
    {
      files: ["src/stubs/*.ts"],
      rules: {
        "@typescript-eslint/no-unsafe-assignment": ["off"],
        "@typescript-eslint/no-unsafe-member-access": ["off"],
        "@typescript-eslint/no-unsafe-return": ["off"],
        "@typescript-eslint/no-var-requires": ["off"],
      },
    },
  ],

  root: true,
});
