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

  // Get the latest block number to trigger refresh
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Watch for new note events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "NotePosted",
    onLogs() {
      setRefreshKey((prev) => prev + 1);
    },
  });

  // Read all notes from the contract
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

  // Refetch when block number changes
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

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (!CONTRACT_ADDRESS) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6 text-center">
        <p className="text-yellow-800 dark:text-yellow-200">
          ⚠️ Contract address not configured. Please deploy the contract and set
          NEXT_PUBLIC_CONTRACT_ADDRESS in your .env.local file.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Note Feed</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Note Feed</h2>
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg p-4">
          Error loading notes: {error.message}
        </div>
      </div>
    );
  }

  const notesArray = (notes as Note[]) || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Note Feed</h2>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {notesArray.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">📝 No notes yet</p>
          <p className="text-sm">Be the first to post a note!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...notesArray].reverse().map((note, index) => (
            <div
              key={`${note.timestamp}-${index}`}
              className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                  {formatAddress(note.author)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(note.timestamp)}
                </span>
              </div>
              <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                {note.message}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Total notes: {notesArray.length}
        </p>
      </div>
    </div>
  );
}

