'use client';

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, Link, Image, Code, AtSign, Hash, Smile, Send } from 'lucide-react';

interface CollaborativeEditorProps {
  onSubmit?: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
  showToolbar?: boolean;
}

export default function CollaborativeEditor({
  onSubmit,
  placeholder = 'What\'s on your mind?',
  maxLength = 500,
  showToolbar = true,
}: CollaborativeEditorProps) {
  const [content, setContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentions, setMentions] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Extract mentions and hashtags
    const mentionMatches = content.match(/@\w+/g) || [];
    const hashtagMatches = content.match(/#\w+/g) || [];
    setMentions([...new Set(mentionMatches)]);
    setHashtags([...new Set(hashtagMatches)]);
  }, [content]);

  const insertText = (text: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      setContent(newContent);
      
      // Set cursor position after inserted text
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + text.length;
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const formatText = (formatType: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = content.substring(start, end);

      if (selectedText) {
        let formattedText = '';
        switch (formatType) {
          case 'bold':
            formattedText = `**${selectedText}**`;
            break;
          case 'italic':
            formattedText = `*${selectedText}*`;
            break;
          case 'code':
            formattedText = `\`${selectedText}\``;
            break;
          case 'link':
            formattedText = `[${selectedText}](url)`;
            break;
        }

        const newContent = content.substring(0, start) + formattedText + content.substring(end);
        setContent(newContent);
      }
    }
  };

  const handleSubmit = () => {
    if (content.trim() && onSubmit) {
      onSubmit(content);
      setContent('');
      setMentions([]);
      setHashtags([]);
    }
  };

  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Toolbar */}
      {showToolbar && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => formatText('bold')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Bold"
          >
            <Bold className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => formatText('italic')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Italic"
          >
            <Italic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => formatText('code')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Code"
          >
            <Code className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
          <button
            onClick={() => insertText('\n- ')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Bullet List"
          >
            <List className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => formatText('link')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Add Link"
          >
            <Link className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
          <button
            onClick={() => insertText('@')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Mention User"
          >
            <AtSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => insertText('#')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Add Hashtag"
          >
            <Hash className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => insertText('😊')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Add Emoji"
          >
            <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      )}

      {/* Editor */}
      <div className="p-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart)}
          placeholder={placeholder}
          rows={6}
          className="w-full px-0 py-0 border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 resize-none text-lg"
          style={{ minHeight: '150px' }}
        />

        {/* Tags Display */}
        {(mentions.length > 0 || hashtags.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {mentions.map((mention, index) => (
              <span
                key={`mention-${index}`}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm"
              >
                {mention}
              </span>
            ))}
            {hashtags.map((hashtag, index) => (
              <span
                key={`hashtag-${index}`}
                className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-sm"
              >
                {hashtag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Image className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span
            className={`text-sm font-medium ${
              isOverLimit
                ? 'text-red-600 dark:text-red-400'
                : remainingChars < 50
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {remainingChars} characters
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isOverLimit}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
        >
          <Send className="w-4 h-4" />
          Post
        </button>
      </div>

      {/* Preview Mode Toggle */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <span>Markdown supported: **bold**, *italic*, `code`, [link](url)</span>
        <button className="text-blue-600 dark:text-blue-400 hover:underline">Preview</button>
      </div>
    </div>
  );
}

// Demo component
export function CollaborativeEditorDemo() {
  const handleSubmit = (content: string) => {
    console.log('Submitted content:', content);
    alert('Note posted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Collaborative Editor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Rich text editor with markdown support, mentions, and hashtags
          </p>
        </div>

        <CollaborativeEditor onSubmit={handleSubmit} />

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Features</h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Rich text formatting (bold, italic, code)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Mention users with @username</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Add hashtags with #topic</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Character counter and limit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Markdown preview support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Link and image insertion</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

