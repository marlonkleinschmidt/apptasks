<template>
  <div
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="clearDraggedTask"
    :class="[
      'bg-white dark:bg-app-gray-800 p-4 rounded-lg border border-app-gray-200 dark:border-app-gray-700 flex items-center gap-4 transition-all cursor-move',
      draggedTaskId === task.id ? 'opacity-50' : 'hover:shadow-md',
      !task.done ? 'opacity-50' : 'hover:shadow-md',
      task.done ? 'opacity-60' : '',
    ]"
  >
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        :checked="task.done"
        class="sr-only peer"
        @change="handleToggleTask"
      />
      <div
        :class="[
          'w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
          task.done
            ? 'bg-app-purple-500 border-app-purple-500'
            : 'bg-transparent border-app-gray-300 dark:border-app-gray-600',
          'peer-focus:ring-2 peer-focus:ring-app-purple-500 peer-focus:ring-offset-2',
        ]"
      >
        <svg
          v-if="task.done"
          class="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </label>
    <div class="flex-1">
      <input
        v-if="isEditing"
        v-model="editingTitle"
        @keyup.esc="cancelEdit"
        @keyup.enter="saveTaskEdit"
        :class="[
          'w-full px-3 py-2 border border-app-gray-300 dark:border-app-gray-700',
          'rounded bg-white dark:bg-app-gray-800 text-app-gray-900 dark:text-white',
          'focus:outline-none focus:ring-app-purple-500 focus:border-app-purple-500',
        ]"
      />
      <p
        v-else
        @dblclick="editingTask"
        :class="[
          'cursor-pointer select-none',
          task.done
            ? 'line-through text-app-gray-500 dark:text-app-gray-300'
            : 'text-app-gray-900 dark:text-white',
        ]"
      >
        {{ task.titulo }}
      </p>
    </div>
    <div class="flex gap-2">
      <button
        v-if="!isEditing"
        @click="editingTask"
        class="p-2 text-app-purple-500 hover:bg-app-purple-50 dark:hover:bg-app-purple-900/20 rounded transition-colors"
      >
        <Edit class="w-5 h-5" />
      </button>
      <button
        @click="handleDeleteTask"
        class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
      >
        <Trash2 class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useTasksStore } from "../../store/tasksStore";
import { Edit, Trash2 } from "lucide-vue-next";
import Swal from "sweetalert2";

export default {
  name: "TaskItem",
  components: { Edit, Trash2 },
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const editingTitle = ref("");
    const tasksStore = useTasksStore();

    const editingTask = () => {
      editingTitle.value = props.task.titulo;
      tasksStore.setEditingTask(props.task);
    };

    const cancelEdit = () => {
      editingTitle.value = "";
      tasksStore.setEditingTask(null);
    };

    const saveTaskEdit = async () => {
      try {
        if (!editingTitle.value.trim()) {
          cancelEdit();
          return;
        }
        await tasksStore.updateTask(props.task.id, editingTitle.value);
        alert("Tarefa atualizada com sucesso!");
      } catch (err) {
        console.error("Erro ao atualizar a tarefa: ", err);
      } finally {
        cancelEdit();
      }
    };

    const isEditing = computed(
      () => tasksStore.editingTaskId === props.task.id,
    );

    const handleToggleTask = async () => {
      try {
        await tasksStore.toggleTask(props.task.id, !props.task.done);
      } catch (err) {
        console.error("Erro ao atualizar tarefa:", err);
      }
    };

    const handleDeleteTask = async () => {
      try {
        const result = await Swal.fire({
          title: "Excluir Tarefa?",
          text: "Essa ação não pode ser desfeita",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#8257e6",
          cancelButtonColor: "#737380",
          confirmButtonText: "Sim, excluir",
          cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
          tasksStore.deleteTask(props.task.id);

          Swal.fire({
            title: "Exluir Tarefa",
            text: "A tarefa foi removida com sucesso!",
            icon: "Sucess",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "Exluir Tarefa",
          text: "Ocorreu um erro ao excluir a tarefa!",
          icon: "error",
        });
      }
    };

    const handleDragStart = (event) => {
      tasksStore.setDraggedTask(props.task.id);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", props.task.id.toString());
    };

    const draggedTaskId = tasksStore.draggedTaskId;

    const clearDraggedTask = () => {
      tasksStore.clearDraggedTask();
    };

    return {
      isEditing,
      editingTask,
      editingTitle,
      cancelEdit,
      saveTaskEdit,
      handleDeleteTask,
      handleToggleTask,
      handleDragStart,
      draggedTaskId,
      clearDraggedTask,
    };
  },
};
</script>
