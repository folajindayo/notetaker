"use client";

import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("all");

  const { data: stats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPlatformStats",
  });

  const platformStats = stats as [bigint, bigint, bigint] | undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-2 inline-block text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-1">Top contributors on the platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-gray-600 text-sm mb-1">Total Users</div>
            <div className="text-3xl font-bold text-gray-900">
              {platformStats ? Number(platformStats[0]).toLocaleString() : "0"}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-gray-600 text-sm mb-1">Total Notes</div>
            <div className="text-3xl font-bold text-gray-900">
              {platformStats ? Number(platformStats[1]).toLocaleString() : "0"}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-gray-600 text-sm mb-1">Total Replies</div>
            <div className="text-3xl font-bold text-gray-900">
              {platformStats ? Number(platformStats[2]).toLocaleString() : "0"}
            </div>
          </div>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPeriod("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === "month"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod("week")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === "week"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            This Week
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Likes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Sample data - in production, fetch from contract */}
              {[1, 2, 3, 4, 5].map((rank) => (
                <tr key={rank} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {rank === 1 && <span className="text-2xl mr-2">🥇</span>}
                      {rank === 2 && <span className="text-2xl mr-2">🥈</span>}
                      {rank === 3 && <span className="text-2xl mr-2">🥉</span>}
                      <span className="text-sm font-medium text-gray-900">#{rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        U
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          User #{rank}
                        </div>
                        <div className="text-sm text-gray-500">0x1234...5678</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
                      💎 {1000 * (6 - rank)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {50 * (6 - rank)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {200 * (6 - rank)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

