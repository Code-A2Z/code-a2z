import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    ...js.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginReact.configs.flat.recommended,
  {
    // Disable react-in-jsx-scope for React 17+ (not needed)
    files: ['**/*.{tsx,jsx}'],
    rules: {
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    ...json.configs.recommended,
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
  },
  {
    ...json.configs.recommended,
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
  },
  {
    ...json.configs.recommended,
    files: ["**/*.json5"],
    plugins: { json },
    language: "json/json5",
  },
  {
    ...css.configs.recommended,
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
  },
]);