import { expect, type Page } from "@playwright/test";
import { sleep } from "./test-utility";

export async function expectDashboardPage(page: Page) {
  await expect(page).toHaveURL(/.*\/dashboard/);
}

export async function logout(page: Page) {
  await page.getByTestId("my-avatar").click();
  await page.getByTestId("logout-button").click();
}

export async function createTodo(page: Page, todoText: string) {
  const input = page.getByTestId("new-todo-input");
  await input.fill(todoText);
  await input.press("Enter");

  await expectTodoToBeInList(page, todoText);
  await sleep(100);
}

async function getTodoItemByText(page: Page, todoText: string) {
  return page.getByTestId("todo-item").filter({ hasText: todoText }).first();
}

export async function expectTodoToBeInList(page: Page, todoText: string) {
  await expect(await getTodoItemByText(page, todoText)).toBeVisible();
}

export async function expectTodoToNotBeInList(page: Page, todoText: string) {
  await expect(await getTodoItemByText(page, todoText)).not.toBeVisible();
}

export async function deleteTodo(page: Page, todoText: string) {
  const todoItem = await getTodoItemByText(page, todoText);
  await todoItem.hover();
  await todoItem.getByTestId("todo-delete-button").click();
  await expectTodoToNotBeInList(page, todoText);
  await sleep(100);
}

export async function completeTodo(page: Page, todoText: string) {
  const todoItem = await getTodoItemByText(page, todoText);
  const checkbox = todoItem.getByTestId("todo-checkbox");
  await checkbox.check();
  await sleep(1000);
  await expect(checkbox).toBeChecked();
}

export async function uncompleteTodo(page: Page, todoText: string) {
  const todoItem = await getTodoItemByText(page, todoText);
  const checkbox = todoItem.getByTestId("todo-checkbox");
  await checkbox.uncheck();
  await sleep(1000);
  await expect(checkbox).not.toBeChecked();
}
