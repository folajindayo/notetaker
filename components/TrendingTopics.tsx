"use client";

import Link from "next/link";

interface TrendingTopic {
  tag: string;
  count: number;
  trend: "up" | "down" | "stable";
  change?: number;
}

export function TrendingTopics() {
  // Mock data - in production, fetch from contract events/indexer
  const topics: TrendingTopic[] = [
    { tag: "defi", count: 1234, trend: "up", change: 23 },
    { tag: "nft", count: 987, trend: "up", change: 15 },
    { tag: "dao", count: 756, trend: "stable" },
    { tag: "web3", count: 654, trend: "down", change: -8 },
    { tag: "ethereum", count: 543, trend: "up", change: 42 },
    { tag: "base", count: 432, trend: "up", change: 35 },
    { tag: "crypto", count: 398, trend: "stable" },
    { tag: "blockchain", count: 321, trend: "up", change: 18 },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <span className="text-green-500">↗</span>;
      case "down":
        return <span className="text-red-500">↘</span>;
      default:
        return <span className="text-gray-400">→</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🔥</span>
        <span>Trending Topics</span>
      </h3>

      <div className="space-y-3">
        {topics.map((topic, index) => (
          <Link
            key={topic.tag}
            href={`/tags/${topic.tag}`}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm font-bold text-gray-400 w-5">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 truncate">
                  #{topic.tag}
                </p>
                <p className="text-xs text-gray-500">{topic.count.toLocaleString()} posts</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {topic.change !== undefined && (
                <span
                  className={`text-xs font-medium ${
                    topic.trend === "up"
                      ? "text-green-600"
                      : topic.trend === "down"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {topic.change > 0 ? "+" : ""}
                  {topic.change}%
                </span>
              )}
              {getTrendIcon(topic.trend)}
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/trending"
        className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        View all trending →
      </Link>
    </div>
  );
}

export function TrendingTopicsCompact() {
  const topics = [
    { tag: "defi", count: 1234 },
    { tag: "nft", count: 987 },
    { tag: "dao", count: 756 },
    { tag: "web3", count: 654 },
    { tag: "base", count: 432 },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="font-semibold text-gray-900 mb-3 text-sm">🔥 Trending</h4>
      <div className="space-y-2">
        {topics.map((topic) => (
          <Link
            key={topic.tag}
            href={`/tags/${topic.tag}`}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-all"
          >
            <span className="text-sm font-medium text-gray-900">#{topic.tag}</span>
            <span className="text-xs text-gray-500">{topic.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

