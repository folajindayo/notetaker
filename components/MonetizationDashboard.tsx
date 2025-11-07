'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface Revenue {
  source: 'tips' | 'subscriptions' | 'nft-sales' | 'ad-revenue' | 'premium-content';
  amount: number;
  currency: 'ETH' | 'USD';
  timestamp: number;
  from?: string;
  contentId?: string;
}

interface MonetizationStats {
  totalEarnings: number;
  monthlyEarnings: number;
  weeklyEarnings: number;
  todayEarnings: number;
  totalSubscribers: number;
  totalTips: number;
  averageTip: number;
  topContent: { id: string; title: string; earnings: number }[];
}

interface Payout {
  id: string;
  amount: number;
  currency: 'ETH' | 'USD';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  initiatedAt: number;
  completedAt?: number;
  destination: string;
}

export default function MonetizationDashboard() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [stats, setStats] = useState<MonetizationStats>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    weeklyEarnings: 0,
    todayEarnings: 0,
    totalSubscribers: 0,
    totalTips: 0,
    averageTip: 0,
    topContent: [],
  });
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'payouts' | 'analytics'>('overview');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    const loadMonetizationData = async () => {
      if (!address) return;

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock revenue data
      const mockRevenues: Revenue[] = [
        {
          source: 'tips',
          amount: 0.5,
          currency: 'ETH',
          timestamp: Date.now() - 3600000,
          from: '0x1234567890123456789012345678901234567890',
          contentId: 'note_123',
        },
        {
          source: 'subscriptions',
          amount: 0.1,
          currency: 'ETH',
          timestamp: Date.now() - 7200000,
          from: '0x9876543210987654321098765432109876543210',
        },
        {
          source: 'premium-content',
          amount: 0.25,
          currency: 'ETH',
          timestamp: Date.now() - 10800000,
          from: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          contentId: 'note_456',
        },
        {
          source: 'nft-sales',
          amount: 1.5,
          currency: 'ETH',
          timestamp: Date.now() - 86400000,
          from: '0x1111111111111111111111111111111111111111',
        },
        {
          source: 'tips',
          amount: 0.3,
          currency: 'ETH',
          timestamp: Date.now() - 172800000,
          from: '0x2222222222222222222222222222222222222222',
          contentId: 'note_789',
        },
      ];

      const mockPayouts: Payout[] = [
        {
          id: '1',
          amount: 2.5,
          currency: 'ETH',
          status: 'completed',
          initiatedAt: Date.now() - 604800000,
          completedAt: Date.now() - 604700000,
          destination: address,
        },
        {
          id: '2',
          amount: 1.0,
          currency: 'ETH',
          status: 'pending',
          initiatedAt: Date.now() - 86400000,
          destination: address,
        },
      ];

      const totalEarnings = mockRevenues.reduce((sum, r) => sum + r.amount, 0);
      const tipRevenues = mockRevenues.filter((r) => r.source === 'tips');

      setRevenues(mockRevenues);
      setPayouts(mockPayouts);
      setStats({
        totalEarnings: totalEarnings * 2000, // Convert to USD
        monthlyEarnings: (totalEarnings * 0.7) * 2000,
        weeklyEarnings: (totalEarnings * 0.3) * 2000,
        todayEarnings: (totalEarnings * 0.1) * 2000,
        totalSubscribers: 234,
        totalTips: tipRevenues.length,
        averageTip: tipRevenues.reduce((sum, r) => sum + r.amount, 0) / tipRevenues.length,
        topContent: [
          { id: 'note_123', title: 'My Best Tutorial Ever', earnings: 1250 },
          { id: 'note_456', title: 'Web3 Guide for Beginners', earnings: 890 },
          { id: 'note_789', title: 'Building on Base', earnings: 650 },
        ],
      });
      setLoading(false);
    };

    loadMonetizationData();
  }, [address]);

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert(t('enterValidAmount'));
      return;
    }

    const newPayout: Payout = {
      id: Date.now().toString(),
      amount: parseFloat(withdrawAmount),
      currency: 'ETH',
      status: 'pending',
      initiatedAt: Date.now(),
      destination: address!,
    };

    setPayouts([newPayout, ...payouts]);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const getSourceIcon = (source: string) => {
    const icons = {
      tips: '💰',
      subscriptions: '📅',
      'nft-sales': '🎨',
      'ad-revenue': '📺',
      'premium-content': '⭐',
    };
    return icons[source as keyof typeof icons] || '💵';
  };

  const getSourceColor = (source: string) => {
    const colors = {
      tips: 'text-yellow-600 dark:text-yellow-400',
      subscriptions: 'text-blue-600 dark:text-blue-400',
      'nft-sales': 'text-purple-600 dark:text-purple-400',
      'ad-revenue': 'text-green-600 dark:text-green-400',
      'premium-content': 'text-pink-600 dark:text-pink-400',
    };
    return colors[source as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };
    return colors[status as keyof typeof colors] || colors.pending;
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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToViewEarnings')}</p>
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
      {/* Earnings Overview */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t('totalEarnings')}</h2>
            <div className="flex items-end gap-4">
              <div className="text-5xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
              <div className="mb-2">
                <span className="text-lg text-green-100">+12.5% ↑</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 font-semibold"
          >
            {t('withdraw')}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-green-100 mb-1">{t('today')}</p>
            <p className="text-2xl font-bold">${stats.todayEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-green-100 mb-1">{t('thisWeek')}</p>
            <p className="text-2xl font-bold">${stats.weeklyEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-green-100 mb-1">{t('thisMonth')}</p>
            <p className="text-2xl font-bold">${stats.monthlyEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-green-100 mb-1">{t('subscribers')}</p>
            <p className="text-2xl font-bold">{stats.totalSubscribers}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-6">
          {(['overview', 'revenue', 'payouts', 'analytics'] as const).map((tab) => (
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
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <span className="text-3xl">💰</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalTips')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTips}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('averageTip')}: {stats.averageTip.toFixed(3)} ETH
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-3xl">📅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('subscribers')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSubscribers}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${(stats.totalSubscribers * 5).toLocaleString()} {t('mrr')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <span className="text-3xl">🎨</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('nftSales')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {revenues.filter((r) => r.source === 'nft-sales').length}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {revenues.filter((r) => r.source === 'nft-sales').reduce((sum, r) => sum + r.amount, 0).toFixed(2)} ETH {t('total')}
              </p>
            </div>
          </div>

          {/* Top Earning Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('topEarningContent')}
            </h3>
            <div className="space-y-3">
              {stats.topContent.map((content, index) => (
                <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{content.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{content.id}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${content.earnings.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('revenueHistory')}</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="day">{t('today')}</option>
              <option value="week">{t('thisWeek')}</option>
              <option value="month">{t('thisMonth')}</option>
              <option value="year">{t('thisYear')}</option>
              <option value="all">{t('allTime')}</option>
            </select>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            {revenues.map((revenue, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-3xl ${getSourceColor(revenue.source)}`}>
                      {getSourceIcon(revenue.source)}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {revenue.source.replace('-', ' ')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(revenue.timestamp).toLocaleString()}
                      </p>
                      {revenue.from && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                          {t('from')}: {revenue.from.slice(0, 10)}...{revenue.from.slice(-8)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {revenue.amount} {revenue.currency}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ≈ ${(revenue.amount * 2000).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('payoutHistory')}</h3>
          </div>

          <div className="space-y-3">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-xl">
                      {payout.amount} {payout.currency}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(payout.initiatedAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payout.status)}`}>
                    {payout.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                  {t('to')}: {payout.destination.slice(0, 20)}...{payout.destination.slice(-10)}
                </p>
                {payout.completedAt && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {t('completed')}: {new Date(payout.completedAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('revenueBreakdown')}
            </h3>
            <div className="space-y-4">
              {['tips', 'subscriptions', 'nft-sales', 'premium-content'].map((source) => {
                const sourceRevenues = revenues.filter((r) => r.source === source);
                const sourceTotal = sourceRevenues.reduce((sum, r) => sum + r.amount, 0);
                const percentage = (sourceTotal / revenues.reduce((sum, r) => sum + r.amount, 0)) * 100;

                return (
                  <div key={source}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize flex items-center gap-2">
                        <span className="text-xl">{getSourceIcon(source)}</span>
                        {source.replace('-', ' ')}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {sourceTotal.toFixed(3)} ETH ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${source === 'tips' ? 'bg-yellow-500' : source === 'subscriptions' ? 'bg-blue-500' : source === 'nft-sales' ? 'bg-purple-500' : 'bg-pink-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('withdrawEarnings')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('amount')} (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('available')}: {(revenues.reduce((sum, r) => sum + r.amount, 0) - payouts.filter((p) => p.status !== 'failed').reduce((sum, p) => sum + p.amount, 0)).toFixed(3)} ETH
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ {t('withdrawalFee')}: 0.5% + gas fees
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {t('withdraw')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

