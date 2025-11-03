"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { NoteFeed } from "./NoteFeed";
import { WalletConnect } from "./WalletConnect";

export function MainContent() {
  const [activeTab, setActiveTab] = useState("notes");
  const [activeFilter, setActiveFilter] = useState("all");
  const { isConnected } = useAccount();

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-gray-900">
              On-Chain Notes
            </h1>
            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600 font-medium">
              BASE
            </span>
          </div>

          <WalletConnect />
        </div>

        {/* Tabs & Filters */}
        <div className="flex items-center justify-between">
          {/* Tabs */}
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("notes")}
              className={`pb-2 text-sm font-medium transition-all relative ${
                activeTab === "notes"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-2">
                Notes
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">
                  10
                </span>
              </span>
              {activeTab === "notes" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab("authors")}
              className={`pb-2 text-sm font-medium transition-all ${
                activeTab === "authors"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Authors
            </button>

            <button
              onClick={() => setActiveTab("activity")}
              className={`pb-2 text-sm font-medium transition-all ${
                activeTab === "activity"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Activity
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("1h")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === "1h"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              1h
            </button>
            <button
              onClick={() => setActiveFilter("24h")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === "24h"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setActiveFilter("week")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === "week"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isConnected ? (
          <NoteFeed />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <svg 
                  width="64" 
                  height="64" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  className="mx-auto text-gray-400"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Connect Your Wallet
              </h3>
              <p className="text-sm mb-6 text-gray-600">
                Connect your wallet to view and post notes on the Base blockchain
              </p>
              <WalletConnect />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

