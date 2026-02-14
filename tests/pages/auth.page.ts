import { expect, type Page } from "@playwright/test";
import { sleep } from "./test-utility";
import { expectDashboardPage } from "./dashboard.page";

export async function expectAuthPage(page: Page) {
  await expect(page).toHaveURL(/.*\/auth/);
}

export async function switchToRegister(page: Page) {
  await page.getByTestId("switchToRegister").click();
}

export async function fillSignUpForm(
  page: Page,
  user: { email: string; password: string },
) {
  await page.getByTestId("email").fill(user.email);
  await page.getByTestId("password").fill(user.password);
  await page.getByTestId("passwordConfirm").fill(user.password);
}

export async function fillLoginForm(
  page: Page,
  user: { email: string; password: string },
) {
  await page.getByTestId("email").fill(user.email);
  await page.getByTestId("password").fill(user.password);
}

export async function submitForm(page: Page) {
  await sleep(500); // Wait for any potential UI updates before clicking submit
  await page.getByTestId("submitLoginButton").click();
}

export async function loginAs(
  page: Page,
  user: { email: string; password: string },
) {
  await page.goto("/auth");
  await page.waitForLoadState("networkidle");

  await fillLoginForm(page, user);
  await submitForm(page);

  await expectDashboardPage(page);
}
