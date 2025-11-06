'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface BookmarkItem {
  id: string;
  contentId: string;
  title: string;
  excerpt: string;
  author: string;
  timestamp: number;
  tags: string[];
}

interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bookmarks: BookmarkItem[];
  isPublic: boolean;
  createdAt: number;
}

interface BookmarkCollectionsProps {
  onSelectCollection?: (collectionId: string) => void;
}

const DEFAULT_ICONS = ['📚', '⭐', '💡', '🎯', '🔖', '📌', '💎', '🌟', '🎨', '🚀'];
const DEFAULT_COLORS = [
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'indigo',
];

export default function BookmarkCollections({ onSelectCollection }: BookmarkCollectionsProps) {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'size'>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📚',
    color: 'blue',
    isPublic: false,
  });

  useEffect(() => {
    // Load collections from localStorage or API
    const loadCollections = () => {
      const saved = localStorage.getItem(`bookmarkCollections_${address}`);
      if (saved) {
        setCollections(JSON.parse(saved));
      } else {
        // Default collections
        setCollections([
          {
            id: '1',
            name: 'Reading List',
            description: 'Articles to read later',
            icon: '📚',
            color: 'blue',
            bookmarks: [],
            isPublic: false,
            createdAt: Date.now(),
          },
          {
            id: '2',
            name: 'Favorites',
            description: 'My favorite posts',
            icon: '⭐',
            color: 'yellow',
            bookmarks: [],
            isPublic: false,
            createdAt: Date.now(),
          },
        ]);
      }
    };

    if (address) {
      loadCollections();
    }
  }, [address]);

  // Save collections to localStorage
  useEffect(() => {
    if (address && collections.length > 0) {
      localStorage.setItem(`bookmarkCollections_${address}`, JSON.stringify(collections));
    }
  }, [collections, address]);

  const handleCreateCollection = () => {
    if (!formData.name.trim()) {
      alert(t('collectionNameRequired'));
      return;
    }

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      bookmarks: [],
      isPublic: formData.isPublic,
      createdAt: Date.now(),
    };

    setCollections([...collections, newCollection]);
    resetForm();
    setIsCreating(false);
  };

  const handleUpdateCollection = () => {
    if (!editingCollection || !formData.name.trim()) {
      return;
    }

    setCollections(
      collections.map((col) =>
        col.id === editingCollection.id
          ? {
              ...col,
              name: formData.name,
              description: formData.description,
              icon: formData.icon,
              color: formData.color,
              isPublic: formData.isPublic,
            }
          : col
      )
    );

    resetForm();
    setIsEditing(false);
    setEditingCollection(null);
  };

  const handleDeleteCollection = (collectionId: string) => {
    if (confirm(t('confirmDeleteCollection'))) {
      setCollections(collections.filter((col) => col.id !== collectionId));
    }
  };

  const handleEditClick = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description,
      icon: collection.icon,
      color: collection.color,
      isPublic: collection.isPublic,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '📚',
      color: 'blue',
      isPublic: false,
    });
  };

  const filteredCollections = collections
    .filter((col) =>
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.bookmarks.length - a.bookmarks.length;
        case 'recent':
        default:
          return b.createdAt - a.createdAt;
      }
    });

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
      teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    };
    return colors[color] || colors.blue;
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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToViewCollections')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('bookmarkCollections')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('organizeYourBookmarks')}
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('newCollection')}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t('searchCollections')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
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

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="recent">{t('recent')}</option>
            <option value="name">{t('name')}</option>
            <option value="size">{t('size')}</option>
          </select>

          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-2 ${
                view === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-2 ${
                view === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Collections Grid/List */}
      {filteredCollections.length === 0 ? (
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
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t('noCollections')}</p>
          <button
            onClick={() => setIsCreating(true)}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            {t('createFirstCollection')}
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollections.map((collection) => (
            <div
              key={collection.id}
              onClick={() => {
                setSelectedCollection(collection.id);
                onSelectCollection?.(collection.id);
              }}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${getColorClass(
                collection.color
              )}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{collection.icon}</span>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(collection);
                    }}
                    className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCollection(collection.id);
                    }}
                    className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1">{collection.name}</h3>
              <p className="text-sm opacity-80 mb-3 line-clamp-2">{collection.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span>{collection.bookmarks.length} {t('items')}</span>
                {collection.isPublic && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {t('public')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredCollections.map((collection) => (
            <div
              key={collection.id}
              onClick={() => {
                setSelectedCollection(collection.id);
                onSelectCollection?.(collection.id);
              }}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${getColorClass(
                collection.color
              )}`}
            >
              <span className="text-3xl">{collection.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg">{collection.name}</h3>
                <p className="text-sm opacity-80 truncate">{collection.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {collection.bookmarks.length} {t('items')}
                </span>
                {collection.isPublic && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(collection);
                    }}
                    className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCollection(collection.id);
                    }}
                    className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditing ? t('editCollection') : t('createCollection')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('name')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('collectionName')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('describeCollection')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('icon')}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {DEFAULT_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-2xl p-2 rounded-lg border-2 ${
                        formData.icon === icon
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('color')}
                </label>
                <div className="grid grid-cols-9 gap-2">
                  {DEFAULT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-lg ${getColorClass(color)} ${
                        formData.color === color
                          ? 'ring-2 ring-offset-2 ring-blue-500'
                          : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('makePublic')}
                </span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  resetForm();
                  setIsCreating(false);
                  setIsEditing(false);
                  setEditingCollection(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={isEditing ? handleUpdateCollection : handleCreateCollection}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {isEditing ? t('save') : t('create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

