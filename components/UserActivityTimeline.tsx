'use client';

import { useState } from 'react';

type ActivityType =
  | 'note_posted'
  | 'note_liked'
  | 'note_replied'
  | 'user_followed'
  | 'community_joined'
  | 'reward_claimed'
  | 'badge_earned'
  | 'note_reposted'
  | 'poll_created'
  | 'poll_voted'
  | 'subscription_started'
  | 'tip_sent'
  | 'tip_received';

interface Activity {
  id: string;
  type: ActivityType;
  timestamp: Date;
  user: {
    address: string;
    username?: string;
    avatar?: string;
  };
  metadata: {
    noteId?: bigint;
    noteContent?: string;
    targetUser?: string;
    communityName?: string;
    rewardAmount?: string;
    badgeName?: string;
    tipAmount?: string;
    pollQuestion?: string;
  };
}

interface UserActivityTimelineProps {
  activities: Activity[];
  maxItems?: number;
  showFilters?: boolean;
}

export default function UserActivityTimeline({
  activities,
  maxItems = 50,
  showFilters = true,
}: UserActivityTimelineProps) {
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter activities
  const filteredActivities = activities
    .filter((activity) => {
      const typeMatch = filterType === 'all' || activity.type === filterType;
      
      const now = new Date();
      const activityDate = new Date(activity.timestamp);
      let timeMatch = true;

      if (timeFilter === 'today') {
        timeMatch = activityDate.toDateString() === now.toDateString();
      } else if (timeFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        timeMatch = activityDate >= weekAgo;
      } else if (timeFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        timeMatch = activityDate >= monthAgo;
      }

      return typeMatch && timeMatch;
    })
    .slice(0, maxItems);

  // Get activity icon
  const getActivityIcon = (type: ActivityType): string => {
    const icons: Record<ActivityType, string> = {
      note_posted: '📝',
      note_liked: '❤️',
      note_replied: '💬',
      user_followed: '👥',
      community_joined: '🏘️',
      reward_claimed: '💰',
      badge_earned: '🏆',
      note_reposted: '🔄',
      poll_created: '📊',
      poll_voted: '🗳️',
      subscription_started: '⭐',
      tip_sent: '💸',
      tip_received: '💵',
    };
    return icons[type];
  };

  // Get activity color
  const getActivityColor = (type: ActivityType): string => {
    const colors: Record<ActivityType, string> = {
      note_posted: 'bg-blue-500',
      note_liked: 'bg-red-500',
      note_replied: 'bg-green-500',
      user_followed: 'bg-purple-500',
      community_joined: 'bg-orange-500',
      reward_claimed: 'bg-yellow-500',
      badge_earned: 'bg-pink-500',
      note_reposted: 'bg-cyan-500',
      poll_created: 'bg-indigo-500',
      poll_voted: 'bg-teal-500',
      subscription_started: 'bg-amber-500',
      tip_sent: 'bg-lime-500',
      tip_received: 'bg-emerald-500',
    };
    return colors[type];
  };

  // Get activity title
  const getActivityTitle = (activity: Activity): string => {
    const titles: Record<ActivityType, string> = {
      note_posted: 'Posted a note',
      note_liked: 'Liked a note',
      note_replied: 'Replied to a note',
      user_followed: 'Followed a user',
      community_joined: 'Joined a community',
      reward_claimed: 'Claimed rewards',
      badge_earned: 'Earned a badge',
      note_reposted: 'Reposted a note',
      poll_created: 'Created a poll',
      poll_voted: 'Voted on a poll',
      subscription_started: 'Started a subscription',
      tip_sent: 'Sent a tip',
      tip_received: 'Received a tip',
    };
    return titles[activity.type];
  };

  // Get activity description
  const getActivityDescription = (activity: Activity): string => {
    const { metadata } = activity;

    switch (activity.type) {
      case 'note_posted':
        return metadata.noteContent?.slice(0, 100) || 'Posted a new note';
      case 'note_liked':
      case 'note_replied':
      case 'note_reposted':
        return metadata.noteContent?.slice(0, 100) || 'Interacted with a note';
      case 'user_followed':
        return `Followed ${metadata.targetUser?.slice(0, 6)}...${metadata.targetUser?.slice(-4)}`;
      case 'community_joined':
        return `Joined "${metadata.communityName}"`;
      case 'reward_claimed':
        return `Claimed ${metadata.rewardAmount} ETH in rewards`;
      case 'badge_earned':
        return `Earned the "${metadata.badgeName}" badge`;
      case 'poll_created':
        return metadata.pollQuestion || 'Created a new poll';
      case 'poll_voted':
        return 'Voted on a poll';
      case 'subscription_started':
        return `Subscribed to ${metadata.targetUser?.slice(0, 6)}...${metadata.targetUser?.slice(-4)}`;
      case 'tip_sent':
        return `Sent ${metadata.tipAmount} ETH tip`;
      case 'tip_received':
        return `Received ${metadata.tipAmount} ETH tip`;
      default:
        return 'Activity recorded';
    }
  };

  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Group activities by date
  const groupedActivities: { date: string; activities: Activity[] }[] = [];
  let currentDate = '';

  filteredActivities.forEach((activity) => {
    const activityDate = new Date(activity.timestamp).toLocaleDateString();
    if (activityDate !== currentDate) {
      currentDate = activityDate;
      groupedActivities.push({ date: activityDate, activities: [activity] });
    } else {
      groupedActivities[groupedActivities.length - 1].activities.push(activity);
    }
  });

  // Activity type options
  const activityTypes: Array<{ value: ActivityType | 'all'; label: string }> = [
    { value: 'all', label: 'All Activities' },
    { value: 'note_posted', label: 'Posts' },
    { value: 'note_liked', label: 'Likes' },
    { value: 'note_replied', label: 'Replies' },
    { value: 'user_followed', label: 'Follows' },
    { value: 'community_joined', label: 'Communities' },
    { value: 'reward_claimed', label: 'Rewards' },
    { value: 'badge_earned', label: 'Badges' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📅 Activity Timeline
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your recent activities and interactions
        </p>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Activity Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Activity Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {activityTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Period
              </label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {filteredActivities.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No activities found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or start interacting on the platform
            </p>
          </div>
        ) : (
          groupedActivities.map((group, groupIndex) => (
            <div key={group.date} className="mb-8">
              {/* Date Header */}
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  {group.date}
                </div>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600 ml-4" />
              </div>

              {/* Activities for this date */}
              {group.activities.map((activity, activityIndex) => (
                <div
                  key={activity.id}
                  className="relative pl-10 pb-8 last:pb-0"
                >
                  {/* Timeline line */}
                  {activityIndex < group.activities.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" />
                  )}

                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 top-2 w-8 h-8 ${getActivityColor(
                      activity.type
                    )} rounded-full flex items-center justify-center text-white shadow-lg`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Activity Card */}
                  <div
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-500"
                    onClick={() =>
                      setExpandedId(expandedId === activity.id ? null : activity.id)
                    }
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                          {getActivityTitle(activity)}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {getActivityDescription(activity)}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-4 whitespace-nowrap">
                        {formatRelativeTime(new Date(activity.timestamp))}
                      </span>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === activity.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm space-y-2">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              User:
                            </span>{' '}
                            <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                              {activity.user.address}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              Time:
                            </span>{' '}
                            <span className="text-gray-600 dark:text-gray-400">
                              {new Date(activity.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {activity.metadata.noteId && (
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                Note ID:
                              </span>{' '}
                              <span className="text-gray-600 dark:text-gray-400">
                                #{activity.metadata.noteId.toString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {activities.length > maxItems && (
        <div className="text-center mt-6">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Load More Activities
          </button>
        </div>
      )}
    </div>
  );
}

