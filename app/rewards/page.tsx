"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

export default function RewardsPage() {
  const { address } = useAccount();
  const [claimAmount, setClaimAmount] = useState("");

  const { data: points } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getRewardPoints",
    args: address ? [address] : undefined,
  });

  const { data: earnings } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTotalEarnings",
    args: address ? [address] : undefined,
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleClaim = () => {
    if (!claimAmount) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "claimRewards",
      args: [BigInt(claimAmount)],
    });
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view rewards</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-2 inline-block text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Rewards Dashboard</h1>
          <p className="text-gray-600 mt-1">Earn points and convert them to ETH</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-purple-100 text-sm mb-2">Available Points</div>
            <div className="text-4xl font-bold mb-4">💎 {Number(points || 0)}</div>
            <div className="text-purple-100 text-sm">
              ≈ {((Number(points || 0) * 1) / 100000).toFixed(6)} ETH
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="text-blue-100 text-sm mb-2">Total Earnings</div>
            <div className="text-4xl font-bold mb-4">
              💰 {((Number(earnings || 0)) / 1e18).toFixed(6)} ETH
            </div>
            <div className="text-blue-100 text-sm">All-time earnings</div>
          </div>
        </div>

        {/* Earn Points Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How to Earn Points</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                📝
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Post a Note</div>
                <div className="text-sm text-gray-600">Earn 10 points</div>
              </div>
              <div className="text-purple-600 font-bold">+10</div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">
                ❤️
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Receive a Like</div>
                <div className="text-sm text-gray-600">Earn 5 points</div>
              </div>
              <div className="text-purple-600 font-bold">+5</div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                💬
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Post a Reply</div>
                <div className="text-sm text-gray-600">Earn 3 points</div>
              </div>
              <div className="text-purple-600 font-bold">+3</div>
            </div>
          </div>
        </div>

        {/* Claim Rewards Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Claim Rewards</h2>
          <p className="text-gray-600 mb-4">
            Convert your points to ETH. Conversion rate: 100,000 points = 1 ETH
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount of Points to Claim
              </label>
              <input
                type="number"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                placeholder="1000"
                max={Number(points || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                You will receive: {((Number(claimAmount || 0) * 1) / 100000).toFixed(6)} ETH
              </p>
            </div>

            {isSuccess && (
              <div className="p-3 bg-green-50 text-green-800 rounded-lg text-sm">
                ✓ Rewards claimed successfully!
              </div>
            )}

            <button
              onClick={handleClaim}
              disabled={!claimAmount || Number(claimAmount) > Number(points || 0) || isPending}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Claiming..." : "Claim Rewards"}
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

