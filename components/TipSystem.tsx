import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Gift, TrendingUp, Clock, DollarSign, Heart, Users, Info, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Tip {
  id: string;
  from: string;
  fromAvatar?: string;
  fromUsername?: string;
  to: string;
  toUsername?: string;
  amount: string;
  token: string;
  message?: string;
  timestamp: string;
  type: 'content' | 'profile' | 'comment';
  contentId?: string;
}

interface TipStats {
  totalReceived: string;
  totalSent: string;
  totalTips: number;
  topTippers: { address: string; amount: string; count: number }[];
  recentTips: Tip[];
}

const mockTips: Tip[] = [
  {
    id: 'tip_001',
    from: '0xAlice',
    fromAvatar: 'https://picsum.photos/seed/alice/100/100',
    fromUsername: 'Alice',
    to: '0xYou',
    amount: '0.05',
    token: 'ETH',
    message: 'Great content! Keep it up!',
    timestamp: '2024-07-22T16:30:00Z',
    type: 'content',
    contentId: 'note_123',
  },
  {
    id: 'tip_002',
    from: '0xYou',
    to: '0xBob',
    toUsername: 'Bob',
    amount: '0.02',
    token: 'USDC',
    message: 'Thanks for the help!',
    timestamp: '2024-07-22T14:15:00Z',
    type: 'profile',
  },
  {
    id: 'tip_003',
    from: '0xCharlie',
    fromUsername: 'Charlie',
    to: '0xYou',
    amount: '0.1',
    token: 'ETH',
    timestamp: '2024-07-21T10:00:00Z',
    type: 'content',
    contentId: 'note_456',
  },
];

