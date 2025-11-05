'use client';

import { useState } from 'react';
import { Trophy, Star, Award, Zap, Target, Crown, Shield, Flame, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: number;
  reward?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  onClaim?: (id: string) => void;
}

export default function AchievementCard({ achievement, onClaim }: AchievementCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: {
        bg: 'from-gray-400 to-gray-600',
        border: 'border-gray-400',
        glow: 'shadow-gray-500/50',
        text: 'text-gray-700 dark:text-gray-300',
      },
      rare: {
        bg: 'from-blue-400 to-blue-600',
        border: 'border-blue-400',
        glow: 'shadow-blue-500/50',
        text: 'text-blue-700 dark:text-blue-300',
      },
      epic: {
        bg: 'from-purple-400 to-purple-600',
        border: 'border-purple-400',
        glow: 'shadow-purple-500/50',
        text: 'text-purple-700 dark:text-purple-300',
      },
      legendary: {
        bg: 'from-yellow-400 to-orange-600',
        border: 'border-yellow-400',
        glow: 'shadow-yellow-500/50',
        text: 'text-yellow-700 dark:text-yellow-300',
      },
    };
    return colors[rarity as keyof typeof colors];
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const Icon = achievement.icon;
  const colors = getRarityColor(achievement.rarity);
  const progressPercent = achievement.maxProgress
    ? ((achievement.progress || 0) / achievement.maxProgress) * 100
    : 100;

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
        achievement.unlocked
          ? 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl'
          : 'bg-gray-100 dark:bg-gray-900 opacity-75'
      }`}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Rarity Glow Effect */}
      {achievement.unlocked && (
        <div
          className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-10 animate-pulse`}
        />
      )}

      {/* Card Content */}
      <div className="relative p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`relative flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center ${
              achievement.unlocked
                ? `bg-gradient-to-br ${colors.bg} shadow-lg ${colors.glow}`
                : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            {achievement.unlocked ? (
              <Icon className="w-8 h-8 text-white" />
            ) : (
              <Lock className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            )}

            {/* Rarity Badge */}
            {achievement.unlocked && (
              <div
                className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 ${colors.border} bg-white dark:bg-gray-800 flex items-center justify-center`}
              >
                <Star className="w-3 h-3 text-yellow-500" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3
                  className={`font-bold text-lg ${
                    achievement.unlocked
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {achievement.unlocked ? achievement.title : '???'}
                </h3>
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${colors.text} ${
                    achievement.unlocked ? `bg-gradient-to-r ${colors.bg} bg-opacity-10` : ''
                  }`}
                >
                  {achievement.rarity.toUpperCase()}
                </span>
              </div>

              {achievement.unlocked && achievement.reward && onClaim && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClaim(achievement.id);
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                >
                  Claim
                </button>
              )}
            </div>

            <p
              className={`text-sm mb-3 ${
                achievement.unlocked
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {achievement.unlocked ? achievement.description : 'Complete hidden requirements to unlock'}
            </p>

            {/* Progress Bar */}
            {achievement.maxProgress && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>
                    {achievement.progress || 0} / {achievement.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.bg} transition-all duration-500`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Unlocked Date */}
            {achievement.unlocked && achievement.unlockedAt && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Trophy className="w-3 h-3" />
                <span>Unlocked on {formatDate(achievement.unlockedAt)}</span>
              </div>
            )}

            {/* Reward */}
            {achievement.unlocked && achievement.reward && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Reward: {achievement.reward}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && achievement.unlocked && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1">Category</div>
                <div className="font-semibold text-gray-900 dark:text-white">Social</div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1">Points</div>
                <div className="font-semibold text-gray-900 dark:text-white">+100 XP</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Locked Overlay Effect */}
      {!achievement.unlocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-gray-900/30 dark:from-gray-100/5 dark:to-gray-100/10 backdrop-blur-[1px]" />
      )}
    </div>
  );
}

// Example usage component showing multiple achievements
export function AchievementShowcase() {
  const sampleAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Note',
      description: 'Post your first note on NoteBoard',
      icon: Trophy,
      rarity: 'common',
      unlocked: true,
      unlockedAt: Date.now() - 86400000 * 7,
      reward: '50 Points',
    },
    {
      id: '2',
      title: 'Social Butterfly',
      description: 'Get 100 followers',
      icon: Crown,
      rarity: 'rare',
      unlocked: true,
      progress: 100,
      maxProgress: 100,
      unlockedAt: Date.now() - 86400000 * 3,
      reward: '200 Points',
    },
    {
      id: '3',
      title: 'Content Creator',
      description: 'Post 50 notes',
      icon: Star,
      rarity: 'epic',
      unlocked: false,
      progress: 32,
      maxProgress: 50,
    },
    {
      id: '4',
      title: 'Community Legend',
      description: 'Reach 1000 followers',
      icon: Shield,
      rarity: 'legendary',
      unlocked: false,
      progress: 456,
      maxProgress: 1000,
    },
    {
      id: '5',
      title: 'Hot Streak',
      description: 'Post daily for 30 days',
      icon: Flame,
      rarity: 'epic',
      unlocked: false,
      progress: 12,
      maxProgress: 30,
    },
    {
      id: '6',
      title: 'Engagement Master',
      description: 'Receive 1000 total likes',
      icon: Target,
      rarity: 'rare',
      unlocked: true,
      progress: 1000,
      maxProgress: 1000,
      unlockedAt: Date.now() - 86400000,
      reward: '300 Points',
    },
  ];

  const handleClaim = (id: string) => {
    console.log('Claiming achievement:', id);
    // In real app, call smart contract function
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Achievements</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Unlock rewards by completing challenges
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {sampleAchievements.filter((a) => a.unlocked).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Unlocked</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {sampleAchievements.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-yellow-500 mb-1">850</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Points Earned</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-purple-500 mb-1">
              {Math.round((sampleAchievements.filter((a) => a.unlocked).length / sampleAchievements.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {sampleAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onClaim={handleClaim}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

