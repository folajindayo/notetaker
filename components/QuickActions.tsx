"use client";

import { useState } from "react";
import Link from "next/link";

interface QuickActionsProps {
  onPostNote?: () => void;
  onCreatePoll?: () => void;
  onCreateCommunity?: () => void;
}

export function QuickActions({
  onPostNote,
  onCreatePoll,
  onCreateCommunity,
}: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: "📝",
      label: "Post Note",
      description: "Share your thoughts",
      color: "bg-blue-500",
      action: onPostNote,
    },
    {
      icon: "📊",
      label: "Create Poll",
      description: "Ask your audience",
      color: "bg-green-500",
      action: onCreatePoll,
    },
    {
      icon: "👥",
      label: "New Community",
      description: "Build a group",
      color: "bg-purple-500",
      action: onCreateCommunity,
    },
    {
      icon: "📸",
      label: "Share Media",
      description: "Upload image/video",
      color: "bg-pink-500",
      href: "/",
    },
    {
      icon: "💰",
      label: "Send Tip",
      description: "Support creators",
      color: "bg-yellow-500",
      href: "/",
    },
    {
      icon: "🏆",
      label: "Claim Rewards",
      description: "Convert points to ETH",
      color: "bg-orange-500",
      href: "/rewards",
    },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center justify-center ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Actions Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Action Items */}
            <div className="absolute bottom-20 right-0 space-y-3 w-64">
              {actions.map((action, index) => (
                <div
                  key={index}
                  className="animate-in slide-in-from-bottom"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {action.href ? (
                    <Link
                      href={action.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 group"
                    >
                      <div
                        className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
                      >
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{action.label}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        action.action?.();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 group"
                    >
                      <div
                        className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
                      >
                        {action.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-900">{action.label}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export function QuickActionsBar() {
  return (
    <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
      <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all text-sm font-medium text-gray-700">
        <span>📝</span>
        <span>Note</span>
      </button>
      <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all text-sm font-medium text-gray-700">
        <span>📊</span>
        <span>Poll</span>
      </button>
      <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all text-sm font-medium text-gray-700">
        <span>📸</span>
        <span>Media</span>
      </button>
      <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all text-sm font-medium text-gray-700">
        <span>👥</span>
        <span>Community</span>
      </button>
    </div>
  );
}

