import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base, baseSepolia } from "@reown/appkit/networks";
import { QueryClient } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

// Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

if (!projectId) {
  console.warn("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set");
}

// Create wagmiAdapter
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [baseSepolia, base],
});

// Create modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [baseSepolia, base],
  projectId,
  features: {
    analytics: true,
  },
  metadata: {
    name: "On-Chain Note Board",
    description: "Post and read messages on the blockchain",
    url: "https://noteboarddapp.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
});

export const config = wagmiAdapter.wagmiConfig;

export const queryClient = new QueryClient();

