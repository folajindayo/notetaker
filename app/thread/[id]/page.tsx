'use client';

import { useState } from 'react';
import { MessageSquare, Heart, Repeat2, Share2, MoreHorizontal, ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Note {
  id: string;
  author: string;
  authorName: string;
  content: string;
  timestamp: number;
  likes: number;
  replies: number;
  reposts: number;
  isLiked?: boolean;
  isVerified?: boolean;
  isReposted?: boolean;
}

interface Reply extends Note {
  parentId: string;
  depth: number;
}

export default function ThreadPage({ params }: { params: { id: string } }) {
  // Mock data - In real app, this would come from smart contract
  const [mainNote] = useState<Note>({
    id: params.id,
    author: '0x1234...5678',
    authorName: 'Alice Creator',
    content:
      'Just deployed my first smart contract on Base! 🚀 The experience was incredibly smooth. Gas fees are so low compared to mainnet, and the transaction speed is amazing. Web3 development has never been better! #Base #Ethereum #Web3Dev',
    timestamp: Date.now() - 7200000,
    likes: 342,
    replies: 28,
    reposts: 89,
    isLiked: false,
    isVerified: true,
  });

  const [replies, setReplies] = useState<Reply[]>([
    {
      id: '1',
      parentId: params.id,
      author: '0xabcd...efgh',
      authorName: 'Bob Developer',
      content: 'Congrats! What kind of contract did you deploy? Would love to hear more about your project!',
      timestamp: Date.now() - 6300000,
      likes: 45,
      replies: 3,
      reposts: 2,
      depth: 0,
      isVerified: false,
    },
    {
      id: '2',
      parentId: '1',
      author: '0x1234...5678',
      authorName: 'Alice Creator',
      content:
        "Thanks! It's an NFT marketplace for digital art. Still in testing but super excited about the possibilities!",
      timestamp: Date.now() - 5400000,
      likes: 78,
      replies: 2,
      reposts: 5,
      depth: 1,
      isVerified: true,
    },
    {
      id: '3',
      parentId: '2',
      author: '0x9876...5432',
      authorName: 'Carol Artist',
      content: 'This sounds amazing! Will there be support for royalties? That would be huge for artists!',
      timestamp: Date.now() - 4800000,
      likes: 23,
      replies: 1,
      reposts: 1,
      depth: 2,
      isVerified: false,
    },
    {
      id: '4',
      parentId: params.id,
      author: '0x2468...1357',
      authorName: 'Dave Crypto',
      content: 'Base is the future! Low fees + Ethereum security = winning combination 💪',
      timestamp: Date.now() - 3600000,
      likes: 156,
      replies: 8,
      reposts: 34,
      depth: 0,
      isVerified: true,
    },
    {
      id: '5',
      parentId: params.id,
      author: '0xfedc...ba98',
      authorName: 'Eve Builder',
      content:
        'Have you tried using Hardhat or Foundry for deployment? Both work great with Base!',
      timestamp: Date.now() - 1800000,
      likes: 67,
      replies: 4,
      reposts: 12,
      depth: 0,
      isVerified: false,
    },
  ]);

  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleLike = (noteId: string) => {
    console.log('Liking note:', noteId);
  };

  const handleRepost = (noteId: string) => {
    console.log('Reposting note:', noteId);
  };

  const handleReply = (parentId: string) => {
    if (newReply.trim()) {
      console.log('Replying to:', parentId, 'with:', newReply);
      setNewReply('');
      setReplyingTo(null);
    }
  };

  const getIndentClass = (depth: number) => {
    const indents = ['ml-0', 'ml-8', 'ml-16', 'ml-24', 'ml-32'];
    return indents[Math.min(depth, indents.length - 1)];
  };

  const NoteCard = ({ note, isMain = false }: { note: Note | Reply; isMain?: boolean }) => (
    <div
      className={`${isMain ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800'} 
      ${!isMain && getIndentClass((note as Reply).depth || 0)} 
      p-6 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
    >
      {/* Author Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {note.authorName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 dark:text-white">{note.authorName}</span>
            {note.isVerified && (
              <span className="text-blue-500" title="Verified">
                ✓
              </span>
            )}
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {note.author.slice(0, 6)}...{note.author.slice(-4)}
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-sm">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {formatTimeAgo(note.timestamp)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4 text-gray-900 dark:text-white whitespace-pre-wrap break-words">
        {note.content}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setReplyingTo(note.id)}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-medium">{note.replies}</span>
        </button>

        <button
          onClick={() => handleRepost(note.id)}
          className={`flex items-center gap-2 transition-colors ${
            note.isReposted
              ? 'text-green-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400'
          }`}
        >
          <Repeat2 className="w-5 h-5" />
          <span className="text-sm font-medium">{note.reposts}</span>
        </button>

        <button
          onClick={() => handleLike(note.id)}
          className={`flex items-center gap-2 transition-colors ${
            note.isLiked
              ? 'text-red-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
          }`}
        >
          <Heart className={`w-5 h-5 ${note.isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{note.likes}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>

        <button className="ml-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Reply Input */}
      {replyingTo === note.id && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder={`Reply to ${note.authorName}...`}
              rows={3}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setReplyingTo(null)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleReply(note.id)}
              disabled={!newReply.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-10">
          <div className="p-4 flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Thread</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {replies.length + 1} posts in this thread
              </p>
            </div>
          </div>
        </div>

        {/* Main Note */}
        <NoteCard note={mainNote} isMain={true} />

        {/* Thread Stats */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>{mainNote.replies}</strong> replies
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>{mainNote.likes}</strong> likes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Repeat2 className="w-4 h-4 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>{mainNote.reposts}</strong> reposts
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2 text-orange-500">
              <TrendingUp className="w-4 h-4" />
              <span className="text-gray-700 dark:text-gray-300 text-xs">Trending</span>
            </div>
          </div>
        </div>

        {/* Replies Section Header */}
        <div className="px-6 py-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Replies</h2>
        </div>

        {/* Replies */}
        {replies.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No replies yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Be the first to reply to this note!</p>
          </div>
        ) : (
          <div>
            {replies.map((reply) => (
              <NoteCard key={reply.id} note={reply} />
            ))}
          </div>
        )}

        {/* Load More */}
        {replies.length > 0 && (
          <div className="p-6 text-center border-t border-gray-200 dark:border-gray-700">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
              Load More Replies
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

