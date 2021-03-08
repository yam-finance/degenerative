<template>
  <div class="home">
    <Container :size="900">
      <img class="banner" src="../assets/graphics/degen_city.png" alt="" />
      <div class="getdegenerative degenerative">
        <div class="large-title">Get Degenerative</div>
        <p class="subtitle">Cutting Edge DeFi Derivatives.</p>
      </div>
      <div class="row">
        <div class="col">
          <p>
            Introducing uSTONKS, a synthetic that tracks the ten most bullish Wall Street Bets stocks and captures the sentiment of the r/WSB community.
          </p>
          <p><b>Mint + Stake uSTONKS</b> – Earn High APR Rewards.</p>
          <p>
            Bonus #1: Extra 5,000 $YAM and 5,000 $UMA tokens will be distributed as liquidity mining rewards from March 8th to 14th.
          </p>
          <p>
            Bonus #2: Extra 10,000 $YAM and 10,000 $UMA tokens will be distributed as liquidity mining rewards from March 15th to 29th.
          </p>
        </div>

        <div class="col">
          <p>
            Check out uGAS, our synthetic futures contract that settles to the 30-Day Median Ethereum Gas Price.
          </p>
          <p>
            Speculate on Ethereum gas prices with a Long or Short uGAS position. uGAS can be used as a hedge against the cost of gas on the Ethereum blockchain.
          </p>
          <p><b>Mint + Stake uGAS</b> – Earn High APR Rewards.</p>
          <p>
            Mint uGAS and provide liquidity to the uGAS/ETH pool to earn $YAM & $UMA Rewards.
          </p>
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
                Deposit ETH as collateral to mint uGAS tokens. Each uGas token represents 1,000,000 gas and expires at 00:00 UTC on the 1st day of the following
                month. You can withdraw collateral at any time as long as the Minimum Collateral Ratio is maintained.
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
</template>

<style lang="scss" scoped>
.home {
  max-width: 900px;
}
.banner {
  padding-bottom: 20px;
  width: 100%;
  margin: auto;
}
.home-columns {
  display: flex;
  flex-direction: row;
}
.col {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;

  p {
    margin-bottom: 20px;
  }
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
  padding-bottom: 20px;

  .large-title {
    font-size: 54px;
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

a {
  color: var(--primary);
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
