<template>
  <div id="app">
    <Header />
    <router-view />
    <!-- <Footer /> -->
  </div>
</template>

<style lang="scss">
#app {
  // font-family: Helvetica, Arial, sans-serif;
  font-family: "Shanti", sans-serif;
}
</style>

<script>
export default {
  name: "App",
  head: {
    title: "Home",
    titleTemplate: "%s - Degenerative",
  },
  methods: {},
};
</script>
