'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useTranslation } from '@/lib/i18n';
import { parseEther, formatEther } from 'viem';

interface Chain {
  id: number;
  name: string;
  shortName: string;
  icon: string;
  nativeToken: string;
  rpcUrl: string;
  explorerUrl: string;
}

interface BridgeTransaction {
  id: string;
  fromChain: Chain;
  toChain: Chain;
  amount: string;
  token: string;
  status: 'pending' | 'bridging' | 'completed' | 'failed';
  initiatedAt: number;
  completedAt?: number;
  txHash?: string;
  estimatedTime: number;
}

const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 8453,
    name: 'Base',
    shortName: 'BASE',
    icon: '🔵',
    nativeToken: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
  },
  {
    id: 1,
    name: 'Ethereum',
    shortName: 'ETH',
    icon: '⚡',
    nativeToken: 'ETH',
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
  },
  {
    id: 10,
    name: 'Optimism',
    shortName: 'OP',
    icon: '🔴',
    nativeToken: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
  },
  {
    id: 137,
    name: 'Polygon',
    shortName: 'MATIC',
    icon: '🟣',
    nativeToken: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    shortName: 'ARB',
    icon: '🔷',
    nativeToken: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
  },
];

export default function CrossChainBridge() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { t } = useTranslation();
  const [fromChain, setFromChain] = useState<Chain>(SUPPORTED_CHAINS[0]);
  const [toChain, setToChain] = useState<Chain>(SUPPORTED_CHAINS[1]);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [estimatedFee, setEstimatedFee] = useState('0.001');
  const [estimatedTime, setEstimatedTime] = useState(15);

  useEffect(() => {
    // Load previous transactions
    if (address) {
      const saved = localStorage.getItem(`bridgeTransactions_${address}`);
      if (saved) {
        setTransactions(JSON.parse(saved));
      }
    }
  }, [address]);

  useEffect(() => {
    // Calculate estimated fee and time based on chains
    if (fromChain.id === 1) {
      setEstimatedFee('0.005');
      setEstimatedTime(30);
    } else if (toChain.id === 1) {
      setEstimatedFee('0.003');
      setEstimatedTime(20);
    } else {
      setEstimatedFee('0.001');
      setEstimatedTime(10);
    }
  }, [fromChain, toChain]);

  const handleSwapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert(t('enterValidAmount'));
      return;
    }

    if (fromChain.id === toChain.id) {
      alert(t('selectDifferentChains'));
      return;
    }

    setLoading(true);

    // Simulate bridge transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newTransaction: BridgeTransaction = {
      id: Date.now().toString(),
      fromChain,
      toChain,
      amount,
      token: fromChain.nativeToken,
      status: 'bridging',
      initiatedAt: Date.now(),
      estimatedTime: estimatedTime * 60 * 1000,
      txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    
    if (address) {
      localStorage.setItem(`bridgeTransactions_${address}`, JSON.stringify(updatedTransactions));
    }

    // Simulate completion after estimated time
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === newTransaction.id
            ? { ...tx, status: 'completed', completedAt: Date.now() }
            : tx
        )
      );
    }, 5000);

    setLoading(false);
    setAmount('');
    setShowTransactions(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      bridging: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getTimeRemaining = (tx: BridgeTransaction) => {
    if (tx.status === 'completed') return t('completed');
    if (tx.status === 'failed') return t('failed');

    const elapsed = Date.now() - tx.initiatedAt;
    const remaining = tx.estimatedTime - elapsed;

    if (remaining <= 0) return t('finalizing');

    const minutes = Math.ceil(remaining / 60000);
    return `~${minutes} ${t('minutes')}`;
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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToBridge')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('crossChainBridge')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('bridgeAssetsAcrossChains')}
          </p>
        </div>
        <button
          onClick={() => setShowTransactions(!showTransactions)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
        >
          {t('history')}
        </button>
      </div>

      {/* Bridge Interface */}
      {!showTransactions && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          {/* From Chain */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('from')}
            </label>
            <div className="relative">
              <select
                value={fromChain.id}
                onChange={(e) => {
                  const chain = SUPPORTED_CHAINS.find((c) => c.id === parseInt(e.target.value));
                  if (chain) setFromChain(chain);
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer"
              >
                {SUPPORTED_CHAINS.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.icon} {chain.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3">
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-4 text-2xl border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {balance && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {t('balance')}: {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </p>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center my-4">
            <button
              onClick={handleSwapChains}
              className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Chain */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('to')}
            </label>
            <select
              value={toChain.id}
              onChange={(e) => {
                const chain = SUPPORTED_CHAINS.find((c) => c.id === parseInt(e.target.value));
                if (chain) setToChain(chain);
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer"
            >
              {SUPPORTED_CHAINS.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.icon} {chain.name}
                </option>
              ))}
            </select>
            {amount && parseFloat(amount) > 0 && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('youWillReceive')}:{' '}
                  <strong className="text-gray-900 dark:text-white">
                    {(parseFloat(amount) - parseFloat(estimatedFee)).toFixed(4)} {toChain.nativeToken}
                  </strong>
                </p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t('estimatedFee')}:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {estimatedFee} {fromChain.nativeToken}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t('estimatedTime')}:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ~{estimatedTime} {t('minutes')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t('route')}:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {t('optimized')}
              </span>
            </div>
          </div>

          {/* Bridge Button */}
          <button
            onClick={handleBridge}
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                {t('bridging')}...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('bridgeAssets')}
              </>
            )}
          </button>

          {/* Warning */}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              ⚠️ {t('bridgeWarning')}
            </p>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {showTransactions && (
        <div className="space-y-4">
          <button
            onClick={() => setShowTransactions(false)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToBridge')}
          </button>

          {transactions.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">{t('noTransactionsYet')}</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{tx.fromChain.icon}</span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span className="text-3xl">{tx.toChain.icon}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {tx.amount} {tx.token}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tx.fromChain.shortName} → {tx.toChain.shortName}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('initiated')}:</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(tx.initiatedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('status')}:</span>
                    <span className="text-gray-900 dark:text-white">{getTimeRemaining(tx)}</span>
                  </div>
                  {tx.txHash && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('txHash')}:</span>
                      <a
                        href={`${tx.fromChain.explorerUrl}/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 font-mono text-xs"
                      >
                        {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

