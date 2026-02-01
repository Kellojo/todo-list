<script lang="ts">
  import {
    createTodoList,
    getTodoLists,
    type TodoListRecord,
  } from "$lib/todo-service";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import Button from "./Button.svelte";

  let lists: TodoListRecord[] = $state([]);
  let {
    open = $bindable<boolean>(false),
    listSelected,
    selectedListId = $bindable<string | null>(null),
  } = $props();

  onMount(async () => {
    try {
      lists = await getTodoLists();
    } catch (error) {}
  });

  function onClose() {
    open = false;
  }

  function onSelectList(list: TodoListRecord) {
    listSelected?.(list);
    open = false;
  }

  async function onCreateList() {
    try {
      const list = await createTodoList("New List");
      lists = [...lists, list];
    } catch (error) {
      console.error("Error creating new list:", error);
      return;
    }
  }
</script>

<div class="drawer" class:opened={open}>
  <h1 class="title">
    Lists
    <div role="button" tabindex="0" onclick={onClose} onkeydown={onClose}>
      <Icon icon="material-symbols:close-rounded" />
    </div>
  </h1>

  {#each lists as list}
    <Button
      text={list.title}
      press={() => onSelectList(list)}
      selected={list.id === selectedListId}
      textAlign="start"
    />
  {/each}

  <Button
    text="Create New List"
    icon="material-symbols:add-rounded"
    press={onCreateList}
    textAlign="start"
  />
</div>

<style>
  .drawer {
    position: absolute;
    top: 0;
    left: -316px;
    bottom: 0;

    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--background);
    backdrop-filter: blur(2rem);
    padding: 2rem;
    border-radius: 1.5rem 0 0 1.5rem;

    border-right: 2px solid var(--borderColor);
    width: 250px;
    transition: left 0.2s;
    box-shadow: var(--shadow-l);
  }

  .opened {
    left: 0;
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
</style>
