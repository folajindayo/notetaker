'use client';

import { Shield, Heart, Users, AlertTriangle, CheckCircle, XCircle, Scale, Eye } from 'lucide-react';

export default function GuidelinesPage() {
  const guidelines = [
    {
      icon: Heart,
      title: 'Be Respectful',
      color: 'red',
      rules: [
        'Treat everyone with respect and dignity',
        'Disagree constructively, without personal attacks',
        'Value diverse perspectives and backgrounds',
        'No harassment, bullying, or intimidation',
      ],
      examples: {
        good: [
          'I respectfully disagree with your point about...',
          'That\'s an interesting perspective, here\'s another way to look at it...',
        ],
        bad: [
          'You\'re an idiot for thinking that',
          'Anyone who believes this is stupid',
        ],
      },
    },
    {
      icon: Users,
      title: 'Build Community',
      color: 'blue',
      rules: [
        'Contribute meaningfully to discussions',
        'Support and encourage fellow community members',
        'Share knowledge and help others learn',
        'Welcome newcomers and be patient',
      ],
      examples: {
        good: [
          'Great question! Here\'s how I solved that problem...',
          'Welcome to the community! Let me help you get started...',
        ],
        bad: [
          'This has been asked a million times, search first!',
          'Why are you even here if you don\'t know this?',
        ],
      },
    },
    {
      icon: Shield,
      title: 'Maintain Safety',
      color: 'green',
      rules: [
        'No hate speech, discrimination, or bigotry',
        'No threats, violence, or dangerous content',
        'Protect privacy - no doxxing or sharing personal info',
        'Report harmful content when you see it',
      ],
      examples: {
        good: [
          'I reported that post because it contained personal information',
          'This content seems harmful, flagging for moderator review',
        ],
        bad: [
          'Here\'s [person]\'s home address...',
          'We should organize to harm [group]...',
        ],
      },
    },
    {
      icon: CheckCircle,
      title: 'Create Quality Content',
      color: 'purple',
      rules: [
        'Post original, authentic content',
        'Give credit and cite sources',
        'No spam, scams, or misleading information',
        'Stay on topic and relevant',
      ],
      examples: {
        good: [
          'Here\'s my analysis based on [source]...',
          'Original research I conducted on...',
        ],
        bad: [
          'Buy my course now! Limited time! [spam link]',
          'This miracle cure will solve everything! [misinformation]',
        ],
      },
    },
    {
      icon: Scale,
      title: 'Respect Intellectual Property',
      color: 'orange',
      rules: [
        'Don\'t share copyrighted content without permission',
        'Respect NFT ownership and digital rights',
        'Give proper attribution for others\' work',
        'Report copyright violations',
      ],
      examples: {
        good: [
          'Check out this article by @author [with permission]',
          'My own original artwork inspired by...',
        ],
        bad: [
          'Here\'s the full movie/book [pirated content]',
          'Reposting someone else\'s NFT art as my own',
        ],
      },
    },
    {
      icon: Eye,
      title: 'Content Standards',
      color: 'yellow',
      rules: [
        'Mark NSFW content appropriately',
        'No adult content involving minors',
        'No graphic violence or gore',
        'Respect content warnings and tags',
      ],
      examples: {
        good: [
          '[NSFW] Adult content marked clearly',
          '[CW: Violence] Warning before discussing sensitive topics',
        ],
        bad: [
          'Unmarked explicit content',
          'Shocking gore without warning',
        ],
      },
    },
  ];

  const enforcement = [
    {
      level: 'Warning',
      description: 'First-time or minor violations',
      actions: ['Content removal', 'Educational notice', 'Opportunity to appeal'],
      icon: AlertTriangle,
      color: 'yellow',
    },
    {
      level: 'Temporary Suspension',
      description: 'Repeated or moderate violations',
      actions: ['Account suspension (7-30 days)', 'Content removal', 'Loss of privileges'],
      icon: XCircle,
      color: 'orange',
    },
    {
      level: 'Permanent Ban',
      description: 'Severe or continued violations',
      actions: ['Account termination', 'Content removal', 'Blockchain record'],
      icon: Shield,
      color: 'red',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-200 dark:border-red-800',
        icon: 'text-red-600 dark:text-red-400',
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'text-blue-600 dark:text-blue-400',
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-800',
        icon: 'text-green-600 dark:text-green-400',
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-800',
        icon: 'text-purple-600 dark:text-purple-400',
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-200 dark:border-orange-800',
        icon: 'text-orange-600 dark:text-orange-400',
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-200 dark:border-yellow-800',
        icon: 'text-yellow-600 dark:text-yellow-400',
      },
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-500" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Community Guidelines
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            NoteBoard is built on respect, creativity, and collaboration. These guidelines help us
            maintain a safe, welcoming space for everyone.
          </p>
        </div>

        {/* Core Principles */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Our Core Principles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Heart className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg mb-2">Respect</h3>
              <p className="text-sm text-white/90">
                Treat every member with kindness and dignity
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Shield className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg mb-2">Safety</h3>
              <p className="text-sm text-white/90">
                Keep our community secure and welcoming
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Users className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg mb-2">Community</h3>
              <p className="text-sm text-white/90">
                Build meaningful connections and collaborate
              </p>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="space-y-6 mb-12">
          {guidelines.map((guideline, index) => {
            const Icon = guideline.icon;
            const colors = getColorClasses(guideline.color);
            return (
              <div
                key={index}
                className={`${colors.bg} border ${colors.border} rounded-xl overflow-hidden`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className={`w-8 h-8 ${colors.icon}`} />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {guideline.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rules:</h4>
                      <ul className="space-y-2">
                        {guideline.rules.map((rule, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                            <span className={colors.text}>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <h5 className="font-semibold text-gray-900 dark:text-white">Good Examples</h5>
                        </div>
                        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {guideline.examples.good.map((example, i) => (
                            <li key={i} className="italic">"{example}"</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          <h5 className="font-semibold text-gray-900 dark:text-white">Bad Examples</h5>
                        </div>
                        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {guideline.examples.bad.map((example, i) => (
                            <li key={i} className="italic">"{example}"</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enforcement */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Enforcement & Consequences
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Violations of these guidelines may result in actions taken against your account. We
            believe in fair enforcement and provide opportunities to appeal decisions.
          </p>

          <div className="space-y-4">
            {enforcement.map((level, index) => {
              const Icon = level.icon;
              const colors = getColorClasses(level.color);
              return (
                <div key={index} className={`${colors.bg} border ${colors.border} rounded-lg p-6`}>
                  <div className="flex items-start gap-4">
                    <Icon className={`w-8 h-8 ${colors.icon} flex-shrink-0`} />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {level.level}
                      </h3>
                      <p className={`${colors.text} mb-3`}>{level.description}</p>
                      <ul className="space-y-1">
                        {level.actions.map((action, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.icon.replace('text-', 'bg-')}`} />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reporting */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Reporting Violations
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            If you see content or behavior that violates these guidelines:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                Use the report button on the content or user profile
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                Provide specific details about the violation
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                Our moderation team will review within 24 hours
              </span>
            </li>
          </ul>
          <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold">
            Learn More About Reporting
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Last updated: November 5, 2025 • These guidelines may be updated periodically
          </p>
          <p className="mt-2">
            Questions? Contact our{' '}
            <a href="/help" className="text-blue-600 dark:text-blue-400 hover:underline">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

