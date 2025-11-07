'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface ProfileTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundType: 'solid' | 'gradient' | 'pattern';
  backgroundColor: string;
  gradient?: {
    from: string;
    to: string;
    direction: string;
  };
  pattern?: string;
}

interface ProfileCustomization {
  theme: ProfileTheme;
  banner: string;
  bio: string;
  links: { platform: string; url: string }[];
  displayBadges: boolean;
  displayStats: boolean;
  displayNFTs: boolean;
  customCSS?: string;
}

const PRESET_THEMES: ProfileTheme[] = [
  {
    id: 'default',
    name: 'Default',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    backgroundType: 'solid',
    backgroundColor: '#FFFFFF',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    primaryColor: '#60A5FA',
    secondaryColor: '#3B82F6',
    backgroundType: 'solid',
    backgroundColor: '#1F2937',
  },
  {
    id: 'purple',
    name: 'Purple Dream',
    primaryColor: '#A855F7',
    secondaryColor: '#7C3AED',
    backgroundType: 'gradient',
    backgroundColor: '',
    gradient: { from: '#A855F7', to: '#EC4899', direction: 'to-br' },
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    primaryColor: '#0EA5E9',
    secondaryColor: '#0284C7',
    backgroundType: 'gradient',
    backgroundColor: '',
    gradient: { from: '#0EA5E9', to: '#06B6D4', direction: 'to-br' },
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    primaryColor: '#F59E0B',
    secondaryColor: '#EF4444',
    backgroundType: 'gradient',
    backgroundColor: '',
    gradient: { from: '#F59E0B', to: '#EF4444', direction: 'to-br' },
  },
  {
    id: 'forest',
    name: 'Forest Green',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    backgroundType: 'gradient',
    backgroundColor: '',
    gradient: { from: '#10B981', to: '#34D399', direction: 'to-br' },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    primaryColor: '#6366F1',
    secondaryColor: '#4F46E5',
    backgroundType: 'gradient',
    backgroundColor: '',
    gradient: { from: '#1E1B4B', to: '#4C1D95', direction: 'to-br' },
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    primaryColor: '#F43F5E',
    secondaryColor: '#E11D48',
    backgroundType: 'gradient',
    backgroundColor: '',
    gradient: { from: '#F43F5E', to: '#FB923C', direction: 'to-br' },
  },
];

const SOCIAL_PLATFORMS = [
  { name: 'Twitter', icon: '𝕏', placeholder: 'twitter.com/username' },
  { name: 'GitHub', icon: '🐙', placeholder: 'github.com/username' },
  { name: 'Discord', icon: '💬', placeholder: 'discord.gg/invite' },
  { name: 'Telegram', icon: '✈️', placeholder: 't.me/username' },
  { name: 'Website', icon: '🌐', placeholder: 'yoursite.com' },
  { name: 'LinkedIn', icon: '💼', placeholder: 'linkedin.com/in/username' },
];

