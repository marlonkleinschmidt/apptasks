import "./style.css";
import { createApp } from "vue";
import router from "./router/index.ts";
import App from "./App.vue";
import { createPinia } from "pinia";

const pinia = createPinia();

createApp(App).use(pinia).use(router).mount("#app");
