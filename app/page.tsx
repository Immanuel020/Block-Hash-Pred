"use client";

import { useState, useCallback } from "react";
import { WalletProvider } from "@/components/wallet-provider";
import { Header } from "@/components/header";
import { BlockInfo } from "@/components/block-info";
import { PredictionPanel } from "@/components/prediction-panel";
import { RevealPanel } from "@/components/reveal-panel";
import { NetworkInfo } from "@/components/network-info";
import { Settings } from "lucide-react";

function DApp() {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [blockHash, setBlockHash] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const handleBlockUpdate = useCallback(
    (num: number, hash: string) => {
      setBlockNumber(num);
      setBlockHash(hash);
    },
    []
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Contract Address Banner */}
          <div className="mb-6 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                  aria-label="Toggle settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
                {contractAddress ? (
                  <p className="truncate text-sm font-mono text-secondary-foreground">
                    Contract: {contractAddress}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Set your deployed contract address to get started
                  </p>
                )}
              </div>
            </div>
            {showSettings && (
              <div className="mt-3 border-t border-border pt-3">
                <label className="text-xs text-muted-foreground">
                  BlockHashPredictor Contract Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Info */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              <BlockInfo onBlockUpdate={handleBlockUpdate} />
              <NetworkInfo />
            </div>

            {/* Right Column - Actions */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <PredictionPanel
                blockNumber={blockNumber}
                blockHash={blockHash}
                contractAddress={contractAddress}
              />
              <RevealPanel contractAddress={contractAddress} />
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              How It Works
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "1",
                  title: "Fetch",
                  desc: "The app reads the current block number and its hash from Shardeum RPC.",
                },
                {
                  step: "2",
                  title: "Generate",
                  desc: "4 candidate hashes are derived via keccak256(latestHash, blockNumber, salt).",
                },
                {
                  step: "3",
                  title: "Submit",
                  desc: "Pick a hash or enter your own. The contract stores it targeting block.number + 1.",
                },
                {
                  step: "4",
                  title: "Reveal",
                  desc: "After the target block is mined, reveal to compare the actual hash with your prediction.",
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {"Note: The EVM only stores the last 256 block hashes. Predictions must be revealed within 256 blocks of the target."}
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          BlockHash Predictor on Shardeum EVM Testnet (Chain {8119})
        </p>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <WalletProvider>
      <DApp />
    </WalletProvider>
  );
}
