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
      <div className="flex flex-wrap items-center gap-3">
        <div className="px-5 py-3 rounded-2xl" style={{ background: "#f5f5f7", border: "1px solid #e5e5e7" }}>
          <span className="font-mono text-sm" style={{ color: "#1d1d1f" }}>
            {formatAddress(address)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="btn-secondary text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="btn-primary"
    >
      Connect Wallet
    </button>
  );
}

