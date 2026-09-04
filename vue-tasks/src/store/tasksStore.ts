import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { tasksService, type Task } from "../services/tasksService";

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const editingTaskId = ref<number | null>(null);
  const draggedTaskId = ref<number | null>(null);
  const dragOverTarget = ref<string | null>(null);
  const showDeleteModal = ref<boolean>(false);
  const taskToDelete = ref<number | null>(null);

  const pendingTasks = computed(() => {
    return tasks.value.filter((task) => !task.done);
  });

  const completedTasks = computed(() => {
    return tasks.value.filter((task) => task.done);
  });

  const loadTasks = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      tasks.value = await tasksService.getAll();
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      error.value =
        axiosError.response?.data?.message || "Erro ao carregar tarefas";
      console.error("Erro ao carregar tarefas:", err);
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (title: string): Promise<Task> => {
    loading.value = true;
    error.value = null;
    try {
      const newTask = await tasksService.create({
        titulo: title,
        done: false,
      });
      tasks.value.push(newTask);
      return newTask;
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      error.value =
        axiosError.response?.data?.message || "Erro ao criar tarefa";
      console.error("Erro ao criar tarefa:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleTask = async (id: number, done: boolean): Promise<Task> => {
    try {
      const updatedTask = await tasksService.update(id, { done });
      const index = tasks.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
      return updatedTask;
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      error.value =
        axiosError.response?.data?.message || "Erro ao atualizar tarefa";
      console.error("Erro ao atualizar tarefa:", err);
      throw err;
    }
  };

  const updateTask = async (
    id: number,
    title: string,
  ): Promise<Task | void> => {
    if (!title.trim()) {
      editingTaskId.value = null;
      return;
    }

    try {
      const updatedTask = await tasksService.update(id, {
        titulo: title.trim(),
      });
      const index = tasks.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
      editingTaskId.value = null;
      return updatedTask;
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      error.value =
        axiosError.response?.data?.message || "Erro ao atualizar tarefa";
      console.error("Erro ao atualizar tarefa:", err);
      throw err;
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    loading.value = true;
    try {
      await tasksService.delete(id);
      tasks.value = tasks.value.filter((t) => t.id !== id);
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      error.value =
        axiosError.response?.data?.message || "Erro ao excluir tarefa";
      console.error("Erro ao excluir tarefa:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setEditingTask = (task: Task | null): void => {
    if (task) {
      editingTaskId.value = task.id;
    } else {
      editingTaskId.value = null;
    }
  };

  const openDeleteModal = (id: number): void => {
    taskToDelete.value = id;
    showDeleteModal.value = true;
  };

  const closeDeleteModal = (): void => {
    showDeleteModal.value = false;
    taskToDelete.value = null;
  };

  const confirmDelete = async (): Promise<void> => {
    if (!taskToDelete.value) return;

    try {
      await deleteTask(taskToDelete.value);
      closeDeleteModal();
    } catch (err) {
      closeDeleteModal();
    }
  };

  const setDraggedTask = (taskId: number): void => {
    draggedTaskId.value = taskId;
  };

  const clearDraggedTask = (): void => {
    draggedTaskId.value = null;
    dragOverTarget.value = null;
  };

  const setDragOverTarget = (target: string | null): void => {
    dragOverTarget.value = target;
  };

  const handleDrop = async (
    taskId: number,
    targetDone: boolean,
  ): Promise<void> => {
    const task = tasks.value.find((t) => t.id === taskId);

    if (!task || task.done === targetDone) {
      clearDraggedTask();
      return;
    }

    try {
      await toggleTask(taskId, targetDone);
    } catch (err) {
      console.error("Erro ao mover tarefa:", err);
    } finally {
      clearDraggedTask();
    }
  };

  return {
    tasks,
    loading,
    error,
    editingTaskId,
    draggedTaskId,
    dragOverTarget,
    showDeleteModal,
    pendingTasks,
    completedTasks,
    loadTasks,
    createTask,
    toggleTask,
    updateTask,
    deleteTask,
    setEditingTask,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    setDraggedTask,
    clearDraggedTask,
    setDragOverTarget,
    handleDrop,
  };
});
