import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ...js.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginReact.configs.flat.recommended,
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
