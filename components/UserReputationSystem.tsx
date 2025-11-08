import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Award, Star, TrendingUp, Users, MessageSquare, Heart, Zap, Trophy, Target, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

interface ReputationScore {
  total: number;
  level: string;
  rank: number;
  percentile: number;
  breakdown: {
    contentQuality: number;
    engagement: number;
    community: number;
    governance: number;
    consistency: number;
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'content' | 'engagement' | 'community' | 'governance' | 'milestone';
  icon: string;
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  requirement?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ReputationHistory {
  date: string;
  score: number;
}

interface LeaderboardEntry {
  rank: number;
  address: string;
  username?: string;
  score: number;
  level: string;
  change: number; // +/- from previous period
}

const mockReputationScore: ReputationScore = {
  total: 7850,
  level: 'Diamond',
  rank: 47,
  percentile: 95,
  breakdown: {
    contentQuality: 85,
    engagement: 92,
    community: 78,
    governance: 65,
    consistency: 88,
  },
};

const mockAchievements: Achievement[] = [
  {
    id: 'ach_001',
    title: 'Early Adopter',
    description: 'Joined NoteBoard in the first month',
    category: 'milestone',
    icon: '🎉',
    earned: true,
    earnedAt: '2024-01-15T10:00:00Z',
    rarity: 'legendary',
  },
  {
    id: 'ach_002',
    title: 'Content Creator',
    description: 'Posted 100 notes',
    category: 'content',
    icon: '✍️',
    earned: true,
    earnedAt: '2024-05-20T14:30:00Z',
    rarity: 'rare',
  },
  {
    id: 'ach_003',
    title: 'Community Champion',
    description: 'Received 1000 likes from the community',
    category: 'engagement',
    icon: '❤️',
    earned: true,
    earnedAt: '2024-06-10T09:00:00Z',
    rarity: 'epic',
  },
  {
    id: 'ach_004',
    title: 'Governance Guru',
    description: 'Voted on 50 DAO proposals',
    category: 'governance',
    icon: '🗳️',
    earned: false,
    progress: 32,
    requirement: '32/50 proposals',
    rarity: 'rare',
  },
  {
    id: 'ach_005',
    title: 'Social Butterfly',
    description: 'Connected with 500 users',
    category: 'community',
    icon: '🦋',
    earned: false,
    progress: 68,
    requirement: '340/500 connections',
    rarity: 'epic',
  },
  {
    id: 'ach_006',
    title: 'Daily Streaker',
    description: 'Maintain a 30-day activity streak',
    category: 'milestone',
    icon: '🔥',
    earned: true,
    earnedAt: '2024-07-01T00:00:00Z',
    rarity: 'rare',
  },
  {
    id: 'ach_007',
    title: 'Viral Sensation',
    description: 'Create a post with 10,000+ views',
    category: 'content',
    icon: '🚀',
    earned: false,
    progress: 45,
    requirement: '4,500/10,000 views',
    rarity: 'legendary',
  },
  {
    id: 'ach_008',
    title: 'Helping Hand',
    description: 'Help moderate 100 community reports',
    category: 'community',
    icon: '🤝',
    earned: false,
    progress: 0,
    requirement: '0/100 reports',
    rarity: 'epic',
  },
];

const mockHistory: ReputationHistory[] = [
  { date: 'Jan', score: 5000 },
  { date: 'Feb', score: 5500 },
  { date: 'Mar', score: 6200 },
  { date: 'Apr', score: 6800 },
  { date: 'May', score: 7100 },
  { date: 'Jun', score: 7500 },
  { date: 'Jul', score: 7850 },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, address: '0xTop1', username: 'CryptoKing', score: 12500, level: 'Legendary', change: 0 },
  { rank: 2, address: '0xTop2', username: 'Web3Queen', score: 11200, level: 'Legendary', change: 1 },
  { rank: 3, address: '0xTop3', username: 'BlockchainBoss', score: 10800, level: 'Diamond', change: -1 },
  { rank: 47, address: '0xYou', username: 'You', score: 7850, level: 'Diamond', change: 3 },
  { rank: 48, address: '0xUser48', username: 'NoteCreator', score: 7820, level: 'Diamond', change: -1 },
  { rank: 49, address: '0xUser49', username: 'DAOVoter', score: 7800, level: 'Diamond', change: 2 },
  { rank: 50, address: '0xUser50', username: 'CommunityHelper', score: 7750, level: 'Diamond', change: 0 },
];

const UserReputationSystem: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [reputation, setReputation] = useState<ReputationScore>(mockReputationScore);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [history, setHistory] = useState<ReputationHistory[]>(mockHistory);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchReputationData(address);
    }
  }, [address, isConnected]);

  const fetchReputationData = async (userAddress: string) => {
    setLoading(true);
    try {
      // In a real application, this would involve:
      // 1. Reading on-chain reputation data from smart contracts
      // 2. Calculating scores based on:
      //    - Number and quality of posts (likes, comments, shares)
      //    - Engagement metrics (time spent, interactions)
      //    - Governance participation (voting, proposals)
      //    - Community contributions (moderating, helping others)
      //    - Token holdings and staking
      // 3. Fetching achievement progress
      // 4. Loading historical data
      console.log(`Fetching reputation data for ${userAddress}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Data already set with mock values
    } catch (error) {
      console.error('Failed to fetch reputation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'legendary': return 'text-yellow-600 dark:text-yellow-400';
      case 'diamond': return 'text-blue-600 dark:text-blue-400';
      case 'platinum': return 'text-purple-600 dark:text-purple-400';
      case 'gold': return 'text-orange-600 dark:text-orange-400';
      case 'silver': return 'text-gray-500 dark:text-gray-400';
      case 'bronze': return 'text-amber-700 dark:text-amber-500';
      default: return 'text-muted-foreground';
    }
  };

  const getRarityBadge = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Legendary</Badge>;
      case 'epic':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Epic</Badge>;
      case 'rare':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Rare</Badge>;
      case 'common':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Common</Badge>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'content': return <MessageSquare className="h-4 w-4" />;
      case 'engagement': return <Heart className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      case 'governance': return <Award className="h-4 w-4" />;
      case 'milestone': return <Trophy className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const radarData = [
    { metric: 'Content Quality', value: reputation.breakdown.contentQuality, fullMark: 100 },
    { metric: 'Engagement', value: reputation.breakdown.engagement, fullMark: 100 },
    { metric: 'Community', value: reputation.breakdown.community, fullMark: 100 },
    { metric: 'Governance', value: reputation.breakdown.governance, fullMark: 100 },
    { metric: 'Consistency', value: reputation.breakdown.consistency, fullMark: 100 },
  ];

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to view your reputation score and achievements.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Trophy className="h-8 w-8 mr-3 text-primary" /> Reputation System
        </h1>
        <p className="text-muted-foreground mt-1">
          Build your on-chain reputation through quality contributions
        </p>
      </div>

      {/* Reputation Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reputation.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +250 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getLevelColor(reputation.level)}`}>
              {reputation.level}
            </div>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">750/1000 to next level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">#{reputation.rank}</div>
            <p className="text-xs text-muted-foreground mt-1">Top {reputation.percentile}% of users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {achievements.filter(a => a.earned).length}/{achievements.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((achievements.filter(a => a.earned).length / achievements.length) * 100)}% unlocked
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Reputation Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Reputation Breakdown</CardTitle>
              <CardDescription>Your scores across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Content Quality</span>
                      <span className="text-sm font-bold">{reputation.breakdown.contentQuality}/100</span>
                    </div>
                    <Progress value={reputation.breakdown.contentQuality} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Engagement</span>
                      <span className="text-sm font-bold">{reputation.breakdown.engagement}/100</span>
                    </div>
                    <Progress value={reputation.breakdown.engagement} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Community</span>
                      <span className="text-sm font-bold">{reputation.breakdown.community}/100</span>
                    </div>
                    <Progress value={reputation.breakdown.community} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Governance</span>
                      <span className="text-sm font-bold">{reputation.breakdown.governance}/100</span>
                    </div>
                    <Progress value={reputation.breakdown.governance} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Consistency</span>
                      <span className="text-sm font-bold">{reputation.breakdown.consistency}/100</span>
                    </div>
                    <Progress value={reputation.breakdown.consistency} />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Your Score" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historical Data */}
          <Card>
            <CardHeader>
              <CardTitle>Reputation History</CardTitle>
              <CardDescription>Your reputation score over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} name="Reputation Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`${achievement.earned ? 'border-primary' : 'opacity-60'}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {achievement.title}
                          {achievement.earned && <Trophy className="h-4 w-4 text-yellow-600" />}
                        </CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getCategoryIcon(achievement.category)}
                      {achievement.category}
                    </Badge>
                    {getRarityBadge(achievement.rarity)}
                  </div>
                  {achievement.earned ? (
                    <Alert className="bg-green-50 dark:bg-green-950">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-300">
                        Unlocked on {achievement.earnedAt && new Date(achievement.earnedAt).toLocaleDateString()}
                      </AlertDescription>
                    </Alert>
                  ) : achievement.progress !== undefined ? (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} />
                      {achievement.requirement && (
                        <p className="text-xs text-muted-foreground mt-2">{achievement.requirement}</p>
                      )}
                    </div>
                  ) : (
                    <Alert>
                      <Target className="h-4 w-4" />
                      <AlertDescription>Not yet unlocked</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Leaderboard</CardTitle>
              <CardDescription>Top reputation holders in the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.username === 'You' ? 'bg-primary/10 border-2 border-primary' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                        <span className="font-bold text-lg">
                          {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {entry.username || entry.address.slice(0, 10) + '...'}
                          {entry.username === 'You' && <Badge className="ml-2" variant="secondary">You</Badge>}
                        </p>
                        <p className={`text-sm ${getLevelColor(entry.level)}`}>{entry.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{entry.score.toLocaleString()}</p>
                      <p className={`text-xs ${entry.change > 0 ? 'text-green-600' : entry.change < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {entry.change > 0 ? '↑' : entry.change < 0 ? '↓' : '−'} {Math.abs(entry.change)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserReputationSystem;

