import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter)

const routes = [
  {
    path: "/demo",
    component: () => import("@/views/demo/index"),
  },
  {
    path: "/",
    redirect: "/demo",
  },
];

const router = new VueRouter({
  routes,
});

export default router;
