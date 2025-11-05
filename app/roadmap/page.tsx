'use client';

import { CheckCircle, Circle, Clock, Rocket, Users, Zap, Globe, Shield, Sparkles } from 'lucide-react';

export default function RoadmapPage() {
  const roadmapItems = [
    {
      quarter: 'Q4 2024',
      status: 'completed',
      items: [
        {
          title: 'Platform Launch',
          description: 'Initial release of NoteBoard on Base',
          status: 'completed',
          icon: Rocket,
        },
        {
          title: 'Core Features',
          description: 'Notes, likes, replies, and following system',
          status: 'completed',
          icon: CheckCircle,
        },
        {
          title: 'Smart Contract Deployment',
          description: 'Audited smart contracts deployed to Base mainnet',
          status: 'completed',
          icon: Shield,
        },
      ],
    },
    {
      quarter: 'Q1 2025',
      status: 'completed',
      items: [
        {
          title: 'Communities & Polls',
          description: 'Community features and interactive polls',
          status: 'completed',
          icon: Users,
        },
        {
          title: 'Reward System',
          description: 'Engagement rewards and monetization',
          status: 'completed',
          icon: Zap,
        },
        {
          title: 'Verification System',
          description: 'User verification and badges',
          status: 'completed',
          icon: CheckCircle,
        },
      ],
    },
    {
      quarter: 'Q2 2025',
      status: 'in-progress',
      items: [
        {
          title: 'Mobile Apps',
          description: 'iOS and Android native applications',
          status: 'in-progress',
          icon: Globe,
        },
        {
          title: 'Advanced Analytics',
          description: 'Comprehensive platform and user analytics',
          status: 'in-progress',
          icon: Sparkles,
        },
        {
          title: 'API v2',
          description: 'Enhanced API with WebSocket support',
          status: 'planned',
          icon: Zap,
        },
      ],
    },
    {
      quarter: 'Q3 2025',
      status: 'planned',
      items: [
        {
          title: 'Decentralized Storage',
          description: 'Full migration to IPFS and decentralized infrastructure',
          status: 'planned',
          icon: Globe,
        },
        {
          title: 'NFT Marketplace',
          description: 'Built-in marketplace for digital collectibles',
          status: 'planned',
          icon: Sparkles,
        },
        {
          title: 'DAO Governance',
          description: 'Community-driven platform governance',
          status: 'planned',
          icon: Users,
        },
      ],
    },
    {
      quarter: 'Q4 2025',
      status: 'planned',
      items: [
        {
          title: 'Cross-Chain Support',
          description: 'Expand to Ethereum, Polygon, and other L2s',
          status: 'planned',
          icon: Globe,
        },
        {
          title: 'AI Features',
          description: 'AI-powered content recommendations and moderation',
          status: 'planned',
          icon: Sparkles,
        },
        {
          title: 'Premium Subscriptions',
          description: 'Enhanced features for premium members',
          status: 'planned',
          icon: Zap,
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      completed: {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-500',
        icon: CheckCircle,
      },
      'in-progress': {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-500',
        icon: Clock,
      },
      planned: {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-400',
        icon: Circle,
      },
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Rocket className="w-12 h-12 text-blue-500" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Product Roadmap</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our vision for building the future of decentralized social media
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">8</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">3</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-gray-500 mb-2">7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Planned</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-gray-300 dark:from-green-400 dark:via-blue-400 dark:to-gray-600" />

          <div className="space-y-12">
            {roadmapItems.map((quarter, quarterIndex) => {
              const quarterColors = getStatusColor(quarter.status);
              const QuarterIcon = quarterColors.icon;

              return (
                <div key={quarterIndex} className="relative">
                  {/* Quarter Marker */}
                  <div className="flex items-center gap-6 mb-6">
                    <div
                      className={`w-16 h-16 rounded-full ${quarterColors.bg} border-4 ${quarterColors.border} flex items-center justify-center z-10`}
                    >
                      <QuarterIcon className={`w-8 h-8 ${quarterColors.text}`} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {quarter.quarter}
                      </h2>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${quarterColors.bg} ${quarterColors.text} capitalize`}
                      >
                        {quarter.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="ml-24 space-y-4">
                    {quarter.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      const itemColors = getStatusColor(item.status);

                      return (
                        <div
                          key={itemIndex}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3 rounded-lg ${itemColors.bg} border-2 ${itemColors.border}`}
                            >
                              <Icon className={`w-6 h-6 ${itemColors.text}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                  {item.title}
                                </h3>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${itemColors.bg} ${itemColors.text} capitalize`}
                                >
                                  {item.status.replace('-', ' ')}
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Status Legend</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Completed</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Feature is live and available
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">In Progress</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Currently being developed
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Circle className="w-8 h-8 text-gray-500" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Planned</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Scheduled for future release
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Input */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Shape Our Future</h2>
            <p className="text-lg text-blue-100 mb-6">
              Have an idea for a feature? We'd love to hear from you!
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                Submit Feedback
              </button>
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold">
                Join Discussion
              </button>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            This roadmap is subject to change based on community feedback and technical priorities.
          </p>
          <p className="mt-2">Last updated: November 5, 2025</p>
        </div>
      </div>
    </div>
  );
}

