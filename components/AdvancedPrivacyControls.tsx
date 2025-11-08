'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

/**
 * AdvancedPrivacyControls - Comprehensive privacy settings management
 * Provides granular control over content visibility, interactions, and data sharing
 */

interface PrivacySettings {
  profile: {
    isPublic: boolean;
    showEmail: boolean;
    showWallet: boolean;
    showJoinDate: boolean;
    showActivityStatus: boolean;
    allowProfileIndexing: boolean;
  };
  content: {
    defaultPostVisibility: 'public' | 'followers' | 'private';
    allowReposts: boolean;
    allowQuotes: boolean;
    requireApprovalForTags: boolean;
    hideFromTrending: boolean;
    allowAITraining: boolean;
  };
  interactions: {
    whoCanReply: 'everyone' | 'followers' | 'mentioned' | 'none';
    whoCanTag: 'everyone' | 'followers' | 'none';
    whoCanDM: 'everyone' | 'followers' | 'verified' | 'none';
    allowReactions: boolean;
    showLikeCount: boolean;
    showViewCount: boolean;
  };
  discovery: {
    showInSearch: boolean;
    showInRecommendations: boolean;
    showInLeaderboard: boolean;
    allowFollowSuggestions: boolean;
    hideFollowerList: boolean;
    hideFollowingList: boolean;
  };
  notifications: {
    notifyOnLike: boolean;
    notifyOnReply: boolean;
    notifyOnMention: boolean;
    notifyOnFollow: boolean;
    notifyOnRepost: boolean;
    digestFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'never';
  };
  blockchain: {
    hideTransactionHistory: boolean;
    hideTokenBalances: boolean;
    hideNFTCollection: boolean;
    allowBlockchainAnalytics: boolean;
  };
  dataPrivacy: {
    allowAnalytics: boolean;
    allowCookies: boolean;
    allowPersonalization: boolean;
    deleteDataOnDeactivation: boolean;
    exportDataEnabled: boolean;
  };
}

