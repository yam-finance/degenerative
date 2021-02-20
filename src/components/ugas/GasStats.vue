<template>
  <div class="flex-container">
    <Card>
      <div class="flex" style="align-items:center;">
        <div style="width:0px; flex:1 1 0%;">
          <div class="flex" style="align-items:baseline;">
            <div class="card-title">
              {{ averageTxPrice ? averageTxPrice : "..." }}
            </div>
            <div class="flex card-unit grey">
              GWEI
            </div>
          </div>
          <dt class="card-description">
            Your avg. gas price
          </dt>
        </div>
      </div>
    </Card>

    <Space size="20" style="flex:none;" />

    <Card>
      <div class="flex" style="align-items:center;">
        <div style="width:0px; flex:1 1 0%;">
          <div class="flex" style="align-items:baseline;">
            <div class="card-title">
              {{ currency ? (txGasCostETH ? txGasCostETH : "...") : txGasCostUSD ? txGasCostUSD : "..." }}
            </div>
            <div class="flex card-unit green">
              {{ currency ? "ΞTH" : "USD" }}
            </div>
          </div>
          <dt class="card-description">
            {{ txCount ? txCount + " Successful txs." : "0 Successful txs." }}
          </dt>
        </div>
      </div>
    </Card>

    <Space size="20" style="flex:none;" />

    <Card>
      <div class="flex" style="align-items:center;">
        <div style="width:0px; flex:1 1 0%;">
          <div class="flex" style="align-items:baseline;">
            <div class="card-title">
              {{ currency ? (failedTxGasCostETH ? failedTxGasCostETH : "...") : failedTxGasCostUSD ? failedTxGasCostUSD : "..." }}
            </div>
            <div class="flex card-unit primary">
              {{ currency ? "ΞTH" : "USD" }}
            </div>
          </div>
          <dt class="card-description">
            {{ failedTxCount ? failedTxCount + " Failed txs." : "0 Failed txs." }}
          </dt>
        </div>
      </div>
    </Card>

    <div style="position:relative">
      <div class="stats-dropdown" ref="stats-dropdown">
        <button class="dropdown-button" @click="showPopup = !showPopup">
          <svg style="height:1.25rem; width:1.25rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
        <div v-show="showPopup" v-outside-click="{ exclude: ['stats-dropdown'], handler: 'onClose' }" class="dropdown-content">
          <div style="display:flex; flex-direction:row;">
            <div style="padding-left:1rem; padding-right:1rem; padding-top:1rem; padding-bottom:1rem;">
              <p class="dropdown-titel">
                Stats Settings
              </p>
            </div>
            <div style="padding-left:3rem; padding-right:1rem; padding-top:0.75rem; padding-bottom:0.75rem;">
              <button type="button" class="toggle-button" :class="currency ? 'toggle-blue' : 'toggle-grey'" @click="currency = !currency" aria-pressed="false">
                <span class="toggle-icon" :class="currency ? 'translate-x-5' : 'translate-x-0'">
                  <span class="toggle-transition flex" :class="currency ? 'ease-out' : 'ease-in'" aria-hidden="true">
                    $
                  </span>
                  <span class="toggle-transition flex" :class="currency ? 'ease-in' : 'ease-out'" aria-hidden="true">
                    Ξ
                  </span>
                </span>
              </button>
            </div>
          </div>

          <ul tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3" class="dropdown-list">
            <li id="listbox-item-0" role="option" class="dropdown-item">
              <span class="item-title" :style="badgeState == 'All Time' ? 'font-weight: 600;' : 'font-weight: 400;'" @click="updateInterval('All Time')">
                All Time
              </span>
              <span id="dropdown-icon" class="item-icon flex" :class="badgeState == 'All Time' ? '' : 'hidden'">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </li>

            <li id="listbox-item-0" role="option" class="dropdown-item">
              <span class="item-title" :style="badgeState == 'Year' ? 'font-weight: 600;' : 'font-weight: 400;'" @click="updateInterval('Year')">
                Year
              </span>
              <span id="dropdown-icon" class="item-icon flex" :class="badgeState == 'Year' ? '' : 'hidden'">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </li>

            <li id="listbox-item-0" role="option" class="dropdown-item">
              <span class="item-title" :style="badgeState == 'Month' ? 'font-weight: 600;' : 'font-weight: 400;'" @click="updateInterval('Month')">
                Month
              </span>
              <span id="dropdown-icon" class="item-icon flex" :class="badgeState == 'Month' ? '' : 'hidden'">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </li>

            <li id="listbox-item-0" role="option" class="dropdown-item">
              <span class="item-title" :style="badgeState == 'Week' ? 'font-weight: 600;' : 'font-weight: 400;'" @click="updateInterval('Week')">
                Week
              </span>
              <span id="dropdown-icon" class="item-icon flex" :class="badgeState == 'Week' ? '' : 'hidden'">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </li>

            <li id="listbox-item-0" role="option" class="dropdown-item">
              <span class="item-title" :style="badgeState == 'Day' ? 'font-weight: 600;' : 'font-weight: 400;'" @click="updateInterval('Day')">
                Day
              </span>
              <span id="dropdown-icon" class="item-icon flex" :class="badgeState == 'Day' ? '' : 'hidden'">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </li>

            <li id="listbox-item-0" role="option" class="dropdown-item">
              <span class="item-title" :style="badgeState == 'Custom' ? 'font-weight: 600;' : 'font-weight: 400;'" @click="showDateInput = !showDateInput">
                Custom
              </span>
              <span id="dropdown-icon" class="item-icon flex" :class="badgeState == 'Custom' ? '' : 'hidden'">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </li>

            <li id="listbox-item-0" role="option" class="dropdown-item" :class="showDateInput ? '' : 'hidden'">
              <span class="item-title" style="font-weight: 600;">
                <input type="date" @input="updateCustomDate('Custom')" v-model="inputStartDate" />
              </span>
              <span id="dropdown-icon" class="item-icon flex">
                🏃‍♂️
              </span>
            </li>

            <li id="listbox-item-0" role="option" class="dropdown-item" :class="showDateInput ? '' : 'hidden'">
              <span class="item-title" style="font-weight: 600;">
                <input type="date" @input="updateCustomDate('Custom')" v-model="inputEndDate" />
              </span>
              <span id="dropdown-icon" class="item-icon flex">
                🏁
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from "bignumber.js";
import { mapActions } from "vuex";
import { getOffchainPriceFromTokenSymbol } from "../../utils/getOffchainPrice";
import { OutsideClick } from "../../utils/directives/outside-click";

