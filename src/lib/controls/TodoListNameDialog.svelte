<script lang="ts">
  import Button from "./Button.svelte";
  import Input from "./Input.svelte";

  let {
    open = $bindable<boolean>(false),
    name = $bindable<string>(""),
    onSubmit,
  } = $props();

  let dialogElement: HTMLDialogElement | undefined = $state();
  let inputElement: HTMLInputElement | undefined = $state();

  // Handle dialog modal state
  $effect(() => {
    if (dialogElement) {
      if (open && !dialogElement.open) {
        dialogElement.showModal();
        // Focus the input when dialog opens
        setTimeout(() => inputElement?.focus(), 0);
      } else if (!open && dialogElement.open) {
        dialogElement.close();
      }
    }
  });

  function onFormSubmit(evt: Event) {
    evt.preventDefault();
    onSubmit?.(name);
    open = false;
  }

  function onClose() {
    open = false;
  }

  function onKeyDown(evt: KeyboardEvent) {
    if (evt.key === "Escape") {
      open = false;
    }
  }

  function onBackdropClick(evt: MouseEvent) {
    if (evt.target === dialogElement) {
      open = false;
    }
  }
</script>

<dialog
  bind:this={dialogElement}
  class="dialog"
  onclose={onClose}
  onkeydown={onKeyDown}
  onclick={onBackdropClick}
  aria-labelledby="dialog-title"
>
  <form class="form" onsubmit={onFormSubmit} method="dialog">
    <h2 id="dialog-title" class="title">Enter List Name</h2>
    <Input
      type="text"
      placeholder="List Name"
      bind:value={name}
      bind:element={inputElement}
      required
      autocomplete="off"
    />
    <div class="buttons">
      <Button
        type="button"
        text="Cancel"
        appearance="default"
        press={() => (open = false)}
      />
      <Button type="submit" text="Create" appearance="primary" />
    </div>
  </form>
</dialog>

<style>
  .dialog {
    border: 1px solid var(--borderColor);
    background-color: var(--background);
    border-radius: 0.75rem;
    padding: 0;
    box-shadow: var(--shadow-l);
    backdrop-filter: blur(2rem);
    max-width: 90vw;
    width: 400px;
    transition:
      opacity 0.2s,
      translate 0.2s,
      overlay 0.2s allow-discrete,
      display 0.2s allow-discrete;
    opacity: 0;
    translate: 0 -1rem;
  }

  .dialog[open] {
    opacity: 1;
    translate: 0 0;
  }

  @starting-style {
    .dialog[open] {
      opacity: 0;
      translate: 0 -1rem;
    }
  }

  .dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.125);
    backdrop-filter: blur(0.25rem);
    transition:
      opacity 0.2s,
      overlay 0.2s allow-discrete,
      display 0.2s allow-discrete;
    opacity: 0;
  }

  .dialog[open]::backdrop {
    opacity: 1;
  }

  @starting-style {
    .dialog[open]::backdrop {
      opacity: 0;
    }
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primaryText);
  }

  .buttons {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
</style>
