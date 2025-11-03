"use client";

import Link from "next/link";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import { parseEther } from "viem";

interface Community {
  name: string;
  description: string;
  creator: string;
  memberCount: bigint;
  createdAt: bigint;
  isPrivate: boolean;
  subscriptionFee: bigint;
}

interface CommunityCardProps {
  community: Community;
  communityId: number;
  isMember?: boolean;
}

export function CommunityCard({ community, communityId, isMember = false }: CommunityCardProps) {
  const { writeContract, isPending } = useWriteContract();

  const handleJoin = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "joinCommunity",
      args: [BigInt(communityId)],
      value: community.subscriptionFee,
    });
  };

  const getCommunityIcon = () => {
    const firstChar = community.name[0]?.toUpperCase() || "C";
    const colors = [
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
      "from-pink-400 to-pink-600",
      "from-green-400 to-green-600",
      "from-yellow-400 to-yellow-600",
      "from-red-400 to-red-600",
    ];
    const colorIndex = communityId % colors.length;
    return { char: firstChar, color: colors[colorIndex] };
  };

  const icon = getCommunityIcon();

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all overflow-hidden">
      {/* Header Banner */}
      <div className={`h-20 bg-gradient-to-r ${icon.color}`}></div>

      {/* Content */}
      <div className="p-5 -mt-10">
        {/* Community Icon */}
        <div
          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${icon.color} flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg`}
        >
          {icon.char}
        </div>

        {/* Community Info */}
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{community.name}</h3>
            {community.isPrivate && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                🔒 Private
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
            {community.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-900 font-semibold">
                {Number(community.memberCount).toLocaleString()}
              </span>
              <span className="text-gray-500">
                {Number(community.memberCount) === 1 ? "member" : "members"}
              </span>
            </div>
            {Number(community.subscriptionFee) > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-blue-600 font-semibold">
                  {(Number(community.subscriptionFee) / 1e18).toFixed(4)} ETH
                </span>
                <span className="text-gray-500 text-xs">to join</span>
              </div>
            )}
          </div>

          {/* Creator */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
            <span className="text-xs text-gray-500">Created by</span>
            <Link
              href={`/profile/${community.creator}`}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium truncate"
            >
              {community.creator.slice(0, 8)}...{community.creator.slice(-6)}
            </Link>
          </div>

          {/* Action Button */}
          {isMember ? (
            <Link
              href={`/communities/${communityId}`}
              className="block w-full px-4 py-3 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              View Community
            </Link>
          ) : (
            <button
              onClick={handleJoin}
              disabled={isPending}
              className={`w-full px-4 py-3 text-white text-center rounded-lg transition-all font-medium disabled:opacity-50 ${
                Number(community.subscriptionFee) > 0
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPending
                ? "Joining..."
                : Number(community.subscriptionFee) > 0
                ? `Join for ${(Number(community.subscriptionFee) / 1e18).toFixed(4)} ETH`
                : "Join Community"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommunityCardCompact({ community, communityId }: { community: Community; communityId: number }) {
  const icon = community.name[0]?.toUpperCase() || "C";

  return (
    <Link
      href={`/communities/${communityId}`}
      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-900 truncate">{community.name}</h4>
          {community.isPrivate && <span className="text-xs">🔒</span>}
        </div>
        <p className="text-xs text-gray-500">
          {Number(community.memberCount)} members
          {Number(community.subscriptionFee) > 0 && (
            <span className="ml-2">• {(Number(community.subscriptionFee) / 1e18).toFixed(3)} ETH</span>
          )}
        </p>
      </div>
    </Link>
  );
}