const TipSystem: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [tips, setTips] = useState<Tip[]>(mockTips);
  const [stats, setStats] = useState<TipStats>({
    totalReceived: '0.15',
    totalSent: '0.02',
    totalTips: 3,
    topTippers: [
      { address: '0xAlice', amount: '0.05', count: 1 },
      { address: '0xCharlie', amount: '0.1', count: 1 },
    ],
    recentTips: mockTips,
  });
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [isTipping, setIsTipping] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [tipToken, setTipToken] = useState('ETH');
  const [tipMessage, setTipMessage] = useState('');
  const [tipRecipient, setTipRecipient] = useState('');
  const [quickAmounts] = useState(['0.001', '0.005', '0.01', '0.05', '0.1']);

  useEffect(() => {
    if (isConnected && address) {
      fetchTipData(address);
    }
  }, [address, isConnected]);

  const fetchTipData = async (userAddress: string) => {
    // In a real application, this would fetch tip history from blockchain
    console.log(`Fetching tip data for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleQuickTip = (amount: string) => {
    setTipAmount(amount);
    setIsTipModalOpen(true);
  };

  const handleSendTip = async () => {
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      alert('Please enter a valid tip amount.');
      return;
    }
    if (!tipRecipient) {
      alert('Please enter a recipient address.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet to send tips.');
      return;
    }

    setIsTipping(true);
    console.log(`Sending ${tipAmount} ${tipToken} tip to ${tipRecipient}...`);

    try {
      // In a real application, this would involve:
      // 1. Approve token spending (if not native currency)
      // 2. Call tip contract function
      // 3. Transfer tokens to recipient
      // 4. Emit tip event
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newTip: Tip = {
        id: `tip_${Date.now()}`,
        from: address!,
        to: tipRecipient,
        amount: tipAmount,
        token: tipToken,
        message: tipMessage,
        timestamp: new Date().toISOString(),
        type: 'content',
      };

      setTips(prev => [newTip, ...prev]);
      setStats(prev => ({
        ...prev,
        totalSent: (parseFloat(prev.totalSent) + parseFloat(tipAmount)).toFixed(3),
        totalTips: prev.totalTips + 1,
        recentTips: [newTip, ...prev.recentTips],
      }));

      setIsTipModalOpen(false);
      setTipAmount('');
      setTipMessage('');
      setTipRecipient('');
      alert(`Tip of ${tipAmount} ${tipToken} sent successfully!`);
    } catch (error) {
      console.error('Tip failed:', error);
      alert('Failed to send tip. Please try again.');
    } finally {
      setIsTipping(false);
    }
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to send and receive tips.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Gift className="h-8 w-8 mr-3 text-primary" /> Tip System
        </h1>
        <p className="text-muted-foreground mt-1">
          Support creators and show appreciation with crypto tips
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.totalReceived} ETH</div>
            <p className="text-xs text-muted-foreground mt-1">All-time tips received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalSent} ETH</div>
            <p className="text-xs text-muted-foreground mt-1">All-time tips sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tips</CardTitle>
            <Gift className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTips}</div>
            <p className="text-xs text-muted-foreground mt-1">Tips given and received</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tip Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Tip</CardTitle>
          <CardDescription>Send a quick tip to show appreciation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Recipient Address</Label>
              <Input
                placeholder="0x..."
                value={tipRecipient}
                onChange={(e) => setTipRecipient(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Quick Amounts</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {quickAmounts.map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTipAmount(amount);
                      setIsTipModalOpen(true);
                    }}
                  >
                    {amount} ETH
                  </Button>
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => setIsTipModalOpen(true)}
            >
              <Gift className="h-4 w-4 mr-2" /> Custom Tip
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="received" className="w-full">
        <TabsList>
          <TabsTrigger value="received">Received ({tips.filter(t => t.to === address).length})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({tips.filter(t => t.from === address).length})</TabsTrigger>
          <TabsTrigger value="all">All Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4 mt-6">
          {tips.filter(t => t.to === address).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Gift className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No tips received yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tips.filter(t => t.to === address).map(tip => (
                <Card key={tip.id} className="border-l-4 border-l-green-500">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={tip.fromAvatar} />
                        <AvatarFallback>{tip.fromUsername?.[0] || tip.from.slice(2, 4).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {tip.fromUsername || tip.from.slice(0, 10) + '...'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {tip.message || 'Sent you a tip'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(tip.timestamp), 'PPp')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">+{tip.amount}</p>
                      <p className="text-sm text-muted-foreground">{tip.token}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4 mt-6">
          {tips.filter(t => t.from === address).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Send className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No tips sent yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tips.filter(t => t.from === address).map(tip => (
                <Card key={tip.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{tip.toUsername?.[0] || tip.to.slice(2, 4).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          To: {tip.toUsername || tip.to.slice(0, 10) + '...'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {tip.message || 'Tip sent'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(tip.timestamp), 'PPp')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">-{tip.amount}</p>
                      <p className="text-sm text-muted-foreground">{tip.token}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="space-y-3">
            {tips.map(tip => {
              const isReceived = tip.to === address;
              return (
                <Card key={tip.id} className={isReceived ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-blue-500'}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={isReceived ? tip.fromAvatar : undefined} />
                        <AvatarFallback>
                          {isReceived 
                            ? (tip.fromUsername?.[0] || tip.from.slice(2, 4).toUpperCase())
                            : (tip.toUsername?.[0] || tip.to.slice(2, 4).toUpperCase())
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {isReceived ? 'From' : 'To'}: {isReceived 
                            ? (tip.fromUsername || tip.from.slice(0, 10) + '...')
                            : (tip.toUsername || tip.to.slice(0, 10) + '...')
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {tip.message || (isReceived ? 'Sent you a tip' : 'Tip sent')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(tip.timestamp), 'PPp')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${isReceived ? 'text-green-600' : 'text-blue-600'}`}>
                        {isReceived ? '+' : '-'}{tip.amount}
                      </p>
                      <p className="text-sm text-muted-foreground">{tip.token}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Top Tippers */}
      {stats.topTippers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Tippers</CardTitle>
            <CardDescription>Most generous community members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topTippers.map((tipper, index) => (
                <div key={tipper.address} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{tipper.address.slice(0, 10)}...</p>
                      <p className="text-xs text-muted-foreground">{tipper.count} tips</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{tipper.amount} ETH</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tip Modal */}
      <Dialog open={isTipModalOpen} onOpenChange={setIsTipModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Tip</DialogTitle>
            <DialogDescription>Show appreciation with a crypto tip</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address *</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={tipRecipient}
                onChange={(e) => setTipRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  step="0.001"
                  placeholder="0.0"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  className="flex-1"
                />
                <Select value={tipToken} onValueChange={setTipToken}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="NOTE">NOTE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Input
                id="message"
                placeholder="Add a message..."
                value={tipMessage}
                onChange={(e) => setTipMessage(e.target.value)}
              />
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Tips are sent directly to the recipient's wallet. This action cannot be reversed.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={handleSendTip} disabled={isTipping || !tipAmount || !tipRecipient}>
              {isTipping ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4 mr-2" />
                  Send Tip
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TipSystem;

