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
import { Lock, Unlock, TrendingUp, Clock, DollarSign, Zap, Info, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO, differenceInDays } from 'date-fns';

interface StakingPool {
  id: string;
  name: string;
  token: string;
  apy: number; // Annual Percentage Yield
  minStake: string;
  maxStake: string;
  lockPeriod: number; // Days
  totalStaked: string;
  stakers: number;
  status: 'active' | 'full' | 'closed';
}

interface UserStake {
  id: string;
  poolId: string;
  poolName: string;
  amount: string;
  stakedAt: string;
  unlockDate: string;
  rewardsEarned: string;
  apy: number;
  status: 'active' | 'unlocking' | 'unlocked';
}

interface RewardHistory {
  id: string;
  poolId: string;
  amount: string;
  timestamp: string;
  type: 'claim' | 'compound';
}

const mockPools: StakingPool[] = [
  {
    id: 'pool_001',
    name: 'NOTE Token Staking',
    token: 'NOTE',
    apy: 12.5,
    minStake: '100',
    maxStake: '100000',
    lockPeriod: 30,
    totalStaked: '5000000',
    stakers: 1250,
    status: 'active',
  },
  {
    id: 'pool_002',
    name: 'Long-Term NOTE Staking',
    token: 'NOTE',
    apy: 25.0,
    minStake: '1000',
    maxStake: '500000',
    lockPeriod: 90,
    totalStaked: '2000000',
    stakers: 450,
    status: 'active',
  },
  {
    id: 'pool_003',
    name: 'ETH Staking Pool',
    token: 'ETH',
    apy: 8.5,
    minStake: '0.1',
    maxStake: '100',
    lockPeriod: 60,
    totalStaked: '150',
    stakers: 320,
    status: 'active',
  },
  {
    id: 'pool_004',
    name: 'VIP Staking Pool',
    token: 'NOTE',
    apy: 50.0,
    minStake: '10000',
    maxStake: '1000000',
    lockPeriod: 180,
    totalStaked: '10000000',
    stakers: 85,
    status: 'full',
  },
];

const mockUserStakes: UserStake[] = [
  {
    id: 'stake_001',
    poolId: 'pool_001',
    poolName: 'NOTE Token Staking',
    amount: '5000',
    stakedAt: '2024-06-15T10:00:00Z',
    unlockDate: '2024-07-15T10:00:00Z',
    rewardsEarned: '51.37',
    apy: 12.5,
    status: 'active',
  },
  {
    id: 'stake_002',
    poolId: 'pool_002',
    poolName: 'Long-Term NOTE Staking',
    amount: '10000',
    stakedAt: '2024-05-01T09:00:00Z',
    unlockDate: '2024-07-30T09:00:00Z',
    rewardsEarned: '512.33',
    apy: 25.0,
    status: 'active',
  },
];

const mockRewardHistory: RewardHistory[] = [
  {
    id: 'reward_001',
    poolId: 'pool_001',
    amount: '12.5',
    timestamp: '2024-07-20T10:00:00Z',
    type: 'claim',
  },
  {
    id: 'reward_002',
    poolId: 'pool_002',
    amount: '125.0',
    timestamp: '2024-07-15T14:30:00Z',
    type: 'compound',
  },
];

