import Vue from "vue";
import VueMeta from "vue-meta";
import iView from "iview";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import mixins from "@/mixins";
import moment from "moment";
import ECharts from "vue-echarts";
import { Laue } from "laue";
import { VuePicker, VuePickerOption } from "@invisiburu/vue-picker";
import BeatLoader from "vue-spinner/src/PulseLoader.vue";
import VTooltip from "v-tooltip";
import "@/plugins/graphql";
import "@/plugins/tooltip/tooltip.scss";
import "@/store/auth";
import "@/filters";
import "@/styles.scss";
import "animate.css";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/candlestick";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/dataZoom";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/tooltip";
import "@invisiburu/vue-picker/dist/vue-picker.min.css";

Vue.mixin(mixins);
Vue.use(VueMeta, { keyName: "head" });
Vue.use(iView);
Vue.use(Laue);
Vue.use(VTooltip);

Vue.component("Header", () => import("@/components/Header.vue"));
Vue.component("Footer", () => import("@/components/Footer.vue"));
Vue.component("Card", () => import("@/components/Card.vue"));
Vue.component("GasStats", () => import("@/components/ugas/GasStats.vue"));
Vue.component("CardLink", () => import("@/components/CardLink.vue"));
Vue.component("Button", () => import("@/components/Button.vue"));
Vue.component("chart", ECharts);
Vue.component("VuePicker", VuePicker);
Vue.component("VuePickerOption", VuePickerOption);
Vue.component("beat-loader", BeatLoader);

// palette repo
Vue.component("Container", () => import("@/repo_palette/Container.vue"));
Vue.component("Space", () => import("@/repo_palette/Space.vue"));
Vue.component("SpacePush", () => import("@/repo_palette/SpacePush.vue"));
Vue.component("Swipe", () => import("@/repo_palette/Swipe.vue"));

Vue.config.productionTip = false;
Vue.prototype.eth = {};
Vue.prototype.moment = moment;

new Vue({
  router,
  store,
  // apollo: Vue.prototype.gql.provider,
  render: h => h(App),
}).$mount("#app");
