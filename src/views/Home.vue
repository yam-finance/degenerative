<template>
  <div class="home">
    <div class="home-content">
      <Container :size="1000">
        <div class="getdegenerative">
          <h1>Get Degenerative</h1>
          <div class="side">
            <p class="subtitle">Cutting Edge DeFi Derivatives</p>
            <p class="subtitle sub2">
              Built by <b><a href="https://yam.finance/">Yam</a></b
              >. Built on <b><a href="https://umaproject.org/">UMA</a></b
              >. Built for Degens.
            </p>
            <p>
              Degenerative Finance is a collaboration between Yam Finance and the UMA Project to develop a suite of innovative DeFi derivatives, starting with
              the inaugural launch of uGAS, which tracks and hedges the cost of gas on the Ethereum blockchain, and with many more exciting synthetics to come.
            </p>
            <router-link class="grph" to="/assets/ugas">Launch</router-link>
          </div>
        </div>
        <!-- <h1>Get Degenerative</h1> -->
      </Container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  background: url("../assets/graphics/city.svg") no-repeat center -60px;
  background-size: 1420px 2254px; // 1360px 2164px;
  min-height: 900px;
}
.home-content {
  z-index: 2;
  position: relative;
}
.degenerative {
  font-size: 94px;
  font-weight: 800;
  text-align: center;
}

.getdegenerative {
  min-height: 960px;
  h1 {
    font-size: 85px;
  }
  .subtitle {
    font-size: 28px;
    font-weight: 100;
  }
  .sub2 {
    font-size: 26px;
    margin-bottom: 12px;
  }
  div {
    font-size: 18px;
    font-weight: 600;
  }
}
.side {
  max-width: 560px;
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
