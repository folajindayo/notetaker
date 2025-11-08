import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Wallet, TrendingUp, Send, Download, PlusCircle, CheckCircle, Clock, XCircle, DollarSign, Info, PieChart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';
import { PieChart as RechartsP ieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface TreasuryBalance {
  total: string; // in ETH
  tokens: {
    symbol: string;
    balance: string;
    valueInETH: string;
  }[];
}

interface TreasuryTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'grant' | 'reward';
  amount: string;
  token: string;
  from?: string;
  to?: string;
  description: string;
  status: 'pending' | 'completed' | 'rejected';
  proposalId?: string;
  timestamp: string;
  txHash?: string;
}

interface GrantRequest {
  id: string;
  title: string;
  description: string;
  requestedBy: string;
  amount: string;
  token: string;
  category: 'development' | 'marketing' | 'community' | 'operations' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  votes: {
    for: number;
    against: number;
  };
  submittedAt: string;
  decidedAt?: string;
}

interface BudgetAllocation {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
}

const mockTreasuryBalance: TreasuryBalance = {
  total: '125.5',
  tokens: [
    { symbol: 'ETH', balance: '125.5', valueInETH: '125.5' },
    { symbol: 'USDC', balance: '50000', valueInETH: '25.0' },
    { symbol: 'NOTE', balance: '1000000', valueInETH: '50.0' },
  ],
};

const mockTransactions: TreasuryTransaction[] = [
  {
    id: 'tx_001',
    type: 'deposit',
    amount: '10.0',
    token: 'ETH',
    from: '0xDonor1',
    description: 'Community donation',
    status: 'completed',
    timestamp: '2024-07-22T10:00:00Z',
    txHash: '0x1234...5678',
  },
  {
    id: 'tx_002',
    type: 'grant',
    amount: '5.0',
    token: 'ETH',
    to: '0xBuilder',
    description: 'Development grant for new features',
    status: 'completed',
    proposalId: 'prop_001',
    timestamp: '2024-07-21T14:30:00Z',
    txHash: '0xabcd...efgh',
  },
  {
    id: 'tx_003',
    type: 'withdrawal',
    amount: '2.5',
    token: 'ETH',
    to: '0xMarketing',
    description: 'Marketing campaign budget',
    status: 'pending',
    proposalId: 'prop_002',
    timestamp: '2024-07-22T16:00:00Z',
  },
  {
    id: 'tx_004',
    type: 'reward',
    amount: '0.5',
    token: 'ETH',
    to: '0xContributor',
    description: 'Community contribution reward',
    status: 'completed',
    timestamp: '2024-07-20T09:00:00Z',
    txHash: '0x9876...5432',
  },
];

const mockGrantRequests: GrantRequest[] = [
  {
    id: 'grant_001',
    title: 'Mobile App Development',
    description: 'Funding request to build a native mobile app for iOS and Android.',
    requestedBy: '0xMobileDev',
    amount: '15.0',
    token: 'ETH',
    category: 'development',
    status: 'pending',
    votes: { for: 5000, against: 1000 },
    submittedAt: '2024-07-20T10:00:00Z',
  },
  {
    id: 'grant_002',
    title: 'Community Events Budget',
    description: 'Budget for organizing quarterly community meetups in major cities.',
    requestedBy: '0xEventOrganizer',
    amount: '8.0',
    token: 'ETH',
    category: 'community',
    status: 'approved',
    votes: { for: 8000, against: 500 },
    submittedAt: '2024-07-15T14:00:00Z',
    decidedAt: '2024-07-18T10:00:00Z',
  },
  {
    id: 'grant_003',
    title: 'Social Media Marketing Campaign',
    description: 'Three-month marketing campaign across Twitter, Discord, and YouTube.',
    requestedBy: '0xMarketer',
    amount: '10.0',
    token: 'ETH',
    category: 'marketing',
    status: 'disbursed',
    votes: { for: 7500, against: 2000 },
    submittedAt: '2024-07-10T09:00:00Z',
    decidedAt: '2024-07-14T15:00:00Z',
  },
  {
    id: 'grant_004',
    title: 'Security Audit Funding',
    description: 'Comprehensive smart contract security audit by leading firm.',
    requestedBy: '0xSecurityTeam',
    amount: '20.0',
    token: 'ETH',
    category: 'operations',
    status: 'rejected',
    votes: { for: 3000, against: 6000 },
    submittedAt: '2024-07-05T11:00:00Z',
    decidedAt: '2024-07-09T16:00:00Z',
  },
];

