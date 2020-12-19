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
                <button :disabled="hasError == true" id="act" @click="act" v-bind:class="{ error: hasError }">{{ actName }}</button>
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

        <Container :size="800">
          <div>
            <div class="chart-asset">
              <chart :options="chartOptionsCandle" />
            </div>
          </div>
        </Container>
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
import { approve, decToBn, getLiquidationPrice, splitChartData } from "../utils";
import BigNumber from "bignumber.js";
import { getOffchainPriceFromTokenSymbol, getPricefeedParamsFromTokenSymbol, isPricefeedInvertedFromTokenSymbol } from "../utils/getOffchainPrice";
import { ChainId, Tokenl, Fetcher } from "@uniswap/sdk";

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
      // showDropdown: false,
      // currentInfo: "",
    };
  },
  mounted() {
    this.initAsset();
    this.lastPrice();
    this.initChart();
    this.getWETHBalance();

    // this.getApproval();
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
    ]),
    ...mapGetters(["empState"]),
    async initAsset() {
      const DAI = await Fetcher.fetchTokenData(1, "0x6B175474E89094C44Da98b954EedeAC495271d0F");
      console.log("DAI", DAI);
    },
    async getWETHBalance() {
      this.balanceWETH = await this.getUserWETHBalance();
    },
    initChart() {
      const red = "#E40915";
      const redBorder = "#E40915";
      const green = "#007E0A";
      const greenBorder = "#007E0A";
      const chartData = splitChartData([
        ["07/01/2020", 320, 320, 287, 362],
        ["07/10/2020", 291, 291, 288, 308],
        ["08/17/2020", 295, 346, 295, 346],
        ["06/10/2020", 347, 358, 337, 363],
        ["07/19/2020", 360, 382, 347, 383],
        ["11/21/2020", 383, 385, 371, 391],
        ["11/05/2020", 377, 419, 369, 421],
        ["04/24/2020", 425, 428, 417, 440],
        ["01/28/2020", 433, 433, 403, 437],
        ["10/01/2020", 432, 434, 427, 441],
        ["09/15/2020", 430, 418, 394, 433],
        ["09/13/2020", 416, 432, 414, 443],
        ["07/31/2020", 441, 421, 415, 444],
        ["05/09/2020", 420, 382, 373, 427],
        ["04/05/2020", 383, 397, 370, 397],
        ["05/15/2020", 378, 325, 309, 378],
        ["02/04/2020", 322, 314, 308, 330],
        ["11/18/2020", 320, 325, 315, 338],
        ["07/28/2020", 313, 293, 289, 340],
        ["06/02/2020", 297, 313, 292, 324],
        ["05/22/2020", 322, 365, 308, 366],
        ["08/19/2020", 364, 359, 330, 369],
        ["02/12/2020", 332, 273, 259, 333],
        ["05/13/2020", 274, 326, 270, 328],
        ["01/08/2020", 333, 347, 321, 351],
        ["02/02/2020", 340, 324, 304, 352],
        ["09/30/2020", 326, 318, 314, 333],
        ["01/14/2020", 314, 310, 296, 320],
        ["02/21/2020", 309, 286, 264, 333],
        ["02/04/2020", 282, 263, 253, 286],
        ["06/05/2020", 255, 270, 253, 276],
        ["08/20/2020", 269, 278, 250, 312],
        ["01/14/2020", 267, 240, 239, 276],
        ["09/03/2020", 244, 257, 232, 261],
        ["02/07/2020", 257, 317, 257, 317],
        ["08/05/2020", 318, 324, 311, 330],
        ["09/29/2020", 321, 328, 314, 332],
        ["11/10/2020", 334, 326, 319, 344],
        ["01/28/2020", 318, 297, 281, 319],
        ["03/11/2020", 299, 301, 289, 323],
        ["02/14/2020", 273, 236, 232, 273],
        ["03/20/2020", 238, 236, 228, 246],
        ["11/04/2020", 229, 234, 227, 243],
        ["12/17/2020", 234, 227, 220, 253],
        ["10/20/2020", 232, 225, 217, 241],
        ["09/25/2020", 196, 211, 180, 212],
        ["02/17/2020", 215, 225, 215, 234],
        ["03/19/2020", 224, 226, 212, 233],
        ["10/12/2020", 236, 219, 217, 242],
        ["11/03/2020", 218, 206, 204, 226],
        ["07/28/2020", 199, 181, 177, 204],
        ["11/08/2020", 169, 194, 165, 196],
        ["02/17/2020", 195, 193, 178, 197],
        ["02/05/2020", 181, 197, 175, 206],
        ["07/17/2020", 201, 244, 200, 250],
        ["01/21/2020", 236, 242, 232, 245],
        ["07/08/2020", 242, 184, 182, 242],
        ["09/22/2020", 187, 218, 184, 226],
        ["07/19/2020", 213, 199, 191, 224],
        ["08/12/2020", 203, 177, 173, 210],
        ["03/18/2020", 170, 174, 161, 179],
        ["03/02/2020", 179, 205, 179, 222],
        ["07/08/2020", 212, 231, 212, 236],
        ["04/02/2020", 227, 235, 219, 240],
        ["05/04/2020", 242, 246, 235, 255],
        ["11/24/2020", 246, 232, 221, 247],
        ["11/18/2020", 228, 246, 225, 247],
        ["07/18/2020", 247, 241, 231, 250],
        ["01/08/2020", 238, 217, 205, 239],
        ["08/24/2020", 217, 224, 213, 225],
        ["05/31/2020", 221, 251, 210, 252],
        ["02/12/2020", 249, 282, 248, 288],
        ["06/09/2020", 286, 299, 281, 309],
        ["08/21/2020", 297, 305, 290, 305],
        ["06/04/2020", 303, 302, 292, 314],
        ["01/13/2020", 293, 275, 274, 304],
        ["07/29/2020", 281, 288, 270, 292],
        ["10/15/2020", 286, 293, 283, 301],
        ["09/22/2020", 293, 321, 281, 322],
        ["07/31/2020", 323, 324, 321, 334],
        ["02/29/2020", 316, 317, 310, 325],
        ["08/18/2020", 320, 300, 299, 325],
        ["03/02/2020", 300, 299, 294, 313],
        ["08/25/2020", 297, 272, 264, 297],
        ["06/02/2020", 270, 270, 260, 276],
        ["08/30/2020", 264, 242, 240, 266],
        ["02/12/2020", 242, 210, 205, 250],
        ["06/19/2020", 190, 148, 126, 190],
      ]);
      // chart: uniswap data
      this.chartOptionsCandle = {
        title: {
          text: "Gwei",
          left: 0,
        },
        // tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //         type: 'cross'
        //     }
        // },
        // legend: {
        //   data: ["uGAS"],
        // },
        grid: {
          left: "5%",
          right: "1%",
          bottom: "10%",
        },
        xAxis: {
          type: "category",
          data: chartData.categoryData,
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: true },
          splitArea: {
            show: false,
            areaStyle: {
              color: [],
            },
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
        },
        dataZoom: [
          {
            type: "inside",
            start: 50,
            end: 100,
          },
          {
            show: false,
            type: "slider",
            top: "90%",
            start: 50,
            end: 100,
          },
        ],
        series: [
          {
            name: "uGas",
            type: "candlestick",
            data: chartData.values,
            itemStyle: {
              color: green,
              color0: red,
              borderColor: greenBorder,
              borderColor0: redBorder,
            },
            markPoint: {
              label: {
                normal: {
                  formatter: function(param) {
                    return param != null ? Math.round(param.value) : "";
                  },
                },
              },
              data: [
                {
                  name: "price",
                  coord: ["2013/5/31", 0],
                  value: 0,
                  itemStyle: {
                    color: "rgb(2,2,2)",
                  },
                },
                {
                  name: "high",
                  type: "max",
                  valueDim: "high",
                },
                {
                  name: "low",
                  type: "min",
                  valueDim: "low",
                },
                {
                  name: "avg",
                  type: "average",
                  valueDim: "close",
                },
              ],
              tooltip: {
                formatter: function(param) {
                  return param.name + "<br>" + (param.data.coord || "");
                },
              },
            },
            markLine: {
              symbol: ["none", "none"],
              data: [
                [
                  {
                    name: "low to high",
                    type: "min",
                    valueDim: "low",
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: false,
                    },
                    emphasis: {
                      label: {
                        show: false,
                      },
                    },
                  },
                  {
                    type: "max",
                    valueDim: "high",
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: false,
                    },
                    emphasis: {
                      label: {
                        show: false,
                      },
                    },
                  },
                ],
                {
                  name: "min line on close",
                  type: "min",
                  valueDim: "close",
                },
                {
                  name: "max line on close",
                  type: "max",
                  valueDim: "close",
                },
              ],
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
    getApprove() {
      approve(store.acc);
      console.log("store", store);
    },
    checkTime() {
      // checking if current time and 1day is greater than THIS
      const current = this.moment();
      const withdrawTime = this.moment(1608332874734);
      const result = this.moment(current).isAfter(withdrawTime.add(1, "days")); // false
      // const result = this.moment(current.add(1, "days")).isAfter(withdrawTime); // true
      console.log("result", result);
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
      this.approvedEMP = store.state.approvals.tokenEMP;
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

  // .select {
  //   display: flex;
  //   position: relative;
  //   font-family: "Inconsolata", monospace;
  //   height: 40px;
  //   font-size: 22px;
  //   width: 100%;
  //   border: none;
  //   background-image: none;
  //   background-color: transparent;
  //   -webkit-box-shadow: none;
  //   -moz-box-shadow: none;
  //   box-shadow: none;
  //   background: #fff;
  //   background: var(--back-act);
  //   padding-left: 10px;
  // }

  // .option {
  //   cursor: pointer;
  //   padding: 0 30px 0 10px;
  //   min-height: 40px;
  //   display: flex;
  //   align-items: center;
  //   background: var(--back-act);
  //   border-top: var(--back-act) solid 1px;
  //   color: #ff4a4a;
  //   position: absolute;
  //   top: 0;
  //   width: 100%;
  //   pointer-events: none;
  //   order: 2;
  //   z-index: 1;
  //   transition: background 0.4s ease-in-out;
  //   box-sizing: border-box;
  //   overflow: hidden;
  //   white-space: nowrap;
  // }

  // .select:focus .option {
  //   position: relative;
  //   pointer-events: all;
  // }

  // input {
  //   opacity: 0;
  //   position: absolute;
  //   left: -99999px;
  // }

  // input:checked + label {
  //   order: 1;
  //   z-index: 2;
  //   background: #fff;
  //   background: var(--back-act);
  //   border-top: none;
  //   position: relative;
  // }

  // input:checked + label:after {
  //   content: "";
  //   width: 0;
  //   height: 0;
  //   border-left: 5px solid transparent;
  //   border-right: 5px solid transparent;
  //   border-top: 5px solid #ff4a4a;
  //   position: absolute;
  //   right: 10px;
  //   top: calc(50% - 2.5px);
  //   pointer-events: none;
  //   z-index: 3;
  // }

  // input:checked + label:before {
  //   position: absolute;
  //   right: 0;
  //   height: 40px;
  //   width: 40px;
  //   content: "";
  //   background: #fff;
  //   background: var(--back-act);
  // }
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
  height: 300px;
}
</style>
