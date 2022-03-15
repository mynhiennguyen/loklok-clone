import { createApp } from "vue";
import App from "./App.vue";
import Main from "./Main.vue";
import { store } from "./store";
import ViewingCanvas from "./components/ViewingCanvas.vue";
import {createRouter, createWebHistory} from 'vue-router';

const routes = [
  { path: '/', name: "App", component: App },
  { path: '/canvas', name: "Canvas", component: ViewingCanvas },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const app = createApp(Main)
  .use(router)
  .use(store)
  .mount("#app");
