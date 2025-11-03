"use client";

import { useAccount, useChainId, useBlockNumber } from "wagmi";
import { useState, useEffect } from "react";

export function NetworkStatus() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [showDetails, setShowDetails] = useState(false);
  const [blockTime, setBlockTime] = useState<Date>(new Date());

  useEffect(() => {
    setBlockTime(new Date());
  }, [blockNumber]);

  const getNetworkName = (id: number) => {
    const networks: Record<number, string> = {
      1: "Ethereum Mainnet",
      8453: "Base",
      84532: "Base Sepolia",
      11155111: "Sepolia",
      137: "Polygon",
      80001: "Mumbai",
    };
    return networks[id] || `Chain ${id}`;
  };

  const getNetworkColor = (id: number) => {
    if (id === 8453 || id === 84532) return "bg-blue-500";
    if (id === 1) return "bg-gray-800";
    if (id === 137 || id === 80001) return "bg-purple-500";
    return "bg-orange-500";
  };

  const getStatusColor = () => {
    if (!isConnected) return "bg-gray-400";
    return "bg-green-500";
  };

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        <span className="text-xs text-gray-600">Not Connected</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
      >
        {/* Status Indicator */}
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>

        {/* Network Badge */}
        <div className={`px-2 py-0.5 ${getNetworkColor(chainId)} text-white text-xs rounded font-medium`}>
          {getNetworkName(chainId)}
        </div>

        {/* Block Number */}
        <span className="text-xs text-gray-600">
          #{blockNumber?.toString()}
        </span>

        {/* Dropdown Arrow */}
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform ${
            showDetails ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Details Dropdown */}
      {showDetails && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-4 space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Network</div>
              <div className="font-semibold text-gray-900">{getNetworkName(chainId)}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Chain ID</div>
              <div className="font-mono text-sm text-gray-900">{chainId}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Latest Block</div>
              <div className="font-mono text-sm text-gray-900">#{blockNumber?.toString()}</div>
              <div className="text-xs text-gray-400 mt-1">
                {blockTime.toLocaleTimeString()}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Status</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>

            {/* View on Explorer */}
            <div className="pt-3 border-t border-gray-200">
              <a
                href={
                  chainId === 8453
                    ? "https://basescan.org"
                    : chainId === 84532
                    ? "https://sepolia.basescan.org"
                    : `https://etherscan.io`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                View on Block Explorer →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function NetworkBanner() {
  const chainId = useChainId();
  const { isConnected } = useAccount();

  if (!isConnected) return null;

  // Show warning if not on Base or Base Sepolia
  if (chainId !== 8453 && chainId !== 84532) {
    return (
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">
              Wrong Network Detected
            </p>
            <p className="text-xs text-yellow-700">
              Please switch to Base or Base Sepolia to use NoteBoard
            </p>
          </div>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all text-sm font-medium">
            Switch Network
          </button>
        </div>
      </div>
    );
  }

  // Show info banner for testnet
  if (chainId === 84532) {
    return (
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-3 justify-center">
          <span className="text-lg">ℹ️</span>
          <p className="text-sm text-blue-900">
            You're on <span className="font-semibold">Base Sepolia Testnet</span>
          </p>
        </div>
      </div>
    );
  }

  return null;
}

