import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowDownUp, TrendingUp, Info, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { format } from 'date-fns';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  balance: string;
  price: number; // USD price
  logo?: string;
}

interface SwapTransaction {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  rate: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
}

const availableTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, balance: '1.5', price: 2500 },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, balance: '5000', price: 1 },
  { symbol: 'NOTE', name: 'NoteBoard Token', address: '0x1234567890123456789012345678901234567890', decimals: 18, balance: '10000', price: 0.5 },
  { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, balance: '2000', price: 1 },
];

const mockSwapHistory: SwapTransaction[] = [
  {
    id: 'swap_001',
    fromToken: 'ETH',
    toToken: 'USDC',
    fromAmount: '0.1',
    toAmount: '250',
    rate: 2500,
    timestamp: '2024-07-22T14:30:00Z',
    status: 'completed',
    txHash: '0xabc123...',
  },
  {
    id: 'swap_002',
    fromToken: 'NOTE',
    toToken: 'ETH',
    fromAmount: '1000',
    toAmount: '0.5',
    rate: 0.0005,
    timestamp: '2024-07-21T10:00:00Z',
    status: 'completed',
    txHash: '0xdef456...',
  },
];

const TokenSwap: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [fromToken, setFromToken] = useState<string>('ETH');
  const [toToken, setToToken] = useState<string>('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [swapHistory, setSwapHistory] = useState<SwapTransaction[]>(mockSwapHistory);
  const [isSwapping, setIsSwapping] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [priceImpact, setPriceImpact] = useState(0);

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      calculateSwap();
    }
  }, [fromToken, toToken, fromAmount]);

  const calculateSwap = () => {
    const from = availableTokens.find(t => t.symbol === fromToken);
    const to = availableTokens.find(t => t.symbol === toToken);
    
    if (from && to && fromAmount) {
      const amount = parseFloat(fromAmount);
      const rate = to.price / from.price;
      const calculatedAmount = amount * rate;
      setExchangeRate(rate);
      setToAmount(calculatedAmount.toFixed(6));
      
      // Calculate price impact (simplified)
      const impact = amount > 10 ? 0.1 : amount > 1 ? 0.5 : 1.0;
      setPriceImpact(impact);
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet to swap tokens.');
      return;
    }

    const from = availableTokens.find(t => t.symbol === fromToken);
    if (!from || parseFloat(fromAmount) > parseFloat(from.balance)) {
      alert('Insufficient balance.');
      return;
    }

    setIsSwapping(true);
    console.log(`Swapping ${fromAmount} ${fromToken} for ${toAmount} ${toToken}...`);

    try {
      // In a real application, this would involve:
      // 1. Approve token spending (if not native token)
      // 2. Call swap contract (Uniswap, 1inch, etc.)
      // 3. Wait for transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const swap: SwapTransaction = {
        id: `swap_${Date.now()}`,
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        rate: exchangeRate,
        timestamp: new Date().toISOString(),
        status: 'completed',
        txHash: `0x${Math.random().toString(36).substring(2, 15)}...`,
      };

      setSwapHistory(prev => [swap, ...prev]);
      setFromAmount('');
      setToAmount('');
      alert(`Successfully swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}!`);
    } catch (error) {
      console.error('Swap failed:', error);
      alert('Swap failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  const getTokenBalance = (symbol: string) => {
    const token = availableTokens.find(t => t.symbol === symbol);
    return token?.balance || '0';
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to swap tokens.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <ArrowDownUp className="h-8 w-8 mr-3 text-primary" /> Token Swap
        </h1>
        <p className="text-muted-foreground mt-1">
          Swap tokens instantly with the best rates
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Swap Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Swap Tokens</CardTitle>
            <CardDescription>Exchange one token for another</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* From Token */}
            <div className="space-y-2">
              <Label>From</Label>
              <div className="flex gap-2">
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTokens.map(token => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex-1 relative">
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="pr-20"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setFromAmount(getTokenBalance(fromToken))}
                  >
                    MAX
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Balance: {getTokenBalance(fromToken)} {fromToken}
              </p>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={handleSwapTokens}
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <Label>To</Label>
              <div className="flex gap-2">
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTokens.filter(t => t.symbol !== fromToken).map(token => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step="0.000001"
                  placeholder="0.0"
                  value={toAmount}
                  readOnly
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Balance: {getTokenBalance(toToken)} {toToken}
              </p>
            </div>

            {/* Swap Details */}
            {fromAmount && parseFloat(fromAmount) > 0 && (
              <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span className="font-medium">
                    1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price Impact</span>
                  <span className={priceImpact > 0.5 ? 'text-red-600 font-medium' : 'font-medium'}>
                    {priceImpact.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slippage Tolerance</span>
                  <span className="font-medium">{slippage}%</span>
                </div>
                {priceImpact > 0.5 && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      High price impact. Consider splitting your swap into smaller amounts.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleSwap}
              disabled={isSwapping || !fromAmount || parseFloat(fromAmount) <= 0}
            >
              {isSwapping ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Swapping...
                </>
              ) : (
                <>
                  <ArrowDownUp className="h-4 w-4 mr-2" />
                  Swap
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Settings & Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Swap Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
                <Input
                  id="slippage"
                  type="number"
                  step="0.1"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                />
                <div className="flex gap-2">
                  {['0.1', '0.5', '1.0'].map(value => (
                    <Button
                      key={value}
                      variant={slippage === value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSlippage(value)}
                    >
                      {value}%
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>About Token Swaps</AlertTitle>
            <AlertDescription>
              Swaps are executed using decentralized exchanges. Rates are calculated in real-time and may vary based on liquidity.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Swap History */}
      <Card>
        <CardHeader>
          <CardTitle>Swap History</CardTitle>
          <CardDescription>Your recent token swaps</CardDescription>
        </CardHeader>
        <CardContent>
          {swapHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ArrowDownUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No swap history yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {swapHistory.map(swap => (
                <div
                  key={swap.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <ArrowDownUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {swap.fromAmount} {swap.fromToken} → {swap.toAmount} {swap.toToken}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(swap.timestamp), 'PPp')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {swap.status === 'completed' ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : swap.status === 'pending' ? (
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenSwap;
