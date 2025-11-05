'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Rocket, Users, Bell, Sparkles, CheckCircle } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: any;
  content: React.ReactNode;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    displayName: '',
    bio: '',
    interests: [] as string[],
    notifications: true,
    newsletter: false,
  });

  const availableInterests = [
    { id: 'web3', label: 'Web3 & Crypto', emoji: '🌐' },
    { id: 'defi', label: 'DeFi', emoji: '💰' },
    { id: 'nft', label: 'NFTs & Art', emoji: '🎨' },
    { id: 'development', label: 'Development', emoji: '💻' },
    { id: 'blockchain', label: 'Blockchain Tech', emoji: '⛓️' },
    { id: 'gaming', label: 'Gaming', emoji: '🎮' },
    { id: 'dao', label: 'DAOs', emoji: '🏛️' },
    { id: 'metaverse', label: 'Metaverse', emoji: '🌌' },
    { id: 'trading', label: 'Trading', emoji: '📈' },
    { id: 'community', label: 'Community', emoji: '👥' },
  ];

  const toggleInterest = (id: string) => {
    if (preferences.interests.includes(id)) {
      setPreferences({
        ...preferences,
        interests: preferences.interests.filter((i) => i !== id),
      });
    } else {
      setPreferences({
        ...preferences,
        interests: [...preferences.interests, id],
      });
    }
  };

  const steps: OnboardingStep[] = [
    {
      title: 'Welcome to NoteBoard! 🎉',
      description: 'The decentralized social platform built on Base',
      icon: Rocket,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mx-auto flex items-center justify-center">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Get Started in 3 Easy Steps
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Let's set up your profile and customize your experience. This will only take a minute!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="text-3xl mb-2">👤</div>
              <div className="font-semibold text-gray-900 dark:text-white">Create Profile</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Tell us about yourself
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-semibold text-gray-900 dark:text-white">Pick Interests</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Customize your feed
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-semibold text-gray-900 dark:text-white">Start Exploring</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Join the community
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Create Your Profile',
      description: 'Tell the community who you are',
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Introduce Yourself
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Help others get to know you better
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Display Name *
            </label>
            <input
              type="text"
              value={preferences.displayName}
              onChange={(e) => setPreferences({ ...preferences, displayName: e.target.value })}
              placeholder="Your name or handle"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Bio (Optional)
            </label>
            <textarea
              value={preferences.bio}
              onChange={(e) => setPreferences({ ...preferences, bio: e.target.value })}
              placeholder="Tell us about yourself... (Max 160 characters)"
              rows={4}
              maxLength={160}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
              {preferences.bio.length}/160 characters
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>Tip:</strong> You can always update your profile later in Settings
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Choose Your Interests',
      description: 'Personalize your feed with topics you love',
      icon: Sparkles,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-teal-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              What Interests You?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Select topics to customize your feed (choose at least 3)
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableInterests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  preferences.interests.includes(interest.id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-2">{interest.emoji}</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  {interest.label}
                </div>
                {preferences.interests.includes(interest.id) && (
                  <CheckCircle className="w-5 h-5 text-blue-500 mx-auto mt-2" />
                )}
              </button>
            ))}
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              ✨ Selected: <strong>{preferences.interests.length}</strong> interest
              {preferences.interests.length !== 1 ? 's' : ''}
              {preferences.interests.length >= 3 && ' - Great choices!'}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Notification Preferences',
      description: 'Stay updated on what matters to you',
      icon: Bell,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <Bell className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Stay in the Loop
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose how you want to be notified
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={preferences.notifications}
                onChange={(e) =>
                  setPreferences({ ...preferences, notifications: e.target.checked })
                }
                className="mt-1 w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  🔔 Push Notifications
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified about new followers, likes, replies, and mentions
                </div>
              </div>
            </label>

            <label className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={preferences.newsletter}
                onChange={(e) => setPreferences({ ...preferences, newsletter: e.target.checked })}
                className="mt-1 w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  📧 Weekly Newsletter
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Receive a weekly digest of trending content and community updates
                </div>
              </div>
            </label>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-800 dark:text-green-300">
              ✅ You can customize these settings anytime in your account preferences
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const canProceed = () => {
    if (currentStep === 1) {
      return preferences.displayName.trim().length > 0;
    }
    if (currentStep === 2) {
      return preferences.interests.length >= 3;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log('Onboarding completed with preferences:', preferences);
    // In real app, save preferences and redirect
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white text-center">
            <Icon className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">{currentStepData.title}</h1>
            <p className="text-blue-100">{currentStepData.description}</p>
          </div>

          {/* Step Content */}
          <div className="p-8 min-h-[400px]">{currentStepData.content}</div>

          {/* Navigation */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-blue-500 w-8'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all shadow-lg font-semibold flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Complete Setup
              </button>
            )}
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => (window.location.href = '/')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors text-sm"
          >
            Skip for now →
          </button>
        </div>
      </div>
    </div>
  );
}

