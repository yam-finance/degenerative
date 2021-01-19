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
import duration from "dayjs/plugin/duration";
import erc20 from "@studydefi/money-legos/erc20";
import { WETH, DAI } from "./addresses";

dayjs.extend(utc);
dayjs.extend(duration);

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
  let latestBlock = Vue.prototype.eth.latestBlock;
  // latestBlock = "11491189";
  const utcEndTime = dayjs.utc();
  const nowUnix = utcEndTime.add(20, "d").unix();

  let time = startTime;
  if (!latestBlock) {
    latestBlock = await getLatestBlock()[0];
  }
  const timestamps: any = [];
  while (time < nowUnix) {
    timestamps.push(time);
    time += interval;
  }
  if (timestamps.length === 0) {
    return [];
  }

  let blocks;
  try {
    blocks = await getBlocksFromTimestamps(timestamps);
    if (!blocks || blocks.length === 0) {
      return [];
    }

    if (latestBlock) {
      blocks = blocks.filter(b => {
        return parseFloat(b.number) <= parseFloat(latestBlock);
      });
    }
    blocks.push({ timestamp: blocks[blocks.length - 1].timestamp, number: (blocks[blocks.length - 1].number - 100).toString() });

    const result = await splitQuery(GET_PRICES_BY_BLOCK, Vue.prototype.gql.client, [tokenAddress], blocks, 60);
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
    const shortNumber = function(number) {
      return +parseFloat(number).toFixed(4);
    };
    const formattedHistory: any = [];
    for (let i = 0; i < values.length; i++) {
      const lastIndex = values.length - 1;
      formattedHistory.push({
        timestamp: values[i].timestamp,
        timestampDate: dayjs(values[i].timestamp * 1000).format("MMM, D"), // DD/MM/YYYY
        open: parseFloat(values[i].priceUSD),
        close: parseFloat(values[i === lastIndex ? lastIndex : i + 1].priceUSD),
        openETH: shortNumber(values[i].derivedETH),
        closeETH: shortNumber(values[i === lastIndex ? lastIndex : i + 1].derivedETH),
        twap: (parseFloat(values[i].priceUSD) + parseFloat(values[i === lastIndex ? lastIndex : i + 1].priceUSD)) / 2,
        twapETH: shortNumber((values[i].derivedETH + values[i === lastIndex ? lastIndex : i + 1].derivedETH) / 2),
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

export async function getContractInfo(address: string) {
  const data: any = await requestHttp(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`);
  return data;
}

export async function getPriceByContract(address: string, toCurrency?: string) {
  const result = await getContractInfo(address);
  return result && result.market_data && result.market_data.current_price[toCurrency || "usd"];
}

export function DevMiningCalculator({ provider, getPrice, empAbi }) {
  const web3 = new Web3(provider);
  const { utils, BigNumber, FixedNumber } = ethers;
  const { parseEther } = utils;

  async function getEmpInfo(address: string, toCurrency = "usd") {
    try {
      const emp = new web3.eth.Contract((empAbi as unknown) as AbiItem, address);
      const collateralAddress = await emp.methods.collateralCurrency().call();
      const erc20Contract = new web3.eth.Contract((erc20.abi as unknown) as AbiItem, collateralAddress);
      const size = await emp.methods.rawTotalPositionCollateral().call();
      const price = await getPrice(collateralAddress, toCurrency);
      const decimals = await erc20Contract.methods.decimals().call();
      return {
        address,
        toCurrency,
        collateralAddress,
        size,
        price,
        decimals,
      };
    } catch (e) {
      console.log("error getting emp state", e);
      return "bad";
    }
  }

  function calculateEmpValue({ price, size, decimals }: { price: number; size: string; decimals: number }) {
    const fixedPrice = FixedNumber.from(price.toString() || 0);
    const fixedSize = FixedNumber.fromValue(BigNumber.from(size), decimals);
    return fixedPrice.mulUnsafe(fixedSize);
  }

  async function estimateDevMiningRewards({ totalRewards, empWhitelist }: { totalRewards: number; empWhitelist: string[] }) {
    const allInfo = await Promise.all(empWhitelist.map(address => getEmpInfo(address.toLowerCase())));
    const values: any[] = [];
    const totalValue = allInfo.reduce((totalValue: any, info: any) => {
      const value = calculateEmpValue(info);
      values.push(value);
      return totalValue.addUnsafe(value);
    }, FixedNumber.from("0"));
    return allInfo.map((info: any, i: any): [string, string] => {
      return [
        info.address,
        values[i]
          .mulUnsafe(FixedNumber.from(totalRewards))
          .divUnsafe(totalValue)
          .toString(),
      ];
    });
  }

  return {
    estimateDevMiningRewards,
    utils: {
      getEmpInfo,
      calculateEmpValue,
    },
  };
}

const emplistDataBackup = {
  empWhitelist: [
    "0x3a93E863cb3adc5910E6cea4d51f132E8666654F",
    "0x516f595978D87B67401DaB7AfD8555c3d28a3Af4",
    "0x4AA79c00240a2094Ff3fa6CF7c67f521f32D84a2",
    "0xf32219331A03D99C98Adf96D43cc312353003531",
    "0x1c3f1A342c8D9591D9759220d114C685FD1cF6b8",
    "0xE4256C47a3b27a969F25de8BEf44eCA5F2552bD5",
    "0xeAddB6AD65dcA45aC3bB32f88324897270DA0387",
    "0xf215778F3a5e7Ab6A832e71d87267Dd9a9aB0037",
    "0x267D46e71764ABaa5a0dD45260f95D9c8d5b8195",
    "0x45c4DBD73294c5d8DDF6E5F949BE4C505E6E9495",
    "0xda0943251079eB9f517668fdB372fC6AE299D898",
    "0xd6fc1A7327210b7Fe33Ef2514B44979719424A1d",
    "0x2862A798B3DeFc1C24b9c0d241BEaF044C45E585",
    "0xd81028a6fbAAaf604316F330b20D24bFbFd14478",
    "0x94C7cab26c04B76D9Ab6277a0960781b90f74294",
    "0x7c4090170aeADD54B1a0DbAC2C8D08719220A435",

    "0xeaa081a9fad4607cdf046fea7d4bf3dfef533282",
    "0xfa3aa7ee08399a4ce0b4921c85ab7d645ccac669",
  ],
  totalReward: 50000,
};

// export async function getUniPrice(pairA, pairB) {
//   return 1;
// }

// to reinit
// export async function getTokenPrice(token) {
//   const ethUnitPrice: any = getUniPrice(WETH, DAI);
//   let tokenPrice: any = getUniPrice(token, WETH);
//   tokenPrice = tokenPrice * ethUnitPrice;
//   return tokenPrice;
// }

export async function getDevMiningEmps() {
  // const data: any = await requestHttp(`https://raw.githubusercontent.com/UMAprotocol/protocol/master/packages/affiliates/payouts/devmining-status.json`);
  // return data;
  return emplistDataBackup;
}
