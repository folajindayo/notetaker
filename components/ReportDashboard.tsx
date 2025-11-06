'use client';

import { useState } from 'react';

interface Report {
  id: bigint;
  noteId: bigint;
  reporter: string;
  reason: string;
  timestamp: bigint;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  noteContent: string;
  noteAuthor: string;
  reportCount: number;
}

interface ReportDashboardProps {
  reports: Report[];
  onResolve?: (reportId: bigint, action: 'delete' | 'dismiss') => void;
  isAdmin?: boolean;
}

export default function ReportDashboard({
  reports,
  onResolve,
  isAdmin = false,
}: ReportDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved' | 'dismissed'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'count' | 'oldest'>('recent');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesFilter = filter === 'all' || report.status === filter;
    const matchesSearch =
      searchTerm === '' ||
      report.noteContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return Number(b.timestamp - a.timestamp);
      case 'count':
        return b.reportCount - a.reportCount;
      case 'oldest':
        return Number(a.timestamp - b.timestamp);
      default:
        return 0;
    }
  });

  // Get statistics
  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    reviewed: reports.filter((r) => r.status === 'reviewed').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    dismissed: reports.filter((r) => r.status === 'dismissed').length,
    highPriority: reports.filter((r) => r.reportCount >= 5).length,
  };

  // Get severity color
  const getSeverityColor = (count: number) => {
    if (count >= 10) return 'bg-red-500';
    if (count >= 5) return 'bg-orange-500';
    if (count >= 3) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  // Get severity label
  const getSeverityLabel = (count: number) => {
    if (count >= 10) return 'Critical';
    if (count >= 5) return 'High';
    if (count >= 3) return 'Medium';
    return 'Low';
  };

  // Format timestamp
  const formatTime = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🚨 Report Management Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review and manage community reports
          {isAdmin && ' • Admin View'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Total Reports
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.pending}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Pending
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.reviewed}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Reviewed
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.resolved}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Resolved
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {stats.dismissed}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Dismissed
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.highPriority}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            High Priority
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="recent">Most Recent</option>
            <option value="count">Most Reported</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {sortedReports.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No reports found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm
                ? 'Try adjusting your search filters'
                : 'All reports have been reviewed'}
            </p>
          </div>
        ) : (
          sortedReports.map((report) => (
            <div
              key={report.id.toString()}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start justify-between mb-4">
                {/* Header */}
                <div className="flex items-center space-x-3">
                  {/* Severity Badge */}
                  <div
                    className={`${getSeverityColor(
                      report.reportCount
                    )} text-white px-3 py-1 rounded-full text-xs font-bold`}
                  >
                    {getSeverityLabel(report.reportCount)} • {report.reportCount} reports
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      report.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        : report.status === 'reviewed'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : report.status === 'resolved'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </div>
                </div>

                {/* Timestamp */}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTime(report.timestamp)}
                </span>
              </div>

              {/* Content */}
              <div className="mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Reported by:</strong>{' '}
                  {report.reporter.slice(0, 6)}...{report.reporter.slice(-4)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Note author:</strong>{' '}
                  {report.noteAuthor.slice(0, 6)}...{report.noteAuthor.slice(-4)}
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {report.noteContent.slice(0, 200)}
                    {report.noteContent.length > 200 && '...'}
                  </p>
                </div>
                <div className="text-sm">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Reason:
                  </strong>{' '}
                  <span className="text-red-600 dark:text-red-400">
                    {report.reason}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {isAdmin && report.status === 'pending' && (
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onResolve?.(report.id, 'delete');
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete Note
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onResolve?.(report.id, 'dismiss');
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReport(report);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Report Details
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Report ID
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    #{selectedReport.id.toString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      selectedReport.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        : selectedReport.status === 'reviewed'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : selectedReport.status === 'resolved'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {selectedReport.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Severity
                </label>
                <div className="flex items-center space-x-2">
                  <div
                    className={`${getSeverityColor(
                      selectedReport.reportCount
                    )} text-white px-3 py-1 rounded-full text-sm font-bold`}
                  >
                    {getSeverityLabel(selectedReport.reportCount)}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    ({selectedReport.reportCount} reports)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reported Content
                </label>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white">
                    {selectedReport.noteContent}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason
                </label>
                <p className="text-red-600 dark:text-red-400 font-medium">
                  {selectedReport.reason}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reporter
                  </label>
                  <p className="text-gray-900 dark:text-white font-mono text-sm">
                    {selectedReport.reporter}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Note Author
                  </label>
                  <p className="text-gray-900 dark:text-white font-mono text-sm">
                    {selectedReport.noteAuthor}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reported At
                </label>
                <p className="text-gray-900 dark:text-white">
                  {formatTime(selectedReport.timestamp)}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            {isAdmin && selectedReport.status === 'pending' && (
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onResolve?.(selectedReport.id, 'dismiss');
                    setSelectedReport(null);
                  }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Dismiss Report
                </button>
                <button
                  onClick={() => {
                    onResolve?.(selectedReport.id, 'delete');
                    setSelectedReport(null);
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Note
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

