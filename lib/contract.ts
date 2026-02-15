export const SHARDEUM_CHAIN_ID = 8119;
export const SHARDEUM_RPC_URL = "https://api-mezame.shardeum.org";
export const SHARDEUM_EXPLORER_URL = "https://explorer-mezame.shardeum.org";

export const SHARDEUM_CHAIN_CONFIG = {
  chainId: `0x${SHARDEUM_CHAIN_ID.toString(16)}`,
  chainName: "Shardeum EVM Testnet",
  nativeCurrency: {
    name: "SHM",
    symbol: "SHM",
    decimals: 18,
  },
  rpcUrls: [SHARDEUM_RPC_URL],
  blockExplorerUrls: [SHARDEUM_EXPLORER_URL],
};

// BlockHashPredictor contract ABI (matches the Solidity contract)
export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "predictor", type: "address" },
      { indexed: false, internalType: "uint256", name: "targetBlock", type: "uint256" },
      { indexed: false, internalType: "bytes32", name: "predictedHash", type: "bytes32" },
    ],
    name: "PredictionSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "predictor", type: "address" },
      { indexed: false, internalType: "uint256", name: "targetBlock", type: "uint256" },
      { indexed: false, internalType: "bytes32", name: "predictedHash", type: "bytes32" },
      { indexed: false, internalType: "bytes32", name: "actualHash", type: "bytes32" },
      { indexed: false, internalType: "bool", name: "isCorrect", type: "bool" },
    ],
    name: "PredictionRevealed",
    type: "event",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_predictedHash", type: "bytes32" }],
    name: "submitPrediction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_targetBlock", type: "uint256" }],
    name: "revealPrediction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_predictor", type: "address" },
      { internalType: "uint256", name: "_targetBlock", type: "uint256" },
    ],
    name: "getPrediction",
    outputs: [
      { internalType: "bytes32", name: "predictedHash", type: "bytes32" },
      { internalType: "bytes32", name: "actualHash", type: "bytes32" },
      { internalType: "bool", name: "revealed", type: "bool" },
      { internalType: "bool", name: "isCorrect", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
