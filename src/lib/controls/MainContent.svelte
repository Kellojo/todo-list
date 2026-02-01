<script lang="ts">
  let {
    content,
    maxWidth = "var(--contentMaxWidth)",
    fitHeight = false,
  } = $props();
</script>

<main
  style="max-width: {maxWidth}; 
  min-height: {fitHeight ? 'auto' : 'calc(100vh - 4rem)'};
  height: {fitHeight ? 'fit-content' : '100%'};
  margin: {fitHeight ? 'auto' : '2rem auto'};"
>
  {@render content()}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    padding: 2rem;
    margin: 2rem auto;
    box-sizing: border-box;

    border-radius: 1.5rem;
    background: var(--background);
    backdrop-filter: blur(1.25rem);
    box-shadow: var(--shadow-l);
    border: 1px solid var(--borderColor);
    width: 100%;
  }
</style>
