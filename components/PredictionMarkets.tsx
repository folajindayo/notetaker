'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface Market {
  id: string;
  question: string;
  description: string;
  category: 'crypto' | 'sports' | 'politics' | 'entertainment' | 'tech';
  outcomes: { id: string; name: string; odds: number; pool: string }[];
  totalPool: string;
  endTime: number;
  status: 'active' | 'locked' | 'resolved' | 'cancelled';
  creator: string;
  resolvedOutcome?: string;
}

interface Bet {
  id: string;
  marketId: string;
  marketQuestion: string;
  outcome: string;
  amount: string;
  odds: number;
  potentialWin: string;
  placedAt: number;
  status: 'active' | 'won' | 'lost' | 'refunded';
}

export default function PredictionMarkets() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [myBets, setMyBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [betAmount, setBetAmount] = useState('');
  const [showBetModal, setShowBetModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('active');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockMarkets: Market[] = [
        {
          id: '1',
          question: 'Will ETH reach $3000 by end of month?',
          description: 'Ethereum price prediction for this month',
          category: 'crypto',
          outcomes: [
            { id: 'yes', name: 'Yes', odds: 1.8, pool: '50' },
            { id: 'no', name: 'No', odds: 2.2, pool: '40' },
          ],
          totalPool: '90',
          endTime: Date.now() + 15 * 24 * 3600000,
          status: 'active',
          creator: '0x1234567890123456789012345678901234567890',
        },
        {
          id: '2',
          question: 'Which team will win the championship?',
          description: 'NBA Finals prediction',
          category: 'sports',
          outcomes: [
            { id: 'lakers', name: 'Lakers', odds: 2.5, pool: '30' },
            { id: 'celtics', name: 'Celtics', odds: 2.0, pool: '45' },
            { id: 'heat', name: 'Heat', odds: 3.5, pool: '20' },
          ],
          totalPool: '95',
          endTime: Date.now() + 60 * 24 * 3600000,
          status: 'active',
          creator: '0x9876543210987654321098765432109876543210',
        },
        {
          id: '3',
          question: 'Will Bitcoin dominance exceed 60%?',
          description: 'Bitcoin market cap dominance by Q2',
          category: 'crypto',
          outcomes: [
            { id: 'yes', name: 'Yes', odds: 3.0, pool: '25' },
            { id: 'no', name: 'No', odds: 1.5, pool: '60' },
          ],
          totalPool: '85',
          endTime: Date.now() - 24 * 3600000,
          status: 'resolved',
          creator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          resolvedOutcome: 'no',
        },
      ];

      const mockBets: Bet[] = [
        {
          id: '1',
          marketId: '1',
          marketQuestion: 'Will ETH reach $3000 by end of month?',
          outcome: 'Yes',
          amount: '0.5',
          odds: 1.8,
          potentialWin: '0.9',
          placedAt: Date.now() - 24 * 3600000,
          status: 'active',
        },
        {
          id: '2',
          marketId: '3',
          marketQuestion: 'Will Bitcoin dominance exceed 60%?',
          outcome: 'No',
          amount: '1.0',
          odds: 1.5,
          potentialWin: '1.5',
          placedAt: Date.now() - 48 * 3600000,
          status: 'won',
        },
      ];

      setMarkets(mockMarkets);
      setMyBets(mockBets);
      setLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address]);

  const handlePlaceBet = async () => {
    if (!selectedMarket || !selectedOutcome || !betAmount || parseFloat(betAmount) <= 0) {
      alert(t('fillAllFields'));
      return;
    }

    const outcome = selectedMarket.outcomes.find((o) => o.id === selectedOutcome);
    if (!outcome) return;

    const newBet: Bet = {
      id: Date.now().toString(),
      marketId: selectedMarket.id,
      marketQuestion: selectedMarket.question,
      outcome: outcome.name,
      amount: betAmount,
      odds: outcome.odds,
      potentialWin: (parseFloat(betAmount) * outcome.odds).toFixed(3),
      placedAt: Date.now(),
      status: 'active',
    };

    setMyBets([newBet, ...myBets]);
    setShowBetModal(false);
    setBetAmount('');
    setSelectedOutcome('');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      crypto: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      sports: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      politics: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      entertainment: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
      tech: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    };
    return colors[category as keyof typeof colors] || colors.crypto;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      locked: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      resolved: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      won: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      lost: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      refunded: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getTimeRemaining = (endTime: number) => {
    const remaining = endTime - Date.now();
    if (remaining <= 0) return t('ended');
    const days = Math.floor(remaining / (24 * 3600000));
    const hours = Math.floor((remaining % (24 * 3600000)) / 3600000);
    return `${days}d ${hours}h`;
  };

  const filteredMarkets = markets.filter((market) => {
    if (filter === 'active' && market.status !== 'active') return false;
    if (filter === 'ended' && market.status === 'active') return false;
    if (categoryFilter !== 'all' && market.category !== categoryFilter) return false;
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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToBet')}</p>
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
          {t('predictionMarkets')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('betOnFutureOutcomes')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'active', 'ended'] as const).map((f) => (
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
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">{t('allCategories')}</option>
          <option value="crypto">{t('crypto')}</option>
          <option value="sports">{t('sports')}</option>
          <option value="politics">{t('politics')}</option>
          <option value="entertainment">{t('entertainment')}</option>
          <option value="tech">{t('tech')}</option>
        </select>
      </div>

      {/* Markets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMarkets.map((market) => (
          <div
            key={market.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(market.category)}`}>
                {market.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(market.status)}`}>
                {market.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {market.question}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{market.description}</p>

            <div className="space-y-2 mb-4">
              {market.outcomes.map((outcome) => (
                <button
                  key={outcome.id}
                  onClick={() => {
                    if (market.status === 'active') {
                      setSelectedMarket(market);
                      setSelectedOutcome(outcome.id);
                      setShowBetModal(true);
                    }
                  }}
                  disabled={market.status !== 'active'}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    market.resolvedOutcome === outcome.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {outcome.name}
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {outcome.odds}x
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {outcome.pool} ETH
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">{t('totalPool')}</p>
                <p className="font-bold text-gray-900 dark:text-white">{market.totalPool} ETH</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400">{t('endsIn')}</p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {getTimeRemaining(market.endTime)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* My Bets */}
      {myBets.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('myBets')}</h3>
          {myBets.map((bet) => (
            <div
              key={bet.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {bet.marketQuestion}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('bet')}: {bet.outcome}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bet.status)}`}>
                  {bet.status}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">{t('amount')}</p>
                  <p className="font-bold text-gray-900 dark:text-white">{bet.amount} ETH</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">{t('odds')}</p>
                  <p className="font-bold text-gray-900 dark:text-white">{bet.odds}x</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">{t('potentialWin')}</p>
                  <p className="font-bold text-green-600 dark:text-green-400">{bet.potentialWin} ETH</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">{t('placed')}</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(bet.placedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bet Modal */}
      {showBetModal && selectedMarket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('placeBet')}
            </h3>

            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedMarket.question}</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {t('betting')}: {selectedMarket.outcomes.find((o) => o.id === selectedOutcome)?.name}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {t('odds')}: {selectedMarket.outcomes.find((o) => o.id === selectedOutcome)?.odds}x
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('betAmount')} (ETH)
              </label>
              <input
                type="number"
                step="0.01"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {betAmount && parseFloat(betAmount) > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t('potentialWin')}:{' '}
                  <strong className="text-green-600 dark:text-green-400">
                    {(
                      parseFloat(betAmount) *
                      (selectedMarket.outcomes.find((o) => o.id === selectedOutcome)?.odds || 1)
                    ).toFixed(3)}{' '}
                    ETH
                  </strong>
                </p>
              )}
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ {t('betsAreNonRefundable')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBetModal(false);
                  setBetAmount('');
                  setSelectedOutcome('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handlePlaceBet}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
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

