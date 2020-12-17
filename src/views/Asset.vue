<template>
  <div class="assets">
    <Container :size="800">
      <Card>
        <!-- <h1 class="">Asset: {{ $route.params.key.toUpperCase() }}</h1> -->
        <h1 class="flex">
          <span>{{ $route.params.key.toUpperCase() }}</span>
          <SpacePush />
          <button @click="toNavPage('info')" :class="{ active: navPage === 'info' }">Info</button>
        </h1>
      </Card>

      <Space size="md" />

      <Container :size="440" class="maker">
        <div>
          <div class="tabs">
            <button @click="toNavAct('mint')" :class="{ active: navAct === 'mint' }">Mint</button>
            <button @click="toNavAct('deposit')" :class="{ active: navAct === 'deposit' }">Deposit</button>
            <button @click="toNavAct('redeem')" :class="{ active: navAct === 'redeem' }">Redeem</button>
            <button @click="toNavAct('withdraw')" :class="{ active: navAct === 'withdraw' }">Withdraw</button>
            <button @click="toNavAct('lptrade')" :class="{ active: navAct === 'lptrade' }">LP / Trade</button>
          </div>
          <div id="inputbox">
            <div v-if="navAct !== 'lptrade'">
              <div v-if="navAct === 'withdraw'" class="tabsThree">
                <button @click="toWithdrawType('instant')" :class="{ active: withdrawType === 'instant' }">Instant Withdraw</button>
                <button @click="toWithdrawType('new')" :class="{ active: withdrawType === 'new' }">Request New Withdraw</button>
                <button @click="toWithdrawType('existing')" :class="{ active: withdrawType === 'existing' }">Withdraw</button>
              </div>
              <div class="dropdown">
                <select class="select" tabindex="1" v-model="tokenSelected" v-on:change="getEMPState">
                  <option disabled class="option" value="">Select Token</option>
                  <option id="JAN21" class="option" name="test" value="uGAS-JAN21">uGAS-JAN21</option>
                  <option id="FEB" class="option" name="test" value="uGAS-FEB21">uGAS-FEB21</option>
                  <option id="MAR" class="option" name="test" value="uGAS-MAR21">uGAS-MAR21</option>
                </select>
              </div>
              <input
                v-if="tokenSelected && navAct != 'deposit' && navAct != 'withdraw'"
                id=""
                class="numeric setvalue"
                type="number"
                name=""
                v-model="tokenAmt"
                v-on:keyup="tokenHandler"
                :placeholder="'0.00 ' + (tokenSelected ? tokenSelected + ' ' : '') + 'Token(s)'"
              />
              <input
                v-if="navAct != 'redeem'"
                id=""
                class="numeric setvalue"
                type="number"
                name=""
                v-model="collatAmt"
                v-on:keyup="collatHandler"
                placeholder="0.00 WETH"
                :disabled="navAct == 'withdraw' && withdrawType == 'existing'"
              />
              <!-- to add max button -->
              <div class="error" v-if="hasError">
                {{ this.currentError }}
              </div>
              <!-- <div @click="showDropdown = !showDropdown" class="info-dropdown">
                Info ▼
                <div :class="{ hideDropdown: !showDropdown }">
                  {{ this.currentInfo }}
                </div>
              </div> -->
              <button :disabled="hasError == true" id="act" @click="act" v-bind:class="{ error: hasError }">{{ actName }}</button>
            </div>
            <div v-if="navAct === 'lptrade'">Link to BAL Pools + Instructions</div>

            <div class="info" v-if="info">
              <label
                >Liquidation Price: <b>{{ this.liquidationPrice }}</b></label
              >
              <label
                >Collateral Ratio: <b>{{ this.pricedCR }}</b></label
              >
              <label
                >Collateral Ratio (Global): <b>{{ this.gcr }}</b></label
              >
              <label
                >Collateral Ratio (Tx): <b>{{ this.pricedTxCR }}</b></label
              >
              <label
                >Selected: <b>{{ tokenSelected ? tokenSelected : "None" }}</b></label
              >
            </div>
          </div>
        </div>
      </Container>
    </Container>
  </div>
</template>

<script>
import store from "@/store";
import { mapActions, mapGetters } from "vuex";
import { getLiquidationPrice } from "../utils";
import BigNumber from "bignumber.js";
import { getOffchainPriceFromTokenSymbol, getPricefeedParamsFromTokenSymbol, isPricefeedInvertedFromTokenSymbol } from "../utils/getOffchainPrice";

