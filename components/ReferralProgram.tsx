import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Share2, Users, DollarSign, Gift, Copy, CheckCircle, TrendingUp, Award, Info, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { format, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: string;
  pendingRewards: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  nextTierReferrals: number;
}

interface Referral {
  id: string;
  address: string;
  username?: string;
  avatar?: string;
  joinedAt: string;
  status: 'active' | 'inactive';
  activityLevel: 'high' | 'medium' | 'low';
  rewardEarned: string;
}

interface RewardTier {
  name: string;
  requiredReferrals: number;
  rewardPerReferral: string;
  bonusPerks: string[];
  color: string;
}

interface Transaction {
  id: string;
  type: 'reward' | 'bonus' | 'withdrawal';
  amount: string;
  timestamp: string;
  referralId?: string;
  status: 'completed' | 'pending';
}

const rewardTiers: RewardTier[] = [
  {
    name: 'Bronze',
    requiredReferrals: 0,
    rewardPerReferral: '0.001 ETH',
    bonusPerks: ['Basic referral rewards'],
    color: 'from-amber-700 to-amber-900',
  },
  {
    name: 'Silver',
    requiredReferrals: 5,
    rewardPerReferral: '0.002 ETH',
    bonusPerks: ['2x rewards', '10% bonus on withdrawals'],
    color: 'from-gray-400 to-gray-600',
  },
  {
    name: 'Gold',
    requiredReferrals: 15,
    rewardPerReferral: '0.005 ETH',
    bonusPerks: ['5x rewards', '20% bonus', 'Exclusive badge'],
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    name: 'Platinum',
    requiredReferrals: 50,
    rewardPerReferral: '0.01 ETH',
    bonusPerks: ['10x rewards', '30% bonus', 'Priority support', 'Custom NFT'],
    color: 'from-cyan-400 to-cyan-600',
  },
  {
    name: 'Diamond',
    requiredReferrals: 100,
    rewardPerReferral: '0.02 ETH',
    bonusPerks: ['20x rewards', '50% bonus', 'VIP access', 'Revenue share', 'Legendary NFT'],
    color: 'from-blue-400 to-purple-600',
  },
];

const mockStats: ReferralStats = {
  totalReferrals: 23,
  activeReferrals: 18,
  totalEarned: '0.115',
  pendingRewards: '0.032',
  tier: 'gold',
  nextTierReferrals: 27,
};

const mockReferrals: Referral[] = [
  {
    id: 'ref_001',
    address: '0xAlice',
    username: 'Alice',
    avatar: 'https://picsum.photos/seed/alice/100/100',
    joinedAt: '2024-06-15T10:00:00Z',
    status: 'active',
    activityLevel: 'high',
    rewardEarned: '0.015',
  },
  {
    id: 'ref_002',
    address: '0xBob',
    username: 'Bob',
    joinedAt: '2024-06-20T14:30:00Z',
    status: 'active',
    activityLevel: 'medium',
    rewardEarned: '0.008',
  },
  {
    id: 'ref_003',
    address: '0xCharlie',
    joinedAt: '2024-07-01T09:00:00Z',
    status: 'inactive',
    activityLevel: 'low',
    rewardEarned: '0.002',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 'tx_001',
    type: 'reward',
    amount: '0.005',
    timestamp: '2024-07-22T10:00:00Z',
    referralId: 'ref_001',
    status: 'completed',
  },
  {
    id: 'tx_002',
    type: 'bonus',
    amount: '0.010',
    timestamp: '2024-07-20T15:30:00Z',
    status: 'completed',
  },
  {
    id: 'tx_003',
    type: 'withdrawal',
    amount: '0.050',
    timestamp: '2024-07-18T11:00:00Z',
    status: 'completed',
  },
];

