<template>
  <div class="assets">
    <Container :size="900">
      <Card>
        <!-- <h2 class="">Asset: {{ $route.params.key.toUpperCase() }}</h2> -->
        <h2 class="flex">
          <span>{{ $route.params.key.toUpperCase() }}</span>
          <SpacePush />
          <a class="asset-detail-switch" href="https://docs.degenerative.finance/ugas" target="_blank">Info</a>
          <!-- <button
            class="asset-detail-switch"
            v-if="navPage === 'interact'"
            @click="toNavPage('info')"
            :class="{ active: navPage === 'info' }"
          >Info</button>
          <button
            class="asset-detail-switch"
            v-if="navPage === 'info'"
            @click="toNavPage('interact')"
            :class="{ active: navPage === 'interact' }"
          >Interact</button>-->
        </h2>
      </Card>

      <Space size="md" />

      <div v-if="navPage === 'interact'">
        <div class="warning bold justify">
          Warning: This is an experimental token — users should proceed with extreme caution. Although the EMP contract has been audited in detail by
          OpenZeppelin, the application of this contract on a volatile price identifier such as Ethereum gas prices is novel and unpredictable in a live market.
          Users should take time to understand the token and ask questions on the Yam Discord.
        </div>

        <Space size="md" />

        <Container :size="440" class="maker">
          <div v-if="assetChartData && tokenSelected">
            <div class="chart-asset">
              <chart :options="chartOptionsCandle" />
            </div>
          </div>
        </Container>

        <Container :size="440" class="maker">
          <div class="asset-info">
            <div>
              <b>{{ $route.params.key.toUpperCase() }} Price</b>
              : {{ numeral(price, "0.0000a") }} ETH
            </div>
            <div v-if="tokenSelected">
              <b>APR</b>
              : {{ aprAssetValue && aprAssetValue > 0 ? aprAssetValue : "..." }}%
            </div>
          </div>
          <div id="thebox">
            <div class="tabs">
              <button
                @click="toNavAct('mint')"
                :class="{ active: navAct === 'mint' }"
                v-tooltip="{
                  content: '<b>Mint</b>: Open a new position, or mint new uTokens.',
                  delay: { show: 150, hide: 100 },
                }"
              >
                Mint
              </button>
              <button
                @click="toNavAct('deposit')"
                :class="{ active: navAct === 'deposit' }"
                v-tooltip="{
                  content: '<b>Deposit</b>: Increase collateral for a position.',
                  delay: { show: 150, hide: 100 },
                }"
              >
                Deposit
              </button>
              <button
                @click="toNavAct('redeem')"
                :class="{ active: navAct === 'redeem' }"
                v-tooltip="{
                  content: '<b>Redeem</b>: Redeem uTokens, reducing a position\'s debt.',
                  delay: { show: 150, hide: 100 },
                }"
              >
                Redeem
              </button>
              <button
                @click="toNavAct('withdraw')"
                :class="{ active: navAct === 'withdraw' }"
                v-tooltip="{
                  content: '<b>Withdraw</b>: Withdraw collateral from a position.',
                  delay: { show: 150, hide: 100 },
                }"
              >
                Withdraw
              </button>
              <button @click="toNavAct('lptrade')" :class="{ active: navAct === 'lptrade' }">LP/Trade</button>
            </div>
            <div id="inputbox">
              <div>
                <div v-if="navAct === 'withdraw'" class="subtabs">
                  <button
                    @click="toWithdrawType('instant')"
                    :class="{ active: withdrawType === 'instant' }"
                    v-tooltip="{
                      content: '<b>Instant Withdraw</b>: Withdraw up to the current GCR.',
                      delay: { show: 150, hide: 100 },
                    }"
                  >
                    Instant Withdraw
                  </button>
                  <button
                    @click="toWithdrawType('new')"
                    :class="{ active: withdrawType === 'new' }"
                    v-tooltip="{
                      content: '<b>Request Withdraw</b> Request to withdraw collateral up to the Minimum Collateral Ratio.',
                      delay: { show: 150, hide: 100 },
                    }"
                  >
                    Request Withdraw
                  </button>
                  <button
                    @click="toWithdrawType('existing')"
                    :class="{ active: withdrawType === 'existing' }"
                    v-tooltip="{
                      content: '<b>Withdraw</b>: After a withdrawal request passes, you can withdraw collateral here.',
                      delay: { show: 150, hide: 100 },
                    }"
                  >
                    Withdraw
                  </button>
                </div>
                <div class="dropdown">
                  <vue-picker class="select" v-model="tokenSelected" @change="getEmpState" placeholder="Select uGas Token" autofocus>
                    <vue-picker-option value>Select uGas Token</vue-picker-option>
                    <vue-picker-option value="UGASJAN21">uGAS JAN21</vue-picker-option>
                    <vue-picker-option value="UGASFEB21">uGAS FEB21</vue-picker-option>
                    <vue-picker-option value="UGASMAR21">uGAS MAR21</vue-picker-option>
                  </vue-picker>
                </div>
                <input
                  v-if="tokenSelected && navAct != 'deposit' && navAct != 'withdraw' && navAct !== 'lptrade'"
                  id
                  class="numeric setvalue"
                  type="number"
                  name
                  v-model="tokenAmt"
                  v-on:keyup="tokenHandler"
                  :placeholder="'0.00 ' + (tokenSelected ? tokenSelected + ' ' : '') + 'Tokens'"
                />
                <input
                  v-if="tokenSelected && navAct != 'redeem' && navAct !== 'lptrade'"
                  id
                  class="numeric setvalue"
                  type="number"
                  name
                  v-model="collatAmt"
                  v-on:keyup="collatHandler"
                  placeholder="0.00 WETH"
                  :disabled="navAct == 'withdraw' && withdrawType == 'existing'"
                />
                <!-- to add max button -->
                <!-- <div @click="showDropdown = !showDropdown" class="info-dropdown">
                Info ▼
                <div :class="{ hideDropdown: !showDropdown }">
                  {{ currentInfo }}
                </div>
                </div>-->
                <button :disabled="hasError == true" id="act" @click="act" v-bind:class="{ error: hasError }" v-if="navAct !== 'lptrade'">
                  {{
                    !isPending
                      ? tokenSelected
                        ? approvals
                          ? approvals[assetEMP[tokenSelected][0] + "_WETH"] === true ||
                            (navAct == "redeem" && approvals[assetEMP[tokenSelected][0] + "_" + tokenSelected] === true)
                            ? actName
                            : "Approve"
                          : "Select Token"
                        : "Select Token"
                      : ""
                  }}
                  <beat-loader v-if="isPending" color="#FF4A4A"></beat-loader>
                </button>
              </div>
              <div class="uniswap-info" v-if="navAct === 'lptrade'">
                <div v-if="!tokenSelected">Select Token.</div>
                <div v-if="tokenSelected">
                  <h2>Unsiwap</h2>
                  <div>
                    <a :href="'https://app.uniswap.org/#/add/ETH/' + assetTokens[tokenSelected]" target="_blank">Click here to LP</a>
                  </div>
                  <div>
                    <a :href="'https://app.uniswap.org/#/swap?outputCurrency=' + assetTokens[tokenSelected]" target="_blank">Click here to Trade</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="error" v-if="tokenSelected && hasError && navAct !== 'lptrade'">{{ currentError }}</div>

          <div class="wrapETH">
            <button class="toggle" @click="toggleWrap">Wrap ETH</button>
            <div v-if="showWrapETH">
              <div class="wraprow">
                <input type="number" placeholder="Amount" v-model="amountToWrap" />
                <button class="wrap" :disabled="!amountToWrap" @click="makeWrapETH(amountToWrap)">Wrap</button>
              </div>
              <div class="wraprow">
                <input type="number" placeholder="Amount" v-model="amountToUnwrap" />
                <button class="unwrap" :disabled="!amountToUnwrap" @click="makeUnwrapETH(amountToUnwrap)">Unwrap</button>
              </div>
            </div>
          </div>

          <div class="info" v-if="info">
            <label
              v-tooltip="{
                content: 'Synthetic selected',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              <b>{{ tokenSelected ? tokenSelected : "No Synthetic" }} Selected</b>
            </label>
            <label
              v-tooltip="{
                content: 'Price at which your position can be liquidated',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              Liquidation Price:
              <b>{{ liquidationPrice }}</b>
            </label>
            <label
              v-tooltip="{
                content: 'Collateral ratio of your position after the tx',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              Collateral Ratio (Post-Tx):
              <b>{{ numeral(pricedCR, "0.0000a") }}</b>
            </label>
            <label
              v-tooltip="{
                content: 'Global collateral ratio',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              Collateral Ratio (Global):
              <b>{{ gcr }}</b>
            </label>
            <label
              v-tooltip="{
                content: 'Collateral ratio of this particular tx',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              Collateral Ratio (Tx):
              <b>{{ numeral(pricedTxCR, "0.0000a") }}</b>
            </label>

            <br />
            <label>
              Your WETH:
              <b>{{ displayBalanceWETH ? displayBalanceWETH : "0" }}</b>
            </label>
            <label v-if="tokenSelected">
              Your {{ tokenSelected }}:
              <b>{{ balanceUGAS ? balanceUGAS : "0" }}</b>
            </label>
            <label
              v-if="tokenSelected"
              v-tooltip="{
                content: 'Total WETH locked as collateral',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              Position Collateral (WETH):
              <b>{{ currCollat ? currCollat : "0" }}</b>
            </label>
            <label
              v-if="tokenSelected"
              v-tooltip="{
                content: 'Total minted uTokens in this position',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              Position Outstanding Tokens ({{ tokenSelected }}):
              <b>{{ currTokens ? currTokens : "0" }}</b>
            </label>
            <label
              v-if="tokenSelected"
              v-tooltip="{
                content: 'Current liquidation price of your position',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              Current Liquidation Price:
              <b>{{ currLiquidationPrice ? currLiquidationPrice : "0" }}</b>
            </label>
          </div>
        </Container>
      </div>

      <div v-if="navPage === 'info'">
        <!-- <div id>
          <la-cartesian
            narrow
            :bound="[n => n - 40, n => n + 40]"
            :data="chartOptionsMedianValues"
            :width="800 - 60"
            :height="300 - 60"
          >
            <la-line dot animated curve :width="2" prop="value" color="var(--primary)">
              <g slot-scope="props" fill="rgb(255 74 74 / 50%)" :font-size="12">
                <text :x="props.x" :y="props.y" text-anchor="middle" dy="-.5em">{{ props.value }}</text>
              </g>
            </la-line>
            <la-x-axis prop="name" color="rgb(0 0 0 / 40%)" font-weight="bold" :font-size="12"></la-x-axis>
            <la-y-axis prop="value"></la-y-axis>
          </la-cartesian>
        </div>-->
        <CardLink title="Learn More about uGAS" link="https://docs.degenerative.finance/ugas" />
      </div>
    </Container>
  </div>
