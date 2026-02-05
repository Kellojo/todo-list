<script lang="ts">
  let {
    id = null,
    placeholder = "",
    value = $bindable<string>(""),
    type = "text",
    class: className = "",
    required = false,
    onsubmit = undefined,
    disabled = false,
    width = undefined,
    element = $bindable<HTMLInputElement | undefined>(undefined),
    autocomplete = undefined,
  } = $props();

  function onkeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && onsubmit) {
      event.preventDefault();
      onsubmit(event);
    }
  }
</script>

<input
  bind:this={element}
  {id}
  {placeholder}
  bind:value
  {type}
  {required}
  class={className}
  {width}
  {disabled}
  {onkeydown}
  {autocomplete}
/>

<style>
  input {
    height: 22px;
    padding: 0.75rem 1rem;
    background-color: var(--backgroundLight);
    border: 1px solid var(--borderColor);
    border-radius: 2rem;
    color: var(--primaryText);
    font-size: 1rem;

    box-shadow: var(--shadow-s);
  }

  input:focus {
    outline: none;
  }
</style>
