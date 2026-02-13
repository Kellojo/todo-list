import { test, expect } from "@playwright/test";
import {
  fillLoginForm,
  fillSignUpForm,
  submitForm,
  switchToRegister,
} from "./pages/auth.page";
import { expectDashboardPage } from "./pages/dashboard.page";

test("Sign Up", async ({ page }) => {
  await page.goto("http://localhost:5173/auth");
  await page.waitForLoadState("networkidle");

  await switchToRegister(page);
  await fillSignUpForm(page);
  await submitForm(page);

  await expectDashboardPage(page);
});

test("Login", async ({ page }) => {
  await page.goto("http://localhost:5173/auth");
  await page.waitForLoadState("networkidle");

  await fillLoginForm(page);
  await submitForm(page);
  await expectDashboardPage(page);
});
