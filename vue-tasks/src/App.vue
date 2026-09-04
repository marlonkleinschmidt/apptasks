<template>
  <div
    class="min-h-screen bg-app-gray-50 dark:bg-app-gray-900 transition-colors duration-200"
  >
    <nav-bar />

    <main class="container mx-auto px-4 py-8 max-w-7xl">
      <router-view />
    </main>
  </div>
</template>
<script>
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
};
</script>
