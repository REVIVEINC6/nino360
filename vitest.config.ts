import { defineConfig } from "vitest/config"
import path from "path"

// Try to load the react plugin if available. Some environments (tests) may not have
// `@vitejs/plugin-react` installed; in that case we continue without the plugin.
let reactPlugin: any = null
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const _react = require("@vitejs/plugin-react")
  reactPlugin = typeof _react === "function" ? _react : _react.default || _react
} catch {
  // plugin not installed: continue without it
}

export default defineConfig({
  plugins: reactPlugin ? [reactPlugin()] : [],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Only include our repository tests under `__tests__` to avoid running
    // third-party tests that live inside node_modules (which caused a flood
    // of unrelated failures). Playwright e2e tests are excluded and should
    // be run with the Playwright runner when needed.
    include: ["__tests__/**/**.{test,spec}.{js,cjs,mjs,ts,cts,mts,jsx,tsx}"],
    exclude: ["node_modules/**", "**/__tests__/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "__tests__/", "*.config.ts", ".next/"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
