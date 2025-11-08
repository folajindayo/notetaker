import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Users, Target, Clock, Award, PlusCircle, Info, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO, isAfter, isBefore } from 'date-fns';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'content' | 'engagement' | 'community' | 'technical';
  prize: string;
  prizeToken: string;
  participants: number;
  maxParticipants?: number;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'ended';
  requirements: string[];
  leaderboard: {
    rank: number;
    address: string;
    username?: string;
    score: number;
    reward: string;
  }[];
}

interface UserParticipation {
  challengeId: string;
  challengeTitle: string;
  score: number;
  rank: number;
  status: 'participating' | 'completed' | 'won';
  joinedAt: string;
  reward?: string;
}

const mockChallenges: Challenge[] = [
  {
    id: 'challenge_001',
    title: 'Best Web3 Tutorial',
    description: 'Create the most helpful Web3 tutorial and win tokens!',
    category: 'content',
    prize: '5000',
    prizeToken: 'NOTE',
    participants: 45,
    maxParticipants: 100,
    startTime: '2024-07-20T00:00:00Z',
    endTime: '2024-08-20T23:59:59Z',
    status: 'active',
    requirements: [
      'Create a tutorial post',
      'Minimum 500 words',
      'Include code examples',
      'Get at least 50 likes',
    ],
    leaderboard: [
      { rank: 1, address: '0xWinner1', username: 'TutorialMaster', score: 1250, reward: '2000' },
      { rank: 2, address: '0xWinner2', username: 'Web3Guru', score: 980, reward: '1500' },
      { rank: 3, address: '0xWinner3', username: 'CodeNinja', score: 850, reward: '1000' },
      { rank: 4, address: '0xYou', username: 'You', score: 720, reward: '500' },
    ],
  },
  {
    id: 'challenge_002',
    title: 'Community Engagement Challenge',
    description: 'Most active community member wins!',
    category: 'engagement',
    prize: '3000',
    prizeToken: 'NOTE',
    participants: 120,
    startTime: '2024-07-15T00:00:00Z',
    endTime: '2024-08-15T23:59:59Z',
    status: 'active',
    requirements: [
      'Comment on 20+ posts',
      'Share 10+ posts',
      'Get 100+ likes on your content',
    ],
    leaderboard: [
      { rank: 1, address: '0xEngager1', username: 'ActiveUser', score: 2500, reward: '1500' },
      { rank: 2, address: '0xEngager2', username: 'SocialButterfly', score: 2100, reward: '1000' },
      { rank: 3, address: '0xEngager3', username: 'CommunityHero', score: 1800, reward: '500' },
    ],
  },
  {
    id: 'challenge_003',
    title: 'Build a DApp Challenge',
    description: 'Build and deploy a decentralized application',
    category: 'technical',
    prize: '10000',
    prizeToken: 'NOTE',
    participants: 25,
    maxParticipants: 50,
    startTime: '2024-08-01T00:00:00Z',
    endTime: '2024-09-01T23:59:59Z',
    status: 'upcoming',
    requirements: [
      'Deploy a smart contract',
      'Create a frontend',
      'Submit GitHub link',
      'Get 3+ reviews',
    ],
    leaderboard: [],
  },
];

const mockUserParticipations: UserParticipation[] = [
  {
    challengeId: 'challenge_001',
    challengeTitle: 'Best Web3 Tutorial',
    score: 720,
    rank: 4,
    status: 'participating',
    joinedAt: '2024-07-21T10:00:00Z',
  },
  {
    challengeId: 'challenge_002',
    challengeTitle: 'Community Engagement Challenge',
    score: 0,
    rank: 0,
    status: 'participating',
    joinedAt: '2024-07-16T14:00:00Z',
  },
];

