import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Wallet, Copy, CheckCircle, ExternalLink, Send, Download, Upload, Eye, EyeOff, Info, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format } from 'date-fns';

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  value: string; // USD value
  contractAddress?: string;
  logo?: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'approve';
  amount: string;
  token: string;
  to?: string;
  from?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
}

const mockTokenBalances: TokenBalance[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: '1.5', value: '3750', contractAddress: '0x0000000000000000000000000000000000000000' },
  { symbol: 'USDC', name: 'USD Coin', balance: '5000', value: '5000', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
  { symbol: 'NOTE', name: 'NoteBoard Token', balance: '10000', value: '5000', contractAddress: '0x1234567890123456789012345678901234567890' },
];

const mockTransactions: Transaction[] = [
  {
    id: 'tx_001',
    type: 'receive',
    amount: '0.5',
    token: 'ETH',
    from: '0xSender',
    timestamp: '2024-07-22T14:30:00Z',
    status: 'completed',
    txHash: '0xabc123...',
  },
  {
    id: 'tx_002',
    type: 'send',
    amount: '100',
    token: 'USDC',
    to: '0xRecipient',
    timestamp: '2024-07-21T10:00:00Z',
    status: 'completed',
    txHash: '0xdef456...',
  },
  {
    id: 'tx_003',
    type: 'swap',
    amount: '0.1',
    token: 'ETH',
    timestamp: '2024-07-20T16:00:00Z',
    status: 'completed',
    txHash: '0x789xyz...',
  },
];

const WalletManager: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>(mockTokenBalances);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [copied, setCopied] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendToken, setSendToken] = useState('ETH');
  const [sendTo, setSendTo] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchWalletData(address);
    }
  }, [address, isConnected]);

  const fetchWalletData = async (userAddress: string) => {
    // In a real application, this would fetch token balances and transaction history
    console.log(`Fetching wallet data for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSend = async () => {
    if (!sendAmount || !sendTo) {
      alert('Please fill in all fields.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet.');
      return;
    }

    setIsSending(true);
    console.log(`Sending ${sendAmount} ${sendToken} to ${sendTo}...`);

    try {
      // In a real application, this would call the send transaction
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'send',
        amount: sendAmount,
        token: sendToken,
        to: sendTo,
        timestamp: new Date().toISOString(),
        status: 'completed',
        txHash: `0x${Math.random().toString(36).substring(2, 15)}...`,
      };

      setTransactions(prev => [newTx, ...prev]);
      setIsSendModalOpen(false);
      setSendAmount('');
      setSendTo('');
      alert('Transaction sent successfully!');
    } catch (error) {
      console.error('Send failed:', error);
      alert('Failed to send transaction. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const totalValue = tokenBalances.reduce((sum, token) => sum + parseFloat(token.value), 0);

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send': return <Send className="h-4 w-4 text-red-600" />;
      case 'receive': return <Download className="h-4 w-4 text-green-600" />;
      case 'swap': return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'approve': return <CheckCircle className="h-4 w-4 text-purple-600" />;
      default: return <Wallet className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to manage your assets and transactions.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Wallet className="h-8 w-8 mr-3 text-primary" /> Wallet Manager
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your wallet, view balances, and track transactions
        </p>
      </div>

      {/* Wallet Overview */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white mb-2">Total Portfolio Value</CardTitle>
              <div className="text-4xl font-bold">${totalValue.toLocaleString()}</div>
            </div>
            <Wallet className="h-12 w-12 opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm opacity-80">Wallet Address</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm font-mono">{address?.slice(0, 10)}...{address?.slice(-8)}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-white/20"
                  onClick={handleCopyAddress}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-white/20"
                  asChild
                >
                  <a href={`https://basescan.org/address/${address}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setIsSendModalOpen(true)}>
            <Send className="h-4 w-4 mr-2" /> Send
          </Button>
          <Button variant="secondary" className="flex-1">
            <Download className="h-4 w-4 mr-2" /> Receive
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="balances" className="w-full">
        <TabsList>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Balances</CardTitle>
              <CardDescription>Your token holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tokenBalances.map(token => (
                  <div
                    key={token.symbol}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {token.symbol[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{token.symbol}</p>
                        <p className="text-sm text-muted-foreground">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{parseFloat(token.balance).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">${parseFloat(token.value).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-6">
          {transactions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No transactions yet.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent wallet transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map(tx => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {getTransactionIcon(tx.type)}
                        <div>
                          <p className="font-semibold capitalize">
                            {tx.type} {tx.amount} {tx.token}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {tx.to && `To: ${tx.to.slice(0, 10)}...`}
                            {tx.from && `From: ${tx.from.slice(0, 10)}...`}
                            {!tx.to && !tx.from && format(new Date(tx.timestamp), 'PPp')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(tx.status)}
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={`https://basescan.org/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Settings</CardTitle>
              <CardDescription>Manage your wallet preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Private Key</Label>
                  <p className="text-sm text-muted-foreground">Display your private key (not recommended)</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                >
                  {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {showPrivateKey && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Security Warning</AlertTitle>
                  <AlertDescription>
                    Never share your private key with anyone. This is for display purposes only.
                  </AlertDescription>
                </Alert>
              )}
              <Separator />
              <div className="space-y-2">
                <Label>Export Wallet</Label>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" /> Export Wallet Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Send Modal */}
      <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Tokens</DialogTitle>
            <DialogDescription>Send tokens to another address</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sendToken">Token</Label>
              <Select value={sendToken} onValueChange={setSendToken}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokenBalances.map(token => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.symbol} - Balance: {token.balance}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sendTo">To Address</Label>
              <Input
                id="sendTo"
                placeholder="0x..."
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sendAmount">Amount</Label>
              <Input
                id="sendAmount"
                type="number"
                step="0.000001"
                placeholder="0.0"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
              />
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Double-check the recipient address. Transactions cannot be reversed.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={handleSend} disabled={isSending}>
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletManager;

