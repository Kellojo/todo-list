<script lang="ts">
  let {
    completed = $bindable<boolean>(),
    onchange = $bindable<EventHandler>(),
  } = $props();
</script>

<input type="checkbox" bind:checked={completed} {onchange} />

<style>
  input[type="checkbox"] {
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
    margin: 0;

    border: 2px solid var(--secondaryText);
    border-radius: 50%;
    background-color: var(--backgroundLight);
    padding: 0.5rem;
  }

  input[type="checkbox"]:focus-visible {
    outline: 1px dashed var(--secondaryText);
  }

  input[type="checkbox"]:hover {
    border-color: var(--primaryText);
  }

  input[type="checkbox"]:checked {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12' /%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: 75%;
    background-position: center;
  }
</style>
