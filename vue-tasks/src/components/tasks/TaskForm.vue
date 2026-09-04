<template>
  <form
    @submit.prevent="handleSubmit"
    :class="[
      'bg-white dark:bg-app-gray-800 p-6 rounded-lg border border-app-gray-200',
      'dark:border-app-gray-700',
    ]"
  >
    <div class="flex gap-4">
      <input
        v-model="taskTitle"
        type="text"
        placeholder="Digite o título da tarefa"
        required
        :class="[
          'flex-1 px-4 py-3 border border-app-gray-300 dark:border-app-gray-700',
          'rounded-lg bg-white dark:bg-app-gray-800 text-app-gray-900 dark:text-white',
          'focus:outline-none focus:ring-app-purple-500 focus:border-app-purple-500 transition-colors ',
        ]"
      />
      <button
        type="submit"
        :disabled="loading"
        :class="[
          'px-6 py-3 bg-app-purple-500 hover:bg-app-purple-600 text-white',
          'rounded-lg font-medium transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center gap-2',
        ]"
      >
        <Plus class="w-5 h-5" />
        Adicionar
      </button>
    </div>
  </form>
</template>
<script>
import { Plus } from "lucide-vue-next";
import { ref } from "vue";

export default {
  name: "TaskForm",
  components: {
    Plus,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["submit"],
  setup(props, { emit }) {
    const taskTitle = ref("");
    const handleSubmit = () => {
      if (!taskTitle.value.trim()) return;
      emit("submit", taskTitle.value.trim());
      taskTitle.value = "";
    };

    return {
      taskTitle,
      handleSubmit,
    };
  },
};
</script>
