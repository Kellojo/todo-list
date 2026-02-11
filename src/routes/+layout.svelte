<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import favicon96 from "$lib/assets/favicon-96x96.png";
  import faviconIco from "$lib/assets/favicon.ico";
  import appleTouch from "$lib/assets/apple-touch-icon.png";
  import manifest from "$lib/assets/site.webmanifest";
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
  <link rel="icon" type="image/png" href={favicon96} sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href={favicon} />
  <link rel="shortcut icon" href={faviconIco} />
  <link rel="apple-touch-icon" sizes="180x180" href={appleTouch} />
  <meta name="apple-mobile-web-app-title" content="Todo List" />
  <link rel="manifest" href={manifest} />
</svelte:head>

<div class="background"></div>

{@render children()}

<Appinfo />
<Toaster
  position="bottom-center"
  toastOptions={{ unstyled: true, class: "toast" }}
/>
