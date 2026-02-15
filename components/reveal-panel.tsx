"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/components/wallet-provider";
import { CONTRACT_ABI } from "@/lib/contract";
import { shortenHash } from "@/lib/blockchain";
import { Eye, Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface RevealPanelProps {
  contractAddress: string;
}

export function RevealPanel({ contractAddress }: RevealPanelProps) {
  const { signer, address, isCorrectChain } = useWallet();
  const [targetBlock, setTargetBlock] = useState("");
  const [revealing, setRevealing] = useState(false);
  const [result, setResult] = useState<{
    predictedHash: string;
    actualHash: string;
    isCorrect: boolean;
  } | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canReveal =
    signer &&
    isCorrectChain &&
    contractAddress &&
    targetBlock &&
    !revealing;

  async function handleReveal() {
    if (!canReveal || !signer || !address) return;

    setRevealing(true);
    setError(null);
    setResult(null);
    setTxHash(null);

    try {
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);

      // First, try to reveal
      const tx = await contract.revealPrediction(BigInt(targetBlock));
      setTxHash(tx.hash);
      await tx.wait();

      // Then read the result
      const prediction = await contract.getPrediction(address, BigInt(targetBlock));
      setResult({
        predictedHash: prediction[0],
        actualHash: prediction[1],
        isCorrect: prediction[3],
      });
    } catch (err: unknown) {
      const error = err as { reason?: string; message?: string };
      setError(error.reason || error.message || "Reveal failed");
    } finally {
      setRevealing(false);
    }
  }

  if (!address || !isCorrectChain || !contractAddress) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Reveal Prediction
      </h2>

      <div className="mt-5 flex flex-col gap-3">
        <label className="text-xs text-muted-foreground">
          Enter the target block number to reveal:
        </label>
        <input
          type="number"
          placeholder="e.g. 12345"
          value={targetBlock}
          onChange={(e) => setTargetBlock(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {txHash && !result && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
            <p className="text-sm text-primary">
              Reveal submitted!{" "}
              <a
                href={`https://explorer-mezame.shardeum.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline hover:no-underline"
              >
                View on Explorer <ArrowRight className="h-3 w-3" />
              </a>
            </p>
          </div>
        )}

        {result && (
          <div
            className={`rounded-lg border p-4 ${
              result.isCorrect
                ? "border-primary/30 bg-primary/5"
                : "border-destructive/30 bg-destructive/5"
            }`}
          >
            <div className="flex items-center gap-2">
              {result.isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span
                className={`text-sm font-medium ${
                  result.isCorrect ? "text-primary" : "text-destructive"
                }`}
              >
                {result.isCorrect ? "Correct Prediction!" : "Incorrect Prediction"}
              </span>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Your Prediction</p>
                <p className="font-mono text-sm text-secondary-foreground" title={result.predictedHash}>
                  {shortenHash(result.predictedHash, 12)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Actual Hash</p>
                <p className="font-mono text-sm text-secondary-foreground" title={result.actualHash}>
                  {shortenHash(result.actualHash, 12)}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleReveal}
          disabled={!canReveal}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {revealing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Revealing...
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Reveal Prediction
            </>
          )}
        </button>
      </div>
    </div>
  );
}
