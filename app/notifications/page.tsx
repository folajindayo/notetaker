"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

interface Notification {
  id: number;
  type: "like" | "reply" | "follow" | "mention" | "tip" | "badge";
  from: string;
  message: string;
  timestamp: number;
  read: boolean;
  noteId?: number;
}

export default function NotificationsPage() {
  const { address, isConnected } = useAccount();
  const [filter, setFilter] = useState("all");

  // Mock notifications - in production, fetch from contract events
  const notifications: Notification[] = [
    {
      id: 1,
      type: "like",
      from: "0x1234...5678",
      message: "liked your note",
      timestamp: Date.now() - 3600000,
      read: false,
      noteId: 42,
    },
    {
      id: 2,
      type: "reply",
      from: "0x9876...4321",
      message: "replied to your note",
      timestamp: Date.now() - 7200000,
      read: false,
      noteId: 38,
    },
    {
      id: 3,
      type: "follow",
      from: "0xabcd...efgh",
      message: "started following you",
      timestamp: Date.now() - 10800000,
      read: true,
    },
    {
      id: 4,
      type: "mention",
      from: "0xijkl...mnop",
      message: "mentioned you in a note",
      timestamp: Date.now() - 14400000,
      read: true,
      noteId: 55,
    },
    {
      id: 5,
      type: "tip",
      from: "0xqrst...uvwx",
      message: "sent you a tip of 0.001 ETH",
      timestamp: Date.now() - 18000000,
      read: true,
      noteId: 42,
    },
    {
      id: 6,
      type: "badge",
      from: "system",
      message: "You earned the '100 Notes' badge!",
      timestamp: Date.now() - 21600000,
      read: true,
    },
  ];

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return "❤️";
      case "reply":
        return "💬";
      case "follow":
        return "👥";
      case "mention":
        return "💭";
      case "tip":
        return "💰";
      case "badge":
        return "🏆";
      default:
        return "🔔";
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view notifications</p>
        </div>
      </div>
    );
  }

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-2 inline-block text-sm">
            ← Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🔔 Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-gray-600 mt-1">{unreadCount} unread notifications</p>
              )}
            </div>
            <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Mark all as read
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            onClick={() => setFilter("like")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === "like"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            ❤️ Likes
          </button>
          <button
            onClick={() => setFilter("reply")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === "reply"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            💬 Replies
          </button>
          <button
            onClick={() => setFilter("follow")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === "follow"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            👥 Follows
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <div className="text-6xl mb-4">🔔</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h2>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                  notification.read
                    ? "bg-white border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-3xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {notification.from !== "system" ? (
                          <Link
                            href={`/profile/${notification.from}`}
                            className="font-semibold text-gray-900 hover:text-blue-600"
                          >
                            {notification.from}
                          </Link>
                        ) : (
                          <span className="font-semibold text-gray-900">System</span>
                        )}
                        <span className="text-gray-700 ml-2">{notification.message}</span>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      {notification.noteId && (
                        <Link
                          href={`/note/${notification.noteId}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View note →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

