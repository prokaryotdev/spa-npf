import { defineConfig, devices } from "@playwright/test";

const PORT = 3210;

/**
 * End-to-end checks against a real build. `npm test` covers the data — search
 * ranking, translation coverage, the store's session rules — but nothing in it
 * opens a page, so a dead button or a hydration crash would ship unnoticed.
 *
 * Against `next start` rather than `next dev`: dev serves a different CSP, and
 * the nonce and the proxy rewrite are exactly the machinery worth testing.
 */
export default defineConfig({
  testDir: "./e2e",
  // Every test asserts on a clean console, so a leak between them would be
  // read as a failure in the wrong place.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      // The full browser rather than the headless shell: it is what a visitor
      // actually runs, and the shell is a separate download CI would repeat.
      use: { ...devices["Desktop Chrome"], channel: "chromium" },
    },
  ],

  webServer: {
    // API_URL is what app/backend.ts checks before serving sign-in, the portal
    // and the console; without it those three 404 by design and half of this
    // suite would be testing the guard instead of the pages.
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    env: { API_URL: "http://localhost:4000" },
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
