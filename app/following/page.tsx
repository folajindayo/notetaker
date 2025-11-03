"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

export default function FollowingPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following");

  const { data: following } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getFollowing",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: followers } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getFollowers",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const followingList = (following as string[]) || [];
  const followersList = (followers as string[]) || [];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view connections</p>
        </div>
      </div>
    );
  }

  const currentList = activeTab === "following" ? followingList : followersList;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">👥 Connections</h1>

          {/* Tabs */}
          <div className="flex gap-8 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("following")}
              className={`pb-3 text-sm font-medium relative ${
                activeTab === "following" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Following ({followingList.length})
              {activeTab === "following" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`pb-3 text-sm font-medium relative ${
                activeTab === "followers" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Followers ({followersList.length})
              {activeTab === "followers" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {currentList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="text-6xl mb-4">
              {activeTab === "following" ? "👤" : "👥"}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === "following" ? "Not following anyone yet" : "No followers yet"}
            </h2>
            <p className="text-gray-600 mb-6">
              {activeTab === "following"
                ? "Discover interesting people to follow"
                : "Share your content to gain followers"}
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Explore Feed
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentList.map((userAddress) => (
              <UserCard key={userAddress} address={userAddress} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserCard({ address }: { address: string }) {
  const { data: profile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserProfile",
    args: [address as `0x${string}`],
  });

  const userProfile = profile as any;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Link href={`/profile/${address}`}>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold cursor-pointer hover:scale-105 transition-transform">
            {address[2]?.toUpperCase() || "?"}
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/profile/${address}`}
              className="font-semibold text-gray-900 hover:text-blue-600 truncate"
            >
              {userProfile?.username || `${address.slice(0, 8)}...${address.slice(-6)}`}
            </Link>
            {userProfile?.isVerified && (
              <span className="text-blue-600" title="Verified">
                ✓
              </span>
            )}
            {userProfile?.isPremium && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Premium
              </span>
            )}
          </div>

          {userProfile?.bio && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{userProfile.bio}</p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{Number(userProfile?.totalNotes || 0)} notes</span>
            <span>{Number(userProfile?.followersCount || 0)} followers</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium">
          View Profile
        </button>
      </div>
    </div>
  );
}

