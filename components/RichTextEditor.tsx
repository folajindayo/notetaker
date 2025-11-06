'use client';

import { useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  showToolbar?: boolean;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something amazing...',
  maxLength = 280,
  showToolbar = true,
  className = '',
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    if (newText.length <= maxLength) {
      onChange(newText);

      // Set cursor position after the inserted text
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + before.length + selectedText.length;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const formatBold = () => insertText('**', '**');
  const formatItalic = () => insertText('_', '_');
  const formatStrikethrough = () => insertText('~~', '~~');
  const formatCode = () => insertText('`', '`');
  const formatLink = () => insertText('[', '](url)');
  const formatQuote = () => insertText('> ', '');
  const formatList = () => insertText('• ', '');
  const formatNumberedList = () => insertText('1. ', '');

  const insertEmoji = (emoji: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const newText = value.substring(0, start) + emoji + value.substring(start);

    if (newText.length <= maxLength) {
      onChange(newText);
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + emoji.length;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const quickEmojis = ['😊', '❤️', '👍', '🔥', '😂', '🎉', '💯', '✨'];

  // Character count color
  const getCharCountColor = () => {
    const remaining = maxLength - value.length;
    if (remaining < 20) return 'text-red-600 dark:text-red-400';
    if (remaining < 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  // Preview mode toggle
  const [showPreview, setShowPreview] = useState(false);

  // Render markdown preview
  const renderPreview = () => {
    let preview = value;

    // Bold
    preview = preview.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    preview = preview.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Strikethrough
    preview = preview.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Code
    preview = preview.replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</code>');
    
    // Links
    preview = preview.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 underline" target="_blank">$1</a>');
    
    // Quote
    preview = preview.replace(/^> (.*)$/gm, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300">$1</blockquote>');
    
    // Lists
    preview = preview.replace(/^• (.*)$/gm, '<li class="ml-4">$1</li>');
    preview = preview.replace(/^(\d+)\. (.*)$/gm, '<li class="ml-4" style="list-style-type: decimal;">$2</li>');
    
    // Line breaks
    preview = preview.replace(/\n/g, '<br>');

    return preview;
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all ${
        isFocused
          ? 'border-blue-500 dark:border-blue-400 shadow-lg'
          : 'border-gray-200 dark:border-gray-700'
      } ${className}`}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Text Formatting */}
            <div className="flex items-center space-x-1 border-r border-gray-300 dark:border-gray-600 pr-2">
              <button
                type="button"
                onClick={formatBold}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Bold (Ctrl+B)"
              >
                <span className="font-bold">B</span>
              </button>
              <button
                type="button"
                onClick={formatItalic}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Italic (Ctrl+I)"
              >
                <span className="italic">I</span>
              </button>
              <button
                type="button"
                onClick={formatStrikethrough}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Strikethrough"
              >
                <span className="line-through">S</span>
              </button>
              <button
                type="button"
                onClick={formatCode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors font-mono text-sm"
                title="Code"
              >
                {'</>'}
              </button>
            </div>

            {/* Insert Elements */}
            <div className="flex items-center space-x-1 border-r border-gray-300 dark:border-gray-600 pr-2">
              <button
                type="button"
                onClick={formatLink}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Insert Link"
              >
                🔗
              </button>
              <button
                type="button"
                onClick={formatQuote}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Quote"
              >
                💬
              </button>
              <button
                type="button"
                onClick={formatList}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Bullet List"
              >
                •
              </button>
              <button
                type="button"
                onClick={formatNumberedList}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Numbered List"
              >
                1.
              </button>
            </div>

            {/* Quick Emojis */}
            <div className="flex items-center space-x-1 border-r border-gray-300 dark:border-gray-600 pr-2">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-lg"
                  title={`Insert ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Preview Toggle */}
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                showPreview
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title="Toggle Preview"
            >
              {showPreview ? '✏️ Edit' : '👁️ Preview'}
            </button>
          </div>
        </div>
      )}

      {/* Editor / Preview Area */}
      <div className="relative">
        {showPreview ? (
          <div
            className="p-4 min-h-[120px] max-h-[400px] overflow-y-auto prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: renderPreview() }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                onChange(e.target.value);
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSelect={(e) => {
              setCursorPosition(e.currentTarget.selectionStart);
            }}
            placeholder={placeholder}
            className="w-full p-4 bg-transparent border-none outline-none resize-none min-h-[120px] max-h-[400px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            style={{ fontFamily: 'inherit' }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span className="hidden sm:inline">
            💡 Tip: Use **bold**, _italic_, ~~strikethrough~~, `code`, [link](url)
          </span>
        </div>

        {/* Character Count */}
        <div className={`text-sm font-medium ${getCharCountColor()}`}>
          {value.length} / {maxLength}
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      {isFocused && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900">
          <div className="text-xs text-gray-600 dark:text-gray-400 space-x-4">
            <span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                Ctrl+B
              </kbd>{' '}
              Bold
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                Ctrl+I
              </kbd>{' '}
              Italic
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                Tab
              </kbd>{' '}
              Indent
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

