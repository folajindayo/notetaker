"use client";

import { useReadContract, useBlockNumber, useWatchContractEvent } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import { useState, useEffect } from "react";

interface Note {
  author: string;
  message: string;
  timestamp: bigint;
}

interface GroupedNotes {
  [date: string]: Note[];
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

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const groupNotesByDate = (notes: Note[]): GroupedNotes => {
    const grouped: GroupedNotes = {};
    notes.forEach(note => {
      const date = new Date(Number(note.timestamp) * 1000);
      const dateKey = date.toLocaleDateString('en-US', { 
        weekday: 'short' 
      }).toUpperCase();
      const dayMonth = date.toLocaleDateString('en-US', { 
        day: 'numeric',
        month: 'short'
      }).toUpperCase();
      const key = `${dateKey}|${dayMonth}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(note);
    });
    return grouped;
  };

  const getAuthorEmoji = (addr: string) => {
    const emojis = ["🔵", "🟢", "🟣", "🟠", "🔴", "🟡", "🟤", "⚫"];
    const index = parseInt(addr.slice(2, 4), 16) % emojis.length;
    return emojis[index];
  };

  if (!CONTRACT_ADDRESS) {
    return (
      <div className="text-center py-8">
        <p style={{ color: "#86868b", fontSize: "14px" }}>
          ⚠️ Contract not configured
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent" style={{ borderColor: "#1d1d1f" }}></div>
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
  const groupedNotes = groupNotesByDate([...notesArray].reverse());

  return (
    <div className="flex flex-col h-full">
      {notesArray.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">📝</div>
          <p style={{ color: "#86868b", fontSize: "15px" }}>
            No notes yet
          </p>
          <p style={{ color: "#86868b", fontSize: "13px", marginTop: "4px" }}>
            Be the first to post!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedNotes).map(([dateKey, dayNotes]) => {
            const [weekday, dayMonth] = dateKey.split('|');
            return (
              <div key={dateKey}>
                {/* Date Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-xs tracking-wide" style={{ color: "#86868b" }}>
                    {weekday}
                  </h3>
                  <span className="text-xs" style={{ color: "#c7c7cc" }}>
                    {dayMonth}
                  </span>
                </div>

                {/* Notes for this date */}
                <div className="space-y-3">
                  {dayNotes.map((note, index) => (
                    <div
                      key={`${note.timestamp}-${index}`}
                      className="flex items-start gap-3 p-4 rounded-2xl transition-all hover:shadow-sm"
                      style={{ background: "#fafafa", border: "1px solid #f0f0f0" }}
                    >
                      {/* Avatar */}
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
                        style={{ background: "#ffffff" }}
                      >
                        {getAuthorEmoji(note.author)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-sm" style={{ color: "#1d1d1f" }}>
                            Note from {formatAddress(note.author)}
                          </h4>
                          <span className="text-xs flex-shrink-0 px-2 py-1 rounded-full" style={{ 
                            background: "#f0f0f0",
                            color: "#86868b"
                          }}>
                            {formatTimestamp(note.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed break-words" style={{ color: "#6e6e73" }}>
                          {note.message}
                        </p>
                        <p className="text-xs mt-2" style={{ color: "#c7c7cc" }}>
                          {formatTime(note.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Total Count */}
      {notesArray.length > 0 && (
        <div className="mt-8 pt-6 text-center" style={{ borderTop: "1px solid #f0f0f0" }}>
          <p className="text-xs" style={{ color: "#86868b" }}>
            {notesArray.length} note{notesArray.length !== 1 ? 's' : ''} on-chain
          </p>
        </div>
      )}
    </div>
  );
}

