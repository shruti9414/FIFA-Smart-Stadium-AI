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
    // Generated PWA build artifacts (service worker, workbox runtime) —
    // regenerated on every `next build`, never hand-edited.
    "public/sw.js",
    "public/swe-worker-*.js",
    "public/workbox-*.js",
    "public/fallback-*.js",
  ]),
  {
    rules: {
      // Stub AI-feature modules (lib/ai/*) intentionally take a typed but
      // unused `_input` until the AI-features phase implements them.
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
]);

export default eslintConfig;
