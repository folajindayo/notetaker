"use client";

import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";

interface UserStatsProps {
  address: string;
}

export function UserStats({ address }: UserStatsProps) {
  const { data: profile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserProfile",
    args: [address as `0x${string}`],
  });

  const { data: points } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getRewardPoints",
    args: [address as `0x${string}`],
  });

  const { data: earnings } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTotalEarnings",
    args: [address as `0x${string}`],
  });

  const { data: badges } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserBadges",
    args: [address as `0x${string}`],
  });

  const userProfile = profile as any;
  const userBadges = (badges as string[]) || [];

  if (!userProfile?.exists) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-center">No profile data available</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Notes",
      value: Number(userProfile.totalNotes),
      icon: "📝",
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Likes",
      value: Number(userProfile.totalLikes),
      icon: "❤️",
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Followers",
      value: Number(userProfile.followersCount),
      icon: "👥",
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Following",
      value: Number(userProfile.followingCount),
      icon: "➕",
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Points",
      value: Number(points || 0),
      icon: "💎",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Streak",
      value: Number(userProfile.streakDays),
      icon: "🔥",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-2xl mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Earnings Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-green-100 text-sm mb-1">Total Earnings</div>
            <div className="text-3xl font-bold">
              {((Number(earnings || 0)) / 1e18).toFixed(6)} ETH
            </div>
          </div>
          <div className="text-5xl">💰</div>
        </div>
        <Link
          href="/rewards"
          className="mt-4 inline-block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all"
        >
          View Rewards →
        </Link>
      </div>

      {/* Badges */}
      {userBadges.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Badges ({userBadges.length})</h3>
          <div className="grid grid-cols-2 gap-3">
            {userBadges.slice(0, 6).map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
              >
                <span className="text-2xl">🏅</span>
                <span className="text-sm font-medium text-blue-900 truncate">{badge}</span>
              </div>
            ))}
          </div>
          {userBadges.length > 6 && (
            <Link
              href={`/profile/${address}`}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium block text-center"
            >
              View all {userBadges.length} badges →
            </Link>
          )}
        </div>
      )}

      {/* Account Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <span className="font-medium text-gray-900">Verified</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              userProfile.isVerified
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}>
              {userProfile.isVerified ? "Yes" : "No"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <span className="font-medium text-gray-900">Premium</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              userProfile.isPremium
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-600"
            }`}>
              {userProfile.isPremium ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <span className="font-medium text-gray-900">Joined</span>
            </div>
            <span className="text-sm text-gray-600">
              {new Date(Number(userProfile.joinDate) * 1000).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

