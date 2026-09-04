<template>
  <div>
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-app-gray-900 dark:text-white">
          Minhas Tarefas
        </h1>
      </div>

      <TaskForm :loading="tasksStore.loading" @submit="handleCreateTask" />

      <div
        v-if="tasksStore.error"
        class="bg-red-300 text-red-600 p-4 text-center font-bold rounded-lg"
      >
        <p>{{ tasksStore.error }}</p>
      </div>

      <div
        v-if="tasksStore.loading && tasksStore.tasks.length === 0"
        class="text-center py-8"
      >
        <p class="text-app-gray-600 dark:text-app-gray-400">
          Carregando tarefas...
        </p>
      </div>

      <div v-else-if="tasksStore.tasks.length === 0" class="text-center py-8">
        <p class="text-app-gray-600 dark:text-app-gray-400">
          Nenhuma tarefa cadastrada ainda.
        </p>
      </div>

      <div v-else class="space-y-8">
        <TaskList
          title="Pendentes"
          :tasks="tasksStore.pendingTasks"
          drop-zone="pending"
        />
        <TaskList
          title="Concluídas"
          :tasks="tasksStore.completedTasks"
          drop-zone="completed"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TaskForm from "@/components/tasks/TaskForm.vue";
import TaskList from "@/components/tasks/TaskList.vue";
import { useTasksStore } from "@/store/tasksStore";
import { onMounted } from "vue";

export default {
  name: "TasksView",
  components: {
    TaskForm,
    TaskList,
  },
  setup() {
    const tasksStore = useTasksStore();

    const handleCreateTask = async (title) => {
      try {
        await tasksStore.createTask(title);
      } catch (err) {
        console.error("Erro ao criar tarefa:", err);
      }
    };

    onMounted(() => {
      tasksStore.loadTasks();
    });

    return {
      tasksStore,
      handleCreateTask,
    };
  },
};
</script>
