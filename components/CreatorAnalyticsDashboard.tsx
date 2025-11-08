'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

/**
 * CreatorAnalyticsDashboard - Comprehensive analytics dashboard for content creators
 * Provides detailed insights into content performance, audience engagement, and monetization
 */

interface AnalyticsData {
  overview: {
    totalNotes: number;
    totalViews: number;
    totalLikes: number;
    totalReplies: number;
    totalEarnings: number;
    growthRate: number;
  };
  engagement: {
    avgLikesPerPost: number;
    avgRepliesPerPost: number;
    engagementRate: number;
    bestPerformingTag: string;
    peakActivityHour: number;
  };
  audience: {
    totalFollowers: number;
    newFollowersThisWeek: number;
    followerGrowthRate: number;
    topEngagedFollowers: string[];
    audienceRetention: number;
  };
  monetization: {
    totalTips: number;
    totalSubscribers: number;
    subscriptionRevenue: number;
    avgTipAmount: number;
    topTippers: string[];
  };
  content: {
    mostLikedNote: any;
    mostRepliedNote: any;
    trendingTags: string[];
    contentTypes: { [key: string]: number };
  };
}

export default function CreatorAnalyticsDashboard() {
  const { address } = useAccount();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'audience' | 'monetization' | 'content'>('overview');
  const [loading, setLoading] = useState(true);

  // Fetch user's notes
  const { data: userNotes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getNotesByAuthor',
    args: address ? [address] : undefined,
  });

  // Fetch user profile
  const { data: userProfile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserProfile',
    args: address ? [address] : undefined,
  });

  // Calculate analytics
  useEffect(() => {
    if (!userNotes || !Array.isArray(userNotes) || !address) {
      setLoading(false);
      return;
    }

    const calculateAnalytics = () => {
      const notes = userNotes as any[];
      const now = Date.now() / 1000;
      
      // Filter notes by time range
      let filteredNotes = notes;
      if (timeRange !== 'all') {
        const days = parseInt(timeRange);
        const cutoff = now - (days * 24 * 60 * 60);
        filteredNotes = notes.filter(note => Number(note.timestamp) > cutoff);
      }

      // Calculate overview metrics
      const totalNotes = filteredNotes.length;
      const totalLikes = filteredNotes.reduce((sum, note) => sum + Number(note.likesCount), 0);
      const totalReplies = filteredNotes.reduce((sum, note) => sum + Number(note.repliesCount), 0);
      const totalViews = filteredNotes.reduce((sum, note) => sum + (note.views || 0), 0);

      // Calculate engagement metrics
      const avgLikesPerPost = totalNotes > 0 ? totalLikes / totalNotes : 0;
      const avgRepliesPerPost = totalNotes > 0 ? totalReplies / totalNotes : 0;
      const engagementRate = totalNotes > 0 ? ((totalLikes + totalReplies) / totalNotes) : 0;

      // Find best performing tag
      const tagCounts: { [key: string]: { count: number; engagement: number } } = {};
      filteredNotes.forEach(note => {
        note.tags?.forEach((tag: string) => {
          if (tag) {
            if (!tagCounts[tag]) {
              tagCounts[tag] = { count: 0, engagement: 0 };
            }
            tagCounts[tag].count++;
            tagCounts[tag].engagement += Number(note.likesCount) + Number(note.repliesCount);
          }
        });
      });

      const bestPerformingTag = Object.entries(tagCounts)
        .sort((a, b) => b[1].engagement - a[1].engagement)[0]?.[0] || 'N/A';

      // Calculate peak activity hour
      const hourCounts: { [key: number]: number } = {};
      filteredNotes.forEach(note => {
        const hour = new Date(Number(note.timestamp) * 1000).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
      const peakActivityHour = Object.entries(hourCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 0;

      // Find most liked and replied notes
      const mostLikedNote = [...filteredNotes].sort((a, b) => Number(b.likesCount) - Number(a.likesCount))[0];
      const mostRepliedNote = [...filteredNotes].sort((a, b) => Number(b.repliesCount) - Number(a.repliesCount))[0];

      // Get trending tags
      const trendingTags = Object.entries(tagCounts)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([tag]) => tag);

      const analyticsData: AnalyticsData = {
        overview: {
          totalNotes,
          totalViews,
          totalLikes,
          totalReplies,
          totalEarnings: 0, // Would be calculated from blockchain data
          growthRate: 12.5, // Mock data
        },
        engagement: {
          avgLikesPerPost,
          avgRepliesPerPost,
          engagementRate,
          bestPerformingTag,
          peakActivityHour: Number(peakActivityHour),
        },
        audience: {
          totalFollowers: 0, // Would come from user profile
          newFollowersThisWeek: 0,
          followerGrowthRate: 8.3,
          topEngagedFollowers: [],
          audienceRetention: 85.2,
        },
        monetization: {
          totalTips: 0,
          totalSubscribers: 0,
          subscriptionRevenue: 0,
          avgTipAmount: 0,
          topTippers: [],
        },
        content: {
          mostLikedNote,
          mostRepliedNote,
          trendingTags,
          contentTypes: {
            'Text Only': filteredNotes.filter(n => !n.mediaHash).length,
            'With Media': filteredNotes.filter(n => n.mediaHash).length,
            'With Poll': filteredNotes.filter(n => n.hasPoll).length,
          },
        },
      };

      setAnalytics(analyticsData);
      setLoading(false);
    };

    calculateAnalytics();
  }, [userNotes, address, timeRange]);

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Please connect your wallet to access creator analytics
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Creator Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights into your content performance and audience
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {range === 'all' ? 'All Time' : `Last ${range}`}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📥 Export Report
          </button>
        </div>

        {/* Overview Stats */}
        {analytics && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="text-3xl font-bold">{analytics.overview.totalNotes}</div>
                <div className="text-sm opacity-90">Total Posts</div>
                <div className="text-xs mt-1">+{analytics.overview.growthRate}% this period</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="text-3xl font-bold">{analytics.overview.totalLikes}</div>
                <div className="text-sm opacity-90">Total Likes</div>
                <div className="text-xs mt-1">{analytics.engagement.avgLikesPerPost.toFixed(1)} avg/post</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="text-3xl font-bold">{analytics.overview.totalReplies}</div>
                <div className="text-sm opacity-90">Total Replies</div>
                <div className="text-xs mt-1">{analytics.engagement.avgRepliesPerPost.toFixed(1)} avg/post</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                <div className="text-3xl font-bold">{analytics.overview.totalViews}</div>
                <div className="text-sm opacity-90">Total Views</div>
                <div className="text-xs mt-1">Impression metric</div>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-white">
                <div className="text-3xl font-bold">{analytics.engagement.engagementRate.toFixed(1)}%</div>
                <div className="text-sm opacity-90">Engagement Rate</div>
                <div className="text-xs mt-1">Likes + Replies</div>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-4 text-white">
                <div className="text-3xl font-bold">0.00</div>
                <div className="text-sm opacity-90">Total Earnings</div>
                <div className="text-xs mt-1">ETH equivalent</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                {(['overview', 'engagement', 'audience', 'monetization', 'content'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Areas */}
            <div className="space-y-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      📈 Performance Trends
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Content Output</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {analytics.overview.totalNotes} posts
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min((analytics.overview.totalNotes / 50) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Engagement</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {analytics.engagement.engagementRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min(analytics.engagement.engagementRate, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Audience Growth</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            +{analytics.audience.followerGrowthRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${Math.min(analytics.audience.followerGrowthRate * 5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      🎯 Quick Insights
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="text-2xl">🏆</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Best Tag</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            #{analytics.engagement.bestPerformingTag}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-2xl">⏰</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Peak Hour</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {analytics.engagement.peakActivityHour}:00 - Best time to post
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <span className="text-2xl">📊</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Retention</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {analytics.audience.audienceRetention}% audience retention
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Engagement Tab */}
              {activeTab === 'engagement' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      💬 Engagement Metrics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Avg Likes per Post</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total engagement metric</div>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {analytics.engagement.avgLikesPerPost.toFixed(1)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Avg Replies per Post</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Conversation starter</div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {analytics.engagement.avgRepliesPerPost.toFixed(1)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Engagement Rate</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Combined metric</div>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {analytics.engagement.engagementRate.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      📅 Activity Pattern
                    </h3>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                      <div className="text-center mb-4">
                        <div className="text-5xl font-bold text-blue-600">
                          {analytics.engagement.peakActivityHour}:00
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Your peak posting hour
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Your audience is most active at this time. Schedule your important posts during this window for maximum engagement.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      🔥 Top Performing Content
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analytics.content.mostLikedNote && (
                        <div className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">❤️</span>
                            <span className="font-medium text-gray-900 dark:text-white">Most Liked</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {analytics.content.mostLikedNote.message}
                          </p>
                          <div className="text-sm font-bold text-blue-600">
                            {Number(analytics.content.mostLikedNote.likesCount)} likes
                          </div>
                        </div>
                      )}
                      {analytics.content.mostRepliedNote && (
                        <div className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">💬</span>
                            <span className="font-medium text-gray-900 dark:text-white">Most Discussed</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {analytics.content.mostRepliedNote.message}
                          </p>
                          <div className="text-sm font-bold text-green-600">
                            {Number(analytics.content.mostRepliedNote.repliesCount)} replies
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      🏷️ Trending Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analytics.content.trendingTags.map((tag, index) => (
                        <span
                          key={tag}
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            index === 0 ? 'bg-blue-600 text-white' :
                            index === 1 ? 'bg-green-600 text-white' :
                            index === 2 ? 'bg-purple-600 text-white' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      📊 Content Distribution
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.content.contentTypes).map(([type, count]) => (
                        <div key={type}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{type}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {count} ({analytics.overview.totalNotes > 0 ? ((count / analytics.overview.totalNotes) * 100).toFixed(1) : 0}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${analytics.overview.totalNotes > 0 ? (count / analytics.overview.totalNotes) * 100 : 0}%`
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Audience Tab */}
              {activeTab === 'audience' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    👥 Audience Insights
                  </h3>
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      Audience data will be available once you have followers
                    </p>
                  </div>
                </div>
              )}

              {/* Monetization Tab */}
              {activeTab === 'monetization' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    💰 Monetization Overview
                  </h3>
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      Start earning by enabling tips and subscriptions!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

