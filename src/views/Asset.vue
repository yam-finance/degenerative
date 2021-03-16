<template>
  <div class="assets">
    <Space size="sm" style="display:flex" />
    <Container :size="900">
      <Card>
        <h2 class="flex">
          <span>{{ $route.params.key.toUpperCase() }}</span>
          <SpacePush />
          <a class="asset-detail-switch tutorial" :href="`https://docs.degenerative.finance/synthetics/faqs`" target="_blank">FAQs</a>
          <Space size="sm" />
          <a class="asset-detail-switch tutorial" :href="`${userGuide}`" target="_blank">Guide</a>
          <Space size="sm" />
          <a class="asset-detail-switch" :href="`https://docs.degenerative.finance/synthetics/${$route.params.key}`" target="_blank">Info</a>
        </h2>
      </Card>

      <Space size="20" />

      <div v-if="$route.params.key === 'ugas'">
        <GasStats ref="gasStats" />
      </div>

      <div v-if="navPage === 'interact'">
        <div class="warning justify">
          <div>
            Warning: This is an experimental token – users should proceed with extreme caution and take the time to understand the token. Be sure to check out
            our handy Step by step <a :href="`${userGuide}`">User Guide</a> for in depth instructions. And stop by the
            <a href="https://discord.gg/fbHX7NRa52">Yam Discord</a> to ask questions anytime.
          </div>

          <div v-if="$route.params.key === 'ustonks'">
            <br />
            <b>uSTONKS NFT Giveaway</b> <span>The first 100 users to Mint $10K USDC worth of uSTONKS, then LP uSTONKS/USDC for 3 weeks qualify.</span><br />
            <span><b>uSTONKS-APR21</b> is a synthetic that will expire at 4:00PM EST on April 30th.</span>
          </div>

          <div v-if="$route.params.key === 'ugas'">
            <br />
            <span><b>uGAS-Mar21</b> is a 30 day contract that will expire at 4:00PM EST on March 31st.</span><br />
            <span><b>uGAS-JUN21</b> is a 90 day contract synthetic that will expire at 4:00PM EST on June 30th.</span>
          </div>
        </div>

        <Space size="md" />

        <Container :size="440">
          <div class="asset-info" :class="{ 'apr-info': tokenSelected }">
            <span :class="{ 'apr-block': tokenSelected }">
              <span
                v-if="tokenSelected"
                v-tooltip="{
                  content: 'Earn rewards when you mint and LP ' + assetName + ' on Uniswap.',
                  delay: { show: 150, hide: 100 },
                }"
              >
                <b>APR:</b>
                {{ aprAssetValue || aprAssetValue > 0 || aprAssetValue == -1 ? (aprAssetValue === -1 ? "0" : aprAssetValue) : "..." }}%
              </span>
            </span>
          </div>

          <div class="asset-info">
            <span>
              <span v-if="!tokenSelected">
                <b
                  v-tooltip="{
                    content: 'Select asset first.',
                    delay: { show: 150, hide: 100 },
                  }"
                  >Asset</b
                >
              </span>
              <span
                v-if="tokenSelected"
                v-tooltip="{
                  content: 'Asset price of ' + assetName,
                  delay: { show: 150, hide: 100 },
                }"
              >
                <b>Asset:</b>
                {{ price && price > 0 ? (asset[tokenSelected].collateral == "WETH" ? numeral(price, "0.0000a") : numeral(price, "0.00a")) : "..." }}
                {{ asset[tokenSelected].collateral }}
              </span>
            </span>
            <span v-if="!tokenSelected">
              <b
                v-tooltip="{
                  content: 'Select asset first.',
                  delay: { show: 150, hide: 100 },
                }"
                >APR</b
              >
            </span>
            <span>
              <div v-if="$route.params.key === 'ugas'">
                <span v-if="!tokenSelected">
                  <b
                    v-tooltip="{
                      content: 'Select asset first.',
                      delay: { show: 150, hide: 100 },
                    }"
                    >TWAP</b
                  >
                </span>
                <span
                  v-if="tokenSelected"
                  v-tooltip="{
                    content: 'TWAP price of ' + assetName,
                    delay: { show: 150, hide: 100 },
                  }"
                >
                  <b>TWAP:</b>
                  {{ currentTWAP || currentTWAP > 0 || currentTWAP == -1 ? (currentTWAP === -1 ? "0" : currentTWAP) : "..." }}
                  {{ asset[tokenSelected].collateral }}
                </span>
              </div>
              <div v-if="$route.params.key === 'ustonks'">
                <span v-if="!tokenSelected">
                  <b
                    v-tooltip="{
                      content: 'Select asset first.',
                      delay: { show: 150, hide: 100 },
                    }"
                    >Index</b
                  >
                </span>
                <span
                  v-if="tokenSelected"
                  v-tooltip="{
                    content: 'Index market price of ' + assetName,
                    delay: { show: 150, hide: 100 },
                  }"
                >
                  <b>Index:</b>
                  {{ indexPrice || indexPrice > 0 || indexPrice == -1 ? (indexPrice === -1 ? "0" : indexPrice) : "..." }}
                  {{ asset[tokenSelected].collateral }}
                </span>
              </div>
            </span>
          </div>
        </Container>

        <Space size="10" class="flex" />

        <Container id="thebox-nav" :size="440">
          <div class="row row-item-col">
            <a class="flexitem button link" :href="`${userGuide}`" target="_blank">
              Step by Step User Guide
            </a>
            <!-- <Space v-if="$route.params.key === 'ugas' || showMedian" size="10" />
            <div v-if="$route.params.key === 'ugas' || showMedian" @click="showMedianToggle" class="item button">
              <span v-if="!showMedian">Median Chart</span>
              <span v-if="showMedian">Back</span>
            </div> -->
          </div>
        </Container>

        <Space size="10" class="flex" />

        <Container :size="440">
          <button class="chart-button" @click="chartDisplay = !chartDisplay">Chart</button>
          <transition name="fade" mode="out-in">
            <div class="assetchart-wrapper" v-if="chartDisplay && tokenSelected">
              <div v-if="assetChartData && tokenSelected">
                <div class="assetchart">
                  <chart :options="chartOptionsCandle" />
                </div>
              </div>
            </div>
          </transition>

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
                v-if="$route.params.key === 'ugas'"
                @click="toNavAct('withdraw')"
                :class="{ active: navAct === 'withdraw' }"
                v-tooltip="{
                  content: '<b>Withdraw</b>: Withdraw collateral from a position.',
                  delay: { show: 150, hide: 100 },
                }"
              >
                Withdraw
              </button>
              <button
                v-if="$route.params.key === 'ustonks'"
                @click="toNavAct('withdraw')"
                :class="{ active: navAct === 'withdraw' }"
                v-tooltip="{
                  content:
                    '<b>Withdraw</b>: Withdraw collateral from a position. You can Request Withdraw if withdrawing the USDC makes your Collateral Ratio lower than the current Global Collateral Ratio. There is a 2 hour wait before the withdraw is available to ensure that you do not withdraw below the Minimum Collateral Ratio. Only use this option if you are familiar with the degenerative.finance interface and mechanism!',
                  delay: { show: 150, hide: 100 },
                }"
              >
                Withdraw
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
            </div>
            <div id="inputbox">
              <div>
                <div v-if="navAct === 'withdraw'" class="subtabs">
                  <button
                    @click="toWithdrawType('instant')"
                    :class="{ active: withdrawType === 'instant' }"
                    v-tooltip="{
                      content: '<b>Instant Withdraw</b>: Withdraw up to the current Global collateral ratio (GCR).',
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
                      content: '<b>Withdraw</b>: After a <u>withdrawal request</u> passes, you can withdraw collateral here.',
                      delay: { show: 150, hide: 100 },
                    }"
                  >
                    Withdraw
                  </button>
                </div>
                <!-- :value="`${assetName}${token.cycle}${token.year}`" -->
                <!-- >{{ `${assetName} ${token.name} ${token.year}` }}</vue-picker-option> -->
                <div class="dropdown">
                  <vue-picker class="select" v-model="tokenSelected" @change="getEmpState" placeholder="Select Token" autofocus>
                    <template #opener>
                      <span>
                        <b v-if="!tokenSelected">Select Token</b>
                        <b v-if="tokenSelected">{{ assetName }} {{ asset[tokenSelected].name }} {{ asset[tokenSelected].year }}</b>
                      </span>
                    </template>
                    <vue-picker-option value>Select Token</vue-picker-option>
                    <vue-picker-option v-for="(token, index) in asset" :key="`${index}`" :value="`${index}`">{{
                      assetName + " " + token.name + " " + token.year
                    }}</vue-picker-option>
                  </vue-picker>
                </div>
                <input
                  v-if="tokenSelected && navAct != 'deposit' && navAct != 'withdraw' && navAct !== 'lptrade'"
                  id
                  class="numeric setvalue"
                  type="number"
                  min="0"
                  name
                  v-model="tokenAmt"
                  v-on:keyup="tokenHandler"
                  :placeholder="'0.00 ' + (tokenSelected ? formAssetName(assetName, asset[tokenSelected]) + ' ' : '') + 'Tokens'"
                />
                <input
                  v-if="tokenSelected && navAct != 'redeem' && navAct !== 'lptrade' && withdrawType !== 'existing'"
                  id
                  class="numeric setvalue"
                  type="number"
                  min="0"
                  name
                  v-model="collatAmt"
                  v-on:keyup="collatHandler"
                  :placeholder="'0.00 ' + asset[tokenSelected].collateral + (navAct === 'mint' ? ' Collateral' : '')"
                />
                <label class="withdrawLabel" v-if="navAct == 'withdraw' && withdrawType == 'existing'">
                  <b>Withdraw {{ (asset[tokenSelected].collateral == "WETH" ? numeral(collatAmt, "0.0000a") : numeral(collatAmt, "0.00a")) + ' ' + asset[tokenSelected].collateral }}</b>
                </label>
                <button
                  id="act"
                  @click="act"
                  v-bind:class="{
                    error:
                      hasError == true &&
                      tokenSelected &&
                      ((approvals && approvals[formAssetName(assetName, asset[tokenSelected]) + '_' + asset[tokenSelected].collateral] === true) ||
                        (navAct == 'redeem' &&
                          approvals['EMP' + formAssetName(assetName, asset[tokenSelected]) + '_' + formAssetName(assetName, asset[tokenSelected])] === true)),
                    notokenselected: !tokenSelected,
                  }"
                  v-if="navAct !== 'lptrade'"
                  :disabled="
                    !tokenSelected ||
                      (hasError == true &&
                        tokenSelected &&
                        ((approvals && approvals[formAssetName(assetName, asset[tokenSelected]) + '_' + asset[tokenSelected].collateral] === true) ||
                          (navAct == 'redeem' &&
                            approvals['EMP' + formAssetName(assetName, asset[tokenSelected]) + '_' + formAssetName(assetName, asset[tokenSelected])] === true)))
                  "
                >
                  <span v-bind:class="{ notokenselectedlabel: !tokenSelected }">
                    {{
                      !isPending
                        ? tokenSelected
                          ? approvals
                            ? approvals[formAssetName(assetName, asset[tokenSelected]) + "_" + asset[tokenSelected].collateral] === true ||
                              (navAct == "redeem" &&
                                approvals["EMP" + formAssetName(assetName, asset[tokenSelected]) + "_" + formAssetName(assetName, asset[tokenSelected])] ===
                                  true)
                              ? actName
                              : navAct == "redeem"
                              ? "Approve EMP"
                              : "Approve Token"
                            : "Select Token"
                          : "Select Token"
                        : ""
                    }}
                  </span>
                  <beat-loader v-if="isPending" color="#FF4A4A"></beat-loader>
                </button>
              </div>
              <div class="uniswap-info" v-if="navAct === 'lptrade'">
                <div v-if="!tokenSelected" class="center bold">Select Token.</div>
                <div v-if="tokenSelected">
                  <h2 class="center unitemp">
                    <span class="unitext">Uniswap</span>
                    <span class="unicorn">🦄</span>
                  </h2>
                  <div class="row">
                    <div class="item">
                      <a
                        target="_blank"
                        class="clicklptrade"
                        :href="
                          'https://app.uniswap.org/#/add/' +
                            (asset[tokenSelected].collateral == 'WETH' ? 'ETH' : USDC) +
                            '/' +
                            asset[tokenSelected].token.address
                        "
                        v-tooltip="{
                          content: 'Click here to add liquidity on ' + assetName + '/' + asset[tokenSelected].collateral + ' LP',
                          delay: { show: 150, hide: 100 },
                          placement: 'bottom-center',
                        }"
                        >LP</a
                      >
                    </div>
                    <Space size="10" />
                    <div class="item">
                      <a
                        target="_blank"
                        class="clicklptrade"
                        :href="
                          `https://app.uniswap.org/#/swap?inputCurrency=${assetName == 'UGAS' ? 'ETH' : USDC}&outputCurrency=${
                            asset[tokenSelected].token.address
                          }`
                        "
                        v-tooltip="{
                          content: 'Click here to buy the ' + assetName + ' asset',
                          delay: { show: 150, hide: 100 },
                          placement: 'bottom-center',
                        }"
                        >Trade</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="error" v-if="tokenSelected && hasError && navAct !== 'lptrade'">{{ currentError }}</div>

          <div id="thebuttons">
            <div class="row">
              <div class="item">
                <button @click="toNavAct('lptrade')" :class="{ active: navAct === 'lptrade' }" class="button lptrade">LP/Trade</button>
              </div>

              <Space size="16" />

              <div class="item">
                <button v-if="assetName == 'UGAS'" class="button wrapeth" @click="toggleWrap">Wrap ETH</button>
                <a v-if="assetName == 'USTONKS'" class="button buyusdc" :href="'https://app.uniswap.org/#/swap?outputCurrency=' + USDC" target="_blank"
                  >Buy USDC</a
                >
              </div>
            </div>
            <div class="wrapETH">
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

            <div v-if="settleTime" class="settling">
              <Space size="10" />
              <button
                class="button settle"
                @click="makeApprovalEmp('Settle')"
                v-if="
                  tokenSelected &&
                    settleTime &&
                    !(
                      tokenSelected &&
                      approvals['EMP' + formAssetName(assetName, asset[tokenSelected]) + '_' + formAssetName(assetName, asset[tokenSelected])] === true
                    )
                "
              >
                <span v-if="!empPendingApproval">Approve EMP to Settle</span>
                <beat-loader v-if="empPendingApproval" color="#71571e"></beat-loader>
              </button>
              <button
                class="button settle"
                @click="settleAsset"
                v-if="
                  tokenSelected &&
                    settleTime &&
                    tokenSelected &&
                    approvals['EMP' + formAssetName(assetName, asset[tokenSelected]) + '_' + formAssetName(assetName, asset[tokenSelected])] === true
                "
              >
                <span>Settle</span>
              </button>
            </div>
          </div>

          <Container id="thebox-nav" :size="440" v-if="tokenSelected">
            <div class="row row-item-col">
              <a class="flexitem warning-message">
                Watch your Risk Levels: Your position will be liquidated if 2hr TWAP increases by {{ assetIncrease }}%.
              </a>
            </div>
          </Container>

          <Space size="10" class="flex" v-if="tokenSelected" />

          <div class="info" v-if="info">
            <label>
              <b>{{ tokenSelected ? formAssetName(assetName, asset[tokenSelected]) : "No Synthetic" }} Selected</b>
            </label>
            <label
              v-tooltip="{
                content: '2hr TWAP at which your position will be liquidiated',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              Liquidation Price:
              <b>{{ liquidationPrice }}</b>
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
                content: 'Collateral ratio of this transaction',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              Current Tx Collateral Ratio:
              <b>{{ numeral(pricedTxCR, "0.0000a") }}</b>
            </label>

            <br />
            <label>
              <b>Your Account</b>
            </label>
            <label v-if="assetName == 'UGAS'"
              >Your WETH: <b>{{ balanceWETH ? numeral(Number(balanceWETH), "0.0000a") : "0" }}</b></label
            >
            <label v-if="assetName !== 'UGAS'"
              >Your USDC: <b>{{ balanceUSDC ? numeral(Number(balanceUSDC), "0.00a") : "0" }}</b></label
            >
            <label v-if="tokenSelected">
              Your {{ formAssetName(assetName, asset[tokenSelected]) }}:
              <b>{{ tokenBalance ? numeral(Number(tokenBalance), "0.00a") : "0" }}</b>
            </label>


            <br />
            <label>
              <b>Your Position</b>
            </label>
            <label
              v-if="tokenSelected"
              v-tooltip="{
                content: 'Total minted uTokens in this position',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              Position Outstanding {{ formAssetName(assetName, asset[tokenSelected]) }}:
              <b>{{ currTokens ? currTokens : "0" }}</b>
            </label>
            <label
              v-if="tokenSelected"
              v-tooltip="{
                content: 'Total locked as collateral',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              Position Collateral {{ asset[tokenSelected].collateral }}:
              <b>{{ currCollat ? currCollat : "0" }}</b>
            </label>
            <label
              v-tooltip="{
                content: 'Collateral ratio of your entire position',
                delay: { show: 150, hide: 100 },
                placement: 'left-center',
              }"
            >
              Collateral Ratio (Post-Tx):
              <b>{{ isFinite(pricedCR) ? numeral(pricedCR, "0.0000a") : 0 }}</b>
            </label>
          </div>
        </Container>

        <!--
        <Container v-if="showMedian" :size="440">
          <div>
            <la-cartesian
              class="mobile-median-chart"
              narrow
              :bound="[n => n - 40, n => n + 40]"
              :data="chartOptionsMedianValues"
              :width="460 - 60"
              :height="250 - 60"
            >
              <la-line dot animated curve :width="2" prop="value" color="var(--primary)">
                <g slot-scope="props" fill="rgb(255 74 74 / 50%)" :font-size="12">
                  <text :x="props.x" :y="props.y" text-anchor="middle" dy="-.5em">{{ props.value }}</text>
                </g>
              </la-line>
              <la-x-axis prop="name" color="rgb(0 0 0 / 40%)" font-weight="bold" :font-size="10"></la-x-axis>
              <la-y-axis prop="value" :font-size="10"></la-y-axis>
            </la-cartesian>
            <h4 class="center">Gas Median Chart</h4>
          </div>
        </Container>
        -->
        <!-- <CardLink title="Learn More about Degenerative" link="https://docs.degenerative.finance" /> -->
      </div>
    </Container>
  </div>
