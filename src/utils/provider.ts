import { JsonRpcProvider } from "@ethersproject/providers";
import networks from "@/config/networks.json";

const providers = {};

export default function getProvider(chainId: number) {
  const rpc: string = networks[chainId].rpc;
  if (!providers[chainId]) providers[chainId] = new JsonRpcProvider(rpc);
  return providers[chainId];
}
