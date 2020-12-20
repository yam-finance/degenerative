<template>
  <div class="assets">
    <Container :size="800">
      <Card>
        <!-- <h1 class="">Asset: {{ $route.params.key.toUpperCase() }}</h1> -->
        <h1 class="flex">
          <span>{{ $route.params.key.toUpperCase() }}</span>
          <SpacePush />
          <button class="infoswitch" v-if="navPage === 'interact'" @click="toNavPage('info')" :class="{ active: navPage === 'info' }">Info</button>
          <button class="infoswitch" v-if="navPage === 'info'" @click="toNavPage('interact')" :class="{ active: navPage === 'interact' }">Intract</button>
        </h1>
      </Card>

      <Space size="md" />

      <div v-if="navPage === 'interact'">
        <Container :size="440" class="maker">
          <div v-if="this.assetChartData">
            <div class="chart-asset">
              <chart :options="chartOptionsCandle" />
            </div>
          </div>

          <div id="thebox">
            <div class="tabs">
              <button @click="toNavAct('mint')" :class="{ active: navAct === 'mint' }">Mint</button>
              <button @click="toNavAct('deposit')" :class="{ active: navAct === 'deposit' }">Deposit</button>
              <button @click="toNavAct('redeem')" :class="{ active: navAct === 'redeem' }">Redeem</button>
              <button @click="toNavAct('withdraw')" :class="{ active: navAct === 'withdraw' }">Withdraw</button>
              <button @click="toNavAct('lptrade')" :class="{ active: navAct === 'lptrade' }">LP/Trade</button>
            </div>
            <div id="inputbox">
              <div v-if="navAct !== 'lptrade'">
                <div v-if="navAct === 'withdraw'" class="subtabs">
                  <button @click="toWithdrawType('instant')" :class="{ active: withdrawType === 'instant' }">Instant Withdraw</button>
                  <button @click="toWithdrawType('new')" :class="{ active: withdrawType === 'new' }">Request New Withdraw</button>
                  <button @click="toWithdrawType('existing')" :class="{ active: withdrawType === 'existing' }">Withdraw</button>
                </div>
                <div class="dropdown">
                  <!-- <select class="" v-model="tokenSelected" v-on:change="getEMPState">
                  <option value="" data-display-text="uGAS Tokens">None</option>
                  <option value="uGAS_JAN21">uGAS JAN21</option>
                  <option value="uGAS_FEB21">uGAS FEB21</option>
                  <option value="uGAS_MAR21">uGAS MAR21</option>
                </select> -->

                  <vue-picker class="select" v-model="tokenSelected" v-on:change="getEMPState" placeholder="Select uGas Token" autofocus>
                    <vue-picker-option value="">Select uGas Token</vue-picker-option>
                    <vue-picker-option value="uGAS_JAN21">uGAS JAN21</vue-picker-option>
                    <vue-picker-option value="uGAS_FEB21">uGAS FEB21</vue-picker-option>
                    <vue-picker-option value="uGAS_MAR21">uGAS MAR21</vue-picker-option>
                  </vue-picker>
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
                <button :disabled="hasError == true" id="act" @click="act" v-bind:class="{ error: hasError }">
                  {{ $store.state.approvals.tokenEMP === true ? actName : "Approve" }}
                </button>
              </div>
              <div class="uniswap-info" v-if="navAct === 'lptrade'">
                <h2>Unsiwap</h2>
                <div><a href="#">Uniswap LP</a></div>
                <div><a href="#">Trade uGas on Uniswap.</a></div>
              </div>
            </div>
          </div>
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
            <br />
            <label
              >Your WETH: <b>{{ balanceWETH ? balanceWETH : "0" }}</b></label
            >
            <label
              >Your UGASX: <b>{{ balanceUGAS ? balanceUGAS : "0" }}</b></label
            >
          </div>
        </Container>

        <!-- <Container :size="800">
          <div>
            <div class="chart-asset">
              <chart :options="chartOptionsCandle" />
            </div>
          </div>
        </Container> -->
      </div>

      <div v-if="navPage === 'info'">
        <Container :size="800">
          <div id="">
            <la-cartesian narrow :bound="[n => n - 40, n => n + 40]" :data="chartOptionsMedianValues" :width="800 - 60" :height="300 - 60">
              <la-line dot animated curve :width="2" prop="value" color="var(--primary)">
                <g slot-scope="props" fill="rgb(255 74 74 / 50%)" :font-size="12">
                  <text :x="props.x" :y="props.y" text-anchor="middle" dy="-.5em">
                    {{ props.value }}
                  </text>
                </g></la-line
              >
              <la-x-axis prop="name" color="rgb(0 0 0 / 40%)" font-weight="bold" :font-size="12"></la-x-axis>
              <!-- <la-y-axis prop="value"></la-y-axis> -->
            </la-cartesian>
          </div>
        </Container>
      </div>
    </Container>
  </div>
