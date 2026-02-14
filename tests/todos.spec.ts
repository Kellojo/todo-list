import { test } from "@playwright/test";
import {
  completeTodo,
  createTodo,
  deleteTodo,
  expectDashboardPage,
  logout,
  uncompleteTodo,
} from "./pages/dashboard.page";
import { user } from "./data/user";
import { loginAs } from "./pages/auth.page";
import { todos } from "./data/todos";

test("Create & delete multiple Todos", async ({ page }) => {
  await loginAs(page, user);
  await expectDashboardPage(page);

  for (const todo of todos) {
    await createTodo(page, todo.text);
  }

  for (const todo of todos) {
    await deleteTodo(page, todo.text);
  }

  await logout(page);
});

test("Check/Uncheck Todo", async ({ page }) => {
  await loginAs(page, user);
  await expectDashboardPage(page);

  const todoText = todos[1].text;
  await createTodo(page, todoText);
  await completeTodo(page, todoText);
  await uncompleteTodo(page, todoText);

  await logout(page);
});
