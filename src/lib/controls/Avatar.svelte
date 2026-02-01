<script lang="ts">
  import { pb, getCurrentUser, type UserRecord } from "$lib/pocketbase";
  import { onMount } from "svelte";

  let user: UserRecord | null = $state(null);

  onMount(() => {
    user = getCurrentUser();
  });
</script>

<div class="container">
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
</div>

<style>
  .container {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: var(--shadow-s);
    background: var(--backgroundLight);
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
</style>
