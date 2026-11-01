import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "jsdom", include: ["tests/**/*.test.tsx"], testTimeout: 20_000 },
});
