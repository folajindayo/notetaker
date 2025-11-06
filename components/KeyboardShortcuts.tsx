'use client';

import { useEffect, useState } from 'react';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
}

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const [shortcuts] = useState<Omit<Shortcut, 'action'>[]>([
    { key: '/', description: 'Focus search' },
    { key: 'n', description: 'New note' },
    { key: 'h', description: 'Go to home' },
    { key: 'p', description: 'Go to profile' },
    { key: 'c', description: 'Go to communities' },
    { key: 't', description: 'Go to trending' },
    { key: 'b', description: 'Go to bookmarks' },
    { key: 's', description: 'Go to settings' },
    { key: 'l', description: 'Go to leaderboard' },
    { key: 'r', description: 'Go to rewards' },
    { key: 'e', description: 'Go to explore' },
    { key: 'd', description: 'Go to drafts' },
    { key: 'm', description: 'Toggle theme' },
    { key: '?', description: 'Show shortcuts' },
    { key: 'Escape', description: 'Close modals' },
  ]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Check for modifier keys
      const hasModifier = e.ctrlKey || e.metaKey || e.altKey;

      switch (e.key) {
        case '/':
          e.preventDefault();
          document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
          break;
        case 'n':
          if (!hasModifier) {
            e.preventDefault();
            document.querySelector<HTMLButtonElement>('[data-action="post-note"]')?.click();
          }
          break;
        case 'h':
          if (!hasModifier) {
            e.preventDefault();
            window.location.href = '/';
          }
          break;
        case 'p':
          if (!hasModifier) {
            e.preventDefault();
            // Will navigate to current user's profile
            document.querySelector<HTMLAnchorElement>('[data-nav="profile"]')?.click();
          }
          break;
        case 'c':
          if (!hasModifier) {
            e.preventDefault();
            window.location.href = '/communities';
          }
          break;
        case 't':
          if (!hasModifier) {
            e.preventDefault();
            window.location.href = '/trending';
          }
          break;
        case 'b':
          if (!hasModifier) {
            e.preventDefault();
            window.location.href = '/bookmarks';
          }
          break;
        case 's':
          if (!hasModifier) {
            e.preventDefault();
            window.location.href = '/settings';
          }
          break;
        case 'l':
          if (!hasModifier) {
            e.preventDefault();
            window.location.href = '/leaderboard';
          }
          break;
        case 'r':
          if (!hasModifier) {
            e.preventDefault();
            window.location.href = '/rewards';
          }
          break;
        case 'e':
          if (!hasModifier) {
            e.preventDefault();
            window.location.href = '/explore';
          }
          break;
        case 'd':
          if (!hasModifier) {
            e.preventDefault();
            window.location.href = '/drafts';
          }
          break;
        case 'm':
          if (!hasModifier) {
            e.preventDefault();
            document.querySelector<HTMLButtonElement>('[data-action="toggle-theme"]')?.click();
          }
          break;
        case '?':
          e.preventDefault();
          setIsOpen(true);
          break;
        case 'Escape':
          setIsOpen(false);
          // Close any open modals
          document.querySelector<HTMLButtonElement>('[data-action="close-modal"]')?.click();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ⌨️ Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            data-action="close-modal"
          >
            ×
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span className="text-gray-700 dark:text-gray-300">
                {shortcut.description}
              </span>
              <kbd className="px-3 py-1 text-sm font-semibold text-gray-800 bg-white dark:bg-gray-600 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded shadow">
                {shortcut.key === ' ' ? 'Space' : shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded">?</kbd> anytime to see these shortcuts
          </p>
        </div>
      </div>
    </div>
  );
}

