"use client";

import { WalletConnect } from "@/components/WalletConnect";
import { PostNote } from "@/components/PostNote";
import { NoteFeed } from "@/components/NoteFeed";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#f5f5f7" }}>
      {/* Main Content */}
      <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[1200px] card p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Post Note */}
            <div className="flex flex-col justify-center">
              <PostNote />
            </div>

            {/* Right Column - Note Feed */}
            <div className="flex flex-col">
              <NoteFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
