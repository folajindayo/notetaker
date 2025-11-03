"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";

interface NoteCardProps {
  note: {
    author: string;
    message: string;
    timestamp: bigint;
    likes: bigint;
    replyCount: bigint;
    isEdited: boolean;
    isDeleted: boolean;
    tags?: string[];
  };
  noteId: number;
}

export function NoteCard({ note, noteId }: NoteCardProps) {
  const { address } = useAccount();
  const [showActions, setShowActions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { writeContract, isPending } = useWriteContract();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleLike = () => {
    if (isLiked) {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "unlikeNote",
        args: [BigInt(noteId)],
      });
    } else {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "likeNote",
        args: [BigInt(noteId)],
      });
    }
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "bookmarkNote",
      args: [BigInt(noteId)],
    });
  };

  const handleRepost = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "repostNote",
      args: [BigInt(noteId), ""],
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${note.author}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform">
              {note.author[2]?.toUpperCase() || "?"}
            </div>
          </Link>
          <div>
            <Link
              href={`/profile/${note.author}`}
              className="font-medium text-gray-900 hover:text-blue-600"
            >
              {formatAddress(note.author)}
            </Link>
            <div className="text-xs text-gray-500">{formatTimestamp(note.timestamp)}</div>
          </div>
        </div>

        {/* More Actions */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-500"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-all">
                🚩 Report
              </button>
              {address?.toLowerCase() === note.author.toLowerCase() && (
                <>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-all">
                    ✏️ Edit
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-all">
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-900 mb-3 leading-relaxed">{note.message}</p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full hover:bg-blue-100 cursor-pointer transition-all"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={isPending}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              isLiked
                ? "bg-red-50 text-red-600"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
            <span className="text-sm font-medium">{Number(note.likes)}</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-all">
            <span className="text-lg">💬</span>
            <span className="text-sm font-medium">{Number(note.replyCount)}</span>
          </button>

          <button
            onClick={handleRepost}
            disabled={isPending}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-all"
          >
            <span className="text-lg">🔁</span>
            <span className="text-sm font-medium">Repost</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            disabled={isPending}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Bookmark"
          >
            <span className="text-lg">🔖</span>
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Share"
          >
            <span className="text-lg">📤</span>
          </button>
        </div>
      </div>

      {note.isEdited && (
        <div className="text-xs text-gray-400 mt-2">Edited</div>
      )}
    </div>
  );
}