</template>

<script>
import store from "@/store";
import { mapActions, mapGetters } from "vuex";
import { approve, decToBn, getLiquidationPrice, getTWAPData, getUniswapDataHourly, getUniswapDataDaily, splitChartData } from "../utils";
import BigNumber from "bignumber.js";
import { getOffchainPriceFromTokenSymbol, getPricefeedParamsFromTokenSymbol, isPricefeedInvertedFromTokenSymbol } from "../utils/getOffchainPrice";
import { ChainId, Tokenl, Fetcher } from "@uniswap/sdk";
import { UGAS_JAN21 } from "@/utils/addresses";

const ethDecs = new BigNumber(10).pow(new BigNumber(18));
const empDecs = new BigNumber(10).pow(new BigNumber(18));

export default {
  name: "Asset",
  head: {
    title: "Asset",
    meta: [{ name: "description", content: "Degenerative uGas Asset." }],
  },
  data() {
    return {
      navPage: "interact",
      actName: "Mint",
      withdrawType: "new",
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
      chartOptionsMedianValues: [{ name: "Initializing", value: 200 }],
      chartOptionsCandle: {},
      balanceWETH: 0,
      balanceUGAS: 0,
      assetChartData: null,
      // showDropdown: false,
      // currentInfo: "",
    };
  },
  mounted() {
    this.initAsset();
    this.lastPrice();
    this.initChart();
    this.getWETHBalance();

    this.checkTime();
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
      "getUserWETHBalance",
      "getApprovalEMP",
      "fetchAllowanceEMP",
    ]),
    ...mapGetters(["empState"]),
    async initAsset() {
      this.fetchAllowance(); // checks Approval

      // const from = 1606742010;
      // const hourly = await getUniswapDataHourly(UGAS_JAN21, from);
      // console.log("UGAS_JAN21 getUniswapDataHourly", hourly);
      // const daily = await getUniswapDataDaily(UGAS_JAN21, from);
      // console.log("UGAS_JAN21 getUniswapDataDaily", daily);
      // this.assetChartData = daily;
    },
    async getWETHBalance() {
      this.balanceWETH = await this.getUserWETHBalance();
    },
    async initChart() {
      const redColor = "#ad3c3c";
      const redBorderColor = "#ad3c3c";
      const greenColor = "#48ad3c";
      const greenBorderColor = "#48ad3c";
      const twapLineColor = "#333";

      const from = 1606742010; // NOV: 1606742010 - test: 1604150010
      // const assetChart = await getUniswapDataHourly(UGAS_JAN21, from); // Hourly
      const assetChart = await getUniswapDataDaily(UGAS_JAN21, from); // Daily
      // console.log("UGAS_JAN21 assetChart", assetChart);

      const tempChartData = [];
      const tempChartTWAPData = [];
      for (const element of assetChart) {
        tempChartData.push([element.timestampDate, element.openETH, element.closeETH, element.openETH, element.closeETH]);
        tempChartTWAPData.push(element.twapETH);
      }

      // chart: uniswap data
      this.assetChartData = splitChartData(tempChartData);
      // this.assetChartData = splitChartData([
      //   ["07/01/2020", 320, 320, 287, 362],
      //   ["06/19/2020", 190, 148, 126, 190],
      // ]);
      const colors = ["#5793f3", "#d14a61", "#675bba"];

      this.chartOptionsCandle = {
        title: {
          // text: "Price in ETH",
          left: 0,
        },
        // legend: {
        //   data: ["uGAS"],
        // },
        tooltip: {
          show: false,
          trigger: "item",
          axisPointer: {
            type: "cross",
          },
        },
        grid: {
          top: "4%",
          left: "12%", // 6
          bottom: "10%",
          right: "4%",
        },
        toolbox: {
          show: false,
          feature: {
            dataView: { show: false, readOnly: false },
            magicType: { show: false, type: ["line", "bar"] },
            saveAsImage: { show: true },
            restore: { show: true },
          },
        },
        xAxis: {
          type: "category",
          data: this.assetChartData.categoryData,
          scale: true,
          boundaryGap: false,
          splitLine: { show: true },
          splitArea: {
            show: false,
            areaStyle: {
              color: [],
            },
          },
          axisLabel: {
            show: true,
            fontSize: 9,
          },
          axisLine: {
            onZero: false,
            // lineStyle: {
            //   color: colors,
            // },
          },
          splitNumber: 20,
          min: "dataMin",
          max: "dataMax",
        },
        yAxis: {
          scale: true,
          splitLine: { show: true },
          splitArea: {
            show: false,
            areaStyle: {
              color: [],
            },
          },
          axisLabel: {
            show: true,
            fontSize: 9,
            margin: 15,
          },
        },
        dataZoom: [
          {
            type: "inside",
            start: 45,
            end: 100,
          },
          {
            show: false,
            type: "slider",
            top: "90%",
            start: 45,
            end: 100,
          },
        ],
        series: [
          {
            name: "uGas",
            type: "candlestick",
            data: this.assetChartData.values,
            markPoint: {
              data: [
                { name: "年最高", value: 0.04, xAxis: 7, yAxis: 15 },
                { name: "年最低", value: 0.047, xAxis: 11, yAxis: 2 },
              ],
            },
            itemStyle: {
              color: greenColor,
              color0: redColor,
              borderColor: greenBorderColor,
              borderColor0: redBorderColor,
            },
          },
          {
            name: "TWAP",
            type: "line",
            data: tempChartTWAPData,
            smooth: false,
            symbolSize: 3,
            itemStyle: {
              color: twapLineColor,
            },
            lineStyle: {
              width: 1,
              opacity: 0.6,
            },
          },
        ],
      };

      // chart: median data
      // this.values = [
      //   { name: "Jan", value: 200 },
      //   { name: "Feb", value: 420 },
      //   { name: "Mar", value: 420 },
      //   { name: "Apr", value: 420 },
      //   { name: "May", value: 420 },
      //   { name: "Jun", value: 420 },
      //   { name: "Jul", value: 420 },
      //   { name: "Aug", value: 420 },
      //   { name: "Sep", value: 420 },
      //   { name: "Oct", value: 420 },
      //   { name: "Nov", value: 420 },
      //   { name: "Dec", value: 420 },
      // ];
      this.chartOptionsMedianValues = [];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      for (let i = 0; i < months.length; i++) {
        this.chartOptionsMedianValues.push({
          name: months[i],
          value: Math.floor(Math.random() * (420 - 25 + 1) + 25),
        });
      }
    },
    checkTime() {
      // checking if current time and 1day is greater than withdrawTime
      const current = this.moment();
      const withdrawTime = this.moment(1608332874734);
      const result = this.moment(current).isAfter(withdrawTime.add(1, "days")); // false
      // const result = this.moment(current.add(1, "days")).isAfter(withdrawTime); // true
      // console.log("result", result);
    },
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
        } else if ((new BigNumber(this.currPos.rawCollateral) - new BigNumber(this.collatAmt)) / new BigNumber(this.currPos.tokensOutstanding) < this.gcr) {
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
        } else if (this.currPos && Number(this.currPos.tokensOutstanding) == 0) {
          this.hasError = true;
          this.currentError = "No Position Tokens to redeem";
        } else if (this.currPos && Number(this.tokenAmt) > Number(this.currPos.tokensOutstanding)) {
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
        case "uGAS_JAN21":
          return "0x516f595978d87b67401dab7afd8555c3d28a3af4";
        case "uGAS_FEB21":
          return "0x0";
        case "uGAS_MAR21":
          return "0x0";
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
    async act() {
      console.log("Act");
      if (!store.state.approvals.tokenEMP) {
        await this.getApproval();
      } else {
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
      this.actName = this.titleCase(on);
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
    async getApproval() {
      await this.getApprovalEMP();
    },
    async fetchAllowance() {
      await this.fetchAllowanceEMP();
    },
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
    width: calc(100% / 4.99);
    // border-radius: 10px;
    border: none;
    height: 50px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.1s linear;
    color: var(--primary);
    background: var(--back-act);
    border-bottom: 2px solid #00000017;

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
.subtabs {
  overflow: hidden;
  white-space: nowrap;
  button {
    cursor: pointer;
    width: calc(100% / 2.9);
    border: none;
    height: 33px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.1s linear;
    color: var(--primary);
    background: var(--back-act);
    border-bottom: 2px solid #00000017;

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
  padding: 8px 10px 8px 10px;
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
    font-family: "Inconsolata", monospace;
    background: #ffeded;
  }
}
#thebox {
  box-shadow: 0px 1px 6px -2px #5a131669;
  border-radius: 10px;
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

.uniswap-info {
  background: #ffeded;
  border-radius: 0px 0px 10px 10px;
  padding: 2px 10px 5px 10px;
  min-height: 150px;
}

#chart {
  width: 200px;
  height: 200px;
}

.infoswitch {
  cursor: pointer;
  color: #fff;
  background: var(--primary);
  border: none;
  border-radius: 6px;
  padding: 0px 10px;
  font-size: 22px;
  font-weight: normal;
  height: 36px;
  margin: 6px 0px;
}

.echarts,
.chart-wrapper,
.chart-asset {
  width: 100%;
  height: 160px;
  margin-bottom: 15px;
}
</style>