export default {
  directives: {
    OutsideClick,
  },
  data() {
    return {
      showDateInput: false,
      showPopup: false,
      currency: true,
      interval: "",
      badgeState: "All Time",
      txGasCostETH: "",
      txGasCostUSD: "",
      averageTxPrice: "",
      txCount: "",
      failedTxCount: "",
      failedTxGasCostETH: "",
      failedTxGasCostUSD: "",
      inputStartDate: "",
      inputEndDate: "",
    };
  },
  props: {
    size: Number,
  },
  computed: {
    style() {
      return null;
    },
  },
  methods: {
    ...mapActions(["getUserTxStats"]),
    async onClose() {
      this.showPopup = false;
    },
    async updateBadge(value) {
      this.badgeState = value;
    },
    async setLoadingState() {
      this.txGasCostETH = "...";
      this.txGasCostUSD = "...";
      this.averageTxPrice = "...";
      this.txCount = "...";
      this.failedTxCount = "...";
      this.failedTxGasCostETH = "...";
      this.failedTxGasCostUSD = "...";
    },
    async updateInterval(value) {
      this.badgeState = value;
      this.interval = value;
      this.inputStartDate = null;
      this.inputEndDate = null;
      this.showDateInput = false;
      await this.getAccountStats();
    },
    async updateCustomDate(value) {
      this.badgeState = value;
      this.interval = "";
      await this.getAccountStats();
    },
    async getAccountStats() {
      await this.setLoadingState();
      const price = await getOffchainPriceFromTokenSymbol("uUSDrETH");
      const [txGasCostETH, averageTxPrice, txCount, failedTxCount, failedTxGasCostETH] = await this.getUserTxStats({
        interval: this.interval,
        startDate: this.inputStartDate,
        endDate: this.inputEndDate,
      });

      this.txGasCostETH = txGasCostETH;
      this.txGasCostUSD = new BigNumber(txGasCostETH / price).decimalPlaces(0);
      this.averageTxPrice = averageTxPrice;
      this.txCount = txCount;
      this.failedTxCount = failedTxCount;
      this.failedTxGasCostETH = failedTxGasCostETH;
      this.failedTxGasCostUSD = new BigNumber(failedTxGasCostETH / price).decimalPlaces(0);
    },
  },
};
</script>

