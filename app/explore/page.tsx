"use client";

import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: recentNotes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getRecentNotes",
    args: [20n],
  });

  const { data: trendingNotes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTrendingNotes",
    args: [10n],
  });

  const { data: communities } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getAllCommunities",
  });

  const notes = (recentNotes as any[]) || [];
  const trending = (trendingNotes as any[]) || [];
  const communitiesList = (communities as any[]) || [];

  const popularTags = [
    { name: "defi", count: 1234 },
    { name: "nfts", count: 987 },
    { name: "dao", count: 756 },
    { name: "web3", count: 654 },
    { name: "ethereum", count: 543 },
    { name: "bitcoin", count: 432 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-2 inline-block text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">🌍 Explore</h1>
          <p className="text-gray-600 mt-1">Discover trending content, communities, and topics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">🔥 Trending Now</h2>
                <Link href="/trending" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  See all →
                </Link>
              </div>

              <div className="space-y-3">
                {trending.slice(0, 5).map((note, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                    <div className="flex items-start gap-3">
                      <span className="text-xl font-bold text-gray-400">#{index + 1}</span>
                      <div className="flex-1">
                        <p className="text-gray-900 line-clamp-2">{note.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>❤️ {Number(note.likes)}</span>
                          <span>💬 {Number(note.replyCount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📁 Categories</h2>
              
              <div className="flex gap-2 mb-4 flex-wrap">
                {["all", "defi", "nfts", "gaming", "dao", "dev"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {notes.slice(0, 4).map((note, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-all">
                    <p className="text-sm text-gray-900 line-clamp-3 mb-2">{note.message}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>❤️ {Number(note.likes)}</span>
                      <span>💬 {Number(note.replyCount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">🏷️ Popular Tags</h2>
              <div className="space-y-2">
                {popularTags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/search?tag=${tag.name}`}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-all group"
                  >
                    <span className="text-blue-600 font-medium group-hover:text-blue-700">
                      #{tag.name}
                    </span>
                    <span className="text-sm text-gray-500">{tag.count.toLocaleString()} posts</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Communities */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">👥 Communities</h2>
                <Link href="/communities" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  See all →
                </Link>
              </div>

              <div className="space-y-3">
                {communitiesList.slice(0, 5).map((community, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-all">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {community.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{community.name}</p>
                      <p className="text-xs text-gray-500">{Number(community.memberCount)} members</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Users */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">✨ Suggested Users</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                      U{i}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">User {i}</p>
                      <p className="text-xs text-gray-500">@0x1234...{i}678</p>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

