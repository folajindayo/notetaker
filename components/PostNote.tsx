"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI, MAX_MESSAGE_LENGTH } from "@/lib/constants";

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

  if (!isConnected) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Connect your wallet to post notes
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Post a Note</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind? (gm, hello world, etc.)"
            maxLength={MAX_MESSAGE_LENGTH}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
            rows={4}
            disabled={isPending || isConfirming}
          />
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {message.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!message.trim() || isPending || isConfirming}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {isPending && "Confirming..."}
          {isConfirming && "Posting..."}
          {!isPending && !isConfirming && "Post Note"}
        </button>
      </form>

      {isSuccess && (
        <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
          ✅ Note posted successfully!
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm">
          Error: {error.message}
        </div>
      )}
    </div>
  );
}

