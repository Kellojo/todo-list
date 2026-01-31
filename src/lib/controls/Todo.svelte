<script lang="ts">
  import { updateTodo, type TodoRecord } from "$lib/todo-service";
  import Checkbox from "./Checkbox.svelte";

  let { item, title, completed = $bindable<boolean>() } = $props();

  function change(event: Event) {
    const itemCopy: TodoRecord = { ...item };
    itemCopy.completed = (event.target as HTMLInputElement).checked;
    completed = itemCopy.completed;
    updateTodo(itemCopy);
  }
</script>

<div class="item">
  <Checkbox {completed} onchange={change} />
  <span class:completed>{title}</span>
</div>

<style>
  .item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 1rem;

    border: 1px solid var(--borderColor);
    border-radius: 2rem;
    box-shadow: var(--shadow-s);

    background-color: var(--backgroundLight);
  }

  .completed {
    text-decoration: line-through;
    color: var(--secondaryText);
  }

  span {
    font-size: 1.125rem;
    flex-grow: 1;
    padding: 0.5rem;
  }
</style>
