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
