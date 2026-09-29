import { expect, type Page } from "@playwright/test";

/**
 * Signs in as the demo citizen through the real form, so a test of the
 * portal also proves the way in. Always the English form: the session lives
 * in the tab, not the language, and the labels are only matched in English.
 */
export async function signIn(page: Page) {
  await page.goto("/en/app/signin");
  await page.getByLabel(/NIN/i).fill("12345678901");
  await page.getByLabel(/Password/i).fill("a-password-8-plus");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/app\/portal$/);
}

/** Every portal page, for the specs that walk them all. */
export const PORTAL_PAGES = [
  ["the portal overview", "/app/portal"],
  ["my requests", "/app/portal/requests"],
  ["fines", "/app/portal/fines"],
  ["documents", "/app/portal/documents"],
  ["profile", "/app/portal/profile"],
] as const;
