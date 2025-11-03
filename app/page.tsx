"use client";

import { Sidebar } from "@/components/Sidebar";
import { MainContent } from "@/components/MainContent";
import { BottomToolbar } from "@/components/BottomToolbar";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <MainContent />

      {/* Bottom Toolbar */}
      <BottomToolbar />
    </div>
  );
}
