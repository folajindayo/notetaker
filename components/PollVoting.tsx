'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdAt: number;
  expiresAt: number;
  totalVotes: number;
  isActive: boolean;
  allowMultipleVotes: boolean;
  isOnChain: boolean;
}

interface PollVotingProps {
  poll: Poll;
  onVote?: (optionId: string) => void;
  compact?: boolean;
}

export default function PollVoting({ poll, onVote, compact = false }: PollVotingProps) {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userVotes, setUserVotes] = useState<string[]>([]);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    // Check if user has already voted
    if (address && poll) {
      const voted = poll.options.some((option) =>
        option.voters.includes(address.toLowerCase())
      );
      setHasVoted(voted);

      // Get user's votes
      const votes = poll.options
        .filter((option) => option.voters.includes(address.toLowerCase()))
        .map((option) => option.id);
      setUserVotes(votes);

      // Show results if user has voted or poll expired
      const isExpired = Date.now() > poll.expiresAt;
      setShowResults(voted || isExpired || !poll.isActive);
    }
  }, [address, poll]);

  const handleVote = async (optionId: string) => {
    if (!isConnected) {
      alert(t('connectWalletToVote'));
      return;
    }

    if (hasVoted && !poll.allowMultipleVotes) {
      alert(t('alreadyVoted'));
      return;
    }

    setSelectedOption(optionId);

    if (poll.isOnChain) {
      // On-chain voting
      try {
        writeContract({
          address: '0x...' as `0x${string}`, // Poll contract address
          abi: [], // Poll contract ABI
          functionName: 'vote',
          args: [poll.id, optionId],
        });
      } catch (error) {
        console.error('Error voting on-chain:', error);
      }
    } else {
      // Off-chain voting
      if (onVote) {
        onVote(optionId);
        setHasVoted(true);
        setShowResults(true);
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setHasVoted(true);
      setShowResults(true);
      if (onVote && selectedOption) {
        onVote(selectedOption);
      }
    }
  }, [isSuccess, onVote, selectedOption]);

  const getTimeRemaining = () => {
    const now = Date.now();
    const remaining = poll.expiresAt - now;

    if (remaining <= 0) return t('pollEnded');

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${t('remaining')}`;
    if (hours > 0) return `${hours}h ${minutes}m ${t('remaining')}`;
    return `${minutes}m ${t('remaining')}`;
  };

  const maxVotes = Math.max(...poll.options.map((opt) => opt.votes), 1);

  if (compact) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {poll.question}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {poll.totalVotes} {t('votes')} · {getTimeRemaining()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {poll.question}
            </h3>
            {poll.isOnChain && (
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded">
                  {t('onChain')}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t('votesRecordedOnBlockchain')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            {poll.totalVotes} {t('votes')}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {getTimeRemaining()}
          </span>
        </div>
      </div>

      {/* Options */}
      <div className="p-6 space-y-3">
        {poll.options.map((option) => {
          const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
          const isSelected = userVotes.includes(option.id);
          const isWinning = option.votes === maxVotes && maxVotes > 0;

          if (showResults) {
            return (
              <div
                key={option.id}
                className={`relative p-4 rounded-lg border-2 overflow-hidden ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Background bar */}
                <div
                  className={`absolute inset-0 ${
                    isWinning
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : 'bg-gray-100 dark:bg-gray-700/50'
                  } transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-blue-500 flex-shrink-0"
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
                    <span className="font-medium text-gray-900 dark:text-white">
                      {option.text}
                    </span>
                    {isWinning && (
                      <span className="text-xs px-2 py-1 bg-green-500 text-white rounded font-medium">
                        {t('leading')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {option.votes}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[3rem] text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={isPending || isConfirming || !poll.isActive}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedOption === option.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">
                  {option.text}
                </span>
                {selectedOption === option.id && (isPending || isConfirming) && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        {!showResults ? (
          <button
            onClick={() => setShowResults(true)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('viewResults')}
          </button>
        ) : !hasVoted && poll.isActive ? (
          <button
            onClick={() => setShowResults(false)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('backToVote')}
          </button>
        ) : (
          <div></div>
        )}

        {poll.allowMultipleVotes && hasVoted && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t('multipleVotesAllowed')}
          </span>
        )}
      </div>

      {/* Transaction Hash */}
      {hash && (
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('transactionHash')}:{' '}
            <a
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 font-mono break-all"
            >
              {hash.slice(0, 10)}...{hash.slice(-8)}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

