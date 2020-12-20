import Vue from "vue";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import Vuex, { Commit, Dispatch } from "vuex";
import { getInstance } from "@snapshot-labs/lock/plugins/vue";
import { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import { stateSave, stateLoad, stateDestroy, getERC20Contract, getBalance, waitTransaction, approve, getTWAP, getAllowance } from "@/utils";
import { sleep, checkConnection } from "./../utils/index";
import { AbiItem } from "web3-utils";
import { provider } from "web3-core";
import config from "@/config";
import store from "@/store";
import YAMContract from "@/utils/abi/yam.json";
import EMPContract from "@/utils/abi/emp.json";
import { WETH, EMP } from "@/utils/addresses";

Vue.use(Vuex);

let auth;

const defaultState = () => {
  return {
    version: "A-0.1", // make dynamic
    theme: stateLoad("theme") || "light",
    account: stateLoad("account") || "0x0",
    currentEMP: "",
    approvals: {
      tokenEMP: null,
    },
    canWithdraw: false,

    theNewKey: null,
    approved: {
      contractA: false,
      contractB: false,
    },
    web3: {
      core: null,
      isInjected: false,
      web3Instance: null,
      network: config.networks["1"],
    },
    empState: {
      expirationTimestamp: new BigNumber(0),
      collateralCurrency: "",
      priceIdentifier: "",
      tokenCurrency: "",
      collateralRequirement: new BigNumber(0),
      disputeBondPct: new BigNumber(0),
      disputerDisputeRewardPct: new BigNumber(0),
      sponsorDisputeRewardPct: new BigNumber(0),
      minSponsorTokens: new BigNumber(0),
      timerAddress: "",
      cumulativeFeeMultiplier: new BigNumber(0),
      rawTotalPositionCollateral: new BigNumber(0),
      totalTokensOutstanding: new BigNumber(0),
      liquidationLiveness: new BigNumber(0),
      withdrawalLiveness: new BigNumber(0),
      currentTime: new BigNumber(0),
      isExpired: false,
      contractState: 0,
      finderAddress: "",
      expiryPrice: new BigNumber(0),
    },
    currPos: {},
    provider: {},
    connector: {},
  };
};

export default new Vuex.Store({
  state: defaultState(),
  mutations: {
    UPDATE(state, data) {
      Object.keys(data).forEach(key => {
        Vue.set(state, key, data[key]);
      });
      console.debug("UPDATE", state, data);
    },
    THEME(state, data) {
      state.theme = data.theme;
      console.debug("THEME", data.theme);
    },
    CONNECT() {
      console.debug("CONNECT");
    },
    RECONNECT(state, data) {
      state.account = data.account;
      console.debug("RECONNECT", data.account);
    },
    DISCONNECT(state, data) {
      Vue.prototype.$auth.logout();
      state.account = null;
      window.localStorage.removeItem("account");
      console.debug("DISCONNECT");
    },
    RESET(state, data) {
      stateDestroy();
      Object.assign(state, defaultState());
      console.debug("RESET", state);
    },
    ON_PROVIDER_LOAD(state, data) {
      console.debug("ON_PROVIDER_LOAD");
    },
    ON_PROVIDER_SUCCESS(state, data) {
      state.account = data.account;
      console.debug("ON_PROVIDER_SUCCESS", data);
    },
    ON_PROVIDER_FAILURE(state, data) {
      state.account = null;
      console.debug("ON_PROVIDER_FAILURE", data);
    },
    ON_CHAIN_CHANGED(state, data) {
      if (!config.networks[data.chainId]) {
        config.networks[data.chainId] = {
          ...config.networks["1"],
          chainId: data.chainId,
          name: "Unknown",
          network: "unknown",
        };
      }
      state.web3.network = config.networks[data.chainId];
      console.debug("ON_CHAIN_CHANGED", data);
    },
    ON_ACCOUNT_CHANGED(state, data) {
      state.account = data.account;
      console.debug("ON_ACCOUNT_CHANGED", data);
    },
    EMP_STATE(state, data) {
      state.empState = data;
      console.debug("EMP_STATE", data);
    },
    CURR_POS(state, data) {
      state.currPos = data;
      console.debug("CURR_POS", data);
    },
    GET_EMP(state, data) {
      state.currentEMP = data.currentEMP;
      console.debug("GET_EMP", data);
    },

    // to sort all once finished (-camelcase reminder)
    SOMETHING_NEW_TO_STORE(state, data) {
      state.theNewKey = data.theNewValue;
      console.debug("SOMETHING_NEW_TO_STORE", data);
    },
  },
  actions: {
    init: async ({ commit, dispatch }) => {
      console.debug("init");
      if (store.state.theme) {
        document.documentElement.setAttribute("data-theme", store.state.theme);
        setTimeout(() => {
          if (store.state.theme === "dark") {
            const switcher = document.querySelector("#switch") as HTMLInputElement;
            if (switcher) switcher.checked = true;
          }
        }, 500);
      }

      // setTimeout(async () => {
      //   const connector = await Vue.prototype.$auth.getConnector();
      //   if (connector) {
      //     await dispatch("connect", connector);
      //   }
      // }, 100);

      // check approved on init or check it on page related
      // store.state.approvedContract = true;

      // await dispatch('getMetapools');
      commit("UPDATE", { init: true });
    },
    updateTheme({ commit, dispatch }, payload) {
      const value = payload.theme;
      document.documentElement.setAttribute("data-theme", value);
      stateSave("theme", value);
      commit("THEME", { theme: value });
    },

    // wallet
    connect: async ({ commit, dispatch }, connector = "injected") => {
      auth = getInstance();
      await auth.login(connector);
      if (auth.provider) {
        stateSave("provider", connector);
        auth.web3 = new Web3Provider(auth.provider);
        Vue.prototype.$web3 = auth.web3;
        Vue.prototype.$provider = auth.web3.provider;
        await dispatch("loadProvider");
        // console.log("Vue.prototype.$web3", Vue.prototype.$web3);
      }
    },
    disconnect: async ({ commit }) => {
      commit("DISCONNECT");
    },
    reset: async ({ commit }) => {
      commit("RESET");
    },
    loadProvider: async ({ commit, dispatch }) => {
      commit("ON_PROVIDER_LOAD");
      try {
        if (auth.provider.removeAllListeners) auth.provider.removeAllListeners();
        if (auth.provider.on) {
          auth.provider.on("chainChanged", async chainId => {
            commit("ON_CHAIN_CHANGED", { chainId: parseInt(formatUnits(chainId, 0)) });
            // await dispatch('getYamBalance');
          });
          auth.provider.on("accountsChanged", async accounts => {
            if (accounts.length !== 0) {
              const account = accounts.length > 0 ? accounts[0] : null;
              commit("ON_ACCOUNT_CHANGED", { account });
              stateSave("account", account);
              await dispatch("loadProvider");
            }
          });
          // auth.provider.on('disconnect', async () => {
          //   commit('CLOSE_MODAL');
          // });
        }
        const [network, accounts] = await Promise.all([auth.web3.getNetwork(), auth.web3.listAccounts()]);
        commit("ON_CHAIN_CHANGED", { chainId: network.chainId });
        const account = accounts.length > 0 ? accounts[0] : null;
        commit("ON_PROVIDER_SUCCESS", { account });

        await dispatch("fetchAllowanceEMP");
        stateSave("account", account);
      } catch (e) {
        commit("ON_PROVIDER_FAILURE", { e });
        return Promise.reject();
      }
    },

    // contracts
    getYamBalance: async ({ commit, dispatch }) => {
      // checkConnection({ commit, dispatch });
      await sleep(500);
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      // console.log("Vue.prototype.$web3", Vue.prototype.$web3);
      const yamv3 = "0x0AaCfbeC6a24756c20D41914F2caba817C0d8521";
      const balance = await getBalance(Vue.prototype.$provider, yamv3, store.state.account);
      return balance;
    },

    getEMP: ({ commit, dispatch }, payload: { address: string }) => {
      const web3 = new Web3(Vue.prototype.$provider);
      const empContract = new web3.eth.Contract((EMPContract.abi as unknown) as AbiItem, payload.address);
      commit("GET_EMP", { currentEMP: empContract });
      return empContract;
    },

    getPositionData: async ({ commit, dispatch }, contract: string) => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const emp = await dispatch("getEMP", { address: contract });
      try {
        const pos = await emp.methods.positions(store.state.account).call();
        commit("CURR_POS", pos);
        return pos;
      } catch (e) {
        console.log("couldnt get position for: ", contract, " for user: ", store.state.account);
      }
    },

    setEMPState: async ({ commit, dispatch }, contract: string) => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const emp = await dispatch("getEMP", { address: contract });
      try {
        const res = await Promise.all([
          emp.methods.expirationTimestamp().call(),
          emp.methods.collateralCurrency().call(),
          emp.methods.priceIdentifier().call(),
          emp.methods.tokenCurrency().call(),
          emp.methods.collateralRequirement().call(),
          emp.methods.disputeBondPct().call(),
          emp.methods.disputerDisputeRewardPct().call(),
          emp.methods.sponsorDisputeRewardPct().call(),
          emp.methods.minSponsorTokens().call(),
          emp.methods.timerAddress().call(),
          emp.methods.cumulativeFeeMultiplier().call(),
          emp.methods.rawTotalPositionCollateral().call(),
          emp.methods.totalTokensOutstanding().call(),
          emp.methods.liquidationLiveness().call(),
          emp.methods.withdrawalLiveness().call(),
          emp.methods.getCurrentTime().call(),
          emp.methods.contractState().call(),
          emp.methods.finder().call(),
          emp.methods.expiryPrice().call(),
        ]);
        const dat = {
          expirationTimestamp: new BigNumber(res[0]),
          collateralCurrency: res[1], // address
          priceIdentifier: res[2],
          tokenCurrency: res[3], // address
          collateralRequirement: new BigNumber(res[4]),
          disputeBondPct: new BigNumber(res[5]),
          disputerDisputeRewardPct: new BigNumber(res[6]),
          sponsorDisputeRewardPct: new BigNumber(res[7]),
          minSponsorTokens: new BigNumber(res[8]),
          timerAddress: res[9], // address
          cumulativeFeeMultiplier: new BigNumber(res[10]),
          rawTotalPositionCollateral: new BigNumber(res[11]),
          totalTokensOutstanding: new BigNumber(res[12]),
          liquidationLiveness: new BigNumber(res[13]),
          withdrawalLiveness: new BigNumber(res[14]),
          currentTime: new BigNumber(res[15]),
          isExpired: Number(res[15]) >= Number(res[0]),
          contractState: Number(res[16]),
          finderAddress: res[17], // address
          expiryPrice: new BigNumber(res[18]),
        };
        commit("EMP_STATE", dat);
        return dat;
      } catch (e) {
        console.log("error getting emp state", e);
        return "bad";
      }
    },

    mint: async (
      { commit, dispatch },
      payload: { contract: string; collat: string; tokens: string; onTxHash?: (txHash: string) => void }
    ): Promise<boolean> => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const emp = await dispatch("getEMP", { address: payload.contract });
      try {
        const web3Provider = Vue.prototype.$provider;
        const ge = await emp.methods.create([payload.collat], [payload.tokens]).estimateGas(
          {
            from: store.state.account,
            gas: 50000000,
          },
          async (error: any) => {
            console.log("SimTx Failed, ", error);
            return false;
          }
        );
        return emp.methods.create([payload.collat], [payload.tokens]).send(
          {
            from: store.state.account,
            gas: ge,
          },
          async (error: any, txHash: string) => {
            if (error) {
              console.error("EMP could not mint tokens", error);
              payload.onTxHash && payload.onTxHash("");
              return false;
            }
            if (payload.onTxHash) {
              payload.onTxHash(txHash);
            }
            const status = await waitTransaction(web3Provider, txHash);
            if (!status) {
              console.log("Mint transaction failed.");
              return false;
            }
            return true;
          }
        );
      } catch (e) {
        console.error("error", e);
        return false;
      }
    },

    deposit: async ({ commit, dispatch }, payload: { contract: string; collat: string; onTxHash?: (txHash: string) => void }): Promise<boolean> => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const emp = await dispatch("getEMP", { address: payload.contract });
      try {
        const web3Provider = Vue.prototype.$provider;
        const ge = await emp.methods.deposit([payload.collat]).estimateGas(
          {
            from: store.state.account,
            gas: 50000000,
          },
          async (error: any) => {
            console.log("SimTx Failed, ", error);
            return false;
          }
        );
        return emp.methods.deposit([payload.collat]).send(
          {
            from: store.state.account,
            gas: ge,
          },
          async (error: any, txHash: string) => {
            if (error) {
              console.error("EMP could not deposit collateral", error);
              payload.onTxHash && payload.onTxHash("");
              return false;
            }
            if (payload.onTxHash) {
              payload.onTxHash(txHash);
            }
            const status = await waitTransaction(web3Provider, txHash);
            if (!status) {
              console.log("Deposit transaction failed.");
              return false;
            }
            return true;
          }
        );
      } catch (e) {
        console.error("error", e);
        return false;
      }
    },

    requestWithdrawal: async ({ commit, dispatch }, payload: { contract: string; collat: string; onTxHash?: (txHash: string) => void }): Promise<boolean> => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const emp = await dispatch("getEMP", { address: payload.contract });
      try {
        const web3Provider = Vue.prototype.$provider;
        const ge = await emp.methods.requestWithdrawal([payload.collat]).estimateGas(
          {
            from: store.state.account,
            gas: 50000000,
          },
          async (error: any) => {
            console.log("SimTx Failed, ", error);
            return false;
          }
        );
        return emp.methods.requestWithdrawal([payload.collat]).send(
          {
            from: store.state.account,
            gas: ge,
          },
          async (error: any, txHash: string) => {
            if (error) {
              console.error("EMP could not request withdraw", error);
              payload.onTxHash && payload.onTxHash("");
              return false;
            }
            if (payload.onTxHash) {
              payload.onTxHash(txHash);
            }
            const status = await waitTransaction(web3Provider, txHash);
            if (!status) {
              console.log("Withdrawal request transaction failed.");
              return false;
            }
            return true;
          }
        );
      } catch (e) {
        console.error("error", e);
        return false;
      }
    },

    withdrawRequestFinalize: async ({ commit, dispatch }, payload: { contract: string; onTxHash?: (txHash: string) => void }): Promise<boolean> => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const emp = await dispatch("getEMP", { address: payload.contract });
      try {
        const web3Provider = Vue.prototype.$provider;
        const ge = await emp.methods.withdrawPassedRequest().estimateGas(
          {
            from: store.state.account,
            gas: 50000000,
          },
          async (error: any) => {
            console.log("SimTx Failed, ", error);
            return false;
          }
        );
        return emp.methods.withdrawPassedRequest().send(
          {
            from: store.state.account,
            gas: ge,
          },
          async (error: any, txHash: string) => {
            if (error) {
              console.error("EMP could not withdraw", error);
              payload.onTxHash && payload.onTxHash("");
              return false;
            }
            if (payload.onTxHash) {
              payload.onTxHash(txHash);
            }
            const status = await waitTransaction(web3Provider, txHash);
            if (!status) {
              console.log("Withdrawal transaction failed.");
              return false;
            }
            return true;
          }
        );
      } catch (e) {
        console.error("error", e);
        return false;
      }
    },

    withdraw: async ({ commit, dispatch }, payload: { contract: string; collat: string; onTxHash?: (txHash: string) => void }): Promise<boolean> => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const emp = await dispatch("getEMP", { address: payload.contract });
      try {
        const web3Provider = Vue.prototype.$provider;
        const ge = await emp.methods.withdraw([payload.collat]).estimateGas(
          {
            from: store.state.account,
            gas: 50000000,
          },
          async (error: any) => {
            console.log("SimTx Failed, ", error);
            return false;
          }
        );
        return emp.methods.withdraw([payload.collat]).send(
          {
            from: store.state.account,
            gas: ge,
          },
          async (error: any, txHash: string) => {
            if (error) {
              console.error("EMP could not instant withdraw", error);
              payload.onTxHash && payload.onTxHash("");
              return false;
            }
            if (payload.onTxHash) {
              payload.onTxHash(txHash);
            }
            const status = await waitTransaction(web3Provider, txHash);
            if (!status) {
              console.log("Instant withdrawal transaction failed.");
              return false;
            }
            return true;
          }
        );
      } catch (e) {
        console.error("error", e);
        return false;
      }
    },

    redeem: async ({ commit, dispatch }, payload: { contract: string; tokens: string; onTxHash?: (txHash: string) => void }): Promise<boolean> => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const emp = await dispatch("getEMP", { address: payload.contract });
      try {
        const web3Provider = Vue.prototype.$provider;
        const ge = await emp.methods.redeem([payload.tokens]).estimateGas(
          {
            from: store.state.account,
            gas: 50000000,
          },
          async (error: any) => {
            console.log("SimTx Failed, ", error);
            return false;
          }
        );
        return emp.methods.redeem([payload.tokens]).send(
          {
            from: store.state.account,
            gas: ge,
          },
          async (error: any, txHash: string) => {
            if (error) {
              console.error("EMP could not redeem", error);
              payload.onTxHash && payload.onTxHash("");
              return false;
            }
            if (payload.onTxHash) {
              payload.onTxHash(txHash);
            }
            const status = await waitTransaction(web3Provider, txHash);
            if (!status) {
              console.log("Redeem transaction failed.");
              return false;
            }
            return true;
          }
        );
      } catch (e) {
        console.error("error", e);
        return false;
      }
    },

    getUserWETHBalance: async ({ commit, dispatch }) => {
      await sleep(500);
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const balance = await getBalance(Vue.prototype.$provider, WETH, store.state.account);
      return balance;
    },

    getApprovalEMP: async ({ commit, dispatch }) => {
      await sleep(500);
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      if (!store.state.approvals.tokenEMP) {
        await approve(store.state.account, EMP, WETH, Vue.prototype.$provider);
        return -1;
      } else {
        commit("UPDATE", { approvals: { tokenEMP: true } });
        return 1;
      }
    },

    fetchAllowanceEMP: async ({ commit, dispatch }) => {
      await sleep(500);
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const result = await getAllowance(store.state.account, EMP, WETH, Vue.prototype.$provider);
      console.log("result", result);
      if (Number(result) > 0) {
        commit("UPDATE", { approvals: { tokenEMP: true } });
      } else {
        commit("UPDATE", { approvals: { tokenEMP: false } });
      }
      return result;
    },
  },
  getters: {
    theme(state) {
      return state.theme;
    },
    account(state) {
      return state.account;
    },
    async connected(state) {
      const isAuthenticated = await Vue.prototype.$auth.isAuthenticated;
      return state.account && state.account !== null && isAuthenticated;
    },
    async connector() {
      const auth = await Vue.prototype.$auth;
      const connector = await auth.getConnector();
      return connector; // move to state
    },
    empState(state) {
      return state.empState;
    },
  },
});

store.dispatch("init");
