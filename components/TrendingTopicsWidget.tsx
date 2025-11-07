'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';

interface TrendingTopic {
  id: string;
  tag: string;
  count: number;
  growth: number; // Percentage growth
  category: string;
  trendScore: number;
  recentNotes: {
    id: string;
    content: string;
    author: string;
    likes: number;
  }[];
}

interface TrendingTopicsWidgetProps {
  limit?: number;
  compact?: boolean;
}

export default function TrendingTopicsWidget({
  limit = 10,
  compact = false,
}: TrendingTopicsWidgetProps) {
  const { t } = useTranslation();
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'web3' | 'defi' | 'nft' | 'community'>('all');
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock trending algorithm: score = (mentions * 0.4) + (growth * 0.3) + (engagement * 0.3)
      const mockTopics: TrendingTopic[] = [
        {
          id: '1',
          tag: 'base',
          count: 2847,
          growth: 156.3,
          category: 'web3',
          trendScore: 98.5,
          recentNotes: [
            {
              id: 'n1',
              content: 'Just deployed my first dApp on @base! The speed is incredible 🚀',
              author: '0x1234...5678',
              likes: 234,
            },
          ],
        },
        {
          id: '2',
          tag: 'defi',
          count: 1923,
          growth: 89.7,
          category: 'defi',
          trendScore: 87.2,
          recentNotes: [
            {
              id: 'n2',
              content: 'New DeFi protocol launching on Base next week! 💎',
              author: '0x9876...5432',
              likes: 189,
            },
          ],
        },
        {
          id: '3',
          tag: 'nft',
          count: 1654,
          growth: 67.4,
          category: 'nft',
          trendScore: 78.9,
          recentNotes: [
            {
              id: 'n3',
              content: 'The NFT market is heating up again! 🔥',
              author: '0xabcd...efgh',
              likes: 156,
            },
          ],
        },
        {
          id: '4',
          tag: 'web3social',
          count: 1432,
          growth: 124.8,
          category: 'web3',
          trendScore: 76.5,
          recentNotes: [
            {
              id: 'n4',
              content: 'Web3 social is the future of online communities',
              author: '0x2222...3333',
              likes: 203,
            },
          ],
        },
        {
          id: '5',
          tag: 'ethereum',
          count: 1287,
          growth: 45.2,
          category: 'web3',
          trendScore: 72.1,
          recentNotes: [
            {
              id: 'n5',
              content: 'ETH hitting new milestones every day ⚡',
              author: '0x4444...5555',
              likes: 178,
            },
          ],
        },
        {
          id: '6',
          tag: 'daos',
          count: 1156,
          growth: 98.3,
          category: 'community',
          trendScore: 69.8,
          recentNotes: [
            {
              id: 'n6',
              content: 'DAOs are revolutionizing how we organize',
              author: '0x6666...7777',
              likes: 145,
            },
          ],
        },
        {
          id: '7',
          tag: 'staking',
          count: 1043,
          growth: 54.7,
          category: 'defi',
          trendScore: 65.4,
          recentNotes: [
            {
              id: 'n7',
              content: 'New staking rewards are live! 💰',
              author: '0x8888...9999',
              likes: 132,
            },
          ],
        },
        {
          id: '8',
          tag: 'layer2',
          count: 967,
          growth: 112.5,
          category: 'web3',
          trendScore: 63.2,
          recentNotes: [
            {
              id: 'n8',
              content: 'Layer 2 solutions are game changers',
              author: '0xaaaa...bbbb',
              likes: 119,
            },
          ],
        },
        {
          id: '9',
          tag: 'metaverse',
          count: 854,
          growth: 34.1,
          category: 'nft',
          trendScore: 58.7,
          recentNotes: [
            {
              id: 'n9',
              content: 'Building in the metaverse is so exciting! 🌐',
              author: '0xcccc...dddd',
              likes: 98,
            },
          ],
        },
        {
          id: '10',
          tag: 'airdrop',
          count: 743,
          growth: 187.9,
          category: 'community',
          trendScore: 56.3,
          recentNotes: [
            {
              id: 'n10',
              content: 'Just got a massive airdrop! 🎁',
              author: '0xeeee...ffff',
              likes: 267,
            },
          ],
        },
      ];

      const filtered =
        categoryFilter === 'all'
          ? mockTopics
          : mockTopics.filter((t) => t.category === categoryFilter);

      setTopics(filtered.slice(0, limit));
      setLoading(false);
    };

    fetchTrendingTopics();
    const interval = setInterval(fetchTrendingTopics, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timeRange, categoryFilter, limit]);

  const getRankBadge = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      web3: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
      defi: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
      nft: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
      community: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
    };
    return colors[category as keyof typeof colors] || colors.web3;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            {t('trending')}
          </h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="1h">1h</option>
            <option value="24h">24h</option>
            <option value="7d">7d</option>
          </select>
        </div>
        <div className="space-y-2">
          {topics.slice(0, 5).map((topic, index) => (
            <Link
              key={topic.id}
              href={`/tags/${topic.tag}`}
              className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getRankBadge(index)}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    #{topic.tag}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {topic.count.toLocaleString()} {t('mentions')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  +{topic.growth.toFixed(0)}%
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            {t('trendingTopics')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('discoverWhatsPop ular')}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">{t('allCategories')}</option>
            <option value="web3">Web3</option>
            <option value="defi">DeFi</option>
            <option value="nft">NFT</option>
            <option value="community">{t('community')}</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="1h">{t('lastHour')}</option>
            <option value="24h">{t('last24Hours')}</option>
            <option value="7d">{t('last7Days')}</option>
          </select>
        </div>
      </div>

      {/* Trending Topics List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getRankBadge(index)}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    #{topic.tag}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(topic.category)}`}>
                    {topic.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {topic.trendScore.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('trendScore')}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('mentions')}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {topic.count.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('growth')}</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  +{topic.growth.toFixed(1)}%
                </p>
              </div>
            </div>

            {topic.recentNotes[0] && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                  {topic.recentNotes[0].content}
                </p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{topic.recentNotes[0].author}</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {topic.recentNotes[0].likes}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                #{selectedTopic.tag}
              </h3>
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('mentions')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedTopic.count.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('growth')}</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{selectedTopic.growth.toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('trendScore')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedTopic.trendScore.toFixed(1)}
                </p>
              </div>
            </div>

            <Link
              href={`/tags/${selectedTopic.tag}`}
              className="block w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-center"
            >
              {t('viewAllPosts')} #{selectedTopic.tag}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

