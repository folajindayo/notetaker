"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

export default function AdminPage() {
  const { address } = useAccount();
  const [selectedUser, setSelectedUser] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const { data: isOwner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getOwner",
  });

  const { data: isModerator } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "isModerator",
    args: address ? [address] : undefined,
  });

  const { data: stats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPlatformStats",
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const platformStats = stats as [bigint, bigint, bigint] | undefined;
  const hasPermission = address?.toLowerCase() === (isOwner as string)?.toLowerCase() || isModerator;

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access admin panel</p>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleVerifyUser = () => {
    if (!selectedUser) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "verifyUser",
      args: [selectedUser as `0x${string}`],
    });
  };

  const handleAddModerator = () => {
    if (!selectedUser) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "addModerator",
      args: [selectedUser as `0x${string}`],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-white/80 hover:text-white mb-2 inline-block text-sm">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-white/80 mt-1">
                {address?.toLowerCase() === (isOwner as string)?.toLowerCase()
                  ? "Owner"
                  : "Moderator"}{" "}
                Panel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex gap-4 p-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "users"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "content"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Content Moderation
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {platformStats ? Number(platformStats[0]).toLocaleString() : "0"}
                    </p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Notes</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {platformStats ? Number(platformStats[1]).toLocaleString() : "0"}
                    </p>
                  </div>
                  <div className="text-4xl">📝</div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Replies</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {platformStats ? Number(platformStats[2]).toLocaleString() : "0"}
                    </p>
                  </div>
                  <div className="text-4xl">💬</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { action: "User registered", user: "0x1234...5678", time: "2 min ago", icon: "👤" },
                  { action: "Note posted", user: "0x9876...4321", time: "5 min ago", icon: "📝" },
                  { action: "Community created", user: "0xabcd...efgh", time: "12 min ago", icon: "🏛️" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.user}</p>
                    </div>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">User Actions</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Address
                  </label>
                  <input
                    type="text"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleVerifyUser}
                    disabled={!selectedUser || isPending}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium disabled:opacity-50"
                  >
                    ✓ Verify User
                  </button>

                  {address?.toLowerCase() === (isOwner as string)?.toLowerCase() && (
                    <button
                      onClick={handleAddModerator}
                      disabled={!selectedUser || isPending}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium disabled:opacity-50"
                    >
                      👑 Add Moderator
                    </button>
                  )}
                </div>

                {isSuccess && (
                  <div className="p-3 bg-green-50 text-green-800 rounded-lg text-sm">
                    ✓ Action completed successfully!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Moderation Tab */}
        {activeTab === "content" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Content Moderation</h2>
            <p className="text-gray-600">Reported content will appear here for review.</p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Settings</h2>
            <p className="text-gray-600">Platform configuration options.</p>
          </div>
        )}
      </div>
    </div>
  );
}

