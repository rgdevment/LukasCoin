module.exports = [
  {
    ignores: ["**/typechain-types/**", "**/artifacts/**", "hardhat.config.ts"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "prettier/prettier": "error",
    },
  },
];
