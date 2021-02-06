import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import Assets from "@/views/Assets.vue";
import Asset from "@/views/Asset.vue";
import About from "@/views/About.vue";
import Positions from "@/views/Positions.vue";
import LearnMore from "@/views/LearnMore.vue";
import NotFound from "@/views/NotFound.vue";
import Account from "@/views/Account.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/assets",
    name: "Assets",
    component: Assets,
  },
  {
    path: "/assets/:key",
    name: "Assets",
    component: Asset,
  },
  {
    path: "/faq",
    name: "Learn More",
    component: LearnMore,
  },
  //   {
  //     path: "/account",
  //     name: "Account",
  //     component: Account,
  //   },
  {
    path: "/positions",
    name: "Positions",
    component: Positions,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/404",
    name: "404",
    component: NotFound,
    props: true,
  },
  {
    path: "*",
    redirect: "404",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
  base: process.env.BASE_URL,
  scrollBehavior(to, from, saved) {
    if (saved) {
      return saved;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  // console.log("load", to.name);
  // fix
  // progress.done();
  next();
});
router.afterEach((to, from) => {
  // console.log("load end", to.name);
  // fix
  // progress.done();
});

export default router;
