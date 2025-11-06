'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

interface AnalyticsData {
  views: number;
  likes: number;
  replies: number;
  shares: number;
  bookmarks: number;
  tips: number;
  tipAmount: string;
  engagementRate: number;
  viewHistory: { date: string; views: number }[];
  topReferrers: { source: string; count: number }[];
  audienceLocations: { country: string; percentage: number }[];
}

interface ContentAnalyticsProps {
  contentId: string;
  authorAddress?: string;
}

export default function ContentAnalytics({ contentId, authorAddress }: ContentAnalyticsProps) {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'audience'>('overview');

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchAnalytics = async () => {
      setLoading(true);
      // In production, fetch from your analytics API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setAnalyticsData({
        views: 12543,
        likes: 892,
        replies: 156,
        shares: 234,
        bookmarks: 445,
        tips: 23,
        tipAmount: '0.45',
        engagementRate: 14.2,
        viewHistory: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          views: Math.floor(Math.random() * 500) + 200,
        })),
        topReferrers: [
          { source: 'Twitter', count: 4521 },
          { source: 'Direct', count: 3210 },
          { source: 'Discord', count: 2104 },
          { source: 'Telegram', count: 1843 },
          { source: 'Other', count: 865 },
        ],
        audienceLocations: [
          { country: 'United States', percentage: 32 },
          { country: 'United Kingdom', percentage: 18 },
          { country: 'Canada', percentage: 12 },
          { country: 'Germany', percentage: 10 },
          { country: 'Others', percentage: 28 },
        ],
      });
      setLoading(false);
    };

    fetchAnalytics();
  }, [contentId, timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">{t('noAnalyticsData')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('contentAnalytics')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('trackYourContentPerformance')}
          </p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range === 'all' ? t('allTime') : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-6">
          {(['overview', 'engagement', 'audience'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t(tab)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('views')}</span>
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.views.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12.5% ↑</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('likes')}</span>
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.likes.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8.3% ↑</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('replies')}</span>
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.replies.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+15.7% ↑</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('tips')}</span>
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.tipAmount} ETH
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {analyticsData.tips} {t('tips')}
              </p>
            </div>
          </div>

          {/* Views Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('viewsOverTime')}
            </h3>
            <div className="h-64 flex items-end justify-between gap-1">
              {analyticsData.viewHistory.slice(-14).map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="w-full relative">
                    <div
                      className="bg-blue-500 hover:bg-blue-600 rounded-t transition-all cursor-pointer"
                      style={{
                        height: `${(day.views / 500) * 200}px`,
                        minHeight: '4px',
                      }}
                      title={`${day.date}: ${day.views} views`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.views}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Engagement Tab */}
      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('engagementMetrics')}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('engagementRate')}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {analyticsData.engagementRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.engagementRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('likeRate')}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {((analyticsData.likes / analyticsData.views) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(analyticsData.likes / analyticsData.views) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('commentRate')}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {((analyticsData.replies / analyticsData.views) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(analyticsData.replies / analyticsData.views) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('shareRate')}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {((analyticsData.shares / analyticsData.views) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(analyticsData.shares / analyticsData.views) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Referrers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('topReferrers')}
            </h3>
            <div className="space-y-3">
              {analyticsData.topReferrers.map((referrer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {index + 1}.
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {referrer.source}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {referrer.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Audience Tab */}
      {activeTab === 'audience' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('audienceLocations')}
            </h3>
            <div className="space-y-4">
              {analyticsData.audienceLocations.map((location, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {location.country}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {location.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