const CommunityChallenges: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [userParticipations, setUserParticipations] = useState<UserParticipation[]>(mockUserParticipations);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<string>('');

  useEffect(() => {
    if (isConnected && address) {
      fetchChallengeData(address);
    }
  }, [address, isConnected]);

  const fetchChallengeData = async (userAddress: string) => {
    // In a real application, this would fetch from blockchain
    console.log(`Fetching challenge data for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleJoinChallenge = async (challengeId: string) => {
    if (!isConnected) {
      alert('Please connect your wallet to join challenges.');
      return;
    }

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    if (challenge.maxParticipants && challenge.participants >= challenge.maxParticipants) {
      alert('Challenge is full!');
      return;
    }

    if (challenge.status !== 'active') {
      alert('Challenge is not active yet.');
      return;
    }

    console.log(`Joining challenge ${challengeId}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const participation: UserParticipation = {
      challengeId,
      challengeTitle: challenge.title,
      score: 0,
      rank: challenge.participants + 1,
      status: 'participating',
      joinedAt: new Date().toISOString(),
    };

    setUserParticipations(prev => [...prev, participation]);
    setChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, participants: c.participants + 1 }
        : c
    ));

    alert(`Successfully joined "${challenge.title}"!`);
  };

  const getStatusBadge = (status: Challenge['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Upcoming</Badge>;
      case 'ended':
        return <Badge variant="secondary">Ended</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: Challenge['category']) => {
    const colors = {
      content: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      engagement: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      community: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      technical: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    return (
      <Badge className={colors[category]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const isParticipating = (challengeId: string) => {
    return userParticipations.some(p => p.challengeId === challengeId);
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to participate in community challenges.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Trophy className="h-8 w-8 mr-3 text-primary" /> Community Challenges
        </h1>
        <p className="text-muted-foreground mt-1">
          Compete in challenges and win token prizes
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Challenges ({challenges.filter(c => c.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="my-challenges">My Challenges ({userParticipations.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({challenges.filter(c => c.status === 'upcoming').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {challenges.filter(c => c.status === 'active').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active challenges at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {challenges
                .filter(c => c.status === 'active')
                .map(challenge => {
                  const participation = userParticipations.find(p => p.challengeId === challenge.id);
                  const participantProgress = challenge.maxParticipants 
                    ? (challenge.participants / challenge.maxParticipants) * 100 
                    : 0;

                  return (
                    <Card key={challenge.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(challenge.status)}
                              {getCategoryBadge(challenge.category)}
                            </div>
                            <CardTitle className="text-xl">{challenge.title}</CardTitle>
                            <CardDescription className="mt-2">{challenge.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Prize</p>
                            <p className="text-2xl font-bold">{parseFloat(challenge.prize).toLocaleString()} {challenge.prizeToken}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Participants</p>
                            <p className="text-2xl font-bold">
                              {challenge.participants}
                              {challenge.maxParticipants && ` / ${challenge.maxParticipants}`}
                            </p>
                          </div>
                        </div>
                        {challenge.maxParticipants && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Participation Progress</span>
                              <span className="font-medium">{participantProgress.toFixed(1)}%</span>
                            </div>
                            <Progress value={participantProgress} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium mb-2">Requirements:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {challenge.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        {participation && (
                          <Alert className="bg-blue-50 dark:bg-blue-950">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                              You're participating! Your rank: #{participation.rank} | Score: {participation.score}
                            </AlertDescription>
                          </Alert>
                        )}
                        {challenge.leaderboard.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Top Leaderboard:</p>
                            <div className="space-y-2">
                              {challenge.leaderboard.slice(0, 3).map(entry => (
                                <div key={entry.rank} className="flex items-center justify-between p-2 bg-muted rounded">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">#{entry.rank}</span>
                                    <span>{entry.username || entry.address.slice(0, 10) + '...'}</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="font-semibold">{entry.score.toLocaleString()} pts</span>
                                    <Badge>{entry.reward} {challenge.prizeToken}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Ends {format(parseISO(challenge.endTime), 'PP')}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {isParticipating(challenge.id) ? (
                          <Button variant="outline" className="w-full" disabled>
                            <Award className="h-4 w-4 mr-2" /> Already Participating
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleJoinChallenge(challenge.id)}
                            className="w-full"
                            disabled={challenge.maxParticipants ? challenge.participants >= challenge.maxParticipants : false}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" /> Join Challenge
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-challenges" className="space-y-4 mt-6">
          {userParticipations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Target className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You haven't joined any challenges yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userParticipations.map(participation => {
                const challenge = challenges.find(c => c.id === participation.challengeId);
                if (!challenge) return null;

                return (
                  <Card key={participation.challengeId}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{participation.challengeTitle}</CardTitle>
                          <CardDescription>
                            Joined {format(parseISO(participation.joinedAt), 'PP')}
                          </CardDescription>
                        </div>
                        <Badge variant={participation.status === 'won' ? 'default' : 'outline'}>
                          {participation.status.charAt(0).toUpperCase() + participation.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Your Rank</p>
                          <p className="text-2xl font-bold">#{participation.rank}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Your Score</p>
                          <p className="text-2xl font-bold">{participation.score.toLocaleString()}</p>
                        </div>
                        {participation.reward && (
                          <div>
                            <p className="text-sm text-muted-foreground">Reward</p>
                            <p className="text-2xl font-bold text-green-600">{participation.reward} {challenge.prizeToken}</p>
                          </div>
                        )}
                      </div>
                      {challenge.leaderboard.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Current Leaderboard:</p>
                          <div className="space-y-1">
                            {challenge.leaderboard.slice(0, 5).map(entry => (
                              <div
                                key={entry.rank}
                                className={`flex items-center justify-between p-2 rounded ${
                                  entry.address === address ? 'bg-primary/10' : 'bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">#{entry.rank}</span>
                                  <span>{entry.username || entry.address.slice(0, 10) + '...'}</span>
                                  {entry.address === address && <Badge variant="outline">You</Badge>}
                                </div>
                                <span className="font-semibold">{entry.score.toLocaleString()} pts</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {challenges.filter(c => c.status === 'upcoming').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming challenges scheduled.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {challenges
                .filter(c => c.status === 'upcoming')
                .map(challenge => (
                  <Card key={challenge.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(challenge.status)}
                            {getCategoryBadge(challenge.category)}
                          </div>
                          <CardTitle className="text-xl">{challenge.title}</CardTitle>
                          <CardDescription className="mt-2">{challenge.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Prize</p>
                          <p className="text-xl font-bold">{parseFloat(challenge.prize).toLocaleString()} {challenge.prizeToken}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Starts</p>
                          <p className="text-xl font-bold">{format(parseISO(challenge.startTime), 'PP')}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Requirements:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {challenge.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityChallenges;

