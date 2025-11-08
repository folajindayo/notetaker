'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

/**
 * ContentScheduler - Advanced content scheduling and automation
 * Allows users to schedule posts, create recurring content, and manage posting queues
 */

interface ScheduledPost {
  id: string;
  message: string;
  scheduledTime: number;
  tags: string[];
  mediaHash?: string;
  status: 'scheduled' | 'posted' | 'failed' | 'cancelled';
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  platforms?: string[];
  createdAt: number;
}

interface DraftPost {
  id: string;
  message: string;
  tags: string[];
  mediaHash?: string;
  lastEdited: number;
}

export default function ContentScheduler() {
  const { address } = useAccount();
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'queue' | 'drafts' | 'calendar'>('schedule');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  const [newPost, setNewPost] = useState({
    message: '',
    tags: '',
    scheduledTime: '',
    isRecurring: false,
    recurringPattern: 'daily' as 'daily' | 'weekly' | 'monthly',
    platforms: [] as string[],
  });

  // Load scheduled posts from localStorage
  useEffect(() => {
    if (!address) return;
    
    const storedPosts = localStorage.getItem(`scheduled_posts_${address}`);
    const storedDrafts = localStorage.getItem(`drafts_${address}`);
    
    if (storedPosts) {
      setScheduledPosts(JSON.parse(storedPosts));
    }
    if (storedDrafts) {
      setDrafts(JSON.parse(storedDrafts));
    }
  }, [address]);

  // Save to localStorage
  const saveToStorage = () => {
    if (!address) return;
    localStorage.setItem(`scheduled_posts_${address}`, JSON.stringify(scheduledPosts));
    localStorage.setItem(`drafts_${address}`, JSON.stringify(drafts));
  };

  useEffect(() => {
    saveToStorage();
  }, [scheduledPosts, drafts]);

  const handleSchedulePost = () => {
    if (!address || !newPost.message.trim() || !newPost.scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }

    const scheduledTime = new Date(newPost.scheduledTime).getTime();
    if (scheduledTime <= Date.now()) {
      alert('Please select a future date and time');
      return;
    }

    const post: ScheduledPost = {
      id: Date.now().toString(),
      message: newPost.message,
      scheduledTime,
      tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'scheduled',
      isRecurring: newPost.isRecurring,
      recurringPattern: newPost.isRecurring ? newPost.recurringPattern : undefined,
      platforms: newPost.platforms,
      createdAt: Date.now(),
    };

    setScheduledPosts([...scheduledPosts, post]);
    setShowScheduleModal(false);
    
    // Reset form
    setNewPost({
      message: '',
      tags: '',
      scheduledTime: '',
      isRecurring: false,
      recurringPattern: 'daily',
      platforms: [],
    });
  };

  const saveDraft = () => {
    if (!address || !newPost.message.trim()) {
      alert('Please enter a message');
      return;
    }

    const draft: DraftPost = {
      id: Date.now().toString(),
      message: newPost.message,
      tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
      lastEdited: Date.now(),
    };

    setDrafts([...drafts, draft]);
    setShowScheduleModal(false);
    
    // Reset form
    setNewPost({
      message: '',
      tags: '',
      scheduledTime: '',
      isRecurring: false,
      recurringPattern: 'daily',
      platforms: [],
    });
    
    alert('Draft saved!');
  };

  const cancelScheduledPost = (postId: string) => {
    const confirmed = confirm('Are you sure you want to cancel this scheduled post?');
    if (!confirmed) return;

    setScheduledPosts(scheduledPosts.map(post =>
      post.id === postId ? { ...post, status: 'cancelled' as const } : post
    ));
  };

  const deletePost = (postId: string) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== postId));
  };

  const deleteDraft = (draftId: string) => {
    setDrafts(drafts.filter(draft => draft.id !== draftId));
  };

  const loadDraft = (draft: DraftPost) => {
    setNewPost({
      message: draft.message,
      tags: draft.tags.join(', '),
      scheduledTime: '',
      isRecurring: false,
      recurringPattern: 'daily',
      platforms: [],
    });
    setShowScheduleModal(true);
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeUntil = (timestamp: number) => {
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff < 0) return 'Past due';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const upcomingPosts = scheduledPosts.filter(p => p.status === 'scheduled').sort((a, b) => a.scheduledTime - b.scheduledTime);
  const postedPosts = scheduledPosts.filter(p => p.status === 'posted');
  const failedPosts = scheduledPosts.filter(p => p.status === 'failed');

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Please connect your wallet to access content scheduling
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
            📅 Content Scheduler
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule posts, manage drafts, and automate your content strategy
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{upcomingPosts.length}</div>
            <div className="text-sm opacity-90">Scheduled</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{postedPosts.length}</div>
            <div className="text-sm opacity-90">Posted</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{drafts.length}</div>
            <div className="text-sm opacity-90">Drafts</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{scheduledPosts.filter(p => p.isRecurring).length}</div>
            <div className="text-sm opacity-90">Recurring</div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                📥 Import Queue
              </button>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                📤 Export Schedule
              </button>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ➕ Schedule Post
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {(['schedule', 'queue', 'drafts', 'calendar'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab === 'schedule' && '📅 Scheduled'}
                {tab === 'queue' && '📋 Queue'}
                {tab === 'drafts' && '📝 Drafts'}
                {tab === 'calendar' && '🗓️ Calendar'}
              </button>
            ))}
          </div>
        </div>

        {/* Scheduled Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            {upcomingPosts.length > 0 ? (
              upcomingPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                          {post.isRecurring ? `🔄 ${post.recurringPattern}` : '📅 One-time'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          In {getTimeUntil(post.scheduledTime)}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white mb-2">{post.message}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>📅 {formatDateTime(post.scheduledTime)}</span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => cancelScheduledPost(post.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No scheduled posts. Click "Schedule Post" to get started!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Queue Tab */}
        {activeTab === 'queue' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Posting Queue
            </h3>
            <div className="space-y-3">
              {scheduledPosts.filter(p => p.status !== 'cancelled').slice(0, 5).map((post, index) => (
                <div key={post.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 dark:text-white line-clamp-1">{post.message}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(post.scheduledTime)}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    post.status === 'posted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                  }`}>
                    {post.status}
                  </div>
                </div>
              ))}
              {scheduledPosts.length === 0 && (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  Your posting queue is empty
                </div>
              )}
            </div>
          </div>
        )}

        {/* Drafts Tab */}
        {activeTab === 'drafts' && (
          <div className="space-y-4">
            {drafts.length > 0 ? (
              drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white mb-2">{draft.message}</p>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Last edited: {formatDateTime(draft.lastEdited)}
                      </div>
                      {draft.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {draft.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => loadDraft(draft)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No drafts saved yet
                </p>
              </div>
            )}
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🗓️ Content Calendar
            </h3>
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              Calendar view coming soon! View your scheduled posts in a monthly calendar format.
            </div>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Schedule Post
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  value={newPost.message}
                  onChange={(e) => setNewPost({ ...newPost, message: e.target.value })}
                  rows={4}
                  placeholder="What do you want to share?"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {newPost.message.length} / 280 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  placeholder="web3, blockchain, crypto"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Schedule Time *
                </label>
                <input
                  type="datetime-local"
                  value={newPost.scheduledTime}
                  onChange={(e) => setNewPost({ ...newPost, scheduledTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newPost.isRecurring}
                    onChange={(e) => setNewPost({ ...newPost, isRecurring: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Recurring post</span>
                </label>

                {newPost.isRecurring && (
                  <select
                    value={newPost.recurringPattern}
                    onChange={(e) => setNewPost({ ...newPost, recurringPattern: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveDraft}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={handleSchedulePost}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

