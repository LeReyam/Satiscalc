import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
  },
});