const ethDecs = new BigNumber(10).pow(new BigNumber(18));
const empDecs = new BigNumber(10).pow(new BigNumber(18));

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export default {
  name: "Asset",
  head: {
    title: "Asset",
    meta: [{ name: "description", content: "Degenerative uGas Asset." }],
  },
  data() {
    return {
      actName: "Mint",
      withdrawType: "new",
      navPage: "info",
      navAct: "mint",
      info: true,
      tokenSelected: null,
      liquidationPrice: 0,
      tokenAmt: null,
      collatAmt: null,
      pricedCR: 0,
      pricedTxCR: 0,
      gcr: 0,
      price: 0,
      collReq: new BigNumber(0),
      existingColl: new BigNumber(0),
      existingTokens: new BigNumber(0),
      hasError: false,
      currentError: null,
      currPos: null,
      currEMP: null,
      // showDropdown: false,
      // currentInfo: "",
    };
  },
  components: {},
  methods: {
    ...mapActions([
      "setEMPState",
      "getYamBalance",
      "getPositionData",
      "mint",
      "deposit",
      "requestWithdrawal",
      "withdrawRequestFinalize",
      "withdraw",
      "redeem",
    ]),
    ...mapGetters(["empState"]),
    checkHasPending() {
      if (this.currPos) {
        if (Number(this.currPos.withdrawalRequestPassTimestamp) != 0) {
          return true;
        }
      }
      return false;
    },
    checkNewWithdraw() {
      if (this.currPos) {
        const tn = new Date().getTime() / 1000;
        if (this.checkHasPending()) {
          this.hasError = true;
          this.currentError = "Existing withdraw request active";
        } else if (Number(this.currPos.rawCollateral) == 0) {
          this.hasError = true;
          this.currentError = "No Collateral to withdraw from this position";
        } else if (tn + Number(this.currEMP.withdrawalLiveness) > Number(this.currEMP.expierationTimestamp)) {
          this.hasError = true;
          this.currentError = "Request expires post-expiry, wait for contract to expire";
        }
      }
    },
    checkWithdraw() {
      if (this.currPos) {
        this.collatAmt = this.currPos.withdrawalRequestAmount;
        const tn = new Date().getTime() / 1000;
        if (Number(this.currPos.withdrawalRequestPassTimestamp) == 0) {
          this.hasError = true;
          this.currentError = "Withdrawal must be requested and approved first";
        } else if (Number(this.currPos.rawCollateral) == 0) {
          this.hasError = true;
          this.currentError = "No Collateral to withdraw from this position";
        } else if (tn < Number(this.currPos.withdrawalRequestPassTimestamp)) {
          this.hasError = true;
          this.currentError = "Withdrawal still pending approval";
        }
      }
    },
    checkInstantWithdraw() {
      if (this.currPos) {
        this.collatAmt = this.currPos.withdrawalRequestAmount;
        const tn = new Date().getTime() / 1000;
        if (this.checkHasPending()) {
          this.hasError = true;
          this.currentError = "Instant withdraw not allowed with active pending withdraw";
        } else if (Number(this.currPos.rawCollateral) == 0) {
          this.hasError = true;
          this.currentError = "No Collateral to withdraw from this position";
        } else if (
          (new BigNumber(this.currPos.rawCollateral) - new BigNumber(this.collatAmt)) / new BigNumber(this.currPos.tokensOutstanding) <
          this.gcr
        ) {
          this.hasError = true;
          this.currentError = "Withdrawal would put position below Global Collat Ratio";
        }
      }
    },
    runChecks() {
      this.hasError = false;
      this.currentError = "";
      this.liquidationPrice = 0;
      if (this.navAct == "withdraw") {
        if (this.withdrawType == "existing") {
          this.checkWithdraw();
        } else if (this.withdrawType == "new") {
          this.checkNewWithdraw();
        } else {
          this.checkInstantWithdraw();
        }
      } else if (this.navAct == "redeem") {
        console.log("is redeem check");
        if (this.checkHasPending()) {
          this.hasError = true;
          this.currentError = "Cannot redeem with an active withdrawal request";
        } else if (Number(this.currPos.tokensOutstanding) == 0) {
          this.hasError = true;
          this.currentError = "No Position Tokens to redeem";
        } else if (Number(this.tokenAmt) > Number(this.currPos.tokensOutstanding)) {
          this.hasError = true;
          this.currentError = "Not enough tokens in position to redeem";
        }
      } else if (this.navAct == "deposit") {
        if (this.checkHasPending()) {
          this.hasError = true;
          this.currentError = "Cannot deposit with an active withdrawal request";
        }
      } else if (this.navAct == "mint") {
        this.liquidationPrice = getLiquidationPrice(
          this.collatAmt,
          this.tokenAmt,
          this.collReq.div(ethDecs),
          isPricefeedInvertedFromTokenSymbol("uGAS")
        ).toFixed(4);
        if (this.tokenAmt && this.tokenAmt < 5) {
          this.hasError = true;
          this.currentError = "Minimum mint amount is 5";
          return;
        }
        const thisError = "Collateral Ratio below global minimum";
        if (!this.hasError || this.currentError == thisError) {
          if (this.pricedCR && Number(this.pricedCR) < Number(this.gcr)) {
            console.log("below gcr", this.pricedCR, this.gcr);
            this.hasError = true;
            this.currentError = thisError;
          } else {
            this.hasError = false;
            this.currentError = "";
          }
        }
      }
    },
    toWithdrawType(on) {
      this.withdrawType = on;
      if (on == "new") {
        this.actName = "Request Withdraw";
        this.hasError = false;
        this.currentError = "";
        this.checkNewWithdraw();
      } else if (on == "existing") {
        this.actName = "Withdraw";
        this.hasError = false;
        this.currentError = "";
        this.checkWithdraw();
      } else if (on == "instant") {
        this.actName = "Instant Withdraw";
        this.hasError = false;
        this.currentError = "";
        this.checkInstantWithdraw();
      }
    },
    empAddr() {
      switch (this.tokenSelected) {
        case "uGAS-JAN21":
          return "0x516f595978d87b67401dab7afd8555c3d28a3af4";
        default:
          return "";
      }
    },
    async getPosition() {
      const pos = await this.getPositionData(this.empAddr());
      return pos;
    },
    async getEMPState() {
      const contractAddr = this.empAddr();
      let k;
      let pos;
      if (this.price == 0) {
        const res = await Promise.all([this.setEMPState(contractAddr), this.lastPrice(), this.getPosition()]);
        k = res[0];
        this.price = res[1];
        pos = res[2];
      } else {
        const res = await Promise.all([this.setEMPState(contractAddr), this.getPosition()]);
        k = res[0];
        pos = res[1];
      }
      this.currPos = pos;
      this.currEMP = k;
      const totalColl = k.cumulativeFeeMultiplier.div(ethDecs).times(k.rawTotalPositionCollateral.dividedBy(ethDecs));
      const totalTokens = k.totalTokensOutstanding.div(empDecs);
      this.gcr = totalTokens > 0 ? (totalColl / totalTokens / this.price).toFixed(4) : 0;
      this.collReq = k.collateralRequirement;
      this.posUpdateHandler();
    },
    async lastPrice() {
      this.price = await getOffchainPriceFromTokenSymbol("uGAS");
      console.log("uGas price", this.price);
      return this.price;
    },
    act() {
      console.log("Act");
      switch (this.actName) {
        case "Mint":
          console.log("mint");
          this.mint({
            contract: this.empAddr(),
            collat: new BigNumber(this.collatAmt).times(ethDecs).toString(),
            tokens: new BigNumber(this.tokenAmt).times(empDecs).toString(),
          });
          break;
        case "Deposit":
          console.log("deposit");
          this.deposit({ contract: this.empAddr(), collat: new BigNumber(this.collatAmt).times(ethDecs).toString() });
          break;
        case "Request Withdraw":
          console.log("req withdraw");
          this.requestWithdrawal(new BigNumber(this.collatAmt).times(ethDecs).toString());
          break;
        case "Withdraw":
          console.log("withdraw");
          this.withdrawRequestFinalize();
          break;
        case "Instant Withdraw":
          console.log("instant withdraw");
          this.withdraw(new BigNumber(this.collatAmt).times(ethDecs).toString());
          break;
        case "Redeem":
          console.log("redeem");
          this.redeem(new BigNumber(this.tokenAmt).times(empDecs).toString());
          break;
      }
    },
    toNavPage(on) {
      this.navPage = on;
      console.log("toNavPage", on);
    },
    toNavAct(on) {
      this.hasError = false;
      this.currentError = "";
      this.navAct = on;
      this.actName = toTitleCase(on);
      if (on == "withdraw") {
        this.toWithdrawType("new");
      }
      this.runChecks();
      console.log("toNavAct", on);
    },
    tokenHandler() {
      this.posUpdateHandler();
    },
    collatHandler() {
      this.posUpdateHandler();
    },
    async posUpdateHandler() {
      if (this.price == 0) {
        await this.lastPrice();
      }

      const resultantCR = this.tokenAmt > 0 ? Number(this.collatAmt) / Number(this.tokenAmt) : 0;
      this.pricedTxCR = this.price !== 0 ? (resultantCR / this.price).toFixed(4) : 0;
      const newCollat = Number(this.collatAmt) + Number(this.existingColl);
      const newPos = Number(this.tokenAmt) + Number(this.existingTokens);
      this.pricedCR = newPos > 0 ? (newCollat / newPos / this.price).toFixed(4) : 0;
      this.runChecks();
    },
  },
  mounted() {
    this.lastPrice();
  },
};
</script>

