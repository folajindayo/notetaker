"use client";

import { useAccount, useBalance } from "wagmi";
import { useState } from "react";

export function WalletBalance() {
  const { address, isConnected } = useAccount();
  const [showDetails, setShowDetails] = useState(false);

  const { data: ethBalance } = useBalance({
    address: address,
  });

  if (!isConnected || !address) return null;

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return "0.0000";
    const formatted = Number(balance) / 1e18;
    return formatted.toFixed(4);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
      >
        <span className="text-lg">💰</span>
        <div className="text-left">
          <div className="text-xs opacity-80">Balance</div>
          <div className="font-bold font-mono">{formatBalance(ethBalance?.value)} ETH</div>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDetails && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50">
          <div className="p-4">
            {/* Main Balance */}
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">ETH Balance</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 font-mono">
                  {formatBalance(ethBalance?.value)}
                </span>
                <span className="text-lg text-gray-500">ETH</span>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                ≈ ${(Number(formatBalance(ethBalance?.value)) * 2000).toFixed(2)} USD
              </div>
            </div>

            {/* Wallet Address */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Wallet Address</div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm text-gray-900 truncate">
                  {address.slice(0, 10)}...{address.slice(-8)}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(address)}
                  className="p-1.5 hover:bg-gray-200 rounded transition-all"
                  title="Copy address"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <a
                href={`https://bridge.base.org`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-center text-sm font-medium"
              >
                Bridge to Base →
              </a>
              <a
                href={`https://app.uniswap.org`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all text-center text-sm font-medium"
              >
                Buy ETH on Uniswap →
              </a>
            </div>

            {/* Network Fee Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                💡 Tip: Keep some ETH for gas fees to interact with the platform
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function QuickBalance() {
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });

  if (!isConnected) return null;

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return "0.00";
    const formatted = Number(balance) / 1e18;
    return formatted.toFixed(2);
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
      <span>💰</span>
      <span className="font-mono">{formatBalance(ethBalance?.value)} ETH</span>
    </div>
  );
}

