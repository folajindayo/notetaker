import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowRightLeft, AlertCircle, CheckCircle, Clock, Info, Wallet, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { format, parseISO } from 'date-fns';

interface Chain {
  id: string;
  name: string;
  icon: string;
  nativeCurrency: string;
  supported: boolean;
}

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  balance: string;
  bridgeable: boolean;
}

interface BridgeTransaction {
  id: string;
  fromChain: string;
  toChain: string;
  token: string;
  amount: string;
  status: 'pending' | 'bridging' | 'completed' | 'failed';
  timestamp: string;
  estimatedTime: string;
  txHashSource?: string;
  txHashDestination?: string;
  fee: string;
}

const supportedChains: Chain[] = [
  { id: 'base', name: 'Base', icon: '🔵', nativeCurrency: 'ETH', supported: true },
  { id: 'ethereum', name: 'Ethereum', icon: '⟠', nativeCurrency: 'ETH', supported: true },
  { id: 'optimism', name: 'Optimism', icon: '🔴', nativeCurrency: 'ETH', supported: true },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔷', nativeCurrency: 'ETH', supported: true },
  { id: 'polygon', name: 'Polygon', icon: '🟣', nativeCurrency: 'MATIC', supported: true },
  { id: 'avalanche', name: 'Avalanche', icon: '🔺', nativeCurrency: 'AVAX', supported: false },
];

const mockTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, balance: '1.5', bridgeable: true },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, balance: '1000', bridgeable: true },
  { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, balance: '500', bridgeable: true },
  { symbol: 'NOTE', name: 'NoteBoard Token', address: '0x1234567890123456789012345678901234567890', decimals: 18, balance: '10000', bridgeable: true },
];

const mockTransactions: BridgeTransaction[] = [
  {
    id: 'bridge_001',
    fromChain: 'ethereum',
    toChain: 'base',
    token: 'USDC',
    amount: '100',
    status: 'completed',
    timestamp: '2024-07-22T10:00:00Z',
    estimatedTime: '5-10 minutes',
    txHashSource: '0xabc123...',
    txHashDestination: '0xdef456...',
    fee: '0.002 ETH',
  },
  {
    id: 'bridge_002',
    fromChain: 'base',
    toChain: 'optimism',
    token: 'ETH',
    amount: '0.5',
    status: 'bridging',
    timestamp: '2024-07-22T15:30:00Z',
    estimatedTime: '3-5 minutes',
    txHashSource: '0x789xyz...',
    fee: '0.001 ETH',
  },
  {
    id: 'bridge_003',
    fromChain: 'polygon',
    toChain: 'base',
    token: 'USDT',
    amount: '250',
    status: 'pending',
    timestamp: '2024-07-22T16:45:00Z',
    estimatedTime: '5-10 minutes',
    fee: '0.003 ETH',
  },
];

