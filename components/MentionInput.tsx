"use client";

import { useState, useRef, useEffect } from "react";

interface User {
  address: string;
  username?: string;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string, mentions: string[]) => void;
  placeholder?: string;
  maxLength?: number;
}

export function MentionInput({
  value,
  onChange,
  placeholder = "What's on your mind?",
  maxLength = 280,
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock user data - in production, fetch from contract or API
  const users: User[] = [
    { address: "0x1234567890abcdef", username: "Alice" },
    { address: "0xabcdef1234567890", username: "Bob" },
    { address: "0x9876543210fedcba", username: "Charlie" },
    { address: "0xfedcba0987654321", username: "David" },
  ];

  const filteredUsers = mentionQuery
    ? users.filter(
        (user) =>
          user.username?.toLowerCase().includes(mentionQuery.toLowerCase()) ||
          user.address.toLowerCase().includes(mentionQuery.toLowerCase())
      )
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;

    setCursorPosition(cursorPos);

    // Check if user is typing a mention
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf("@");

    if (lastAtSymbol !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtSymbol + 1);
      if (!textAfterAt.includes(" ")) {
        setMentionQuery(textAfterAt);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    // Extract mentions
    const mentionRegex = /@(0x[a-fA-F0-9]{16})/g;
    const mentions = Array.from(newValue.matchAll(mentionRegex), (m) => m[1]);

    onChange(newValue, mentions);
  };

  const insertMention = (user: User) => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf("@");

    const newText =
      textBeforeCursor.slice(0, lastAtSymbol) +
      `@${user.address} ` +
      textAfterCursor;

    const mentionRegex = /@(0x[a-fA-F0-9]{16})/g;
    const mentions = Array.from(newText.matchAll(mentionRegex), (m) => m[1]);

    onChange(newText, mentions);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
      />

      {/* Character Count */}
      <div className="absolute bottom-3 right-3 text-sm text-gray-400">
        {value.length}/{maxLength}
      </div>

      {/* Mention Suggestions */}
      {showSuggestions && filteredUsers.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredUsers.map((user) => (
            <button
              key={user.address}
              onClick={() => insertMention(user)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {user.username?.[0]?.toUpperCase() || user.address[2]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">
                  {user.username || user.address.slice(0, 10) + "..."}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.address}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mention Hint */}
      <div className="mt-2 text-xs text-gray-500">
        💡 Type @ to mention users
      </div>
    </div>
  );
}

export function MentionHighlight({ text }: { text: string }) {
  const parts = text.split(/(@0x[a-fA-F0-9]{16})/g);

  return (
    <p className="text-gray-900">
      {parts.map((part, index) => {
        if (part.match(/^@0x[a-fA-F0-9]{16}$/)) {
          const address = part.slice(1);
          return (
            <a
              key={index}
              href={`/profile/${address}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
}