<style lang="scss" scoped>
.hidden {
  display: none;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.toggle-grey {
  background-color: rgba(229, 231, 235, 1);
}
.toggle-blue {
  background: rgba(199, 167, 249, 1);
}
.grey {
  color: rgba(75, 85, 99, 1);
}
.green {
  color: rgba(52, 211, 153, 1);
}
.primary {
  color: var(--primary);
}
.dropdown-list {
  max-height: 25rem;
  border-radius: 0.375rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 1rem;
  line-height: 1.5rem;
  overflow: auto;
}
.dropdown-list li:hover {
  background-color: rgba(229, 231, 235, 1);
}
.dropdown-list:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
#dropdown-icon:hover {
  color: rgba(255, 255, 255, 1);
}
.dropdown-item {
  cursor: pointer;
  user-select: none;
  position: relative;
}
.item-title {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 2rem;
  padding-right: 1rem;
}
.item-icon {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  align-items: center;
  padding-left: 0.375rem;
}
.translate-x-5 {
  transform: translateX(1.25rem) translateY(0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);
}
.translate-x-0 {
  transform: translateX(0px) translateY(0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);
}
.ease-in {
  opacity: 1;
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}
.ease-out {
  opacity: 0;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 100ms;
}
.toggle-transition {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  transition-property: opacity;
  transition-duration: 150ms;
}
.toggle-icon {
  pointer-events: none;
  position: relative;
  display: inline-block;
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 1);
  --toggle-icon-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  box-shadow: 0, 0, var(--toggle-icon-shadow);
  box-shadow: 0 0;
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-duration: 150ms;
}
.toggle-button {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  height: 1.5rem;
  width: 2.75rem;
  border-width: 2px;
  border-color: transparent;
  border-radius: 9999px;
  cursor: pointer;
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: 150ms;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  text-transform: none;
  padding: 0;
  line-height: inherit;
  color: inherit;
}
.toggle-button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --toggle-button-ring-color: rgba(59, 130, 246, 0);
  box-shadow: 0 0 0 0 4px var(--toggle-button-ring-color);
  box-shadow: 0 0 0 2px 0, 0;
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color;
}
.card-description {
  font-size: 15px;
  line-height: 1.25rem;
  font-weight: 500;
  color: rgba(107, 114, 128, 1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-unit {
  margin-left: 0.5rem;
  align-items: baseline;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
}
.card-title {
  font-size: 1.5rem;
  line-height: 1rem;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
}
.flex-container {
  display: flex;
  flex-direction: row;

  @media (max-width: 800px) {
    flex-direction: column;
  }
}
.dropdown-button {
  border: none;
  cursor: pointer;
  background-color: transparent;
  background-image: none;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  text-transform: none;
  padding-left: 20px;
  padding-top: 10px;
  line-height: inherit;
  color: inherit;

  @media (max-width: 800px) {
    padding-left: 0px;
  }
}
.stats-dropdown {
  position: absolute;
  display: block;
}
.stats-dropdown:hover .dropdown-button {
  color: #4b5563;
}
.dropdown-content {
  position: absolute;
  background-color: #f9f9f9;
  width: 225px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  background: var(--back-act);
  z-index: 2;
  border-radius: 2px;
  border: none;
  right: 0;

  @media (max-width: 800px) {
    left: 0;
  }
}
.dropdown-titel {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.icon {
  height: 1.25rem;
  width: 1.25rem;
}
</style>