const ReferralProgram: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [stats, setStats] = useState<ReferralStats>(mockStats);
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    if (address) {
      generateReferralLink(address);
    }
  }, [address]);

  const generateReferralLink = (userAddress: string) => {
    // In a real application, this would generate a unique referral code
    const referralCode = userAddress.slice(2, 10);
    const link = `https://noteboard.app/join?ref=${referralCode}`;
    setReferralLink(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = async () => {
    if (parseFloat(stats.pendingRewards) === 0) {
      alert('No rewards available to withdraw.');
      return;
    }

    setIsWithdrawing(true);
    console.log(`Withdrawing ${stats.pendingRewards} ETH...`);

    try {
      // In a real application, this would involve:
      // 1. Call smart contract to withdraw rewards
      // 2. Transfer tokens to user's wallet
      // 3. Update balances
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'withdrawal',
        amount: stats.pendingRewards,
        timestamp: new Date().toISOString(),
        status: 'completed',
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setStats(prev => ({
        ...prev,
        totalEarned: (parseFloat(prev.totalEarned) + parseFloat(prev.pendingRewards)).toFixed(3),
        pendingRewards: '0',
      }));

      alert('Withdrawal successful!');
    } catch (error) {
      console.error('Withdrawal failed:', error);
      alert('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getCurrentTier = () => {
    return rewardTiers.find(t => t.name.toLowerCase() === stats.tier);
  };

  const getNextTier = () => {
    const currentIndex = rewardTiers.findIndex(t => t.name.toLowerCase() === stats.tier);
    return currentIndex < rewardTiers.length - 1 ? rewardTiers[currentIndex + 1] : null;
  };

  const getActivityBadge = (level: Referral['activityLevel']) => {
    const colors = {
      high: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return <Badge className={colors[level]}>{level} activity</Badge>;
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'reward': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'bonus': return <Gift className="h-4 w-4 text-purple-600" />;
      case 'withdrawal': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNextTier = nextTier 
    ? ((stats.totalReferrals - (currentTier?.requiredReferrals || 0)) / (nextTier.requiredReferrals - (currentTier?.requiredReferrals || 0))) * 100
    : 100;

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to access the referral program and earn rewards.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Share2 className="h-8 w-8 mr-3 text-primary" /> Referral Program
        </h1>
        <p className="text-muted-foreground mt-1">
          Invite friends and earn crypto rewards for every active referral
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className={`bg-gradient-to-br ${currentTier?.color}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Current Tier</CardTitle>
            <Award className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{currentTier?.name}</div>
            <p className="text-xs text-white/80 mt-1">{currentTier?.rewardPerReferral} per referral</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.activeReferrals} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEarned} ETH</div>
            <p className="text-xs text-muted-foreground mt-1">All-time rewards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingRewards} ETH</div>
            <Button
              size="sm"
              className="mt-2 w-full"
              onClick={handleWithdraw}
              disabled={isWithdrawing || parseFloat(stats.pendingRewards) === 0}
            >
              {isWithdrawing ? 'Processing...' : 'Withdraw'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to earn rewards when people join using it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="font-mono" />
            <Button onClick={handleCopyLink} className="shrink-0">
              {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress to Next Tier */}
      {nextTier && (
        <Card>
          <CardHeader>
            <CardTitle>Progress to {nextTier.name} Tier</CardTitle>
            <CardDescription>
              {stats.nextTierReferrals - stats.totalReferrals} more referrals to unlock {nextTier.rewardPerReferral} per referral
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressToNextTier} className="mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{stats.totalReferrals} / {nextTier.requiredReferrals} referrals</span>
              <span>{progressToNextTier.toFixed(0)}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="referrals" className="w-full">
        <TabsList>
          <TabsTrigger value="referrals">My Referrals ({referrals.length})</TabsTrigger>
          <TabsTrigger value="tiers">Reward Tiers</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals" className="space-y-4 mt-6">
          {referrals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No referrals yet. Share your link to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {referrals.map(referral => (
                <Card key={referral.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={referral.avatar} />
                        <AvatarFallback>{referral.address.slice(2, 4).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {referral.username || referral.address.slice(0, 10) + '...'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Joined {format(parseISO(referral.joinedAt), 'PP')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getActivityBadge(referral.activityLevel)}
                      <Badge variant={referral.status === 'active' ? 'default' : 'secondary'}>
                        {referral.status}
                      </Badge>
                      <div className="text-right">
                        <p className="font-bold">{referral.rewardEarned} ETH</p>
                        <p className="text-xs text-muted-foreground">earned</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {rewardTiers.map((tier, index) => (
              <Card
                key={tier.name}
                className={`${tier.name.toLowerCase() === stats.tier ? 'border-2 border-primary' : ''}`}
              >
                <CardHeader className={`bg-gradient-to-br ${tier.color} text-white rounded-t-lg`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    {tier.name.toLowerCase() === stats.tier && (
                      <Badge className="bg-white text-primary">Current</Badge>
                    )}
                  </div>
                  <CardDescription className="text-white/90">
                    {tier.requiredReferrals} referrals required
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Reward per referral</p>
                      <p className="text-2xl font-bold">{tier.rewardPerReferral}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-semibold mb-2">Bonus Perks:</p>
                      <ul className="space-y-1">
                        {tier.bonusPerks.map((perk, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {transactions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <DollarSign className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No transactions yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {transactions.map(tx => (
                <Card key={tx.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(tx.type)}
                      <div>
                        <p className="font-semibold capitalize">{tx.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(tx.timestamp), 'PPp')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{tx.amount} ETH</p>
                      <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                        {tx.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Alert className="bg-blue-50 dark:bg-blue-950">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">How It Works</AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          Share your unique referral link with friends. When they sign up and become active users, you earn rewards based on your tier level. The more referrals you have, the higher your tier and rewards!
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ReferralProgram;

