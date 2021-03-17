<template>
  <div class="home">
    <div class="banner"></div>
    <Space size="sm" style="display:flex" />
    <Container :size="900">
      <div class="getdegenerative degenerative">
        <div class="large-title">Get Degenerative</div>
        <p class="subtitle">Cutting Edge DeFi Derivatives.</p>
        <p class="subtitle">TVL: {{ combinedTVL }}</p>
      </div>
      <div class="row">
        <div class="item">
          <router-link class="grph" to="/asset/ustonks">uSTONKS</router-link>
          <p>
            Introducing uSTONKS, a synthetic that tracks the ten most bullish Wall Street Bets stocks and captures the sentiment of the r/WSB community.
          </p>
          <p>
            <b><router-link to="/asset/ustonks">Mint + LP uSTONKS</router-link></b> – Earn High APR Rewards.
          </p>
          <p>
            Bonus #1: Extra 5,000 $YAM and 5,000 $UMA tokens will be distributed as liquidity mining rewards from March 8th to 14th.
          </p>
          <p>
            Bonus #2: Extra 10,000 $YAM and 10,000 $UMA tokens will be distributed as liquidity mining rewards from March 15th to 29th.
          </p>
        </div>

        <Space class="desktop-display" size="64" />
        <Space class="mobile-display" size="16" />

        <div class="item">
          <router-link class="grph" to="/asset/ugas">uGAS</router-link>
          <p>
            Check out uGAS, our synthetic futures contract that settles to the 30-Day Median Ethereum Gas Price.
          </p>
          <p>
            Speculate on Ethereum gas prices with a Long or Short uGAS position. uGAS can be used as a hedge against the cost of gas on the Ethereum blockchain.
          </p>
          <p>
            <b><router-link to="/asset/ugas">Mint + LP uGAS</router-link></b> – Earn High APR Rewards.
          </p>
          <p>
            Mint uGAS and provide liquidity to the uGAS/ETH pool to earn $YAM & $UMA Rewards.
          </p>
        </div>
      </div>
    </Container>

    <Space class="mobile-display" size="32" />

    <div class="home-details">
      <Container :size="900">
        <div>
          <h2>How to use Degenerative</h2>
          <Space size="sm" />

          <div class="row">
            <div class="item">
              <img src="../assets/graphics/graphic_liquidity.png" />
              <h3>Mint + LP</h3>
              <div class="text justify">
                Mint and deposit synthetic tokens in the corresponding Uniswap pool to earn UMA and Yam liquidity provider rewards. To qualify, users must both
                mint and deposit their synth tokens. Tokens which are traded and then deposited will not qualify.
              </div>
            </div>

            <Space size="64" />

            <div class="item">
              <img src="../assets/graphics/graphic_trade.png" />
              <h3>Trade</h3>
              <div class="text justify">
                Hold your synth tokens until the expiry date or trade them on your favorite DEX to pocket the difference between your minting cost and the
                synthetics spot price as profit.
              </div>
            </div>
          </div>

          <Space size="32" />

          <div class="row">
            <div class="item">
              <img src="../assets/graphics/graphic_create.png" />
              <h3>Go Short</h3>
              <div class="text justify">
                Deposit collateral to mint synth tokens and sell them on Uniswap. After the synth token price has fallen, buy back your position and unlock the
                collateral.
              </div>
            </div>

            <Space size="64" />

            <div class="item">
              <img src="../assets/graphics/graphic_redeem.png" />
              <h3>Redeem</h3>
              <div class="text justify">
                If you minted the synth, you can redeem at any time before or after expiry to retrieve your collateral. We give you full flexibility to make
                sure you can do with your collateral whatever you like.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      combinedTVL: false,
    };
  },
  computed: {
    style() {
      return null;
    },
  },
  async mounted() {
    await this.initHome();
  },
  methods: {
    ...mapActions(["getEmpTVL"]),
    async initHome() {
      this.combinedTVL = this.getEmpTVL({ combine: true });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  background-size: 1420px 2254px;
  min-height: 900px;
  @media (max-width: 420px) {
    background-size: 1420px 2564px;
  }
}
.banner {
  background: url("../assets/graphics/degen_city.png") center no-repeat;
  height: 563px;
  width: 100%;
  @media (max-width: 620px) {
    background-size: 770px;
    height: 226px;
  }
}
.home-columns {
  display: flex;
  flex-direction: row;
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
      font-size: 18px;
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

    p {
      margin-bottom: 20px;
    }
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
