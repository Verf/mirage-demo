import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import App from "./App.vue";
import router from "./router";
import { makeServer } from "../mock/server";

Vue.config.productionTip = false;

Vue.use(ElementUI);

if (process.env.NODE_ENV === "development") {
  makeServer();
}

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
});
