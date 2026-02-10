<script lang="ts">
  import {
    ensureNotAuthenticated,
    getEnabledAuthMethods,
    loginWithEmail,
    loginWithOAuth,
    registerWithEmail,
  } from "$lib/pocketbase";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import MainContent from "$lib/controls/MainContent.svelte";
  import Button from "$lib/controls/Button.svelte";
  import Input from "$lib/controls/Input.svelte";
  import { toast } from "svelte-sonner";
  import type { AuthProviderInfo } from "pocketbase";

  let email = $state("");
  let password = $state("");
  let passwordConfirm = $state("");
  let loading = $state(false);
  let isLogin = $state(true);
  let isPasswordAuthEnabled = $state(true);
  let initialLoad = $state(true);

  let oAuthProviders: AuthProviderInfo[] = $state([]);

  onMount(async () => {
    ensureNotAuthenticated();

    try {
      const authMethods = await getEnabledAuthMethods();
      console.log("Enabled auth methods:", authMethods);
      isPasswordAuthEnabled = authMethods.emailPassword;
      oAuthProviders = authMethods.oauthProviders;
    } catch (err) {
      console.error("Failed to check auth methods:", err);
    }

    initialLoad = false;
  });

  async function onLogin() {
    if (loading) return;
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    loading = true;

    try {
      await loginWithEmail(email, password);
      goto("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(
        err.message || "Failed to login. Please check your credentials.",
      );
    } finally {
      loading = false;
    }
  }

  async function onRegister() {
    loading = true;

    try {
      // Create the user
      await registerWithEmail(email, password, passwordConfirm);
      goto("/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(err.message || "Failed to register. Please try again.");
    } finally {
      loading = false;
    }
  }

  async function onLoginWithOAuth(provider: AuthProviderInfo) {
    try {
      const result = await loginWithOAuth(provider.name);
      console.log(result);
      goto("/dashboard");
    } catch (err) {
      console.error("OAuth login error:", err);
      toast.error("Failed to initiate OAuth login. Please try again.");
    }
  }

  function switchToRegister() {
    isLogin = false;
  }
  function switchToLogin() {
    isLogin = true;
  }
</script>

{#snippet content()}
  <div class="container">
    <h1>{isLogin ? "Login" : "Sign Up"}</h1>

    {#if isPasswordAuthEnabled}
      <form
        onsubmit={(e) => {
          e.preventDefault();

          isLogin ? onLogin() : onRegister();
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
    {/if}
  </div>

  <div>
    {#if oAuthProviders.length > 0}
      <h2
        style="text-align: center; margin: 2rem 0 1rem 0;"
        style:display={isPasswordAuthEnabled ? "block" : "none"}
      >
        Or continue with
      </h2>
      <div class="oAuth-buttons">
        {#each oAuthProviders as provider}
          <Button
            icon="material-symbols:login-rounded"
            flexGrow={true}
            text={provider.displayName}
            press={() => onLoginWithOAuth(provider)}
          />
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

<MainContent
  fitHeight={true}
  maxWidth="500px"
  {content}
  opacity={initialLoad ? 0 : 1}
></MainContent>

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

  .oAuth-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
</style>
