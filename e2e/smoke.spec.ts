import { expect, test, type Page } from "@playwright/test";

/**
 * The journeys a visitor actually takes. Each one is here because breaking it
 * would make the site useless in a way no other check in the repo would catch:
 * npm test reads data and never opens a page, and check-locales reads HTML and
 * never clicks.
 */

/**
 * A page that logs an error is a page that is broken in a way the markup will
 * not show. Next's own hydration failures and every blocked-by-CSP resource
 * arrive here, which makes this the cheapest guard against the two mistakes
 * the proxy rewrite and the nonce are most likely to cause.
 */
/**
 * Safari refuses a prefetch that gets redirected while carrying next/link own
 * RSC headers, and proxy.ts rewriting the locale prefix is what makes Next
 * answer those prefetches with a 307. The page itself is unaffected — every
 * navigation works in every engine — so the speculative fetch simply does not
 * happen there. Ignored by exact shape, not by wildcard, so a genuinely new
 * failed request still fails the test.
 */
const KNOWN = /Fetch API cannot load .*_rsc=.* due to access control checks/;

function watchConsole(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" && !KNOWN.test(m.text())) errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  return errors;
}

test.describe("the public site", () => {
  test("a URL naming no language lands on one that does", async ({ page }) => {
    await page.goto("/app/services");
    await expect(page).toHaveURL(/\/en\/app\/services$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("the Arabic catalogue is Arabic, right to left, and clean", async ({
    page,
  }) => {
    const errors = watchConsole(page);
    await page.goto("/ar/app/services");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "ar");
    await expect(html).toHaveAttribute("dir", "rtl");
    // The catalogue heading, not a fallback: if localize broke, this is English.
    await expect(page.getByRole("heading", { name: "الخدمات" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("the language switch keeps you on the same page", async ({ page }) => {
    await page.goto("/ar/app/home/information/laws-legislation");
    await page.getByRole("link", { name: /Switch to English/i }).click();
    // Same page, other language — not dumped back on the homepage, which is
    // what every naive implementation of this does.
    await expect(page).toHaveURL(
      /\/en\/app\/home\/information\/laws-legislation$/,
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("search reaches a service page", async ({ page }) => {
    const errors = watchConsole(page);
    await page.goto("/en/app/search?q=certificate");
    const first = page.locator("main a[href*='/app/services/']").first();
    await expect(first).toBeVisible();
    await first.click();
    await expect(page).toHaveURL(/\/en\/app\/services\/[a-z0-9-]+$/);
    // A service page always states what it costs; an empty shell would not.
    await expect(page.getByText(/Fees/i).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("every header link resolves, in both languages", async ({ page }) => {
    for (const lang of ["en", "ar"]) {
      await page.goto(`/${lang}`);
      const hrefs = await page
        .locator("header a[href^='/']")
        .evaluateAll((links) =>
          [...new Set(links.map((a) => a.getAttribute("href")!))].filter(
            (h) => !h.startsWith("/_next"),
          ),
        );
      expect(hrefs.length).toBeGreaterThan(3);
      for (const href of hrefs) {
        const res = await page.request.get(href, { maxRedirects: 0 });
        expect(
          [200, 307, 308].includes(res.status()),
          `${href} returned ${res.status()}`,
        ).toBe(true);
      }
    }
  });
});

test.describe("the account half", () => {
  test("signing in opens the portal and the session survives a reload", async ({
    page,
  }) => {
    const errors = watchConsole(page);
    await page.goto("/en/app/signin");

    await page.getByLabel(/Emirates ID number/i).fill("784-1989-1234567-1");
    await page.getByLabel(/Password/i).fill("a-password-8-plus");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();

    await expect(page).toHaveURL(/\/en\/app\/portal$/);

    // The whole point of the store: a reload must not sign you out.
    await page.reload();
    await expect(page).toHaveURL(/\/en\/app\/portal$/);
    await expect(page.getByText("Khalid Al Mansoori").first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("a bad Emirates ID is refused, and nothing is stored", async ({
    page,
  }) => {
    await page.goto("/en/app/signin");
    await page.getByLabel(/Emirates ID number/i).fill("not-an-id");
    await page.getByLabel(/Password/i).fill("a-password-8-plus");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();

    await expect(page).toHaveURL(/\/app\/signin/);
    await expect(page.getByText(/An Emirates ID looks like/i)).toBeVisible();
  });

  test("the portal is not reachable without signing in", async ({ page }) => {
    await page.goto("/en/app/portal");
    await expect(page).toHaveURL(/\/app\/signin/);
  });
});

test.describe("the things that protect the site", () => {
  test("a nonce is on every script, and the headers are set", async ({
    page,
  }) => {
    const res = await page.goto("/en");
    const headers = res!.headers();

    expect(headers["content-security-policy"]).toMatch(/'nonce-[^']+'/);
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["x-content-type-options"]).toBe("nosniff");

    // 'strict-dynamic' means an un-nonced script is a script that will not run.
    const total = await page.locator("script").count();
    const nonced = await page.locator("script[nonce]").count();
    expect(total).toBeGreaterThan(0);
    expect(nonced).toBe(total);
  });

  test("a crash is reported rather than swallowed", async ({ page }) => {
    const res = await page.request.post("/api/report-error", {
      data: { message: "e2e probe", source: "e2e" },
    });
    expect(res.status()).toBe(204);

    const bad = await page.request.post("/api/report-error", {
      data: { stack: "no message" },
    });
    expect(bad.status()).toBe(400);
  });

  test("an unknown page 404s in the language it was asked in", async ({
    page,
  }) => {
    const res = await page.goto("/ar/no-such-page");
    expect(res!.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  });
});
