<template>
  <header
    class="bg-white dark:bg-app-gray-900 border-b border-app-gray-200 dark:border-app-gray-800 sticky top-0 z-50"
  >
    <div class="flex items-center gap-4 justify-center">
      <NotebookPen class="m-4 w-8 h-8 text-app-purple-500" />
      <span
        v-if="isAuthenticated"
        class="text-app-gray-700 dark:text-app-gray-300"
      >
        Olá, {{ username }}
      </span>
      <menu-item v-if="!isAuthenticated" redirect-to="/login" title="Login" />
      <menu-item
        v-if="!isAuthenticated"
        redirect-to="/register"
        title="Cadastre-se"
      />
      <menu-item v-if="isAuthenticated" redirect-to="/tasks" title="Tarefas" />

      <button
        v-if="isAuthenticated"
        @click="handleLogout"
        class="px-4 py-2 rounded-lg text-app-gray-600 dark:text-app-gray-300 bg-transparent border border-app-gray-200 dark:border-app-gray-800 cursor-pointer transition-all duration-200 font-medium hover:bg-app-gray-50 dark:hover:bg-app-gray-800 hover:text-app-purple-500 dark:hover:text-app-purple-400"
      >
        Sair
      </button>
      <button
        @click="toggleTheme"
        class="px-4 py-2 rounded-lg text-app-gray-600 dark:text-app-gray-300 bg-transparent border border-app-gray-200 dark:border-app-gray-800 cursor-pointer transition-all duration-200 font-medium hover:bg-app-gray-50 dark:hover:bg-app-gray-800 hover:text-app-purple-500 dark:hover:text-app-purple-400"
      >
        <Plus class="w-5 h-5" />
        {{ !isDark ? "Modo Escuro" : "Modo Claro" }}
      </button>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from "../store/authStore.ts";
import MenuItem from "./MenuItem.vue";
import { useTheme } from "@composables/useTheme";
import { LogOut, NotebookPen } from "lucide-vue-next";
import { computed } from "vue";
export default {
  name: "NavBar",
  components: {
    MenuItem,
    NotebookPen,
  },
  setup() {
    const { isDark, toggleTheme } = useTheme();
    const authStore = useAuthStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const username = computed(() => authStore.userName);

    const handleLogout = () => {
      authStore.logout();
    };

    return {
      isDark,
      toggleTheme,
      isAuthenticated,
      username,
      NotebookPen,
      handleLogout,
    };
  },
};
</script>
