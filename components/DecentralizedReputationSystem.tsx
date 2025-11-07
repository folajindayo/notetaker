"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther, parseEther, Address } from "viem";
import {
  Award,
  Star,
  TrendingUp,
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Trophy,
  Target,
  Zap,
  Medal,
  Crown,
} from "lucide-react";

interface ReputationProfile {
  address: string;
  score: number;
  level: number;
  badges: Badge[];
  endorsements: number;
  disputes: number;
  transactionCount: number;
  trustScore: number;
  rank: string;
  achievements: Achievement[];
  history: ReputationEvent[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt: number;
  category: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
}

interface ReputationEvent {
  id: string;
  type: "endorsement" | "dispute" | "badge" | "level_up" | "transaction";
  description: string;
  points: number;
  timestamp: number;
  from?: string;
}

interface Endorsement {
  id: string;
  from: string;
  to: string;
  category: string;
  comment: string;
  weight: number;
  timestamp: number;
  verified: boolean;
}

export function DecentralizedReputationSystem() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"profile" | "leaderboard" | "endorse" | "badges">("profile");
  const [profile, setProfile] = useState<ReputationProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<ReputationProfile[]>([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [searchedProfile, setSearchedProfile] = useState<ReputationProfile | null>(null);
  
  // Endorsement form
  const [endorseAddress, setEndorseAddress] = useState("");
  const [endorseCategory, setEndorseCategory] = useState("reliability");
  const [endorseComment, setEndorseComment] = useState("");
  const [isEndorsing, setIsEndorsing] = useState(false);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const categories = [
    { id: "reliability", name: "Reliability", icon: <Shield className="h-4 w-4" /> },
    { id: "communication", name: "Communication", icon: <Users className="h-4 w-4" /> },
    { id: "expertise", name: "Expertise", icon: <Award className="h-4 w-4" /> },
    { id: "trustworthiness", name: "Trustworthiness", icon: <CheckCircle className="h-4 w-4" /> },
  ];

  useEffect(() => {
    if (isConnected && address) {
      loadReputationData();
      loadLeaderboard();
    }
  }, [isConnected, address]);

  const loadReputationData = () => {
    // Simulate loading reputation data
    const mockProfile: ReputationProfile = {
      address: address!,
      score: 8750,
      level: 15,
      badges: [
        {
          id: "1",
          name: "Pioneer",
          description: "Early adopter of the platform",
          icon: "🚀",
          rarity: "legendary",
          earnedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
          category: "Special",
        },
        {
          id: "2",
          name: "Trusted Trader",
          description: "Completed 100+ verified transactions",
          icon: "💼",
          rarity: "epic",
          earnedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
          category: "Trading",
        },
        {
          id: "3",
          name: "Community Star",
          description: "Received 50+ endorsements",
          icon: "⭐",
          rarity: "rare",
          earnedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
          category: "Social",
        },
        {
          id: "4",
          name: "Quick Responder",
          description: "Average response time under 1 hour",
          icon: "⚡",
          rarity: "common",
          earnedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
          category: "Communication",
        },
      ],
      endorsements: 127,
      disputes: 3,
      transactionCount: 234,
      trustScore: 94.5,
      rank: "Diamond",
      achievements: [
        {
          id: "1",
          name: "Transaction Master",
          description: "Complete 500 transactions",
          progress: 234,
          target: 500,
          reward: 1000,
          completed: false,
        },
        {
          id: "2",
          name: "Social Butterfly",
          description: "Receive 200 endorsements",
          progress: 127,
          target: 200,
          reward: 500,
          completed: false,
        },
        {
          id: "3",
          name: "Reputation Legend",
          description: "Reach level 20",
          progress: 15,
          target: 20,
          reward: 2000,
          completed: false,
        },
      ],
      history: [
        {
          id: "1",
          type: "endorsement",
          description: "Received endorsement for Reliability",
          points: 50,
          timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
          from: "0x1234...5678",
        },
        {
          id: "2",
          type: "badge",
          description: "Earned 'Community Star' badge",
          points: 500,
          timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
        },
        {
          id: "3",
          type: "level_up",
          description: "Reached level 15",
          points: 1000,
          timestamp: Date.now() - 25 * 24 * 60 * 60 * 1000,
        },
      ],
    };

    setProfile(mockProfile);
  };

  const loadLeaderboard = () => {
    // Simulate leaderboard data
    const mockLeaderboard: ReputationProfile[] = [
      {
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        score: 15420,
        level: 25,
        badges: [],
        endorsements: 342,
        disputes: 1,
        transactionCount: 567,
        trustScore: 98.7,
        rank: "Legendary",
        achievements: [],
        history: [],
      },
      {
        address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        score: 12890,
        level: 22,
        badges: [],
        endorsements: 278,
        disputes: 2,
        transactionCount: 489,
        trustScore: 96.3,
        rank: "Master",
        achievements: [],
        history: [],
      },
      {
        address: address!,
        score: 8750,
        level: 15,
        badges: [],
        endorsements: 127,
        disputes: 3,
        transactionCount: 234,
        trustScore: 94.5,
        rank: "Diamond",
        achievements: [],
        history: [],
      },
    ];

    setLeaderboard(mockLeaderboard);
  };

  const handleEndorse = async () => {
    if (!endorseAddress || !endorseComment) return;

    setIsEndorsing(true);

    try {
      // In a real implementation, this would call the reputation contract
      setTimeout(() => {
        setIsEndorsing(false);
        setEndorseAddress("");
        setEndorseComment("");
      }, 2000);
    } catch (error) {
      console.error("Endorsement failed:", error);
      setIsEndorsing(false);
    }
  };

  const searchProfile = () => {
    if (!searchAddress) return;

    // Simulate searching for a profile
    const mockSearchedProfile: ReputationProfile = {
      address: searchAddress,
      score: 5420,
      level: 10,
      badges: [
        {
          id: "1",
          name: "Active Trader",
          description: "Completed 50+ transactions",
          icon: "💰",
          rarity: "common",
          earnedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
          category: "Trading",
        },
      ],
      endorsements: 45,
      disputes: 1,
      transactionCount: 67,
      trustScore: 87.2,
      rank: "Silver",
      achievements: [],
      history: [],
    };

    setSearchedProfile(mockSearchedProfile);
  };

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      Legendary: "from-yellow-400 to-orange-500",
      Master: "from-purple-500 to-pink-600",
      Diamond: "from-blue-400 to-cyan-500",
      Platinum: "from-gray-300 to-gray-400",
      Gold: "from-yellow-300 to-yellow-500",
      Silver: "from-gray-200 to-gray-300",
      Bronze: "from-orange-300 to-orange-400",
    };
    return colors[rank] || "from-gray-400 to-gray-500";
  };

