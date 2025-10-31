"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("all-notes");
  const { isConnected } = useAccount();

  return (
    <aside 
      className="w-[280px] flex-shrink-0 flex flex-col border-r"
      style={{ 
        background: "var(--bg-sidebar)", 
        borderColor: "var(--border-light)" 
      }}
    >
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
          <div 
            className={`sidebar-item ${activeItem === "all-notes" ? "active" : ""}`}
            onClick={() => setActiveItem("all-notes")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18"/>
            </svg>
            <span>All Notes</span>
          </div>

          <div 
            className={`sidebar-item ${activeItem === "today" ? "active" : ""}`}
            onClick={() => setActiveItem("today")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span>Today</span>
          </div>

          <div 
            className={`sidebar-item ${activeItem === "my-notes" ? "active" : ""}`}
            onClick={() => setActiveItem("my-notes")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>My Notes</span>
          </div>

          <div 
            className={`sidebar-item ${activeItem === "starred" ? "active" : ""}`}
            onClick={() => setActiveItem("starred")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>Starred</span>
          </div>
        </div>

        {/* Networks Section */}
        <div className="mb-6">
          <div className="px-4 mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
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
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Stats
            </h3>
          </div>
          
          <div className="sidebar-item cursor-default hover:bg-transparent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span style={{ color: "var(--text-secondary)" }}>Total Notes</span>
          </div>

          <div className="sidebar-item cursor-default hover:bg-transparent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span style={{ color: "var(--text-secondary)" }}>Contributors</span>
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
