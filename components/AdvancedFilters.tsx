'use client';

import { useState } from 'react';
import { X, Filter, Calendar, Users, Tag, TrendingUp } from 'lucide-react';

interface FilterOptions {
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  sortBy: 'recent' | 'popular' | 'trending' | 'oldest';
  contentType: 'all' | 'notes' | 'polls' | 'media';
  hasMedia: boolean;
  verified: boolean;
  minLikes: number;
  tags: string[];
  communities: string[];
}

interface AdvancedFiltersProps {
  onApply: (filters: FilterOptions) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function AdvancedFilters({ onApply, onClose, isOpen }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'all',
    sortBy: 'recent',
    contentType: 'all',
    hasMedia: false,
    verified: false,
    minLikes: 0,
    tags: [],
    communities: []
  });

  const [newTag, setNewTag] = useState('');
  const [newCommunity, setNewCommunity] = useState('');

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateRange: 'all',
      sortBy: 'recent',
      contentType: 'all',
      hasMedia: false,
      verified: false,
      minLikes: 0,
      tags: [],
      communities: []
    });
  };

  const addTag = () => {
    if (newTag.trim() && !filters.tags.includes(newTag.trim())) {
      setFilters({ ...filters, tags: [...filters.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFilters({ ...filters, tags: filters.tags.filter(t => t !== tag) });
  };

  const addCommunity = () => {
    if (newCommunity.trim() && !filters.communities.includes(newCommunity.trim())) {
      setFilters({ ...filters, communities: [...filters.communities, newCommunity.trim()] });
      setNewCommunity('');
    }
  };

  const removeCommunity = (community: string) => {
    setFilters({ ...filters, communities: filters.communities.filter(c => c !== community) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Range */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <Calendar className="w-4 h-4" />
              Date Range
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {['all', 'today', 'week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setFilters({ ...filters, dateRange: range as any })}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    filters.dateRange === range
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <TrendingUp className="w-4 h-4" />
              Sort By
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['recent', 'popular', 'trending', 'oldest'].map((sort) => (
                <button
                  key={sort}
                  onClick={() => setFilters({ ...filters, sortBy: sort as any })}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    filters.sortBy === sort
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <Filter className="w-4 h-4" />
              Content Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['all', 'notes', 'polls', 'media'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters({ ...filters, contentType: type as any })}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    filters.contentType === type
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Filters */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={filters.hasMedia}
                onChange={(e) => setFilters({ ...filters, hasMedia: e.target.checked })}
                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Only posts with media</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={filters.verified}
                onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Verified users only</span>
            </label>
          </div>

          {/* Minimum Likes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
              <span>Minimum Likes</span>
              <span className="text-blue-500">{filters.minLikes}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.minLikes}
              onChange={(e) => setFilters({ ...filters, minLikes: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0</span>
              <span>50</span>
              <span>100+</span>
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <Tag className="w-4 h-4" />
              Filter by Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tag..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center gap-2 text-sm"
                >
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-blue-900 dark:hover:text-blue-100">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Communities Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <Users className="w-4 h-4" />
              Filter by Communities
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCommunity}
                onChange={(e) => setNewCommunity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCommunity()}
                placeholder="Add community..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={addCommunity}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.communities.map((community) => (
                <span
                  key={community}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full flex items-center gap-2 text-sm"
                >
                  {community}
                  <button onClick={() => removeCommunity(community)} className="hover:text-purple-900 dark:hover:text-purple-100">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Reset All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

