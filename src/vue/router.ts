import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "./pages/LandingPage.vue";
import CategoryDetail from "./pages/CategoryDetail.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: LandingPage,
    },
    {
      path: "/category/:slug",
      component: CategoryDetail,
    },
  ],
});
