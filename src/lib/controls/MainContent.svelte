<script lang="ts">
  let {
    content,
    maxWidth = "var(--contentMaxWidth)",
    fitHeight = false,
    opacity = 1,
  } = $props();
</script>

<main class:fit-height={fitHeight} style="max-width: {maxWidth}; opacity: {opacity};">
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

    height: 100%;
    min-height: calc(100vh - 4rem);
  }

  main.fit-height {
    margin: auto;
    height: fit-content;
    min-height: auto;
  }

    @media (max-width: 768px) {
        main {
            margin-left: 0;
            margin-right: 0;
            margin-top: 0;
            border: none;
            border-radius: 0;
            max-width: 100% !important;
            min-height: calc(100vh - 2rem);
        }
    }
</style>
