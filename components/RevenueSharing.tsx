import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DollarSign, TrendingUp, Users, Percent, PlusCircle, Info, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface RevenueShare {
  id: string;
  recipient: string;
  recipientUsername?: string;
  recipientAvatar?: string;
  percentage: number;
  amount: string;
  token: string;
  status: 'active' | 'pending' | 'paused';
  createdAt: string;
}

interface RevenueDistribution {
  id: string;
  contentId: string;
  contentTitle: string;
  totalRevenue: string;
  token: string;
  distributedAt: string;
  shares: RevenueShare[];
}

interface RevenueStats {
  totalEarned: string;
  totalDistributed: string;
  activeShares: number;
  pendingPayouts: string;
}

const mockRevenueShares: RevenueShare[] = [
  {
    id: 'share_001',
    recipient: '0xCollaborator1',
    recipientUsername: 'Collaborator1',
    recipientAvatar: 'https://picsum.photos/seed/collab1/100/100',
    percentage: 30,
    amount: '0.15',
    token: 'ETH',
    status: 'active',
    createdAt: '2024-07-15T10:00:00Z',
  },
  {
    id: 'share_002',
    recipient: '0xCollaborator2',
    recipientUsername: 'Collaborator2',
    percentage: 20,
    amount: '0.10',
    token: 'ETH',
    status: 'active',
    createdAt: '2024-07-10T14:30:00Z',
  },
];

const mockDistributions: RevenueDistribution[] = [
  {
    id: 'dist_001',
    contentId: 'content_123',
    contentTitle: 'Building on Base Guide',
    totalRevenue: '0.5',
    token: 'ETH',
    distributedAt: '2024-07-22T10:00:00Z',
    shares: [
      { id: 's1', recipient: '0xYou', percentage: 50, amount: '0.25', token: 'ETH', status: 'active', createdAt: '2024-07-22T10:00:00Z' },
      { id: 's2', recipient: '0xCollaborator1', recipientUsername: 'Collaborator1', percentage: 30, amount: '0.15', token: 'ETH', status: 'active', createdAt: '2024-07-22T10:00:00Z' },
      { id: 's3', recipient: '0xCollaborator2', recipientUsername: 'Collaborator2', percentage: 20, amount: '0.10', token: 'ETH', status: 'active', createdAt: '2024-07-22T10:00:00Z' },
    ],
  },
];

