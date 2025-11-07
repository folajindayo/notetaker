'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface TreasuryAsset {
  token: string;
  symbol: string;
  balance: string;
  value: string;
  icon: string;
  change24h: number;
}

interface TreasuryTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'grant' | 'expense';
  amount: string;
  token: string;
  from?: string;
  to?: string;
  description: string;
  timestamp: number;
  proposalId?: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Grant {
  id: string;
  recipient: string;
  amount: string;
  token: string;
  purpose: string;
  status: 'active' | 'completed' | 'cancelled';
  disbursed: string;
  total: string;
  startDate: number;
  endDate: number;
  milestones: { description: string; completed: boolean }[];
}

interface Budget {
  category: string;
  allocated: string;
  spent: string;
  remaining: string;
  percentage: number;
}

export default function TreasuryManagement() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [assets, setAssets] = useState<TreasuryAsset[]>([]);
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'grants' | 'budget'>('overview');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalAmount, setProposalAmount] = useState('');
  const [proposalPurpose, setProposalPurpose] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockAssets: TreasuryAsset[] = [
        {
          token: 'ETH',
          symbol: 'ETH',
          balance: '125.5',
          value: '251,000',
          icon: '⚡',
          change24h: 2.5,
        },
        {
          token: 'NOTE',
          symbol: 'NOTE',
          balance: '2,500,000',
          value: '500,000',
          icon: '📝',
          change24h: -1.2,
        },
        {
          token: 'USDC',
          symbol: 'USDC',
          balance: '150,000',
          value: '150,000',
          icon: '💵',
          change24h: 0.1,
        },
        {
          token: 'LP Tokens',
          symbol: 'LP',
          balance: '50,000',
          value: '75,000',
          icon: '🔄',
          change24h: 5.3,
        },
      ];

      const mockTransactions: TreasuryTransaction[] = [
        {
          id: '1',
          type: 'grant',
          amount: '10,000',
          token: 'USDC',
          to: '0x1234567890123456789012345678901234567890',
          description: 'Development grant for new features',
          timestamp: Date.now() - 3600000,
          proposalId: 'PROP-123',
          status: 'completed',
        },
        {
          id: '2',
          type: 'deposit',
          amount: '50',
          token: 'ETH',
          from: '0x9876543210987654321098765432109876543210',
          description: 'Community contribution',
          timestamp: Date.now() - 7200000,
          status: 'completed',
        },
        {
          id: '3',
          type: 'expense',
          amount: '5,000',
          token: 'USDC',
          to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          description: 'Marketing campaign',
          timestamp: Date.now() - 10800000,
          proposalId: 'PROP-124',
          status: 'completed',
        },
      ];

      const mockGrants: Grant[] = [
        {
          id: '1',
          recipient: '0x1234567890123456789012345678901234567890',
          amount: '10,000',
          token: 'USDC',
          purpose: 'Development of new features',
          status: 'active',
          disbursed: '4,000',
          total: '10,000',
          startDate: Date.now() - 30 * 24 * 3600000,
          endDate: Date.now() + 60 * 24 * 3600000,
          milestones: [
            { description: 'Initial setup', completed: true },
            { description: 'Feature development', completed: true },
            { description: 'Testing phase', completed: false },
            { description: 'Final deployment', completed: false },
          ],
        },
        {
          id: '2',
          recipient: '0x9876543210987654321098765432109876543210',
          amount: '5,000',
          token: 'NOTE',
          purpose: 'Community events organization',
          status: 'active',
          disbursed: '2,500',
          total: '5,000',
          startDate: Date.now() - 15 * 24 * 3600000,
          endDate: Date.now() + 75 * 24 * 3600000,
          milestones: [
            { description: 'Event planning', completed: true },
            { description: 'Event execution', completed: false },
          ],
        },
      ];

      const mockBudgets: Budget[] = [
        {
          category: 'Development',
          allocated: '200,000',
          spent: '125,000',
          remaining: '75,000',
          percentage: 62.5,
        },
        {
          category: 'Marketing',
          allocated: '100,000',
          spent: '45,000',
          remaining: '55,000',
          percentage: 45,
        },
        {
          category: 'Operations',
          allocated: '150,000',
          spent: '80,000',
          remaining: '70,000',
          percentage: 53.3,
        },
        {
          category: 'Community',
          allocated: '50,000',
          spent: '15,000',
          remaining: '35,000',
          percentage: 30,
        },
      ];

      setAssets(mockAssets);
      setTransactions(mockTransactions);
      setGrants(mockGrants);
      setBudgets(mockBudgets);
      setLoading(false);
    };

    loadData();
  }, []);

  const totalValue = assets.reduce((sum, asset) => sum + parseFloat(asset.value.replace(/,/g, '')), 0);

  const handleProposeSpending = async () => {
    if (!proposalAmount || !proposalPurpose) {
      alert(t('fillAllFields'));
      return;
    }

    const newTransaction: TreasuryTransaction = {
      id: Date.now().toString(),
      type: 'expense',
      amount: proposalAmount,
      token: 'USDC',
      to: address!,
      description: proposalPurpose,
      timestamp: Date.now(),
      proposalId: `PROP-${Date.now()}`,
      status: 'pending',
    };

    setTransactions([newTransaction, ...transactions]);
    setShowProposalModal(false);
    setProposalAmount('');
    setProposalPurpose('');
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      deposit: '⬇️',
      withdrawal: '⬆️',
      grant: '🎁',
      expense: '💰',
    };
    return icons[type as keyof typeof icons] || '📊';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      deposit: 'text-green-600 dark:text-green-400',
      withdrawal: 'text-red-600 dark:text-red-400',
      grant: 'text-purple-600 dark:text-purple-400',
      expense: 'text-orange-600 dark:text-orange-400',
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      active: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      cancelled: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToAccessTreasury')}</p>
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
            {t('communityTreasury')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('manageCommunityFunds')}
          </p>
        </div>
        <button
          onClick={() => setShowProposalModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          {t('proposeSpending')}
        </button>
      </div>

      {/* Total Value Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('totalTreasuryValue')}</h3>
            <div className="text-5xl font-bold mb-2">${totalValue.toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-100">+8.2% {t('thisMonth')}</span>
            </div>
          </div>
          <div className="text-6xl">💰</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-6">
          {(['overview', 'transactions', 'grants', 'budget'] as const).map((tab) => (
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
          {/* Assets */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('assets')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets.map((asset) => (
                <div
                  key={asset.token}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{asset.icon}</span>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{asset.token}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{asset.symbol}</p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        asset.change24h >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {asset.change24h >= 0 ? '+' : ''}
                      {asset.change24h}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('balance')}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {asset.balance}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('value')}:</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ${asset.value}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('recentActivity')}
            </h3>
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${getTypeColor(tx.type)}`}>
                      {getTypeIcon(tx.type)}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {tx.description}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getTypeColor(tx.type)}`}>
                      {tx.type === 'deposit' ? '+' : '-'}
                      {tx.amount} {tx.token}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-3xl ${getTypeColor(tx.type)}`}>
                    {getTypeIcon(tx.type)}
                  </span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white capitalize">
                      {tx.type}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tx.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tx.status)}`}>
                  {tx.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">{t('amount')}</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {tx.amount} {tx.token}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">{t('date')}</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </p>
                </div>
                {tx.proposalId && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">{t('proposal')}</p>
                    <p className="font-mono text-xs text-blue-500">{tx.proposalId}</p>
                  </div>
                )}
                {tx.to && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">{t('to')}</p>
                    <p className="font-mono text-xs text-gray-900 dark:text-white">
                      {tx.to.slice(0, 10)}...
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grants Tab */}
      {activeTab === 'grants' && (
        <div className="space-y-4">
          {grants.map((grant) => (
            <div
              key={grant.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                    {grant.purpose}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {t('recipient')}: {grant.recipient.slice(0, 20)}...
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(grant.status)}`}>
                  {grant.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('total')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {grant.total} {grant.token}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('disbursed')}</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {grant.disbursed} {grant.token}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('remaining')}</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {parseFloat(grant.total.replace(/,/g, '')) - parseFloat(grant.disbursed.replace(/,/g, ''))} {grant.token}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{t('progress')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {((parseFloat(grant.disbursed.replace(/,/g, '')) / parseFloat(grant.total.replace(/,/g, ''))) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(parseFloat(grant.disbursed.replace(/,/g, '')) / parseFloat(grant.total.replace(/,/g, ''))) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Milestones */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('milestones')}:
                </p>
                <div className="space-y-2">
                  {grant.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          milestone.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        {milestone.completed && '✓'}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {milestone.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-4">
          {budgets.map((budget) => (
            <div
              key={budget.category}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">{budget.category}</h4>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('allocated')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${budget.allocated}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('spent')}</p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    ${budget.spent}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('remaining')}</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${budget.remaining}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{t('utilized')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {budget.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      budget.percentage >= 90
                        ? 'bg-red-500'
                        : budget.percentage >= 70
                        ? 'bg-orange-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${budget.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('proposeSpending')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('amount')} (USDC)
                </label>
                <input
                  type="number"
                  value={proposalAmount}
                  onChange={(e) => setProposalAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('purpose')}
                </label>
                <textarea
                  value={proposalPurpose}
                  onChange={(e) => setProposalPurpose(e.target.value)}
                  placeholder={t('describeSpendingPurpose')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowProposalModal(false);
                  setProposalAmount('');
                  setProposalPurpose('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleProposeSpending}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('propose')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

