import Vue from "vue";
import Web3 from "web3";
import { Lock } from "@snapshot-labs/lock";
import { provider, TransactionReceipt } from "web3-core";
import { AbiItem } from "web3-utils";
import YAM from "./abi/yam.json";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";

// export async function connectWallet() { }

export function stateSave(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state));
}

export function stateLoad(key) {
  if (window.localStorage.getItem(key)) {
    return JSON.parse(window.localStorage.getItem(key) || "");
  } else {
    return null;
  }
}

export function stateDestroy() {
  window.localStorage.clear();
}

export const getERC20Contract = (provider: provider, address: string) => {
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract((YAM.abi as unknown) as AbiItem, address);
  return contract;
};

export const getBalance = async (provider: provider, tokenAddress: string, userAddress: string): Promise<string> => {
  const tokenContract = getERC20Contract(provider, tokenAddress);
  try {
    const balance: string = await tokenContract.methods.balanceOf(userAddress).call();
    return balance;
  } catch (e) {
    return "0";
  }
};

export const decToBn = (dec: number, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals));
};

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const splitChartData = (rawData: any) => {
  const categoryData: any = [];
  const values: any = [];
  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0]);
    values.push(rawData[i]);
  }
  return {
    categoryData: categoryData,
    values: values,
  };
};

export const waitTransaction = async (provider: provider, txHash: string) => {
  const web3 = new Web3(provider);
  let txReceipt: TransactionReceipt | null = null;
  while (txReceipt === null) {
    const r = await web3.eth.getTransactionReceipt(txHash);
    txReceipt = r;
    await sleep(2000);
  }
  return txReceipt.status;
};

export const getLiquidationPrice = (collateral: number, tokens: number, crThreshold: number, inverted: boolean): number => {
  if (tokens <= 0 || crThreshold <= 0 || collateral <= 0) {
    // If liquidation price is 0, then the position can always be liquidated (i.e. it is an invalid position).
    return 0;
  }

  // Solve for token price that would set the proposed CR == crThreshold.
  const liquidationPrice = collateral / tokens / crThreshold;
  return inverted ? 1 / liquidationPrice : liquidationPrice;
};

export const approve = async (
  userAddress: string,
  spenderAddress: string,
  tokenAddress: string,
  provider: provider,
  onTxHash?: (txHash: string) => void
): Promise<boolean> => {
  try {
    const tokenContract = getERC20Contract(provider, tokenAddress);
    return tokenContract.methods
      .approve(spenderAddress, ethers.constants.MaxUint256)
      .send({ from: userAddress, gas: 80000 }, async (error: any, txHash: string) => {
        if (error) {
          console.log("ERC20 could not be approved", error);
          onTxHash && onTxHash("");
          return false;
        }
        if (onTxHash) {
          onTxHash(txHash);
        }
        const status = await waitTransaction(provider, txHash);
        if (!status) {
          console.log("Approval transaction failed.");
          return false;
        }
        return true;
      });
  } catch (e) {
    console.log("error", e);
    return false;
  }
};

export const checkConnection = async ({ commit, dispatch }) => {
  await sleep(500);
  if (!Vue.prototype.$web3) {
    await dispatch("connect");
  }
};
