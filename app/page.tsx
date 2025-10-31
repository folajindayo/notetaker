"use client";

import { WalletConnect } from "@/components/WalletConnect";
import { PostNote } from "@/components/PostNote";
import { NoteFeed } from "@/components/NoteFeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📝</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                On-Chain Note Board
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Post messages on Base blockchain
              </p>
            </div>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Post Note */}
          <div className="lg:sticky lg:top-24 h-fit">
            <PostNote />
          </div>

          {/* Right Column - Note Feed */}
          <div>
            <NoteFeed />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Built with Next.js, wagmi, viem, and Reown AppKit</p>
          <p className="mt-2">Deployed on Base Network</p>
        </div>
      </footer>
    </div>
  );
}
