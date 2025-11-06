'use client';

import { useState, useMemo } from 'react';

interface PlatformStats {
  totalUsers: number;
  totalNotes: number;
  totalCommunities: number;
  totalRewards: string;
  activeUsers24h: number;
  activeUsers7d: number;
  activeUsers30d: number;
  totalLikes: number;
  totalReplies: number;
  totalReposts: number;
  avgNotesPerUser: number;
  avgEngagementRate: number;
}

interface GrowthData {
  date: string;
  users: number;
  notes: number;
  engagement: number;
}

interface AdvancedStatsDashboardProps {
  stats: PlatformStats;
  growthData?: GrowthData[];
  topUsers?: Array<{ address: string; notes: number; engagement: number }>;
  topCommunities?: Array<{ name: string; members: number; activity: number }>;
}

export default function AdvancedStatsDashboard({
  stats,
  growthData = [],
  topUsers = [],
  topCommunities = [],
}: AdvancedStatsDashboardProps) {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [chartType, setChartType] = useState<'users' | 'notes' | 'engagement'>('users');

  // Calculate growth percentages
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Get active users based on timeframe
  const activeUsers = useMemo(() => {
    switch (timeframe) {
      case '24h':
        return stats.activeUsers24h;
      case '7d':
        return stats.activeUsers7d;
      case '30d':
        return stats.activeUsers30d;
      default:
        return stats.totalUsers;
    }
  }, [timeframe, stats]);

  // Stats cards configuration
  const mainStats = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      growth: calculateGrowth(stats.totalUsers, stats.totalUsers * 0.9),
    },
    {
      title: 'Total Notes',
      value: stats.totalNotes.toLocaleString(),
      icon: '📝',
      color: 'from-green-500 to-green-600',
      growth: calculateGrowth(stats.totalNotes, stats.totalNotes * 0.85),
    },
    {
      title: 'Communities',
      value: stats.totalCommunities.toLocaleString(),
      icon: '🏘️',
      color: 'from-purple-500 to-purple-600',
      growth: calculateGrowth(stats.totalCommunities, stats.totalCommunities * 0.95),
    },
    {
      title: 'Total Rewards',
      value: `${stats.totalRewards} ETH`,
      icon: '💰',
      color: 'from-yellow-500 to-yellow-600',
      growth: calculateGrowth(parseFloat(stats.totalRewards), parseFloat(stats.totalRewards) * 0.8),
    },
  ];

  const engagementStats = [
    {
      title: 'Total Likes',
      value: stats.totalLikes.toLocaleString(),
      icon: '❤️',
    },
    {
      title: 'Total Replies',
      value: stats.totalReplies.toLocaleString(),
      icon: '💬',
    },
    {
      title: 'Total Reposts',
      value: stats.totalReposts.toLocaleString(),
      icon: '🔄',
    },
    {
      title: 'Avg Engagement',
      value: `${stats.avgEngagementRate.toFixed(1)}%`,
      icon: '📊',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">📊 Analytics Dashboard</h1>
            <p className="text-blue-100">
              Comprehensive platform statistics and insights
            </p>
          </div>
          
          {/* Timeframe Selector */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 flex space-x-1">
            {(['24h', '7d', '30d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {tf === 'all' ? 'All Time' : tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}
              >
                {stat.icon}
              </div>
              {stat.growth !== undefined && (
                <div
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    stat.growth >= 0
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}
                >
                  {stat.growth >= 0 ? '↑' : '↓'} {Math.abs(stat.growth).toFixed(1)}%
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Active Users Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🔥 Active Users
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stats.activeUsers24h.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Last 24 Hours
            </div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              {stats.activeUsers7d.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Last 7 Days
            </div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {stats.activeUsers30d.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Last 30 Days
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          💫 Engagement Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {engagementStats.map((stat) => (
            <div
              key={stat.title}
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {stat.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            📈 Average Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">
                Notes per User
              </span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.avgNotesPerUser.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">
                Engagement Rate
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.avgEngagementRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">
                Users per Community
              </span>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(stats.totalUsers / Math.max(stats.totalCommunities, 1)).toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Growth Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              📊 Growth Trends
            </h2>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="users">Users</option>
              <option value="notes">Notes</option>
              <option value="engagement">Engagement</option>
            </select>
          </div>
          <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-sm">
                Growth chart visualization
                <br />
                <span className="text-xs">
                  (Integrate with charting library like Chart.js)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Users & Communities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Users */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🏆 Top Contributors
          </h2>
          {topUsers.length > 0 ? (
            <div className="space-y-3">
              {topUsers.slice(0, 5).map((user, index) => (
                <div
                  key={user.address}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? 'bg-yellow-500 text-white'
                        : index === 1
                        ? 'bg-gray-400 text-white'
                        : index === 2
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-sm text-gray-900 dark:text-white">
                      {user.address.slice(0, 8)}...{user.address.slice(-6)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {user.notes} notes • {user.engagement}% engagement
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Top Communities */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🏘️ Top Communities
          </h2>
          {topCommunities.length > 0 ? (
            <div className="space-y-3">
              {topCommunities.slice(0, 5).map((community, index) => (
                <div
                  key={community.name}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? 'bg-yellow-500 text-white'
                        : index === 1
                        ? 'bg-gray-400 text-white'
                        : index === 2
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {community.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {community.members} members • {community.activity} activity
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              📥 Export Data
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download platform statistics for analysis
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

