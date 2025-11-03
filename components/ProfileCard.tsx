"use client";

import Link from "next/link";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import { useState } from "react";

interface ProfileCardProps {
  address: string;
  showActions?: boolean;
  compact?: boolean;
}

export function ProfileCard({ address, showActions = true, compact = false }: ProfileCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: profile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserProfile",
    args: [address as `0x${string}`],
  });

  const { writeContract, isPending } = useWriteContract();

  const userProfile = profile as any;

  const handleFollow = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "followUser",
      args: [address as `0x${string}`],
    });
    setIsFollowing(true);
  };

  const handleUnfollow = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "unfollowUser",
      args: [address as `0x${string}`],
    });
    setIsFollowing(false);
  };

  if (compact) {
    return (
      <Link
        href={`/profile/${address}`}
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
          {userProfile?.username?.[0]?.toUpperCase() || address[2]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-gray-900 truncate">
              {userProfile?.username || `${address.slice(0, 8)}...`}
            </p>
            {userProfile?.isVerified && <span className="text-blue-600">✓</span>}
          </div>
          <p className="text-sm text-gray-500 truncate">{address}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all">
      {/* Cover/Header */}
      <div className="h-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>

      {/* Profile Content */}
      <div className="p-4 -mt-12">
        {/* Avatar */}
        <Link href={`/profile/${address}`}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white cursor-pointer hover:scale-105 transition-transform">
            {userProfile?.username?.[0]?.toUpperCase() || address[2]?.toUpperCase()}
          </div>
        </Link>

        {/* User Info */}
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/profile/${address}`}
              className="text-lg font-bold text-gray-900 hover:text-blue-600"
            >
              {userProfile?.username || `User ${address.slice(0, 8)}`}
            </Link>
            {userProfile?.isVerified && (
              <span className="text-blue-600" title="Verified">
                ✓
              </span>
            )}
            {userProfile?.isPremium && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                Premium
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-2">{address.slice(0, 10)}...{address.slice(-8)}</p>

          {userProfile?.bio && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{userProfile.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-4 text-sm mb-4">
            <div>
              <span className="font-bold text-gray-900">{Number(userProfile?.totalNotes || 0)}</span>
              <span className="text-gray-600 ml-1">Notes</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">{Number(userProfile?.followersCount || 0)}</span>
              <span className="text-gray-600 ml-1">Followers</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">{Number(userProfile?.followingCount || 0)}</span>
              <span className="text-gray-600 ml-1">Following</span>
            </div>
          </div>

          {/* Badges Preview */}
          {userProfile?.totalNotes > 0 && (
            <div className="flex gap-1 mb-4">
              <span className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                🎯
              </span>
              {Number(userProfile?.totalNotes) >= 10 && (
                <span className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                  📝
                </span>
              )}
              {userProfile?.isPremium && (
                <span className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                  👑
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2">
              {isFollowing ? (
                <button
                  onClick={handleUnfollow}
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm disabled:opacity-50"
                >
                  Following
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm disabled:opacity-50"
                >
                  Follow
                </button>
              )}
              <Link
                href={`/profile/${address}`}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm text-center"
              >
                View Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden animate-pulse">
      <div className="h-24 bg-gray-200"></div>
      <div className="p-4 -mt-12">
        <div className="w-20 h-20 rounded-full bg-gray-300 border-4 border-white"></div>
        <div className="mt-3 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

