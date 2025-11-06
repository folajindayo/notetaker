'use client';

import { useState } from 'react';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: 'social' | 'content' | 'financial' | 'system';
}

interface NotificationPreferencesProps {
  onSave?: (settings: NotificationSetting[]) => void;
}

export default function NotificationPreferences({
  onSave,
}: NotificationPreferencesProps) {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    // Social Notifications
    {
      id: 'new_follower',
      label: 'New Followers',
      description: 'When someone follows you',
      enabled: true,
      category: 'social',
    },
    {
      id: 'note_liked',
      label: 'Likes',
      description: 'When someone likes your note',
      enabled: true,
      category: 'social',
    },
    {
      id: 'note_replied',
      label: 'Replies',
      description: 'When someone replies to your note',
      enabled: true,
      category: 'social',
    },
    {
      id: 'note_reposted',
      label: 'Reposts',
      description: 'When someone reposts your note',
      enabled: true,
      category: 'social',
    },
    {
      id: 'mentioned',
      label: 'Mentions',
      description: 'When someone mentions you in a note',
      enabled: true,
      category: 'social',
    },

    // Content Notifications
    {
      id: 'followed_user_post',
      label: 'Posts from Followed Users',
      description: 'When users you follow post new notes',
      enabled: false,
      category: 'content',
    },
    {
      id: 'trending_tag',
      label: 'Trending Tags',
      description: 'When tags you follow are trending',
      enabled: true,
      category: 'content',
    },
    {
      id: 'community_post',
      label: 'Community Posts',
      description: 'New posts in communities you joined',
      enabled: true,
      category: 'content',
    },
    {
      id: 'poll_ending',
      label: 'Poll Endings',
      description: 'When polls you voted on are ending',
      enabled: true,
      category: 'content',
    },

    // Financial Notifications
    {
      id: 'tip_received',
      label: 'Tips Received',
      description: 'When you receive a tip',
      enabled: true,
      category: 'financial',
    },
    {
      id: 'reward_earned',
      label: 'Rewards Earned',
      description: 'When you earn reward points',
      enabled: true,
      category: 'financial',
    },
    {
      id: 'subscription_started',
      label: 'New Subscribers',
      description: 'When someone subscribes to you',
      enabled: true,
      category: 'financial',
    },
    {
      id: 'subscription_expiring',
      label: 'Subscription Expiring',
      description: 'When your subscriptions are about to expire',
      enabled: true,
      category: 'financial',
    },

    // System Notifications
    {
      id: 'note_reported',
      label: 'Content Reported',
      description: 'When your content is reported',
      enabled: true,
      category: 'system',
    },
    {
      id: 'badge_earned',
      label: 'Badges',
      description: 'When you earn a new badge',
      enabled: true,
      category: 'system',
    },
    {
      id: 'system_update',
      label: 'System Updates',
      description: 'Platform updates and announcements',
      enabled: false,
      category: 'system',
    },
    {
      id: 'security_alert',
      label: 'Security Alerts',
      description: 'Important security notifications',
      enabled: true,
      category: 'system',
    },
  ]);

  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');
  const [emailDigest, setEmailDigest] = useState<'none' | 'daily' | 'weekly'>('daily');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const toggleCategory = (category: string, enabled: boolean) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.category === category ? { ...setting, enabled } : setting
      )
    );
  };

  const handleSave = () => {
    onSave?.(settings);
    alert('Notification preferences saved!');
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      social: '👥',
      content: '📝',
      financial: '💰',
      system: '⚙️',
    };
    return icons[category as keyof typeof icons] || '📢';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      social: 'Social Interactions',
      content: 'Content Updates',
      financial: 'Financial Activity',
      system: 'System & Security',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const categories = ['social', 'content', 'financial', 'system'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🔔 Notification Preferences
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Customize how you receive notifications
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          General Settings
        </h3>
        
        <div className="space-y-4">
          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Push Notifications
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Receive push notifications in your browser
              </div>
            </div>
            <button
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                pushEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  pushEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Notification Sound
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Play sound for notifications
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                soundEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Email Digest */}
          <div>
            <div className="font-medium text-gray-900 dark:text-white mb-2">
              Email Digest
            </div>
            <select
              value={emailDigest}
              onChange={(e) => setEmailDigest(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="none">No email notifications</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly digest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              🌙 Quiet Hours
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Pause notifications during specific hours
            </p>
          </div>
          <button
            onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              quietHoursEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                quietHoursEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {quietHoursEnabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={quietHoursStart}
                onChange={(e) => setQuietHoursStart(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={quietHoursEnd}
                onChange={(e) => setQuietHoursEnd(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Notification Categories */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categorySettings = settings.filter((s) => s.category === category);
          const allEnabled = categorySettings.every((s) => s.enabled);
          const someEnabled = categorySettings.some((s) => s.enabled);

          return (
            <div
              key={category}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getCategoryIcon(category)}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {getCategoryLabel(category)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {categorySettings.filter((s) => s.enabled).length} of{' '}
                      {categorySettings.length} enabled
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleCategory(category, true)}
                    className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    All
                  </button>
                  <button
                    onClick={() => toggleCategory(category, false)}
                    className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    None
                  </button>
                </div>
              </div>

              {/* Category Settings */}
              <div className="space-y-3">
                {categorySettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {setting.label}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {setting.description}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSetting(setting.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        setting.enabled
                          ? 'bg-blue-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          setting.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

