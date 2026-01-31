<script lang="ts">
  import { pb, currentUser } from "$lib/pocketbase";
  import { goto } from "$app/navigation";

  let email = $state("");
  let password = $state("");
  let passwordConfirm = $state("");
  let error = $state("");
  let loading = $state(false);

  async function handleRegister() {
    if (!email || !password || !passwordConfirm) {
      error = "Please fill in all fields";
      return;
    }

    if (password !== passwordConfirm) {
      error = "Passwords do not match";
      return;
    }

    if (password.length < 8) {
      error = "Password must be at least 8 characters long";
      return;
    }

    loading = true;
    error = "";

    try {
      // Create the user
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm,
        emailVisibility: true,
      });

      // Automatically log them in
      await pb.collection("users").authWithPassword(email, password);

      goto("/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      error = err.message || "Failed to register. Please try again.";
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
    <h1>Register</h1>

    <form
      onsubmit={(e) => {
        e.preventDefault();
        handleRegister();
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
        <small>Minimum 8 characters</small>
      </div>

      <div class="form-group">
        <label for="passwordConfirm">Confirm Password</label>
        <input
          id="passwordConfirm"
          type="password"
          bind:value={passwordConfirm}
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      {#if error}
        <div class="error">{error}</div>
      {/if}

      <button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>

    <p class="footer-text">
      Already have an account? <a href="/login">Login here</a>
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

  small {
    display: block;
    margin-top: 0.25rem;
    color: #888;
    font-size: 0.85rem;
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
