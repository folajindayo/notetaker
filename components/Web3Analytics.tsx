'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface AnalyticsMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

interface ChainMetrics {
  chain: string;
  transactions: number;
  volume: string;
  activeUsers: number;
  gasSpent: string;
}

interface TokenMetrics {
  token: string;
  symbol: string;
  holders: number;
  transfers: number;
  volume: string;
  price: string;
  change24h: number;
}

interface UserActivity {
  date: string;
  transactions: number;
  volume: number;
  gasSpent: number;
  interactions: number;
}

export default function Web3Analytics() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [chainMetrics, setChainMetrics] = useState<ChainMetrics[]>([]);
  const [tokenMetrics, setTokenMetrics] = useState<TokenMetrics[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'chains' | 'tokens' | 'activity'>('overview');

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockMetrics: AnalyticsMetric[] = [
        {
          label: t('totalTransactions'),
          value: '1,247',
          change: 15.3,
          trend: 'up',
          icon: '📊',
        },
        {
          label: t('totalVolume'),
          value: '$125,430',
          change: 8.7,
          trend: 'up',
          icon: '💰',
        },
        {
          label: t('uniqueWallets'),
          value: '3,456',
          change: -2.1,
          trend: 'down',
          icon: '👥',
        },
        {
          label: t('gasSpent'),
          value: '2.45 ETH',
          change: 5.2,
          trend: 'up',
          icon: '⛽',
        },
        {
          label: t('avgTxValue'),
          value: '$100.51',
          change: 0.5,
          trend: 'stable',
          icon: '💵',
        },
        {
          label: t('smartContracts'),
          value: '89',
          change: 22.4,
          trend: 'up',
          icon: '📝',
        },
      ];

      const mockChainMetrics: ChainMetrics[] = [
        {
          chain: 'Base',
          transactions: 845,
          volume: '95,230',
          activeUsers: 2134,
          gasSpent: '1.85',
        },
        {
          chain: 'Ethereum',
          transactions: 234,
          volume: '18,450',
          activeUsers: 567,
          gasSpent: '0.42',
        },
        {
          chain: 'Optimism',
          transactions: 123,
          volume: '8,920',
          activeUsers: 445,
          gasSpent: '0.12',
        },
        {
          chain: 'Arbitrum',
          transactions: 45,
          volume: '2,830',
          activeUsers: 310,
          gasSpent: '0.06',
        },
      ];

      const mockTokenMetrics: TokenMetrics[] = [
        {
          token: 'NOTE Token',
          symbol: 'NOTE',
          holders: 5678,
          transfers: 12456,
          volume: '2.5M',
          price: '$0.25',
          change24h: 12.5,
        },
        {
          token: 'Ethereum',
          symbol: 'ETH',
          holders: 3456,
          transfers: 8934,
          volume: '125K',
          price: '$2,000',
          change24h: 3.2,
        },
        {
          token: 'USD Coin',
          symbol: 'USDC',
          holders: 4567,
          transfers: 15678,
          volume: '890K',
          price: '$1.00',
          change24h: 0.1,
        },
      ];

      const mockUserActivity: UserActivity[] = [
        { date: '2024-01-01', transactions: 45, volume: 5600, gasSpent: 0.23, interactions: 67 },
        { date: '2024-01-02', transactions: 52, volume: 6800, gasSpent: 0.28, interactions: 78 },
        { date: '2024-01-03', transactions: 38, volume: 4200, gasSpent: 0.19, interactions: 54 },
        { date: '2024-01-04', transactions: 67, volume: 8900, gasSpent: 0.35, interactions: 95 },
        { date: '2024-01-05', transactions: 58, volume: 7300, gasSpent: 0.31, interactions: 82 },
        { date: '2024-01-06', transactions: 71, volume: 9800, gasSpent: 0.39, interactions: 103 },
        { date: '2024-01-07', transactions: 49, volume: 6100, gasSpent: 0.26, interactions: 71 },
      ];

      setMetrics(mockMetrics);
      setChainMetrics(mockChainMetrics);
      setTokenMetrics(mockTokenMetrics);
      setUserActivity(mockUserActivity);
      setLoading(false);
    };

    if (address) {
      loadAnalytics();
    }
  }, [address, timeRange]);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToViewAnalytics')}</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('web3Analytics')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('onChainMetricsAndInsights')}
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="24h">{t('last24Hours')}</option>
          <option value="7d">{t('last7Days')}</option>
          <option value="30d">{t('last30Days')}</option>
          <option value="1y">{t('lastYear')}</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-6">
          {(['overview', 'chains', 'tokens', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium transition-colors relative capitalize ${
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
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{metric.icon}</span>
                  <span className={`text-sm font-semibold ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)} {metric.change >= 0 ? '+' : ''}
                    {metric.change}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Activity Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('transactionActivity')}
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {userActivity.map((day, index) => {
                const maxTx = Math.max(...userActivity.map((d) => d.transactions));
                const height = (day.transactions / maxTx) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.transactions} txs
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Volume & Gas Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('volumeByDay')}
              </h3>
              <div className="space-y-2">
                {userActivity.slice(0, 5).map((day, index) => {
                  const maxVolume = Math.max(...userActivity.map((d) => d.volume));
                  const percentage = (day.volume / maxVolume) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${day.volume.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('gasSpentByDay')}
              </h3>
              <div className="space-y-2">
                {userActivity.slice(0, 5).map((day, index) => {
                  const maxGas = Math.max(...userActivity.map((d) => d.gasSpent));
                  const percentage = (day.gasSpent / maxGas) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {day.gasSpent.toFixed(3)} ETH
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chains Tab */}
      {activeTab === 'chains' && (
        <div className="space-y-4">
          {chainMetrics.map((chain) => (
            <div
              key={chain.chain}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {chain.chain}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('transactions')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {chain.transactions.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('volume')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${chain.volume}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('activeUsers')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {chain.activeUsers.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('gasSpent')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {chain.gasSpent} ETH
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tokens Tab */}
      {activeTab === 'tokens' && (
        <div className="space-y-4">
          {tokenMetrics.map((token) => (
            <div
              key={token.symbol}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{token.token}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{token.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{token.price}</p>
                  <p
                    className={`text-sm font-semibold ${
                      token.change24h >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {token.change24h >= 0 ? '+' : ''}
                    {token.change24h}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('holders')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {token.holders.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('transfers')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {token.transfers.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('volume')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">${token.volume}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('marketCap')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${(parseFloat(token.volume.replace(/[KM]/g, '')) * 10).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {t('date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {t('transactions')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {t('volume')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {t('gasSpent')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {t('interactions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {userActivity.map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(day.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {day.transactions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${day.volume.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {day.gasSpent.toFixed(3)} ETH
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {day.interactions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

