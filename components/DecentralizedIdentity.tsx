'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface Credential {
  id: string;
  type: 'email' | 'phone' | 'github' | 'twitter' | 'discord' | 'kyc' | 'proof-of-humanity';
  issuer: string;
  issuedAt: number;
  expiresAt?: number;
  status: 'verified' | 'pending' | 'expired' | 'revoked';
  attestationId?: string;
  visibility: 'public' | 'private';
}

interface VerificationMethod {
  type: string;
  name: string;
  icon: string;
  description: string;
  required: boolean;
  trustScore: number;
}

interface TrustScore {
  overall: number;
  components: {
    credentials: number;
    socialProof: number;
    onChainActivity: number;
    reputation: number;
  };
  level: 'unverified' | 'basic' | 'verified' | 'trusted' | 'elite';
}

export default function DecentralizedIdentity() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [trustScore, setTrustScore] = useState<TrustScore>({
    overall: 0,
    components: {
      credentials: 0,
      socialProof: 0,
      onChainActivity: 0,
      reputation: 0,
    },
    level: 'unverified',
  });
  const [loading, setLoading] = useState(true);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

  const verificationMethods: VerificationMethod[] = [
    {
      type: 'email',
      name: t('emailVerification'),
      icon: '📧',
      description: t('verifyEmailAddress'),
      required: true,
      trustScore: 10,
    },
    {
      type: 'phone',
      name: t('phoneVerification'),
      icon: '📱',
      description: t('verifyPhoneNumber'),
      required: false,
      trustScore: 15,
    },
    {
      type: 'github',
      name: 'GitHub',
      icon: '🐙',
      description: t('linkGitHubAccount'),
      required: false,
      trustScore: 20,
    },
    {
      type: 'twitter',
      name: 'Twitter/X',
      icon: '🐦',
      description: t('linkTwitterAccount'),
      required: false,
      trustScore: 15,
    },
    {
      type: 'discord',
      name: 'Discord',
      icon: '💬',
      description: t('linkDiscordAccount'),
      required: false,
      trustScore: 10,
    },
    {
      type: 'kyc',
      name: t('kycVerification'),
      icon: '🆔',
      description: t('completeKYCProcess'),
      required: false,
      trustScore: 30,
    },
    {
      type: 'proof-of-humanity',
      name: t('proofOfHumanity'),
      icon: '👤',
      description: t('verifyYouAreHuman'),
      required: false,
      trustScore: 25,
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockCredentials: Credential[] = [
        {
          id: '1',
          type: 'email',
          issuer: 'NoteBoard',
          issuedAt: Date.now() - 30 * 24 * 3600000,
          status: 'verified',
          attestationId: '0xabc123...',
          visibility: 'public',
        },
        {
          id: '2',
          type: 'github',
          issuer: 'GitHub',
          issuedAt: Date.now() - 15 * 24 * 3600000,
          status: 'verified',
          attestationId: '0xdef456...',
          visibility: 'public',
        },
        {
          id: '3',
          type: 'twitter',
          issuer: 'Twitter',
          issuedAt: Date.now() - 7 * 24 * 3600000,
          status: 'verified',
          attestationId: '0xghi789...',
          visibility: 'public',
        },
      ];

      setCredentials(mockCredentials);

      // Calculate trust score
      const credentialScore = (mockCredentials.length / verificationMethods.length) * 100;
      const socialProof = 75;
      const onChainActivity = 60;
      const reputation = 80;
      const overall = (credentialScore + socialProof + onChainActivity + reputation) / 4;

      let level: TrustScore['level'] = 'unverified';
      if (overall >= 80) level = 'elite';
      else if (overall >= 60) level = 'trusted';
      else if (overall >= 40) level = 'verified';
      else if (overall >= 20) level = 'basic';

      setTrustScore({
        overall: Math.round(overall),
        components: {
          credentials: Math.round(credentialScore),
          socialProof,
          onChainActivity,
          reputation,
        },
        level,
      });

      setLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address]);

  const handleVerify = async () => {
    if (!selectedMethod) return;

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newCredential: Credential = {
      id: Date.now().toString(),
      type: selectedMethod.type as Credential['type'],
      issuer: selectedMethod.name,
      issuedAt: Date.now(),
      status: 'verified',
      attestationId: `0x${Math.random().toString(16).slice(2, 10)}...`,
      visibility: 'public',
    };

    setCredentials([...credentials, newCredential]);
    setShowVerifyModal(false);
    setVerificationCode('');
    setSelectedMethod(null);
  };

  const getTrustLevelColor = (level: string) => {
    const colors = {
      unverified: 'text-gray-500',
      basic: 'text-blue-500',
      verified: 'text-green-500',
      trusted: 'text-purple-500',
      elite: 'text-orange-500',
    };
    return colors[level as keyof typeof colors] || colors.unverified;
  };

  const getTrustLevelBg = (level: string) => {
    const colors = {
      unverified: 'bg-gray-100 dark:bg-gray-700',
      basic: 'bg-blue-100 dark:bg-blue-900/30',
      verified: 'bg-green-100 dark:bg-green-900/30',
      trusted: 'bg-purple-100 dark:bg-purple-900/30',
      elite: 'bg-orange-100 dark:bg-orange-900/30',
    };
    return colors[level as keyof typeof colors] || colors.unverified;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      verified: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      expired: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      revoked: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToManageIdentity')}</p>
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
          {t('decentralizedIdentity')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('buildYourOnChainReputation')}
        </p>
      </div>

      {/* Trust Score Overview */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('trustScore')}</h3>
            <div className="flex items-end gap-4">
              <div className="text-6xl font-bold">{trustScore.overall}</div>
              <div className="mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${getTrustLevelBg(
                    trustScore.level
                  )} ${getTrustLevelColor(trustScore.level)}`}
                >
                  {trustScore.level.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl mb-2">🛡️</div>
            <p className="text-sm text-purple-100">
              {credentials.length}/{verificationMethods.length} {t('verified')}
            </p>
          </div>
        </div>

        {/* Score Components */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-purple-100 mb-1">{t('credentials')}</p>
            <p className="text-2xl font-bold">{trustScore.components.credentials}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-purple-100 mb-1">{t('socialProof')}</p>
            <p className="text-2xl font-bold">{trustScore.components.socialProof}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-purple-100 mb-1">{t('onChainActivity')}</p>
            <p className="text-2xl font-bold">{trustScore.components.onChainActivity}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-purple-100 mb-1">{t('reputation')}</p>
            <p className="text-2xl font-bold">{trustScore.components.reputation}</p>
          </div>
        </div>
      </div>

      {/* Your Credentials */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('yourCredentials')}
        </h3>
        {credentials.length === 0 ? (
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">{t('noCredentialsYet')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentials.map((credential) => {
              const method = verificationMethods.find((m) => m.type === credential.type);
              return (
                <div
                  key={credential.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{method?.icon}</span>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{method?.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t('issuedBy')} {credential.issuer}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        credential.status
                      )}`}
                    >
                      {credential.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('issued')}:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(credential.issuedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {credential.attestationId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('attestation')}:</span>
                        <span className="text-blue-500 font-mono text-xs">
                          {credential.attestationId}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('visibility')}:</span>
                      <span className="text-gray-900 dark:text-white capitalize">
                        {credential.visibility}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Verifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('availableVerifications')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {verificationMethods.map((method) => {
            const isVerified = credentials.some(
              (c) => c.type === method.type && c.status === 'verified'
            );
            return (
              <div
                key={method.type}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 transition-all ${
                  isVerified
                    ? 'border-green-500 dark:border-green-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{method.icon}</span>
                  {isVerified && (
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{method.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {method.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {t('trustScore')}:
                  </span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    +{method.trustScore}
                  </span>
                </div>

                {!isVerified && (
                  <button
                    onClick={() => {
                      setSelectedMethod(method);
                      setShowVerifyModal(true);
                    }}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                  >
                    {t('verify')}
                  </button>
                )}
                {isVerified && (
                  <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-center font-medium">
                    ✓ {t('verified')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Modal */}
      {showVerifyModal && selectedMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 inline-block">{selectedMethod.icon}</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('verify')} {selectedMethod.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedMethod.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {t('verificationProcess')}:
                </p>
                <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                  <li>{t('connectAccount')}</li>
                  <li>{t('receiveVerificationCode')}</li>
                  <li>{t('enterCode')}</li>
                  <li>{t('receiveAttestation')}</li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('verificationCode')}
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl font-mono"
                  maxLength={6}
                />
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-xs text-green-800 dark:text-green-200">
                  ✓ {t('trustScoreBonus')}: +{selectedMethod.trustScore} {t('points')}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowVerifyModal(false);
                  setVerificationCode('');
                  setSelectedMethod(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleVerify}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('verify')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

