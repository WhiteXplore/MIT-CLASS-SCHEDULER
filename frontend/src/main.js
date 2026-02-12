import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";

import { createPinia } from "pinia";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const app = createApp(App);
const pinia = createPinia();

app
  .use(store)
  .use(router)
  .use(pinia)
  .use(Vue3Toastify, {
    autoClose: 1000,
    position: "top-right",
    theme: "light",
  })
  .mount("#app");
