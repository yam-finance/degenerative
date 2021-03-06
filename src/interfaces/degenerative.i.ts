import Web3 from "web3/types";
export interface Degenerative {
  web3: Web3;
  contracts: any;
  addresses: any;
}

export interface Protection {
  coverageAmount: string;
  paid: string;
  holder: string;
  start: number;
  expiry: number;
  conceptIndex: number;
  status: number;
}

export interface ProtectionProvider {
  totalTokenSecondsProvided: string;
  premiumIndex: string;
  curTokens: string;
  lastUpdate: number;
  lastProvide: number;
  withdrawInitiated: number;
}

export interface JsonTxResult {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  isError: string;
  nonce: string;
  timeStamp: string;
  to: string;
  tokenDecimal: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
  txreceipt_status: string;
  value: string;
}
