import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "temp-app/**",
    "temp-app-2/**",
    // Local agent tooling and generated review artifacts (all gitignored).
    ".gemini/**",
    ".superpowers/**",
    "review-shots/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
