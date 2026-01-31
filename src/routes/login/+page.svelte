<script lang="ts">
  import { pb, currentUser } from "$lib/pocketbase";
  import { goto } from "$app/navigation";

  let email = $state("");
  let password = $state("");
  let error = $state("");
  let loading = $state(false);

  async function handleLogin() {
    if (!email || !password) {
      error = "Please fill in all fields";
      return;
    }

    loading = true;
    error = "";

    try {
      await pb.collection("users").authWithPassword(email, password);
      goto("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      error = err.message || "Failed to login. Please check your credentials.";
    } finally {
      loading = false;
    }
  }

  // Redirect if already logged in
  $effect(() => {
    if ($currentUser) {
      goto("/dashboard");
    }
  });
</script>

<main>
  <div class="container">
    <h1>Login</h1>

    <form
      onsubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="your@email.com"
          required
          disabled={loading}
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      {#if error}
        <div class="error">{error}</div>
      {/if}

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>

    <p class="footer-text">
      Don't have an account? <a href="/register">Register here</a>
    </p>

    <p class="footer-text">
      <a href="/">← Back to home</a>
    </p>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .container {
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 420px;
  }

  h1 {
    margin: 0 0 2rem 0;
    color: #333;
    text-align: center;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  input:focus {
    outline: none;
    border-color: #667eea;
  }

  input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  button {
    width: 100%;
    padding: 0.875rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover:not(:disabled) {
    background: #5568d3;
  }

  button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .error {
    background: #fee;
    color: #c33;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .footer-text {
    text-align: center;
    margin-top: 1.5rem;
    color: #666;
    font-size: 0.9rem;
  }

  .footer-text a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
  }

  .footer-text a:hover {
    text-decoration: underline;
  }
</style>
