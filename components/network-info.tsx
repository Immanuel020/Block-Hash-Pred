"use client";

import { SHARDEUM_CHAIN_ID, SHARDEUM_RPC_URL, SHARDEUM_EXPLORER_URL } from "@/lib/contract";
import { Globe, Link2, ExternalLink } from "lucide-react";

export function NetworkInfo() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Network
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Chain ID</p>
            <p className="text-sm font-mono text-foreground">{SHARDEUM_CHAIN_ID}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">RPC</p>
            <p className="truncate text-sm font-mono text-foreground">{SHARDEUM_RPC_URL}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Explorer</p>
            <a
              href={SHARDEUM_EXPLORER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-sm font-mono text-primary hover:underline"
            >
              {SHARDEUM_EXPLORER_URL}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
