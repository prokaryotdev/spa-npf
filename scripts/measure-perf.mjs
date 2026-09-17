/**
 * Core Web Vitals and transfer weight, against a running production server:
 *   API_URL=x npx next start -p 3210 &
 *   node scripts/measure-perf.mjs [baseUrl]
 *
 * Reports rather than gates. A CI runner's timings say more about the runner
 * than the site, so failing a build on them would be noise — but "295KB of
 * JavaScript" was a number nobody had until it was measured, and the same is
 * true of everything below.
 *
 * Uses the Playwright browser the end-to-end suite already installs, so there
 * is no Lighthouse dependency to carry for a number read once a release.
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3210";

const PAGES = [
  ["homepage", "/en"],
  ["homepage (ar)", "/ar"],
  ["service catalogue", "/en/app/services"],
  ["a service", "/en/app/services/police-clearance-certificate"],
  ["a data table", "/en/app/home/information/view-black-points-traffic-violations"],
];

const kb = (bytes) => (bytes / 1024).toFixed(0).padStart(5) + " KB";
const ms = (n) => (n === null ? "    —" : String(Math.round(n)).padStart(5) + " ms");

const browser = await chromium.launch({ channel: "chromium" });
const rows = [];

for (const [name, path] of PAGES) {
  const context = await browser.newContext();
  const page = await context.newPage();

  // Transfer size as the wire sees it, which is what a phone on mobile data
  // actually pays for — not the uncompressed bundle size.
  let js = 0;
  let css = 0;
  let img = 0;
  let total = 0;
  // sizes() reports what actually crossed the wire. content-length is absent
  // on every chunked response Next sends, which silently reported the whole
  // JavaScript bundle as 0 KB the first time this ran.
  page.on("requestfinished", async (req) => {
    try {
      const res = await req.response();
      if (!res) return;
      const len = (await req.sizes()).responseBodySize ?? 0;
      if (!len) return;
      total += len;
      const type = req.resourceType();
      if (type === "script") js += len;
      else if (type === "stylesheet") css += len;
      else if (type === "image") img += len;
    } catch {
      // A response that went away before it could be read is not worth failing
      // a measurement over.
    }
  });

  await page.goto(BASE + path, { waitUntil: "load" });

  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const out = { lcp: null, cls: 0, ttfb: null, fcp: null };
        const nav = performance.getEntriesByType("navigation")[0];
        if (nav) out.ttfb = nav.responseStart;
        const fcp = performance
          .getEntriesByType("paint")
          .find((e) => e.name === "first-contentful-paint");
        if (fcp) out.fcp = fcp.startTime;

        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) out.lcp = e.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });

        new PerformanceObserver((list) => {
          for (const e of list.getEntries())
            if (!e.hadRecentInput) out.cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });

        // Long enough for the carousel's first transition, which is where a
        // shift would show up if one were going to.
        setTimeout(() => resolve(out), 3000);
      }),
  );

  rows.push({ name, ...vitals, js, css, img, total });
  await context.close();
}

await browser.close();

console.log(
  "\n  page                    TTFB      FCP      LCP    CLS       JS      CSS    images    total",
);
console.log("  " + "-".repeat(94));
for (const r of rows)
  console.log(
    `  ${r.name.padEnd(20)}${ms(r.ttfb)}${ms(r.fcp)}${ms(r.lcp)}  ${r.cls.toFixed(3)}  ${kb(r.js)} ${kb(r.css)} ${kb(r.img)} ${kb(r.total)}`,
  );

// The thresholds Google calls "good". Printed, not enforced.
console.log(
  "\n  good: LCP under 2500ms, CLS under 0.1, FCP under 1800ms" +
    "\n  (local numbers flatter a real deployment — no network latency here)\n",
);