const RevenueSharing: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [revenueShares, setRevenueShares] = useState<RevenueShare[]>(mockRevenueShares);
  const [distributions, setDistributions] = useState<RevenueDistribution[]>(mockDistributions);
  const [stats, setStats] = useState<RevenueStats>({
    totalEarned: '2.5',
    totalDistributed: '1.8',
    activeShares: 2,
    pendingPayouts: '0.3',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newShare, setNewShare] = useState({
    recipient: '',
    percentage: '',
    token: 'ETH',
  });
  const [totalPercentage, setTotalPercentage] = useState(50);

  useEffect(() => {
    if (isConnected && address) {
      fetchRevenueData(address);
    }
  }, [address, isConnected]);

  const fetchRevenueData = async (userAddress: string) => {
    // In a real application, this would fetch from smart contracts
    console.log(`Fetching revenue data for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Calculate total percentage
    const total = revenueShares.reduce((sum, share) => sum + share.percentage, 0);
    setTotalPercentage(total);
  };

  const handleAddShare = async () => {
    if (!newShare.recipient || !newShare.percentage) {
      alert('Please fill in all fields.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet.');
      return;
    }

    const percentage = parseFloat(newShare.percentage);
    if (totalPercentage + percentage > 100) {
      alert('Total percentage cannot exceed 100%.');
      return;
    }

    console.log('Adding revenue share:', newShare);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const share: RevenueShare = {
      id: `share_${Date.now()}`,
      recipient: newShare.recipient,
      percentage,
      amount: '0',
      token: newShare.token,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setRevenueShares(prev => [...prev, share]);
    setTotalPercentage(prev => prev + percentage);
    setIsCreateModalOpen(false);
    setNewShare({ recipient: '', percentage: '', token: 'ETH' });
    alert('Revenue share added successfully!');
  };

  const handleRemoveShare = async (shareId: string) => {
    const share = revenueShares.find(s => s.id === shareId);
    if (!share) return;

    if (confirm(`Remove revenue share for ${share.recipient.slice(0, 10)}...?`)) {
      setRevenueShares(prev => prev.filter(s => s.id !== shareId));
      setTotalPercentage(prev => prev - share.percentage);
      alert('Revenue share removed.');
    }
  };

  const handleDistribute = async (distributionId: string) => {
    console.log(`Distributing revenue for ${distributionId}...`);
    // In a real app: call smart contract to distribute
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Revenue distributed successfully!');
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to manage revenue sharing.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <DollarSign className="h-8 w-8 mr-3 text-primary" /> Revenue Sharing
          </h1>
          <p className="text-muted-foreground mt-1">
            Share revenue with collaborators and contributors
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Share
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.totalEarned} ETH</div>
            <p className="text-xs text-muted-foreground mt-1">All-time revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distributed</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalDistributed} ETH</div>
            <p className="text-xs text-muted-foreground mt-1">Shared with others</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shares</CardTitle>
            <Percent className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeShares}</div>
            <p className="text-xs text-muted-foreground mt-1">Revenue shares</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.pendingPayouts} ETH</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting distribution</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Share Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Share Configuration</CardTitle>
          <CardDescription>Manage how revenue is distributed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Total Allocated</Label>
                <span className="text-sm font-medium">
                  {totalPercentage}% / 100%
                </span>
              </div>
              <Progress value={totalPercentage} className="mb-2" />
              {totalPercentage < 100 && (
                <p className="text-xs text-muted-foreground">
                  You keep {100 - totalPercentage}% of revenue
                </p>
              )}
              {totalPercentage === 100 && (
                <Alert className="bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-300">
                    All revenue is allocated
                  </AlertDescription>
                </Alert>
              )}
              {totalPercentage > 100 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Total percentage exceeds 100%. Please adjust shares.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Separator />
            <div className="space-y-3">
              {revenueShares.map(share => (
                <div key={share.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={share.recipientAvatar} />
                      <AvatarFallback>
                        {share.recipientUsername?.[0] || share.recipient.slice(2, 4).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {share.recipientUsername || share.recipient.slice(0, 10) + '...'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {share.percentage}% of revenue
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={share.status === 'active' ? 'default' : 'secondary'}>
                      {share.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveShare(share.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              {revenueShares.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No revenue shares configured yet.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution History */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution History</CardTitle>
          <CardDescription>Past revenue distributions</CardDescription>
        </CardHeader>
        <CardContent>
          {distributions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No distributions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {distributions.map(dist => (
                <Card key={dist.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{dist.contentTitle}</CardTitle>
                        <CardDescription>
                          {format(parseISO(dist.distributedAt), 'PPp')}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{dist.totalRevenue} {dist.token}</p>
                        <p className="text-sm text-muted-foreground">Total distributed</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {dist.shares.map(share => (
                        <div key={share.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {share.recipientUsername?.[0] || share.recipient.slice(2, 4).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {share.recipientUsername || share.recipient.slice(0, 10) + '...'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">{share.amount} {share.token}</span>
                            <span className="text-xs text-muted-foreground ml-2">({share.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Share Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Revenue Share</DialogTitle>
            <DialogDescription>Share revenue with a collaborator or contributor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address *</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={newShare.recipient}
                onChange={(e) => setNewShare(prev => ({ ...prev, recipient: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage *</Label>
              <Input
                id="percentage"
                type="number"
                step="0.1"
                min="0"
                max={100 - totalPercentage}
                placeholder="0.0"
                value={newShare.percentage}
                onChange={(e) => setNewShare(prev => ({ ...prev, percentage: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Available: {100 - totalPercentage}%
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Token</Label>
              <Select
                value={newShare.token}
                onValueChange={(value) => setNewShare(prev => ({ ...prev, token: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="NOTE">NOTE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {totalPercentage + parseFloat(newShare.percentage || '0') > 100 && (
              <Alert variant="destructive">
                <AlertDescription>
                  Total percentage will exceed 100%. Please adjust.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleAddShare} disabled={totalPercentage + parseFloat(newShare.percentage || '0') > 100}>
              Add Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RevenueSharing;

