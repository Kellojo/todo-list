<script lang="ts">
  import { ensureAuthenticated } from "$lib/pocketbase";
  import { onMount } from "svelte";
  import Avatar from "$lib/controls/Avatar.svelte";
  import {
    ensureUserHasTodoList,
    getTodosForList,
    type TodoListRecord,
  } from "$lib/todo-service";
  import type { RecordModel } from "pocketbase";
  import Todo from "$lib/controls/Todo.svelte";

  let loading = $state(true);
  let currentList: TodoListRecord | null = $state(null);
  let todoItems: RecordModel[] = $state([]);

  onMount(async () => {
    await ensureAuthenticated();
    currentList = await ensureUserHasTodoList();
    todoItems = await getTodosForList(currentList.id);

    loading = false;
  });
</script>

{#if !loading}
  <main>
    <nav>
      <div class="title-section">
        <h1>{currentList?.title}</h1>
        <div>{todoItems.length} Item{todoItems.length !== 1 ? "s" : ""}</div>
      </div>

      <Avatar />
    </nav>

    <div class="list">
      {#each todoItems as item}
        <Todo {item} title={item.title} completed={item.completed} />
      {/each}
    </div>
  </main>
{/if}

<style>
  main {
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

  h1 {
    margin: 0;
  }

  .list {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