const MultiChainBridge: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [fromChain, setFromChain] = useState<string>('ethereum');
  const [toChain, setToChain] = useState<string>('base');
  const [selectedToken, setSelectedToken] = useState<string>('USDC');
  const [amount, setAmount] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>(mockTokens);
  const [transactions, setTransactions] = useState<BridgeTransaction[]>(mockTransactions);
  const [estimatedFee, setEstimatedFee] = useState<string>('0.002');
  const [estimatedTime, setEstimatedTime] = useState<string>('5-10 minutes');
  const [isBridging, setIsBridging] = useState(false);

  useEffect(() => {
    if (fromChain && toChain && selectedToken && amount) {
      calculateBridgeFee();
    }
  }, [fromChain, toChain, selectedToken, amount]);

  const calculateBridgeFee = () => {
    // In a real application, this would call the bridge protocol to get accurate fees
    const baseGas = 0.001;
    const bridgeFee = parseFloat(amount) * 0.001; // 0.1% bridge fee
    const totalFee = baseGas + bridgeFee;
    setEstimatedFee(totalFee.toFixed(6));
    
    // Estimate time based on chains
    if (fromChain === 'ethereum') {
      setEstimatedTime('10-15 minutes');
    } else {
      setEstimatedTime('3-5 minutes');
    }
  };

  const handleSwapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleBridge = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to bridge assets.');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const selectedTokenData = tokens.find(t => t.symbol === selectedToken);
    if (!selectedTokenData || parseFloat(amount) > parseFloat(selectedTokenData.balance)) {
      alert('Insufficient balance.');
      return;
    }

    setIsBridging(true);
    console.log(`Bridging ${amount} ${selectedToken} from ${fromChain} to ${toChain}...`);

    try {
      // In a real application, this would involve:
      // 1. Approve token spending (if not native token)
      // 2. Call bridge contract on source chain
      // 3. Wait for confirmations
      // 4. Monitor bridge relayer
      // 5. Confirm receipt on destination chain
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newTransaction: BridgeTransaction = {
        id: `bridge_${Date.now()}`,
        fromChain,
        toChain,
        token: selectedToken,
        amount,
        status: 'pending',
        timestamp: new Date().toISOString(),
        estimatedTime,
        txHashSource: `0x${Math.random().toString(36).substring(2, 15)}...`,
        fee: `${estimatedFee} ETH`,
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setAmount('');
      alert('Bridge transaction initiated! Monitor progress in the History tab.');
    } catch (error) {
      console.error('Bridge failed:', error);
      alert('Bridge transaction failed. Please try again.');
    } finally {
      setIsBridging(false);
    }
  };

  const getChainIcon = (chainId: string) => {
    const chain = supportedChains.find(c => c.id === chainId);
    return chain?.icon || '🔗';
  };

  const getChainName = (chainId: string) => {
    const chain = supportedChains.find(c => c.id === chainId);
    return chain?.name || chainId;
  };

  const getStatusBadge = (status: BridgeTransaction['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'bridging':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"><ArrowRightLeft className="h-3 w-3 mr-1" />Bridging</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to bridge assets across chains.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <ArrowRightLeft className="h-8 w-8 mr-3 text-primary" /> Multi-Chain Bridge
        </h1>
        <p className="text-muted-foreground mt-1">
          Transfer assets seamlessly across supported blockchains
        </p>
      </div>

      <Tabs defaultValue="bridge" className="w-full">
        <TabsList>
          <TabsTrigger value="bridge">Bridge</TabsTrigger>
          <TabsTrigger value="history">History ({transactions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="bridge" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bridge Form */}
            <Card>
              <CardHeader>
                <CardTitle>Bridge Assets</CardTitle>
                <CardDescription>Transfer tokens between chains</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* From Chain */}
                <div className="space-y-2">
                  <Label htmlFor="fromChain">From Chain</Label>
                  <Select value={fromChain} onValueChange={setFromChain}>
                    <SelectTrigger id="fromChain">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedChains.filter(c => c.supported).map(chain => (
                        <SelectItem key={chain.id} value={chain.id}>
                          {chain.icon} {chain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Swap Chains Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSwapChains}
                    className="rounded-full"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>

                {/* To Chain */}
                <div className="space-y-2">
                  <Label htmlFor="toChain">To Chain</Label>
                  <Select value={toChain} onValueChange={setToChain}>
                    <SelectTrigger id="toChain">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedChains.filter(c => c.supported && c.id !== fromChain).map(chain => (
                        <SelectItem key={chain.id} value={chain.id}>
                          {chain.icon} {chain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Token Selection */}
                <div className="space-y-2">
                  <Label htmlFor="token">Token</Label>
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger id="token">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.filter(t => t.bridgeable).map(token => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      step="0.000001"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => {
                        const token = tokens.find(t => t.symbol === selectedToken);
                        if (token) setAmount(token.balance);
                      }}
                    >
                      MAX
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Balance: {tokens.find(t => t.symbol === selectedToken)?.balance || '0'} {selectedToken}
                  </p>
                </div>

                <Separator />

                {/* Estimated Details */}
                <div className="space-y-2 p-3 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Fee:</span>
                    <span className="font-medium">{estimatedFee} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Time:</span>
                    <span className="font-medium">{estimatedTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">You will receive:</span>
                    <span className="font-medium">{amount || '0'} {selectedToken}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleBridge}
                  disabled={isBridging || !amount || parseFloat(amount) <= 0}
                >
                  {isBridging ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Bridging...
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Bridge Assets
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Supported Chains */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Supported Chains</CardTitle>
                  <CardDescription>Networks available for bridging</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {supportedChains.map(chain => (
                      <div
                        key={chain.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          chain.supported ? 'bg-muted' : 'bg-muted/50 opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{chain.icon}</span>
                          <div>
                            <p className="font-medium">{chain.name}</p>
                            <p className="text-xs text-muted-foreground">{chain.nativeCurrency}</p>
                          </div>
                        </div>
                        {chain.supported ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">Coming Soon</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Alert className="bg-blue-50 dark:bg-blue-950">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 dark:text-blue-300">Security Notice</AlertTitle>
                <AlertDescription className="text-blue-800 dark:text-blue-300">
                  Always verify the destination address and chain before confirming a bridge transaction. Bridge transactions cannot be reversed.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {transactions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <ArrowRightLeft className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">No bridge transactions yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {transactions.map(tx => (
                <Card key={tx.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(tx.status)}
                          <span className="text-sm text-muted-foreground">
                            {format(parseISO(tx.timestamp), 'PPp')}
                          </span>
                        </div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="text-2xl">{getChainIcon(tx.fromChain)}</span>
                          <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                          <span className="text-2xl">{getChainIcon(tx.toChain)}</span>
                          {getChainName(tx.fromChain)} → {getChainName(tx.toChain)}
                        </CardTitle>
                        <CardDescription>
                          {tx.amount} {tx.token} • Fee: {tx.fee}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {tx.txHashSource && (
                        <div>
                          <p className="text-muted-foreground">Source Tx</p>
                          <a
                            href={`https://etherscan.io/tx/${tx.txHashSource}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs flex items-center gap-1 hover:underline"
                          >
                            {tx.txHashSource}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      {tx.txHashDestination && (
                        <div>
                          <p className="text-muted-foreground">Destination Tx</p>
                          <a
                            href={`https://basescan.org/tx/${tx.txHashDestination}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs flex items-center gap-1 hover:underline"
                          >
                            {tx.txHashDestination}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      {tx.status === 'bridging' && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground mb-2">Estimated completion time: {tx.estimatedTime}</p>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Alert>
        <Wallet className="h-4 w-4" />
        <AlertTitle>About Multi-Chain Bridge</AlertTitle>
        <AlertDescription>
          Our bridge uses secure cross-chain protocols to transfer assets between supported networks. Transactions are verified by multiple validators to ensure security and reliability.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MultiChainBridge;

