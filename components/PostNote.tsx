"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI, MAX_MESSAGE_LENGTH } from "@/lib/constants";
import { WalletConnect } from "./WalletConnect";

export function PostNote() {
  const [message, setMessage] = useState("");
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "postNote",
        args: [message],
      });
    } catch (err) {
      console.error("Error posting note:", err);
    }
  };

  // Reset message after successful transaction
  if (isSuccess && message) {
    setTimeout(() => setMessage(""), 1000);
  }

  return (
    <div>
      {/* Badge */}
      <div className="badge mb-6" style={{ background: "#e8f5e9", color: "#2e7d32" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4caf50" }}></span>
        LIVE ON BASE SEPOLIA
      </div>

      {/* Heading */}
      <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: "#1d1d1f" }}>
        Share your thoughts{" "}
        <span style={{ color: "#ff6b6b" }}>📝</span> on-chain
      </h1>

      {/* Subtitle */}
      <p className="text-lg mb-8" style={{ color: "#6e6e73", lineHeight: "1.6" }}>
        From thoughts to blockchain, we make permanent messages that live forever on Base network.
      </p>

      {/* Action Buttons */}
      {!isConnected ? (
        <div className="flex flex-wrap gap-4 mb-8">
          <WalletConnect />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind? (gm, hello world, etc.)"
              maxLength={MAX_MESSAGE_LENGTH}
              className="w-full px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none transition-all"
              style={{ 
                border: "1px solid #e5e5e7",
                background: "#fafafa",
                color: "#1d1d1f",
                fontSize: "15px"
              }}
              rows={4}
              disabled={isPending || isConfirming}
            />
            <div className="flex justify-between items-center mt-3 text-sm" style={{ color: "#86868b" }}>
              <span>{message.length}/{MAX_MESSAGE_LENGTH} characters</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={!message.trim() || isPending || isConfirming}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending && "Confirming..."}
              {isConfirming && "Posting to blockchain..."}
              {!isPending && !isConfirming && "Post on-chain now"}
            </button>
            
            <button
              type="button"
              onClick={() => setMessage("")}
              className="btn-secondary"
              disabled={!message}
            >
              ▶ Clear
            </button>
          </div>
        </form>
      )}

      {/* Status Messages */}
      {isSuccess && (
        <div className="mt-6 p-4 rounded-2xl flex items-center gap-3" style={{ background: "#e8f5e9" }}>
          <span style={{ fontSize: "20px" }}>✨</span>
          <span style={{ color: "#2e7d32", fontWeight: 500 }}>Note posted successfully on-chain!</span>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 rounded-2xl" style={{ background: "#ffebee", color: "#c62828", fontSize: "14px" }}>
          {error.message}
        </div>
      )}

      {/* User Testimonials - Static */}
      {isConnected && (
        <div className="mt-12">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: "#ffd700", fontSize: "20px" }}>⭐</span>
            ))}
          </div>
          <div className="flex gap-2">
            {["🔵", "🟢", "🟣", "🟠"].map((emoji, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ background: "#f5f5f7" }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

