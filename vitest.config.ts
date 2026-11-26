import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // Visitors may be in any timezone; run the suite far from Tampa to prove it does not matter.
  test: { include: ["src/**/*.test.ts"], env: { TZ: "Pacific/Auckland" } },
});
