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
      // The journeys, plus the accessibility scan, which is engine-independent.
      name: "chromium",
      // The full browser rather than the headless shell: it is what a visitor
      // actually runs, and the shell is a separate download CI would repeat.
      use: { ...devices["Desktop Chrome"], channel: "chromium" },
      testIgnore: /responsive\.spec\.ts/,
    },
    {
      // Safari's engine. A large share of UAE traffic is iPhone, and WebKit is
      // the engine most likely to differ on mask-image, `gap`, and anything
      // right-to-left — none of which Chromium would have shown us.
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch: /smoke\.spec\.ts/,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: /smoke\.spec\.ts/,
    },
    {
      // Every screenshot taken while building this site was desktop width.
      name: "mobile-android",
      // Same channel as the desktop project: the default headless shell is a
      // second download, and CI should not fetch two Chromiums.
      use: { ...devices["Pixel 5"], channel: "chromium" },
      testMatch: /responsive\.spec\.ts/,
    },
    {
      name: "mobile-ios",
      use: { ...devices["iPhone 13"] },
      testMatch: /responsive\.spec\.ts/,
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
