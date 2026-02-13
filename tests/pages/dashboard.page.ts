import { expect, type Page } from "@playwright/test";

export async function expectDashboardPage(page: Page) {
  await expect(page).toHaveURL(/.*\/dashboard/);
}
