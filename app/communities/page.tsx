"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";
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

export default function CommunitiesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [fee, setFee] = useState("");

  const { data: communities } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getAllCommunities",
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const communitiesArray = (communities as Community[]) || [];

  const handleCreate = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "createCommunity",
      args: [name, description, isPrivate, fee ? parseEther(fee) : 0n],
    });
  };

  if (isSuccess) {
    setTimeout(() => {
      setShowCreateModal(false);
      setName("");
      setDescription("");
      setFee("");
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-blue-600 hover:text-blue-700 mb-2 inline-block text-sm">
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
              <p className="text-gray-600 mt-1">Discover and join communities</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              + Create Community
            </button>
          </div>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communitiesArray.map((community, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              {/* Community Icon */}
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                {community.name[0]?.toUpperCase()}
              </div>

              {/* Community Info */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{community.name}</h3>
                {community.isPrivate && (
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    🔒 Private
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {community.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>👥 {Number(community.memberCount)} members</span>
                {Number(community.subscriptionFee) > 0 && (
                  <span className="font-medium text-blue-600">
                    {(Number(community.subscriptionFee) / 1e18).toFixed(4)} ETH
                  </span>
                )}
              </div>

              {/* Join Button */}
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
                Join Community
              </button>
            </div>
          ))}
        </div>

        {communitiesArray.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-500 text-lg mb-2">No communities yet</p>
            <p className="text-gray-400 text-sm">Be the first to create one!</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Community</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Community Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome Community"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's your community about?"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Fee (ETH)
                </label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="0.001"
                  step="0.001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for free community</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="private" className="text-sm text-gray-700">
                  Make this community private
                </label>
              </div>
            </div>

            {isSuccess && (
              <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm">
                ✓ Community created successfully!
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name || !description || isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

