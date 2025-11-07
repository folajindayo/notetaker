'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface User {
  address: string;
  username?: string;
  avatar?: string;
  bio?: string;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isFollower: boolean;
  mutualFollowers: number;
}

interface Connection {
  address: string;
  type: 'follower' | 'following' | 'mutual';
  since: number;
}

interface SocialGraphProps {
  address: string;
  compact?: boolean;
}

export default function SocialGraph({ address, compact = false }: SocialGraphProps) {
  const { address: connectedAddress } = useAccount();
  const { t } = useTranslation();
  const [userData, setUserData] = useState<User | null>(null);
  const [connections, setConnections] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'mutual'>('followers');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'alphabetical'>('recent');

  const isOwnProfile = connectedAddress?.toLowerCase() === address.toLowerCase();

  useEffect(() => {
    const loadSocialData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      setUserData({
        address,
        username: 'CryptoEnthusiast',
        avatar: '/api/placeholder/100/100',
        bio: 'Web3 builder | NFT collector | DeFi enthusiast',
        followerCount: 1247,
        followingCount: 532,
        isFollowing: false,
        isFollower: false,
        mutualFollowers: 89,
      });

      // Mock connections
      const mockConnections: User[] = Array.from({ length: 20 }, (_, i) => ({
        address: `0x${Math.random().toString(16).slice(2, 42)}`,
        username: `User${i + 1}`,
        avatar: '/api/placeholder/50/50',
        bio: 'Web3 enthusiast',
        followerCount: Math.floor(Math.random() * 1000),
        followingCount: Math.floor(Math.random() * 500),
        isFollowing: Math.random() > 0.5,
        isFollower: Math.random() > 0.5,
        mutualFollowers: Math.floor(Math.random() * 50),
      }));

      setConnections(mockConnections);
      setLoading(false);
    };

    loadSocialData();
  }, [address]);

  const handleFollow = async (targetAddress: string) => {
    // Implement follow logic
    setConnections((prev) =>
      prev.map((user) =>
        user.address === targetAddress ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  };

  const filteredConnections = connections
    .filter((user) => {
      const matchesSearch =
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeTab === 'followers'
          ? user.isFollower
          : activeTab === 'following'
          ? user.isFollowing
          : user.isFollowing && user.isFollower;

      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.followerCount - a.followerCount;
        case 'alphabetical':
          return (a.username || a.address).localeCompare(b.username || b.address);
        case 'recent':
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">{t('noDataAvailable')}</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('connections')}
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {userData.followerCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('followers')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {userData.followingCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('following')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {userData.mutualFollowers}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('mutual')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-4">{t('socialGraph')}</h2>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('followers')}
            className={`p-4 rounded-xl transition-all ${
              activeTab === 'followers'
                ? 'bg-white/20 backdrop-blur-sm'
                : 'hover:bg-white/10'
            }`}
          >
            <div className="text-3xl font-bold">{userData.followerCount}</div>
            <div className="text-sm text-blue-100">{t('followers')}</div>
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`p-4 rounded-xl transition-all ${
              activeTab === 'following'
                ? 'bg-white/20 backdrop-blur-sm'
                : 'hover:bg-white/10'
            }`}
          >
            <div className="text-3xl font-bold">{userData.followingCount}</div>
            <div className="text-sm text-blue-100">{t('following')}</div>
          </button>
          <button
            onClick={() => setActiveTab('mutual')}
            className={`p-4 rounded-xl transition-all ${
              activeTab === 'mutual' ? 'bg-white/20 backdrop-blur-sm' : 'hover:bg-white/10'
            }`}
          >
            <div className="text-3xl font-bold">{userData.mutualFollowers}</div>
            <div className="text-sm text-blue-100">{t('mutual')}</div>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t('searchConnections')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="recent">{t('recent')}</option>
          <option value="popular">{t('mostPopular')}</option>
          <option value="alphabetical">{t('alphabetical')}</option>
        </select>
      </div>

      {/* Connections List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {filteredConnections.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">{t('noConnectionsFound')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredConnections.map((user) => (
              <div
                key={user.address}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt={user.username || user.address}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {user.username || user.address.slice(0, 10) + '...'}
                      </h4>
                      {user.isFollowing && user.isFollower && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                          {t('mutual')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.bio}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-500">
                      <span>{user.followerCount} {t('followers')}</span>
                      <span>·</span>
                      <span>{user.followingCount} {t('following')}</span>
                      {user.mutualFollowers > 0 && (
                        <>
                          <span>·</span>
                          <span>{user.mutualFollowers} {t('mutualConnections')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollow(user.address)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      user.isFollowing
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {user.isFollowing ? t('unfollow') : t('follow')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Network Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t('networkInsights')}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('followRatio')}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {(userData.followerCount / Math.max(userData.followingCount, 1)).toFixed(2)}x
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('engagementScore')}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">8.4/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('networkGrowth')}
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                +12.5%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t('suggestedConnections')}
          </h3>
          <div className="space-y-2">
            {connections.slice(0, 3).map((user) => (
              <div key={user.address} className="flex items-center gap-2">
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.mutualFollowers} {t('mutual')}
                  </p>
                </div>
                <button className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                  {t('follow')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

