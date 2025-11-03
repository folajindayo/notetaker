"use client";

import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";

export default function AnalyticsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">📊 Analytics</h1>
          <p className="text-gray-600 mt-1">Platform insights and statistics</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="text-blue-100 text-sm mb-2">Total Users</div>
            <div className="text-4xl font-bold mb-2">
              {platformStats ? Number(platformStats[0]).toLocaleString() : "0"}
            </div>
            <div className="text-blue-100 text-sm">+12.5% from last month</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-purple-100 text-sm mb-2">Total Notes</div>
            <div className="text-4xl font-bold mb-2">
              {platformStats ? Number(platformStats[1]).toLocaleString() : "0"}
            </div>
            <div className="text-purple-100 text-sm">+24.3% from last month</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="text-green-100 text-sm mb-2">Total Replies</div>
            <div className="text-4xl font-bold mb-2">
              {platformStats ? Number(platformStats[2]).toLocaleString() : "0"}
            </div>
            <div className="text-green-100 text-sm">+18.7% from last month</div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Engagement Rate</h2>
            <div className="h-48 flex items-end justify-around gap-2">
              {[65, 72, 68, 85, 92, 88, 95].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Top Categories</h2>
            <div className="space-y-4">
              {[
                { name: "DeFi", count: 1234, percentage: 35 },
                { name: "NFTs", count: 987, percentage: 28 },
                { name: "DAOs", count: 654, percentage: 19 },
                { name: "Gaming", count: 432, percentage: 12 },
                { name: "Other", count: 210, percentage: 6 },
              ].map((category, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{category.name}</span>
                    <span className="text-gray-500">{category.count} notes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Activity Timeline</h2>
          <div className="space-y-4">
            {[
              { time: "2 hours ago", event: "New milestone: 10,000 notes posted!", icon: "🎉" },
              { time: "5 hours ago", event: "100 new users joined today", icon: "👥" },
              { time: "8 hours ago", event: "Trending: #Web3 hashtag", icon: "🔥" },
              { time: "12 hours ago", event: "New community created: DeFi Enthusiasts", icon: "🏆" },
              { time: "1 day ago", event: "Platform upgrade deployed", icon: "⚡" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-all">
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{item.event}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

