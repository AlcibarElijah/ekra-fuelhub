import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Needed for `module`, `require`, etc.
      },
    },
    plugins: {
      js,
      react: pluginReact,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",          // Ignore variables starting with _
          argsIgnorePattern: "^_",          // Ignore function args starting with _
          caughtErrorsIgnorePattern: "^_"   // Ignore caught errors starting with _
        }
      ],
      "no-undef": "error",
    },
  },
  pluginReact.configs.flat.recommended,
]);
