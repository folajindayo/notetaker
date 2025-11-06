'use client';

import { useState, useEffect } from 'react';
import { Language, getAvailableLanguages, getTranslations } from '@/lib/i18n';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  className = '',
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const languages = getAvailableLanguages();
  const t = getTranslations(currentLanguage);

  // Filter languages based on search
  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.language-selector')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedLanguage = languages.find((lang) => lang.code === currentLanguage);

  // Save to localStorage
  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    localStorage.setItem('preferredLanguage', language);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`language-selector relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-2xl">{selectedLanguage?.flag}</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {selectedLanguage?.name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              🌍 {t.settings.language}
            </h3>
            
            {/* Search */}
            <input
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              autoFocus
            />
          </div>

          {/* Language List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredLanguages.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No languages found
              </div>
            ) : (
              <div className="p-2">
                {filteredLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language.code)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      language.code === currentLanguage
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-3xl">{language.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {language.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {language.code.toUpperCase()}
                      </div>
                    </div>
                    {language.code === currentLanguage && (
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              💡 Your language preference is saved automatically
            </p>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Compact version for navigation bars
export function LanguageSelectorCompact({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const languages = getAvailableLanguages();
  const selectedLanguage = languages.find((lang) => lang.code === currentLanguage);

  return (
    <div className="language-selector relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Change Language"
      >
        <span className="text-xl">{selectedLanguage?.flag}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    onLanguageChange(language.code);
                    localStorage.setItem('preferredLanguage', language.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    language.code === currentLanguage
                      ? 'bg-blue-50 dark:bg-blue-900/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl">{language.flag}</span>
                  <span className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-white">
                    {language.name}
                  </span>
                  {language.code === currentLanguage && (
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

