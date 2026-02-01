<script lang="ts">
  let {
    placeholder = "",
    value = $bindable<string>(""),
    class: className = "",
    onsubmit = undefined,
  } = $props();

  function onkeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && onsubmit) {
      event.preventDefault();
      onsubmit(event);
    }
  }
</script>

<input {placeholder} {value} class={className} {onkeydown} />

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
