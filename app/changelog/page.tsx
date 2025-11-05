'use client';

import { GitBranch, Sparkles, Bug, Zap, Shield, Plus, ArrowRight } from 'lucide-react';

export default function ChangelogPage() {
  const releases = [
    {
      version: 'v2.1.0',
      date: 'November 5, 2025',
      type: 'major',
      changes: [
        {
          type: 'feature',
          title: 'Voice Messages',
          description: 'Record and send voice messages in notes and DMs',
        },
        {
          type: 'feature',
          title: 'Advanced Filters',
          description: 'Enhanced search with multiple filter options',
        },
        {
          type: 'feature',
          title: 'Achievement System',
          description: 'Unlock badges and rewards for platform activity',
        },
        {
          type: 'improvement',
          title: 'Performance Optimization',
          description: '50% faster page load times across the platform',
        },
      ],
    },
    {
      version: 'v2.0.0',
      date: 'October 15, 2025',
      type: 'major',
      changes: [
        {
          type: 'feature',
          title: 'Direct Messaging',
          description: 'Private messaging between users with full encryption',
        },
        {
          type: 'feature',
          title: 'Discover Page',
          description: 'New discovery feed with trending content and recommendations',
        },
        {
          type: 'feature',
          title: 'Contract Interaction UI',
          description: 'Direct smart contract interaction from the dashboard',
        },
        {
          type: 'breaking',
          title: 'API v2 Release',
          description: 'New REST API with WebSocket support (breaking changes)',
        },
      ],
    },
    {
      version: 'v1.8.0',
      date: 'September 28, 2025',
      type: 'minor',
      changes: [
        {
          type: 'feature',
          title: 'Onboarding Flow',
          description: 'Interactive setup wizard for new users',
        },
        {
          type: 'feature',
          title: 'Verification System',
          description: 'Apply for verified badge with document submission',
        },
        {
          type: 'improvement',
          title: 'Mobile Responsiveness',
          description: 'Improved mobile experience across all pages',
        },
        {
          type: 'security',
          title: 'Security Audit',
          description: 'Completed third-party security audit with no critical issues',
        },
      ],
    },
    {
      version: 'v1.7.0',
      date: 'September 10, 2025',
      type: 'minor',
      changes: [
        {
          type: 'feature',
          title: 'Data Export',
          description: 'Export your data in JSON or CSV format',
        },
        {
          type: 'feature',
          title: 'Draft System',
          description: 'Save notes as drafts before publishing',
        },
        {
          type: 'feature',
          title: 'Thread View',
          description: 'Improved conversation threading with nested replies',
        },
        {
          type: 'bug',
          title: 'Fixed notification delays',
          description: 'Resolved issue causing delayed push notifications',
        },
      ],
    },
    {
      version: 'v1.6.0',
      date: 'August 25, 2025',
      type: 'minor',
      changes: [
        {
          type: 'feature',
          title: 'Block & Mute',
          description: 'Enhanced privacy controls for user interactions',
        },
        {
          type: 'feature',
          title: 'Report System',
          description: 'Comprehensive content and user reporting',
        },
        {
          type: 'feature',
          title: 'Notification Settings',
          description: 'Granular control over notification preferences',
        },
        {
          type: 'improvement',
          title: 'Search Performance',
          description: 'Faster search results with improved indexing',
        },
      ],
    },
    {
      version: 'v1.5.0',
      date: 'August 5, 2025',
      type: 'minor',
      changes: [
        {
          type: 'feature',
          title: 'Communities',
          description: 'Create and join communities around shared interests',
        },
        {
          type: 'feature',
          title: 'Polls',
          description: 'Interactive polls with real-time results',
        },
        {
          type: 'feature',
          title: 'Rewards System',
          description: 'Earn points and ETH for platform engagement',
        },
        {
          type: 'bug',
          title: 'Fixed gas estimation',
          description: 'Improved gas estimation for transactions',
        },
      ],
    },
  ];

  const getTypeInfo = (type: string) => {
    const types: Record<string, { icon: any; color: string; bg: string; label: string }> = {
      feature: {
        icon: Plus,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-100 dark:bg-blue-900',
        label: 'New Feature',
      },
      improvement: {
        icon: Zap,
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900',
        label: 'Improvement',
      },
      bug: {
        icon: Bug,
        color: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-100 dark:bg-orange-900',
        label: 'Bug Fix',
      },
      security: {
        icon: Shield,
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-100 dark:bg-purple-900',
        label: 'Security',
      },
      breaking: {
        icon: Sparkles,
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-100 dark:bg-red-900',
        label: 'Breaking Change',
      },
    };
    return types[type] || types.feature;
  };

  const getReleaseTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      major: 'bg-gradient-to-r from-red-500 to-pink-600',
      minor: 'bg-gradient-to-r from-blue-500 to-purple-600',
      patch: 'bg-gradient-to-r from-green-500 to-teal-600',
    };
    return colors[type] || colors.minor;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <GitBranch className="w-12 h-12 text-blue-500" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Changelog</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            See what's new, improved, and fixed in NoteBoard
          </p>
        </div>

        {/* Latest Release Highlight */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <div>
              <div className="text-sm font-semibold text-blue-100">Latest Release</div>
              <h2 className="text-3xl font-bold">{releases[0].version}</h2>
            </div>
          </div>
          <p className="text-blue-100 mb-4">{releases[0].date}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {releases[0].changes.slice(0, 2).map((change, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="font-bold mb-1">{change.title}</div>
                <div className="text-sm text-blue-100">{change.description}</div>
              </div>
            ))}
          </div>
          <button className="mt-6 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center gap-2">
            View Full Release Notes
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Release History */}
        <div className="space-y-8">
          {releases.map((release, releaseIndex) => (
            <div
              key={releaseIndex}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              {/* Release Header */}
              <div className={`${getReleaseTypeColor(release.type)} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{release.version}</h3>
                    <p className="text-sm opacity-90">{release.date}</p>
                  </div>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-semibold text-sm uppercase">
                    {release.type}
                  </span>
                </div>
              </div>

              {/* Changes */}
              <div className="p-6 space-y-4">
                {release.changes.map((change, changeIndex) => {
                  const typeInfo = getTypeInfo(change.type);
                  const Icon = typeInfo.icon;

                  return (
                    <div
                      key={changeIndex}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${typeInfo.bg}`}>
                        <Icon className={`w-5 h-5 ${typeInfo.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {change.title}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${typeInfo.bg} ${typeInfo.color}`}
                          >
                            {typeInfo.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {change.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Change Types</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries({
              feature: 'New features and functionality',
              improvement: 'Enhancements to existing features',
              bug: 'Bug fixes and issue resolutions',
              security: 'Security updates and patches',
              breaking: 'Changes that may require updates',
            }).map(([type, description]) => {
              const typeInfo = getTypeInfo(type);
              const Icon = typeInfo.icon;
              return (
                <div key={type} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${typeInfo.bg}`}>
                    <Icon className={`w-5 h-5 ${typeInfo.color}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {typeInfo.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscribe */}
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-purple-100 mb-6">
            Subscribe to get notified about new releases and updates
          </p>
          <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <a href="/roadmap" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            View Roadmap
          </a>
          <span>•</span>
          <a href="https://github.com/noteboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            GitHub
          </a>
          <span>•</span>
          <a href="/api-docs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            API Docs
          </a>
        </div>
      </div>
    </div>
  );
}

