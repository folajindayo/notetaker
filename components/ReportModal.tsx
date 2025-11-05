'use client';

import { useState } from 'react';
import { X, AlertTriangle, Flag, MessageSquare, Send } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'note' | 'user' | 'comment';
  contentId: string;
  targetAddress?: string;
}

const reportReasons = {
  note: [
    { value: 'spam', label: 'Spam or misleading', icon: '📢' },
    { value: 'harassment', label: 'Harassment or hate speech', icon: '⚠️' },
    { value: 'violence', label: 'Violence or dangerous content', icon: '🔴' },
    { value: 'nsfw', label: 'Adult or NSFW content', icon: '🔞' },
    { value: 'misinformation', label: 'False or misleading information', icon: '❌' },
    { value: 'copyright', label: 'Copyright violation', icon: '©️' },
    { value: 'other', label: 'Other (please specify)', icon: '📝' },
  ],
  user: [
    { value: 'impersonation', label: 'Impersonation or fake account', icon: '🎭' },
    { value: 'harassment', label: 'Harassment or bullying', icon: '⚠️' },
    { value: 'spam', label: 'Spam or bot activity', icon: '🤖' },
    { value: 'hate', label: 'Hate speech or discrimination', icon: '🚫' },
    { value: 'scam', label: 'Scam or fraudulent activity', icon: '💸' },
    { value: 'other', label: 'Other (please specify)', icon: '📝' },
  ],
  comment: [
    { value: 'spam', label: 'Spam or off-topic', icon: '📢' },
    { value: 'harassment', label: 'Harassment or abuse', icon: '⚠️' },
    { value: 'hate', label: 'Hate speech', icon: '🚫' },
    { value: 'threat', label: 'Threats or violence', icon: '🔴' },
    { value: 'other', label: 'Other (please specify)', icon: '📝' },
  ],
};

export default function ReportModal({
  isOpen,
  onClose,
  contentType,
  contentId,
  targetAddress,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reasons = reportReasons[contentType];

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);

    // In a real app, this would call smart contract function
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Report submitted:', {
      contentType,
      contentId,
      targetAddress,
      reason: selectedReason,
      additionalInfo,
    });

    setSubmitted(true);
    setIsSubmitting(false);

    setTimeout(() => {
      setSubmitted(false);
      setSelectedReason('');
      setAdditionalInfo('');
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason('');
      setAdditionalInfo('');
      setSubmitted(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {submitted ? (
          // Success State
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Report Submitted
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Thank you for helping keep our community safe. Our moderation team will review this report.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <Flag className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Report {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Help us understand what's wrong
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Warning Banner */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>False reports may result in penalties.</strong> Please only report content that
                  violates our community guidelines. Reports are reviewed by moderators and may be recorded
                  on-chain.
                </div>
              </div>

              {/* Reason Selection */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                  What's wrong with this {contentType}?
                </label>
                <div className="space-y-2">
                  {reasons.map((reason) => (
                    <label
                      key={reason.value}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedReason === reason.value
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason.value}
                        checked={selectedReason === reason.value}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="w-5 h-5 text-red-500 focus:ring-2 focus:ring-red-500"
                      />
                      <span className="text-2xl">{reason.icon}</span>
                      <span className="text-gray-900 dark:text-white font-medium flex-1">
                        {reason.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              {selectedReason && (
                <div className="animate-fadeIn">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <MessageSquare className="w-4 h-4" />
                    Additional Information {selectedReason === 'other' && '(Required)'}
                  </label>
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Please provide more details about this report..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {additionalInfo.length}/500 characters
                  </p>
                </div>
              )}

              {/* Content Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Content Type:</span>
                  <span className="text-gray-900 dark:text-white font-medium capitalize">
                    {contentType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Content ID:</span>
                  <span className="text-gray-900 dark:text-white font-mono text-xs">
                    {contentId}
                  </span>
                </div>
                {targetAddress && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">User Address:</span>
                    <span className="text-gray-900 dark:text-white font-mono text-xs">
                      {targetAddress.slice(0, 6)}...{targetAddress.slice(-4)}
                    </span>
                  </div>
                )}
              </div>

              {/* Guidelines Link */}
              <div className="text-center">
                <a
                  href="/help#community-guidelines"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Community Guidelines →
                </a>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !selectedReason ||
                  isSubmitting ||
                  (selectedReason === 'other' && !additionalInfo.trim())
                }
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Flag className="w-5 h-5" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

