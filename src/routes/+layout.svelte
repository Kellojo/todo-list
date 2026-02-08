<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { onMount } from "svelte";
  import { Toaster } from "svelte-sonner";

  import "../app.css";
  import "../fonts.css";
  import "../toasts.css";
  import { isAuthenticated } from "$lib/pocketbase";
  import { goto } from "$app/navigation";
  let { children } = $props();

  import { onNavigate } from "$app/navigation";
  import Appinfo from "$lib/controls/Appinfo.svelte";

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  onMount(async () => {
    if (isAuthenticated()) {
      goto("/dashboard");
    } else {
      goto("/auth");
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="background"></div>

{@render children()}

<Appinfo />
<Toaster
  position="bottom-center"
  toastOptions={{ unstyled: true, class: "toast" }}
/>
