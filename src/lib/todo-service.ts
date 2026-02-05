import type { RecordModel } from "pocketbase";
import { pb, getCurrentUser } from "./pocketbase";

export async function hasAnyTodoLists(): Promise<boolean> {
  try {
    const lists = await pb
      .collection("todo_lists")
      .getFullList(1, { filter: `owner="${getCurrentUser()?.id}"` });
    return lists.length > 0;
  } catch (err) {
    return false;
  }
}

export async function getTodoLists(): Promise<TodoListRecord[]> {
  return pb
    .collection("todo_lists")
    .getFullList(200, { filter: `owner="${getCurrentUser()?.id}"` });
}

export async function createTodoList(title: string): Promise<TodoListRecord> {
  return pb.collection("todo_lists").create({
    title,
    owner: getCurrentUser()?.id,
  });
}

export async function ensureUserHasTodoList(
  preferredListId: string | null = null,
): Promise<TodoListRecord> {
  const lists = await getTodoLists();
  if (lists.length === 0) return await createTodoList("My Todos");

  if (preferredListId) {
    const preferredList = lists.find((list) => list.id === preferredListId);
    if (preferredList) {
      return preferredList;
    }
  }

  return lists[0];
}

export async function getTodosForList(listId: string): Promise<TodoRecord[]> {
  return pb.collection("todos").getFullList(-1, { filter: `list="${listId}"` });
}

export async function createTodo(
  title: string,
  listId: string,
): Promise<TodoRecord> {
  return pb.collection("todos").create({
    title,
    completed: false,
    list: listId,
  });
}

export async function updateTodo(todo: TodoRecord): Promise<TodoRecord> {
  return pb.collection("todos").update(todo.id, todo);
}

export async function deleteTodo(todoId: string): Promise<void> {
  await pb.collection("todos").delete(todoId);
}

export interface TodoListRecord extends RecordModel {
  title: string;
  owner: string;
}

export interface TodoRecord extends RecordModel {
  title: string;
  completed: boolean;
  list: string;
}
