'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

/**
 * SocialMediaIntegration - Cross-platform social media sharing and integration
 * Allows users to share content across multiple platforms and import/export data
 */

interface ConnectedPlatform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  username?: string;
  autoShare: boolean;
  lastSync?: number;
}

interface ShareOptions {
  platforms: string[];
  includeMedia: boolean;
  addHashtags: boolean;
  scheduleTime?: string;
  customMessage?: string;
}

export default function SocialMediaIntegration() {
  const { address } = useAccount();
  const [platforms, setPlatforms] = useState<ConnectedPlatform[]>([
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', connected: false, autoShare: false },
    { id: 'farcaster', name: 'Farcaster', icon: '🎭', connected: false, autoShare: false },
    { id: 'lens', name: 'Lens Protocol', icon: '🌿', connected: false, autoShare: false },
    { id: 'mastodon', name: 'Mastodon', icon: '🐘', connected: false, autoShare: false },
    { id: 'bluesky', name: 'Bluesky', icon: '🦋', connected: false, autoShare: false },
    { id: 'discord', name: 'Discord', icon: '💬', connected: false, autoShare: false },
    { id: 'telegram', name: 'Telegram', icon: '✈️', connected: false, autoShare: false },
  ]);

  const [activeTab, setActiveTab] = useState<'connect' | 'share' | 'import' | 'export'>('connect');
  const [shareOptions, setShareOptions] = useState<ShareOptions>({
    platforms: [],
    includeMedia: true,
    addHashtags: true,
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [noteToShare, setNoteToShare] = useState('');

  const connectPlatform = (platformId: string) => {
    // In production, this would trigger OAuth flow
    setPlatforms(platforms.map(p => 
      p.id === platformId 
        ? { ...p, connected: true, username: `@user_${Math.random().toString(36).substring(7)}`, lastSync: Date.now() }
        : p
    ));
  };

  const disconnectPlatform = (platformId: string) => {
    const confirmed = confirm('Are you sure you want to disconnect this platform?');
    if (!confirmed) return;

    setPlatforms(platforms.map(p => 
      p.id === platformId 
        ? { ...p, connected: false, username: undefined, autoShare: false, lastSync: undefined }
        : p
    ));
  };

  const toggleAutoShare = (platformId: string) => {
    setPlatforms(platforms.map(p => 
      p.id === platformId 
        ? { ...p, autoShare: !p.autoShare }
        : p
    ));
  };

  const handleShare = async () => {
    if (shareOptions.platforms.length === 0) {
      alert('Please select at least one platform to share to');
      return;
    }

    if (!noteToShare.trim()) {
      alert('Please enter a message to share');
      return;
    }

    // Simulate sharing
    console.log('Sharing to:', shareOptions);
    alert(`Successfully shared to ${shareOptions.platforms.length} platform(s)!`);
    setShowShareModal(false);
    setNoteToShare('');
    setShareOptions({
      platforms: [],
      includeMedia: true,
      addHashtags: true,
    });
  };

  const handleImport = async (platformId: string) => {
    // In production, this would fetch data from the platform
    alert(`Importing data from ${platforms.find(p => p.id === platformId)?.name}...`);
  };

  const handleExport = async (format: 'json' | 'csv' | 'rss') => {
    // In production, this would generate export file
    alert(`Exporting data as ${format.toUpperCase()}...`);
  };

  const connectedCount = platforms.filter(p => p.connected).length;

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Please connect your wallet to access social media integrations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🔗 Social Media Integration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your social accounts and share content across platforms
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{connectedCount}</div>
            <div className="text-sm opacity-90">Connected</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{platforms.filter(p => p.autoShare).length}</div>
            <div className="text-sm opacity-90">Auto-Share</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">0</div>
            <div className="text-sm opacity-90">Shared Today</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{platforms.length}</div>
            <div className="text-sm opacity-90">Available</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {(['connect', 'share', 'import', 'export'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab === 'connect' && '🔗 Connect'}
                {tab === 'share' && '📤 Share'}
                {tab === 'import' && '📥 Import'}
                {tab === 'export' && '📦 Export'}
              </button>
            ))}
          </div>
        </div>

        {/* Connect Tab */}
        {activeTab === 'connect' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🌐 Cross-Platform Connectivity
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect your social accounts to automatically share your content, import existing posts, 
                and manage everything from one place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{platform.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {platform.name}
                        </h3>
                        {platform.connected && platform.username && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {platform.username}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        platform.connected
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {platform.connected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>

                  {platform.connected && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Auto-share new posts</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={platform.autoShare}
                            onChange={() => toggleAutoShare(platform.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      {platform.lastSync && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last synced: {new Date(platform.lastSync).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => platform.connected ? disconnectPlatform(platform.id) : connectPlatform(platform.id)}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      platform.connected
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {platform.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share Tab */}
        {activeTab === 'share' && (
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📤 Quick Share
              </h3>
              <button
                onClick={() => setShowShareModal(true)}
                disabled={connectedCount === 0}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connectedCount > 0 ? 'Share New Post' : 'Connect platforms first'}
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📊 Sharing History
              </h3>
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                No sharing history yet. Share your first post to see it here!
              </div>
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📥 Import Content
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Import your existing posts from connected platforms to NoteBoard
            </p>

            <div className="space-y-4">
              {platforms.filter(p => p.connected).map((platform) => (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{platform.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{platform.username}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleImport(platform.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Import Posts
                  </button>
                </div>
              ))}

              {connectedCount === 0 && (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  Connect platforms to import your content
                </div>
              )}
            </div>
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📦 Export Your Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Download your NoteBoard content in various formats
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleExport('json')}
                className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">📄</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">JSON</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Complete data export with all metadata
                </div>
              </button>

              <button
                onClick={() => handleExport('csv')}
                className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">📊</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">CSV</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Spreadsheet format for analysis
                </div>
              </button>

              <button
                onClick={() => handleExport('rss')}
                className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">📡</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">RSS Feed</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Subscribe to your feed externally
                </div>
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">📝 Export Notes</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Exports include all your posts, replies, and interactions</li>
                <li>• Blockchain data remains accessible regardless of exports</li>
                <li>• You own your data and can export it anytime</li>
                <li>• Exports are GDPR and data portability compliant</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Share to Social Media
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  value={noteToShare}
                  onChange={(e) => setNoteToShare(e.target.value)}
                  rows={4}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {noteToShare.length} / 280 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Platforms
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.filter(p => p.connected).map((platform) => (
                    <label
                      key={platform.id}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        shareOptions.platforms.includes(platform.id)
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={shareOptions.platforms.includes(platform.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setShareOptions({
                              ...shareOptions,
                              platforms: [...shareOptions.platforms, platform.id],
                            });
                          } else {
                            setShareOptions({
                              ...shareOptions,
                              platforms: shareOptions.platforms.filter(id => id !== platform.id),
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-xl">{platform.icon}</span>
                      <span className="text-sm text-gray-900 dark:text-white">{platform.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={shareOptions.includeMedia}
                    onChange={(e) => setShareOptions({ ...shareOptions, includeMedia: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Include media attachments</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={shareOptions.addHashtags}
                    onChange={(e) => setShareOptions({ ...shareOptions, addHashtags: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Add hashtags automatically</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Share Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

