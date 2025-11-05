'use client';

import { useState } from 'react';
import { Compass, TrendingUp, Users, Hash, Sparkles, Clock, Award, Globe } from 'lucide-react';

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'trending' | 'people' | 'tags' | 'communities'>('trending');

  const trendingNotes = [
    {
      id: '1',
      author: 'Alice Creator',
      authorAddress: '0x1234...5678',
      content: 'Just deployed my first smart contract on Base! 🚀 The experience was amazing...',
      likes: 1234,
      replies: 156,
      reposts: 89,
      isVerified: true,
      timestamp: Date.now() - 7200000,
    },
    {
      id: '2',
      author: 'Bob Developer',
      authorAddress: '0xabcd...efgh',
      content: 'New tutorial series on building DApps with Next.js and Wagmi! Check it out 💻',
      likes: 892,
      replies: 67,
      reposts: 145,
      isVerified: true,
      timestamp: Date.now() - 14400000,
    },
    {
      id: '3',
      author: 'Carol Artist',
      authorAddress: '0x9876...5432',
      content: 'Launching my NFT collection tomorrow! Preview drops here first 🎨✨',
      likes: 2341,
      replies: 234,
      reposts: 567,
      isVerified: false,
      timestamp: Date.now() - 3600000,
    },
  ];

  const suggestedPeople = [
    {
      address: '0x1111...2222',
      name: 'DeFi Expert',
      bio: 'Building the future of finance on blockchain. Previously @Aave',
      followers: 12500,
      isVerified: true,
      tags: ['DeFi', 'Blockchain', 'Smart Contracts'],
    },
    {
      address: '0x3333...4444',
      name: 'NFT Collector',
      bio: 'Art enthusiast & Web3 creator. Collecting digital masterpieces.',
      followers: 8900,
      isVerified: false,
      tags: ['NFT', 'Art', 'Community'],
    },
    {
      address: '0x5555...6666',
      name: 'Web3 Builder',
      bio: 'Full-stack developer specializing in decentralized applications',
      followers: 15600,
      isVerified: true,
      tags: ['Development', 'Web3', 'Tutorial'],
    },
  ];

  const trendingTags = [
    { tag: 'Base', count: 5234, growth: '+45%' },
    { tag: 'DeFi', count: 4128, growth: '+32%' },
    { tag: 'NFT', count: 3891, growth: '+28%' },
    { tag: 'Web3', count: 6712, growth: '+67%' },
    { tag: 'Ethereum', count: 4523, growth: '+23%' },
    { tag: 'SmartContracts', count: 2134, growth: '+19%' },
    { tag: 'Crypto', count: 7845, growth: '+89%' },
    { tag: 'Blockchain', count: 5123, growth: '+41%' },
  ];

  const featuredCommunities = [
    {
      id: '1',
      name: 'Base Builders',
      description: 'Community for developers building on Base L2',
      members: 12450,
      posts: 8934,
      category: 'Development',
      isVerified: true,
    },
    {
      id: '2',
      name: 'DeFi Innovators',
      description: 'Discussing the latest in decentralized finance',
      members: 18720,
      posts: 15234,
      category: 'Finance',
      isVerified: true,
    },
    {
      id: '3',
      name: 'NFT Artists',
      description: 'A creative space for digital artists',
      members: 9876,
      posts: 23456,
      category: 'Art',
      isVerified: false,
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Compass className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Discover</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Explore trending content, discover creators, and join communities
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {[
              { id: 'trending', label: 'Trending', icon: TrendingUp },
              { id: 'people', label: 'People', icon: Users },
              { id: 'tags', label: 'Tags', icon: Hash },
              { id: 'communities', label: 'Communities', icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trending Content */}
        {activeTab === 'trending' && (
          <div className="space-y-6">
            {trendingNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {note.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 dark:text-white">{note.author}</span>
                      {note.isVerified && <span className="text-blue-500">✓</span>}
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {note.authorAddress}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">·</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {formatTimeAgo(note.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-white mb-4">{note.content}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span>💬</span>
                        <span>{formatNumber(note.replies)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🔁</span>
                        <span>{formatNumber(note.reposts)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>❤️</span>
                        <span>{formatNumber(note.likes)}</span>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-orange-500">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-medium">Trending</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggested People */}
        {activeTab === 'people' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedPeople.map((person) => (
              <div
                key={person.address}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{person.name}</h3>
                    {person.isVerified && <span className="text-blue-500">✓</span>}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-2">
                    {person.address}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{person.bio}</p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatNumber(person.followers)}
                      </span>{' '}
                      followers
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {person.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trending Tags */}
        {activeTab === 'tags' && (
          <div className="grid md:grid-cols-2 gap-4">
            {trendingTags.map((item, index) => (
              <div
                key={item.tag}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-gray-300 dark:text-gray-600">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-5 h-5 text-blue-500" />
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatNumber(item.count)} posts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {item.growth}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Communities */}
        {activeTab === 'communities' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCommunities.map((community) => (
              <div
                key={community.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-600" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                      {community.name}
                    </h3>
                    {community.isVerified && <span className="text-blue-500 text-xl">✓</span>}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {community.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{formatNumber(community.members)} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      <span>{formatNumber(community.posts)} posts</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                      {community.category}
                    </span>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

