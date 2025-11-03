"use client";

import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

export default function TrendingPage() {
  const [period, setPeriod] = useState("24h");
  const [category, setCategory] = useState("all");

  const { data: trendingNotes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTrendingNotes",
    args: [20n],
  });

  const notes = (trendingNotes as any[]) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-2 inline-block text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">🔥 Trending</h1>
          <p className="text-gray-600 mt-1">Discover what's popular on NoteBoard</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700 mr-2">Period:</span>
              <div className="inline-flex gap-2">
                <button
                  onClick={() => setPeriod("1h")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    period === "1h"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  1 Hour
                </button>
                <button
                  onClick={() => setPeriod("24h")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    period === "24h"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  24 Hours
                </button>
                <button
                  onClick={() => setPeriod("7d")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    period === "7d"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  7 Days
                </button>
              </div>
            </div>

            <div className="border-l border-gray-200 pl-4">
              <span className="text-sm font-medium text-gray-700 mr-2">Category:</span>
              <div className="inline-flex gap-2">
                <button
                  onClick={() => setCategory("all")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    category === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setCategory("tech")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    category === "tech"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tech
                </button>
                <button
                  onClick={() => setCategory("defi")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    category === "defi"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  DeFi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Notes */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No trending notes yet</h2>
              <p className="text-gray-600">Check back later for popular content</p>
            </div>
          ) : (
            notes.map((note, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Rank */}
                  <div className="text-center min-w-[60px]">
                    <div className="text-3xl font-bold text-gray-300">#{index + 1}</div>
                    {index === 0 && <div className="text-2xl">🥇</div>}
                    {index === 1 && <div className="text-2xl">🥈</div>}
                    {index === 2 && <div className="text-2xl">🥉</div>}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Link
                      href={`/profile/${note.author}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 mb-2 inline-block"
                    >
                      {note.author.slice(0, 10)}...{note.author.slice(-8)}
                    </Link>
                    <p className="text-gray-900 text-lg mb-3">{note.message}</p>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">❤️</span>
                        <span className="font-semibold text-gray-900">
                          {Number(note.likes).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💬</span>
                        <span className="font-semibold text-gray-900">
                          {Number(note.replyCount).toLocaleString()}
                        </span>
                      </div>
                      {Number(note.repostCount) > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🔁</span>
                          <span className="font-semibold text-gray-900">
                            {Number(note.repostCount).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex gap-2 ml-auto">
                          {note.tags.slice(0, 3).map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

