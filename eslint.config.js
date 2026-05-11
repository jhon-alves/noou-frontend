import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"
import prettierConfig from "eslint-config-prettier"

export default defineConfig([
  globalIgnores([
    "dist",
    "node_modules",
    "build",
    "coverage",
    "*.config.*",
    "tsconfig.json",
    "src/components/ui/**",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.config.*", "!**/eslint.config.js", ".config/", "dist/", "tsconfig.json"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "prefer-const": "error",
      "no-console": "warn",
    },
  },
  prettierConfig,
])
