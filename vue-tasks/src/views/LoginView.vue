<template>
  <div
    :class="[
      'min-h-screen flex items-center justify-center bg-app-gray-50 dark:bg-app-gray-900',
      'py-12 px-4 sm:px-6 lg:px-8',
    ]"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="flex justify-center items-center gap-2 mb-6">
          <NotebookPen class="w-8 h-8 text-app-purple-500" />
          <h1 class="text-3xl font-bold text-app-gray-900 dark:text-white">
            AppTasks
          </h1>
        </div>
        <h2 class="text-2xl font-bold text-app-gray-900 dark:text-white">
          Entre na sua conta
        </h2>
        <p class="mt-2 text-sm text-app-gray-600 dark:text-app-gray-400">
          Ou
          <router-link
            to="/register"
            :class="[
              'font-medium text-app-purple-500 hover:text-app-purple-900',
              'dark:text-app-purple-400 dark:hover:text-app-purple-300 transition-colors',
            ]"
          >
            Crie uma nova conta
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="sr-only">Usuário</label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
              >
                <user class="h-5 w-5 text-app-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                v-model="form.username"
                type="text"
                required
                placeholder="Digite o nome do seu usuario"
                :class="[
                  ' relative block w-full pl-10 pr-3 py-3 border border-app-gray-300',
                  'dark:border-app-gray-700 placeholder-app-gray-500 dark:placeholder-app-gray-400',
                  'text-app-gray-900 dark:text-white rounded-lg bg-white dark:bg-app-gray-800',
                  'focus:outline-none focus:ring-app-gray-500 focus:border-app-purple-500 transition-colors',
                ]"
              />
            </div>
          </div>

          <div>
            <label for="password" class="sr-only">Senha</label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
              >
                <Lock class="h-5 w-5 text-app-gray-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                required
                placeholder="Digite a senha"
                :class="[
                  ' relative block w-full pl-10 pr-3 py-3 border border-app-gray-300',
                  'dark:border-app-gray-700 placeholder-app-gray-500 dark:placeholder-app-gray-400',
                  'text-app-gray-900 dark:text-white rounded-lg bg-white dark:bg-app-gray-800',
                  'focus:outline-none focus:ring-app-gray-500 focus:border-app-purple-500 transition-colors',
                ]"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="togglePasswordVisibility"
              >
                <Eye
                  v-if="showPassword"
                  class="h-5 w-5 text-app-gray--400 hover:text-app-gray-600 dark:hover:text-app-gray-300"
                />
                <EyeOff
                  v-else
                  class="h-5 w-5 text-app-gray--400 hover:text-app-gray-600 dark:hover:text-app-gray-300"
                />
              </button>
            </div>
          </div>
          <button
            type="submit"
            :class="[
              'group relative w-full flex justify-center py-3 px-4 border',
              'border-transparent text-sm font-medium rounded-lg text-white',
              'bg-app-purple-500 hover:bg-app-purple-600 focus:outline-none',
              'focus:ring-2 focus:ring-offset-2 focus:ring-app-purple-500',
              'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
            ]"
          >
            <LogIn class="w-5 h-5 mr-2" />
            Entrar
          </button>
        </div>
      </form>
      <div
        v-if="authStore.error"
        class="bg-red-300 text-red-600 p-3 text-center font-semibold rounded-lg"
      >
        <p>{{ authStore?.error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { NotebookPen, User, Lock, Eye, EyeOff, LogIn } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useAuthStore } from "../store/authStore";
export default {
  name: "LoginView",
  components: { NotebookPen, User, Lock, Eye, EyeOff, LogIn },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const showPassword = ref(false);
    const authStore = useAuthStore();

    const form = ref({
      username: "",
      password: "",
    });

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
      const passwordInput = document.getElementById("password");
      if (passwordInput) {
        passwordInput.type = showPassword.value ? "text" : "password";
      }
    };

    const handleLogin = async () => {
      try {
        await authStore.login(form.value);
      } catch (error) {
        console.log("Erro capturado:", error);
      }
    };

    return {
      form,
      loading,
      showPassword,
      togglePasswordVisibility,
      handleLogin,
      authStore,
    };
  },
};
</script>
