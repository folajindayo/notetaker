'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface Guardian {
  id: string;
  address: string;
  name: string;
  email?: string;
  status: 'pending' | 'active' | 'removed';
  addedAt: number;
  lastActive?: number;
}

interface RecoveryRequest {
  id: string;
  requester: string;
  newOwner: string;
  approvals: string[];
  threshold: number;
  createdAt: number;
  expiresAt: number;
  status: 'pending' | 'approved' | 'executed' | 'cancelled';
}

export default function SocialRecoveryWallet() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [recoveryRequests, setRecoveryRequests] = useState<RecoveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(2);
  const [newGuardianAddress, setNewGuardianAddress] = useState('');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianEmail, setNewGuardianEmail] = useState('');
  const [showAddGuardian, setShowAddGuardian] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockGuardians: Guardian[] = [
        {
          id: '1',
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          name: 'alice.eth',
          email: 'alice@example.com',
          status: 'active',
          addedAt: Date.now() - 90 * 24 * 3600000,
          lastActive: Date.now() - 2 * 24 * 3600000,
        },
        {
          id: '2',
          address: '0x9876543210987654321098765432109876543210',
          name: 'bob.eth',
          email: 'bob@example.com',
          status: 'active',
          addedAt: Date.now() - 60 * 24 * 3600000,
          lastActive: Date.now() - 5 * 24 * 3600000,
        },
        {
          id: '3',
          address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          name: 'charlie.eth',
          status: 'pending',
          addedAt: Date.now() - 7 * 24 * 3600000,
        },
      ];

      const mockRecoveryRequests: RecoveryRequest[] = [
        {
          id: '1',
          requester: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          newOwner: '0xNewOwnerAddress123456789012345678901234567',
          approvals: ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'],
          threshold: 2,
          createdAt: Date.now() - 12 * 3600000,
          expiresAt: Date.now() + 60 * 3600000,
          status: 'pending',
        },
      ];

      setGuardians(mockGuardians);
      setRecoveryRequests(mockRecoveryRequests);
      setLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address]);

  const handleAddGuardian = () => {
    if (!newGuardianAddress || !newGuardianName) {
      alert(t('fillRequiredFields'));
      return;
    }

    const newGuardian: Guardian = {
      id: Date.now().toString(),
      address: newGuardianAddress,
      name: newGuardianName,
      email: newGuardianEmail || undefined,
      status: 'pending',
      addedAt: Date.now(),
    };

    setGuardians([...guardians, newGuardian]);
    setShowAddGuardian(false);
    setNewGuardianAddress('');
    setNewGuardianName('');
    setNewGuardianEmail('');
  };

  const handleRemoveGuardian = (guardianId: string) => {
    setGuardians(
      guardians.map((g) => (g.id === guardianId ? { ...g, status: 'removed' as const } : g))
    );
  };

  const handleInitiateRecovery = () => {
    if (!newOwnerAddress) {
      alert(t('enterNewOwnerAddress'));
      return;
    }

    const newRequest: RecoveryRequest = {
      id: Date.now().toString(),
      requester: address || '',
      newOwner: newOwnerAddress,
      approvals: [],
      threshold: threshold,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 3600000,
      status: 'pending',
    };

    setRecoveryRequests([newRequest, ...recoveryRequests]);
    setShowRecoveryModal(false);
    setNewOwnerAddress('');
  };

  const handleApproveRecovery = (requestId: string) => {
    setRecoveryRequests(
      recoveryRequests.map((r) =>
        r.id === requestId ? { ...r, approvals: [...r.approvals, address || ''] } : r
      )
    );
  };

  const handleCancelRecovery = (requestId: string) => {
    setRecoveryRequests(
      recoveryRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'cancelled' as const } : r
      )
    );
  };

  const activeGuardians = guardians.filter((g) => g.status === 'active');
  const pendingGuardians = guardians.filter((g) => g.status === 'pending');
  const activeRecoveryRequests = recoveryRequests.filter((r) => r.status === 'pending');

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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToManageRecovery')}</p>
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
          {t('socialRecoveryWallet')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('recoverWalletWithGuardians')}
        </p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-xs opacity-90">{t('activeGuardians')}</p>
          <p className="text-2xl font-bold mt-1">{activeGuardians.length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
          <p className="text-xs opacity-90">{t('pendingGuardians')}</p>
          <p className="text-2xl font-bold mt-1">{pendingGuardians.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <p className="text-xs opacity-90">{t('recoveryThreshold')}</p>
          <p className="text-2xl font-bold mt-1">{threshold}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
          <p className="text-xs opacity-90">{t('activeRequests')}</p>
          <p className="text-2xl font-bold mt-1">{activeRecoveryRequests.length}</p>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              {t('socialRecoveryInfo')}
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {t('socialRecoveryDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Guardians Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('guardians')}
          </h3>
          <button
            onClick={() => setShowAddGuardian(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            + {t('addGuardian')}
          </button>
        </div>

        {guardians.filter((g) => g.status !== 'removed').map((guardian) => (
          <div
            key={guardian.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {guardian.name}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      guardian.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                    }`}
                  >
                    {guardian.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mb-1">
                  {guardian.address}
                </p>
                {guardian.email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{guardian.email}</p>
                )}
                <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                  <span>{t('added')}: {new Date(guardian.addedAt).toLocaleDateString()}</span>
                  {guardian.lastActive && (
                    <span>
                      {t('lastActive')}: {new Date(guardian.lastActive).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              {guardian.status === 'active' && (
                <button
                  onClick={() => handleRemoveGuardian(guardian.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm"
                >
                  {t('remove')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recovery Threshold */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('recoveryThreshold')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t('recoveryThresholdDescription')}
        </p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="1"
            max={activeGuardians.length}
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <span className="text-gray-600 dark:text-gray-400">
            / {activeGuardians.length} {t('guardians')}
          </span>
        </div>
      </div>

      {/* Recovery Requests */}
      {activeRecoveryRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('recoveryRequests')}
          </h3>
          {activeRecoveryRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 border-orange-200 dark:border-orange-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                    {t('walletRecoveryRequest')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('initiatedBy')}: {request.requester.substring(0, 10)}...
                  </p>
                </div>
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium">
                  {request.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('newOwner')}:</p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    {request.newOwner}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {t('approvals')}: {request.approvals.length} / {request.threshold}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(request.approvals.length / request.threshold) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>
                    {t('created')}: {new Date(request.createdAt).toLocaleString()}
                  </span>
                  <span>
                    {t('expires')}: {new Date(request.expiresAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                {!request.approvals.includes(address || '') && (
                  <button
                    onClick={() => handleApproveRecovery(request.id)}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                  >
                    {t('approve')}
                  </button>
                )}
                <button
                  onClick={() => handleCancelRecovery(request.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Initiate Recovery */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('initiateRecovery')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t('initiateRecoveryDescription')}
        </p>
        <button
          onClick={() => setShowRecoveryModal(true)}
          disabled={activeGuardians.length < threshold}
          className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('initiateWalletRecovery')}
        </button>
      </div>

      {/* Add Guardian Modal */}
      {showAddGuardian && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('addGuardian')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('guardianAddress')} *
                </label>
                <input
                  type="text"
                  value={newGuardianAddress}
                  onChange={(e) => setNewGuardianAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('name')} *
                </label>
                <input
                  type="text"
                  value={newGuardianName}
                  onChange={(e) => setNewGuardianName(e.target.value)}
                  placeholder="alice.eth"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('email')} ({t('optional')})
                </label>
                <input
                  type="email"
                  value={newGuardianEmail}
                  onChange={(e) => setNewGuardianEmail(e.target.value)}
                  placeholder="alice@example.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddGuardian(false);
                  setNewGuardianAddress('');
                  setNewGuardianName('');
                  setNewGuardianEmail('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddGuardian}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                {t('add')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Initiate Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('initiateWalletRecovery')}
            </h3>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg mb-4">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                ⚠️ {t('recoveryWarning')}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('newOwnerAddress')}
              </label>
              <input
                type="text"
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRecoveryModal(false);
                  setNewOwnerAddress('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleInitiateRecovery}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
              >
                {t('initiate')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

