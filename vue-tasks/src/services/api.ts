import axios, { AxiosError } from "axios";
import { storage } from "@/utils/storage";

export interface AuthError extends Error {
  response?: unknown;
  isAuthError?: boolean;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = storage.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storage.remove("token");
      storage.remove("user");

      const authError: AuthError = new Error("Usuário e/ou senha inválidos!");
      authError.response = error.response;
      authError.isAuthError = true;

      return Promise.reject(authError);
    }
    return Promise.reject(error);
  },
);
