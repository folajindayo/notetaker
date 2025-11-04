"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";

interface ReplyThreadProps {
  noteId: number;
}

export function ReplyThread({ noteId }: ReplyThreadProps) {
  const { address } = useAccount();
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const { data: replies } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getRepliesForNote",
    args: [BigInt(noteId)],
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const repliesList = (replies as any[]) || [];

  const handlePostReply = () => {
    if (!replyText.trim()) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "postReply",
      args: [BigInt(noteId), replyText],
    });
  };

  if (isSuccess) {
    setTimeout(() => {
      setReplyText("");
      setShowReplyBox(false);
    }, 1000);
  }

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Reply Button */}
      <button
        onClick={() => setShowReplyBox(!showReplyBox)}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        Reply
      </button>

      {/* Reply Input Box */}
      {showReplyBox && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            maxLength={280}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none mb-2"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{replyText.length}/280</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowReplyBox(false);
                  setReplyText("");
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePostReply}
                disabled={!replyText.trim() || isPending}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </div>
          {isSuccess && (
            <div className="mt-2 text-xs text-green-600">✓ Reply posted successfully!</div>
          )}
        </div>
      )}

      {/* Replies List */}
      {repliesList.length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="text-sm font-semibold text-gray-700">
            {repliesList.length} {repliesList.length === 1 ? "Reply" : "Replies"}
          </h4>
          {repliesList.map((reply, index) => (
            <div
              key={index}
              className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
            >
              {/* Avatar */}
              <Link href={`/profile/${reply.author}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-transform flex-shrink-0">
                  {reply.author[2]?.toUpperCase() || "?"}
                </div>
              </Link>

              {/* Reply Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    href={`/profile/${reply.author}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate"
                  >
                    {reply.author.slice(0, 8)}...{reply.author.slice(-4)}
                  </Link>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(reply.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{reply.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {repliesList.length === 0 && !showReplyBox && (
        <p className="text-sm text-gray-500 italic">No replies yet. Be the first to comment!</p>
      )}
    </div>
  );
}

export function ReplyCount({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1 text-gray-600">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      <span className="text-sm">{count}</span>
    </div>
  );
}

