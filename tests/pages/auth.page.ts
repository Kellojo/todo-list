import { expect, type Page } from "@playwright/test";
import { user } from "../data/user";
import { sleep } from "./test-utility";

export async function expectAuthPage(page: Page) {
  await expect(page.url().includes("/auth")).toBeTruthy();
}

export async function switchToRegister(page: Page) {
  await page.getByTestId("switchToRegister").click();
}

export async function fillSignUpForm(page: Page) {
  await page.getByTestId("email").fill(user.email);
  await page.getByTestId("password").fill(user.password);
  await page.getByTestId("passwordConfirm").fill(user.password);
}

export async function fillLoginForm(page: Page) {
  await page.getByTestId("email").fill(user.email);
  await page.getByTestId("password").fill(user.password);
}

export async function submitForm(page: Page) {
  await sleep(500); // Wait for any potential UI updates before clicking submit
  await page.getByTestId("submitLoginButton").click();
}
