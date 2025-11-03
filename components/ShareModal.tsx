"use client";

import { useState } from "react";

interface ShareModalProps {
  url: string;
  title?: string;
  onClose: () => void;
}

export function ShareModal({ url, title = "Check this out!", onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOptions = [
    {
      name: "Twitter",
      icon: "𝕏",
      color: "bg-black hover:bg-gray-800",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
          "_blank"
        );
      },
    },
    {
      name: "Telegram",
      icon: "✈️",
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
      },
    },
    {
      name: "WhatsApp",
      icon: "💬",
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${title} ${fullUrl}`)}`,
          "_blank"
        );
      },
    },
    {
      name: "Facebook",
      icon: "f",
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
          "_blank"
        );
      },
    },
    {
      name: "LinkedIn",
      icon: "in",
      color: "bg-blue-700 hover:bg-blue-800",
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
          "_blank"
        );
      },
    },
    {
      name: "Reddit",
      icon: "🤖",
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => {
        window.open(
          `https://reddit.com/submit?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`,
          "_blank"
        );
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Share</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-500"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${option.color} text-white`}
            >
              <div className="text-2xl font-bold">{option.icon}</div>
              <span className="text-xs font-medium">{option.name}</span>
            </button>
          ))}
        </div>

        {/* Copy Link */}
        <div className="border-t border-gray-200 pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or copy link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={fullUrl}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
            />
            <button
              onClick={handleCopy}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* QR Code Option */}
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Generate QR Code →
          </button>
        </div>
      </div>
    </div>
  );
}

