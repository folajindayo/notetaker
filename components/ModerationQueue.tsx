'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface ReportedContent {
  id: string;
  contentId: string;
  contentType: 'note' | 'reply' | 'profile';
  content: string;
  author: string;
  reportedBy: string[];
  reportCount: number;
  reasons: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: number;
  reviewedBy?: string;
  reviewedAt?: number;
  action?: 'removed' | 'warning' | 'ban' | 'none';
}

interface ModerationStats {
  total: number;
  pending: number;
  reviewing: number;
  resolved: number;
  dismissed: number;
}

interface ModerationQueueProps {
  isModerator?: boolean;
}

const REPORT_REASONS = [
  'Spam',
  'Harassment',
  'Hate Speech',
  'Violence',
  'Misinformation',
  'Scam/Fraud',
  'Adult Content',
  'Copyright Violation',
  'Other',
];

export default function ModerationQueue({ isModerator = false }: ModerationQueueProps) {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [reports, setReports] = useState<ReportedContent[]>([]);
  const [stats, setStats] = useState<ModerationStats>({
    total: 0,
    pending: 0,
    reviewing: 0,
    resolved: 0,
    dismissed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'reviewing' | 'resolved'>(
    'pending'
  );
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>(
    'all'
  );
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      const mockReports: ReportedContent[] = [
        {
          id: '1',
          contentId: 'note_123',
          contentType: 'note',
          content: 'This is spam content promoting a scam...',
          author: '0x1234...5678',
          reportedBy: ['0xabcd...efgh', '0x9876...5432'],
          reportCount: 5,
          reasons: ['Spam', 'Scam/Fraud'],
          severity: 'high',
          status: 'pending',
          createdAt: Date.now() - 3600000,
        },
        {
          id: '2',
          contentId: 'note_456',
          contentType: 'note',
          content: 'Offensive language targeting a specific group...',
          author: '0x9876...5432',
          reportedBy: ['0xabcd...efgh', '0x1111...2222', '0x3333...4444'],
          reportCount: 8,
          reasons: ['Hate Speech', 'Harassment'],
          severity: 'critical',
          status: 'reviewing',
          createdAt: Date.now() - 7200000,
        },
        {
          id: '3',
          contentId: 'reply_789',
          contentType: 'reply',
          content: 'False information about crypto regulations...',
          author: '0x5555...6666',
          reportedBy: ['0x7777...8888'],
          reportCount: 3,
          reasons: ['Misinformation'],
          severity: 'medium',
          status: 'pending',
          createdAt: Date.now() - 10800000,
        },
      ];

      setReports(mockReports);
      setStats({
        total: mockReports.length,
        pending: mockReports.filter((r) => r.status === 'pending').length,
        reviewing: mockReports.filter((r) => r.status === 'reviewing').length,
        resolved: mockReports.filter((r) => r.status === 'resolved').length,
        dismissed: mockReports.filter((r) => r.status === 'dismissed').length,
      });
      setLoading(false);
    };

    if (isConnected && isModerator) {
      loadReports();
    }
  }, [isConnected, isModerator]);

  const handleReview = (reportId: string, action: 'removed' | 'warning' | 'ban' | 'none') => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: 'resolved',
              action,
              reviewedBy: address,
              reviewedAt: Date.now(),
            }
          : report
      )
    );
    setSelectedReport(null);
  };

  const handleDismiss = (reportId: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: 'dismissed',
              reviewedBy: address,
              reviewedAt: Date.now(),
            }
          : report
      )
    );
    setSelectedReport(null);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      critical: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      reviewing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      resolved: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      dismissed: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const filteredReports = reports.filter((report) => {
    const matchesStatus = activeFilter === 'all' || report.status === activeFilter;
    const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  if (!isConnected || !isModerator) {
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
        <p className="text-gray-600 dark:text-gray-400">{t('moderatorAccessRequired')}</p>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('moderationQueue')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('reviewReportedContent')}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {t('moderator')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(['all', 'pending', 'reviewing', 'resolved', 'dismissed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`p-4 rounded-xl border-2 transition-all ${
              activeFilter === status
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {status === 'all' ? stats.total : stats[status]}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{t(status)}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">{t('allSeverities')}</option>
          <option value="critical">{t('critical')}</option>
          <option value="high">{t('high')}</option>
          <option value="medium">{t('medium')}</option>
          <option value="low">{t('low')}</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">{t('noReportsToReview')}</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                    {report.severity.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {report.reportCount} {t('reports')}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(report.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('author')}: {report.author}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                    {report.contentType}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-900 dark:text-white">{report.content}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('reportReasons')}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.reasons.map((reason) => (
                    <span
                      key={reason}
                      className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>

              {report.status === 'pending' || report.status === 'reviewing' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                  >
                    {t('review')}
                  </button>
                  <button
                    onClick={() => handleDismiss(report.id)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {t('dismiss')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    {t('reviewedBy')} {report.reviewedBy?.slice(0, 10)}...
                  </span>
                  {report.action && (
                    <>
                      <span>·</span>
                      <span className="font-medium capitalize">{report.action}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('reviewContent')}
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
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

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('reportedContent')}:
                </p>
                <p className="text-gray-900 dark:text-white">{selectedReport.content}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('reviewNotes')}:
                </p>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder={t('addReviewNotes')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleReview(selectedReport.id, 'none')}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                >
                  {t('noViolation')}
                </button>
                <button
                  onClick={() => handleReview(selectedReport.id, 'warning')}
                  className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
                >
                  {t('issueWarning')}
                </button>
                <button
                  onClick={() => handleReview(selectedReport.id, 'removed')}
                  className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
                >
                  {t('removeContent')}
                </button>
                <button
                  onClick={() => handleReview(selectedReport.id, 'ban')}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                  {t('banUser')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

