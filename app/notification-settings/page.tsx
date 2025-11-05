'use client';

import { useState } from 'react';
import { Bell, Mail, MessageSquare, Heart, Users, TrendingUp, Award, Shield, Save } from 'lucide-react';

interface NotificationSettings {
  email: {
    enabled: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
    types: {
      newFollower: boolean;
      likes: boolean;
      replies: boolean;
      mentions: boolean;
      reposts: boolean;
      communityUpdates: boolean;
      rewards: boolean;
    };
  };
  push: {
    enabled: boolean;
    types: {
      newFollower: boolean;
      likes: boolean;
      replies: boolean;
      mentions: boolean;
      reposts: boolean;
      directMessages: boolean;
      trending: boolean;
      moderationAlerts: boolean;
    };
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    readReceipts: boolean;
    activityStatus: boolean;
  };
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      frequency: 'daily',
      types: {
        newFollower: true,
        likes: true,
        replies: true,
        mentions: true,
        reposts: true,
        communityUpdates: false,
        rewards: true,
      },
    },
    push: {
      enabled: true,
      types: {
        newFollower: true,
        likes: false,
        replies: true,
        mentions: true,
        reposts: false,
        directMessages: true,
        trending: false,
        moderationAlerts: true,
      },
    },
    inApp: {
      enabled: true,
      sound: true,
      desktop: true,
    },
    privacy: {
      showOnlineStatus: true,
      readReceipts: true,
      activityStatus: true,
    },
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to backend/blockchain
    console.log('Saving notification settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateEmailType = (type: keyof typeof settings.email.types) => {
    setSettings({
      ...settings,
      email: {
        ...settings.email,
        types: {
          ...settings.email.types,
          [type]: !settings.email.types[type],
        },
      },
    });
  };

  const updatePushType = (type: keyof typeof settings.push.types) => {
    setSettings({
      ...settings,
      push: {
        ...settings.push,
        types: {
          ...settings.push.types,
          [type]: !settings.push.types[type],
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Notification Settings
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Customize how you receive updates and alerts from NoteBoard
          </p>
        </div>

        {/* Save Success Message */}
        {saved && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg flex items-center gap-3">
            <Save className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-300 font-medium">
              Settings saved successfully!
            </span>
          </div>
        )}

        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Email Notifications</h2>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email: { ...settings.email, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-white/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-white/50"></div>
                </label>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Email Frequency */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Email Frequency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['instant', 'daily', 'weekly'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          email: { ...settings.email, frequency: freq },
                        })
                      }
                      disabled={!settings.email.enabled}
                      className={`px-4 py-2 rounded-lg capitalize transition-all ${
                        settings.email.frequency === freq
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } ${!settings.email.enabled && 'opacity-50 cursor-not-allowed'}`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Types */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Email Me When
                </label>
                {Object.entries(settings.email.types).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => updateEmailType(key as any)}
                      disabled={!settings.email.enabled}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Push Notifications</h2>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.push.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        push: { ...settings.push, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-white/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-white/50"></div>
                </label>
              </div>
            </div>

            <div className="p-6 space-y-2">
              {Object.entries(settings.push.types).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {key === 'newFollower' && <Users className="w-5 h-5 text-purple-500" />}
                    {key === 'likes' && <Heart className="w-5 h-5 text-red-500" />}
                    {key === 'replies' && <MessageSquare className="w-5 h-5 text-blue-500" />}
                    {key === 'mentions' && <Bell className="w-5 h-5 text-yellow-500" />}
                    {key === 'trending' && <TrendingUp className="w-5 h-5 text-green-500" />}
                    {key === 'moderationAlerts' && <Shield className="w-5 h-5 text-orange-500" />}
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => updatePushType(key as any)}
                    disabled={!settings.push.enabled}
                    className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* In-App Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">In-App Notifications</h2>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Enable In-App Notifications
                </span>
                <input
                  type="checkbox"
                  checked={settings.inApp.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      inApp: { ...settings.inApp, enabled: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-green-500 rounded focus:ring-2 focus:ring-green-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Notification Sound
                </span>
                <input
                  type="checkbox"
                  checked={settings.inApp.sound}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      inApp: { ...settings.inApp, sound: e.target.checked },
                    })
                  }
                  disabled={!settings.inApp.enabled}
                  className="w-5 h-5 text-green-500 rounded focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Desktop Notifications
                </span>
                <input
                  type="checkbox"
                  checked={settings.inApp.desktop}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      inApp: { ...settings.inApp, desktop: e.target.checked },
                    })
                  }
                  disabled={!settings.inApp.enabled}
                  className="w-5 h-5 text-green-500 rounded focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                />
              </label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Privacy & Activity</h2>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div>
                  <div className="text-gray-700 dark:text-gray-300 font-medium">
                    Show Online Status
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Let others see when you're online
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.showOnlineStatus}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, showOnlineStatus: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div>
                  <div className="text-gray-700 dark:text-gray-300 font-medium">
                    Read Receipts
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Let others know when you've seen their messages
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.readReceipts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, readReceipts: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div>
                  <div className="text-gray-700 dark:text-gray-300 font-medium">
                    Activity Status
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Show your activity like posts and likes
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.activityStatus}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, activityStatus: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleSave}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