<style lang="scss" scoped>
.maker {
  zoom: 1;
}
.hideDropdown {
  display: none;
}
.error {
  color: var(--primary);
  background: var(--back-act);
  text-align: center;
}
#inputbox {
}
.tabs {
  border-radius: 10px 10px 0px 0px;
  // border-radius: 10px;
  overflow: hidden;
  white-space: nowrap;
  button {
    cursor: pointer;
    width: calc(100% / 5);
    // border-radius: 10px;
    border: none;
    height: 50px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.1s linear;
    color: var(--primary);
    background: var(--back-act);

    &.active,
    &:hover {
      color: #fff;
      background: var(--primary);
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.tabsThree {
  overflow: hidden;
  white-space: nowrap;
  button {
    cursor: pointer;
    width: calc(100% / 3);
    // border-radius: 10px;
    border: none;
    height: 50px;
    font-size: 11px;
    font-weight: 500;
    transition: all 0.1s linear;
    color: var(--primary);
    background: var(--back-act);

    &.active,
    &:hover {
      color: #fff;
      background: var(--primary);
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.info {
  font-size: 12px;
  margin: 0px 8px 0px 8px;
  padding: 4px 10px 8px 10px;
  color: #00000080;
  /* background: #ffe7e721; */
  border-radius: 0px 0px 10px 10px;
  label {
    display: block;
  }
}
.numeric {
  width: 100%;
  border: 0px;
  background: white;
  height: 50px;
  padding: 20px;
}
.setvalue {
  width: 100%;
  border: 0px;
  background: var(--back-act);
  color: #ff4a4a;
  // font-weight: 800;
  height: 50px;
  padding: 10px;
  font-size: 22px;
  // font-family: "Share Tech Mono", monospace;
  font-family: "Inconsolata", monospace;
  &::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: rgba(255, 74, 74, 0.2);
    opacity: 1; /* Firefox */
  }

  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: rgba(255, 74, 74, 0.2);
  }

  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: rgba(255, 74, 74, 0.2);
  }
}
.dropdown {
  border-radius: 0px 0px 10px 10px;

  .select {
    display: flex;
    flex-direction: column;
    position: relative;
    // font-family: "Share Tech Mono", monospace;
    font-family: "Inconsolata", monospace;
    height: 40px;
    font-size: 22px;
    width: 100%;
    // font-weight: 600;
    // margin-top: 20px;
    border: none;
    background-image: none;
    background-color: transparent;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    background: #fff;
    background: var(--back-act);
  }

  .option {
    cursor: pointer;
    padding: 0 30px 0 10px;
    min-height: 40px;
    display: flex;
    align-items: center;
    background: var(--back-act);
    border-top: var(--back-act) solid 1px;
    color: #ff4a4a;
    position: absolute;
    top: 0;
    width: 100%;
    pointer-events: none;
    order: 2;
    z-index: 1;
    transition: background 0.4s ease-in-out;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
  }

  .select:focus .option {
    position: relative;
    pointer-events: all;
  }

  input {
    opacity: 0;
    position: absolute;
    left: -99999px;
  }

  input:checked + label {
    order: 1;
    z-index: 2;
    background: #fff;
    background: var(--back-act);
    border-top: none;
    position: relative;
  }

  input:checked + label:after {
    content: "";
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #ff4a4a;
    position: absolute;
    right: 10px;
    top: calc(50% - 2.5px);
    pointer-events: none;
    z-index: 3;
  }

  input:checked + label:before {
    position: absolute;
    right: 0;
    height: 40px;
    width: 40px;
    content: "";
    background: #fff;
    background: var(--back-act);
  }
}
#act {
  cursor: pointer;
  color: #ff4a4a;
  background: #ffe7e7;
  height: 50px;
  font-size: 20px;
  font-weight: 600;
  border: 0px;
  border-radius: 0px 0px 10px 10px;
  width: 100%;
  transition: background 0.1s ease-in-out;

  // &:hover {
  //   background: #ffe7e7;
  // }
  &:active {
    background: #ffe1e1;
  }
}
#act.error {
  cursor: not-allowed;
  color: #888888 !important;
}

.info-dropdown {
  cursor: pointer;
  color: var(--primary);
  background: var(--back-act);
  text-align: center;
}
</style>
