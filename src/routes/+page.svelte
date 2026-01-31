<script lang="ts">
  import { pb, getCurrentUser } from "$lib/pocketbase";
</script>

<main>
  <div class="auth-section">
    {#if getCurrentUser()}
      <p>You are logged in.</p>
    {:else}
      <h2>Get Started</h2>
      <div class="button-group">
        <a href="/login" class="button primary">Login</a>
        <a href="/register" class="button">Register</a>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .auth-section {
    background: white;
    border: 1px solid #e5e5e5;
    padding: 2rem;
    border-radius: 8px;
  }

  .auth-section h2 {
    margin-top: 0;
    color: #333;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .button {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #f0f0f0;
    color: #333;
    text-decoration: none;
    border-radius: 6px;
    border: 1px solid #ddd;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
    font-size: 1rem;
  }

  .button:hover {
    background: #e5e5e5;
    border-color: #ccc;
  }

  .button.primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .button.primary:hover {
    background: #2563eb;
    border-color: #2563eb;
  }

  button {
    padding: 0.75rem 1.5rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1rem;
  }

  button:hover {
    background: #dc2626;
  }
</style>
