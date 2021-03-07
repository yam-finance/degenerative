<template>
  <div id="app">
    <Header />
    <Space size="sm" style="display:flex" />
    <router-view />
    <SpacePush />
    <!-- <Space size="sm" style="display:flex" /> -->
    <Footer />
  </div>
</template>

<style lang="scss">
#app {
  // font-family: Helvetica, Arial, sans-serif;
  font-family: "Shanti", sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  head: {
    title: "Home",
    titleTemplate: "%s - Degenerative",
  },
  methods: {},
  computed: mapState(["lang"]),
  watch: {
    lang() {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      // this.$router.replace({ params: { lang: this.lang } }).catch(() => {});
    },
  },
};
</script>
