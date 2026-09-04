import type { AuthError } from "../services/api";
import {
  authService,
  type AuthResponse,
  type LoginCredentials,
} from "../services/authService";
import { storage } from "../utils/storage"; // ⬅️ ajuste para o caminho real do seu arquivo
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

export interface User {
  id: number;
  username: string;
}

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  const user = ref<User | null>(null);
  const token = ref<string | null>(storage.get("token"));
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => user.value);
  const isLoading = computed(() => loading.value);
  const hasError = computed(() => error.value);
  const userName = computed(() => user.value?.username || "");

  const login = async (
    credentials: LoginCredentials,
  ): Promise<AuthResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);
      token.value = response.token;
      console.log(response);
      user.value = {
        id: response.userId,
        username: response.username,
      };

      storage.set("token", response.token);
      storage.set("user", JSON.stringify(user.value));

      router.push("/tasks");

      return response;
    } catch (err) {
      const authErr = err as AuthError;

      if (authErr.isAuthError) {
        error.value = authErr.message;
        throw authErr;
      }

      error.value =
        (authErr.response as { data?: { message?: string } })?.data?.message ||
        "Erro ao fazer o login";
      console.error("Erro ao fazer o login:", err);

      throw authErr;
    } finally {
      loading.value = false;
    }
  };

  const register = async (
    credentials: LoginCredentials,
  ): Promise<AuthResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.register(credentials);
      token.value = response.token;
      user.value = {
        id: response.userId,
        username: response.username,
      };

      storage.set("token", response.token);
      storage.set("user", JSON.stringify(user.value));

      router.push("/tasks");

      return response;
    } catch (err) {
      const authErr = err as AuthError;

      if (authErr.isAuthError) {
        error.value = authErr.message;
        throw authErr;
      }

      error.value =
        (authErr.response as { data?: { message?: string } })?.data?.message ||
        "Erro ao criar conta";
      console.error("Erro ao criar conta:", err);

      throw authErr;
    } finally {
      loading.value = false;
    }
  };

  const logout = (): void => {
    token.value = null;
    user.value = null;
    error.value = null;
    storage.remove("token");
    storage.remove("user");
    router.push("/login");
  };

  const checkAuth = (): void => {
    const savedToken = storage.get("token");
    const savedUser = storage.get("user");

    if (savedToken && savedUser) {
      token.value = savedToken;
      try {
        user.value = JSON.parse(savedUser) as User;
      } catch {
        user.value = null;
      }
    }
  };

  checkAuth();

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    currentUser,
    isLoading,
    hasError,
    userName,
    login,
    register,
    logout,
    checkAuth,
  };
});
