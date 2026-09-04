<template>
  <div>
    <h2 class="text-xl font-semibold text-app-gray-900 dark:text-white mb-4">
      {{ title }}
    </h2>
    <div
      :data-drop-zone="dropZone"
      @dragover.prevent="handleDragOver"
      @drop.prevent="handleDrop"
      @dragleave="handleDragLeave"
      class="space-y-3 min-h-25"
    >
      <TaskItem v-for="item in tasks" :key="item.id" :task="item" />
    </div>
  </div>
</template>
<script>
import { useTasksStore } from "../../store/tasksStore.ts";
import TaskItem from "./TaskItem.vue";

export default {
  name: "TaskList",
  components: { TaskItem },

  props: {
    tasks: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    dropZone: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const tasksStore = useTasksStore();

    const handleDragOver = () => {
      tasksStore.setDragOverTarget(props.dropZone);
    };

    const handleDrop = async (event) => {
      event.preventDefault();
      const taskId = parseInt(event.dataTransfer.getData("text/plain"));
      const targetDone = props.dropZone === "completed";
      await tasksStore.handleDrop(taskId, targetDone);
    };

    const handleDragLeave = () => {
      tasksStore.setDragOverTarget(null);
    };
    return {
      handleDragLeave,
      handleDragOver,
      handleDrop,
    };
  },
};
</script>
