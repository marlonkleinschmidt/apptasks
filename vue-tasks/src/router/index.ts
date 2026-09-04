import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/tasks",
      name: "tasks",
      component: () => import("../views/TasksView.vue"),
      meta: { requireAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/login",
    },
  ],
});

export default router;
