import { expect, test } from "@playwright/test";

/**
 * The phone. Every screenshot taken while building this site was 1366px wide,
 * so the breakpoints were written but never looked at — and a police site is
 * something people open on a phone, often in a hurry.
 *
 * These run under the mobile projects in playwright.config.ts, so the viewport
 * and the touch flags come from the device, not from here.
 */

const PAGES = [
  ["the homepage", "/"],
  ["the service catalogue", "/app/services"],
  ["a service", "/app/services/police-clearance-certificate"],
  ["a data table", "/app/home/information/road-speed-limits"],
  ["sign in", "/app/signin"],
] as const;

for (const lang of ["en", "ha"] as const) {
  for (const [name, path] of PAGES) {
    test(`${name} does not scroll sideways (${lang})`, async ({ page }) => {
      await page.goto(`/${lang}${path === "/" ? "" : path}`);
      await page.waitForLoadState("networkidle");

      // A page wider than its viewport is the classic phone bug: a stray fixed
      // width, a table, or a heading that will not wrap.
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          // Name the widest offender so the failure says where to look.
          culprits: [...document.querySelectorAll<HTMLElement>("body *")]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.width > doc.clientWidth + 1 && r.height > 0;
            })
            .slice(0, 5)
            .map(
              (el) =>
                `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} ` +
                `(${Math.round(el.getBoundingClientRect().width)}px)`,
            ),
        };
      });

      expect(
        overflow.scrollWidth,
        `page is ${overflow.scrollWidth}px in a ${overflow.clientWidth}px viewport. ` +
          `Widest: ${overflow.culprits.join(", ") || "none identified"}`,
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);
    });
  }
}

test("the menu opens, traps nothing, and closes", async ({ page }) => {
  await page.goto("/en");
  const toggle = page.getByRole("button", { name: /menu/i }).first();
  await expect(toggle).toBeVisible();
  await toggle.click();

  // Something navigable must appear, or the phone has no navigation at all.
  const drawerLink = page.getByRole("link", { name: "Services", exact: true }).first();
  await expect(drawerLink).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(drawerLink).toBeHidden();
});

test("tap targets on the homepage are big enough to hit", async ({ page }) => {
  await page.goto("/en");
  await page.waitForLoadState("networkidle");

  // WCAG 2.5.5 asks for 44x44; 24x24 is the 2.2 AA floor. Anything under 24 is
  // a thumb missing a link, which on a police site means missing a service.
  const small = await page.evaluate(() => {
    const out: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    )) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue; // hidden
      // The skip link is deliberately clipped to 1x1 until it is focused, at
      // which point it is a full-size control. Measuring it at rest is
      // measuring the wrong state.
      if (el.className.toString().includes("sr-only")) continue;
      if (r.width < 24 || r.height < 24)
        out.push(
          `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 30)}" ` +
            `${Math.round(r.width)}x${Math.round(r.height)}`,
        );
    }
    return [...new Set(out)];
  });

  expect(small, `too small to tap:\n  ${small.join("\n  ")}`).toEqual([]);
});
