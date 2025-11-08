import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Award, Trophy, Star, Zap, Target, CheckCircle, Lock, TrendingUp, Users, MessageSquare, Vote, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { format, parseISO } from 'date-fns';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'social' | 'creator' | 'governance' | 'collector' | 'helper' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  requirement: string;
  points: number;
  nftMintable: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
  completedAt?: string;
  progress: number;
  maxProgress: number;
  category: string;
}

interface UserStats {
  totalBadges: number;
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  rank: string;
  streakDays: number;
}

const mockBadges: Badge[] = [
  {
    id: 'badge_001',
    name: 'First Note',
    description: 'Posted your first note on NoteBoard',
    icon: '📝',
    category: 'creator',
    rarity: 'common',
    earned: true,
    earnedAt: '2024-01-15T10:00:00Z',
    requirement: 'Post 1 note',
    points: 10,
    nftMintable: false,
  },
  {
    id: 'badge_002',
    name: 'Social Butterfly',
    description: 'Connected with 100 users',
    icon: '🦋',
    category: 'social',
    rarity: 'uncommon',
    earned: true,
    earnedAt: '2024-03-20T14:30:00Z',
    requirement: 'Follow 100 users',
    points: 50,
    nftMintable: true,
  },
  {
    id: 'badge_003',
    name: 'Content King',
    description: 'Posted 1000 notes',
    icon: '👑',
    category: 'creator',
    rarity: 'epic',
    earned: true,
    earnedAt: '2024-06-10T09:00:00Z',
    requirement: 'Post 1000 notes',
    points: 500,
    nftMintable: true,
  },
  {
    id: 'badge_004',
    name: 'Governance Guardian',
    description: 'Voted on 100 DAO proposals',
    icon: '🗳️',
    category: 'governance',
    rarity: 'rare',
    earned: false,
    progress: 65,
    requirement: 'Vote on 100 proposals',
    points: 200,
    nftMintable: true,
  },
  {
    id: 'badge_005',
    name: 'NFT Collector',
    description: 'Own 50 NFTs across multiple chains',
    icon: '🖼️',
    category: 'collector',
    rarity: 'rare',
    earned: false,
    progress: 42,
    requirement: 'Own 50 NFTs',
    points: 150,
    nftMintable: true,
  },
  {
    id: 'badge_006',
    name: 'Community Hero',
    description: 'Helped moderate 500 reports',
    icon: '🦸',
    category: 'helper',
    rarity: 'epic',
    earned: false,
    progress: 15,
    requirement: 'Review 500 reports',
    points: 300,
    nftMintable: true,
  },
  {
    id: 'badge_007',
    name: 'Early Adopter',
    description: 'Joined NoteBoard in the first month',
    icon: '🌟',
    category: 'special',
    rarity: 'legendary',
    earned: true,
    earnedAt: '2024-01-05T08:00:00Z',
    requirement: 'Join in first month',
    points: 1000,
    nftMintable: true,
  },
  {
    id: 'badge_008',
    name: 'Streak Master',
    description: 'Maintained a 100-day activity streak',
    icon: '🔥',
    category: 'special',
    rarity: 'legendary',
    earned: false,
    progress: 73,
    requirement: '100-day streak',
    points: 800,
    nftMintable: true,
  },
  {
    id: 'badge_009',
    name: 'Viral Star',
    description: 'Created a post with 100k views',
    icon: '🚀',
    category: 'creator',
    rarity: 'legendary',
    earned: false,
    progress: 28,
    requirement: '100k views on a post',
    points: 1000,
    nftMintable: true,
  },
  {
    id: 'badge_010',
    name: 'Engagement Pro',
    description: 'Received 10,000 likes',
    icon: '❤️',
    category: 'social',
    rarity: 'epic',
    earned: true,
    earnedAt: '2024-05-15T16:00:00Z',
    requirement: 'Get 10,000 likes',
    points: 400,
    nftMintable: true,
  },
  {
    id: 'badge_011',
    name: 'DAO Founder',
    description: 'Created a successful DAO proposal',
    icon: '🏛️',
    category: 'governance',
    rarity: 'rare',
    earned: false,
    progress: 0,
    requirement: 'Pass a proposal',
    points: 250,
    nftMintable: true,
  },
  {
    id: 'badge_012',
    name: 'Generous Tipper',
    description: 'Tipped 100 creators',
    icon: '💰',
    category: 'helper',
    rarity: 'uncommon',
    earned: true,
    earnedAt: '2024-04-10T11:00:00Z',
    requirement: 'Tip 100 creators',
    points: 100,
    nftMintable: false,
  },
];

