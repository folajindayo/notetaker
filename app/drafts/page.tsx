'use client';

import { useState } from 'react';
import { FileText, Trash2, Edit, Clock, Plus, Search, X } from 'lucide-react';
import Link from 'next/link';

interface Draft {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  mediaAttachments?: number;
  pollOptions?: string[];
  tags?: string[];
}

export default function DraftsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set());

  // Mock data - In real app, this would be stored locally or in IPFS
  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: '1',
      content:
        'Working on a deep dive into Base L2 scaling solutions. The technology behind optimistic rollups is fascinating! Need to add more technical details...',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 43200000,
      tags: ['base', 'ethereum', 'l2'],
    },
    {
      id: '2',
      content: 'Just finished building my first NFT marketplace! Ready to share the journey with the community 🚀',
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 86400000,
      mediaAttachments: 3,
      tags: ['nft', 'web3'],
    },
    {
      id: '3',
      content:
        'Thread idea: Top 10 smart contract security best practices every developer should know...',
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 172800000,
    },
    {
      id: '4',
      content: 'Poll: What\'s your favorite blockchain for DeFi?',
      createdAt: Date.now() - 345600000,
      updatedAt: Date.now() - 259200000,
      pollOptions: ['Ethereum', 'Base', 'Polygon', 'Arbitrum'],
    },
    {
      id: '5',
      content: 'Thoughts on the latest EIP proposal? Still need to research more before posting...',
      createdAt: Date.now() - 432000000,
      updatedAt: Date.now() - 345600000,
      tags: ['ethereum', 'eip'],
    },
  ]);

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      setDrafts(drafts.filter((draft) => draft.id !== id));
      selectedDrafts.delete(id);
      setSelectedDrafts(new Set(selectedDrafts));
    }
  };

  const handleDeleteSelected = () => {
    if (confirm(`Are you sure you want to delete ${selectedDrafts.size} selected drafts?`)) {
      setDrafts(drafts.filter((draft) => !selectedDrafts.has(draft.id)));
      setSelectedDrafts(new Set());
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedDrafts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDrafts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedDrafts.size === filteredDrafts.length) {
      setSelectedDrafts(new Set());
    } else {
      setSelectedDrafts(new Set(filteredDrafts.map((d) => d.id)));
    }
  };

  const filteredDrafts = drafts.filter((draft) =>
    draft.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Drafts</h1>
            </div>
            <Link href="/">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Note
              </button>
            </Link>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Your saved drafts - finish them whenever you're ready
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
          <div className="p-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drafts..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedDrafts.size > 0 && (
              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <span className="text-blue-800 dark:text-blue-300 font-medium">
                  {selectedDrafts.size} draft{selectedDrafts.size > 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {drafts.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Drafts</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {drafts.filter((d) => d.mediaAttachments).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">With Media</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {drafts.filter((d) => d.pollOptions).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Polls</div>
              </div>
            </div>
          </div>
        </div>

        {/* Drafts List */}
        {filteredDrafts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No drafts found' : 'No drafts yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Start writing and save your work as a draft'}
            </p>
            {!searchQuery && (
              <Link href="/">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                  Create Your First Draft
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Select All */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedDrafts.size === filteredDrafts.length}
                onChange={toggleSelectAll}
                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Select All</span>
            </div>

            {/* Draft Cards */}
            {filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all ${
                  selectedDrafts.has(draft.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedDrafts.has(draft.id)}
                      onChange={() => toggleSelect(draft.id)}
                      className="mt-1 w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white mb-3 line-clamp-3">
                        {draft.content}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Updated {formatTimeAgo(draft.updatedAt)}</span>
                        </div>
                        {draft.mediaAttachments && (
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs">
                            {draft.mediaAttachments} media file{draft.mediaAttachments > 1 ? 's' : ''}
                          </span>
                        )}
                        {draft.pollOptions && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                            Poll ({draft.pollOptions.length} options)
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {draft.tags && draft.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {draft.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Continue Editing
                        </button>
                        <button
                          onClick={() => handleDelete(draft.id)}
                          className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Created timestamp footer */}
                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-2 text-xs text-gray-500 dark:text-gray-400">
                  Created {formatTimeAgo(draft.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

