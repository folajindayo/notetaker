"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI, MAX_MESSAGE_LENGTH } from "@/lib/constants";

interface PostNoteModalProps {
  onClose: () => void;
}

export function PostNoteModal({ onClose }: PostNoteModalProps) {
  const [message, setMessage] = useState("");
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

  // Close modal after successful transaction
  if (isSuccess) {
    setTimeout(() => {
      onClose();
    }, 2000);
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg mx-4 rounded-2xl p-6 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Post New Note
          </h2>
          <button 
            onClick={onClose}
            className="btn-icon"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind? Share your thoughts on-chain..."
              maxLength={MAX_MESSAGE_LENGTH}
              className="w-full px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all border border-gray-200 bg-gray-50 text-gray-900 min-h-[120px]"
              disabled={isPending || isConfirming}
              autoFocus
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                {message.length}/{MAX_MESSAGE_LENGTH} characters
              </span>
              {message.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessage("")}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Status Messages */}
          {isSuccess && (
            <div className="mb-4 p-3 rounded-lg flex items-center gap-2 bg-green-50 text-green-800">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span className="text-sm font-medium">Note posted successfully!</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800">
              <p className="text-sm">{error.message}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!message.trim() || isPending || isConfirming}
              className="flex-1 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700"
            >
              {isPending && "Confirming..."}
              {isConfirming && "Posting..."}
              {!isPending && !isConfirming && "Post On-Chain"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

