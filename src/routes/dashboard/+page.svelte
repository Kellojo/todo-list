<script lang="ts">
  import { ensureAuthenticated, pb } from "$lib/pocketbase";
  import { onDestroy, onMount } from "svelte";
  import Avatar from "$lib/controls/Avatar.svelte";
  import {
    createTodo,
    ensureUserHasTodoList,
    getTodosForList,
    type TodoListRecord,
    type TodoRecord,
  } from "$lib/todo-service";
  import type { RecordModel } from "pocketbase";
  import Todo from "$lib/controls/Todo.svelte";
  import Input from "$lib/controls/Input.svelte";
  import ListDrawer from "$lib/controls/ListDrawer.svelte";
  import { goto } from "$app/navigation";
  import MainContent from "$lib/controls/MainContent.svelte";
  import { flip } from "svelte/animate";
  import { send, receive } from "$lib/controls/transitions";

  let loading = $state(true);
  let currentList: TodoListRecord | null = $state(null);
  let todoItems: TodoRecord[] = $state([]);
  let subtitle: string = $derived.by(() => formatSubtitle(todoItems));
  let drawerOpen = $state(false);
  let listDrawerElement: ListDrawer | null = $state(null);

  onMount(async () => {
    await ensureAuthenticated();
    const urlParams = new URLSearchParams(window.location.search);
    const listId = urlParams.get("list");
    await setList(listId);

    loading = false;
  });

  onDestroy(() => {
    pb.collection("todos").unsubscribe();
  });

  async function onCreateNewTodo(event: Event) {
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

  function toggleDrawer() {
    drawerOpen = !drawerOpen;
    if (drawerOpen) {
      listDrawerElement?.focus?.();
    }
  }

  async function onListSelected(list: TodoListRecord) {
    setList(list.id);
  }

  async function setList(listId: string | null) {
    currentList = await ensureUserHasTodoList(listId);
    todoItems = await getTodosForList(currentList.id);

    pb.collection("todos").unsubscribe();
    pb.collection("todos").subscribe(`*`, async (e) => {
      if (e.record.list !== currentList!.id) return;
      todoItems = await getTodosForList(currentList!.id);
    });

    goto("/dashboard?list=" + currentList.id, { replaceState: true });
  }
</script>

{#snippet content()}
  {#if !loading}
    <div class="main-page" class:drawer-open={drawerOpen}>
      <nav>
        <div
          class="title-section"
          onclick={toggleDrawer}
          onkeydown={(evt) => {
            if (evt.key === "Enter" || evt.key === " ") {
              toggleDrawer();
            }
          }}
          role="button"
          tabindex="0"
        >
          <h1 class="title">
            {currentList?.title}
          </h1>
          <div class="subtitle">{subtitle}</div>
        </div>

        <Avatar />
      </nav>

      <div class="list">
        <Input
          id="new-todo-input"
          class="create-todo"
          placeholder="Add new todo..."
          value={""}
          onsubmit={onCreateNewTodo}
        />

        {#each todoItems as item (item.id)}
          <div
            animate:flip={{ duration: 200 }}
            in:receive={{ key: item.id }}
            out:send={{ key: item.id }}
          >
            <Todo
              {item}
              title={item.title}
              completed={item.completed}
              onDeleted={onTodoDeleted}
            />
          </div>
        {/each}
      </div>
    </div>
    <ListDrawer
      bind:this={listDrawerElement}
      bind:open={drawerOpen}
      listSelected={onListSelected}
      selectedListId={currentList?.id}
    />
  {/if}
{/snippet}

<MainContent
  maxWidth={"min(var(--contentMaxWidth), calc(100% - 2rem))"}
  {content}
></MainContent>

<style>
  .main-page {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    opacity: 1;
    transition: opacity 0.2s;
  }

  @media (max-width: 768px) {
    .main-page {
      margin-bottom: 4rem;
    }
  }

  .drawer-open {
    opacity: 0.5;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: start;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .title-section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    outline: none;
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
