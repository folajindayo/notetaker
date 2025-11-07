'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface Notification {
  id: string;
  type:
    | 'mention'
    | 'reply'
    | 'like'
    | 'follow'
    | 'tip'
    | 'dao'
    | 'grant'
    | 'system'
    | 'security'
    | 'achievement';
  title: string;
  message: string;
  from?: string;
  fromName?: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: {
    amount?: string;
    proposalId?: string;
    noteId?: string;
  };
}

interface NotificationSettings {
  mentions: boolean;
  replies: boolean;
  likes: boolean;
  follows: boolean;
  tips: boolean;
  dao: boolean;
  grants: boolean;
  system: boolean;
  security: boolean;
  achievements: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
}

export default function NotificationCenter() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    mentions: true,
    replies: true,
    likes: true,
    follows: true,
    tips: true,
    dao: true,
    grants: true,
    system: true,
    security: true,
    achievements: true,
    emailNotifications: false,
    pushNotifications: true,
    soundEnabled: true,
  });

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'security',
          title: t('securityAlert'),
          message: t('newLoginDetected'),
          timestamp: Date.now() - 600000,
          read: false,
          priority: 'urgent',
        },
        {
          id: '2',
          type: 'tip',
          title: t('tipReceived'),
          message: t('receivedTipFrom'),
          from: '0x1234567890123456789012345678901234567890',
          fromName: 'CryptoFan',
          timestamp: Date.now() - 1800000,
          read: false,
          priority: 'high',
          metadata: { amount: '0.5 ETH', noteId: 'note_123' },
        },
        {
          id: '3',
          type: 'dao',
          title: t('newProposal'),
          message: t('proposalRequiresYourVote'),
          timestamp: Date.now() - 3600000,
          read: false,
          priority: 'high',
          metadata: { proposalId: 'PROP-456' },
          actionUrl: '/dao/proposals/456',
        },
        {
          id: '4',
          type: 'mention',
          title: t('mentionedInPost'),
          message: t('userMentionedYou'),
          from: '0x9876543210987654321098765432109876543210',
          fromName: 'Developer123',
          timestamp: Date.now() - 7200000,
          read: true,
          priority: 'normal',
          metadata: { noteId: 'note_789' },
        },
        {
          id: '5',
          type: 'achievement',
          title: t('achievementUnlocked'),
          message: t('earned100Likes'),
          timestamp: Date.now() - 10800000,
          read: true,
          priority: 'normal',
        },
        {
          id: '6',
          type: 'follow',
          title: t('newFollower'),
          message: t('userStartedFollowing'),
          from: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          fromName: 'Web3Builder',
          timestamp: Date.now() - 14400000,
          read: true,
          priority: 'low',
        },
        {
          id: '7',
          type: 'reply',
          title: t('newReply'),
          message: t('userRepliedToYourPost'),
          from: '0x1111111111111111111111111111111111111111',
          fromName: 'ReplyBot',
          timestamp: Date.now() - 18000000,
          read: true,
          priority: 'normal',
          metadata: { noteId: 'note_456' },
        },
        {
          id: '8',
          type: 'grant',
          title: t('grantApproved'),
          message: t('yourGrantWasApproved'),
          timestamp: Date.now() - 86400000,
          read: true,
          priority: 'high',
          metadata: { amount: '10,000 USDC' },
        },
      ];

      setNotifications(mockNotifications);
      setFilteredNotifications(mockNotifications);
      setLoading(false);
    };

    if (address) {
      loadNotifications();
    }
  }, [address]);

  useEffect(() => {
    let filtered = notifications;

    // Apply read filter
    if (filter === 'unread') {
      filtered = filtered.filter((n) => !n.read);
    } else if (filter === 'important') {
      filtered = filtered.filter((n) => n.priority === 'high' || n.priority === 'urgent');
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((n) => n.type === typeFilter);
    }

    setFilteredNotifications(filtered);
  }, [filter, typeFilter, notifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      mention: '💬',
      reply: '💭',
      like: '❤️',
      follow: '👤',
      tip: '💰',
      dao: '🏛️',
      grant: '🎁',
      system: '⚙️',
      security: '🔒',
      achievement: '🏆',
    };
    return icons[type as keyof typeof icons] || '🔔';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      mention: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      reply: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      like: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
      follow: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      tip: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      dao: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      grant: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
      system: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      security: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      achievement: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };
    return colors[type as keyof typeof colors] || colors.system;
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'urgent') {
      return (
        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs font-bold">
          {t('urgent')}
        </span>
      );
    }
    if (priority === 'high') {
      return (
        <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded text-xs font-medium">
          {t('high')}
        </span>
      );
    }
    return null;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToViewNotifications')}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('notifications')}</h2>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-sm font-medium"
          >
            {t('markAllRead')}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('notificationSettings')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {t(key)}
                </span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                  className="w-5 h-5 text-blue-500 rounded"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'unread', 'important'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t(f)}
            </button>
          ))}
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">{t('allTypes')}</option>
          <option value="mention">{t('mentions')}</option>
          <option value="reply">{t('replies')}</option>
          <option value="like">{t('likes')}</option>
          <option value="follow">{t('follows')}</option>
          <option value="tip">{t('tips')}</option>
          <option value="dao">{t('dao')}</option>
          <option value="grant">{t('grants')}</option>
          <option value="system">{t('system')}</option>
          <option value="security">{t('security')}</option>
          <option value="achievement">{t('achievements')}</option>
        </select>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">🔔</div>
          <p className="text-gray-600 dark:text-gray-400">{t('noNotifications')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
                notification.read
                  ? 'border-gray-200 dark:border-gray-700'
                  : 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/10'
              }`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${getTypeColor(notification.type)}`}>
                  <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      {getPriorityBadge(notification.priority)}
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {notification.message}
                    {notification.fromName && (
                      <strong className="text-gray-900 dark:text-white ml-1">
                        {notification.fromName}
                      </strong>
                    )}
                  </p>

                  {/* Metadata */}
                  {notification.metadata && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {notification.metadata.amount && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs font-semibold">
                          {notification.metadata.amount}
                        </span>
                      )}
                      {notification.metadata.proposalId && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-xs font-mono">
                          {notification.metadata.proposalId}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                    <span>{new Date(notification.timestamp).toLocaleString()}</span>
                    {notification.from && (
                      <>
                        <span>•</span>
                        <span className="font-mono">
                          {notification.from.slice(0, 10)}...{notification.from.slice(-8)}
                        </span>
                      </>
                    )}
                  </div>

                  {notification.actionUrl && (
                    <button className="mt-2 text-sm text-blue-500 hover:text-blue-600 font-medium">
                      {t('viewDetails')} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {notifications.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleClearAll}
            className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
          >
            {t('clearAll')}
          </button>
        </div>
      )}
    </div>
  );
}
