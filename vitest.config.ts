import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}", "tests/**/*.spec.{ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: [
        "lib/utils/cn.ts",
        "lib/utils/format.ts",
        "lib/utils/heatmap.ts",
        "lib/utils/prng.ts",
        "lib/utils/seededStats.ts",
        "lib/utils/aiFallback.ts",
        "lib/ai/gemini.ts",
        "lib/env.ts",
        "hooks/useLocalStorage.ts",
        "hooks/useBreakpoint.ts",
        "hooks/useReducedMotion.ts",
        "components/ui/badge.tsx",
        "components/ui/button.tsx",
        "components/ui/status-chip.tsx",
        "components/ui/error-state.tsx",
        "components/ui/progress-bar.tsx",
      ],
      exclude: [
        "**/*.d.ts",
        "**/node_modules/**",
        "**/.next/**",
        "**/coverage/**",
      ],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
