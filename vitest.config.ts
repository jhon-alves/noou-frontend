import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./tests"),
    },
  },
  test: {
    css: true,
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    includeSource: ["src/**/*.{ts,tsx}"],
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          // root: "src/tests/unit/components",
          include: ["src/tests/unit/**/*.test.ts", "src/tests/unit/**/*.test.tsx"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
    },
  },
})
