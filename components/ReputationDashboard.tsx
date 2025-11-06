'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface ReputationScore {
  total: number;
  level: number;
  levelName: string;
  progress: number;
  nextLevelPoints: number;
}

interface ReputationBreakdown {
  category: string;
  points: number;
  maxPoints: number;
  icon: string;
  color: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ReputationDashboardProps {
  address?: string;
}

const LEVELS = [
  { level: 1, name: 'Newbie', minPoints: 0, color: 'gray' },
  { level: 2, name: 'Contributor', minPoints: 100, color: 'blue' },
  { level: 3, name: 'Active Member', minPoints: 500, color: 'green' },
  { level: 4, name: 'Influencer', minPoints: 1500, color: 'purple' },
  { level: 5, name: 'Expert', minPoints: 5000, color: 'orange' },
  { level: 6, name: 'Legend', minPoints: 15000, color: 'gold' },
];

export default function ReputationDashboard({ address: propAddress }: ReputationDashboardProps) {
  const { address: connectedAddress } = useAccount();
  const { t } = useTranslation();
  const address = propAddress || connectedAddress;
  const [reputation, setReputation] = useState<ReputationScore | null>(null);
  const [breakdown, setBreakdown] = useState<ReputationBreakdown[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'achievements'>('overview');

  useEffect(() => {
    // Simulate loading reputation data
    const loadReputationData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const totalPoints = 2340;
      const currentLevel = LEVELS.reduce((prev, curr) =>
        totalPoints >= curr.minPoints ? curr : prev
      );
      const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
      const pointsInCurrentLevel = totalPoints - currentLevel.minPoints;
      const pointsToNextLevel = nextLevel
        ? nextLevel.minPoints - currentLevel.minPoints
        : currentLevel.minPoints;
      const progress = (pointsInCurrentLevel / pointsToNextLevel) * 100;

      setReputation({
        total: totalPoints,
        level: currentLevel.level,
        levelName: currentLevel.name,
        progress: Math.min(progress, 100),
        nextLevelPoints: nextLevel ? nextLevel.minPoints - totalPoints : 0,
      });

      setBreakdown([
        {
          category: 'Content Quality',
          points: 850,
          maxPoints: 5000,
          icon: '✍️',
          color: 'blue',
        },
        {
          category: 'Engagement',
          points: 640,
          maxPoints: 3000,
          icon: '💬',
          color: 'green',
        },
        {
          category: 'Consistency',
          points: 420,
          maxPoints: 2000,
          icon: '📅',
          color: 'purple',
        },
        {
          category: 'Community Help',
          points: 280,
          maxPoints: 2000,
          icon: '🤝',
          color: 'orange',
        },
        {
          category: 'Tips Received',
          points: 150,
          maxPoints: 1000,
          icon: '💎',
          color: 'yellow',
        },
      ]);

      setAchievements([
        {
          id: '1',
          name: 'First Note',
          description: 'Posted your first note',
          icon: '🎉',
          earned: true,
          earnedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
          rarity: 'common',
        },
        {
          id: '2',
          name: 'Century Club',
          description: 'Received 100 likes',
          icon: '💯',
          earned: true,
          earnedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
          rarity: 'rare',
        },
        {
          id: '3',
          name: 'Conversation Starter',
          description: 'Started 10 discussions',
          icon: '💭',
          earned: true,
          earnedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
          rarity: 'rare',
        },
        {
          id: '4',
          name: 'Generous Tipper',
          description: 'Tipped 10 creators',
          icon: '🎁',
          earned: true,
          earnedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
          rarity: 'epic',
        },
        {
          id: '5',
          name: 'Viral Content',
          description: 'Get 1000 views on a single note',
          icon: '🔥',
          earned: false,
          rarity: 'epic',
        },
        {
          id: '6',
          name: 'OG Member',
          description: 'Join in the first 100 users',
          icon: '👑',
          earned: false,
          rarity: 'legendary',
        },
      ]);

      setLoading(false);
    };

    if (address) {
      loadReputationData();
    }
  }, [address]);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    const colors = {
      common: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700',
      rare: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
      epic: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
      legendary: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
    };
    return colors[rarity];
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      pink: 'bg-pink-500',
      gold: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!reputation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">{t('noReputationData')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">{t('reputationScore')}</h2>
            <p className="text-blue-100">
              {t('level')} {reputation.level} - {reputation.levelName}
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{reputation.total.toLocaleString()}</div>
            <p className="text-blue-100 text-sm">{t('totalPoints')}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>{t('progressToNextLevel')}</span>
            <span>
              {reputation.nextLevelPoints > 0
                ? `${reputation.nextLevelPoints} ${t('pointsNeeded')}`
                : t('maxLevel')}
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${reputation.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-6">
          {(['overview', 'breakdown', 'achievements'] as const).map((tab) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('recentAchievements')}
            </h3>
            <div className="space-y-3">
              {achievements
                .filter((a) => a.earned)
                .slice(0, 3)
                .map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <span className="text-3xl">{achievement.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {achievement.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Leaderboard Position */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('leaderboardPosition')}
            </h3>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">#127</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t('outOf')} 10,542 {t('users')}</p>
              <div className="flex justify-center gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">{t('topPercentile')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Top 2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breakdown Tab */}
      {activeTab === 'breakdown' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {t('pointsBreakdown')}
          </h3>
          <div className="space-y-6">
            {breakdown.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.points} / {item.maxPoints}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getColorClass(
                      item.color
                    )}`}
                    style={{ width: `${(item.points / item.maxPoints) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 {t('earnMorePoints')}
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• {t('postQualityContent')}</li>
              <li>• {t('engageWithCommunity')}</li>
              <li>• {t('postConsistently')}</li>
              <li>• {t('helpOthers')}</li>
            </ul>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-6 rounded-xl border-2 transition-all ${
                achievement.earned
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-4xl ${achievement.earned ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getRarityColor(
                    achievement.rarity
                  )}`}
                >
                  {achievement.rarity}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                {achievement.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {achievement.description}
              </p>
              {achievement.earned && achievement.earnedAt && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {t('earned')}:{' '}
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </p>
              )}
              {!achievement.earned && (
                <p className="text-xs text-gray-500 dark:text-gray-500">{t('locked')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

