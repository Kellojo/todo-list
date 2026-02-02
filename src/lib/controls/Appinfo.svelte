<script lang="ts">
  import { getAdminPanelUrl } from "$lib/pocketbase";
  // @ts-ignore
  const version = __VERSION__;
</script>

<div class="app-info">
  <a
    href="https://github.com/Kellojo/todo-list"
    target="_blank"
    rel="noopener noreferrer">Kellojo/todo-list v{version}</a
  >
  &nbsp;|&nbsp;
  <a href={getAdminPanelUrl()} target="_blank" rel="noopener noreferrer"
    >Open Admin Console</a
  >
</div>

<style>
  .app-info {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 0.5rem;
    box-sizing: border-box;
    font-size: 0.625rem;
    opacity: 0.45;
  }

  .app-info a {
    color: var(--primaryText);
    text-decoration: none;
    text-shadow: var(--backgroundTextContrastShadow);
  }
</style>
