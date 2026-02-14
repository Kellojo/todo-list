<script lang="ts">
  import { pb, getCurrentUser, type UserRecord, logout } from "$lib/pocketbase";
  import { onMount } from "svelte";
  import Button from "./Button.svelte";

  let user: UserRecord | null = $state(null);

  onMount(() => {
    user = getCurrentUser();
  });

  function onLogoutPress() {
    logout();
  }
</script>

<button
  class="container"
  id="avatar"
  data-testid="my-avatar"
  popovertarget="avatar-popover"
>
  {#if user?.avatar}
    <img
      src={pb.files.getURL(user, user?.avatar)}
      alt="User Avatar"
      class="avatar-image"
    />
  {:else}
    <div class="avatar-placeholder">
      {#if user?.email}
        {user?.email.charAt(0).toUpperCase()}
      {:else}
        U
      {/if}
    </div>
  {/if}
</button>

<div id="avatar-popover" popover class="popover">
  <div class="info">
    <div>{user?.name}</div>
    <div class="email">{user?.email}</div>
    <div class="created">
      Created {new Date(user?.created ? user.created : "").toLocaleDateString()}
    </div>
  </div>
  <Button
    text="Logout"
    appearance="error"
    textAlign="start"
    width="100%"
    icon="material-symbols:logout-rounded"
    press={onLogoutPress}
    id="logout-button"
  />
</div>

<style>
  .container {
    cursor: pointer;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: var(--shadow-s);
    background: var(--backgroundLight);
    color: var(--primaryText);
    border: 2px solid var(--borderColor);
    outline: none;
    padding: 0;
    flex-shrink: 0;

    transition: all 0.2s;
  }

  .container:hover {
    border: 2px solid var(--primaryText);
  }

  .avatar-image {
    width: 100%;
    height: 100%;

    object-fit: cover;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.5rem;

    user-select: none;
  }

  .popover {
    width: 300px;
    top: anchor(bottom);
    left: anchor(right);
    margin: 0;
    padding: 1rem;
    transform: translate(-100%, 0.5rem);

    border-radius: 1rem;
    background: var(--background);
    backdrop-filter: blur(2rem);
    box-shadow: var(--shadow-l);
    border: 1px solid var(--borderColor);
    color: var(--primaryText);
    transition:
      opacity 0.2s,
      translate 0.2s,
      overlay 0.2s allow-discrete,
      display 0.2s allow-discrete;
    opacity: 0;
    translate: 0 -1rem;
    overflow: hidden;
  }

  .popover:popover-open {
    opacity: 1;
    translate: 0 0;
  }
  @starting-style {
    .popover:popover-open {
      opacity: 0;
      translate: 0 -1rem;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--borderColor);
    padding-bottom: 1rem;
  }

  .email {
    font-weight: bold;
    word-break: break-all;
  }

  .created {
    font-size: 0.875rem;
    color: var(--secondaryText);
  }
</style>
