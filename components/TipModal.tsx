"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import { parseEther } from "viem";

interface TipModalProps {
  recipientAddress: string;
  recipientName?: string;
  noteId?: number;
  onClose: () => void;
}

export function TipModal({ recipientAddress, recipientName, noteId, onClose }: TipModalProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const presetAmounts = [
    { label: "0.001 ETH", value: "0.001", emoji: "☕" },
    { label: "0.01 ETH", value: "0.01", emoji: "🍕" },
    { label: "0.05 ETH", value: "0.05", emoji: "🎁" },
    { label: "0.1 ETH", value: "0.1", emoji: "💎" },
  ];

  const handleSendTip = () => {
    if (!amount || !noteId) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "tipNote",
      args: [BigInt(noteId)],
      value: parseEther(amount),
    });
  };

  if (isSuccess) {
    setTimeout(() => {
      onClose();
    }, 2000);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Send a Tip 💰</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Recipient Info */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
            {recipientName?.[0]?.toUpperCase() || recipientAddress[2]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">
              {recipientName || `${recipientAddress.slice(0, 8)}...`}
            </p>
            <p className="text-sm text-gray-500 truncate">{recipientAddress}</p>
          </div>
        </div>

        {/* Preset Amounts */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Amount
          </label>
          <div className="grid grid-cols-2 gap-3">
            {presetAmounts.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setAmount(preset.value)}
                className={`p-3 border-2 rounded-lg transition-all ${
                  amount === preset.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="text-2xl mb-1">{preset.emoji}</div>
                <div className="text-sm font-medium text-gray-900">{preset.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Amount (ETH)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.001"
              step="0.001"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent pr-16"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              ETH
            </span>
          </div>
          {amount && (
            <p className="text-xs text-gray-500 mt-2">
              ≈ ${(parseFloat(amount) * 2000).toFixed(2)} USD
            </p>
          )}
        </div>

        {/* Optional Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Optional Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Say something nice..."
            maxLength={100}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{message.length}/100 characters</p>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm">
            ✓ Tip sent successfully! The creator will be notified.
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSendTip}
            disabled={!amount || !noteId || isPending || parseFloat(amount) <= 0}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Sending..." : `Send ${amount || "0"} ETH`}
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-center text-gray-500 mt-4">
          💡 Tips go directly to the creator's wallet. A 1% platform fee applies.
        </p>
      </div>
    </div>
  );
}

