'use client';

import { Shield, Lock, Eye, Database, Globe, UserCheck, FileText, AlertCircle } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: 'What Data We Collect',
      content: [
        {
          subtitle: 'On-Chain Data (Public)',
          items: [
            'Wallet address (public blockchain identifier)',
            'Notes, replies, and reactions you post',
            'Following and follower relationships',
            'Community memberships and subscriptions',
            'Reward points and transaction history',
          ],
          note: 'This data is permanently stored on the blockchain and is publicly visible.',
        },
        {
          subtitle: 'Off-Chain Data (Private)',
          items: [
            'Email address (optional, for notifications)',
            'Profile settings and preferences',
            'Draft notes (stored locally)',
            'Blocked and muted user lists',
            'Notification preferences',
          ],
          note: 'This data is stored securely and is not publicly accessible.',
        },
        {
          subtitle: 'Media Files',
          items: [
            'Profile pictures and banners',
            'Images and videos in notes',
            'Media stored on IPFS (decentralized storage)',
          ],
          note: 'Media files are stored on IPFS and may be publicly accessible via their hash.',
        },
      ],
    },
    {
      icon: Eye,
      title: 'How We Use Your Data',
      content: [
        {
          subtitle: 'Platform Functionality',
          items: [
            'Display your content and profile information',
            'Enable social features (following, replies, reactions)',
            'Calculate rewards and engagement metrics',
            'Provide search and discovery features',
            'Send notifications (if enabled)',
          ],
        },
        {
          subtitle: 'Platform Improvement',
          items: [
            'Analyze usage patterns to improve features',
            'Monitor system performance and reliability',
            'Detect and prevent spam and abuse',
            'Conduct security audits',
          ],
        },
        {
          subtitle: 'We Never',
          items: [
            '❌ Sell your personal data to third parties',
            '❌ Use your data for targeted advertising',
            '❌ Share your email with marketers',
            '❌ Access your private keys or wallet',
          ],
        },
      ],
    },
    {
      icon: Lock,
      title: 'How We Protect Your Data',
      content: [
        {
          subtitle: 'Blockchain Security',
          items: [
            'Smart contracts audited for security vulnerabilities',
            'Immutable data storage on Ethereum/Base blockchain',
            'Cryptographic signatures for authentication',
            'No central point of failure',
          ],
        },
        {
          subtitle: 'Web Application Security',
          items: [
            'HTTPS encryption for all connections',
            'Regular security updates and patches',
            'Secure password hashing (if applicable)',
            'Protection against common web vulnerabilities',
          ],
        },
        {
          subtitle: 'Privacy Best Practices',
          items: [
            'Minimal data collection principle',
            'End-to-end encryption for direct messages (when available)',
            'Regular security audits',
            'Transparent data practices',
          ],
        },
      ],
    },
    {
      icon: UserCheck,
      title: 'Your Privacy Rights',
      content: [
        {
          subtitle: 'Access & Control',
          items: [
            'View all data associated with your account',
            'Export your data in portable formats',
            'Delete off-chain data at any time',
            'Control notification settings',
            'Manage blocked and muted users',
          ],
        },
        {
          subtitle: 'GDPR Rights (EU Users)',
          items: [
            'Right to access your personal data',
            'Right to rectification of inaccurate data',
            'Right to erasure ("right to be forgotten")',
            'Right to data portability',
            'Right to object to processing',
          ],
        },
        {
          subtitle: 'Blockchain Considerations',
          items: [
            'On-chain data cannot be deleted (blockchain immutability)',
            'You can stop using the platform at any time',
            'We can delete off-chain data and account metadata',
            'Consider blockchain transparency before posting',
          ],
        },
      ],
    },
    {
      icon: Globe,
      title: 'Third-Party Services',
      content: [
        {
          subtitle: 'Services We Use',
          items: [
            'IPFS: Decentralized storage for media files',
            'Base/Ethereum: Blockchain infrastructure',
            'WalletConnect: Wallet authentication',
            'Vercel: Website hosting',
          ],
        },
        {
          subtitle: 'Data Sharing',
          items: [
            'We only share data necessary for service operation',
            'Third parties have their own privacy policies',
            'We don\'t share personal data for marketing',
            'Blockchain data is public by nature',
          ],
        },
      ],
    },
    {
      icon: FileText,
      title: 'Cookies & Tracking',
      content: [
        {
          subtitle: 'Essential Cookies',
          items: [
            'Authentication and session management',
            'User preferences (theme, language)',
            'Security and fraud prevention',
          ],
          note: 'These cookies are necessary for the platform to function.',
        },
        {
          subtitle: 'Analytics (Optional)',
          items: [
            'Anonymous usage statistics',
            'Feature popularity metrics',
            'Performance monitoring',
          ],
          note: 'You can opt out of analytics in settings.',
        },
        {
          subtitle: 'What We Don\'t Use',
          items: [
            '❌ No third-party advertising cookies',
            '❌ No cross-site tracking',
            '❌ No fingerprinting techniques',
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-500" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4">
            Your privacy matters. We're committed to transparency about how we collect, use, and
            protect your data.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last Updated: November 5, 2025
          </p>
        </div>

        {/* Key Points */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6">Key Privacy Points</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-1">We Don't Sell Your Data</h3>
                <p className="text-sm text-white/90">Your information is never sold to advertisers or third parties</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-1">Blockchain Transparency</h3>
                <p className="text-sm text-white/90">On-chain data is public - consider before posting</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <UserCheck className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-1">You're In Control</h3>
                <p className="text-sm text-white/90">Export, delete, or modify your data anytime</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Database className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-1">Minimal Collection</h3>
                <p className="text-sm text-white/90">We only collect what's necessary for the service</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {section.content.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      {subsection.subtitle && (
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          {subsection.subtitle}
                        </h3>
                      )}
                      <ul className="space-y-2 mb-3">
                        {subsection.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                      {subsection.note && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            {subsection.note}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Children's Privacy */}
        <div className="mt-8 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Children's Privacy
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            NoteBoard is not intended for users under the age of 13. We do not knowingly collect
            personal information from children under 13. If you believe we have collected data from
            a child under 13, please contact us immediately.
          </p>
        </div>

        {/* Changes to Policy */}
        <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Changes to This Policy
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            We may update this privacy policy from time to time. We will notify you of significant
            changes by:
          </p>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 ml-5">
            <li>• Posting a notice on the platform</li>
            <li>• Sending an email notification (if you've provided one)</li>
            <li>• Updating the "Last Updated" date above</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us About Privacy
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            If you have questions about this privacy policy or how we handle your data, please
            contact us:
          </p>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>Email: privacy@noteboard.io</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-500" />
              <span>Support: <a href="/help" className="text-blue-600 dark:text-blue-400 hover:underline">Help Center</a></span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold">
                Export My Data
              </button>
              <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold">
                Manage Privacy Settings
              </button>
            </div>
          </div>
        </div>

        {/* Legal Note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            This policy is effective as of the date listed above and applies to all users of
            NoteBoard.
          </p>
          <p className="mt-2">
            By using NoteBoard, you agree to this privacy policy and our{' '}
            <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