export default function ProfileCustomizer() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [customization, setCustomization] = useState<ProfileCustomization>({
    theme: PRESET_THEMES[0],
    banner: '',
    bio: '',
    links: [],
    displayBadges: true,
    displayStats: true,
    displayNFTs: true,
  });
  const [activeTab, setActiveTab] = useState<'theme' | 'profile' | 'display' | 'advanced'>('theme');
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    // Load saved customization
    if (address) {
      const saved = localStorage.getItem(`profileCustomization_${address}`);
      if (saved) {
        setCustomization(JSON.parse(saved));
      }
    }
  }, [address]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (address) {
      localStorage.setItem(`profileCustomization_${address}`, JSON.stringify(customization));
    }
    
    setIsSaving(false);
    alert(t('profileSaved'));
  };

  const handleThemeSelect = (theme: ProfileTheme) => {
    setCustomization({ ...customization, theme });
  };

  const handleAddLink = () => {
    if (customization.links.length < 6) {
      setCustomization({
        ...customization,
        links: [...customization.links, { platform: 'Website', url: '' }],
      });
    }
  };

  const handleRemoveLink = (index: number) => {
    setCustomization({
      ...customization,
      links: customization.links.filter((_, i) => i !== index),
    });
  };

  const handleUpdateLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...customization.links];
    newLinks[index][field] = value;
    setCustomization({ ...customization, links: newLinks });
  };

  const getThemeBackground = (theme: ProfileTheme) => {
    if (theme.backgroundType === 'solid') {
      return { backgroundColor: theme.backgroundColor };
    } else if (theme.backgroundType === 'gradient' && theme.gradient) {
      return {
        backgroundImage: `linear-gradient(${theme.gradient.direction}, ${theme.gradient.from}, ${theme.gradient.to})`,
      };
    }
    return {};
  };

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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToCustomize')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('profileCustomization')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('personalizeYourProfile')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {previewMode ? t('edit') : t('preview')}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t('saving')}
              </>
            ) : (
              t('save')
            )}
          </button>
        </div>
      </div>

      {!previewMode && (
        <>
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-6">
              {(['theme', 'profile', 'display', 'advanced'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-1 font-medium transition-colors relative capitalize ${
                    activeTab === tab
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {t(tab)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('chooseTheme')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {PRESET_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme)}
                      className={`relative p-4 rounded-xl border-2 transition-all overflow-hidden ${
                        customization.theme.id === theme.id
                          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                      }`}
                      style={getThemeBackground(theme)}
                    >
                      <div className="relative z-10">
                        <p className="font-semibold text-white drop-shadow-lg">{theme.name}</p>
                        <div className="flex gap-2 mt-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white"
                            style={{ backgroundColor: theme.primaryColor }}
                          ></div>
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white"
                            style={{ backgroundColor: theme.secondaryColor }}
                          ></div>
                        </div>
                      </div>
                      {customization.theme.id === theme.id && (
                        <div className="absolute top-2 right-2">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('bio')}
                </label>
                <textarea
                  value={customization.bio}
                  onChange={(e) => setCustomization({ ...customization, bio: e.target.value })}
                  maxLength={160}
                  rows={4}
                  placeholder={t('tellUsAboutYourself')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {customization.bio.length}/160
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('socialLinks')}
                  </label>
                  <button
                    onClick={handleAddLink}
                    disabled={customization.links.length >= 6}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + {t('addLink')}
                  </button>
                </div>
                <div className="space-y-3">
                  {customization.links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <select
                        value={link.platform}
                        onChange={(e) => handleUpdateLink(index, 'platform', e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <option key={platform.name} value={platform.name}>
                            {platform.icon} {platform.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                        placeholder={
                          SOCIAL_PLATFORMS.find((p) => p.name === link.platform)?.placeholder
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleRemoveLink(index)}
                        className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {customization.links.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      {t('noLinksAdded')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('displaySettings')}
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('displayBadges')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('showVerificationBadges')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={customization.displayBadges}
                    onChange={(e) =>
                      setCustomization({ ...customization, displayBadges: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('displayStats')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('showFollowersAndStats')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={customization.displayStats}
                    onChange={(e) =>
                      setCustomization({ ...customization, displayStats: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('displayNFTs')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('showNFTCollection')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={customization.displayNFTs}
                    onChange={(e) =>
                      setCustomization({ ...customization, displayNFTs: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('advancedSettings')}
              </h3>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ {t('customCSSWarning')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('customCSS')}
                </label>
                <textarea
                  value={customization.customCSS || ''}
                  onChange={(e) =>
                    setCustomization({ ...customization, customCSS: e.target.value })
                  }
                  rows={10}
                  placeholder="/* Add your custom CSS here */"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Preview Mode */}
      {previewMode && (
        <div
          className="rounded-xl p-8 min-h-[500px]"
          style={getThemeBackground(customization.theme)}
        >
          <div className="max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-4"
                style={{ backgroundColor: customization.theme.primaryColor }}
              ></div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{customization.bio || t('noBioYet')}</p>
            </div>

            {customization.links.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {customization.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {SOCIAL_PLATFORMS.find((p) => p.name === link.platform)?.icon} {link.platform}
                  </a>
                ))}
              </div>
            )}

            {customization.displayStats && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('followers')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">567</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('following')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('notes')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

