import { test, expect } from "@playwright/test";
import {
  expectAuthPage,
  fillLoginForm,
  fillSignUpForm,
  loginAs,
  submitForm,
  switchToRegister,
} from "./pages/auth.page";
import { expectDashboardPage, logout } from "./pages/dashboard.page";
import { user, wrongUser } from "./data/user";
import { sleep } from "./pages/test-utility";

test("Sign Up", async ({ page }) => {
  await page.goto("/auth");
  await page.waitForLoadState("networkidle");

  await switchToRegister(page);
  await fillSignUpForm(page, user);
  await submitForm(page);

  await expectDashboardPage(page);
});

test("Login & Logout", async ({ page }) => {
  await loginAs(page, user);

  await logout(page);
});

test("Login with wrong credentials", async ({ page }) => {
  await page.goto("/auth");
  await page.waitForLoadState("networkidle");

  await fillLoginForm(page, wrongUser);
  await submitForm(page);
  await sleep(1000);
  await expectAuthPage(page);
});
