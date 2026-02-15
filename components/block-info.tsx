"use client";

import { useEffect, useState, useCallback } from "react";
import { getBlockInfo } from "@/lib/blockchain";
import { shortenHash } from "@/lib/blockchain";
import { Blocks, Hash, RefreshCw, Clock } from "lucide-react";

interface BlockData {
  blockNumber: number;
  blockHash: string;
  timestamp: number;
}

export function BlockInfo({
  onBlockUpdate,
}: {
  onBlockUpdate: (blockNumber: number, blockHash: string) => void;
}) {
  const [block, setBlock] = useState<BlockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await getBlockInfo();
      setBlock(info);
      onBlockUpdate(info.blockNumber, info.blockHash);
    } catch {
      setError("Failed to fetch block data");
    } finally {
      setLoading(false);
    }
  }, [onBlockUpdate]);

  useEffect(() => {
    fetchBlock();
    const interval = setInterval(fetchBlock, 15000);
    return () => clearInterval(interval);
  }, [fetchBlock]);

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-sm text-destructive">{error}</p>
        <button
          onClick={fetchBlock}
          className="mt-2 text-sm text-muted-foreground underline hover:text-foreground"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Current Block
        </h2>
        <button
          onClick={fetchBlock}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
          aria-label="Refresh block data"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading && !block ? (
        <div className="mt-4 flex items-center gap-2">
          <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
        </div>
      ) : block ? (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Blocks className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Block Number</p>
              <p className="text-xl font-bold font-mono text-foreground">
                {block.blockNumber.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Hash className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Block Hash</p>
              <p className="truncate text-sm font-mono text-foreground" title={block.blockHash}>
                {shortenHash(block.blockHash, 12)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Timestamp</p>
              <p className="text-sm text-foreground">
                {new Date(block.timestamp * 1000).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
