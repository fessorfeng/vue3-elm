import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/";
import "./config/rem";

import router from "./router/router";

const app = createApp(App);
app.use(store)
  .use(router).mount("#app");
