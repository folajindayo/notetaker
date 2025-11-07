'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useTranslation } from '@/lib/i18n';
import { formatEther, parseEther } from 'viem';

interface Signer {
  address: string;
  name?: string;
  avatar?: string;
  hasSigned: boolean;
}

interface Transaction {
  id: string;
  to: string;
  value: string;
  data?: string;
  description: string;
  signers: Signer[];
  requiredSignatures: number;
  currentSignatures: number;
  status: 'pending' | 'executed' | 'cancelled';
  createdAt: number;
  executedAt?: number;
  createdBy: string;
}

interface MultiSigWalletInfo {
  address: string;
  balance: string;
  signers: Signer[];
  threshold: number;
  transactionCount: number;
}

export default function MultiSigWallet() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [walletInfo, setWalletInfo] = useState<MultiSigWalletInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'executed' | 'all'>('pending');

  // Create transaction form state
  const [newTx, setNewTx] = useState({
    to: '',
    value: '',
    description: '',
    data: '',
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    const loadWalletData = async () => {
      if (!address) return;

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      const mockWalletInfo: MultiSigWalletInfo = {
        address: '0x1234567890123456789012345678901234567890',
        balance: '5.5',
        signers: [
          {
            address: address,
            name: 'You',
            hasSigned: false,
          },
          {
            address: '0x9876543210987654321098765432109876543210',
            name: 'Alice',
            hasSigned: false,
          },
          {
            address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            name: 'Bob',
            hasSigned: false,
          },
        ],
        threshold: 2,
        transactionCount: 5,
      };

      const mockTransactions: Transaction[] = [
        {
          id: '1',
          to: '0x1111111111111111111111111111111111111111',
          value: '1.5',
          description: 'Payment to contractor',
          signers: [
            { ...mockWalletInfo.signers[0], hasSigned: true },
            { ...mockWalletInfo.signers[1], hasSigned: false },
            { ...mockWalletInfo.signers[2], hasSigned: false },
          ],
          requiredSignatures: 2,
          currentSignatures: 1,
          status: 'pending',
          createdAt: Date.now() - 3600000,
          createdBy: address,
        },
        {
          id: '2',
          to: '0x2222222222222222222222222222222222222222',
          value: '0.5',
          description: 'Monthly subscription',
          signers: [
            { ...mockWalletInfo.signers[0], hasSigned: true },
            { ...mockWalletInfo.signers[1], hasSigned: true },
            { ...mockWalletInfo.signers[2], hasSigned: false },
          ],
          requiredSignatures: 2,
          currentSignatures: 2,
          status: 'pending',
          createdAt: Date.now() - 7200000,
          createdBy: mockWalletInfo.signers[1].address,
        },
        {
          id: '3',
          to: '0x3333333333333333333333333333333333333333',
          value: '2.0',
          description: 'Marketing budget',
          signers: [
            { ...mockWalletInfo.signers[0], hasSigned: true },
            { ...mockWalletInfo.signers[1], hasSigned: true },
            { ...mockWalletInfo.signers[2], hasSigned: true },
          ],
          requiredSignatures: 2,
          currentSignatures: 3,
          status: 'executed',
          createdAt: Date.now() - 86400000,
          executedAt: Date.now() - 82800000,
          createdBy: mockWalletInfo.signers[2].address,
        },
      ];

      setWalletInfo(mockWalletInfo);
      setTransactions(mockTransactions);
      setLoading(false);
    };

    loadWalletData();
  }, [address]);

  const handleSignTransaction = async (txId: string) => {
    // In production, call the smart contract's sign function
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === txId) {
          const updatedSigners = tx.signers.map((signer) =>
            signer.address.toLowerCase() === address?.toLowerCase()
              ? { ...signer, hasSigned: true }
              : signer
          );
          return {
            ...tx,
            signers: updatedSigners,
            currentSignatures: updatedSigners.filter((s) => s.hasSigned).length,
          };
        }
        return tx;
      })
    );
  };

  const handleExecuteTransaction = async (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx || tx.currentSignatures < tx.requiredSignatures) {
      alert(t('notEnoughSignatures'));
      return;
    }

    // In production, call the smart contract's execute function
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? { ...t, status: 'executed' as const, executedAt: Date.now() }
          : t
      )
    );
  };

  const handleCreateTransaction = async () => {
    if (!newTx.to || !newTx.value || !newTx.description) {
      alert(t('pleaseFillAllFields'));
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      to: newTx.to,
      value: newTx.value,
      data: newTx.data,
      description: newTx.description,
      signers: walletInfo!.signers.map((s) => ({ ...s, hasSigned: false })),
      requiredSignatures: walletInfo!.threshold,
      currentSignatures: 0,
      status: 'pending',
      createdAt: Date.now(),
      createdBy: address!,
    };

    setTransactions([transaction, ...transactions]);
    setShowCreateModal(false);
    setNewTx({ to: '', value: '', description: '', data: '' });
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === 'pending') return tx.status === 'pending';
    if (activeTab === 'executed') return tx.status === 'executed';
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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToAccess')}</p>
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

  if (!walletInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">{t('noMultiSigWallet')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t('multiSigWallet')}</h2>
            <p className="text-purple-100 text-sm font-mono">{walletInfo.address.slice(0, 20)}...</p>
          </div>
          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            {walletInfo.threshold}/{walletInfo.signers.length} {t('signaturesRequired')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-purple-100 mb-1">{t('balance')}</p>
            <p className="text-3xl font-bold">{walletInfo.balance} ETH</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-purple-100 mb-1">{t('signers')}</p>
            <p className="text-3xl font-bold">{walletInfo.signers.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-purple-100 mb-1">{t('totalTransactions')}</p>
            <p className="text-3xl font-bold">{walletInfo.transactionCount}</p>
          </div>
        </div>
      </div>

      {/* Signers List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('signers')}</h3>
        <div className="space-y-3">
          {walletInfo.signers.map((signer, index) => (
            <div
              key={signer.address}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {signer.name?.[0] || index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {signer.name || `Signer ${index + 1}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {signer.address.slice(0, 10)}...{signer.address.slice(-8)}
                  </p>
                </div>
              </div>
              {signer.address.toLowerCase() === address.toLowerCase() && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded">
                  {t('you')}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Header with Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {(['pending', 'executed', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t(tab)}
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">
                {tab === 'pending'
                  ? transactions.filter((tx) => tx.status === 'pending').length
                  : tab === 'executed'
                  ? transactions.filter((tx) => tx.status === 'executed').length
                  : transactions.length}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('newTransaction')}
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
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
            <p className="text-gray-600 dark:text-gray-400">{t('noTransactions')}</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const canSign =
              tx.status === 'pending' &&
              !tx.signers.find((s) => s.address.toLowerCase() === address.toLowerCase())?.hasSigned;
            const canExecute = tx.status === 'pending' && tx.currentSignatures >= tx.requiredSignatures;

            return (
              <div
                key={tx.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-white">{tx.description}</h4>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.status === 'pending'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        {t('to')}: {tx.to.slice(0, 10)}...{tx.to.slice(-8)}
                      </p>
                      <p>
                        {t('amount')}: <strong className="text-gray-900 dark:text-white">{tx.value} ETH</strong>
                      </p>
                      <p>{t('created')}: {new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {tx.currentSignatures}/{tx.requiredSignatures}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('signatures')}</p>
                  </div>
                </div>

                {/* Signers */}
                <div className="flex items-center gap-2 mb-4">
                  {tx.signers.map((signer) => (
                    <div
                      key={signer.address}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        signer.hasSigned
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}
                      title={signer.name || signer.address}
                    >
                      {signer.hasSigned ? '✓' : '?'}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {tx.status === 'pending' && (
                  <div className="flex gap-2">
                    {canSign && (
                      <button
                        onClick={() => handleSignTransaction(tx.id)}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                      >
                        {t('sign')}
                      </button>
                    )}
                    {canExecute && (
                      <button
                        onClick={() => handleExecuteTransaction(tx.id)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                      >
                        {t('execute')}
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedTransaction(tx)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {t('details')}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Transaction Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('createTransaction')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('recipientAddress')}
                </label>
                <input
                  type="text"
                  value={newTx.to}
                  onChange={(e) => setNewTx({ ...newTx, to: e.target.value })}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('amount')} (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTx.value}
                  onChange={(e) => setNewTx({ ...newTx, value: e.target.value })}
                  placeholder="0.0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('description')}
                </label>
                <input
                  type="text"
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                  placeholder={t('whatIsThisFor')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCreateTransaction}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

