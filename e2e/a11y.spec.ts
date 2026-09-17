import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * WCAG 2.1 A and AA, on every kind of page, in both languages.
 *
 * Counting aria-labels in the source told us they existed, not that they were
 * right, and a wrong label is worse than none. This runs the rules a real
 * audit would: contrast, names, roles, landmarks, heading order, and the
 * things that only break in right-to-left.
 *
 * A government service is held to this standard, so a violation is a failure
 * rather than a warning.
 */

/** One of each shape of page, not one of each page. */
const PAGES = [
  ["the homepage", "/"],
  ["the service catalogue", "/app/services"],
  ["a service", "/app/services/police-clearance-certificate"],
  ["a data table", "/app/home/information/traffic-offences-and-penalties"],
  ["a legal document", "/app/home/privacy-policy"],
  ["search results", "/app/search?q=certificate"],
  ["sign in", "/app/signin"],
  ["contact", "/app/home/contactUs"],
  ["the site map", "/app/home/sitemap"],
] as const;

/**
 * The reveal animation fades content up from opacity 0 as it enters view, and
 * axe would otherwise measure a half-transparent element and report a contrast
 * failure that no reader ever sees. Reduced motion pins every element at its
 * settled colour — which is also exactly what a reduced-motion visitor gets.
 */
test.use({ reducedMotion: "reduce" });

const scan = (page: import("@playwright/test").Page) =>
  new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

/** Readable in the terminal: rule, impact, and the element to go and look at. */
const describe = (results: Awaited<ReturnType<typeof scan>>) =>
  results.violations
    .map(
      (v) =>
        `\n[${v.impact}] ${v.id} — ${v.help}\n  ${v.helpUrl}\n` +
        v.nodes
          .slice(0, 4)
          .map((n) => `    ${n.target.join(" ")}\n      ${n.failureSummary?.split("\n").join("\n      ")}`)
          .join("\n") +
        (v.nodes.length > 4 ? `\n    … and ${v.nodes.length - 4} more` : ""),
    )
    .join("\n");

for (const lang of ["en", "ha"] as const) {
  test.describe(`accessibility (${lang})`, () => {
    for (const [name, path] of PAGES) {
      test(`${name} has no WCAG violations`, async ({ page }) => {
        await page.goto(`/${lang}${path === "/" ? "" : path}`);
        // The catalogue and the tables render their rows on the client.
        await page.waitForLoadState("networkidle");
        const results = await scan(page);
        expect(describe(results), describe(results)).toBe("");
      });
    }
  });
}

test.describe("keyboard", () => {
  test("the skip link is the first stop and it works", async ({ page }) => {
    await page.goto("/en");
    await page.keyboard.press("Tab");
    const skip = page.locator(":focus");
    await expect(skip).toHaveAttribute("href", "#main-content");
    await skip.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("the service catalogue can be filtered without a mouse", async ({
    page,
  }) => {
    await page.goto("/en/app/services");
    const search = page.getByLabel(/Search services/i);
    await search.focus();
    await search.fill("certificate");
    // Tabbing on from the field must reach something, not fall out of the page.
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();
  });
});