const mockAchievements: Achievement[] = [
  {
    id: 'ach_001',
    title: 'Welcome to NoteBoard',
    description: 'Complete your profile setup',
    reward: '10 points',
    completed: true,
    completedAt: '2024-01-15T10:00:00Z',
    progress: 100,
    maxProgress: 100,
    category: 'Onboarding',
  },
  {
    id: 'ach_002',
    title: 'Social Starter',
    description: 'Follow 10 users and get 10 followers',
    reward: '25 points',
    completed: true,
    completedAt: '2024-01-20T14:00:00Z',
    progress: 100,
    maxProgress: 100,
    category: 'Social',
  },
  {
    id: 'ach_003',
    title: 'Content Creator',
    description: 'Post 50 notes',
    reward: '100 points + "Creator" badge',
    completed: false,
    progress: 38,
    maxProgress: 50,
    category: 'Content',
  },
  {
    id: 'ach_004',
    title: 'Community Builder',
    description: 'Invite 5 friends to join NoteBoard',
    reward: '75 points + Special NFT',
    completed: false,
    progress: 2,
    maxProgress: 5,
    category: 'Community',
  },
  {
    id: 'ach_005',
    title: 'Governance Participant',
    description: 'Vote on your first 5 DAO proposals',
    reward: '50 points',
    completed: false,
    progress: 3,
    maxProgress: 5,
    category: 'Governance',
  },
];

const mockUserStats: UserStats = {
  totalBadges: 5,
  totalPoints: 2160,
  level: 12,
  nextLevelPoints: 2500,
  rank: 'Diamond',
  streakDays: 73,
};

