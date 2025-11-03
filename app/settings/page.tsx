"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";
import { parseEther } from "viem";

export default function SettingsPage() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState("profile");

  // Form states
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [subscriptionPrice, setSubscriptionPrice] = useState("");

  const { data: profile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserProfile",
    args: address ? [address] : undefined,
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleUpdateUsername = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "setUsername",
      args: [username],
    });
  };

  const handleUpdateBio = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "setBio",
      args: [bio],
    });
  };

  const handleSetSubscriptionPrice = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "setSubscriptionPrice",
      args: [parseEther(subscriptionPrice || "0")],
    });
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access settings</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-2 sticky top-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("monetization")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                  activeTab === "monetization"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Monetization
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                  activeTab === "privacy"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Privacy
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                  activeTab === "notifications"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Notifications
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      maxLength={30}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max 30 characters</p>
                  </div>

                  <button
                    onClick={handleUpdateUsername}
                    disabled={!username || isPending}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50"
                  >
                    {isPending ? "Updating..." : "Update Username"}
                  </button>

                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      maxLength={160}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max 160 characters</p>
                  </div>

                  <button
                    onClick={handleUpdateBio}
                    disabled={!bio || isPending}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50"
                  >
                    {isPending ? "Updating..." : "Update Bio"}
                  </button>
                </div>

                {isSuccess && (
                  <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm">
                    ✓ Settings updated successfully!
                  </div>
                )}
              </div>
            )}

            {activeTab === "monetization" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Monetization Settings</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subscription Price (ETH per month)
                    </label>
                    <input
                      type="number"
                      value={subscriptionPrice}
                      onChange={(e) => setSubscriptionPrice(e.target.value)}
                      placeholder="0.001"
                      step="0.001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Set to 0 to disable subscriptions
                    </p>
                  </div>

                  <button
                    onClick={handleSetSubscriptionPrice}
                    disabled={isPending}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50"
                  >
                    {isPending ? "Updating..." : "Update Price"}
                  </button>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Premium Account</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Upgrade to premium for exclusive features and a verified badge
                    </p>
                    <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all font-medium">
                      Upgrade to Premium (0.01 ETH)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
                <p className="text-gray-600">
                  Privacy settings are coming soon. All blockchain data is public by default.
                </p>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                <p className="text-gray-600">
                  Notification preferences will be available in a future update.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

