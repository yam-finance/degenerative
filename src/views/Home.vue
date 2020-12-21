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

        <div>
          <h1>How to use Degenerative</h1>
          <Space size="sm" />

          <div class="row">
            <div class="item">
              <img src="../assets/graphics/graphic_create.svg" />
              <h4>Create</h4>
              <div>
                Deposit ETH as collateral to mint uGAS tokens. Each uGas token represents 1,000,000 gas and expires at 00:00 UTC on the 1st day of the following
                month. You can withdraw collateral at any time as long as the Minimum Collateral Ratio is maintained
              </div>
            </div>

            <Space size="32" />

            <div class="item">
              <img src="../assets/graphics/graphic_trade.svg" />
              <h4>Trade</h4>
              <div>
                Hold your uGAS tokens until the expiry date or trade them on your favorite DEX to pocket the difference between your minting cost and the uGAS
                spot price as profit.
              </div>
            </div>
          </div>

          <Space size="32" />

          <div class="row">
            <div class="item">
              <img src="../assets/graphics/graphic_liqudity.svg" />
              <h4>Provide Liquidity</h4>
              <div>
                Mint and deposit your uGAS tokens in the Uniswap uGAS/ETH LP to earn UMA liquidity provider rewards. To qualify, users must both mint and
                deposit their uGAS tokens. Tokens which are traded and then deposited will not qualify.
              </div>
            </div>

            <Space size="32" />

            <div class="item">
              <img src="../assets/graphics/graphic_redeem.svg" />
              <h4>Redeem</h4>
              <div>
                Redeem your uGAS tokens upon expiry for ETH. The settlement price for uGAS is based on the rolling 30-day median and 2-hour TWAP of gas.
              </div>
            </div>
          </div>
        </div>
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
  min-height: 980px;
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

.row {
  display: flex;
  width: 100%;

  div.item {
    flex: 1 1 0%;
  }
  img {
    margin: 0 auto;
  }
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
