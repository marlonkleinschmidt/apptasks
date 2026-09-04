<template>
  <router-link
    :to="redirectTo"
    :class="[
      'px-6 py-3 text-app-purple-500 dark:text-app-purple-400 font-medium',
      'rounded-lg border border-transparent transition-all duration-200',
      'hover:bg-app-purple-500 dark:hover:bg-app-purple-600',
      'hover:text-white hover:no-underline hover:border-app-purple-500',
      'dark:hover:border-app-purple-400',
    ]"
  >
    {{ title }}
  </router-link>
</template>
<script>
export default {
  name: "MenuItem",
  props: {
    redirectTo: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
