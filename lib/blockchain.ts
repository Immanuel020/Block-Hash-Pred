import { ethers } from "ethers";
import { SHARDEUM_RPC_URL } from "./contract";

export function getReadProvider() {
  return new ethers.JsonRpcProvider(SHARDEUM_RPC_URL);
}

export async function getBlockInfo() {
  const provider = getReadProvider();
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);
  return {
    blockNumber,
    blockHash: block?.hash ?? "0x0",
    timestamp: block?.timestamp ?? 0,
  };
}

export function generatePredictionOptions(latestHash: string, blockNumber: number): string[] {
  const options: string[] = [];
  for (let i = 0; i < 4; i++) {
    const hash = ethers.keccak256(
      ethers.solidityPacked(
        ["bytes32", "uint256", "uint256"],
        [latestHash, blockNumber, i]
      )
    );
    options.push(hash);
  }
  return options;
}

export function shortenHash(hash: string, chars = 8): string {
  if (!hash) return "";
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
