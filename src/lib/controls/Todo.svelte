<script lang="ts">
  import { updateTodo, deleteTodo, type TodoRecord } from "$lib/todo-service";
  import Checkbox from "./Checkbox.svelte";

  let {
    item,
    title,
    completed = $bindable<boolean>(),
    onDeleted = (id: string) => {},
    onUpdated = (item: TodoRecord) => {},
  } = $props();

  let titleChangeTimeout: number | undefined;
  let titleField: HTMLSpanElement | null = null;
  let deleteButton: HTMLButtonElement | null = null;

  function checkedChange(event: Event) {
    const itemCopy: TodoRecord = { ...item };
    itemCopy.completed = (event.target as HTMLInputElement).checked;
    completed = itemCopy.completed;
    updateTodo(itemCopy);
    onUpdated?.(itemCopy);
  }

  function titleChange(event: Event) {
    if (titleChangeTimeout) clearTimeout(titleChangeTimeout);

    const itemCopy: TodoRecord = { ...item };
    itemCopy.title = (event.target as HTMLElement).innerText;

    titleChangeTimeout = setTimeout(() => {
      updateTodo(itemCopy);
      onUpdated?.(itemCopy);
    }, 100);
  }

  async function onDeleteTodo() {
    try {
      await deleteTodo(item.id);
      onDeleted?.(item.id);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }
</script>

<div
  class="item"
  style="order: {completed ? 1 : 1}"
  role="button"
  tabindex="-1"
  onkeypress={(e) => {}}
  onclick={() => {
    if (
      document.activeElement === titleField ||
      document.activeElement === deleteButton
    )
      return;
    titleField?.focus();

    // Move cursor to end
    const range = document.createRange();
    range.selectNodeContents(titleField!);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }}
>
  <Checkbox {completed} onchange={checkedChange} />
  <span
    bind:this={titleField}
    class:completed
    contenteditable="true"
    spellcheck={!completed}
    oninput={titleChange}
  >
    {title}
  </span>
  <button bind:this={deleteButton} class="delete-btn" onclick={onDeleteTodo}
    >×</button
  >
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
    color: var(--secondaryText);
    position: relative;
  }
  .completed::after {
    content: " ";
    position: absolute;
    top: 50%;
    left: 0.25rem;
    right: 0.25rem;
    width: 100%;
    height: 1px;
    background: var(--secondaryText);
    animation-name: strike;
    animation-duration: 0.2s;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }
  @keyframes strike {
    0% {
      width: 0;
    }
    100% {
      width: calc(100% - 0.5rem);
    }
  }

  span {
    font-size: 1.125rem;
    margin-right: auto;
    padding: 0.5rem;
    overflow: hidden;
    white-space: nowrap;
    outline: none;
    transition: color 0.2s;

    :global(br) {
      display: none;
    }
    :global(*) {
      display: inline;
      white-space: nowrap;
    }
  }

  .delete-btn {
    opacity: 0;
    transition: opacity 0.2s;
    border: none;
    background: none;
    color: var(--secondaryText);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    line-height: 1;
  }

  .delete-btn:hover,
  .delete-btn:focus {
    color: var(--error);
  }

  .delete-btn:focus {
    outline: none;
  }

  .item:hover .delete-btn,
  .item:focus-within .delete-btn {
    opacity: 1;
  }
</style>