  const getRankIcon = (rank: string) => {
    const icons: Record<string, JSX.Element> = {
      Legendary: <Crown className="h-6 w-6" />,
      Master: <Trophy className="h-6 w-6" />,
      Diamond: <Medal className="h-6 w-6" />,
      Platinum: <Star className="h-6 w-6" />,
      Gold: <Award className="h-6 w-6" />,
      Silver: <Shield className="h-6 w-6" />,
      Bronze: <Target className="h-6 w-6" />,
    };
    return icons[rank] || <Star className="h-6 w-6" />;
  };

  const getRarityColor = (rarity: Badge["rarity"]) => {
    const colors: Record<Badge["rarity"], string> = {
      legendary: "bg-gradient-to-r from-yellow-400 to-orange-500",
      epic: "bg-gradient-to-r from-purple-500 to-pink-600",
      rare: "bg-gradient-to-r from-blue-400 to-cyan-500",
      common: "bg-gradient-to-r from-gray-400 to-gray-500",
    };
    return colors[rarity];
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-sm text-gray-600">
            Please connect your wallet to view reputation system
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Decentralized Reputation System
            </h1>
            <p className="text-sm text-gray-600">
              Build trust through on-chain reputation
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "profile"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          My Profile
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "leaderboard"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setActiveTab("endorse")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "endorse"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Endorse
        </button>
        <button
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "badges"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Badges ({profile?.badges.length || 0})
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && profile && (
        <div className="space-y-6">
          {/* Rank Card */}
          <div
            className={`bg-gradient-to-br ${getRankColor(
              profile.rank
            )} rounded-2xl p-6 text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {getRankIcon(profile.rank)}
                  <h2 className="text-3xl font-bold">{profile.rank}</h2>
                </div>
                <p className="text-sm opacity-90">Level {profile.level}</p>
                <div className="mt-3 flex items-center gap-4">
                  <div>
                    <div className="text-2xl font-bold">{profile.score}</div>
                    <div className="text-xs opacity-75">Reputation Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {profile.trustScore}%
                    </div>
                    <div className="text-xs opacity-75">Trust Score</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-4">
                  <div className="text-sm opacity-75 mb-1">Progress to Level {profile.level + 1}</div>
                  <div className="w-48 h-2 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all"
                      style={{ width: "65%" }}
                    />
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    650 / 1000 XP
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Endorsements</p>
                  <p className="text-2xl font-bold text-green-600">
                    {profile.endorsements}
                  </p>
                </div>
                <ThumbsUp className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Disputes</p>
                  <p className="text-2xl font-bold text-red-600">
                    {profile.disputes}
                  </p>
                </div>
                <ThumbsDown className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transactions</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {profile.transactionCount}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Badges</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {profile.badges.length}
                  </p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Active Achievements
            </h3>
            <div className="space-y-4">
              {profile.achievements.map((achievement) => (
                <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Trophy className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          +{achievement.reward} XP
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>
                        {achievement.progress} / {achievement.target}
                      </span>
                      <span>
                        {((achievement.progress / achievement.target) * 100).toFixed(
                          0
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 transition-all"
                        style={{
                          width: `${
                            (achievement.progress / achievement.target) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {profile.history.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    {event.type === "endorsement" && (
                      <ThumbsUp className="h-4 w-4 text-purple-600" />
                    )}
                    {event.type === "badge" && (
                      <Award className="h-4 w-4 text-purple-600" />
                    )}
                    {event.type === "level_up" && (
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    )}
                    {event.type === "transaction" && (
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                    )}
                    {event.type === "dispute" && (
                      <AlertCircle className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {event.description}
                        </p>
                        {event.from && (
                          <p className="text-xs text-gray-500 mt-1">
                            From: {event.from}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">
                          +{event.points} XP
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trust Score
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((user, index) => (
                  <tr
                    key={user.address}
                    className={`hover:bg-gray-50 ${
                      user.address === address ? "bg-purple-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Crown className="h-5 w-5 text-yellow-500" />}
                        {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                        {index === 2 && <Award className="h-5 w-5 text-orange-500" />}
                        <span className="font-semibold text-gray-900">
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-gray-900">
                        {user.address.slice(0, 6)}...{user.address.slice(-4)}
                      </code>
                      {user.address === address && (
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          You
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {user.score.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {user.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 bg-gradient-to-r ${getRankColor(
                          user.rank
                        )} text-white rounded-full text-sm font-medium`}
                      >
                        {user.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${user.trustScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {user.trustScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Endorse Tab */}
      {activeTab === "endorse" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Give Endorsement
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Address
                </label>
                <input
                  type="text"
                  value={endorseAddress}
                  onChange={(e) => setEndorseAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setEndorseCategory(category.id)}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                        endorseCategory === category.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {category.icon}
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={endorseComment}
                  onChange={(e) => setEndorseComment(e.target.value)}
                  placeholder="Why are you endorsing this user?"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleEndorse}
                disabled={!endorseAddress || !endorseComment || isEndorsing}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isEndorsing ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ThumbsUp className="h-4 w-4" />
                    Submit Endorsement
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Profile */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Search Profile
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Enter address to search..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={searchProfile}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Search
              </button>
            </div>

            {searchedProfile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <code className="text-sm font-medium text-gray-900">
                      {searchedProfile.address}
                    </code>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 bg-gradient-to-r ${getRankColor(
                          searchedProfile.rank
                        )} text-white rounded text-xs font-medium`}
                      >
                        {searchedProfile.rank}
                      </span>
                      <span className="text-xs text-gray-500">
                        Level {searchedProfile.level}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {searchedProfile.score}
                    </div>
                    <div className="text-xs text-gray-500">Reputation</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {searchedProfile.endorsements}
                    </div>
                    <div className="text-xs text-gray-500">Endorsements</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {searchedProfile.transactionCount}
                    </div>
                    <div className="text-xs text-gray-500">Transactions</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {searchedProfile.trustScore}%
                    </div>
                    <div className="text-xs text-gray-500">Trust Score</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === "badges" && profile && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-16 h-16 ${getRarityColor(
                    badge.rarity
                  )} rounded-full flex items-center justify-center text-3xl mb-4 mx-auto`}
                >
                  {badge.icon}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {badge.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {badge.description}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`px-2 py-1 ${getRarityColor(
                        badge.rarity
                      )} text-white rounded text-xs font-medium`}
                    >
                      {badge.rarity}
                    </span>
                    <span className="text-xs text-gray-500">
                      {badge.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Earned {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

