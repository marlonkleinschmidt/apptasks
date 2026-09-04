import { api } from "./api";

export interface Task {
  id: number;
  titulo: string;
  done: boolean;
}

export interface CreateTaskData {
  titulo: string;
  done: boolean;
}

export interface UpdateTaskData {
  titulo?: string;
  done?: boolean;
}

export const tasksService = {
  async getAll(): Promise<Task[]> {
    const response = await api.get<Task[]>("/tasks");
    return response.data;
  },

  async create(task: CreateTaskData): Promise<Task> {
    const response = await api.post<Task>("/tasks", task);
    return response.data;
  },

  async update(id: number, task: UpdateTaskData): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
