<template>
  <div class="home">
    <div class="home-content">
      <Container :size="1000">
        <Card>
          <h1 class="">Homepage incoming</h1>
        </Card>
        <!-- <div class="degenerative">Degenerative</div> -->
      </Container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-content {
  z-index: 2;
  position: relative;
}
.degenerative {
  font-size: 94px;
  font-weight: 800;
  text-align: center;
}
</style>

<script>
export default {
  name: "Home",
  head: {},
  data() {
    return {
      delay: 200,
      scroller: 0,
    };
  },
  components: {},
  //   methods: {},
  //   created() {},
  //   destroyed() {},
  mounted() {
    if (this.wavesActive) {
      this.showWaves();
    }
  },
};
</script>
