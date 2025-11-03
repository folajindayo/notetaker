"use client";

import { use } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import { useState } from "react";
import Link from "next/link";

interface UserProfile {
  username: string;
  bio: string;
  avatarIpfsHash: string;
  totalNotes: bigint;
  totalLikes: bigint;
  followersCount: bigint;
  followingCount: bigint;
  exists: boolean;
  isPremium: boolean;
  isVerified: boolean;
  joinDate: bigint;
  lastActive: bigint;
  streakDays: bigint;
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = use(params);
  const { address: currentUser } = useAccount();
  const [activeTab, setActiveTab] = useState("notes");

  const { data: profile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserProfile",
    args: [address as `0x${string}`],
  });

  const { data: badges } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserBadges",
    args: [address as `0x${string}`],
  });

  const { data: notes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getNotesByAuthor",
    args: [address as `0x${string}`],
  });

  const { data: rewardPoints } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getRewardPoints",
    args: [address as `0x${string}`],
  });

  const userProfile = profile as UserProfile | undefined;
  const userBadges = (badges as string[]) || [];
  const userNotes = (notes as any[]) || [];

  if (!userProfile?.exists) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-4">This user hasn't created a profile yet.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Feed
          </Link>

          <div className="flex items-start gap-6 mt-4">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              {userProfile.username?.[0]?.toUpperCase() || "?"}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {userProfile.username || `User ${address.slice(0, 8)}`}
                </h1>
                {userProfile.isVerified && (
                  <span className="text-blue-600" title="Verified">✓</span>
                )}
                {userProfile.isPremium && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                    Premium
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-1">{address}</p>
              {userProfile.bio && (
                <p className="text-gray-700 mb-3">{userProfile.bio}</p>
              )}

              {/* Stats */}
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-semibold text-gray-900">
                    {Number(userProfile.totalNotes)}
                  </span>
                  <span className="text-gray-600 ml-1">Notes</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    {Number(userProfile.followersCount)}
                  </span>
                  <span className="text-gray-600 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    {Number(userProfile.followingCount)}
                  </span>
                  <span className="text-gray-600 ml-1">Following</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    {Number(userProfile.streakDays)}
                  </span>
                  <span className="text-gray-600 ml-1">Day Streak 🔥</span>
                </div>
              </div>

              {/* Points */}
              <div className="mt-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
                  💎 {Number(rewardPoints || 0)} Points
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {currentUser && currentUser.toLowerCase() !== address.toLowerCase() && (
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium">
                  Follow
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium">
                  Message
                </button>
              </div>
            )}
          </div>

          {/* Badges */}
          {userBadges.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Badges</h3>
              <div className="flex flex-wrap gap-2">
                {userBadges.map((badge, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                  >
                    🏆 {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-8 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("notes")}
              className={`pb-3 text-sm font-medium relative ${
                activeTab === "notes"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Notes
              {activeTab === "notes" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("replies")}
              className={`pb-3 text-sm font-medium relative ${
                activeTab === "replies"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Replies
              {activeTab === "replies" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`pb-3 text-sm font-medium relative ${
                activeTab === "media"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Media
              {activeTab === "media" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === "notes" && (
          <div className="space-y-4">
            {userNotes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No notes yet
              </div>
            ) : (
              userNotes.map((note, i) => (
                <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-900">{note.message}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>❤️ {Number(note.likes)}</span>
                    <span>💬 {Number(note.replyCount)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

