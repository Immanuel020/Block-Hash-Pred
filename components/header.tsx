"use client";

import { useWallet } from "@/components/wallet-provider";
import { shortenAddress } from "@/lib/blockchain";
import { Loader2, Wallet, LogOut, AlertTriangle } from "lucide-react";

export function Header() {
  const { address, isConnecting, isCorrectChain, connect, disconnect, switchChain } =
    useWallet();

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <span className="text-lg font-bold text-primary font-mono">#</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground text-balance">
            BlockHash Predictor
          </h1>
          <p className="text-xs text-muted-foreground">Shardeum Testnet</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {address && !isCorrectChain && (
          <button
            onClick={switchChain}
            className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/20"
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Wrong Network</span>
          </button>
        )}

        {address ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-mono text-secondary-foreground">
                {shortenAddress(address)}
              </span>
            </div>
            <button
              onClick={disconnect}
              className="flex items-center justify-center rounded-lg border border-border bg-secondary p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              aria-label="Disconnect wallet"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isConnecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </header>
  );
}
