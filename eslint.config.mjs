import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import mochaPlugin from "eslint-plugin-mocha";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  // Base configuration for all JavaScript files
  {
    files: ["src/**/*.js", "test/**/*.js", "*.js", "bin/**/*.js"],
    plugins: {
      js,
      import: importPlugin
    },
    extends: ["js/recommended"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.commonjs
      }
    },
    rules: {
      // Node.js specific
      "no-process-exit": "error",
      "no-path-concat": "error",
      "handle-callback-err": "error",

      // Code quality
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "require-await": "error",
      "no-return-await": "error"
    }
  },

  // Test-specific configuration
  {
    files: ["test/**/*.js"],
    plugins: {
      mocha: mochaPlugin
    },
    languageOptions: {
      globals: {
        ...globals.mocha
      }
    },
    rules: {
      // Mocha specific rules
      "mocha/consistent-spacing-between-blocks": "error",
      "mocha/no-exclusive-tests": "error", 
      "mocha/no-hooks-for-single-case": "warn",
      "mocha/no-identical-title": "error",
      "mocha/no-nested-tests": "error",
      "mocha/no-sibling-hooks": "error",
      "mocha/no-top-level-hooks": "error",
      
      // Allow assertions
      "no-unused-expressions": "off"
    }
  }
]);