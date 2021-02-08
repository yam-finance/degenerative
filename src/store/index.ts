import Vue from "vue";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import Vuex, { Commit, Dispatch } from "vuex";
import { getInstance } from "@snapshot-labs/lock/plugins/vue";
import { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import {
  stateSave,
  stateLoad,
  stateDestroy,
  getERC20Contract,
  getTxStats,
  getBalance,
  waitTransaction,
  approve,
  getTWAP,
  getAllowance,
  DevMiningCalculator,
  getPriceByContract,
  getDevMiningEmps,
} from "@/utils";
import { sleep, checkConnection } from "./../utils/index";
import { AbiItem, toHex } from "web3-utils";
import { provider } from "web3-core";
import config from "@/config";
import store from "@/store";
import YAMContract from "@/utils/abi/yam.json";
import EMPContract from "@/utils/abi/emp.json";
import UNIContract from "@/utils/abi/uni.json";
import UNIFactContract from "@/utils/abi/uniFactory.json";
import WETHContract from "@/utils/abi/weth.json";
import UGASJAN21LPContract from "@/utils/abi/assets/ugas_lp_jan.json";
import { UMA, WETH } from "@/utils/addresses";
import mixin from "./../mixins";

Vue.use(Vuex);

let auth;

const defaultState = () => {
  return {
    version: "A-0.1", // make dynamic
    theme: stateLoad("theme") || "light",
    account: stateLoad("account") || "0x0",
    hasConnectedBefore: false,
    currentEMP: "",
    contractWETH: "",
    canWithdraw: false,
    theNewKey: null,
    contracts: {},
    approvals: {
      UGASJAN21_WETH: false,
      UGASFEB21_WETH: false,
      UGASMAR21_WETH: false,
      EMPJAN_UGASJAN21: false,
      EMPFEB_UGASFEB21: false,
      EMPMAR_UGASMAR21: false,
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
      // state.account = null;
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
    GET_WETH(state, data) {
      state.contractWETH = data.contractWETH;
      console.debug("GET_WETH", data);
    },
    UPDATE_APPROVAL(state, data) {
      // state.contracts[data.address].approved = data.value;
      // Vue.set(state, 'approvals.' + data.identifier, data.value);
      state.approvals[data.identifier] = data.value;
      console.debug("UPDATE_APPROVAL", data);
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
    connect: async ({ commit, dispatch }, payload = { connector: "injected", organic: false }) => {
      let hasConnected = localStorage.getItem("connected");
      hasConnected = hasConnected ? eval(hasConnected) : false;
      store.state.hasConnectedBefore = hasConnected;
      console.log(store.state.hasConnectedBefore);
      if (store.state.hasConnectedBefore || payload.organic) {
        localStorage.setItem("connected", "true");
        auth = getInstance();
        await auth.login(payload.connector);
        if (auth.provider) {
          stateSave("provider", payload.connector);
          auth.web3 = new Web3Provider(auth.provider);
          Vue.prototype.$web3 = auth.web3;
          Vue.prototype.$provider = auth.web3.provider;
          await dispatch("loadProvider");
        }
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
        // await dispatch("fetchAllowanceEMP", { spenderAddress: store.state.approvals.tokenEMP, tokenAddress: WETH });
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

    getUNI: ({ commit, dispatch }, payload: { address: string }) => {
      const web3 = new Web3(Vue.prototype.$provider);
      const uniContract = new web3.eth.Contract((UNIContract.abi as unknown) as AbiItem, payload.address);
      return uniContract;
    },

    getUNIFact: ({ commit, dispatch }) => {
      const web3 = new Web3(Vue.prototype.$provider);
      const uniFactContract = new web3.eth.Contract((UNIFactContract.abi as unknown) as AbiItem, "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");
      return uniFactContract;
    },

    getUniPrice: async ({ commit, dispatch }, payload: { tokenA: string; tokenB: string }) => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      console.debug("getting uni price");
      const uniFact = await dispatch("getUNIFact");
      try {
        const pair = await uniFact.methods.getPair(payload.tokenA, payload.tokenB).call();
        const uniPair = await dispatch("getUNI", { address: pair });
        const token0 = await uniPair.methods.token0().call();
        let reserves0: any = 0;
        let reserves1: any = 0;
        const res = await uniPair.methods.getReserves().call();
        reserves0 = new BigNumber(res._reserve0);
        reserves1 = new BigNumber(res._reserve1);
        if (token0 == payload.tokenA) {
          return reserves0.dividedBy(reserves1);
        } else {
          return reserves1.dividedBy(reserves0);
        }
      } catch (e) {
        console.error("couldnt get uni price for:", payload.tokenA, payload.tokenB);
        // console.log("user:", store.state.account, e);
      }
    },

    getWETH: ({ commit, dispatch }, payload: { address: string }) => {
      const web3 = new Web3(Vue.prototype.$provider);
      const contractWETH = new web3.eth.Contract((WETHContract.abi as unknown) as AbiItem, payload.address);
      commit("GET_WETH", { contractWETH: contractWETH });
      return contractWETH;
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
        console.debug("couldnt get position for: ", contract, " for user: ", store.state.account);
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
        console.error("error getting emp state", e);
        return "bad";
      }
    },

    mint: async ({ commit, dispatch }, payload: { contract: string; collat: string; tokens: string; onTxHash?: (txHash: string) => void }): Promise<any> => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const emp = await dispatch("getEMP", { address: payload.contract });
      try {
        const web3Provider = Vue.prototype.$provider;
        const web3 = new Web3(web3Provider);
        let data = emp.methods.create([payload.collat], [payload.tokens]).encodeABI();
        data = data.concat(web3.utils.toHex("0x97990b693835da58a281636296d2bf02787dea17").slice(2));
        const ge = await web3.eth.estimateGas(
          {
            from: store.state.account,
            to: emp.options.address,
            data: data,
            gas: 50000000,
          },
          async (error: any) => {
            console.log("SimTx Failed, ", error);
            return [false, error];
          }
        );
        return web3.eth.sendTransaction(
          {
            from: store.state.account,
            to: emp.options.address,
            data: data,
            gas: ge,
          },
          async (error: any, txHash: string) => {
            if (error) {
              console.error("EMP could not mint tokens", error);
              payload.onTxHash && payload.onTxHash("");
              return [false, error];
            }
            if (payload.onTxHash) {
              payload.onTxHash(txHash);
            }
            const status = await waitTransaction(web3Provider, txHash);
            if (!status) {
              console.log("Mint transaction failed.");
              return [false, "Mint transaction failed."];
            }
            return [true, ""];
          }
        );
      } catch (e) {
        console.error("error", e);
        return [false, e];
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

    // settle prep
    settle: async ({ commit, dispatch }, payload: { contract: string; onTxHash?: (txHash: string) => void }): Promise<any> => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const emp = await dispatch("getEMP", { address: payload.contract });
      try {
        const web3Provider = Vue.prototype.$provider;
        // const ge = await emp.methods.settleExpired().estimateGas(
        //   {
        //     from: store.state.account,
        //     gas: 50000000,
        //   },
        //   async (error: any) => {
        //     console.log("SimTx Failed, ", error);
        //     return false;
        //   }
        // );
        return emp.methods.settleExpired().send(
          {
            from: store.state.account,
            gas: 200000,
          },
          async (error: any, txHash: string) => {
            if (error) {
              console.error("EMP could not Settle", error);
              payload.onTxHash && payload.onTxHash("");
              return false;
            }
            if (payload.onTxHash) {
              payload.onTxHash(txHash);
            }
            const status = await waitTransaction(web3Provider, txHash);
            if (!status) {
              console.log("Settle transaction failed.");
              return false;
            }
            return true;
          }
        );
      } catch (e) {
        console.error("error", e);
        return [false, e];
      }
    },
    // settle prep

    getUserUGasBalance: async ({ commit, dispatch }, payload: { contract: string }) => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const emp = await dispatch("getEMP", { address: payload.contract });
      try {
        const synth = await emp.methods.tokenCurrency().call();
        const balance = await getBalance(Vue.prototype.$provider, synth, store.state.account);
        console.log("balance", balance);
        return balance;
      } catch (e) {
        console.log("here");
        return 0;
      }
    },


    getUserTxStats: async ({ commit, dispatch }) => {
      await sleep(500);
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const [count, gasCost] = await getTxStats(Vue.prototype.$provider, WETH, store.state.account, null, null); // Null can later be replaced with block numbers.
      return [count, gasCost];
    },
    getUserWETHBalance: async ({ commit, dispatch }) => {
      await sleep(500);
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const balance = await getBalance(Vue.prototype.$provider, WETH, store.state.account);
      return balance;
    },
    checkContractApprovals: async ({ commit, dispatch }) => {
      return store.state.approvals;
    },
    makeContractApproval: async ({ commit, dispatch }, payload: { identifier: string; spenderAddress: string; tokenAddress: string }) => {
      await sleep(500);
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      if (!store.state.approvals[payload.spenderAddress]) {
        await approve(store.state.account, payload.spenderAddress, payload.tokenAddress, Vue.prototype.$provider);
        await dispatch("fetchContractApproval", payload);
        return -1;
      } else {
        commit("UPDATE_APPROVAL", { identifier: payload.identifier, value: true });
        return 1;
      }
    },

    fetchContractApproval: async ({ commit, dispatch }, payload: { identifier: string; spenderAddress: string; tokenAddress: string }) => {
      await sleep(500);
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const result = await getAllowance(store.state.account, payload.spenderAddress, payload.tokenAddress, Vue.prototype.$provider);
      console.debug("allowance", payload.spenderAddress, payload.tokenAddress, result);
      if (Number(result) > 0) {
        commit("UPDATE_APPROVAL", { identifier: payload.identifier, value: true });
      } else {
        commit("UPDATE_APPROVAL", { identifier: payload.identifier, value: false });
      }
      return result;
    },

    getMiningRewards: async ({ commit, dispatch }, payload: { address: string; addressEMP: string; addressLP: string; addressPrice: number }) => {
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      try {
        // console.log("getContractInfo", await getContractInfo(UGASJAN21));
        // console.log("getPriceByContract", await getPriceByContract(UGASJAN21));
        const emps = await getDevMiningEmps();
        const devmining = await DevMiningCalculator({
          provider: Vue.prototype.$provider,
          getPrice: getPriceByContract,
          empAbi: EMPContract.abi,
        });
        const getEmpInfo: any = await devmining.utils.getEmpInfo(payload.addressEMP);
        console.debug("getEmpInfo", {
          size: getEmpInfo.size,
          price: getEmpInfo.price,
          decimals: getEmpInfo.decimals,
        });
        const calculateEmpValue = await devmining.utils.calculateEmpValue(getEmpInfo);
        console.debug("calculateEmpValue", calculateEmpValue);
        const estimateDevMiningRewards = await devmining.estimateDevMiningRewards({
          totalRewards: emps.totalReward,
          empWhitelist: emps.empWhitelist,
        });
        console.debug("estimateDevMiningRewards", estimateDevMiningRewards);
        const rewards = {};
        for (let i = 0; i < estimateDevMiningRewards.length; i++) {
          rewards[estimateDevMiningRewards[i][0]] = estimateDevMiningRewards[i][1];
        }
        const base = new BigNumber(10).pow(18);
        const web3 = new Web3(Vue.prototype.$provider);
        const contractLp = new web3.eth.Contract((UGASJAN21LPContract.abi as unknown) as AbiItem, payload.addressLP);
        const contractLpCall = await contractLp.methods.getReserves().call();
        const ethPrice = await getPriceByContract(WETH);
        const umaPrice = await getPriceByContract(UMA);
        // const tokenPrice = await getPriceByContract(payload.address);

        // temp WETH
        const tempFixPriceWithWETH = payload.addressPrice * ethPrice;
        const tokenPrice = tempFixPriceWithWETH;
        console.debug("tempFixPriceWithWETH", tempFixPriceWithWETH);

        const assetReserve0 = new BigNumber(contractLpCall._reserve0).dividedBy(base).toNumber();
        const assetReserve1 = new BigNumber(contractLpCall._reserve1).dividedBy(base).toNumber();
        const assetReserveValue = assetReserve0 * tokenPrice + assetReserve1 * ethPrice;
        console.debug("assetReserveValue", assetReserveValue);
        // the second division is for the mint and it should be changed later for full accuracy
        const aprCalculate = (((rewards[payload.addressEMP] * 52 * umaPrice) / 2 / assetReserveValue) * 100) / 2;
        console.debug("aprCalculate %", aprCalculate);
        return mixin.methods.numeral(aprCalculate);
      } catch (e) {
        console.error("error", e);
        return 0;
      }
    },

    wrapETH: async ({ commit, dispatch }, payload: { amount: any; onTxHash?: (txHash: string) => void }) => {
      await sleep(500);
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const weth = await dispatch("getWETH", { address: WETH });
      try {
        const web3Provider = Vue.prototype.$provider;
        const amount = new BigNumber(payload.amount).times(new BigNumber(10).pow(18)).toString();
        const ge = await weth.methods.deposit().estimateGas(
          {
            from: store.state.account,
            value: amount,
            gas: 50000000,
          },
          async (error: any) => {
            console.log("SimTx Failed, ", error);
            return false;
          }
        );
        const wrap = await weth.methods.deposit().send(
          {
            from: store.state.account,
            value: amount,
            gas: 70000,
          },
          async (error: any, txHash: string) => {
            if (error) {
              console.error("WETH could not wrap", error);
              payload.onTxHash && payload.onTxHash("");
              return false;
            }
            if (payload.onTxHash) {
              payload.onTxHash(txHash);
            }
            const status = await waitTransaction(web3Provider, txHash);
            if (!status) {
              console.log("Wrap transaction failed.");
              return false;
            }
            return true;
          }
        );
        console.log("wrap", wrap);
        return wrap;
      } catch (e) {
        console.error("error", e);
        return 0;
      }
    },
    unwrapETH: async ({ commit, dispatch }, payload: { amount: any; onTxHash?: (txHash: string) => void }) => {
      await sleep(500);
      if (!Vue.prototype.$web3) {
        await dispatch("connect");
      }
      const weth = await dispatch("getWETH", { address: WETH });
      try {
        const web3Provider = Vue.prototype.$provider;
        const amount = new BigNumber(payload.amount).times(new BigNumber(10).pow(18)).toString();
        const ge = await weth.methods.withdraw(amount).estimateGas(
          {
            from: store.state.account,
            gas: 50000000,
          },
          async (error: any) => {
            console.log("SimTx Failed, ", error);
            return false;
          }
        );
        const unwrap = await weth.methods.withdraw(amount).send(
          {
            from: store.state.account,
            gas: 70000,
          },
          async (error: any, txHash: string) => {
            if (error) {
              console.error("WETH could not wrap", error);
              payload.onTxHash && payload.onTxHash("");
              return false;
            }
            if (payload.onTxHash) {
              payload.onTxHash(txHash);
            }
            const status = await waitTransaction(web3Provider, txHash);
            if (!status) {
              console.log("Wrap transaction failed.");
              return false;
            }
            return true;
          }
        );
        console.log("unwrap", unwrap);
        return unwrap;
      } catch (e) {
        console.error("error", e);
        return 0;
      }
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
