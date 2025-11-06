'use client';

import { useState, useEffect } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Share2, Award, CheckCheck, Trash2, Settings, Filter, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'share' | 'mention' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  link?: string;
}

interface NotificationCenterProps {
  onClose?: () => void;
}

export default function NotificationCenter({ onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      title: 'New Like',
      message: 'Alice liked your post "Building with Web3"',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      avatar: '👩‍💻',
    },
    {
      id: '2',
      type: 'comment',
      title: 'New Comment',
      message: 'Bob commented on your post: "Great insight!"',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
      avatar: '👨‍💼',
    },
    {
      id: '3',
      type: 'follow',
      title: 'New Follower',
      message: 'Charlie started following you',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: true,
      avatar: '👨‍🎨',
    },
    {
      id: '4',
      type: 'share',
      title: 'Post Shared',
      message: 'Diana shared your post',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      avatar: '👩‍🔬',
    },
    {
      id: '5',
      type: 'mention',
      title: 'You were mentioned',
      message: 'Eve mentioned you in a comment',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      read: true,
      avatar: '👩‍🎤',
    },
    {
      id: '6',
      type: 'achievement',
      title: 'Achievement Unlocked',
      message: 'You earned the "100 Posts" badge!',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      read: true,
      avatar: '🏆',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | Notification['type']>('all');
  const [showSettings, setShowSettings] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'share':
        return <Share2 className="w-5 h-5 text-purple-500" />;
      case 'mention':
        return <MessageCircle className="w-5 h-5 text-orange-500" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'comment':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'follow':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'share':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case 'mention':
        return 'bg-orange-100 dark:bg-orange-900/30';
      case 'achievement':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-lg p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Notification Settings
              </h3>
              <div className="space-y-2">
                {['like', 'comment', 'follow', 'share', 'mention', 'achievement'].map((type) => (
                  <label key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {type}s
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            {['all', 'unread', 'like', 'comment', 'follow', 'share', 'mention', 'achievement'].map(
              (filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType as typeof filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === filterType
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You're all caught up! Check back later.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(
                        notification.type
                      )}`}
                    >
                      {notification.avatar ? (
                        <span className="text-2xl">{notification.avatar}</span>
                      ) : (
                        getIcon(notification.type)
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={clearAll}
                className="text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {notifications.length}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{unreadCount}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Unread</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {notifications.filter((n) => n.read).length}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Read</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

