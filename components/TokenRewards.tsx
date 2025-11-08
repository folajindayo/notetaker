import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Gift, Zap, Clock, CheckCircle, Users, TrendingUp, Info, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';

interface RewardCampaign {
  id: string;
  name: string;
  description: string;
  token: string;
  totalReward: string;
  distributed: string;
  participants: number;
  maxParticipants?: number;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'ended';
  requirements: string[];
  rewardPerUser: string;
}

interface Airdrop {
  id: string;
  name: string;
  token: string;
  amount: string;
  recipients: number;
  status: 'scheduled' | 'distributing' | 'completed';
  scheduledAt: string;
  completedAt?: string;
}

interface UserReward {
  id: string;
  campaignId: string;
  campaignName: string;
  token: string;
  amount: string;
  claimed: boolean;
  claimedAt?: string;
  earnedAt: string;
}

const mockCampaigns: RewardCampaign[] = [
  {
    id: 'campaign_001',
    name: 'Early Adopter Rewards',
    description: 'Rewards for early users who joined in the first month',
    token: 'NOTE',
    totalReward: '100000',
    distributed: '75000',
    participants: 150,
    maxParticipants: 200,
    startTime: '2024-07-01T00:00:00Z',
    endTime: '2024-07-31T23:59:59Z',
    status: 'active',
    requirements: ['Joined before July 31', 'Active for 7+ days'],
    rewardPerUser: '500',
  },
  {
    id: 'campaign_002',
    name: 'Content Creator Bonus',
    description: 'Extra rewards for creators who post quality content',
    token: 'NOTE',
    totalReward: '50000',
    distributed: '30000',
    participants: 60,
    startTime: '2024-07-15T00:00:00Z',
    endTime: '2024-08-15T23:59:59Z',
    status: 'active',
    requirements: ['Posted 10+ notes', 'Received 100+ likes'],
    rewardPerUser: '500',
  },
];

const mockAirdrops: Airdrop[] = [
  {
    id: 'airdrop_001',
    name: 'Community Airdrop #1',
    token: 'NOTE',
    amount: '1000',
    recipients: 500,
    status: 'completed',
    scheduledAt: '2024-07-20T10:00:00Z',
    completedAt: '2024-07-20T11:30:00Z',
  },
  {
    id: 'airdrop_002',
    name: 'Governance Token Airdrop',
    token: 'GOV',
    amount: '500',
    recipients: 200,
    status: 'distributing',
    scheduledAt: '2024-07-25T12:00:00Z',
  },
];

const mockUserRewards: UserReward[] = [
  {
    id: 'reward_001',
    campaignId: 'campaign_001',
    campaignName: 'Early Adopter Rewards',
    token: 'NOTE',
    amount: '500',
    claimed: true,
    claimedAt: '2024-07-22T10:00:00Z',
    earnedAt: '2024-07-20T14:30:00Z',
  },
  {
    id: 'reward_002',
    campaignId: 'campaign_002',
    campaignName: 'Content Creator Bonus',
    token: 'NOTE',
    amount: '500',
    claimed: false,
    earnedAt: '2024-07-21T09:00:00Z',
  },
];

