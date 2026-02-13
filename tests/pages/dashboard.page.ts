import { expect, type Page } from "@playwright/test";

export async function expectDashboardPage(page: Page) {
  await expect(page.url().includes("/dashboard")).toBeTruthy();
}
