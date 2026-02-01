<script lang="ts">
  import { ensureAuthenticated } from "$lib/pocketbase";
  import { onMount } from "svelte";
  import Avatar from "$lib/controls/Avatar.svelte";
  import {
    createTodo,
    ensureUserHasTodoList,
    getTodosForList,
    type TodoListRecord,
  } from "$lib/todo-service";
  import type { RecordModel } from "pocketbase";
  import Todo from "$lib/controls/Todo.svelte";
  import Input from "$lib/controls/Input.svelte";

  let loading = $state(true);
  let currentList: TodoListRecord | null = $state(null);
  let todoItems: RecordModel[] = $state([]);
  let subtitle: string = $derived.by(() => formatSubtitle(todoItems));

  onMount(async () => {
    await ensureAuthenticated();
    currentList = await ensureUserHasTodoList();
    todoItems = await getTodosForList(currentList.id);

    loading = false;
  });

  async function onCreateNewTodo(event: Event) {
    console.log("Creating new todo...");
    const inputElement = event.target as HTMLInputElement;
    const title = inputElement.value.trim();
    if (title.length === 0) return;

    try {
      const newTodo = await createTodo(title, currentList!.id);
      todoItems = [...todoItems, newTodo];

      inputElement.value = "";
    } catch (error) {
      console.error("Error creating todo:", error);
      return;
    }
  }

  function onTodoUpdated(updatedItem: RecordModel) {
    todoItems = todoItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );
  }

  function onTodoDeleted(id: string) {
    todoItems = todoItems.filter((item) => item.id !== id);
  }

  function formatSubtitle(todoItems: RecordModel[]): string {
    const completedCount = todoItems.filter((item) => item.completed).length;
    const totalCount = todoItems.length;

    if (totalCount === 0) {
      return "No todos yet";
    }

    return `${completedCount} of ${totalCount} completed`;
  }
</script>

{#if !loading}
  <main>
    <nav>
      <div class="title-section">
        <h1>{currentList?.title}</h1>
        <div class="subtitle">{subtitle}</div>
      </div>

      <Avatar />
    </nav>

    <div class="list">
      {#each todoItems as item}
        <Todo
          {item}
          title={item.title}
          completed={item.completed}
          onDeleted={onTodoDeleted}
          onUpdated={onTodoUpdated}
        />
      {/each}
    </div>

    <Input
      class="create-todo"
      placeholder="Add new todo..."
      value={""}
      onsubmit={onCreateNewTodo}
    />
  </main>
{/if}

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: calc(100vh - 4rem);

    padding: 2rem;
    margin: 2rem auto;
    box-sizing: border-box;
    max-width: 850px;

    border-radius: 1.5rem;
    background: var(--background);
    backdrop-filter: blur(1.25rem);
    box-shadow: var(--shadow-l);
    border: 1px solid var(--borderColor);
    width: 100%;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: start;
  }

  .title-section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .subtitle {
    color: var(--secondaryText);
  }

  h1 {
    margin: 0;
  }

  :global(.create-todo) {
    background-color: var(--backgroundTransparent) !important;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
