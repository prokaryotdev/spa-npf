import { expect, test, type Page } from "@playwright/test";

/**
 * The journeys the site exists for, end to end across both sides of the
 * house: a crime reported by the public lands on the right command's board,
 * only that command's units can be sent, the reporter's tracker follows it,
 * and a transfer moves it. Plus a service application from start to finish.
 */

async function reportTheft(page: Page) {
  await page.goto("/en/app/report");
  const next = () =>
    page.getByRole("button", { name: /^(Continue|Send report)/ }).click();

  // Each step refuses to move on until it is answered.
  await next();
  await expect(page.getByText("Tell us whether anyone is in danger.")).toBeVisible();
  await page.getByText("No, everyone is safe").click();
  await next();

  await page.getByText("Theft", { exact: true }).click();
  await page.getByText("It is happening now").click();
  await next();

  await page.getByLabel("State it happened in").selectOption("Kano");
  await page.getByLabel("Local Government Area").selectOption("Fagge");
  await page.getByLabel("Street, landmark or village").fill("Sabon Gari market");
  await expect(page.getByText("Kano State Command")).toBeVisible();
  await next();

  await page.getByLabel("What happened").fill(
    "My phone was taken from my stall by a man in a red cap.",
  );
  await page.getByText("No", { exact: true }).click();
  await next();

  await page.getByText("Report anonymously", { exact: true }).click();
  await next();

  await next();
  await expect(page.getByText("Confirm the report is true to send it.")).toBeVisible();
  await page.getByText("What I have written is true").click();
  await next();

  await expect(page.getByRole("heading", { name: "Report received" })).toBeVisible();
  return page.locator("p.select-all").innerText();
}

async function openDesk(page: Page, command: string) {
  // Sign out first: a signed-in visitor is sent straight on from sign-in.
  await page.evaluate(() => sessionStorage.removeItem("dp:session"));
  await page.goto("/en/app/signin");
  await page.locator("#desk").selectOption(command);
  await page.getByRole("button", { name: "Open the operations console" }).click();
  await expect(page).toHaveURL(/\/en\/app\/police$/);
}

test("a report reaches only its own command, and the tracker follows it", async ({
  page,
}) => {
  const ref = await reportTheft(page);
  expect(ref).toMatch(/^NPF-\d+$/);

  await page.goto(`/en/app/track?ref=${ref}`);
  await expect(page.getByText("Received by the command")).toBeVisible();

  // The Kano desk has it, and can only send Kano units.
  await openDesk(page, "Kano");
  await page.goto(`/en/app/police/incidents?call=${ref}`);
  const unit = page.getByLabel("Unit", { exact: true });
  await expect(unit.locator("option", { hasText: "Patrol 31" })).toHaveCount(1);
  await expect(unit.locator("option", { hasText: "Patrol 12" })).toHaveCount(0); // Lagos
  await unit.selectOption("Patrol 31");

  await page.goto(`/en/app/track?ref=${ref}`);
  await expect(page.getByText("Officers assigned").first()).toBeVisible();

  // A Lagos desk never sees it.
  await openDesk(page, "Lagos");
  await page.goto("/en/app/police/incidents");
  await expect(page.getByRole("button", { name: ref })).toHaveCount(0);
});

test("a call transferred across a state line goes back to pending there", async ({
  page,
}) => {
  const ref = await reportTheft(page);
  await openDesk(page, "");
  await page.goto(`/en/app/police/incidents?call=${ref}`);
  await page.getByLabel("Unit", { exact: true }).selectOption("Patrol 31");

  await page.getByText("Wrong command or division? Transfer the call").click();
  const form = page.locator("form", { hasText: "Transfer the call" });
  await form.getByLabel("State").selectOption("Lagos");
  await form.getByLabel("Local Government Area").selectOption("Ikeja");
  await form.getByRole("button", { name: "Transfer", exact: true }).click();

  await expect(page.locator("dd", { hasText: "Lagos State Command" })).toBeVisible();
  await expect(page.locator("dd", { hasText: "Ikeja Division" })).toBeVisible();
  await expect(page.getByText("Unit stood down.")).toBeVisible();
});

test("a service application is routed and lands in the account", async ({
  page,
}) => {
  await page.goto("/en/app/services/report-lost-item");
  await page.locator("main").getByRole("link", { name: "Sign in to continue" }).first().click();
  await page.getByRole("button", { name: "Continue with NINAuth" }).click();
  await expect(page).toHaveURL(/\/apply$/);

  const next = () =>
    page.getByRole("button", { name: /^(Continue|Send application)/ }).click();
  await page.getByLabel("State you live in").selectOption("Lagos");
  await page.getByLabel("Local Government Area").selectOption("Ikeja");
  await page.getByLabel("Your address").fill("14 Allen Avenue, Ikeja");
  await next();
  await page.getByLabel("What do you need it for?").fill(
    "Lost my wallet with my driving licence at the bus stop",
  );
  await next();
  await next();
  await page.getByText("The information and documents").click();
  await next();

  await expect(page.getByRole("heading", { name: "Application sent" })).toBeVisible();
  await page.goto("/en/app/portal/requests");
  await expect(page.getByText("Lagos State Command · Ikeja Division").first()).toBeVisible();
});
