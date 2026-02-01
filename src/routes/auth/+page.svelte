<script lang="ts">
  import { ensureNotAuthenticated, pb } from "$lib/pocketbase";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import MainContent from "$lib/controls/MainContent.svelte";
  import Button from "$lib/controls/Button.svelte";
  import Input from "$lib/controls/Input.svelte";

  let email = $state("");
  let password = $state("");
  let passwordConfirm = $state("");
  let error = $state("");
  let loading = $state(false);
  let isLogin = $state(true);

  onMount(() => {
    ensureNotAuthenticated();
  });

  async function handleLogin() {
    if (loading) return;
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

  function switchToRegister() {
    isLogin = false;
    error = "";
  }
  function switchToLogin() {
    isLogin = true;
    error = "";
  }
</script>

{#snippet content()}
  <div class="container">
    <h1>{isLogin ? "Login" : "Sign Up"}</h1>

    <form
      onsubmit={(e) => {
        e.preventDefault();

        isLogin ? handleLogin() : handleRegister();
      }}
    >
      <div class="form-group">
        <label for="email">Email</label>
        <Input
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
        <Input
          id="password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      {#if !isLogin}
        <div class="form-group">
          <label for="passwordConfirm">Confirm Password</label>
          <Input
            id="passwordConfirm"
            type="password"
            bind:value={passwordConfirm}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>
      {/if}

      <Button
        width="100%"
        type="submit"
        icon="material-symbols:login-rounded"
        text={isLogin ? "Login" : "Sign Up"}
      />
    </form>

    {#if isLogin}
      <p class="footer-text">
        Don't have an account? <a
          role="button"
          href="/auth"
          onclick={switchToRegister}
          onkeypress={switchToRegister}>Sign Up here</a
        >
      </p>
    {:else}
      <p class="footer-text">
        Already have an account? <a
          role="button"
          href="/auth"
          onclick={switchToLogin}
          onkeypress={switchToLogin}>Login here</a
        >
      </p>
    {/if}

    {#if error}
      <div class="error">{error}</div>
    {/if}
  </div>
{/snippet}

<MainContent fitHeight={true} maxWidth="500px" {content}></MainContent>

<style>
  h1 {
    margin: 0 0 2rem 0;
    text-align: center;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
  }

  label {
    padding-left: 1rem;
    display: block;
    margin-bottom: 0.5rem;
    color: var(--primaryText);
    font-size: 1rem;
    font-weight: 500;
  }

  .error {
    color: var(--error);
    border-radius: 6px;
    margin: 2rem;
    font-size: 1rem;
    text-shadow: var(--backgroundTextContrastShadow);
    position: absolute;
    bottom: -5rem;
    left: 0;
    right: 0;
    text-align: center;
  }

  .footer-text {
    text-align: center;
    margin: 1.5rem 0 0 0;
    font-size: 0.9rem;
    color: var(--secondaryText);
  }

  .footer-text a {
    color: var(--info);
    text-decoration: none;
    font-weight: 500;
  }

  .footer-text a:hover {
    text-decoration: underline;
  }
</style>
