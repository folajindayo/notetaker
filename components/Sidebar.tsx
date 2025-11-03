"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { isConnected, address } = useAccount();

  return (
    <aside className="w-[280px] flex-shrink-0 flex flex-col border-r border-gray-200 bg-gray-50">
      {/* Mac Window Controls */}
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {/* Primary Items */}
        <div className="mb-6">
          <Link href="/" className={`sidebar-item ${pathname === "/" ? "active" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18"/>
            </svg>
            <span>All Notes</span>
          </Link>

          <Link href="/communities" className={`sidebar-item ${pathname === "/communities" ? "active" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Communities</span>
          </Link>

          <Link href="/leaderboard" className={`sidebar-item ${pathname === "/leaderboard" ? "active" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>Leaderboard</span>
          </Link>

          <Link href="/rewards" className={`sidebar-item ${pathname === "/rewards" ? "active" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7"/>
              <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
            </svg>
            <span>Rewards</span>
          </Link>

          {isConnected && address && (
            <Link 
              href={`/profile/${address}`} 
              className={`sidebar-item ${pathname.includes("/profile/") ? "active" : ""}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>My Profile</span>
            </Link>
          )}
        </div>

        {/* Networks Section */}
        <div className="mb-6">
          <div className="px-4 mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Networks
            </h3>
          </div>
          
          <div 
            className={`sidebar-item ${activeItem === "base-sepolia" ? "active" : ""}`}
            onClick={() => setActiveItem("base-sepolia")}
          >
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Base Sepolia</span>
          </div>

          <div className="sidebar-item opacity-50 cursor-not-allowed">
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
            <span>Base Mainnet</span>
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <div className="px-4 mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Stats
            </h3>
          </div>
          
          <div className="sidebar-item cursor-default hover:bg-transparent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className="text-gray-600">Total Notes</span>
          </div>

          <div className="sidebar-item cursor-default hover:bg-transparent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span className="text-gray-600">Contributors</span>
          </div>
        </div>
      </nav>

      {/* Add Note Button */}
      <div className="p-4">
        <button className="btn-fab mx-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      {/* Toggle (like in image) */}
      <div className="px-4 pb-4 flex justify-center">
        <div className="w-10 h-6 rounded-full bg-gray-300 relative cursor-pointer">
          <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5 shadow"></div>
        </div>
      </div>
    </aside>
  );
}

