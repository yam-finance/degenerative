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
export default {
  name: "App",
  head: {
    title: "Home",
    titleTemplate: "%s - Degenerative",
  },
  methods: {},
};
</script>