</template>
<script>
/* eslint-disable @typescript-eslint/camelcase */
import store from "@/store";
import { mapActions, mapGetters } from "vuex";
import { getLiquidationPrice, getUniswapDataDaily, splitChartData, get30DMedian, getCurrentTWAP, getIndexFromSpreadsheet, formAssetName } from "../utils";
import BigNumber from "bignumber.js";
import { getOffchainPriceFromTokenSymbol, isPricefeedInvertedFromTokenSymbol } from "../utils/getOffchainPrice";
import { WETH, USDC } from "@/utils/addresses";
import EMPContract from "@/utils/abi/emp.json";
import Assets from "../../protocol/assets.json";

const ethDecs = new BigNumber(10).pow(new BigNumber(18));
const usdcDecs = new BigNumber(10).pow(new BigNumber(6));
// const empDecs = new BigNumber(10).pow(new BigNumber(18));

const colDec = {
  WETH: new BigNumber(10).pow(new BigNumber(18)),
  USDC: new BigNumber(10).pow(new BigNumber(6)),
};

export default {
  name: "Asset",
  head: {
    title: "Asset",
    meta: [{ name: "description", content: "Degenerative Asset." }],
  },
  data() {
    return {
      asset: {},
      assetName: null,
      navPage: "interact",
      actName: "Mint",
      withdrawType: "new",
      navAct: "mint",
      info: true,
      tokenSelected: null,
      showInfo: false,
      showInfoButtonText: "Gas Info",
      liquidationPrice: 0,
      assetIncrease: 0,
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
      // showMedian: false,
      chartOptionsMedianValues: [{ name: "Initializing", value: 200 }],
      medianData: [],
      currentTWAP: 0,
      indexPrice: 0,
      chartOptionsCandle: {},
      balanceWETH: 0,
      balanceUSDC: 0,
      tokenBalance: 0,
      assetChartData: null,
      isPending: false,
      empPendingApproval: false,
      approvals: {},
      showWrapETH: false,
      approvalsUpdate: 0,
      amountToWrap: 0,
      amountToUnwrap: 0,
      currCollat: null,
      currTokens: null,
      chartHourly: false,
      currLiquidationPrice: null,
      periodicalChecks: null,
      periodicalChecksTime: 100,
      aprAssetValue: 0,
      aprAssetValueB: 0.75,
      aprAssetValueC: 0.25,
      settleTime: false,
      chartDisplay: false,
      USDC: USDC,
    };
  },
  async mounted() {
    await this.initAsset();
  },
  computed: {
    account() {
      return store.state.account;
    },
    userGuide() {
      let guide;
      switch (this.$route.params.key) {
        case "ustonks":
          guide = "https://yamfinance.medium.com/degenerative-finance-ustonks-user-guide-415cbb6abf45";
          break;
        case "ugas":
          guide = "https://yamfinance.medium.com/degenerative-finance-ugas-user-guide-9d2622dde72";
          break;
        default:
          guide = "";
          break;
      }
      return guide;
    },
  },
  watch: {
    tokenSelected: function(newVal, oldVal) {
      if (!this.tokenSelected) {
        return;
      }
      this.resetNumbers();
      this.initChart();
      this.fetchApprovalAll();
      this.getEmpState();
      this.settleTimeCheckExpired();
      this.getRewards();
    },
    navAct: function(newVal, oldVal) {
      if (!this.tokenSelected) {
        return;
      }
      this.fetchApprovalAll();
    },
    account(newAccount, oldAccount) {
      this.resetNumbers();
      this.settleTimeCheckExpired();
      this.updateUserInfo();
    },
    // make account switch
    approvalsUpdate(newApprovals, oldApprovals) {
      this.fetchApprovalAll();
      this.settleTimeCheckExpired();
    },
    $route: async function(newVal, oldVal) {
      await this.initAsset();
    }
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
      "settle",
      "getUserBalanceWETH",
      "getUserBalanceUSDC",
      "getUserAssetTokenBalance",
      "makeContractApproval",
      "fetchContractApproval",
      "wrapETH",
      "unwrapETH",
      "checkContractApprovals",
      "getMiningRewards",
      "getUniPrice",
    ]),
    ...mapGetters(["empStateOld", "empState"]),
    async initAsset() {
      this.tokenSelected = null;
      this.asset = Assets[this.$route.params.key];
      this.assetName = Assets[this.$route.params.key] ? this.$route.params.key.toUpperCase() : "NONE";

      this.medianData = await get30DMedian();
      this.currentTWAP = await getCurrentTWAP();
      this.indexPrice = await getIndexFromSpreadsheet();

      if (this.tokenSelected) {
        this.fetchApprovalAll();
      }

      // polling
      this.periodicalChecks = setInterval(() => {
        this.getRewards();
      }, this.periodicalChecksTime * 1000);

      await this.lastPrice();
      await this.initChart();
      await this.initMedianChart();
      await this.getUserBalances();
      await this.checkUpdateApprovals();
      if (this.$refs.gasStats && this.$route.params.key == "ugas") {
        await this.$refs.gasStats.getAccountStats();
      }
    },
    async getUserBalances() {
      this.balanceWETH = await this.getUserBalanceWETH();
      this.balanceWETH = new BigNumber(this.balanceWETH).div(ethDecs).toFixed(4);

      this.balanceUSDC = await this.getUserBalanceUSDC();
      this.balanceUSDC = new BigNumber(this.balanceUSDC).div(usdcDecs).toFixed(4);
    },
    async getAssetInstanceBalance() {
      if (!this.tokenSelected) {
        return;
      }
      const assetInstance = this.asset[this.tokenSelected];
      const base = new BigNumber(10).pow(new BigNumber(assetInstance.token.decimals));
      this.tokenBalance = await this.getUserAssetTokenBalance({ assetInstance: assetInstance });
      this.tokenBalance = new BigNumber(this.tokenBalance).div(base);
    },
    async initChart() {
      if (!this.tokenSelected || !this.asset[this.tokenSelected].token.address) {
        return;
      }
      const redColor = "#ad3c3c";
      const redBorderColor = "#ad3c3c";
      const greenColor = "#48ad3c";
      const greenBorderColor = "#48ad3c";
      const twapLineColor = "#333";
      const from = 1606742010; // NOV: 1606742010 - test: 1604150010
      // const assetChart = await getUniswapDataHourly(this.assets[this.tokenSelected], from); // Hourly
      const assetChart = await getUniswapDataDaily(this.asset[this.tokenSelected].token.address, from); // Daily
      // console.log("UGASJAN21 assetChart", assetChart);

      const medianGasValues = [];
      const medianGasNames = [];
      const tempChartData = [];
      const tempChartTWAPData = [];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      if (this.assetName == "UGAS") {
        for (const element of this.chartOptionsMedianValues) {
          const ts = Date.parse(element.name);
          const dateObject = new Date(ts);
          const monthIndex = dateObject.getMonth();
          const monthName = months[monthIndex];
          const day = dateObject.getDate();
          const timestampDate = monthName + ", " + day;
          medianGasNames.push(timestampDate);
        }
      }

      if (this.assetName == "USTONKS") {
        for (const element of assetChart) {
          tempChartData.push([element.timestampDate, element.open, element.close, element.open, element.close]);
        }
      }

      if (this.assetName == "UGAS") {
        for (const element of assetChart) {
          tempChartData.push([element.timestampDate, element.openETH, element.closeETH, element.openETH, element.closeETH]);
          tempChartTWAPData.push(element.twapETH);
          if (medianGasNames.includes(element.timestampDate)) {
            const index = medianGasNames.indexOf(element.timestampDate);
            const valueToBeAdded = this.chartOptionsMedianValues[index].value / 1000;
            medianGasValues.push(valueToBeAdded);
          } else {
            medianGasValues.push(null);
          }
        }
      }

      // chart: uniswap data
      this.assetChartData = splitChartData(tempChartData);
      // this.assetChartData = splitChartData([
      //   ["07/01/2020", 320, 320, 287, 362],
      //   ["06/19/2020", 190, 148, 126, 190],
      // ]);

      this.chartOptionsCandle = {
        title: {
          text: formAssetName(this.assetName, this.asset[this.tokenSelected]),
          top: 5,
          left: 45,
          textStyle: {
            color: "rgb(45 45 45 / 55%)",
            fontSize: 14,
          },
        },
        // legend: {
        //   data: ["Asset"],
        // },
        tooltip: {
          show: true,
          trigger: "item", // axis
          axisPointer: {
            type: "cross",
            label: {
              color: "#fff",
              backgroundColor: "rgb(45 45 45 / 45%)",
              fontSize: 9,
            },
          },
        },
        grid: {
          top: "4%",
          left: "12%",
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
          name: "AAA",
          nameLocation: "end",
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
            start: 75,
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
            // name: this.$route.params.key.toUpperCase(),
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
          {
            name: "Gas Median",
            type: "line",
            data: medianGasValues,
            smooth: false,
            symbolSize: 3,
            itemStyle: {
              color: redColor,
            },
            lineStyle: {
              width: 2,
              opacity: 0.6,
            },
          },
        ],
      };
    },
    initMedianChart() {
      if (this.medianData.length >= 1) {
        this.chartOptionsMedianValues = [];
        for (let i = 0; i < this.medianData.length; i++) {
          this.chartOptionsMedianValues.push({
            name: this.moment(this.medianData[i].timestamp).format("MM/DD"),
            value: Number(parseFloat(this.medianData[i].price / 10 ** 9).toFixed(0)),
          });
        }
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
    checkRequestWithdraw() {
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
        } else if (this.pricedCR < 1.5) {
          this.hasError = true;
          this.currentError = "Withdrawal request would put Collat Ratio < 1.5x!";
        }
      }
    },
    checkWithdraw() {
      this.updateLiqPrice(false, true);
      if (this.currPos && this.tokenSelected) {
        this.collatAmt = new BigNumber(this.currPos.withdrawalRequestAmount).div(colDec[this.asset[this.tokenSelected].collateral]);
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
        } else if (
          (new BigNumber(this.currPos.rawCollateral) - new BigNumber(this.collatAmt).times(colDec[this.asset[this.tokenSelected].collateral])) /
            new BigNumber(this.currPos.tokensOutstanding) /
            this.price <
          this.gcr
        ) {
          const numerator = new BigNumber(this.currPos.rawCollateral) - new BigNumber(this.collatAmt).times(colDec[this.asset[this.tokenSelected].collateral]);
          console.log("numerator", numerator);
          console.log("denom", this.currPos.tokensOutstanding);
          const newcr =
            (new BigNumber(this.currPos.rawCollateral) - new BigNumber(this.collatAmt).times(colDec[this.asset[this.tokenSelected].collateral])) /
            new BigNumber(this.currPos.tokensOutstanding);
          console.log(
            "HERE",
            newcr.toString(),
            new BigNumber(this.currPos.rawCollateral),
            new BigNumber(this.collatAmt).times(colDec[this.asset[this.tokenSelected].collateral]),
            this.currPos.tokensOutstanding,
            this.gcr
          );
          this.hasError = true;
          this.currentError = "Withdrawal would put position below Global Collat Ratio";
        }
      }
    },
    checkInstantWithdraw() {
      this.updateLiqPrice(false, true);
      if (this.currPos && this.tokenSelected) {
        const tn = new Date().getTime() / 1000;
        if (this.checkHasPending()) {
          this.hasError = true;
          this.currentError = "Instant withdraw not allowed with active pending withdraw";
        } else if (Number(this.currPos.rawCollateral) == 0) {
          this.hasError = true;
          this.currentError = "No Collateral to withdraw from this position";
        } 
        /*
        else if (
          (new BigNumber(this.currPos.rawCollateral) - new BigNumber(this.collatAmt).times(colDec[this.asset[this.tokenSelected].collateral])) /
            new BigNumber(this.currPos.tokensOutstanding) /
            this.price <
          this.gcr
        ) {
          const numerator = new BigNumber(this.currPos.rawCollateral) - new BigNumber(this.collatAmt).times(colDec[this.asset[this.tokenSelected].collateral]);
          console.log("numerator", numerator);
          console.log("denom", this.currPos.tokensOutstanding);
          const newcr =
            (new BigNumber(this.currPos.rawCollateral) - new BigNumber(this.collatAmt).times(colDec[this.asset[this.tokenSelected].collateral])) /
            new BigNumber(this.currPos.tokensOutstanding);
          console.log(
            "HERE",
            newcr.toString(),
            new BigNumber(this.currPos.rawCollateral),
            new BigNumber(this.collatAmt).times(colDec[this.asset[this.tokenSelected].collateral]),
            this.currPos.tokensOutstanding,
            this.gcr
          );
          this.hasError = true;
          this.currentError = "Withdrawal would put position below Global Collat Ratio";
        }
        */
      }
    },
    async settleTimeCheckExpired() {
      if (!this.tokenSelected) {
        return;
      }
      const assetInstance = this.asset[this.tokenSelected];
      await this.getEmpState();
      if (assetInstance.emp.new) {
        console.log("settleTimeCheckExpired empState", store.state.empState);
        if (store.state.empState && store.state.empState.isExpired) {
          this.settleTime = true;
          this.asset[this.tokenSelected].expired = true;
        } else {
          this.settleTime = false;
          this.asset[this.tokenSelected].expired = false;
        }
      } else {
        console.log("settleTimeCheckExpired empStateOld", store.state.empStateOld);
        if (store.state.empStateOld && store.state.empStateOld.isExpired) {
          this.settleTime = true;
          this.asset[this.tokenSelected].expired = true;
        } else {
          this.settleTime = false;
          this.asset[this.tokenSelected].expired = false;
        }
      }

      // const settleDayAfter = this.assets[this.tokenSelected].emp.settleTime || 0; // after every xth day of the month enable settle
      // // we can have this set custom by asset, see assets in data()
      // const current = this.moment().format("DD");
      // console.log("settleTimeCheckExpired", current);
      // if (current < settleDayAfter) {
      //   console.log("settleTime is not due yet");
      //   this.settleTime = false;
      // } else {
      //   console.log("settleTime due");
      //   this.settleTime = true;
      // }
    },
    async settleAsset() {
      if (!this.tokenSelected) {
        return;
      }

      console.log("settleAsset");
      const assetInstance = this.asset[this.tokenSelected];
      this.empPendingApproval = true;
      this.settle({
        assetInstance: assetInstance,
      })
        .then(async e => {
          console.log("settle", e[1]);
          this.empPendingApproval = false;
          if (e[1] && e[1] != "") {
            this.hasError = true;
            this.currentError = "Transaction would fail. Check balances & approvals";
          }
          this.updateUserInfo();
        })
        .catch(async e => {
          console.log("error", e);
          this.empPendingApproval = false;
          if (e[1] && e[1] != "") {
            this.hasError = true;
            this.currentError = "Transaction would fail. Check balances & approvals";
          }
          this.updateUserInfo();
        });
    },
    updateCR(removeTokens = false, removeCollateral = false) {
      if (this.currPos && this.tokenSelected) {
        const assetInstance = this.asset[this.tokenSelected];
        const pos = Number(new BigNumber(this.currPos.tokensOutstanding).div(new BigNumber(10).pow(new BigNumber(assetInstance.token.decimals))));
        const col = Number(new BigNumber(this.currPos.rawCollateral).div(colDec[this.asset[this.tokenSelected].collateral]));
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
      if (this.currPos && this.tokenSelected) {
        const assetInstance = this.asset[this.tokenSelected];
        const pos = Number(new BigNumber(this.currPos.tokensOutstanding).div(new BigNumber(10).pow(new BigNumber(assetInstance.token.decimals))));
        const col = Number(new BigNumber(this.currPos.rawCollateral).div(colDec[this.asset[this.tokenSelected].collateral]));
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
        this.liquidationPrice = getLiquidationPrice(
          totalCollat,
          totalTokens,
          this.collReq.div(colDec.WETH),
          isPricefeedInvertedFromTokenSymbol("uGAS")
        ).toFixed(4);
      } else {
        if (this.tokenSelected) {
          this.liquidationPrice = getLiquidationPrice(
            this.tokenAmt ? this.tokenAmt : 0,
            this.collatAmt ? this.collatAmt : 0,
            this.collReq.div(colDec.WETH),
            isPricefeedInvertedFromTokenSymbol("uGAS")
          ).toFixed(4);
        }
      }
    },
    currLiqPrice() {
      if (!this.tokenSelected || !this.currPos) {
        return;
      }

      const assetInstance = this.asset[this.tokenSelected];
      const pos = Number(new BigNumber(this.currPos.tokensOutstanding).div(new BigNumber(10).pow(new BigNumber(assetInstance.token.decimals))));
      const col = Number(new BigNumber(this.currPos.rawCollateral).div(colDec[this.asset[this.tokenSelected].collateral]));
      this.currLiquidationPrice = getLiquidationPrice(
        col,
        pos,
        this.collReq.div(colDec.WETH),
        isPricefeedInvertedFromTokenSymbol("uGAS")
      ).toFixed(4);
    },
    runChecks() {
      if (!this.tokenSelected) {
        return;
      }

      const assetInstance = this.asset[this.tokenSelected];

      this.hasError = false;
      this.currentError = "";
      if (this.navAct == "withdraw") {
        this.currLiqPrice();
        if (this.withdrawType == "existing") {
          this.checkWithdraw();
        } else if (this.withdrawType == "new") {
          this.checkRequestWithdraw();
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
        } else if ((assetInstance.collateral == "WETH" ? Number(this.balanceWETH) : Number(this.balanceUSDC)) < Number(this.collatAmt)) {
          this.hasError = true;
          this.currentError =
            "Not enough " +
            assetInstance.collateral +
            "." +
            (assetInstance.collateral === "WETH" ? " Please wrap ETH below." : " Please buy " + assetInstance.collateral + ".");
        }
      } else if (this.navAct == "mint") {
        this.currLiqPrice();
        this.updateLiqPrice();
        // if (this.collatAmt < this.balanceWETH) {
        //   this.hasError = true;
        //   this.currentError = "Insufficient";
        //   return;
        // }
        let minTokens = new BigNumber(this.currEMP.minSponsorTokens);
        minTokens = minTokens.dividedBy(new BigNumber(10).pow(new BigNumber(assetInstance.token.decimals)));
        if (this.tokenAmt && this.tokenAmt < minTokens) {
          this.hasError = true;
          this.currentError = "Minimum mint amount is " + minTokens;
          return;
        } else if ((assetInstance.collateral == "WETH" ? Number(this.balanceWETH) : Number(this.balanceUSDC)) < Number(this.collatAmt)) {
          this.hasError = true;
          this.currentError =
            "Not enough " +
            assetInstance.collateral +
            "." +
            (assetInstance.collateral === "WETH" ? " Please wrap ETH below." : " Please buy " + assetInstance.collateral + ".");
          return;
        }
        const thisError = "Collateral Ratio below global minimum";
        if (!this.hasError || this.currentError == thisError) {
          if (this.pricedTxCR && Number(this.pricedTxCR) < Number(this.gcr)) {
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
        this.checkRequestWithdraw();
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
    async getPosition() {
      if (!this.tokenSelected) {
        return;
      }
      const pos = await this.getPositionData(this.asset[this.tokenSelected]);
      return pos;
    },
    async getEmpState() {
      if (!this.tokenSelected) {
        return;
      }

      const assetInstance = this.asset[this.tokenSelected];
      console.log("assetInstance", assetInstance);
      let k;
      let pos;
      if (this.price == 0) {
        const res = await Promise.all([this.setEMPState(assetInstance), this.lastPrice(), this.getPosition()]);
        k = res[0];
        this.price = res[1];
        pos = res[2];
      } else {
        const res = await Promise.all([this.setEMPState(assetInstance), this.getPosition()]);
        k = res[0];
        pos = res[1];
      }
      this.currPos = pos;
      if (this.currPos) {
        this.currTokens = new BigNumber(this.currPos.tokensOutstanding)
          .div(new BigNumber(10).pow(new BigNumber(assetInstance.token.decimals)))
          .toFixed(4)
          .toString();
        this.currCollat = new BigNumber(this.currPos.rawCollateral)
          .div(colDec[this.asset[this.tokenSelected].collateral])
          .toFixed(4)
          .toString();
      }
      this.currEMP = k;
      const totalColl = k.cumulativeFeeMultiplier
        .div(10 ** 18)
        .times(k.rawTotalPositionCollateral.dividedBy(colDec[this.asset[this.tokenSelected].collateral]));
      const totalTokens = k.totalTokensOutstanding.div(new BigNumber(10).pow(new BigNumber(assetInstance.token.decimals)));
      this.gcr = totalTokens > 0 ? (totalColl / totalTokens / this.price).toFixed(4) : 0;
      console.log("this.gcr", this.gcr);
      this.collReq = k.collateralRequirement;
      this.getAssetInstanceBalance();
      this.posUpdateHandler();
      this.updateUserInfo();
    },
    async getRewards() {
      if (!this.tokenSelected) {
        return;
      }

      // const dayAfter = 7;
      // const current = this.moment().format("DD");
      // if (current > dayAfter) {
      //   console.debug("Coming Month");
      //   const currentMonth = await this.getCurrentMonthRewards();
      //   this.getComingMonthRewards(currentMonth);
      // } else {
      this.aprAssetValue = await this.getCurrentMonthRewards();
      console.debug("aprAssetValue", this.aprAssetValue);
      // }
    },
    async getCurrentMonthRewards() {
      if (!this.tokenSelected || !this.asset[this.tokenSelected]) {
        return;
      }
      await this.getEmpState();
      if (this.asset[this.tokenSelected].expired) {
        return -1;
      }
      const price = await this.lastPrice(this.tokenSelected);
      const asset = {
        assetName: this.assetName,
        assetInstance: this.asset[this.tokenSelected],
        assetPrice: price,
      };
      const resultBase = await this.getMiningRewards(asset);
      let result;
      if (this.asset[this.tokenSelected] && this.asset[this.tokenSelected].apr) {
        if (this.asset[this.tokenSelected].apr.force >= 0) {
          result = Number(this.asset[this.tokenSelected].apr.force);
        } else {
          this.asset[this.tokenSelected].apr.value = resultBase;
          const aprExtra = this.asset[this.tokenSelected].apr.extra;
          result = this.numeral(Number(resultBase) + (aprExtra ? aprExtra : 0), "0.00a");
        }
        return result && result !== 0 ? result : -1;
      } else {
        return -1;
      }
    },
    async resetNumbers() {
      // this.asset = {},
      // this.assetName = null,
      this.price = 0;
      this.aprAssetValue = 0;
      this.assetIncrease = 0;
      this.settleTime = false;
      this.tokenAmt = null;
      this.collatAmt = null;
    },
    async lastPrice(specificToken) {
      const specificTokenSelected = specificToken ? specificToken : this.tokenSelected;
      if (specificTokenSelected) {
        // this.price = await getOffchainPriceFromTokenSymbol("uGAS");
        const assetInstance = this.asset[this.tokenSelected];
        const tokenB = this.assetName == "UGAS" ? WETH : USDC;
        const price = Number((await this.getUniPrice({ tokenA: assetInstance.token.address, tokenB: tokenB })).toString()) || 0;
        this.price = price;
        console.log("token price", this.price);
        return this.price;
      }
    },
    async act() {
      if (!this.tokenSelected) {
        return;
      }
      const assetInstance = this.asset[this.tokenSelected];
      const assetTokenName = formAssetName(this.assetName, assetInstance);
      const appEmpId = "EMP" + assetTokenName + "_" + assetTokenName;
      const appColId = assetTokenName + "_" + assetInstance.collateral;
      if (!this.approvals[appColId] && this.actName !== "Redeem") {
        this.isPending = true;
        this.makeApproval(appColId, this.asset[this.tokenSelected].emp.address, assetInstance.collateral === "WETH" ? WETH : USDC)
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
              assetInstance: assetInstance,
              collat: new BigNumber(this.collatAmt).times(colDec[this.asset[this.tokenSelected].collateral]).toFixed(),
              tokens: new BigNumber(this.tokenAmt).times(new BigNumber(10).pow(new BigNumber(assetInstance.token.decimals))).toFixed(),
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
            this.deposit({
              assetInstance: assetInstance,
              collat: new BigNumber(this.collatAmt).times(colDec[this.asset[this.tokenSelected].collateral]).toString(),
            })
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
            this.requestWithdrawal({
              assetInstance: assetInstance,
              collat: new BigNumber(this.collatAmt).times(colDec[this.asset[this.tokenSelected].collateral]).toString(),
            })
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
            this.withdrawRequestFinalize({ assetInstance: assetInstance })
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
            this.withdraw({
              assetInstance: assetInstance,
              collat: new BigNumber(this.collatAmt).times(colDec[this.asset[this.tokenSelected].collateral]).toString(),
            })
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
            if (!this.approvals[appEmpId]) {
              this.makeApprovalEmp("Redeem");
            } else {
              console.log("redeem");
              this.isPending = true;
              this.redeem({
                assetInstance: assetInstance,
                tokens: new BigNumber(this.tokenAmt).times(new BigNumber(10).pow(new BigNumber(assetInstance.token.decimals))).toString(),
              })
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
      await Promise.all([this.getUserBalances(), this.getAssetInstanceBalance(), this.getPosition(), this.checkUpdateApprovals()]);
    },
    toNavPage(on) {
      this.navPage = on;
      if (this.navPage === "info") {
        this.initMedianChart();
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
      const assetInstance = this.asset[this.tokenSelected];
      const COLLAT_BUFFER_FACTOR = 1.0 + (25 * (0.01/100)) // 25 bps extra

      let collatAmount = 0;
      switch (assetInstance.collateral) {
        case "WETH":
          collatAmount = ((this.tokenAmt * this.gcr * this.price + 0.0001) * COLLAT_BUFFER_FACTOR).toFixed(6);
          break;
        case "USDC":
          collatAmount = ((this.tokenAmt * this.gcr * this.price + 0.01) * COLLAT_BUFFER_FACTOR).toFixed(2);
          break;
        default:
          console.error("collateral not defined");
          break;
      }
      this.collatAmt = collatAmount;
      this.posUpdateHandler();
    },
    collatHandler() {
      this.posUpdateHandler();
    },
    async posUpdateHandler() {
      if (this.price == 0) {
        await this.lastPrice();
      }
      console.log("this.tokenAmt", this.tokenAmt);
      console.log("this.collatAmt", this.collatAmt);
      const resultantCR = this.tokenAmt > 0 ? Number(this.collatAmt) / Number(this.tokenAmt) : 0;
      this.pricedTxCR = this.price !== 0 ? (resultantCR / this.price).toFixed(4) : 0;
      const newCollat = Number(this.collatAmt) + Number(this.existingColl);
      const newPos = Number(this.tokenAmt) + Number(this.existingTokens);
      this.pricedCR = newPos > 0 ? (newCollat / newPos / this.price).toFixed(4) : 0;
      this.runChecks();
      
      if (this.liquidationPrice == 0) {
        this.assetIncrease = 0;
      } else {
        this.assetIncrease = (((this.liquidationPrice / this.price) - 1) * 100).toFixed(2);
      }
    },
    async makeApproval(identifier, spenderAddress, tokenAddress) {
      if (spenderAddress) {
        await this.makeContractApproval({ identifier: identifier, spenderAddress: spenderAddress, tokenAddress: tokenAddress });
      }
    },
    async fetchApproval(identifier, spenderAddress, tokenAddress) {
      if (spenderAddress) {
        await this.fetchContractApproval({ identifier: identifier, spenderAddress: spenderAddress, tokenAddress: tokenAddress });
      }
    },
    async fetchApprovalAll() {
      const assetInstance = this.asset[this.tokenSelected];
      const assetTokenName = formAssetName(this.assetName, assetInstance);
      const appEmpId = "EMP" + assetTokenName + "_" + assetTokenName;
      const appColId = assetTokenName + "_" + assetInstance.collateral;
      if (this.navAct == "redeem") {
        this.fetchApproval(appEmpId, assetInstance.emp.address, assetInstance.token.address);
      } else {
        this.fetchApproval(appColId, assetInstance.emp.address, assetInstance.collateral === "WETH" ? WETH : USDC);
      }
    },
    async checkUpdateApprovals() {
      console.log("updating approvals");
      this.approvals = await this.checkContractApprovals();
    },
    async makeApprovalEmp(from) {
      if (!this.tokenSelected) {
        return;
      }
      const assetInstance = this.asset[this.tokenSelected];
      const assetTokenName = formAssetName(this.assetName, assetInstance);
      const appEmpId = "EMP" + assetTokenName + "_" + assetTokenName;
      const appColId = assetTokenName + "_" + assetInstance.collateral;
      if (from === "Redeem") {
        this.isPending = true;
      }
      if (from === "Settle") {
        this.empPendingApproval = true;
      }
      this.makeApproval(appEmpId, assetInstance.emp.address, assetInstance.token.address)
        .then(async e => {
          console.log("approve", e[1]);
          if (from === "Redeem") {
            this.isPending = false;
            if (e[1] && e[1] != "") {
              this.hasError = true;
              this.currentError = "Transaction would fail. Check balances & approvals";
            }
          }
          if (from === "Settle") {
            this.empPendingApproval = false;
          }

          this.updateUserInfo();
        })
        .catch(async e => {
          console.log("error", e);
          if (from === "Redeem") {
            this.isPending = false;
            if (e && e != "") {
              this.hasError = true;
              this.currentError = "Transaction would fail. Check balances & approvals";
            }
          }
          if (from === "Settle") {
            this.empPendingApproval = false;
          }
          this.updateUserInfo();
        });
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
    /*
    showMedianToggle() {
      console.log("showMedian", this.showMedian);
      this.showMedian = !this.showMedian;
    },
    */
    formAssetName,
  },
};
</script>
<style lang="scss" scoped>
.hideDropdown {
  display: none;
}
div.error {
  color: var(--primary);
  background: #0000000d;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
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
  overflow: hidden;
  white-space: nowrap;
  button {
    cursor: pointer;
    width: calc(100% / 4);
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
  }
}
#thebox {
  box-shadow: 0px 4px 10px 2px #00000014;
  box-shadow: 0px 4px 10px 2px #ca625a14;
  border-radius: 10px;
  z-index: 1;
}
#thebuttons {
  width: 90%;
  margin: 10px auto;

  .button {
    cursor: pointer;
    display: block;
    color: #fff;
    border: none;
    text-align: center;
    border-radius: 8px;
    padding: 2px 20px;
    width: 100%;
  }
  .settle {
    background: #e5be67;
    border: 2px solid #cca54e;
    height: 46px;
    transition: background 0.1s ease-in-out;
    &:active {
      background: #ecc672;
    }
    &:disabled {
      opacity: 0.5;
      cursor: no-drop;
    }
  }
}
.chart-button {
  cursor: pointer;
  background: #0000000d;
  padding: 5px 0px 15px 0px;
  margin: 0 auto;
  border: none;
  border-radius: 10px 10px 0px 0px;
  margin-bottom: -10px;
  font-weight: bold;
  font-size: 14px;
  color: #e57067;
  width: 100%;
}
.assetchart-wrapper {
  width: 100%;
  background: #f9f8f8;
  border-right: 1px solid #f2edee;
  border-left: 1px solid #f2edee;
  padding-top: 20px;
  margin: 0 auto;
  margin-bottom: -10px;
}

#act {
  cursor: pointer;
  background: white;
  background: var(--back-act);
  color: var(--primary);
  height: 50px;
  font-size: 18px;
  font-weight: 600;
  border: 0px;
  border-radius: 0px 0px 10px 10px;
  width: 100%;
  transition: background 0.1s ease-in-out;

  &:active {
    background: #f2edef;
  }
  &.error {
    cursor: not-allowed;
    color: #0000001c !important;
  }
  &.notokenselected {
    color: #0000001c !important;
    &:active {
      background: var(--back-act);
    }
    .notokenselectedlabel {
      border: 1.5px solid rgb(0 0 0 / 0.05);
      width: 100%;
      display: block;
      border-radius: 7px;
      padding: 3px 0px;
      &:active {
        background: #00000005;
      }
    }
  }
}

.v-spinner {
  margin-top: 5px;
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
  padding: 0px 10px;
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
  &.info {
    background: var(--primary);
    color: #fff;
  }
  &.tutorial {
    background: #6799e5;
    color: #fff;
  }
}

.echarts,
.assetchart {
  width: 100%;
  height: 160px;
  margin-bottom: 15px;
}

.wrapETH {
  .wraprow {
    float: left;
    width: 100%;
    margin: 5px 0px 0px 0px;
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

#thebox-nav {
  .warning-message {
    cursor: auto;
    background: #f2eeef;
    color: #e57067;
    text-align: center;
    border-radius: 5px;
    padding: 5px 10px;
    position: relative;
    font-weight: bold;
    font-size: 14px;
  }
  .button {
    cursor: pointer;
    background: #f2eeef;
    color: #e57067;
    border-radius: 5px;
    padding: 5px 10px;
    position: relative;
    font-weight: bold;
    font-size: 14px;
    &.link {
      &:after {
        content: url("../assets/external.svg");
        width: 24px;
        height: 24px;
        margin: 0px 0 0 5px;
        opacity: 0.4;
        display: inline-block;
        position: absolute;
        top: 3px;
        right: 4px;
      }
    }
  }
}

.settling {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.lptrade {
  cursor: pointer;
  background: #d4b2c3;
  color: white;
  &.active {
    background: #e57067;
  }
}

.wrapeth {
  background: #c0cbf6;
}
.buyusdc {
  background: #65a4e8;
}

// update
.row {
  display: flex;
  width: 100%;

  @media (max-width: 540px) {
    &.row-item-col {
      flex-direction: column;
      div.item,
      .flexitem {
        width: 100%;
      }
    }
    flex-flow: row nowrap;
    align-items: center;
  }
  div.item,
  .flexitem {
    flex: 1 1 0%;
  }
}

.unitext {
  text-shadow: 0px 1px 1px #de1d73;
}
.unitemp {
  color: #e07593;
  font-size: 52px;
  @media (max-width: 540px) {
    margin-bottom: 16px;
  }
}
.unicorn {
  transform: rotate(0deg);
  display: inline-block;
  font-size: 24px;
  line-height: 24px;
  animation: unimate 10s linear infinite;
}
.clicklptrade {
  background: #f7f3f3;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  height: 76px;
  line-height: 76px;
  display: block;
  border-radius: 8px;
  color: #ca6159;
  transition: background 0.1s ease-in-out;
  &:active {
    background: #f2edef;
  }
}
.asset-info {
  margin: 0px 20px 0px 20px;
  display: flex;
  justify-content: space-between;
}
.apr-info {
  font-size: 36px;
  text-align: center;
}

.apr-block {
  display: block;
  text-align: center;
  width: 100%;
}

.warning {
  font-size: 13px;
  padding: 0px 10px;
  color: #0000005e;
  a {
    color: var(--primary);
  }
}
.mobile-median-chart {
  @media (max-width: 540px) {
    left: -60px;
  }
}
.withdrawLabel {
  padding-left: 20px;
}
</style>