const StakingRewards: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [pools, setPools] = useState<StakingPool[]>(mockPools);
  const [userStakes, setUserStakes] = useState<UserStake[]>(mockUserStakes);
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>(mockRewardHistory);
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [totalRewards, setTotalRewards] = useState('563.70');
  const [totalStaked, setTotalStaked] = useState('15000');

  useEffect(() => {
    if (isConnected && address) {
      fetchUserStakingData(address);
    }
  }, [address, isConnected]);

  const fetchUserStakingData = async (userAddress: string) => {
    // In a real application, this would involve:
    // 1. Reading staking contract to get user's stakes
    // 2. Calculating accrued rewards
    // 3. Checking unlock dates
    console.log(`Fetching staking data for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount) {
      alert('Please select a pool and enter an amount.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet to stake tokens.');
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (amount < parseFloat(selectedPool.minStake)) {
      alert(`Minimum stake amount is ${selectedPool.minStake} ${selectedPool.token}`);
      return;
    }
    if (amount > parseFloat(selectedPool.maxStake)) {
      alert(`Maximum stake amount is ${selectedPool.maxStake} ${selectedPool.token}`);
      return;
    }

    setIsStaking(true);
    console.log(`Staking ${stakeAmount} ${selectedPool.token} in ${selectedPool.name}...`);

    try {
      // In a real application, this would involve:
      // 1. Approve token spending
      // 2. Call stake function on smart contract
      // 3. Wait for transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newStake: UserStake = {
        id: `stake_${Date.now()}`,
        poolId: selectedPool.id,
        poolName: selectedPool.name,
        amount: stakeAmount,
        stakedAt: new Date().toISOString(),
        unlockDate: new Date(Date.now() + selectedPool.lockPeriod * 24 * 60 * 60 * 1000).toISOString(),
        rewardsEarned: '0',
        apy: selectedPool.apy,
        status: 'active',
      };

      setUserStakes(prev => [newStake, ...prev]);
      setTotalStaked(prev => (parseFloat(prev) + amount).toFixed(2));
      setIsStakeModalOpen(false);
      setStakeAmount('');
      alert(`Successfully staked ${stakeAmount} ${selectedPool.token}!`);
    } catch (error) {
      console.error('Staking failed:', error);
      alert('Staking failed. Please try again.');
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async (stakeId: string) => {
    const stake = userStakes.find(s => s.id === stakeId);
    if (!stake) return;

    const unlockDate = parseISO(stake.unlockDate);
    const now = new Date();
    if (unlockDate > now) {
      alert(`This stake is locked until ${format(unlockDate, 'PP')}. You cannot unstake yet.`);
      return;
    }

    setIsUnstaking(true);
    console.log(`Unstaking ${stake.amount} ${stake.poolName}...`);

    try {
      // In a real application, this would call the unstake function
      await new Promise(resolve => setTimeout(resolve, 2000));

      setUserStakes(prev => prev.filter(s => s.id !== stakeId));
      setTotalStaked(prev => (parseFloat(prev) - parseFloat(stake.amount)).toFixed(2));
      alert(`Successfully unstaked ${stake.amount} tokens!`);
    } catch (error) {
      console.error('Unstaking failed:', error);
      alert('Unstaking failed. Please try again.');
    } finally {
      setIsUnstaking(false);
    }
  };

  const handleClaimRewards = async (stakeId: string) => {
    const stake = userStakes.find(s => s.id === stakeId);
    if (!stake) return;

    console.log(`Claiming rewards for stake ${stakeId}...`);
    // In a real app: call claimRewards function
    await new Promise(resolve => setTimeout(resolve, 2000));

    setUserStakes(prev => prev.map(s => 
      s.id === stakeId ? { ...s, rewardsEarned: '0' } : s
    ));
    alert(`Claimed ${stake.rewardsEarned} ${stake.poolName.split(' ')[0]} rewards!`);
  };

  const calculateEstimatedRewards = (amount: string, apy: number, days: number) => {
    const principal = parseFloat(amount);
    const dailyRate = apy / 365 / 100;
    const estimated = principal * dailyRate * days;
    return estimated.toFixed(2);
  };

  const getDaysRemaining = (unlockDate: string) => {
    const days = differenceInDays(parseISO(unlockDate), new Date());
    return days > 0 ? days : 0;
  };

  const getStatusBadge = (status: StakingPool['status'] | UserStake['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case 'full':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Full</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      case 'unlocking':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Unlocking</Badge>;
      case 'unlocked':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Unlocked</Badge>;
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to stake tokens and earn rewards.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Lock className="h-8 w-8 mr-3 text-primary" /> Staking & Rewards
        </h1>
        <p className="text-muted-foreground mt-1">
          Stake your tokens and earn passive rewards with flexible lock periods
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStaked}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all pools</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRewards}</div>
            <p className="text-xs text-muted-foreground mt-1">All-time earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stakes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStakes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently staking</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pools" className="w-full">
        <TabsList>
          <TabsTrigger value="pools">Staking Pools ({pools.length})</TabsTrigger>
          <TabsTrigger value="myStakes">My Stakes ({userStakes.length})</TabsTrigger>
          <TabsTrigger value="history">Reward History</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {pools.map(pool => (
              <Card key={pool.id} className={pool.status === 'full' ? 'opacity-75' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{pool.name}</CardTitle>
                      <CardDescription>{pool.token} Token</CardDescription>
                    </div>
                    {getStatusBadge(pool.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">APY</p>
                      <p className="text-2xl font-bold text-green-600">{pool.apy}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lock Period</p>
                      <p className="text-lg font-semibold">{pool.lockPeriod} days</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Min Stake:</span>
                      <span className="font-medium">{pool.minStake} {pool.token}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Stake:</span>
                      <span className="font-medium">{pool.maxStake} {pool.token}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Staked:</span>
                      <span className="font-medium">{parseFloat(pool.totalStaked).toLocaleString()} {pool.token}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stakers:</span>
                      <span className="font-medium">{pool.stakers.toLocaleString()}</span>
                    </div>
                  </div>
                  {stakeAmount && (
                    <Alert className="bg-blue-50 dark:bg-blue-950">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800 dark:text-blue-300">
                        Estimated rewards: {calculateEstimatedRewards(stakeAmount, pool.apy, pool.lockPeriod)} {pool.token}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedPool(pool);
                      setIsStakeModalOpen(true);
                    }}
                    disabled={pool.status === 'full' || pool.status === 'closed'}
                  >
                    <Lock className="h-4 w-4 mr-2" /> Stake Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="myStakes" className="space-y-4 mt-6">
          {userStakes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Lock className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active stakes. Start staking to earn rewards!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userStakes.map(stake => {
                const daysRemaining = getDaysRemaining(stake.unlockDate);
                const isUnlocked = daysRemaining === 0;

                return (
                  <Card key={stake.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{stake.poolName}</CardTitle>
                          <CardDescription>
                            Staked on {format(parseISO(stake.stakedAt), 'PPP')}
                          </CardDescription>
                        </div>
                        {getStatusBadge(isUnlocked ? 'unlocked' : stake.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Staked Amount</p>
                          <p className="text-xl font-bold">{stake.amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">APY</p>
                          <p className="text-xl font-bold text-green-600">{stake.apy}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Rewards Earned</p>
                          <p className="text-lg font-semibold text-primary">{stake.rewardsEarned}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {isUnlocked ? 'Unlocked' : 'Days Remaining'}
                          </p>
                          <p className="text-lg font-semibold">
                            {isUnlocked ? (
                              <CheckCircle className="h-5 w-5 text-green-600 inline" />
                            ) : (
                              daysRemaining
                            )}
                          </p>
                        </div>
                      </div>
                      {!isUnlocked && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Unlocks on {format(parseISO(stake.unlockDate), 'PPP')}
                          </p>
                          <Progress value={((stake.lockPeriod - daysRemaining) / stake.lockPeriod) * 100} />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      {parseFloat(stake.rewardsEarned) > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => handleClaimRewards(stake.id)}
                          className="flex-1"
                        >
                          <DollarSign className="h-4 w-4 mr-2" /> Claim Rewards
                        </Button>
                      )}
                      {isUnlocked && (
                        <Button
                          variant="destructive"
                          onClick={() => handleUnstake(stake.id)}
                          disabled={isUnstaking}
                          className="flex-1"
                        >
                          <Unlock className="h-4 w-4 mr-2" /> Unstake
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {rewardHistory.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <DollarSign className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reward history yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {rewardHistory.map(reward => (
                <Card key={reward.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        reward.type === 'claim' ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'
                      }`}>
                        {reward.type === 'claim' ? (
                          <DollarSign className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold capitalize">{reward.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(reward.timestamp), 'PPp')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">+{reward.amount}</p>
                      <p className="text-xs text-muted-foreground">tokens</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Stake Modal */}
      <Dialog open={isStakeModalOpen} onOpenChange={setIsStakeModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Stake Tokens</DialogTitle>
            <DialogDescription>
              {selectedPool && `Stake ${selectedPool.token} tokens in ${selectedPool.name}`}
            </DialogDescription>
          </DialogHeader>
          {selectedPool && (
            <>
              <div className="space-y-4 py-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">APY</span>
                    <span className="font-bold text-green-600">{selectedPool.apy}%</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Lock Period</span>
                    <span className="font-medium">{selectedPool.lockPeriod} days</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Min/Max</span>
                    <span className="font-medium">
                      {selectedPool.minStake} - {selectedPool.maxStake} {selectedPool.token}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stakeAmount">Amount to Stake</Label>
                  <Input
                    id="stakeAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.0"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Balance: 10000 {selectedPool.token}
                  </p>
                </div>
                {stakeAmount && parseFloat(stakeAmount) > 0 && (
                  <Alert className="bg-blue-50 dark:bg-blue-950">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-300">
                      Estimated rewards after {selectedPool.lockPeriod} days: {calculateEstimatedRewards(stakeAmount, selectedPool.apy, selectedPool.lockPeriod)} {selectedPool.token}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleStake} disabled={isStaking || !stakeAmount}>
                  {isStaking ? 'Staking...' : 'Stake Tokens'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StakingRewards;

