'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface StakingPool {
  id: string;
  name: string;
  token: string;
  tokenIcon: string;
  apr: number;
  totalStaked: string;
  minStake: string;
  lockPeriod: number; // in days
  rewardToken: string;
  active: boolean;
}

interface UserStake {
  poolId: string;
  poolName: string;
  amount: string;
  stakedAt: number;
  unlockAt: number;
  rewards: string;
  apr: number;
  status: 'active' | 'unlocking' | 'unlocked';
}

interface StakingStats {
  totalStaked: string;
  totalRewards: string;
  activeStakes: number;
  estimatedYearlyRewards: string;
}

export default function StakingDashboard() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);
  const [stats, setStats] = useState<StakingStats>({
    totalStaked: '0',
    totalRewards: '0',
    activeStakes: 0,
    estimatedYearlyRewards: '0',
  });
  const [loading, setLoading] = useState(true);
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [selectedStake, setSelectedStake] = useState<UserStake | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockPools: StakingPool[] = [
        {
          id: '1',
          name: 'NOTE Token Staking',
          token: 'NOTE',
          tokenIcon: '📝',
          apr: 45.5,
          totalStaked: '12,450,000',
          minStake: '100',
          lockPeriod: 30,
          rewardToken: 'NOTE',
          active: true,
        },
        {
          id: '2',
          name: 'ETH Liquid Staking',
          token: 'ETH',
          tokenIcon: '⚡',
          apr: 8.5,
          totalStaked: '8,950',
          minStake: '0.1',
          lockPeriod: 0,
          rewardToken: 'stETH',
          active: true,
        },
        {
          id: '3',
          name: 'LP Token Staking',
          token: 'NOTE-ETH LP',
          tokenIcon: '🔄',
          apr: 125.3,
          totalStaked: '5,680,000',
          minStake: '10',
          lockPeriod: 90,
          rewardToken: 'NOTE',
          active: true,
        },
        {
          id: '4',
          name: 'Governance Staking',
          token: 'vNOTE',
          tokenIcon: '🏛️',
          apr: 15.7,
          totalStaked: '3,200,000',
          minStake: '1000',
          lockPeriod: 180,
          rewardToken: 'vNOTE',
          active: true,
        },
      ];

      const mockUserStakes: UserStake[] = [
        {
          poolId: '1',
          poolName: 'NOTE Token Staking',
          amount: '5000',
          stakedAt: Date.now() - 15 * 24 * 3600000,
          unlockAt: Date.now() + 15 * 24 * 3600000,
          rewards: '93.75',
          apr: 45.5,
          status: 'active',
        },
        {
          poolId: '3',
          poolName: 'LP Token Staking',
          amount: '250',
          stakedAt: Date.now() - 45 * 24 * 3600000,
          unlockAt: Date.now() + 45 * 24 * 3600000,
          rewards: '385.42',
          apr: 125.3,
          status: 'active',
        },
      ];

      setPools(mockPools);
      setUserStakes(mockUserStakes);
      
      const totalStaked = mockUserStakes.reduce((sum, s) => sum + parseFloat(s.amount), 0);
      const totalRewards = mockUserStakes.reduce((sum, s) => sum + parseFloat(s.rewards), 0);

      setStats({
        totalStaked: totalStaked.toFixed(2),
        totalRewards: totalRewards.toFixed(2),
        activeStakes: mockUserStakes.length,
        estimatedYearlyRewards: (totalStaked * 0.45).toFixed(2),
      });

      setLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address]);

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0 || !selectedPool) {
      alert(t('enterValidAmount'));
      return;
    }

    if (parseFloat(stakeAmount) < parseFloat(selectedPool.minStake)) {
      alert(`${t('minimumStake')}: ${selectedPool.minStake} ${selectedPool.token}`);
      return;
    }

    const newStake: UserStake = {
      poolId: selectedPool.id,
      poolName: selectedPool.name,
      amount: stakeAmount,
      stakedAt: Date.now(),
      unlockAt: Date.now() + selectedPool.lockPeriod * 24 * 3600000,
      rewards: '0',
      apr: selectedPool.apr,
      status: 'active',
    };

    setUserStakes([newStake, ...userStakes]);
    setShowStakeModal(false);
    setStakeAmount('');
  };

  const handleUnstake = async () => {
    if (!selectedStake) return;

    if (selectedStake.status === 'active' && Date.now() < selectedStake.unlockAt) {
      alert(t('stakingPeriodNotComplete'));
      return;
    }

    setUserStakes(userStakes.filter((s) => s !== selectedStake));
    setShowUnstakeModal(false);
    setSelectedStake(null);
  };

  const handleClaimRewards = async (stake: UserStake) => {
    setUserStakes(
      userStakes.map((s) =>
        s === stake ? { ...s, rewards: '0' } : s
      )
    );
    alert(`${t('claimed')} ${stake.rewards} ${t('tokens')}!`);
  };

  const getDaysRemaining = (unlockAt: number) => {
    const remaining = unlockAt - Date.now();
    if (remaining <= 0) return 0;
    return Math.ceil(remaining / (24 * 3600000));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      unlocking: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      unlocked: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToStake')}</p>
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('stakingDashboard')}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('stakeTokensToEarnRewards')}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm text-blue-100 mb-1">{t('totalStaked')}</p>
          <p className="text-3xl font-bold">{stats.totalStaked}</p>
          <p className="text-xs text-blue-100 mt-1">NOTE {t('tokens')}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm text-green-100 mb-1">{t('totalRewards')}</p>
          <p className="text-3xl font-bold">{stats.totalRewards}</p>
          <p className="text-xs text-green-100 mt-1">NOTE {t('tokens')}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm text-purple-100 mb-1">{t('activeStakes')}</p>
          <p className="text-3xl font-bold">{stats.activeStakes}</p>
          <p className="text-xs text-purple-100 mt-1">{t('positions')}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm text-orange-100 mb-1">{t('yearlyEstimate')}</p>
          <p className="text-3xl font-bold">{stats.estimatedYearlyRewards}</p>
          <p className="text-xs text-orange-100 mt-1">NOTE {t('tokens')}</p>
        </div>
      </div>

      {/* Your Stakes */}
      {userStakes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('yourStakes')}</h3>
          {userStakes.map((stake, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                    {stake.poolName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('staked')}: {stake.amount} {t('tokens')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(stake.status)}`}>
                  {stake.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('apr')}</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {stake.apr}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('rewards')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stake.rewards}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('stakedOn')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(stake.stakedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('unlockIn')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {getDaysRemaining(stake.unlockAt)} {t('days')}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        ((Date.now() - stake.stakedAt) / (stake.unlockAt - stake.stakedAt)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleClaimRewards(stake)}
                  disabled={parseFloat(stake.rewards) === 0}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {t('claimRewards')}
                </button>
                <button
                  onClick={() => {
                    setSelectedStake(stake);
                    setShowUnstakeModal(true);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                >
                  {t('unstake')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available Pools */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('availablePools')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pools.map((pool) => (
            <div
              key={pool.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{pool.tokenIcon}</span>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{pool.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{pool.token}</p>
                  </div>
                </div>
                {pool.active && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs font-medium">
                    {t('active')}
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('apr')}</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {pool.apr}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('totalStaked')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pool.totalStaked} {pool.token}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('minStake')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pool.minStake} {pool.token}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('lockPeriod')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pool.lockPeriod === 0 ? t('noLock') : `${pool.lockPeriod} ${t('days')}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPool(pool);
                  setShowStakeModal(true);
                }}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
              >
                {t('stake')} {pool.token}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stake Modal */}
      {showStakeModal && selectedPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('stake')} {selectedPool.token}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('amount')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('minimum')}: {selectedPool.minStake} {selectedPool.token}
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{t('apr')}:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {selectedPool.apr}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{t('lockPeriod')}:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {selectedPool.lockPeriod} {t('days')}
                  </span>
                </div>
                {stakeAmount && parseFloat(stakeAmount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{t('estimatedRewards')}:</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {((parseFloat(stakeAmount) * selectedPool.apr) / 100 / 365 * selectedPool.lockPeriod).toFixed(2)} {selectedPool.rewardToken}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowStakeModal(false);
                  setStakeAmount('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleStake}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unstake Modal */}
      {showUnstakeModal && selectedStake && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('unstake')} {t('tokens')}
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('amount')}:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {selectedStake.amount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('rewards')}:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {selectedStake.rewards}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('daysRemaining')}:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {getDaysRemaining(selectedStake.unlockAt)}
                  </span>
                </div>
              </div>
              
              {Date.now() < selectedStake.unlockAt && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    ⚠️ {t('earlyUnstakeWarning')}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowUnstakeModal(false);
                  setSelectedStake(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleUnstake}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

