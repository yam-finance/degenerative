import Vue from "vue";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import request from "request";
import YAM from "./abi/yam.json";
import { provider, TransactionReceipt } from "web3-core";
import { GET_BLOCK, GET_BLOCKS, GET_PRICES_BY_BLOCK, GET_HEALTH } from "@/plugins/graphql/queries";
import { AbiItem } from "web3-utils";
import { ethers } from "ethers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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

export const getAllowance = async (userAddress: string, spenderAddress: string, tokenAddress: string, provider: provider): Promise<string> => {
  try {
    const tokenContract = getERC20Contract(provider, tokenAddress);
    const allowance: string = await tokenContract.methods.allowance(userAddress, spenderAddress).call();
    return allowance;
  } catch (e) {
    return "0";
  }
};

export const checkConnection = async ({ commit, dispatch }) => {
  await sleep(500);
  if (!Vue.prototype.$web3) {
    await dispatch("connect");
  }
};

export const getUgasFromJSON = (jsonData: any) => {
  return Number(jsonData.price / 1000000000000000000);
};

const requestHttp = url => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: url,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      }
    );
  });
};

export const getTWAP = async () => {
  const data: any = await requestHttp("https://ugasdata.info/twap-range");
  return data;
};

export const getTWAPData = async () => {
  const TWAP = await getTWAP();
  const plotTWAP: any = [];
  for (const element of TWAP) {
    const newElement = {
      price: getUgasFromJSON({ price: element.price }),
      timestamp: element.timestamp,
    };
    plotTWAP.push(newElement);
  }
  return plotTWAP;
};

export const getLatestBlock = async () => {
  let latestBlock = Vue.prototype.eth.latestBlock;
  let headBlock = Vue.prototype.eth.headBlock;
  await Vue.prototype.gql.health
    .query({
      query: GET_HEALTH,
    })
    .then(res => {
      const latestBlockValue = res.data.indexingStatusForCurrentVersion.chains[0].latestBlock.number;
      const headBlockValue = res.data.indexingStatusForCurrentVersion.chains[0].chainHeadBlock.number;
      if (latestBlockValue && headBlockValue) {
        latestBlock = Vue.prototype.eth.latestBlock = latestBlockValue;
        headBlock = Vue.prototype.eth.headBlock = headBlockValue;
      }
    })
    .catch(e => {
      console.log(e);
    });
  return [latestBlock, headBlock];
};

export async function splitQuery(query, localClient, vars, list, skipCount = 100) {
  let fetchedData = {};
  let allFound = false;
  let skip = 0;
  while (!allFound) {
    let end = list.length;
    if (skip + skipCount < list.length) {
      end = skip + skipCount;
    }
    const sliced = list.slice(skip, end);
    const result = await localClient.query({
      query: query(...vars, sliced),
      fetchPolicy: "cache-first",
    });
    fetchedData = {
      ...fetchedData,
      ...result.data,
    };
    if (Object.keys(result.data).length < skipCount || skip + skipCount > list.length) {
      allFound = true;
    } else {
      skip += skipCount;
    }
  }
  return fetchedData;
}

export const getBlockFromTimestamp = async timestamp => {
  const result = await Vue.prototype.gql.block.query({
    query: GET_BLOCK,
    variables: {
      timestampFrom: timestamp,
      timestampTo: timestamp + 600,
    },
    fetchPolicy: "cache-first",
  });
  return result?.data?.blocks?.[0]?.number;
};

export async function getBlocksFromTimestamps(timestamps, skipCount = 500) {
  if (timestamps?.length === 0) {
    return [];
  }
  const fetchedData = await splitQuery(GET_BLOCKS, Vue.prototype.gql.block, [], timestamps, skipCount);
  const blocks: any = [];
  if (fetchedData) {
    for (const t in fetchedData) {
      if (fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split("t")[1],
          number: fetchedData[t][0]["number"],
        });
      }
    }
  }
  return blocks;
}

export const getIntervalTokenData = async (tokenAddress, startTime, interval = 3600) => {
  const latestBlock = Vue.prototype.eth.latestBlock;
  // const latestBlock = "11491189";
  const utcEndTime = dayjs.utc();
  let time = startTime;
  if (!latestBlock) {
    await getLatestBlock();
  }
  const timestamps: any = [];
  while (time < utcEndTime.unix()) {
    timestamps.push(time);
    time += interval;
  }
  if (timestamps.length === 0) {
    return [];
  }
  let blocks;
  try {
    blocks = await getBlocksFromTimestamps(timestamps, 100);
    if (!blocks || blocks.length === 0) {
      return [];
    }

    if (latestBlock) {
      blocks = blocks.filter(b => {
        return parseFloat(b.number) <= parseFloat(latestBlock);
      });
    }
    const result = await splitQuery(GET_PRICES_BY_BLOCK, Vue.prototype.gql.client, [tokenAddress], blocks, 50);
    const values: any = [];
    for (const row in result) {
      const timestamp = row.split("t")[1];
      const derivedETH = parseFloat(result[row]?.derivedETH);
      if (timestamp) {
        values.push({
          timestamp,
          derivedETH,
        });
      }
    }
    let index = 0;
    for (const brow in result) {
      const timestamp = brow.split("b")[1];
      if (timestamp) {
        values[index].priceUSD = result[brow].ethPrice * values[index].derivedETH;
        index += 1;
      }
    }
    const formattedHistory: any = [];
    for (let i = 0; i < values.length - 1; i++) {
      formattedHistory.push({
        open: parseFloat(values[i].priceUSD),
        close: parseFloat(values[i + 1].priceUSD),
        openETH: values[i].derivedETH,
        closeETH: values[i + 1].derivedETH,
        twap: (parseFloat(values[i].priceUSD) + parseFloat(values[i + 1].priceUSD)) / 2,
        twapETH: (values[i].derivedETH + values[i + 1].derivedETH) / 2,
        timestamp: values[i].timestamp,
        timestampDate: dayjs(values[i].timestamp * 1000).format("MMM, D"), // DD/MM/YYYY
      });
    }
    return formattedHistory;
  } catch (e) {
    console.log(e, "error fetching blocks");
    return [];
  }
};

export const getUniswapDataHourly = async (token, fromTimestamp) => {
  return await getIntervalTokenData(token, fromTimestamp, 3600);
};

export const getUniswapDataDaily = async (token, fromTimestamp) => {
  return await getIntervalTokenData(token, fromTimestamp, 86400);
};
