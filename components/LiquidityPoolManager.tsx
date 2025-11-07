'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface Pool {
  id: string;
  name: string;
  tokenA: { symbol: string; amount: string; price: number };
  tokenB: { symbol: string; amount: string; price: number };
  tvl: string;
  volume24h: string;
  apr: number;
  fee: number;
  myLiquidity: string;
  myShare: number;
}

interface Position {
  id: string;
  poolId: string;
  poolName: string;
  liquidity: string;
  share: number;
  value: string;
  rewards: string;
  addedAt: number;
}

export default function LiquidityPoolManager() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [pools, setPools] = useState<Pool[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [action, setAction] = useState<'add' | 'remove'>('add');
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState<'tvl' | 'apr' | 'volume'>('tvl');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockPools: Pool[] = [
        {
          id: '1',
          name: 'ETH/USDC',
          tokenA: { symbol: 'ETH', amount: '1250', price: 2800 },
          tokenB: { symbol: 'USDC', amount: '3500000', price: 1 },
          tvl: '7000000',
          volume24h: '2500000',
          apr: 28.5,
          fee: 0.3,
          myLiquidity: '5000',
          myShare: 0.07,
        },
        {
          id: '2',
          name: 'WBTC/ETH',
          tokenA: { symbol: 'WBTC', amount: '85', price: 62000 },
          tokenB: { symbol: 'ETH', amount: '1890', price: 2800 },
          tvl: '10540000',
          volume24h: '3200000',
          apr: 35.2,
          fee: 0.3,
          myLiquidity: '0',
          myShare: 0,
        },
        {
          id: '3',
          name: 'USDC/DAI',
          tokenA: { symbol: 'USDC', amount: '5000000', price: 1 },
          tokenB: { symbol: 'DAI', amount: '5000000', price: 1 },
          tvl: '10000000',
          volume24h: '8500000',
          apr: 12.8,
          fee: 0.05,
          myLiquidity: '2500',
          myShare: 0.025,
        },
        {
          id: '4',
          name: 'LINK/ETH',
          tokenA: { symbol: 'LINK', amount: '450000', price: 15 },
          tokenB: { symbol: 'ETH', amount: '2410', price: 2800 },
          tvl: '13500000',
          volume24h: '1800000',
          apr: 22.4,
          fee: 0.3,
          myLiquidity: '0',
          myShare: 0,
        },
      ];

      const mockPositions: Position[] = [
        {
          id: '1',
          poolId: '1',
          poolName: 'ETH/USDC',
          liquidity: '5000',
          share: 0.07,
          value: '5125',
          rewards: '42.50',
          addedAt: Date.now() - 30 * 24 * 3600000,
        },
        {
          id: '2',
          poolId: '3',
          poolName: 'USDC/DAI',
          liquidity: '2500',
          share: 0.025,
          value: '2531',
          rewards: '8.20',
          addedAt: Date.now() - 15 * 24 * 3600000,
        },
      ];

      setPools(mockPools);
      setPositions(mockPositions);
      setLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address]);

  const handleAddLiquidity = async () => {
    if (!selectedPool || !amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
      alert(t('fillAllFields'));
      return;
    }

    const totalValue = parseFloat(amountA) * selectedPool.tokenA.price + parseFloat(amountB) * selectedPool.tokenB.price;

    const newPosition: Position = {
      id: Date.now().toString(),
      poolId: selectedPool.id,
      poolName: selectedPool.name,
      liquidity: totalValue.toFixed(2),
      share: 0.01,
      value: totalValue.toFixed(2),
      rewards: '0',
      addedAt: Date.now(),
    };

    setPositions([newPosition, ...positions]);
    setShowModal(false);
    setAmountA('');
    setAmountB('');
  };

  const handleRemoveLiquidity = async (positionId: string) => {
    setPositions(positions.filter((p) => p.id !== positionId));
  };

  const sortedPools = [...pools].sort((a, b) => {
    if (sortBy === 'tvl') return parseFloat(b.tvl) - parseFloat(a.tvl);
    if (sortBy === 'apr') return b.apr - a.apr;
    if (sortBy === 'volume') return parseFloat(b.volume24h) - parseFloat(a.volume24h);
    return 0;
  });

  const totalLiquidity = positions.reduce((sum, pos) => sum + parseFloat(pos.value), 0);
  const totalRewards = positions.reduce((sum, pos) => sum + parseFloat(pos.rewards), 0);

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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToManagePools')}</p>
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
          {t('liquidityPoolManager')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('provideAndManageLiquidity')}
        </p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">{t('totalLiquidity')}</p>
          <p className="text-3xl font-bold mt-2">${totalLiquidity.toFixed(2)}</p>
          <p className="text-xs opacity-75 mt-1">{positions.length} {t('positions')}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">{t('totalRewards')}</p>
          <p className="text-3xl font-bold mt-2">${totalRewards.toFixed(2)}</p>
          <p className="text-xs opacity-75 mt-1">{t('unclaimed')}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">{t('avgAPR')}</p>
          <p className="text-3xl font-bold mt-2">
            {positions.length > 0 ? '24.3%' : '0%'}
          </p>
          <p className="text-xs opacity-75 mt-1">{t('weighted')}</p>
        </div>
      </div>

      {/* My Positions */}
      {positions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('myPositions')}</h3>
          {positions.map((position) => (
            <div
              key={position.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {position.poolName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('added')} {new Date(position.addedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveLiquidity(position.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                  {t('remove')}
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">{t('liquidity')}</p>
                  <p className="font-bold text-gray-900 dark:text-white">${position.liquidity}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">{t('share')}</p>
                  <p className="font-bold text-gray-900 dark:text-white">{position.share}%</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">{t('currentValue')}</p>
                  <p className="font-bold text-green-600 dark:text-green-400">${position.value}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">{t('rewards')}</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">${position.rewards}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('allPools')}</h3>
        <div className="flex gap-2">
          {(['tvl', 'apr', 'volume'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                sortBy === sort
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t(sort)}
            </button>
          ))}
        </div>
      </div>

      {/* Pools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedPools.map((pool) => (
          <div
            key={pool.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {pool.name}
                </h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('fee')}: {pool.fee}%
                  </span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs font-medium">
                    {pool.apr.toFixed(1)}% APR
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPool(pool);
                  setAction('add');
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                {t('addLiquidity')}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('totalValueLocked')}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  ${parseFloat(pool.tvl).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('24hVolume')}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  ${parseFloat(pool.volume24h).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('myLiquidity')}</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {pool.myLiquidity === '0' ? '-' : `$${pool.myLiquidity}`}
                </span>
              </div>
              {pool.myShare > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('myShare')}</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {pool.myShare}%
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>
                  {pool.tokenA.amount} {pool.tokenA.symbol}
                </span>
                <span>
                  {pool.tokenB.amount} {pool.tokenB.symbol}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Liquidity Modal */}
      {showModal && selectedPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('addLiquidity')} - {selectedPool.name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {selectedPool.tokenA.symbol} {t('amount')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amountA}
                  onChange={(e) => {
                    setAmountA(e.target.value);
                    const ratio = selectedPool.tokenA.price / selectedPool.tokenB.price;
                    setAmountB((parseFloat(e.target.value || '0') * ratio).toFixed(6));
                  }}
                  placeholder="0.0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  ${(parseFloat(amountA || '0') * selectedPool.tokenA.price).toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {selectedPool.tokenB.symbol} {t('amount')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amountB}
                  onChange={(e) => {
                    setAmountB(e.target.value);
                    const ratio = selectedPool.tokenB.price / selectedPool.tokenA.price;
                    setAmountA((parseFloat(e.target.value || '0') * ratio).toFixed(6));
                  }}
                  placeholder="0.0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  ${(parseFloat(amountB || '0') * selectedPool.tokenB.price).toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 dark:text-gray-300">{t('totalValue')}:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    $
                    {(
                      parseFloat(amountA || '0') * selectedPool.tokenA.price +
                      parseFloat(amountB || '0') * selectedPool.tokenB.price
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{t('estimatedAPR')}:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {selectedPool.apr.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setAmountA('');
                  setAmountB('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddLiquidity}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                {t('add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

