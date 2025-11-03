"use client";

import { useAccount } from "wagmi";
import Link from "next/link";

interface Activity {
  id: number;
  type: "note" | "like" | "reply" | "follow" | "tip" | "community" | "badge";
  user: string;
  action: string;
  target?: string;
  timestamp: number;
  noteId?: number;
}

interface ActivityFeedProps {
  userAddress?: string;
  limit?: number;
}

export function ActivityFeed({ userAddress, limit = 10 }: ActivityFeedProps) {
  const { address } = useAccount();

  // Mock activities - in production, fetch from contract events
  const activities: Activity[] = [
    {
      id: 1,
      type: "note",
      user: "0x1234...5678",
      action: "posted a new note",
      timestamp: Date.now() - 300000,
      noteId: 123,
    },
    {
      id: 2,
      type: "like",
      user: "0x9876...4321",
      action: "liked",
      target: "your note about Web3",
      timestamp: Date.now() - 600000,
      noteId: 120,
    },
    {
      id: 3,
      type: "reply",
      user: "0xabcd...efgh",
      action: "replied to",
      target: "your note",
      timestamp: Date.now() - 900000,
      noteId: 118,
    },
    {
      id: 4,
      type: "follow",
      user: "0xijkl...mnop",
      action: "started following you",
      timestamp: Date.now() - 1200000,
    },
    {
      id: 5,
      type: "tip",
      user: "0xqrst...uvwx",
      action: "sent you a tip of 0.001 ETH",
      timestamp: Date.now() - 1500000,
      noteId: 123,
    },
    {
      id: 6,
      type: "community",
      user: "0xyyyy...zzzz",
      action: "joined the DeFi Community",
      timestamp: Date.now() - 1800000,
    },
    {
      id: 7,
      type: "badge",
      user: "system",
      action: "You earned the 'First Note' badge!",
      timestamp: Date.now() - 2100000,
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "note":
        return "📝";
      case "like":
        return "❤️";
      case "reply":
        return "💬";
      case "follow":
        return "👥";
      case "tip":
        return "💰";
      case "community":
        return "🏛️";
      case "badge":
        return "🏆";
      default:
        return "📌";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "note":
        return "bg-blue-100 text-blue-600";
      case "like":
        return "bg-red-100 text-red-600";
      case "reply":
        return "bg-green-100 text-green-600";
      case "follow":
        return "bg-purple-100 text-purple-600";
      case "tip":
        return "bg-yellow-100 text-yellow-600";
      case "community":
        return "bg-indigo-100 text-indigo-600";
      case "badge":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Link href="/notifications" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all →
        </Link>
      </div>

      {/* Activity List */}
      <div className="space-y-2">
        {activities.slice(0, limit).map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
          >
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${getActivityColor(
                activity.type
              )}`}
            >
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-gray-700">
                  {activity.user !== "system" ? (
                    <Link
                      href={`/profile/${activity.user}`}
                      className="font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {activity.user}
                    </Link>
                  ) : (
                    <span className="font-semibold text-gray-900">System</span>
                  )}{" "}
                  {activity.action}
                  {activity.target && (
                    <span className="font-medium"> {activity.target}</span>
                  )}
                </p>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>

              {activity.noteId && (
                <Link
                  href={`/note/${activity.noteId}`}
                  className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block"
                >
                  View note →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity</p>
        </div>
      )}
    </div>
  );
}

