'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

interface SearchFilters {
  query: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';
  customDateStart?: Date;
  customDateEnd?: Date;
  sortBy: 'relevance' | 'recent' | 'popular' | 'oldest';
  contentType: 'all' | 'notes' | 'replies' | 'polls' | 'media';
  author?: string;
  tags: string[];
  minLikes?: number;
  minReplies?: number;
  hasMedia: boolean;
  hasPoll: boolean;
  language?: string;
}

interface SearchResult {
  id: string;
  type: 'note' | 'reply' | 'poll';
  content: string;
  author: string;
  authorAvatar: string;
  timestamp: number;
  likes: number;
  replies: number;
  tags: string[];
  hasMedia: boolean;
  hasPoll: boolean;
}

interface AdvancedSearchProps {
  onSearch?: (filters: SearchFilters) => void;
  onClose?: () => void;
}

export default function AdvancedSearch({ onSearch, onClose }: AdvancedSearchProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    dateRange: 'all',
    sortBy: 'relevance',
    contentType: 'all',
    tags: [],
    hasMedia: false,
    hasPoll: false,
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate search
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'note',
        content: 'Just deployed my first smart contract on Base! 🚀',
        author: '0x1234...5678',
        authorAvatar: '/api/placeholder/40/40',
        timestamp: Date.now() - 3600000,
        likes: 45,
        replies: 12,
        tags: ['web3', 'base', 'smartcontract'],
        hasMedia: false,
        hasPoll: false,
      },
      {
        id: '2',
        type: 'note',
        content: 'Web3 is the future of social media. Decentralization is key!',
        author: '0x9876...5432',
        authorAvatar: '/api/placeholder/40/40',
        timestamp: Date.now() - 7200000,
        likes: 89,
        replies: 34,
        tags: ['web3', 'decentralization'],
        hasMedia: true,
        hasPoll: false,
      },
    ];
    
    setResults(mockResults);
    setIsSearching(false);
    
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !filters.tags.includes(tagInput.trim())) {
      setFilters({
        ...filters,
        tags: [...filters.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFilters({
      ...filters,
      tags: filters.tags.filter((t) => t !== tag),
    });
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('advancedSearch')}
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

      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
          />
          <svg
            className="w-6 h-6 absolute left-4 top-3.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {t('searching')}
            </>
          ) : (
            t('search')
          )}
        </button>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
      >
        {showAdvanced ? t('hideFilters') : t('showFilters')}
        <svg
          className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dateRange')}
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">{t('allTime')}</option>
                <option value="today">{t('today')}</option>
                <option value="week">{t('thisWeek')}</option>
                <option value="month">{t('thisMonth')}</option>
                <option value="year">{t('thisYear')}</option>
                <option value="custom">{t('customRange')}</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('sortBy')}
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="relevance">{t('relevance')}</option>
                <option value="recent">{t('mostRecent')}</option>
                <option value="popular">{t('mostPopular')}</option>
                <option value="oldest">{t('oldest')}</option>
              </select>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('contentType')}
              </label>
              <select
                value={filters.contentType}
                onChange={(e) => setFilters({ ...filters, contentType: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">{t('allContent')}</option>
                <option value="notes">{t('notes')}</option>
                <option value="replies">{t('replies')}</option>
                <option value="polls">{t('polls')}</option>
                <option value="media">{t('withMedia')}</option>
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('author')}
              </label>
              <input
                type="text"
                placeholder={t('authorAddress')}
                value={filters.author || ''}
                onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tags')}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder={t('addTag')}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('add')}
              </button>
            </div>
            {filters.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Engagement Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('minLikes')}
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={filters.minLikes || ''}
                onChange={(e) =>
                  setFilters({ ...filters, minLikes: parseInt(e.target.value) || undefined })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('minReplies')}
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={filters.minReplies || ''}
                onChange={(e) =>
                  setFilters({ ...filters, minReplies: parseInt(e.target.value) || undefined })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.hasMedia}
                onChange={(e) => setFilters({ ...filters, hasMedia: e.target.checked })}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('hasMedia')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.hasPoll}
                onChange={(e) => setFilters({ ...filters, hasPoll: e.target.checked })}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('hasPoll')}</span>
            </label>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setFilters({
                query: filters.query,
                dateRange: 'all',
                sortBy: 'relevance',
                contentType: 'all',
                tags: [],
                hasMedia: false,
                hasPoll: false,
              });
            }}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            {t('clearFilters')}
          </button>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {results.length} {t('results')}
            </h3>
          </div>

          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-3">
                <img
                  src={result.authorAvatar}
                  alt={result.author}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {result.author}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      · {formatTimeAgo(result.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white mb-2">{result.content}</p>
                  {result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {result.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {result.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {result.replies}
                    </span>
                    {result.hasMedia && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {t('media')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

