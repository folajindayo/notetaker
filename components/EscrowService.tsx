'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface EscrowDeal {
  id: string;
  title: string;
  description: string;
  amount: string;
  token: string;
  buyer: string;
  seller: string;
  arbiter?: string;
  status: 'pending' | 'funded' | 'delivered' | 'disputed' | 'completed' | 'cancelled';
  createdAt: number;
  fundedAt?: number;
  completedAt?: number;
  deadline: number;
  milestones?: { description: string; amount: string; completed: boolean }[];
}

export default function EscrowService() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  
  const [deals, setDeals] = useState<EscrowDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<EscrowDeal | null>(null);
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling' | 'arbitrating'>('all');
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('ETH');
  const [counterparty, setCounterparty] = useState('');
  const [arbiter, setArbiter] = useState('');
  const [deadline, setDeadline] = useState('');
  const [useMilestones, setUseMilestones] = useState(false);
  const [milestones, setMilestones] = useState<{ description: string; amount: string }[]>([
    { description: '', amount: '' },
  ]);

  useEffect(() => {
    const loadDeals = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockDeals: EscrowDeal[] = [
        {
          id: '1',
          title: 'Website Development',
          description: 'Build a responsive e-commerce website with payment integration',
          amount: '5',
          token: 'ETH',
          buyer: address || '0x0',
          seller: '0x1234567890123456789012345678901234567890',
          arbiter: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          status: 'funded',
          createdAt: Date.now() - 7 * 24 * 3600000,
          fundedAt: Date.now() - 6 * 24 * 3600000,
          deadline: Date.now() + 23 * 24 * 3600000,
          milestones: [
            { description: 'Design mockups', amount: '1', completed: true },
            { description: 'Frontend development', amount: '2', completed: false },
            { description: 'Backend integration', amount: '2', completed: false },
          ],
        },
        {
          id: '2',
          title: 'Logo Design',
          description: 'Create a modern logo for blockchain startup',
          amount: '0.5',
          token: 'ETH',
          buyer: '0x9876543210987654321098765432109876543210',
          seller: address || '0x0',
          status: 'pending',
          createdAt: Date.now() - 2 * 24 * 3600000,
          deadline: Date.now() + 12 * 24 * 3600000,
        },
        {
          id: '3',
          title: 'Smart Contract Audit',
          description: 'Security audit for DeFi protocol',
          amount: '10',
          token: 'ETH',
          buyer: '0x2222222222222222222222222222222222222222',
          seller: address || '0x0',
          arbiter: '0x3333333333333333333333333333333333333333',
          status: 'completed',
          createdAt: Date.now() - 30 * 24 * 3600000,
          fundedAt: Date.now() - 29 * 24 * 3600000,
          completedAt: Date.now() - 1 * 24 * 3600000,
          deadline: Date.now() - 1 * 24 * 3600000,
        },
      ];

      setDeals(mockDeals);
      setLoading(false);
    };

    if (address) {
      loadDeals();
    }
  }, [address]);

  const handleCreateDeal = async () => {
    if (!title || !description || !amount || !counterparty || !deadline) {
      alert(t('fillAllFields'));
      return;
    }

    const newDeal: EscrowDeal = {
      id: Date.now().toString(),
      title,
      description,
      amount,
      token,
      buyer: address!,
      seller: counterparty,
      arbiter: arbiter || undefined,
      status: 'pending',
      createdAt: Date.now(),
      deadline: new Date(deadline).getTime(),
      milestones: useMilestones
        ? milestones.filter((m) => m.description && m.amount).map((m) => ({ ...m, completed: false }))
        : undefined,
    };

    setDeals([newDeal, ...deals]);
    setShowCreateModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAmount('');
    setCounterparty('');
    setArbiter('');
    setDeadline('');
    setUseMilestones(false);
    setMilestones([{ description: '', amount: '' }]);
  };

  const handleFundDeal = async (dealId: string) => {
    setDeals(
      deals.map((d) =>
        d.id === dealId ? { ...d, status: 'funded', fundedAt: Date.now() } : d
      )
    );
  };

  const handleMarkDelivered = async (dealId: string) => {
    setDeals(
      deals.map((d) => (d.id === dealId ? { ...d, status: 'delivered' } : d))
    );
  };

  const handleCompleteDeal = async (dealId: string) => {
    setDeals(
      deals.map((d) =>
        d.id === dealId ? { ...d, status: 'completed', completedAt: Date.now() } : d
      )
    );
  };

  const handleDisputeDeal = async (dealId: string) => {
    setDeals(
      deals.map((d) => (d.id === dealId ? { ...d, status: 'disputed' } : d))
    );
  };

  const handleCancelDeal = async (dealId: string) => {
    setDeals(
      deals.map((d) => (d.id === dealId ? { ...d, status: 'cancelled' } : d))
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      funded: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      delivered: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      disputed: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getDaysRemaining = (deadline: number) => {
    const remaining = deadline - Date.now();
    const days = Math.ceil(remaining / (24 * 3600000));
    return days > 0 ? days : 0;
  };

  const filteredDeals = deals.filter((deal) => {
    if (filter === 'buying') return deal.buyer.toLowerCase() === address?.toLowerCase();
    if (filter === 'selling') return deal.seller.toLowerCase() === address?.toLowerCase();
    if (filter === 'arbitrating') return deal.arbiter?.toLowerCase() === address?.toLowerCase();
    return true;
  });

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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToAccessEscrow')}</p>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('escrowService')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('secureTransactionsWithEscrow')}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          {t('createDeal')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'buying', 'selling', 'arbitrating'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t(f)}
          </button>
        ))}
      </div>

      {/* Deals List */}
      {filteredDeals.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">{t('noDealsYet')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              onClick={() => setSelectedDeal(deal)}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {deal.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {deal.description}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deal.status)}`}>
                  {deal.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('amount')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {deal.amount} {deal.token}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('deadline')}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {getDaysRemaining(deal.deadline)} {t('days')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('role')}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                    {deal.buyer.toLowerCase() === address?.toLowerCase()
                      ? t('buyer')
                      : deal.seller.toLowerCase() === address?.toLowerCase()
                      ? t('seller')
                      : t('arbiter')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('created')}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {new Date(deal.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {deal.milestones && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('milestones')}:
                  </p>
                  <div className="flex gap-2">
                    {deal.milestones.map((milestone, idx) => (
                      <div
                        key={idx}
                        className={`px-2 py-1 rounded text-xs ${
                          milestone.completed
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {milestone.completed ? '✓' : '○'} {milestone.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {deal.status === 'pending' && deal.buyer.toLowerCase() === address?.toLowerCase() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFundDeal(deal.id);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                  >
                    {t('fundEscrow')}
                  </button>
                )}
                {deal.status === 'funded' && deal.seller.toLowerCase() === address?.toLowerCase() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkDelivered(deal.id);
                    }}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm font-medium"
                  >
                    {t('markDelivered')}
                  </button>
                )}
                {deal.status === 'delivered' && deal.buyer.toLowerCase() === address?.toLowerCase() && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteDeal(deal.id);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                    >
                      {t('release')}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisputeDeal(deal.id);
                      }}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
                    >
                      {t('dispute')}
                    </button>
                  </>
                )}
                {deal.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelDeal(deal.id);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                  >
                    {t('cancel')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Deal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('createEscrowDeal')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('dealTitle')} *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Website Development"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('description')} *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the work or product..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('amount')} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="5.0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('token')}
                  </label>
                  <select
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="ETH">ETH</option>
                    <option value="USDC">USDC</option>
                    <option value="DAI">DAI</option>
                    <option value="NOTE">NOTE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('counterparty')} {t('address')} *
                </label>
                <input
                  type="text"
                  value={counterparty}
                  onChange={(e) => setCounterparty(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('arbiter')} {t('address')} ({t('optional')})
                </label>
                <input
                  type="text"
                  value={arbiter}
                  onChange={(e) => setArbiter(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('deadline')} *
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMilestones}
                  onChange={(e) => setUseMilestones(e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('useMilestones')}
                </span>
              </label>

              {useMilestones && (
                <div className="space-y-2">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={milestone.description}
                        onChange={(e) => {
                          const newMilestones = [...milestones];
                          newMilestones[index].description = e.target.value;
                          setMilestones(newMilestones);
                        }}
                        placeholder={t('milestoneDescription')}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={milestone.amount}
                        onChange={(e) => {
                          const newMilestones = [...milestones];
                          newMilestones[index].amount = e.target.value;
                          setMilestones(newMilestones);
                        }}
                        placeholder="Amount"
                        className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => setMilestones([...milestones, { description: '', amount: '' }])}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    + {t('addMilestone')}
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCreateDeal}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                {t('createDeal')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

