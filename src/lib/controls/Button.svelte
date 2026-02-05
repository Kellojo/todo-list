<script lang="ts">
  import Icon from "@iconify/svelte";

  let {
    text = $bindable<string>(),
    width = $bindable<string>(),
    appearance = "default",
    type = "button",
    textAlign = "center",
    disabled = false,
    icon = "",
    selected = $bindable<boolean>(false),
    press = () => {},
  }: {
    text: string;
    width?: string;
    appearance?: "default" | "error" | "primary" | "secondary";
    type?: "button" | "submit" | "reset" | null | undefined;
    textAlign?: "start" | "center" | "end";
    disabled?: boolean;
    icon?: string;
    selected?: boolean;
    press?: () => void;
  } = $props();

  function handleClick() {
    press();
  }
</script>

<button
  {type}
  style="width: {width}; justify-content: {textAlign}"
  class={appearance}
  class:selected
  {disabled}
  onclick={handleClick}
>
  {#if icon}
    <Icon {icon} />
  {/if}

  {text}</button
>

<style>
  button {
    padding: 0.75rem 1.5rem;
    background-color: var(--backgroundLight);
    color: var(--primaryText);
    border: 1px solid var(--borderColor);
    border-radius: 0.75rem;
    cursor: pointer;
    font-size: 1rem;
    box-shadow: var(--shadow-m);
    transition:
      background-color 0.2s,
      box-shadow 0.2s;

    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button:hover {
    background-color: var(--buttonHoverBackground);
    color: var(--buttonHoverTextColor);
    box-shadow: var(--shadow-l);
  }

  button:active {
    background-color: var(--buttonActiveBackground);
    box-shadow: var(--shadow-s);
  }

  button:focus-visible {
    outline: 2px dashed var(--buttonText);
    outline-offset: 2px;
  }

  .selected {
    background-color: var(--buttonSelectedBackground);
    border-color: var(--buttonSelectedBorderColor);
  }

  .error,
  .error:hover {
    color: var(--error);
  }

  .primary {
    background-color: var(--buttonPrimaryBackground);
    color: var(--buttonPrimaryTextColor);
  }
</style>
