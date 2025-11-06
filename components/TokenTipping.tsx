'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useTranslation } from '@/lib/i18n';

interface TokenTippingProps {
  recipientAddress: string;
  recipientName?: string;
  contentId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const PRESET_AMOUNTS = [0.001, 0.005, 0.01, 0.05, 0.1];

export default function TokenTipping({
  recipientAddress,
  recipientName = 'Creator',
  contentId,
  onSuccess,
  onClose,
}: TokenTippingProps) {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [isCustom, setIsCustom] = useState(false);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePresetClick = (preset: number) => {
    setSelectedPreset(preset);
    setAmount(preset.toString());
    setIsCustom(false);
  };

  const handleCustomAmountChange = (value: string) => {
    setAmount(value);
    setIsCustom(true);
    setSelectedPreset(null);
  };

  const handleSendTip = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!recipientAddress) {
      alert('Invalid recipient address');
      return;
    }

    try {
      // Send ETH tip
      writeContract({
        address: recipientAddress as `0x${string}`,
        abi: [],
        functionName: 'tip',
        value: parseEther(amount),
      });

      // In a real implementation, you might want to:
      // 1. Store the tip message on-chain or in a database
      // 2. Emit an event with the tip details
      // 3. Update the creator's tip statistics
    } catch (error) {
      console.error('Error sending tip:', error);
    }
  };

  React.useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md mx-auto">
        <div className="text-center">
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
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('connectWalletToTip')}
          </p>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            {t('connectWallet')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('sendTip')}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
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
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('sendingTo')}: <strong>{recipientName}</strong>
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Preset Amounts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('selectAmount')} (ETH)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                  selectedPreset === preset
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                }`}
              >
                {preset} ETH
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <label
            htmlFor="custom-amount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t('customAmount')}
          </label>
          <div className="relative">
            <input
              type="number"
              id="custom-amount"
              step="0.001"
              min="0"
              placeholder="0.0"
              value={amount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className={`w-full pl-4 pr-16 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                isCustom
                  ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                  : 'border-gray-300 dark:border-gray-600'
              } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800`}
            />
            <span className="absolute right-4 top-3 text-gray-500 dark:text-gray-400 font-medium">
              ETH
            </span>
          </div>
          {amount && parseFloat(amount) > 0 && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              ≈ ${(parseFloat(amount) * 2000).toFixed(2)} USD
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="tip-message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t('addMessage')} ({t('optional')})
          </label>
          <textarea
            id="tip-message"
            rows={3}
            maxLength={200}
            placeholder={t('sayThankYou')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 resize-none"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
            {message.length}/200
          </p>
        </div>

        {/* Summary */}
        {amount && parseFloat(amount) > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t('tipAmount')}:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {amount} ETH
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t('networkFee')}:</span>
              <span className="text-gray-600 dark:text-gray-400">~0.0001 ETH</span>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between">
              <span className="font-medium text-gray-900 dark:text-white">{t('total')}:</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {(parseFloat(amount) + 0.0001).toFixed(4)} ETH
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error.message || t('transactionFailed')}
            </p>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ {t('tipSentSuccessfully')}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
        {onClose && (
          <button
            onClick={onClose}
            disabled={isPending || isConfirming}
            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('cancel')}
          </button>
        )}
        <button
          onClick={handleSendTip}
          disabled={
            !amount ||
            parseFloat(amount) <= 0 ||
            isPending ||
            isConfirming ||
            isSuccess
          }
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending || isConfirming ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{isConfirming ? t('confirming') : t('sending')}</span>
            </>
          ) : isSuccess ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t('sent')}</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{t('sendTip')}</span>
            </>
          )}
        </button>
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