export default function AdvancedPrivacyControls() {
  const { address } = useAccount();
  const [settings, setSettings] = useState<PrivacySettings>({
    profile: {
      isPublic: true,
      showEmail: false,
      showWallet: true,
      showJoinDate: true,
      showActivityStatus: true,
      allowProfileIndexing: true,
    },
    content: {
      defaultPostVisibility: 'public',
      allowReposts: true,
      allowQuotes: true,
      requireApprovalForTags: false,
      hideFromTrending: false,
      allowAITraining: false,
    },
    interactions: {
      whoCanReply: 'everyone',
      whoCanTag: 'everyone',
      whoCanDM: 'followers',
      allowReactions: true,
      showLikeCount: true,
      showViewCount: true,
    },
    discovery: {
      showInSearch: true,
      showInRecommendations: true,
      showInLeaderboard: true,
      allowFollowSuggestions: true,
      hideFollowerList: false,
      hideFollowingList: false,
    },
    notifications: {
      notifyOnLike: true,
      notifyOnReply: true,
      notifyOnMention: true,
      notifyOnFollow: true,
      notifyOnRepost: true,
      digestFrequency: 'realtime',
    },
    blockchain: {
      hideTransactionHistory: false,
      hideTokenBalances: false,
      hideNFTCollection: false,
      allowBlockchainAnalytics: true,
    },
    dataPrivacy: {
      allowAnalytics: true,
      allowCookies: true,
      allowPersonalization: true,
      deleteDataOnDeactivation: false,
      exportDataEnabled: true,
    },
  });

  const [activeSection, setActiveSection] = useState<keyof PrivacySettings>('profile');
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    if (!address) return;
    
    const stored = localStorage.getItem(`privacy_settings_${address}`);
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, [address]);

  const updateSetting = (
    section: keyof PrivacySettings,
    key: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    if (!address) return;
    
    localStorage.setItem(`privacy_settings_${address}`, JSON.stringify(settings));
    setHasChanges(false);
    alert('Privacy settings saved successfully!');
  };

  const resetToDefaults = () => {
    const confirmed = confirm('Are you sure you want to reset all privacy settings to defaults?');
    if (!confirmed) return;

    // Reset to default settings
    const defaults: PrivacySettings = {
      profile: {
        isPublic: true,
        showEmail: false,
        showWallet: true,
        showJoinDate: true,
        showActivityStatus: true,
        allowProfileIndexing: true,
      },
      content: {
        defaultPostVisibility: 'public',
        allowReposts: true,
        allowQuotes: true,
        requireApprovalForTags: false,
        hideFromTrending: false,
        allowAITraining: false,
      },
      interactions: {
        whoCanReply: 'everyone',
        whoCanTag: 'everyone',
        whoCanDM: 'followers',
        allowReactions: true,
        showLikeCount: true,
        showViewCount: true,
      },
      discovery: {
        showInSearch: true,
        showInRecommendations: true,
        showInLeaderboard: true,
        allowFollowSuggestions: true,
        hideFollowerList: false,
        hideFollowingList: false,
      },
      notifications: {
        notifyOnLike: true,
        notifyOnReply: true,
        notifyOnMention: true,
        notifyOnFollow: true,
        notifyOnRepost: true,
        digestFrequency: 'realtime',
      },
      blockchain: {
        hideTransactionHistory: false,
        hideTokenBalances: false,
        hideNFTCollection: false,
        allowBlockchainAnalytics: true,
      },
      dataPrivacy: {
        allowAnalytics: true,
        allowCookies: true,
        allowPersonalization: true,
        deleteDataOnDeactivation: false,
        exportDataEnabled: true,
      },
    };

    setSettings(defaults);
    setHasChanges(true);
  };

  const applyPrivacyPreset = (preset: 'public' | 'balanced' | 'private' | 'anonymous') => {
    let newSettings: PrivacySettings;

    switch (preset) {
      case 'public':
        newSettings = {
          profile: { ...settings.profile, isPublic: true, showWallet: true, showJoinDate: true, showActivityStatus: true, allowProfileIndexing: true },
          content: { ...settings.content, defaultPostVisibility: 'public', allowReposts: true, allowQuotes: true, hideFromTrending: false },
          interactions: { ...settings.interactions, whoCanReply: 'everyone', whoCanTag: 'everyone', whoCanDM: 'everyone', allowReactions: true, showLikeCount: true, showViewCount: true },
          discovery: { ...settings.discovery, showInSearch: true, showInRecommendations: true, showInLeaderboard: true, allowFollowSuggestions: true, hideFollowerList: false, hideFollowingList: false },
          notifications: settings.notifications,
          blockchain: { ...settings.blockchain, hideTransactionHistory: false, hideTokenBalances: false, hideNFTCollection: false, allowBlockchainAnalytics: true },
          dataPrivacy: { ...settings.dataPrivacy, allowAnalytics: true, allowPersonalization: true },
        };
        break;

      case 'balanced':
        newSettings = {
          profile: { ...settings.profile, isPublic: true, showEmail: false, showWallet: true, showActivityStatus: true, allowProfileIndexing: true },
          content: { ...settings.content, defaultPostVisibility: 'public', allowReposts: true, allowQuotes: true, requireApprovalForTags: true },
          interactions: { ...settings.interactions, whoCanReply: 'everyone', whoCanTag: 'followers', whoCanDM: 'followers', allowReactions: true },
          discovery: { ...settings.discovery, showInSearch: true, showInRecommendations: true, showInLeaderboard: true, allowFollowSuggestions: true },
          notifications: settings.notifications,
          blockchain: { ...settings.blockchain, hideTransactionHistory: false, hideTokenBalances: true },
          dataPrivacy: { ...settings.dataPrivacy, allowAnalytics: true, allowPersonalization: true },
        };
        break;

      case 'private':
        newSettings = {
          profile: { ...settings.profile, isPublic: false, showEmail: false, showWallet: false, showActivityStatus: false, allowProfileIndexing: false },
          content: { ...settings.content, defaultPostVisibility: 'followers', allowReposts: false, allowQuotes: false, requireApprovalForTags: true, hideFromTrending: true },
          interactions: { ...settings.interactions, whoCanReply: 'followers', whoCanTag: 'followers', whoCanDM: 'followers', showLikeCount: false, showViewCount: false },
          discovery: { ...settings.discovery, showInSearch: false, showInRecommendations: false, showInLeaderboard: false, hideFollowerList: true, hideFollowingList: true },
          notifications: settings.notifications,
          blockchain: { ...settings.blockchain, hideTransactionHistory: true, hideTokenBalances: true, hideNFTCollection: true },
          dataPrivacy: { ...settings.dataPrivacy, allowAnalytics: false, allowPersonalization: false },
        };
        break;

      case 'anonymous':
        newSettings = {
          profile: { ...settings.profile, isPublic: false, showEmail: false, showWallet: false, showJoinDate: false, showActivityStatus: false, allowProfileIndexing: false },
          content: { ...settings.content, defaultPostVisibility: 'private', allowReposts: false, allowQuotes: false, requireApprovalForTags: true, hideFromTrending: true, allowAITraining: false },
          interactions: { ...settings.interactions, whoCanReply: 'none', whoCanTag: 'none', whoCanDM: 'none', allowReactions: false, showLikeCount: false, showViewCount: false },
          discovery: { ...settings.discovery, showInSearch: false, showInRecommendations: false, showInLeaderboard: false, allowFollowSuggestions: false, hideFollowerList: true, hideFollowingList: true },
          notifications: { ...settings.notifications, digestFrequency: 'never' },
          blockchain: { ...settings.blockchain, hideTransactionHistory: true, hideTokenBalances: true, hideNFTCollection: true, allowBlockchainAnalytics: false },
          dataPrivacy: { ...settings.dataPrivacy, allowAnalytics: false, allowCookies: false, allowPersonalization: false },
        };
        break;

      default:
        return;
    }

    setSettings(newSettings);
    setHasChanges(true);
  };

  const sections = [
    { key: 'profile', icon: '👤', name: 'Profile Privacy' },
    { key: 'content', icon: '📝', name: 'Content Settings' },
    { key: 'interactions', icon: '💬', name: 'Interactions' },
    { key: 'discovery', icon: '🔍', name: 'Discovery' },
    { key: 'notifications', icon: '🔔', name: 'Notifications' },
    { key: 'blockchain', icon: '⛓️', name: 'Blockchain' },
    { key: 'dataPrivacy', icon: '🔒', name: 'Data & Privacy' },
  ];

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Please connect your wallet to access privacy settings
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
            🔒 Privacy & Security
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Take control of your privacy with granular settings
          </p>
        </div>

        {/* Quick Presets */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎯 Quick Privacy Presets
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => applyPrivacyPreset('public')}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-2">🌍</div>
              <div className="font-medium text-gray-900 dark:text-white">Public</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum visibility</div>
            </button>
            <button
              onClick={() => applyPrivacyPreset('balanced')}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-2">⚖️</div>
              <div className="font-medium text-gray-900 dark:text-white">Balanced</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended</div>
            </button>
            <button
              onClick={() => applyPrivacyPreset('private')}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-2">🔐</div>
              <div className="font-medium text-gray-900 dark:text-white">Private</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Limited access</div>
            </button>
            <button
              onClick={() => applyPrivacyPreset('anonymous')}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-2">👻</div>
              <div className="font-medium text-gray-900 dark:text-white">Anonymous</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum privacy</div>
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-6">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key as keyof PrivacySettings)}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                    activeSection === section.key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.name}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {sections.find(s => s.key === activeSection)?.icon}{' '}
                {sections.find(s => s.key === activeSection)?.name}
              </h2>

              <div className="space-y-6">
                {/* Profile Settings */}
                {activeSection === 'profile' && (
                  <>
                    {Object.entries(settings.profile).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {key === 'isPublic' && 'Make your profile visible to everyone'}
                            {key === 'showEmail' && 'Display your email on profile'}
                            {key === 'showWallet' && 'Show wallet address publicly'}
                            {key === 'showJoinDate' && 'Display account creation date'}
                            {key === 'showActivityStatus' && 'Show when you\'re active'}
                            {key === 'allowProfileIndexing' && 'Allow search engines to index your profile'}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) => updateSetting('profile', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </>
                )}

                {/* Content Settings */}
                {activeSection === 'content' && (
                  <>
                    <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                      <label className="font-medium text-gray-900 dark:text-white block mb-2">
                        Default Post Visibility
                      </label>
                      <select
                        value={settings.content.defaultPostVisibility}
                        onChange={(e) => updateSetting('content', 'defaultPostVisibility', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="public">Public - Everyone can see</option>
                        <option value="followers">Followers only</option>
                        <option value="private">Private - Only you</option>
                      </select>
                    </div>
                    {['allowReposts', 'allowQuotes', 'requireApprovalForTags', 'hideFromTrending', 'allowAITraining'].map((key) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.content[key as keyof typeof settings.content] as boolean}
                            onChange={(e) => updateSetting('content', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </>
                )}

                {/* Interactions Settings */}
                {activeSection === 'interactions' && (
                  <>
                    {['whoCanReply', 'whoCanTag', 'whoCanDM'].map((key) => (
                      <div key={key} className="py-3 border-b border-gray-200 dark:border-gray-700">
                        <label className="font-medium text-gray-900 dark:text-white block mb-2">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        <select
                          value={settings.interactions[key as keyof typeof settings.interactions] as string}
                          onChange={(e) => updateSetting('interactions', key, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="everyone">Everyone</option>
                          <option value="followers">Followers only</option>
                          {key === 'whoCanDM' && <option value="verified">Verified users</option>}
                          {key === 'whoCanReply' && <option value="mentioned">Mentioned only</option>}
                          <option value="none">No one</option>
                        </select>
                      </div>
                    ))}
                    {['allowReactions', 'showLikeCount', 'showViewCount'].map((key) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.interactions[key as keyof typeof settings.interactions] as boolean}
                            onChange={(e) => updateSetting('interactions', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </>
                )}

                {/* Other sections follow similar pattern */}
                {activeSection === 'discovery' && Object.entries(settings.discovery).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) => updateSetting('discovery', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}

                {activeSection === 'blockchain' && Object.entries(settings.blockchain).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) => updateSetting('blockchain', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}

                {activeSection === 'dataPrivacy' && Object.entries(settings.dataPrivacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) => updateSetting('dataPrivacy', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}

                {activeSection === 'notifications' && (
                  <>
                    <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                      <label className="font-medium text-gray-900 dark:text-white block mb-2">
                        Digest Frequency
                      </label>
                      <select
                        value={settings.notifications.digestFrequency}
                        onChange={(e) => updateSetting('notifications', 'digestFrequency', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="realtime">Real-time</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                    {['notifyOnLike', 'notifyOnReply', 'notifyOnMention', 'notifyOnFollow', 'notifyOnRepost'].map((key) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                            onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        {hasChanges && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                You have unsaved changes
              </div>
              <div className="flex gap-4">
                <button
                  onClick={resetToDefaults}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={saveSettings}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