</template>
<script>
/* eslint-disable @typescript-eslint/camelcase */
import store from "@/store";
import { mapActions, mapGetters } from "vuex";
import {
  approve,
  decToBn,
  getLiquidationPrice,
  getTWAPData,
  getUniswapDataHourly,
  getUniswapDataDaily,
  splitChartData,
  getContractInfo,
  getPriceByContract,
  DevMiningCalculator,
  getTokenPrice,
} from "../utils";
import BigNumber from "bignumber.js";
import { getOffchainPriceFromTokenSymbol, getPricefeedParamsFromTokenSymbol, isPricefeedInvertedFromTokenSymbol } from "../utils/getOffchainPrice";
import { ChainId, Tokenl, Fetcher } from "@uniswap/sdk";
import { WETH, EMPJAN, EMPFEB, EMPMAR, UGASJAN21, UGASFEB21, UGASMAR21, UGASJAN21LP, UGASFEB21LP, UGASMAR21LP } from "@/utils/addresses";
import EMPContract from "@/utils/abi/emp.json";

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
      displayBalanceWETH: 0,
      balanceUGAS: 0,
      assetChartData: null,
      isPending: false,
      assetTokens: {
        UGASJAN21: UGASJAN21,
        UGASFEB21: UGASFEB21,
        UGASMAR21: UGASMAR21,
      },
      assetEMP: {
        UGASJAN21: ["EMPJAN", EMPJAN, UGASJAN21LP],
        UGASFEB21: ["EMPFEB", EMPFEB, UGASFEB21LP],
        UGASMAR21: ["EMPMAR", EMPMAR, UGASMAR21LP],
      },
      approvals: {
        EMPFEB_WETH: false,
        EMPJAN_WETH: false,
        EMPMAR_WETH: false,
        EMPMAR_UGASMAR21: false,
        EMPJAN_UGASJAN21: false,
        EMPFEB_UGASFEB21: false,
      },
      assetEMPName: {},
      showWrapETH: false,
      amountToWrap: 0,
      amountToUnwrap: 0,
      currCollat: null,
      currTokens: null,
      chartHourly: false,
      currLiquidationPrice: null,
      periodicalChecks: null,
      periodicalChecksTime: 60,
      aprAssetValue: 0,
    };
  },
  async mounted() {
    await this.initAsset();
    await this.lastPrice();
    await this.initChart();
    await this.getWETHBalance();
    await this.updateApprovals();
  },
  computed: {
    account() {
      return store.state.account;
    },
  },
  watch: {
    tokenSelected: function(newVal, oldVal) {
      if (!this.tokenSelected) {
        return;
      }
      if (this.navAct == "redeem") {
        this.fetchAllowance(this.assetEMP[this.tokenSelected][0] + "_" + this.tokenSelected, this.empAddr()[0], this.empAddr()[1]);
      } else {
        this.fetchAllowance(this.assetEMP[this.tokenSelected][0] + "_WETH", this.empAddr()[0], WETH);
      }
      this.initChart();
      this.getEmpState();
      this.getRewards();
    },
    navAct: function(newVal, oldVal) {
      if (!this.tokenSelected) {
        return;
      }
      if (newVal == "redeem") {
        this.fetchAllowance(this.assetEMP[this.tokenSelected][0] + "_" + this.tokenSelected, this.empAddr()[0], this.empAddr()[1]);
      } else {
        this.fetchAllowance(this.assetEMP[this.tokenSelected][0] + "_WETH", this.empAddr()[0], WETH);
      }
    },
    account(newAccount, oldAccount) {
      this.updateUserInfo();
    },
    // navPage(newVal, oldVal) {},
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
      "getUserUGasBalance",
      "getContractApproval",
      "fetchContractApproval",
      "wrapETH",
      "unwrapETH",
      "checkContractApprovals",
      "getMiningRewards",
    ]),
    ...mapGetters(["empState"]),
    async initAsset() {
      if (this.tokenSelected) {
        this.fetchAllowance(this.assetEMP[this.tokenSelected][0] + "_WETH", this.empAddr()[0], WETH); // checks Approval
      }

      // polling
      this.periodicalChecks = setInterval(() => {
        this.lastPrice();
      }, this.periodicalChecksTime * 1000);

      // const from = 1606742010;
      // const hourly = await getUniswapDataHourly(UGASJAN21, from);
      // console.log("UGASJAN21 getUniswapDataHourly", hourly);
      // const daily = await getUniswapDataDaily(UGASJAN21, from);
      // console.log("UGASJAN21 getUniswapDataDaily", daily);
      // this.assetChartData = daily;
    },
    async getWETHBalance() {
      this.balanceWETH = await this.getUserWETHBalance();
      this.displayBalanceWETH = new BigNumber(this.balanceWETH).div(ethDecs).toFixed(4);
    },
    async getUGasBalance() {
      this.balanceUGAS = await this.getUserUGasBalance({ contract: this.empAddr()[0] });
      this.balanceUGAS = new BigNumber(this.balanceUGAS).div(empDecs).toFixed(4);
    },
    async initChart() {
      if (!this.assetTokens[this.tokenSelected]) {
        return;
      }
      const redColor = "#ad3c3c";
      const redBorderColor = "#ad3c3c";
      const greenColor = "#48ad3c";
      const greenBorderColor = "#48ad3c";
      const twapLineColor = "#333";
      const from = 1606742010; // NOV: 1606742010 - test: 1604150010
      // const assetChart = await getUniswapDataHourly(this.assetTokens[this.tokenSelected], from); // Hourly
      const assetChart = await getUniswapDataDaily(this.assetTokens[this.tokenSelected], from); // Daily
      // console.log("UGASJAN21 assetChart", assetChart);

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
          bottom: "14%",
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
    },
    initInfoChart() {
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
      this.updateLiqPrice(false, true);
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
      this.updateLiqPrice(false, true);
      if (this.currPos) {
        this.collatAmt = new BigNumber(this.currPos.withdrawalRequestAmount).div(ethDecs);
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
      this.updateLiqPrice(false, true);
      if (this.currPos) {
        const tn = new Date().getTime() / 1000;
        if (this.checkHasPending()) {
          this.hasError = true;
          this.currentError = "Instant withdraw not allowed with active pending withdraw";
        } else if (Number(this.currPos.rawCollateral) == 0) {
          this.hasError = true;
          this.currentError = "No Collateral to withdraw from this position";
        } else if (
          (new BigNumber(this.currPos.rawCollateral) - new BigNumber(this.collatAmt).times(ethDecs)) /
            new BigNumber(this.currPos.tokensOutstanding) /
            this.price <
          this.gcr
        ) {
          const numerator = new BigNumber(this.currPos.rawCollateral) - new BigNumber(this.collatAmt).times(ethDecs);
          console.log("numerator", numerator);
          console.log("denom", this.currPos.tokensOutstanding);
          const newcr =
            (new BigNumber(this.currPos.rawCollateral) - new BigNumber(this.collatAmt).times(ethDecs)) / new BigNumber(this.currPos.tokensOutstanding);
          console.log(
            "HERE",
            newcr.toString(),
            new BigNumber(this.currPos.rawCollateral),
            new BigNumber(this.collatAmt).times(ethDecs),
            this.currPos.tokensOutstanding,
            this.gcr
          );
          this.hasError = true;
          this.currentError = "Withdrawal would put position below Global Collat Ratio";
        }
      }
    },
    updateCR(removeTokens = false, removeCollateral = false) {
      if (this.currPos) {
        const pos = Number(new BigNumber(this.currPos.tokensOutstanding).div(empDecs));
        const col = Number(new BigNumber(this.currPos.rawCollateral).div(ethDecs));
        let totalTokens;
        let totalCollat;
        if (!removeTokens) {
          totalTokens = this.tokenAmt ? Number(this.tokenAmt) + pos : pos;
        } else {
          totalTokens = this.tokenAmt ? pos - Number(this.tokenAmt) : pos;
        }
        if (!removeCollateral) {
          totalCollat = this.collatAmt ? Number(this.collatAmt) + col : col;
        } else {
          totalCollat = this.collatAmt ? col - Number(this.collatAmt) : col;
        }
        if (this.tokenAmt && this.collatAmt) {
          this.pricedTxCR = Number(this.collatAmt / this.tokenAmt / this.price) || 0;
        }
        this.pricedCR = Number(totalCollat / totalTokens / this.price) || 0;
      } else {
        if (this.tokenAmt && this.collatAmt) {
          this.pricedTxCR = Number(this.collatAmt / this.tokenAmt / this.price) || 0;
        }
      }
    },
    updateLiqPrice(removeTokens = false, removeCollateral = false) {
      this.updateCR(removeTokens, removeCollateral);
      if (this.currPos) {
        const pos = Number(new BigNumber(this.currPos.tokensOutstanding).div(empDecs));
        const col = Number(new BigNumber(this.currPos.rawCollateral).div(ethDecs));
        let totalTokens;
        let totalCollat;
        if (!removeTokens) {
          totalTokens = this.tokenAmt ? Number(this.tokenAmt) + pos : pos;
        } else {
          totalTokens = this.tokenAmt ? pos - Number(this.tokenAmt) : pos;
        }
        if (!removeCollateral) {
          totalCollat = this.collatAmt ? Number(this.collatAmt) + col : col;
        } else {
          totalCollat = this.collatAmt ? col - Number(this.collatAmt) : col;
        }
        this.liquidationPrice = getLiquidationPrice(totalCollat, totalTokens, this.collReq.div(ethDecs), isPricefeedInvertedFromTokenSymbol("uGAS")).toFixed(4);
      } else {
        this.liquidationPrice = getLiquidationPrice(
          this.tokenAmt ? this.tokenAmt : 0,
          this.collatAmt ? this.collatAmt : 0,
          this.collReq.div(ethDecs),
          isPricefeedInvertedFromTokenSymbol("uGAS")
        ).toFixed(4);
      }
    },
    currLiqPrice() {
      if (this.currPos) {
        const pos = Number(new BigNumber(this.currPos.tokensOutstanding).div(empDecs));
        const col = Number(new BigNumber(this.currPos.rawCollateral).div(ethDecs));
        this.currLiquidationPrice = getLiquidationPrice(col, pos, this.collReq.div(ethDecs), isPricefeedInvertedFromTokenSymbol("uGAS")).toFixed(4);
      }
    },
    runChecks() {
      this.hasError = false;
      this.currentError = "";
      if (this.navAct == "withdraw") {
        this.currLiqPrice();
        if (this.withdrawType == "existing") {
          this.checkWithdraw();
        } else if (this.withdrawType == "new") {
          this.checkNewWithdraw();
        } else {
          this.checkInstantWithdraw();
        }
      } else if (this.navAct == "redeem") {
        this.collatAmt = 0;
        this.currLiqPrice();
        this.updateLiqPrice(true, false);
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
        this.tokenAmt = 0;
        this.currLiqPrice();
        this.updateLiqPrice();
        if (this.checkHasPending()) {
          this.hasError = true;
          this.currentError = "Cannot deposit with an active withdrawal request";
        } else if (this.currPos && this.currPos.rawCollateral == 0) {
          this.hasError = true;
          this.currentError = "No open position. Mint tokens first";
        } else if (Number(this.displayBalanceWETH) < Number(this.collatAmt)) {
          this.hasError = true;
          this.currentError = "Not enough WETH. Please wrap ETH below";
        }
      } else if (this.navAct == "mint") {
        this.currLiqPrice();
        this.updateLiqPrice();
        // if (this.collatAmt < this.displayBalanceWETH) {
        //   this.hasError = true;
        //   this.currentError = "Insufficient";
        //   return;
        // }
        if (this.tokenAmt && this.tokenAmt < 5) {
          this.hasError = true;
          this.currentError = "Minimum mint amount is 5";
          return;
        } else if (Number(this.displayBalanceWETH) < Number(this.collatAmt)) {
          this.hasError = true;
          this.currentError = "Not enough WETH. Please wrap ETH below";
          return;
        }
        const thisError = "Collateral Ratio below global minimum";
        if (!this.hasError || this.currentError == thisError) {
          if (this.pricedCR && Number(this.pricedCR) < Number(this.gcr)) {
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
        case "UGASJAN21":
          return [EMPJAN, UGASJAN21];
        case "UGASFEB21":
          return [EMPFEB, UGASFEB21];
        case "UGASMAR21":
          return [EMPMAR, UGASMAR21];
        default:
          return "";
      }
    },
    async getPosition() {
      const pos = await this.getPositionData(this.empAddr()[0]);
      return pos;
    },
    async getEmpState() {
      const contractAddr = this.empAddr()[0];
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
      if (this.currPos) {
        this.currTokens = new BigNumber(this.currPos.tokensOutstanding)
          .div(empDecs)
          .toFixed(4)
          .toString();
        this.currCollat = new BigNumber(this.currPos.rawCollateral)
          .div(ethDecs)
          .toFixed(4)
          .toString();
      }
      this.currEMP = k;
      const totalColl = k.cumulativeFeeMultiplier.div(ethDecs).times(k.rawTotalPositionCollateral.dividedBy(ethDecs));
      const totalTokens = k.totalTokensOutstanding.div(empDecs);
      this.gcr = totalTokens > 0 ? (totalColl / totalTokens / this.price).toFixed(4) : 0;
      this.collReq = k.collateralRequirement;
      this.getUGasBalance();
      this.posUpdateHandler();
      this.updateUserInfo();
    },
    async getRewards() {
      const asset = {
        address: this.assetTokens[this.tokenSelected],
        addressEMP: this.assetEMP[this.tokenSelected][1],
        addressLP: this.assetEMP[this.tokenSelected][2],
      };
      this.aprAssetValue = await this.getMiningRewards(asset);
    },
    async lastPrice() {
      // get onchain price prep
      // this.price = await getTokenPrice(this.assetTokens[this.tokenSelected]);
      this.price = await getOffchainPriceFromTokenSymbol("uGAS");
      console.debug("uGas price", this.price);
      return this.price;
    },
    async act() {
      if (!this.tokenSelected) {
        return;
      }
      if (!this.approvals[this.assetEMP[this.tokenSelected][0] + "_WETH"] && this.actName !== "Redeem") {
        this.isPending = true;

        this.getApproval(this.assetEMP[this.tokenSelected][0] + "_WETH", this.empAddr()[0], WETH)
          .then(async e => {
            console.log("approve", e[1]);
            this.isPending = false;
            if (e[1] && e[1] != "") {
              this.hasError = true;
              this.currentError = "Transaction would fail. Check balances & approvals";
            }
            this.updateUserInfo();
          })
          .catch(async e => {
            console.log("error", e[1]);
            this.isPending = false;
            if (e[1] && e[1] != "") {
              this.hasError = true;
              this.currentError = "Transaction would fail. Check balances & approvals";
            }
            this.updateUserInfo();
          });
      } else {
        switch (this.actName) {
          case "Mint":
            console.log("mint");
            this.isPending = true;
            this.mint({
              contract: this.empAddr()[0],
              collat: new BigNumber(this.collatAmt).times(ethDecs).toString(),
              tokens: new BigNumber(this.tokenAmt).times(empDecs).toString(),
            })
              .then(async e => {
                console.log("mint", e[1]);
                this.isPending = false;
                if (e[1] && e[1] != "") {
                  this.hasError = true;
                  this.currentError = "Transaction would fail. Check balances & approvals";
                }
                this.updateUserInfo();
              })
              .catch(async e => {
                console.log("error", e[1]);
                this.isPending = false;
                if (e[1] && e[1] != "") {
                  this.hasError = true;
                  this.currentError = "Transaction would fail. Check balances & approvals";
                }
                this.updateUserInfo();
              });
            break;
          case "Deposit":
            console.log("deposit");
            this.isPending = true;
            this.deposit({ contract: this.empAddr()[0], collat: new BigNumber(this.collatAmt).times(ethDecs).toString() })
              .then(async e => {
                this.isPending = false;
                if (e[1] && e[1] != "") {
                  this.hasError = true;
                  this.currentError = "Transaction would fail. Check balances & approvals";
                }
                this.updateUserInfo();
              })
              .catch(async e => {
                this.isPending = false;
                if (e[1] && e[1] != "") {
                  this.hasError = true;
                  this.currentError = "Transaction would fail. Check balances & approvals";
                }
                this.updateUserInfo();
              });
            break;
          case "Request Withdraw":
            console.log("req withdraw");
            this.isPending = true;
            this.requestWithdrawal({ contract: this.empAddr()[0], collat: new BigNumber(this.collatAmt).times(ethDecs).toString() })
              .then(async e => {
                this.isPending = false;
                if (e[1] && e[1] != "") {
                  this.hasError = true;
                  this.currentError = "Transaction would fail. Check balances & approvals";
                }
                this.updateUserInfo();
              })
              .catch(async e => {
                this.isPending = false;
                if (e[1] && e[1] != "") {
                  this.hasError = true;
                  this.currentError = "Transaction would fail. Check balances & approvals";
                }
                this.updateUserInfo();
              });
            break;
          case "Withdraw":
            console.log("withdraw");
            this.isPending = true;
            this.withdrawRequestFinalize({ contract: this.empAddr()[0] })
              .then(e => {
                this.isPending = false;
                if (e[1] && e[1] != "") {
                  this.hasError = true;
                  this.currentError = "Transaction would fail. Check balances & approvals";
                }
                this.updateUserInfo();
              })
              .catch(e => {
                this.isPending = false;
                if (e[1] && e[1] != "") {
                  this.hasError = true;
                  this.currentError = "Transaction would fail. Check balances & approvals";
                }
                this.updateUserInfo();
              });
            break;
          case "Instant Withdraw":
            console.log("instant withdraw");
            this.isPending = true;
            this.withdraw({ contract: this.empAddr()[0], collat: new BigNumber(this.collatAmt).times(ethDecs).toString() })
              .then(e => {
                this.isPending = false;
                if (e[1] && e[1] != "") {
                  this.hasError = true;
                  this.currentError = "Transaction would fail. Check balances & approvals";
                }
                this.updateUserInfo();
              })
              .catch(e => {
                this.isPending = false;
                if (e[1] && e[1] != "") {
                  this.hasError = true;
                  this.currentError = "Transaction would fail. Check balances & approvals";
                }
                this.updateUserInfo();
              });
            break;
          case "Redeem":
            if (!this.approvals[this.assetEMP[this.tokenSelected][0] + "_" + this.tokenSelected]) {
              this.isPending = true;
              this.getApproval(this.assetEMP[this.tokenSelected][0] + "_" + this.tokenSelected, this.empAddr()[0], this.empAddr()[1])
                .then(async e => {
                  console.log("approve", e[1]);
                  this.isPending = false;
                  if (e[1] && e[1] != "") {
                    this.hasError = true;
                    this.currentError = "Transaction would fail. Check balances & approvals";
                  }
                  this.updateUserInfo();
                })
                .catch(async e => {
                  console.log("error", e[1]);
                  this.isPending = false;
                  if (e[1] && e[1] != "") {
                    this.hasError = true;
                    this.currentError = "Transaction would fail. Check balances & approvals";
                  }
                  this.updateUserInfo();
                });
            } else {
              console.log("redeem");
              this.isPending = true;
              this.redeem({ contract: this.empAddr()[0], tokens: new BigNumber(this.tokenAmt).times(empDecs).toString() })
                .then(e => {
                  this.isPending = false;
                  if (e[1] && e[1] != "") {
                    this.hasError = true;
                    this.currentError = "Transaction would fail. Check balances & approvals";
                  }
                  this.updateUserInfo();
                })
                .catch(e => {
                  this.isPending = false;
                  if (e[1] && e[1] != "") {
                    this.hasError = true;
                    this.currentError = "Transaction would fail. Check balances & approvals";
                  }
                });
            }
            break;
        }
      }
      this.getEmpState();
    },
    async updateUserInfo() {
      await Promise.all([this.getWETHBalance(), this.getUGasBalance(), this.getPosition(), this.updateApprovals()]);
    },
    toNavPage(on) {
      this.navPage = on;
      if (this.navPage === "info") {
        this.initInfoChart();
      }
      console.log("toNavPage", on);
    },
    toNavAct(on) {
      this.closeWrap();
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
      this.collatAmt = (this.tokenAmt * this.gcr * this.price + 0.0001).toFixed(4);
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
    async getApproval(identifier, spenderAddress, tokenAddress) {
      if (spenderAddress) {
        await this.getContractApproval({ identifier: identifier, spenderAddress: spenderAddress, tokenAddress: tokenAddress });
      }
    },
    async fetchAllowance(identifier, spenderAddress, tokenAddress) {
      if (spenderAddress) {
        await this.fetchContractApproval({ identifier: identifier, spenderAddress: spenderAddress, tokenAddress: tokenAddress });
      }
    },
    async updateApprovals() {
      console.log("updating approvals");
      this.approvals = await this.checkContractApprovals();
      console.log("approvals", this.approvals);
    },
    toggleWrap() {
      this.showWrapETH = !this.showWrapETH;
    },
    closeWrap() {
      this.showWrapETH = false;
    },
    async makeWrapETH(amount) {
      const wrap = await this.wrapETH({ amount: amount });
      console.log("wrapETH", wrap);
    },
    async makeUnwrapETH(amount) {
      const wrap = await this.unwrapETH({ amount: amount });
      console.log("unwrapETH", wrap);
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
div.error {
  color: var(--primary);
  background: #0000000d;
  text-align: center;
  font-size: 16px;
  width: 90%;
  margin: 0 auto;
  border-radius: 0px 0px 10px 10px;
  padding: 5px 0px 5px 0px;
  z-index: 0;
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
    border: none;
    height: 50px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.1s linear;
    color: var(--primary);
    background: var(--back-act);
    border-bottom: 2px solid #00000017;

    &.active {
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
    width: calc(100% / 3);
    border: none;
    height: 33px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.1s linear;
    color: var(--primary);
    background: var(--back-act);

    &.active {
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
  font-size: 16px;
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
  color: var(--primary);
  height: 50px;
  padding: 10px;
  font-size: 22px;
  // font-family: "Share Tech Mono", monospace;
  font-family: "Inconsolata", monospace;
  &::placeholder {
    color: #0000001c;
    opacity: 1;
  }
  &:-ms-input-placeholder {
    color: #0000001c;
  }
  &::-ms-input-placeholder {
    color: #0000001c;
  }
}
.dropdown {
  border-radius: 0px 0px 10px 10px;

  .select {
    font-family: "Inconsolata", monospace;
    // background: #ffeded;
  }
}
#thebox {
  box-shadow: 0px 4px 10px 2px #00000014;
  box-shadow: 0px 4px 10px 2px #ca625a14; // #e5706714
  border-radius: 10px;
  z-index: 1;
}
#act {
  cursor: pointer;
  background: white;
  background: var(--back-act);
  color: var(--primary);
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
    // background: darken($primary, 10%);
  }
  &.error {
    cursor: not-allowed;
    color: #0000001c !important;
  }
}

.info-dropdown {
  cursor: pointer;
  color: var(--primary);
  background: var(--back-act);
  text-align: center;
}

.uniswap-info {
  background: var(--back-act);
  border-radius: 0px 0px 10px 10px;
  padding: 2px 10px 5px 10px;
  min-height: 150px;
}

#chart {
  width: 200px;
  height: 200px;
}

.asset-detail-switch {
  cursor: pointer;
  color: #fff;
  background: var(--primary);
  border: none;
  border-radius: 2px;
  padding: 0px 10px;
  font-size: 22px;
  font-weight: normal;
  height: 36px;
}

.echarts,
.chart-wrapper,
.chart-asset {
  width: 100%;
  height: 160px;
  margin-bottom: 15px;
}

.wrapETH {
  width: 90%;
  margin: 10px auto;
  .toggle {
    cursor: pointer;
    color: #fff;
    background: var(--primary);
    border: none;
    border-radius: 8px;
    padding: 2px 20px;
    width: 100%;
    margin-bottom: 5px;
  }
  .wraprow {
    float: left;
    width: 100%;
    margin: 0px 0px 5px 0px;
    input {
      width: 65%;
      border: none;
      padding: 0px 10px;
      border-radius: 8px 0px 0px 8px;
      height: 30px;
      background: var(--back-act);
      color: var(--primary);
      float: left;
      font-size: 15px;
      &::placeholder {
        color: #0000001c;
        opacity: 1;
      }
      &:-ms-input-placeholder {
        color: #0000001c;
      }
      &::-ms-input-placeholder {
        color: #0000001c;
      }
    }
    button {
      cursor: pointer;
      width: 35%;
      background: #e570671f;
      color: #e57067;
      border: none;
      border-radius: 0px 8px 8px 0px;
      height: 30px;
      text-align: center;
      float: right;
      &.wrap,
      &.unwrap {
        &:disabled {
          cursor: not-allowed;
          color: #0000001c !important;
        }
      }
    }
  }
}
.asset-info {
  margin: 0px 20px 10px 20px;
  display: flex;
  justify-content: space-between;
}
.warning {
  font-size: 13px;
  padding: 0px 10px;
  color: #0000004a;
}
</style>
