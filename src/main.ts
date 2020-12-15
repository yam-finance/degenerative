import Vue from "vue";
import VueMeta from "vue-meta";
import iView from "iview";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import mixins from "@/mixins";
import "@/store/auth";
import "@/filters";
import "@/styles.scss";
import "animate.css";

Vue.config.productionTip = false;
Vue.mixin(mixins);
Vue.use(VueMeta, { keyName: "head" });
Vue.use(iView);

Vue.component("Header", () => import("@/components/Header.vue"));
Vue.component("Card", () => import("@/components/Card.vue"));
Vue.component("Button", () => import("@/components/Button.vue"));

// palette repo
Vue.component("Container", () => import("@/repo_palette/Container.vue"));
Vue.component("Space", () => import("@/repo_palette/Space.vue"));
Vue.component("SpacePush", () => import("@/repo_palette/SpacePush.vue"));
Vue.component("Swipe", () => import("@/repo_palette/Swipe.vue"));

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
