'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface Player {
  id: string;
  address: string;
  username: string;
  avatar: string;
  rank: number;
  score: number;
  wins: number;
  losses: number;
  winRate: number;
  streak: number;
  level: number;
  achievements: string[];
  rewards: string;
  lastPlayed: number;
}

interface Game {
  id: string;
  name: string;
  icon: string;
  players: number;
  prize: string;
  type: 'pvp' | 'tournament' | 'ranked';
  status: 'live' | 'upcoming' | 'ended';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number;
}

export default function GamingLeaderboard() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'allTime'>('weekly');
  const [gameFilter, setGameFilter] = useState('all');
  const [showMyProfile, setShowMyProfile] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockPlayers: Player[] = [
        {
          id: '1',
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          username: 'CryptoKnight',
          avatar: '⚔️',
          rank: 1,
          score: 12580,
          wins: 245,
          losses: 32,
          winRate: 88.4,
          streak: 15,
          level: 42,
          achievements: ['winner', 'streak_master', 'legendary'],
          rewards: '5.8',
          lastPlayed: Date.now() - 3600000,
        },
        {
          id: '2',
          address: '0x9876543210987654321098765432109876543210',
          username: 'BlockWarrior',
          avatar: '🛡️',
          rank: 2,
          score: 11250,
          wins: 220,
          losses: 45,
          winRate: 83.0,
          streak: 8,
          level: 38,
          achievements: ['winner', 'veteran'],
          rewards: '4.2',
          lastPlayed: Date.now() - 7200000,
        },
        {
          id: '3',
          address: address || '',
          username: 'YourName',
          avatar: '🎮',
          rank: 15,
          score: 8420,
          wins: 178,
          losses: 62,
          winRate: 74.2,
          streak: 3,
          level: 31,
          achievements: ['winner', 'rising_star'],
          rewards: '2.5',
          lastPlayed: Date.now() - 1800000,
        },
        {
          id: '4',
          address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          username: 'ChainMaster',
          avatar: '⛓️',
          rank: 4,
          score: 10100,
          wins: 198,
          losses: 55,
          winRate: 78.3,
          streak: 5,
          level: 35,
          achievements: ['winner', 'strategist'],
          rewards: '3.8',
          lastPlayed: Date.now() - 10800000,
        },
        {
          id: '5',
          address: '0x1234567890123456789012345678901234567890',
          username: 'NFTGamer',
          avatar: '🎯',
          rank: 5,
          score: 9850,
          wins: 185,
          losses: 48,
          winRate: 79.4,
          streak: 6,
          level: 33,
          achievements: ['winner', 'collector'],
          rewards: '3.5',
          lastPlayed: Date.now() - 14400000,
        },
      ];

      const mockGames: Game[] = [
        {
          id: '1',
          name: 'Battle Royale',
          icon: '⚔️',
          players: 1250,
          prize: '10 ETH',
          type: 'tournament',
          status: 'live',
        },
        {
          id: '2',
          name: 'Card Duel',
          icon: '🃏',
          players: 890,
          prize: '5 ETH',
          type: 'pvp',
          status: 'live',
        },
        {
          id: '3',
          name: 'Crypto Quiz',
          icon: '🧠',
          players: 2100,
          prize: '15 ETH',
          type: 'ranked',
          status: 'upcoming',
        },
      ];

      const mockAchievements: Achievement[] = [
        {
          id: '1',
          name: 'First Victory',
          description: 'Win your first game',
          icon: '🏆',
          rarity: 'common',
          unlockedAt: Date.now() - 90 * 24 * 3600000,
        },
        {
          id: '2',
          name: 'Winning Streak',
          description: 'Win 10 games in a row',
          icon: '🔥',
          rarity: 'rare',
          unlockedAt: Date.now() - 30 * 24 * 3600000,
        },
        {
          id: '3',
          name: 'Top 10',
          description: 'Reach top 10 in leaderboard',
          icon: '⭐',
          rarity: 'epic',
          unlockedAt: Date.now() - 7 * 24 * 3600000,
        },
        {
          id: '4',
          name: 'Legendary Champion',
          description: 'Reach rank 1',
          icon: '👑',
          rarity: 'legendary',
        },
      ];

      setPlayers(mockPlayers);
      setGames(mockGames);
      setAchievements(mockAchievements);
      setLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address, timeframe]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      rare: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      epic: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      legendary: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const myPlayer = players.find((p) => p.address === address);
  const topPlayers = players.slice(0, 10);

  if (!isConnected) {
    return (
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToCompete')}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('gamingLeaderboard')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('competeAndEarnRewards')}
        </p>
      </div>

      {/* My Stats */}
      {myPlayer && (
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{myPlayer.avatar}</div>
              <div>
                <h3 className="text-2xl font-bold">{myPlayer.username}</h3>
                <p className="text-sm opacity-90">{t('level')} {myPlayer.level}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{getRankBadge(myPlayer.rank)}</div>
              <p className="text-xs opacity-75">{t('rank')}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs opacity-75">{t('score')}</p>
              <p className="text-xl font-bold">{myPlayer.score.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs opacity-75">{t('winRate')}</p>
              <p className="text-xl font-bold">{myPlayer.winRate}%</p>
            </div>
            <div>
              <p className="text-xs opacity-75">{t('streak')}</p>
              <p className="text-xl font-bold">🔥 {myPlayer.streak}</p>
            </div>
            <div>
              <p className="text-xs opacity-75">{t('rewards')}</p>
              <p className="text-xl font-bold">{myPlayer.rewards} ETH</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Games */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('activeGames')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{game.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">{game.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {game.players.toLocaleString()} {t('players')}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    game.status === 'live'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  }`}
                >
                  {game.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('prize')}: <strong className="text-green-600 dark:text-green-400">{game.prize}</strong>
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                  {game.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeframe Filter */}
      <div className="flex gap-2">
        {(['daily', 'weekly', 'allTime'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              timeframe === tf
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {tf === 'allTime' ? t('allTime') : t(tf)}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('rank')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('player')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('score')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('winRate')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('streak')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('level')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('rewards')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topPlayers.map((player) => (
                <tr
                  key={player.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${
                    player.address === address ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-2xl">{getRankBadge(player.rank)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{player.avatar}</div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {player.username}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                          {player.address.substring(0, 6)}...{player.address.substring(38)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {player.score.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {player.winRate}%
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        ({player.wins}W/{player.losses}L)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-orange-600 dark:text-orange-400">
                      🔥 {player.streak}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">{player.level}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-green-600 dark:text-green-400">
                      {player.rewards} ETH
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('achievements')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-xl p-4 shadow-sm border-2 transition-all ${
                achievement.unlockedAt
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-800 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                      {achievement.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {achievement.description}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRarityColor(
                      achievement.rarity
                    )}`}
                  >
                    {achievement.rarity}
                  </span>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

