'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface ChatMessage {
  id: string;
  sender: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: number;
  encrypted: boolean;
  edited: boolean;
  reactions: { emoji: string; count: number; users: string[] }[];
  replyTo?: string;
  attachments?: { type: 'image' | 'file'; url: string; name: string }[];
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  icon: string;
  members: number;
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
  encrypted: boolean;
  type: 'public' | 'private' | 'group';
}

interface User {
  address: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
}

export default function DecentralizedChat() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<'public' | 'private' | 'group'>('public');
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockRooms: ChatRoom[] = [
        {
          id: '1',
          name: 'General',
          description: 'General discussion about NoteBoard',
          icon: '💬',
          members: 1234,
          lastMessage: 'Hey everyone! Check out this new feature...',
          lastMessageTime: Date.now() - 300000,
          unreadCount: 3,
          encrypted: false,
          type: 'public',
        },
        {
          id: '2',
          name: 'Dev Talk',
          description: 'Technical discussions and development',
          icon: '👨‍💻',
          members: 567,
          lastMessage: 'The new smart contract is deployed!',
          lastMessageTime: Date.now() - 600000,
          unreadCount: 0,
          encrypted: true,
          type: 'private',
        },
        {
          id: '3',
          name: 'NFT Traders',
          description: 'Buy, sell, and discuss NFTs',
          icon: '🎨',
          members: 892,
          lastMessage: 'Just minted a new collection!',
          lastMessageTime: Date.now() - 1800000,
          unreadCount: 7,
          encrypted: false,
          type: 'group',
        },
      ];

      const mockUsers: User[] = [
        {
          address: '0x1234567890123456789012345678901234567890',
          name: 'Alice',
          avatar: '/api/placeholder/40/40',
          status: 'online',
        },
        {
          address: '0x9876543210987654321098765432109876543210',
          name: 'Bob',
          avatar: '/api/placeholder/40/40',
          status: 'online',
        },
        {
          address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          name: 'Charlie',
          avatar: '/api/placeholder/40/40',
          status: 'away',
        },
      ];

      setRooms(mockRooms);
      setOnlineUsers(mockUsers);
      if (mockRooms.length > 0) {
        setSelectedRoom(mockRooms[0]);
        loadMessages(mockRooms[0].id);
      }
      setLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address]);

  const loadMessages = async (roomId: string) => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        sender: '0x1234567890123456789012345678901234567890',
        senderName: 'Alice',
        senderAvatar: '/api/placeholder/40/40',
        message: 'Hey everyone! Welcome to the chat!',
        timestamp: Date.now() - 3600000,
        encrypted: false,
        edited: false,
        reactions: [
          { emoji: '👋', count: 5, users: [] },
          { emoji: '❤️', count: 3, users: [] },
        ],
      },
      {
        id: '2',
        sender: '0x9876543210987654321098765432109876543210',
        senderName: 'Bob',
        senderAvatar: '/api/placeholder/40/40',
        message: 'Thanks! Excited to be here',
        timestamp: Date.now() - 3000000,
        encrypted: false,
        edited: false,
        reactions: [],
        replyTo: '1',
      },
      {
        id: '3',
        sender: address || '0x0',
        senderName: 'You',
        senderAvatar: '/api/placeholder/40/40',
        message: 'This is an encrypted message 🔒',
        timestamp: Date.now() - 1800000,
        encrypted: true,
        edited: false,
        reactions: [{ emoji: '🔐', count: 2, users: [] }],
      },
      {
        id: '4',
        sender: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        senderName: 'Charlie',
        senderAvatar: '/api/placeholder/40/40',
        message: 'Check out this cool NFT I just minted!',
        timestamp: Date.now() - 900000,
        encrypted: false,
        edited: false,
        reactions: [{ emoji: '🔥', count: 8, users: [] }],
        attachments: [
          { type: 'image', url: '/api/placeholder/200/200', name: 'nft.png' },
        ],
      },
    ];

    setMessages(mockMessages);
    setTimeout(() => scrollToBottom(), 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: address!,
      senderName: 'You',
      senderAvatar: '/api/placeholder/40/40',
      message: newMessage,
      timestamp: Date.now(),
      encrypted: encryptionEnabled,
      edited: false,
      reactions: [],
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setSending(false);
    scrollToBottom();
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert(t('enterRoomName'));
      return;
    }

    const newRoom: ChatRoom = {
      id: Date.now().toString(),
      name: roomName,
      description: `Created by ${address?.slice(0, 10)}...`,
      icon: '🆕',
      members: 1,
      unreadCount: 0,
      encrypted: encryptionEnabled,
      type: roomType,
    };

    setRooms([...rooms, newRoom]);
    setSelectedRoom(newRoom);
    setShowCreateRoom(false);
    setRoomName('');
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              ),
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, users: [] }],
            };
          }
        }
        return msg;
      })
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      online: 'bg-green-500',
      away: 'bg-yellow-500',
      offline: 'bg-gray-500',
    };
    return colors[status as keyof typeof colors] || colors.offline;
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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToChat')}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[700px] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Rooms Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('rooms')}</h2>
            <button
              onClick={() => setShowCreateRoom(true)}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => {
                setSelectedRoom(room);
                loadMessages(room.id);
                setRooms(rooms.map((r) => (r.id === room.id ? { ...r, unreadCount: 0 } : r)));
              }}
              className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                selectedRoom?.id === room.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{room.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {room.name}
                    </h3>
                    {room.encrypted && <span className="text-xs">🔒</span>}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {room.members.toLocaleString()} {t('members')}
                  </p>
                </div>
                {room.unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs font-bold">
                    {room.unreadCount}
                  </span>
                )}
              </div>
              {room.lastMessage && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {room.lastMessage}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedRoom.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {selectedRoom.name}
                      {selectedRoom.encrypted && <span className="text-sm">🔒</span>}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedRoom.members.toLocaleString()} {t('members')}
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={encryptionEnabled}
                    onChange={(e) => setEncryptionEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('encryption')}
                  </span>
                </label>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender.toLowerCase() === address?.toLowerCase()
                      ? 'flex-row-reverse'
                      : ''
                  }`}
                >
                  <img
                    src={message.senderAvatar}
                    alt={message.senderName}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div
                    className={`flex-1 max-w-2xl ${
                      message.sender.toLowerCase() === address?.toLowerCase() ? 'text-right' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {message.senderName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                      {message.encrypted && <span className="text-xs">🔒</span>}
                      {message.edited && (
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          ({t('edited')})
                        </span>
                      )}
                    </div>
                    <div
                      className={`inline-block px-4 py-2 rounded-xl ${
                        message.sender.toLowerCase() === address?.toLowerCase()
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      {message.attachments && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment, idx) => (
                            <img
                              key={idx}
                              src={attachment.url}
                              alt={attachment.name}
                              className="rounded-lg max-w-xs"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {message.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleReaction(message.id, reaction.emoji)}
                            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {reaction.count}
                            </span>
                          </button>
                        ))}
                        <button
                          onClick={() => handleReaction(message.id, '👍')}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder={t('typeMessage')}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
                >
                  {sending ? t('sending') : t('send')}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">{t('selectRoom')}</p>
          </div>
        )}
      </div>

      {/* Online Users */}
      <div className="w-64 border-l border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          {t('onlineUsers')} ({onlineUsers.length})
        </h3>
        <div className="space-y-2">
          {onlineUsers.map((user) => (
            <div key={user.address} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(
                    user.status
                  )} rounded-full border-2 border-white dark:border-gray-800`}
                ></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {user.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('createRoom')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('roomName')}
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('roomType')}
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="public">{t('public')}</option>
                  <option value="private">{t('private')}</option>
                  <option value="group">{t('group')}</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={encryptionEnabled}
                  onChange={(e) => setEncryptionEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('enableEncryption')}
                </span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateRoom(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCreateRoom}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

