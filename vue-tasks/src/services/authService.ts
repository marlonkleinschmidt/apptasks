import { api } from "./api";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(credentiais: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      "/auth/register",
      credentiais,
    );
    return response.data;
  },
};
