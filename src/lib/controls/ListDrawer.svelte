<script lang="ts">
  import {
    createTodoList,
    getTodoLists,
    updateTodoList,
    deleteTodoList,
    type TodoListRecord,
  } from "$lib/todo-service";
  import { onDestroy, onMount } from "svelte";
  import Button from "./Button.svelte";
  import { pb } from "$lib/pocketbase";
  import TodoListNameDialog from "./TodoListNameDialog.svelte";

  let lists: TodoListRecord[] = $state([]);
  let {
    open = $bindable<boolean>(false),
    listSelected,
    selectedListId = $bindable<string | null>(null),
  } = $props();

  let newListName = $state("");
  let todoListNameDialogOpen = $state(false);
  let editingListId: string | null = null;

  onMount(async () => {
    try {
      lists = await getTodoLists();

      pb.collection("todo_lists").subscribe(`*`, async (e) => {
        if (e.action === "create") {
          lists = [...lists, e.record as TodoListRecord];
        } else if (e.action === "update") {
          lists = lists.map((list) =>
            list.id === e.record.id ? (e.record as TodoListRecord) : list,
          );
        } else if (e.action === "delete") {
          lists = lists.filter((list) => list.id !== e.record.id);
        }
      });
    } catch (error) {}
  });

  onDestroy(() => {
    pb.collection("todo_lists").unsubscribe();
  });

  let drawerElement: HTMLDivElement | null = null;

  export function focus() {
    drawerElement?.focus();
  }

  function onClose() {
    open = false;
  }

  async function onSelectList(list: TodoListRecord) {
    listSelected?.(list);
    await new Promise((resolve) => setTimeout(resolve, 100));
    open = false;
  }

  function onCreateList() {
    newListName = "";
    todoListNameDialogOpen = true;
  }

  async function onListNameSubmit(name: string) {
    try {
      if (editingListId) {
        await updateTodoList(editingListId, name);
        editingListId = null;
      } else {
        await createTodoList(name);
      }
    } catch (error) {
      console.error("Failed to save todo list:", error);
    } finally {
      todoListNameDialogOpen = false;
    }
  }

  async function onEditList(list: TodoListRecord) {
    editingListId = list.id;
    newListName = list.title;
    todoListNameDialogOpen = true;
  }

  async function onDeleteList(list: TodoListRecord) {
    try {
      if (!confirm(`Delete list "${list.title}"?`)) return;

      await deleteTodoList(list.id);
    } catch (error) {
      console.error("Failed to delete todo list:", error);
    }
  }
</script>

<div class="drawer" class:opened={open} tabindex="-1" bind:this={drawerElement}>
  <h1 class="title">
    Lists
    <Button
      icon="material-symbols:close-rounded"
      press={onClose}
      appearance="transparent"
    />
  </h1>

  {#each lists as list}
    <div class="list-row">
      <Button
        text={list.title}
        press={() => onSelectList(list)}
        selected={list.id === selectedListId}
        textAlign="start"
        flexGrow={true}
      />

      <div class="row-actions">
        <Button
          icon="material-symbols:edit-outline"
          press={() => onEditList(list)}
          appearance="default"
        />
        <Button
          icon="material-symbols:delete-outline"
          press={() => onDeleteList(list)}
          appearance="error"
        />
      </div>
    </div>
  {/each}

  <Button
    text="Create New List"
    icon="material-symbols:add-rounded"
    press={onCreateList}
    textAlign="start"
  />
</div>

<TodoListNameDialog
  bind:open={todoListNameDialogOpen}
  bind:name={newListName}
  onSubmit={onListNameSubmit}
/>

<style>
  .drawer {
    position: absolute;
    top: 0;
    left: -414px;
    bottom: 0;

    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--background);
    backdrop-filter: blur(2rem);
    padding: 2rem;
    border-radius: 1.5rem 0 0 1.5rem;

    border-right: 2px solid var(--borderColor);
    width: 350px;
    transition:
      left 0.3s,
      opacity 0.2s;
    box-shadow: var(--shadow-l);
    opacity: 0;
  }

  .opened {
    left: 0;
    opacity: 1;
  }

  .title {
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    gap: 0.5rem;
    margin: 0;
  }

  .list-row {
    display: flex;
    align-items: center;
    gap: 0;
    overflow: hidden;
    transition: gap 0.2s;

    :global(.button) {
      flex-grow: 1;
    }
  }

  .list-row:hover,
  .list-row:focus-within {
    gap: 0.5rem;

    .row-actions {
      width: 88px;
    }
  }

  .row-actions {
    width: 0;
    gap: 0.25rem;
    transition: width 0.2s;
    margin-left: auto;
    display: flex;
  }
</style>