const AchievementsBadges: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  useEffect(() => {
    if (isConnected && address) {
      fetchUserBadgesAndAchievements(address);
    }
  }, [address, isConnected]);

  const fetchUserBadgesAndAchievements = async (userAddress: string) => {
    // In a real application, this would involve:
    // 1. Querying smart contracts for earned badges
    // 2. Checking achievement progress from on-chain data
    // 3. Calculating user stats and levels
    // 4. Fetching NFT-minted badges
    console.log(`Fetching badges and achievements for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsBadgeModalOpen(true);
  };

  const handleMintBadgeNFT = async (badgeId: string) => {
    if (!isConnected) {
      alert('Please connect your wallet to mint badge NFT.');
      return;
    }
    console.log(`Minting NFT for badge ${badgeId}...`);
    // In a real app: call smart contract to mint badge as NFT
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Badge NFT minted successfully!');
  };

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'uncommon': return 'from-green-400 to-green-600';
      case 'common': return 'from-gray-400 to-gray-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBadge = (rarity: Badge['rarity']) => {
    const colors = {
      legendary: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      epic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      rare: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      uncommon: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      common: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return <Badge className={colors[rarity]}>{rarity.charAt(0).toUpperCase() + rarity.slice(1)}</Badge>;
  };

  const getCategoryIcon = (category: Badge['category']) => {
    switch (category) {
      case 'social': return <Users className="h-4 w-4" />;
      case 'creator': return <MessageSquare className="h-4 w-4" />;
      case 'governance': return <Vote className="h-4 w-4" />;
      case 'collector': return <Star className="h-4 w-4" />;
      case 'helper': return <Award className="h-4 w-4" />;
      case 'special': return <Trophy className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const filteredBadges = badges.filter(badge => {
    if (filter === 'earned') return badge.earned;
    if (filter === 'locked') return !badge.earned;
    return true;
  });

  const earnedBadges = badges.filter(b => b.earned);
  const progressToNextLevel = ((userStats.totalPoints % 200) / 200) * 100;

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to view your badges and achievements.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Trophy className="h-8 w-8 mr-3 text-primary" /> Achievements & Badges
        </h1>
        <p className="text-muted-foreground mt-1">
          Earn badges and unlock achievements through your activity
        </p>
      </div>

      {/* User Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats.totalPoints.toLocaleString()}</div>
            <Progress value={progressToNextLevel} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {userStats.nextLevelPoints - userStats.totalPoints} to level {userStats.level + 1}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats.level}</div>
            <p className="text-sm text-muted-foreground mt-1">{userStats.rank} Rank</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {earnedBadges.length}/{badges.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round((earnedBadges.length / badges.length) * 100)}% completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              {userStats.streakDays} <span className="text-orange-500 ml-2">🔥</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Days active</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="badges" className="w-full">
        <TabsList>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-6 mt-6">
          {/* Filter */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All ({badges.length})
            </Button>
            <Button
              variant={filter === 'earned' ? 'default' : 'outline'}
              onClick={() => setFilter('earned')}
              size="sm"
            >
              Earned ({earnedBadges.length})
            </Button>
            <Button
              variant={filter === 'locked' ? 'default' : 'outline'}
              onClick={() => setFilter('locked')}
              size="sm"
            >
              Locked ({badges.length - earnedBadges.length})
            </Button>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBadges.map((badge) => (
              <Card
                key={badge.id}
                className={`cursor-pointer hover:shadow-lg transition-all ${
                  badge.earned 
                    ? `bg-gradient-to-br ${getRarityColor(badge.rarity)} border-2` 
                    : 'opacity-60 grayscale'
                }`}
                onClick={() => handleBadgeClick(badge)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="text-6xl mb-2 relative">
                    {badge.earned ? (
                      badge.icon
                    ) : (
                      <div className="relative">
                        {badge.icon}
                        <Lock className="absolute top-0 right-0 h-6 w-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <CardTitle className={`text-sm ${badge.earned ? 'text-white' : ''}`}>
                    {badge.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {badge.earned ? (
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                      <span className="text-xs font-medium text-white">Earned</span>
                    </div>
                  ) : badge.progress !== undefined ? (
                    <div>
                      <Progress value={badge.progress} className="mb-1" />
                      <p className="text-xs">{badge.progress}%</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <Lock className="h-4 w-4" />
                      <span className="text-xs">Locked</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 mt-6">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={achievement.completed ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{achievement.category}</Badge>
                      {achievement.completed && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{achievement.reward}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!achievement.completed && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
                  </div>
                )}
                {achievement.completed && achievement.completedAt && (
                  <p className="text-sm text-muted-foreground">
                    Completed on {format(parseISO(achievement.completedAt), 'PPP')}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Badge Collectors</CardTitle>
              <CardDescription>Users with the most badges earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, address: '0xTop1', username: 'BadgeHunter', badges: 12, points: 5200 },
                  { rank: 2, address: '0xTop2', username: 'AchievementKing', badges: 11, points: 4800 },
                  { rank: 3, address: '0xTop3', username: 'TrophyCollector', badges: 10, points: 4500 },
                  { rank: 47, address: address, username: 'You', badges: earnedBadges.length, points: userStats.totalPoints },
                ].map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.username === 'You' ? 'bg-primary/10 border-2 border-primary' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background font-bold">
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {entry.username}
                          {entry.username === 'You' && <Badge className="ml-2" variant="secondary">You</Badge>}
                        </p>
                        <p className="text-sm text-muted-foreground">{entry.badges} badges • {entry.points} points</p>
                      </div>
                    </div>
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Badge Detail Modal */}
      <Dialog open={isBadgeModalOpen} onOpenChange={setIsBadgeModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedBadge && (
            <>
              <DialogHeader>
                <div className={`text-center p-6 rounded-t-lg ${selectedBadge.earned ? `bg-gradient-to-br ${getRarityColor(selectedBadge.rarity)}` : 'bg-muted'}`}>
                  <div className="text-8xl mb-4">
                    {selectedBadge.earned ? selectedBadge.icon : (
                      <div className="relative inline-block">
                        <span className="opacity-30">{selectedBadge.icon}</span>
                        <Lock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <DialogTitle className={`text-2xl ${selectedBadge.earned ? 'text-white' : ''}`}>
                    {selectedBadge.name}
                  </DialogTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {getRarityBadge(selectedBadge.rarity)}
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getCategoryIcon(selectedBadge.category)}
                      {selectedBadge.category}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 py-4 px-6">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedBadge.description}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Requirement</p>
                    <p className="font-medium">{selectedBadge.requirement}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="font-medium">{selectedBadge.points} pts</p>
                  </div>
                </div>
                {!selectedBadge.earned && selectedBadge.progress !== undefined && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Progress</h4>
                      <Progress value={selectedBadge.progress} className="mb-1" />
                      <p className="text-sm text-muted-foreground">{selectedBadge.progress}% complete</p>
                    </div>
                  </>
                )}
                {selectedBadge.earned && (
                  <>
                    <Separator />
                    <Alert className="bg-green-50 dark:bg-green-950">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-300">
                        Earned on {selectedBadge.earnedAt && format(parseISO(selectedBadge.earnedAt), 'PPP')}
                      </AlertDescription>
                    </Alert>
                    {selectedBadge.nftMintable && (
                      <Button onClick={() => handleMintBadgeNFT(selectedBadge.id)} className="w-full">
                        <Trophy className="h-4 w-4 mr-2" /> Mint as NFT
                      </Button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AchievementsBadges;

