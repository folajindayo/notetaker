'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface VerificationBadgeProps {
  address: string;
  username?: string;
  badges?: VerificationBadge[];
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

interface VerificationBadge {
  type: 'verified' | 'developer' | 'creator' | 'moderator' | 'early-adopter' | 'supporter';
  verified: boolean;
  verifiedAt?: number;
  metadata?: Record<string, any>;
}

interface BadgeInfo {
  type: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
}

const BADGE_INFO: Record<string, BadgeInfo> = {
  verified: {
    type: 'verified',
    name: 'Verified Account',
    description: 'This account has been verified as authentic',
    icon: '✓',
    color: 'blue',
    requirement: 'Complete identity verification',
  },
  developer: {
    type: 'developer',
    name: 'Developer',
    description: 'Active contributor to the platform',
    icon: '⚡',
    color: 'purple',
    requirement: 'Contribute to open-source code',
  },
  creator: {
    type: 'creator',
    name: 'Content Creator',
    description: 'Recognized content creator',
    icon: '🎨',
    color: 'pink',
    requirement: 'Create high-quality content consistently',
  },
  moderator: {
    type: 'moderator',
    name: 'Moderator',
    description: 'Community moderator',
    icon: '🛡️',
    color: 'green',
    requirement: 'Selected by community governance',
  },
  'early-adopter': {
    type: 'early-adopter',
    name: 'Early Adopter',
    description: 'One of the first users',
    icon: '🌟',
    color: 'yellow',
    requirement: 'Join within first 1000 users',
  },
  supporter: {
    type: 'supporter',
    name: 'Supporter',
    description: 'Financial supporter of the platform',
    icon: '💎',
    color: 'orange',
    requirement: 'Hold platform tokens or NFT',
  },
};

export default function VerificationBadge({
  address,
  username,
  badges = [],
  size = 'md',
  showTooltip = true,
}: VerificationBadgeProps) {
  const { address: connectedAddress } = useAccount();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [applyingFor, setApplyingFor] = useState<string | null>(null);

  const isOwner = connectedAddress?.toLowerCase() === address.toLowerCase();

  const getBadgeSize = () => {
    const sizes = {
      sm: 'w-4 h-4 text-xs',
      md: 'w-5 h-5 text-sm',
      lg: 'w-6 h-6 text-base',
    };
    return sizes[size];
  };

  const getBadgeColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500 text-white',
      purple: 'bg-purple-500 text-white',
      pink: 'bg-pink-500 text-white',
      green: 'bg-green-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      orange: 'bg-orange-500 text-white',
    };
    return colors[color] || colors.blue;
  };

  const verifiedBadges = badges.filter((b) => b.verified);

  if (verifiedBadges.length === 0 && !isOwner) {
    return null;
  }

  return (
    <>
      <div className="inline-flex items-center gap-1">
        {verifiedBadges.map((badge) => {
          const info = BADGE_INFO[badge.type];
          if (!info) return null;

          return (
            <div key={badge.type} className="relative group">
              <div
                className={`${getBadgeSize()} ${getBadgeColor(
                  info.color
                )} rounded-full flex items-center justify-center font-bold cursor-help`}
              >
                {info.icon}
              </div>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <div className="font-semibold mb-1">{info.name}</div>
                  <div className="text-gray-300">{info.description}</div>
                  {badge.verifiedAt && (
                    <div className="text-gray-400 text-xs mt-1">
                      {t('since')} {new Date(badge.verifiedAt).toLocaleDateString()}
                    </div>
                  )}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                </div>
              )}
            </div>
          );
        })}

        {isOwner && verifiedBadges.length < 6 && (
          <button
            onClick={() => setShowModal(true)}
            className="w-5 h-5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        )}
      </div>

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('verificationBadges')}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {t('earnBadgesByMeetingCriteria')}
              </p>
            </div>

            {/* Badge List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {Object.values(BADGE_INFO).map((info) => {
                const hasBadge = badges.some((b) => b.type === info.type && b.verified);
                const badge = badges.find((b) => b.type === info.type);

                return (
                  <div
                    key={info.type}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      hasBadge
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 ${getBadgeColor(
                          info.color
                        )} rounded-xl flex items-center justify-center text-2xl ${
                          !hasBadge ? 'opacity-50' : ''
                        }`}
                      >
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">{info.name}</h3>
                          {hasBadge && (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded font-medium">
                              ✓ {t('verified')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {info.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {info.requirement}
                        </div>
                        {hasBadge && badge?.verifiedAt && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {t('earned')} {new Date(badge.verifiedAt).toLocaleDateString()}
                          </p>
                        )}
                        {!hasBadge && (
                          <button
                            onClick={() => setApplyingFor(info.type)}
                            className="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 font-medium"
                          >
                            {t('applyForBadge')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t('badgeApplicationsReviewedManually')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {applyingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('applyFor')} {BADGE_INFO[applyingFor]?.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t('explainWhyYouQualify')}
            </p>

            <textarea
              rows={4}
              placeholder={t('describeYourQualifications')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setApplyingFor(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  // Submit application
                  alert(t('applicationSubmitted'));
                  setApplyingFor(null);
                  setShowModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Standalone component for displaying all badges with details
export function VerificationBadgeList({
  address,
  badges = [],
}: {
  address: string;
  badges?: VerificationBadge[];
}) {
  const { t } = useTranslation();
  const verifiedBadges = badges.filter((b) => b.verified);

  if (verifiedBadges.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        {t('noBadgesYet')}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {verifiedBadges.map((badge) => {
        const info = BADGE_INFO[badge.type];
        if (!info) return null;

        return (
          <div
            key={badge.type}
            className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-10 h-10 ${
                  info.color === 'blue'
                    ? 'bg-blue-500'
                    : info.color === 'purple'
                    ? 'bg-purple-500'
                    : info.color === 'pink'
                    ? 'bg-pink-500'
                    : info.color === 'green'
                    ? 'bg-green-500'
                    : info.color === 'yellow'
                    ? 'bg-yellow-500'
                    : 'bg-orange-500'
                } text-white rounded-lg flex items-center justify-center text-xl`}
              >
                {info.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white">{info.name}</h4>
                {badge.verifiedAt && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('since')} {new Date(badge.verifiedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{info.description}</p>
          </div>
        );
      })}
    </div>
  );
}

