"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";

export function WalletConnect() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div 
          className="px-4 py-2 rounded-lg text-sm font-mono"
          style={{ 
            background: "var(--blue-light)", 
            color: "var(--blue-primary)",
            border: "1px solid var(--blue-primary)"
          }}
        >
          {formatAddress(address)}
        </div>
        <button
          onClick={() => disconnect()}
          className="btn-icon"
          title="Disconnect"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="px-6 py-2 rounded-lg text-sm font-medium"
      style={{
        background: "var(--blue-primary)",
        color: "white"
      }}
    >
      Connect Wallet
    </button>
  );
}

