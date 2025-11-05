'use client';

import { useState } from 'react';
import { MessageSquare, Search, Send, MoreVertical, Phone, Video, Info, Image, Smile, Paperclip } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  read: boolean;
}

interface Conversation {
  id: string;
  participant: {
    address: string;
    name: string;
    isOnline: boolean;
    lastSeen?: number;
  };
  lastMessage: string;
  timestamp: number;
  unreadCount: number;
  messages: Message[];
}

export default function DirectMessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversation, setActiveConversation] = useState<string | null>('1');
  const [messageInput, setMessageInput] = useState('');

  // Mock data
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      participant: {
        address: '0x1234...5678',
        name: 'Alice Creator',
        isOnline: true,
      },
      lastMessage: 'Thanks for the tip! 💜',
      timestamp: Date.now() - 300000,
      unreadCount: 2,
      messages: [
        {
          id: 'm1',
          sender: '0x1234...5678',
          content: 'Hey! I saw your latest note about Base L2. Really interesting stuff!',
          timestamp: Date.now() - 3600000,
          read: true,
        },
        {
          id: 'm2',
          sender: 'me',
          content: 'Thanks! I\'ve been researching it for weeks. The scalability is impressive.',
          timestamp: Date.now() - 3500000,
          read: true,
        },
        {
          id: 'm3',
          sender: '0x1234...5678',
          content: 'Would love to collaborate on a project together!',
          timestamp: Date.now() - 3400000,
          read: true,
        },
        {
          id: 'm4',
          sender: 'me',
          content: 'Absolutely! Let me know what you have in mind 🚀',
          timestamp: Date.now() - 600000,
          read: true,
        },
        {
          id: 'm5',
          sender: '0x1234...5678',
          content: 'Thanks for the tip! 💜',
          timestamp: Date.now() - 300000,
          read: false,
        },
      ],
    },
    {
      id: '2',
      participant: {
        address: '0xabcd...efgh',
        name: 'Bob Developer',
        isOnline: false,
        lastSeen: Date.now() - 7200000,
      },
      lastMessage: 'Check out this new DApp I built',
      timestamp: Date.now() - 86400000,
      unreadCount: 0,
      messages: [
        {
          id: 'm6',
          sender: '0xabcd...efgh',
          content: 'Check out this new DApp I built',
          timestamp: Date.now() - 86400000,
          read: true,
        },
      ],
    },
    {
      id: '3',
      participant: {
        address: '0x9876...5432',
        name: 'Carol Artist',
        isOnline: true,
      },
      lastMessage: 'Love your NFT collection! 🎨',
      timestamp: Date.now() - 172800000,
      unreadCount: 0,
      messages: [],
    },
  ]);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatMessageTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && activeConversation) {
      console.log('Sending message:', messageInput);
      // In real app, send via smart contract or off-chain messaging
      setMessageInput('');
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConversation);
  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Conversations List */}
      <div className="w-full md:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            Messages
          </h1>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
                  activeConversation === conv.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {conv.participant.name.charAt(0).toUpperCase()}
                  </div>
                  {conv.participant.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                      {conv.participant.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {formatTime(conv.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {activeConv.participant.name.charAt(0).toUpperCase()}
                </div>
                {activeConv.participant.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                )}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {activeConv.participant.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {activeConv.participant.isOnline
                    ? 'Online'
                    : `Last seen ${formatTime(activeConv.participant.lastSeen || 0)}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {activeConv.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.sender === 'me'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="break-words">{msg.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {formatMessageTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-end gap-2">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Image className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />

              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <MessageSquare className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

