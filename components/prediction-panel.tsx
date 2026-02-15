"use client";

import { useState, useMemo } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/components/wallet-provider";
import { generatePredictionOptions, shortenHash } from "@/lib/blockchain";
import { CONTRACT_ABI } from "@/lib/contract";
import { Check, Send, Loader2, ArrowRight } from "lucide-react";

interface PredictionPanelProps {
  blockNumber: number | null;
  blockHash: string | null;
  contractAddress: string;
}

export function PredictionPanel({
  blockNumber,
  blockHash,
  contractAddress,
}: PredictionPanelProps) {
  const { signer, address, isCorrectChain } = useWallet();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [customHash, setCustomHash] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const options = useMemo(() => {
    if (!blockHash || !blockNumber) return [];
    return generatePredictionOptions(blockHash, blockNumber);
  }, [blockHash, blockNumber]);

  const selectedHash = useCustom ? customHash : options[selectedOption ?? -1] ?? null;
  const targetBlock = blockNumber ? blockNumber + 1 : null;

  const canSubmit =
    signer &&
    isCorrectChain &&
    contractAddress &&
    selectedHash &&
    selectedHash.length === 66 &&
    !submitting;

  async function handleSubmit() {
    if (!canSubmit || !signer) return;

    setSubmitting(true);
    setError(null);
    setTxHash(null);

    try {
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
      const tx = await contract.submitPrediction(selectedHash);
      setTxHash(tx.hash);
      await tx.wait();
    } catch (err: unknown) {
      const error = err as { reason?: string; message?: string };
      setError(error.reason || error.message || "Transaction failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Make a Prediction
        </h2>
        {targetBlock && (
          <span className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-mono text-primary">
            Target: Block {targetBlock.toLocaleString()}
          </span>
        )}
      </div>

      {!address ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Connect your wallet to make predictions
          </p>
        </div>
      ) : !isCorrectChain ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-sm text-destructive">
            Switch to Shardeum Testnet to continue
          </p>
        </div>
      ) : !contractAddress ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Enter a contract address below to start predicting
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              Select a generated prediction or enter your own hash:
            </p>

            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedOption(i);
                  setUseCustom(false);
                }}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                  !useCustom && selectedOption === i
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30 hover:bg-secondary/50"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    !useCustom && selectedOption === i
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {!useCustom && selectedOption === i && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </div>
                <span className="truncate text-sm font-mono text-secondary-foreground" title={opt}>
                  {shortenHash(opt, 14)}
                </span>
              </button>
            ))}

            <div className="relative mt-2">
              <button
                onClick={() => setUseCustom(true)}
                className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                  useCustom
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30 hover:bg-secondary/50"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    useCustom
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {useCustom && <Check className="h-3.5 w-3.5" />}
                </div>
                <span className="text-sm text-muted-foreground">Custom hash</span>
              </button>
              {useCustom && (
                <input
                  type="text"
                  placeholder="0x..."
                  value={customHash}
                  onChange={(e) => setCustomHash(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {txHash && (
            <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
              <p className="text-sm text-primary">
                Prediction submitted!{" "}
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

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Prediction
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
