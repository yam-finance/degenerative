<template>
  <div class="home">
    <div class="home-content">
      <Container :size="900">
        <div class="getdegenerative">
          <div class="large-title">Get Degenerative</div>
          <div class="side">
            <p class="subtitle">Cutting Edge DeFi Derivatives.</p>
            <p class="subtitle sub2">
              Built by
              <b> <a href="https://yam.finance/" target="_blank">Yam</a> </b>. Built on <b> <a href="https://umaproject.org/" target="_blank">UMA</a> </b>.
              Built for Degens.
            </p>
            <p class="justify">
              Degenerative Finance is a collaboration between Yam Finance and the UMA Project to develop a suite of innovative DeFi derivatives, starting with
              the inaugural launch of uGAS, which tracks and hedges the cost of gas on the Ethereum blockchain, and with many more exciting synthetics to come.
            </p>
            <router-link class="grph" to="/assets/ugas">Launch</router-link>
          </div>
        </div>
      </Container>

      <div class="home-details">
        <Container :size="900">
          <div>
            <h2>How to use Degenerative</h2>
            <Space size="sm" />

            <div class="row">
              <div class="item">
                <img src="../assets/graphics/graphic_create.png" />
                <h3>Create</h3>
                <div class="text justify">
                  Deposit ETH as collateral to mint uGAS tokens. Each uGas token represents 1,000,000 gas and expires at 00:00 UTC on the 1st day of the
                  following month. You can withdraw collateral at any time as long as the Minimum Collateral Ratio is maintained.
                </div>
              </div>

              <Space size="64" />

              <div class="item">
                <img src="../assets/graphics/graphic_trade.png" />
                <h3>Trade</h3>
                <div class="text justify">
                  Hold your uGAS tokens until the expiry date or trade them on your favorite DEX to pocket the difference between your minting cost and the uGAS
                  spot price as profit.
                </div>
              </div>
            </div>

            <Space size="32" />

            <div class="row">
              <div class="item">
                <img src="../assets/graphics/graphic_liqudity.png" />
                <h3>Provide Liquidity</h3>
                <div class="text justify">
                  Mint and deposit your uGAS tokens in the Uniswap uGAS/ETH LP to earn UMA liquidity provider rewards. To qualify, users must both mint and
                  deposit their uGAS tokens. Tokens which are traded and then deposited will not qualify.
                </div>
              </div>

              <Space size="64" />

              <div class="item">
                <img src="../assets/graphics/graphic_redeem.png" />
                <h3>Redeem</h3>
                <div class="text justify">
                  Redeem your uGAS tokens upon expiry for ETH. The settlement price for uGAS is based on the rolling 30-day median price of all Ethereum
                  transactions.
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  background: url("../assets/graphics/city.svg") no-repeat center -60px;
  background-size: 1420px 2254px; // 1360px 2164px;
  min-height: 900px;
  @media (max-width: 420px) {
    background-size: 1420px 2564px;
  }
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

.large-title {
  @media (max-width: 420px) {
    font-size: 24px;
  }
}

.getdegenerative {
  min-height: 540px;
  @media (max-width: 420px) {
    min-height: 620px;
  }

  .large-title {
    font-size: 65px;

    @media (max-width: 690px) {
      font-size: 54px;
    }
    @media (max-width: 420px) {
      font-size: 38px;
    }
  }
  .subtitle {
    font-size: 28px;
    font-weight: 100;
    @media (max-width: 420px) {
      font-size: 22px;
    }
  }
  .sub2 {
    font-size: 26px;
    margin-bottom: 12px;
    @media (max-width: 420px) {
      font-size: 22px;
    }
  }
  div {
    font-size: 18px;
    font-weight: 600;
  }
}
.side {
  max-width: 560px;
}

// row
.row {
  display: flex;
  width: 100%;

  @media (max-width: 540px) {
    flex-flow: column nowrap;
    align-items: center;
  }
  div.item {
    flex: 1 1 0%;

    .text {
      line-height: 28px;
    }
  }
  img {
    margin: 0 auto;
  }
}

.home-details {
  background: linear-gradient(var(--back-act-tran) 0%, #ffffff 100%);
  border-top: 4px solid var(--back-act-tran);
  // background: linear-gradient(#e4afabba 0%, #ffffff 100%);
  // border-top: 4px solid #e57067;
  padding-bottom: 20px;

  @media (max-width: 420px) {
    background: #fff7f7;
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