const mockBudgetAllocations: BudgetAllocation[] = [
  { category: 'Development', allocated: 50, spent: 35, remaining: 15 },
  { category: 'Marketing', allocated: 25, spent: 18, remaining: 7 },
  { category: 'Community', allocated: 15, spent: 8, remaining: 7 },
  { category: 'Operations', allocated: 10, spent: 6, remaining: 4 },
];

const mockHistoricalData = [
  { month: 'Jan', balance: 80 },
  { month: 'Feb', balance: 95 },
  { month: 'Mar', balance: 110 },
  { month: 'Apr', balance: 105 },
  { month: 'May', balance: 120 },
  { month: 'Jun', balance: 115 },
  { month: 'Jul', balance: 125.5 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const CommunityTreasury: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<TreasuryBalance>(mockTreasuryBalance);
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>(mockTransactions);
  const [grantRequests, setGrantRequests] = useState<GrantRequest[]>(mockGrantRequests);
  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[]>(mockBudgetAllocations);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [newGrantRequest, setNewGrantRequest] = useState<Partial<GrantRequest>>({
    title: '',
    description: '',
    amount: '',
    token: 'ETH',
    category: 'development',
  });
  const [isTreasurer, setIsTreasurer] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchTreasuryData();
      checkTreasurerRole(address);
    }
  }, [address, isConnected]);

  const fetchTreasuryData = async () => {
    // In a real application, this would involve:
    // 1. Reading treasury smart contract balance
    // 2. Fetching transaction history from blockchain
    // 3. Loading grant requests and their voting status
    // 4. Calculating budget allocations
    console.log('Fetching treasury data...');
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const checkTreasurerRole = async (userAddress: string) => {
    // Check if user has treasurer/admin role
    console.log(`Checking treasurer role for ${userAddress}...`);
    setIsTreasurer(Math.random() > 0.7); // Mock logic
  };

  const handleSubmitGrantRequest = async () => {
    if (!newGrantRequest.title || !newGrantRequest.description || !newGrantRequest.amount) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet to submit a grant request.');
      return;
    }

    const grantToSubmit: GrantRequest = {
      id: `grant_${Date.now()}`,
      title: newGrantRequest.title!,
      description: newGrantRequest.description!,
      requestedBy: address!,
      amount: newGrantRequest.amount!,
      token: newGrantRequest.token!,
      category: newGrantRequest.category as GrantRequest['category'],
      status: 'pending',
      votes: { for: 0, against: 0 },
      submittedAt: new Date().toISOString(),
    };

    console.log('Submitting grant request:', grantToSubmit);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setGrantRequests(prev => [grantToSubmit, ...prev]);
    setIsGrantModalOpen(false);
    setNewGrantRequest({
      title: '',
      description: '',
      amount: '',
      token: 'ETH',
      category: 'development',
    });
    alert('Grant request submitted successfully! It will now go through community voting.');
  };

  const getStatusBadge = (status: TreasuryTransaction['status'] | GrantRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'completed':
      case 'approved':
      case 'disbursed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{status}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getTransactionTypeIcon = (type: TreasuryTransaction['type']) => {
    switch (type) {
      case 'deposit': return <Download className="h-4 w-4 text-green-600" />;
      case 'withdrawal': return <Send className="h-4 w-4 text-red-600" />;
      case 'grant': return <DollarSign className="h-4 w-4 text-blue-600" />;
      case 'reward': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      default: return <Wallet className="h-4 w-4" />;
    }
  };

  const pieData = budgetAllocations.map(item => ({
    name: item.category,
    value: item.spent,
  }));

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to view treasury details and submit grant requests.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Wallet className="h-8 w-8 mr-3 text-primary" /> Community Treasury
          </h1>
          <p className="text-muted-foreground mt-1">
            Transparent management of community funds
          </p>
        </div>
        <Button onClick={() => setIsGrantModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Request Grant
        </Button>
      </div>

      {/* Treasury Balance */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Total Treasury Value</CardTitle>
            <CardDescription>Across all tokens and assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{balance.total} ETH</div>
            <p className="text-sm text-muted-foreground mt-2">
              ≈ ${(parseFloat(balance.total) * 2500).toLocaleString()} USD
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Grants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{grantRequests.filter(g => g.status === 'approved' || g.status === 'disbursed').length}</div>
            <p className="text-sm text-muted-foreground mt-2">Currently funded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{grantRequests.filter(g => g.status === 'pending').length}</div>
            <p className="text-sm text-muted-foreground mt-2">Awaiting vote</p>
          </CardContent>
        </Card>
      </div>

      {/* Token Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Token Holdings</CardTitle>
          <CardDescription>Breakdown of treasury assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {balance.tokens.map((token) => (
              <div key={token.symbol} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{token.symbol}</span>
                  <Badge variant="outline">{token.valueInETH} ETH</Badge>
                </div>
                <p className="text-2xl font-bold">{parseFloat(token.balance).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((parseFloat(token.valueInETH) / parseFloat(balance.total)) * 100).toFixed(1)}% of treasury
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="grants">Grant Requests</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Treasury Balance History</CardTitle>
              <CardDescription>7-month trend</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#8884d8" strokeWidth={2} name="Balance (ETH)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Budget allocation breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsP ieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsP ieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest treasury transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-3">
                        {getTransactionTypeIcon(tx.type)}
                        <div>
                          <p className="text-sm font-medium capitalize">{tx.type}</p>
                          <p className="text-xs text-muted-foreground">{tx.description.slice(0, 30)}...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{tx.amount} {tx.token}</p>
                        {getStatusBadge(tx.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-6">
          {transactions.map((tx) => (
            <Card key={tx.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTransactionTypeIcon(tx.type)}
                    <div>
                      <CardTitle className="text-lg capitalize">{tx.type}</CardTitle>
                      <CardDescription>{tx.description}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(tx.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-bold">{tx.amount} {tx.token}</p>
                  </div>
                  {tx.from && (
                    <div>
                      <p className="text-muted-foreground">From</p>
                      <p className="font-medium">{tx.from.slice(0, 10)}...</p>
                    </div>
                  )}
                  {tx.to && (
                    <div>
                      <p className="text-muted-foreground">To</p>
                      <p className="font-medium">{tx.to.slice(0, 10)}...</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{format(parseISO(tx.timestamp), 'PP')}</p>
                  </div>
                  {tx.txHash && (
                    <div className="col-span-2 md:col-span-4">
                      <p className="text-muted-foreground">Transaction Hash</p>
                      <p className="font-mono text-xs">{tx.txHash}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="grants" className="space-y-4 mt-6">
          {grantRequests.map((grant) => {
            const totalVotes = grant.votes.for + grant.votes.against;
            const forPercent = totalVotes > 0 ? (grant.votes.for / totalVotes) * 100 : 0;
            
            return (
              <Card key={grant.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(grant.status)}
                        <Badge variant="outline" className="capitalize">{grant.category}</Badge>
                      </div>
                      <CardTitle className="text-xl">{grant.title}</CardTitle>
                      <CardDescription>{grant.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{grant.amount} {grant.token}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Requested by: {grant.requestedBy.slice(0, 10)}...</span>
                    <span>•</span>
                    <span>{format(parseISO(grant.submittedAt), 'PPP')}</span>
                  </div>
                  {grant.status === 'pending' && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-green-600">For: {forPercent.toFixed(1)}%</span>
                        <span className="text-red-600">Against: {(100 - forPercent).toFixed(1)}%</span>
                      </div>
                      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-green-500"
                          style={{ width: `${forPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{grant.votes.for.toLocaleString()} votes</span>
                        <span>{grant.votes.against.toLocaleString()} votes</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="budget" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocations</CardTitle>
              <CardDescription>Spending limits by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetAllocations.map((budget) => {
                  const spentPercent = (budget.spent / budget.allocated) * 100;
                  
                  return (
                    <div key={budget.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{budget.category}</span>
                        <span className="text-sm text-muted-foreground">
                          {budget.spent} / {budget.allocated} ETH
                        </span>
                      </div>
                      <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`absolute h-full ${
                            spentPercent > 90 ? 'bg-red-500' : spentPercent > 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${spentPercent}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium">{spentPercent.toFixed(0)}% spent</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {budget.remaining} ETH remaining
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Grant Request Modal */}
      <Dialog open={isGrantModalOpen} onOpenChange={setIsGrantModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Grant Request</DialogTitle>
            <DialogDescription>
              Request funding from the community treasury for your project or initiative.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                value={newGrantRequest.title}
                onChange={(e) => setNewGrantRequest(prev => ({ ...prev, title: e.target.value }))}
                className="col-span-3"
                placeholder="Brief title for your grant"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={newGrantRequest.description}
                onChange={(e) => setNewGrantRequest(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                rows={5}
                placeholder="Detailed description of your project and how funds will be used"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.1"
                value={newGrantRequest.amount}
                onChange={(e) => setNewGrantRequest(prev => ({ ...prev, amount: e.target.value }))}
                className="col-span-2"
                placeholder="0.0"
              />
              <Select
                value={newGrantRequest.token}
                onValueChange={(value) => setNewGrantRequest(prev => ({ ...prev, token: value }))}
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select
                value={newGrantRequest.category}
                onValueChange={(value: GrantRequest['category']) => setNewGrantRequest(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitGrantRequest}>Submit Grant Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityTreasury;

