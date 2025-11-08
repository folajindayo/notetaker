'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';
import NoteCard from './NoteCard';

/**
 * ContentRecommendationEngine - AI-powered content recommendation system
 * Analyzes user behavior, interests, and interactions to suggest relevant content
 */

interface RecommendationScore {
  noteId: bigint;
  score: number;
  reason: string;
}

interface UserBehavior {
  likedTags: Set<string>;
  followedAuthors: Set<string>;
  recentInteractions: bigint[];
  engagementPatterns: Map<string, number>;
}

export default function ContentRecommendationEngine() {
  const { address } = useAccount();
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'for-you' | 'trending' | 'new'>('for-you');
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    likedTags: new Set(),
    followedAuthors: new Set(),
    recentInteractions: [],
    engagementPatterns: new Map(),
  });

  // Fetch all notes
  const { data: allNotes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAllNotes',
  });

  // Fetch user's liked notes to understand preferences
  const { data: userProfile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserProfile',
    args: address ? [address] : undefined,
  });

  // Fetch followed users
  const { data: followedUsers } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getFollowing',
    args: address ? [address] : undefined,
  });

  // Analyze user behavior and generate recommendations
  useEffect(() => {
    if (!allNotes || !Array.isArray(allNotes) || !address) {
      setLoading(false);
      return;
    }

    const analyzeAndRecommend = async () => {
      setLoading(true);

      // Build user behavior profile
      const behavior: UserBehavior = {
        likedTags: new Set(),
        followedAuthors: new Set(followedUsers as string[] || []),
        recentInteractions: [],
        engagementPatterns: new Map(),
      };

      // Analyze user's interaction history
      allNotes.forEach((note: any) => {
        if (note.likesCount > 0 && note.author === address) {
          // Track tags from notes user liked
          note.tags?.forEach((tag: string) => {
            if (tag) behavior.likedTags.add(tag.toLowerCase());
          });
        }

        // Track engagement patterns (time of day, content types)
        note.tags?.forEach((tag: string) => {
          if (tag) {
            const count = behavior.engagementPatterns.get(tag.toLowerCase()) || 0;
            behavior.engagementPatterns.set(tag.toLowerCase(), count + 1);
          }
        });
      });

      setUserBehavior(behavior);

      // Generate recommendation scores
      const scores: RecommendationScore[] = [];

      allNotes.forEach((note: any) => {
        // Skip user's own notes
        if (note.author === address) return;

        let score = 0;
        let reasons: string[] = [];

        // Score based on followed authors (high weight)
        if (behavior.followedAuthors.has(note.author)) {
          score += 50;
          reasons.push('From followed creator');
        }

        // Score based on tag relevance
        note.tags?.forEach((tag: string) => {
          if (tag && behavior.likedTags.has(tag.toLowerCase())) {
            score += 20;
            reasons.push(`Matches interest: ${tag}`);
          }
        });

        // Score based on engagement (viral content)
        const engagementScore = Number(note.likesCount) * 2 + Number(note.repliesCount) * 3;
        score += Math.min(engagementScore, 30);
        if (engagementScore > 10) {
          reasons.push('High engagement');
        }

        // Recency bonus (newer content gets boost)
        const noteAge = Date.now() / 1000 - Number(note.timestamp);
        const recencyBonus = Math.max(0, 20 - (noteAge / 3600)); // Decays over 24 hours
        score += recencyBonus;

        // Diversity bonus (encourage exploration)
        const hasNewTag = note.tags?.some((tag: string) => 
          tag && !behavior.likedTags.has(tag.toLowerCase())
        );
        if (hasNewTag && score > 20) {
          score += 10;
          reasons.push('Discover new topics');
        }

        if (score > 0) {
          scores.push({
            noteId: note.id,
            score,
            reason: reasons.join(' • '),
          });
        }
      });

      // Sort by score and take top recommendations
      scores.sort((a, b) => b.score - a.score);
      setRecommendations(scores.slice(0, 50));
      setLoading(false);
    };

    analyzeAndRecommend();
  }, [allNotes, address, followedUsers]);

  // Filter notes based on selected tab
  const getFilteredNotes = () => {
    if (!allNotes || !Array.isArray(allNotes)) return [];

    switch (selectedTab) {
      case 'for-you':
        return recommendations
          .map(rec => allNotes.find((note: any) => note.id === rec.noteId))
          .filter(Boolean);
      
      case 'trending':
        return [...allNotes]
          .filter((note: any) => !note.isDeleted)
          .sort((a: any, b: any) => {
            const scoreA = Number(a.likesCount) * 2 + Number(a.repliesCount) * 3;
            const scoreB = Number(b.likesCount) * 2 + Number(b.repliesCount) * 3;
            return scoreB - scoreA;
          })
          .slice(0, 50);
      
      case 'new':
        return [...allNotes]
          .filter((note: any) => !note.isDeleted)
          .sort((a: any, b: any) => Number(b.timestamp) - Number(a.timestamp))
          .slice(0, 50);
      
      default:
        return [];
    }
  };

  const filteredNotes = getFilteredNotes();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🎯 Discover Content
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personalized recommendations based on your interests and behavior
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSelectedTab('for-you')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                selectedTab === 'for-you'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🎯 For You
            </button>
            <button
              onClick={() => setSelectedTab('trending')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                selectedTab === 'trending'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🔥 Trending
            </button>
            <button
              onClick={() => setSelectedTab('new')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                selectedTab === 'new'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              ✨ New
            </button>
          </div>
        </div>

        {/* User Behavior Insights */}
        {selectedTab === 'for-you' && address && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              📊 Your Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(userBehavior.likedTags).slice(0, 10).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
              {userBehavior.likedTags.size === 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start interacting with content to get personalized recommendations!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Recommendations Stats */}
        {selectedTab === 'for-you' && recommendations.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{recommendations.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Recommended</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{userBehavior.likedTags.size}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Interests</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{userBehavior.followedAuthors.size}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Content Feed */}
        {!loading && (
          <div className="space-y-4">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note: any) => (
                <div key={note.id.toString()} className="relative">
                  <NoteCard note={note} />
                  {selectedTab === 'for-you' && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                      {recommendations.find(r => r.noteId === note.id)?.score.toFixed(0)}% match
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedTab === 'for-you' && !address
                    ? 'Connect your wallet to get personalized recommendations'
                    : 'No content available'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Recommendation Algorithm Info */}
        {selectedTab === 'for-you' && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
              How recommendations work:
            </h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Content from creators you follow gets priority</li>
              <li>• Notes with tags matching your interests are boosted</li>
              <li>• High-engagement content (likes, replies) is ranked higher</li>
              <li>• Newer content gets a recency bonus</li>
              <li>• We suggest diverse content to help you discover new topics</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