const TokenRewards: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [campaigns, setCampaigns] = useState<RewardCampaign[]>(mockCampaigns);
  const [airdrops, setAirdrops] = useState<Airdrop[]>(mockAirdrops);
  const [userRewards, setUserRewards] = useState<UserReward[]>(mockUserRewards);
  const [totalUnclaimed, setTotalUnclaimed] = useState('500');
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchRewardData(address);
    }
  }, [address, isConnected]);

  const fetchRewardData = async (userAddress: string) => {
    // In a real application, this would fetch from smart contracts
    console.log(`Fetching reward data for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const unclaimed = userRewards
      .filter(r => !r.claimed)
      .reduce((sum, r) => sum + parseFloat(r.amount), 0);
    setTotalUnclaimed(unclaimed.toString());
  };

  const handleClaimReward = async (rewardId: string) => {
    if (!isConnected) {
      alert('Please connect your wallet to claim rewards.');
      return;
    }

    setIsClaiming(true);
    const reward = userRewards.find(r => r.id === rewardId);
    console.log(`Claiming reward ${rewardId}: ${reward?.amount} ${reward?.token}...`);

    try {
      // In a real application, this would call the claim function on smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      setUserRewards(prev => prev.map(r => 
        r.id === rewardId 
          ? { ...r, claimed: true, claimedAt: new Date().toISOString() }
          : r
      ));

      const newUnclaimed = userRewards
        .filter(r => !r.claimed && r.id !== rewardId)
        .reduce((sum, r) => sum + parseFloat(r.amount), 0);
      setTotalUnclaimed(newUnclaimed.toString());

      alert(`Successfully claimed ${reward?.amount} ${reward?.token}!`);
    } catch (error) {
      console.error('Claim failed:', error);
      alert('Failed to claim reward. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleClaimAll = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to claim rewards.');
      return;
    }

    const unclaimedRewards = userRewards.filter(r => !r.claimed);
    if (unclaimedRewards.length === 0) {
      alert('No unclaimed rewards available.');
      return;
    }

    setIsClaiming(true);
    console.log(`Claiming all ${unclaimedRewards.length} rewards...`);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      setUserRewards(prev => prev.map(r => 
        !r.claimed 
          ? { ...r, claimed: true, claimedAt: new Date().toISOString() }
          : r
      ));
      setTotalUnclaimed('0');

      alert('All rewards claimed successfully!');
    } catch (error) {
      console.error('Claim all failed:', error);
      alert('Failed to claim rewards. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  const getStatusBadge = (status: RewardCampaign['status'] | Airdrop['status']) => {
    switch (status) {
      case 'active':
      case 'distributing':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case 'upcoming':
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Upcoming</Badge>;
      case 'ended':
      case 'completed':
        return <Badge variant="secondary">Ended</Badge>;
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to view and claim token rewards.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Gift className="h-8 w-8 mr-3 text-primary" /> Token Rewards
        </h1>
        <p className="text-muted-foreground mt-1">
          Earn and claim token rewards from campaigns and airdrops
        </p>
      </div>

      {/* Unclaimed Rewards Summary */}
      {parseFloat(totalUnclaimed) > 0 && (
        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <CardHeader>
            <CardTitle className="text-white">Unclaimed Rewards</CardTitle>
            <CardDescription className="text-white/80">
              You have rewards waiting to be claimed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">{totalUnclaimed} tokens</div>
            <Button
              variant="secondary"
              onClick={handleClaimAll}
              disabled={isClaiming}
              className="w-full"
            >
              {isClaiming ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Claiming...
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4 mr-2" />
                  Claim All Rewards
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList>
          <TabsTrigger value="campaigns">Reward Campaigns ({campaigns.length})</TabsTrigger>
          <TabsTrigger value="rewards">My Rewards ({userRewards.length})</TabsTrigger>
          <TabsTrigger value="airdrops">Airdrops ({airdrops.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4 mt-6">
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Gift className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active reward campaigns.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {campaigns.map(campaign => {
                const progress = (parseFloat(campaign.distributed) / parseFloat(campaign.totalReward)) * 100;
                const participantProgress = campaign.maxParticipants 
                  ? (campaign.participants / campaign.maxParticipants) * 100 
                  : 0;

                return (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(campaign.status)}
                            <Badge variant="outline">{campaign.token}</Badge>
                          </div>
                          <CardTitle className="text-xl">{campaign.name}</CardTitle>
                          <CardDescription className="mt-2">{campaign.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Reward</p>
                          <p className="text-2xl font-bold">{parseFloat(campaign.totalReward).toLocaleString()} {campaign.token}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Reward Per User</p>
                          <p className="text-2xl font-bold">{campaign.rewardPerUser} {campaign.token}</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Distribution Progress</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} />
                        <p className="text-xs text-muted-foreground mt-1">
                          {parseFloat(campaign.distributed).toLocaleString()} / {parseFloat(campaign.totalReward).toLocaleString()} {campaign.token}
                        </p>
                      </div>
                      {campaign.maxParticipants && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Participants</span>
                            <span className="font-medium">{campaign.participants} / {campaign.maxParticipants}</span>
                          </div>
                          <Progress value={participantProgress} />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium mb-2">Requirements:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {campaign.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Ends {format(parseISO(campaign.endTime), 'PP')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4 mt-6">
          {userRewards.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Gift className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No rewards earned yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {userRewards.map(reward => (
                <Card key={reward.id} className={reward.claimed ? 'opacity-75' : ''}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${reward.claimed ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
                        {reward.claimed ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <Gift className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{reward.campaignName}</p>
                        <p className="text-sm text-muted-foreground">
                          Earned {format(parseISO(reward.earnedAt), 'PP')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{reward.amount} {reward.token}</p>
                        {reward.claimed ? (
                          <Badge className="bg-green-500 mt-1">
                            <CheckCircle className="h-3 w-3 mr-1" /> Claimed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="mt-1">Unclaimed</Badge>
                        )}
                      </div>
                      {!reward.claimed && (
                        <Button
                          onClick={() => handleClaimReward(reward.id)}
                          disabled={isClaiming}
                        >
                          <Gift className="h-4 w-4 mr-2" /> Claim
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="airdrops" className="space-y-4 mt-6">
          {airdrops.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Zap className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No airdrops available.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {airdrops.map(airdrop => (
                <Card key={airdrop.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(airdrop.status)}
                          <Badge variant="outline">{airdrop.token}</Badge>
                        </div>
                        <CardTitle className="text-xl">{airdrop.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="text-lg font-bold">{airdrop.amount} {airdrop.token}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Recipients</p>
                        <p className="text-lg font-bold">{airdrop.recipients.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="text-lg font-bold capitalize">{airdrop.status}</p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      {airdrop.completedAt ? (
                        <span>Completed {format(parseISO(airdrop.completedAt), 'PPp')}</span>
                      ) : (
                        <span>Scheduled for {format(parseISO(airdrop.scheduledAt), 'PPp')}</span>
                      )}
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

export default TokenRewards;

