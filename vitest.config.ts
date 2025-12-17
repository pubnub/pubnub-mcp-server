import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    projects: [
      {
        test: {
          name: "unit",
          include: ["**/*.test.ts"],
          setupFiles: ["./src/test-utils/setup-tests.ts"],
          exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/*.integration.test.ts",
            "**/*.manual.test.ts",
          ],
        },
      },
      {
        test: {
          name: "integration",
          include: ["**/*.integration.test.ts"],
          exclude: ["**/node_modules/**", "**/dist/**", "**/*.manual.test.ts"],
          testTimeout: 180_000,
          hookTimeout: 60_000,
        },
      },
      {
        test: {
          name: "token-count",
          include: ["**/api.manual.test.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.test.ts",
        "**/*.d.ts",
        "src/test-utils/**",
        "rollup.config.js",
      ],
    },
  },
});
