'use client';

import { useState } from 'react';
import { Ban, VolumeX, Search, X, UserX, Volume2, Shield, AlertCircle } from 'lucide-react';

interface BlockedUser {
  address: string;
  displayName: string;
  avatar?: string;
  blockedAt: number;
  reason?: string;
}

interface MutedUser {
  address: string;
  displayName: string;
  avatar?: string;
  mutedAt: number;
  duration?: 'permanent' | '24h' | '7d' | '30d';
}

export default function BlockedUsersPage() {
  const [activeTab, setActiveTab] = useState<'blocked' | 'muted'>('blocked');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - In real app, this would come from smart contract
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      address: '0x1234...5678',
      displayName: 'SpamBot123',
      blockedAt: Date.now() - 86400000,
      reason: 'Spam',
    },
    {
      address: '0xabcd...efgh',
      displayName: 'BadActor456',
      blockedAt: Date.now() - 172800000,
      reason: 'Harassment',
    },
    {
      address: '0x9876...5432',
      displayName: 'TrollUser789',
      blockedAt: Date.now() - 259200000,
    },
  ]);

  const [mutedUsers, setMutedUsers] = useState<MutedUser[]>([
    {
      address: '0x2468...1357',
      displayName: 'NoisyUser1',
      mutedAt: Date.now() - 43200000,
      duration: '7d',
    },
    {
      address: '0x1357...2468',
      displayName: 'AnnoyingUser2',
      mutedAt: Date.now() - 86400000,
      duration: 'permanent',
    },
    {
      address: '0xfedc...ba98',
      displayName: 'LoudUser3',
      mutedAt: Date.now() - 3600000,
      duration: '24h',
    },
  ]);

  const handleUnblock = (address: string) => {
    setBlockedUsers(blockedUsers.filter((user) => user.address !== address));
    // In real app, call smart contract function
    console.log('Unblocking user:', address);
  };

  const handleUnmute = (address: string) => {
    setMutedUsers(mutedUsers.filter((user) => user.address !== address));
    // In real app, call smart contract function
    console.log('Unmuting user:', address);
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const formatDuration = (duration?: string) => {
    if (!duration || duration === 'permanent') return 'Permanent';
    if (duration === '24h') return '24 Hours';
    if (duration === '7d') return '7 Days';
    if (duration === '30d') return '30 Days';
    return duration;
  };

  const filteredBlocked = blockedUsers.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMuted = mutedUsers.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Blocked & Muted Users
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage users you've blocked or muted
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <strong>What's the difference?</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>
                <strong>Blocked:</strong> They can't see your posts, follow you, or interact with you
              </li>
              <li>
                <strong>Muted:</strong> You won't see their posts, but they can still interact with you
              </li>
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('blocked')}
                className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'blocked'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-b-2 border-red-500'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Ban className="w-5 h-5" />
                Blocked ({blockedUsers.length})
              </button>
              <button
                onClick={() => setActiveTab('muted')}
                className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'muted'
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <VolumeX className="w-5 h-5" />
                Muted ({mutedUsers.length})
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or address..."
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
          </div>

          {/* Blocked Users List */}
          {activeTab === 'blocked' && (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBlocked.length === 0 ? (
                <div className="p-12 text-center">
                  <UserX className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {searchQuery ? 'No users found' : 'No blocked users'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery
                      ? 'Try adjusting your search'
                      : "You haven't blocked anyone yet"}
                  </p>
                </div>
              ) : (
                filteredBlocked.map((user) => (
                  <div
                    key={user.address}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {user.displayName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {user.address}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Blocked {formatTimeAgo(user.blockedAt)}
                            </span>
                            {user.reason && (
                              <>
                                <span className="text-gray-300 dark:text-gray-600">•</span>
                                <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                                  {user.reason}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnblock(user.address)}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-2"
                      >
                        <Ban className="w-4 h-4" />
                        Unblock
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Muted Users List */}
          {activeTab === 'muted' && (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMuted.length === 0 ? (
                <div className="p-12 text-center">
                  <VolumeX className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {searchQuery ? 'No users found' : 'No muted users'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery
                      ? 'Try adjusting your search'
                      : "You haven't muted anyone yet"}
                  </p>
                </div>
              ) : (
                filteredMuted.map((user) => (
                  <div
                    key={user.address}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {user.displayName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {user.address}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Muted {formatTimeAgo(user.mutedAt)}
                            </span>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded">
                              {formatDuration(user.duration)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnmute(user.address)}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        Unmute
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <Ban className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Blocked</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {blockedUsers.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <VolumeX className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Muted</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {mutedUsers.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

