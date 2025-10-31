"use client";

import { useReadContract, useBlockNumber, useWatchContractEvent } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import { useState, useEffect } from "react";

interface Note {
  author: string;
  message: string;
  timestamp: bigint;
}

export function NoteFeed() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: blockNumber } = useBlockNumber({ watch: true });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "NotePosted",
    onLogs() {
      setRefreshKey((prev) => prev + 1);
    },
  });

  const {
    data: notes,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getAllNotes",
    query: {
      enabled: !!CONTRACT_ADDRESS,
    },
  });

  useEffect(() => {
    if (blockNumber) {
      refetch();
    }
  }, [blockNumber, refreshKey, refetch]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 300) return "2 minutes ago";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 7200) return "1 hour ago";
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 172800) return "1 day ago";
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  if (!CONTRACT_ADDRESS) {
    return (
      <div className="text-center py-8">
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          ⚠️ Contract not configured
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent" style={{ borderColor: "var(--blue-primary)" }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p style={{ color: "#ff3b30", fontSize: "14px" }}>
          Error loading notes
        </p>
      </div>
    );
  }

  const notesArray = (notes as Note[]) || [];

  if (notesArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">📝</div>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          No notes yet
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
          Be the first to post!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Recent Notes
        </h2>
        <button className="text-sm" style={{ color: "var(--text-muted)" }}>
          •••
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...notesArray].reverse().slice(0, 6).map((note, index) => (
          <div
            key={`${note.timestamp}-${index}`}
            className={`note-card ${index === notesArray.length - 1 ? "highlighted" : ""}`}
          >
            {/* Timestamp */}
            <div className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
              {formatTimestamp(note.timestamp)}
            </div>

            {/* Title & Badge */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="font-semibold text-base" style={{ color: index === notesArray.length - 1 ? "var(--blue-primary)" : "var(--text-primary)" }}>
                {note.message.slice(0, 30)}{note.message.length > 30 ? "..." : ""}
              </h3>
              <span className="badge badge-gray flex-shrink-0">
                On-Chain
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-4" style={{ color: index === notesArray.length - 1 ? "var(--blue-primary)" : "var(--text-secondary)" }}>
              {note.message.length > 80 ? note.message : `Posted by ${formatAddress(note.author)}`}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
              <span>{formatAddress(note.author)}</span>
              <span>Base Sepolia</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

