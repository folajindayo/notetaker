"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi";
import { parseEther, formatEther, Address } from "viem";
import {
  ArrowDownUp,
  RefreshCw,
  Settings,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronDown,
  Search,
  ExternalLink,
  Percent,
  DollarSign,
} from "lucide-react";

interface Token {
  id: string;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo: string;
  price: number;
  balance?: string;
  change24h: number;
}

interface SwapRoute {
  id: string;
  dex: string;
  dexLogo: string;
  inputAmount: string;
  outputAmount: string;
  priceImpact: number;
  fee: number;
  gasEstimate: string;
  path: string[];
  estimatedTime: number;
  confidence: number;
}

interface SwapHistory {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  route: string;
  timestamp: number;
  txHash: string;
  status: "pending" | "success" | "failed";
}

export function TokenSwapAggregator() {
  const { address, isConnected } = useAccount();
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [routes, setRoutes] = useState<SwapRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<SwapRoute | null>(null);
  const [isSearchingRoutes, setIsSearchingRoutes] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState<"from" | "to" | null>(null);
  const [tokenSearchQuery, setTokenSearchQuery] = useState("");
  const [swapHistory, setSwapHistory] = useState<SwapHistory[]>([]);
  
  // Settings
  const [slippageTolerance, setSlippageTolerance] = useState("0.5");
  const [transactionDeadline, setTransactionDeadline] = useState("20");
  const [autoRouter, setAutoRouter] = useState(true);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Popular tokens
  const tokens: Token[] = [
    {
      id: "eth",
      symbol: "ETH",
      name: "Ethereum",
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      logo: "Ξ",
      price: 1800,
      balance: "2.5",
      change24h: 3.2,
    },
    {
      id: "usdc",
      symbol: "USDC",
      name: "USD Coin",
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      decimals: 6,
      logo: "$",
      price: 1,
      balance: "5000",
      change24h: 0.1,
    },
    {
      id: "usdt",
      symbol: "USDT",
      name: "Tether",
      address: "0x4A3c9b9f8f3E3b3B3b3b3b3b3b3b3b3b3b3b3b3b",
      decimals: 6,
      logo: "₮",
      price: 1,
      balance: "3000",
      change24h: 0.0,
    },
    {
      id: "dai",
      symbol: "DAI",
      name: "Dai Stablecoin",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
      logo: "◈",
      price: 1,
      balance: "1500",
      change24h: -0.1,
    },
    {
      id: "wbtc",
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      decimals: 8,
      logo: "₿",
      price: 43000,
      balance: "0.1",
      change24h: 2.5,
    },
  ];

  useEffect(() => {
    if (!fromToken && !toToken) {
      setFromToken(tokens[0]);
      setToToken(tokens[1]);
    }
  }, []);

  useEffect(() => {
    if (fromAmount && fromToken && toToken && parseFloat(fromAmount) > 0) {
      searchRoutes();
    } else {
      setRoutes([]);
      setSelectedRoute(null);
    }
  }, [fromAmount, fromToken, toToken]);

  useEffect(() => {
    // Load swap history from localStorage
    const stored = localStorage.getItem(`swap_history_${address}`);
    if (stored) {
      setSwapHistory(JSON.parse(stored));
    }
  }, [address]);

  const searchRoutes = async () => {
    if (!fromToken || !toToken || !fromAmount) return;

    setIsSearchingRoutes(true);

    // Simulate searching for routes across multiple DEXes
    setTimeout(() => {
      const baseOutput = parseFloat(fromAmount) * (fromToken.price / toToken.price);
      
      const mockRoutes: SwapRoute[] = [
        {
          id: "1",
          dex: "Uniswap V3",
          dexLogo: "🦄",
          inputAmount: fromAmount,
          outputAmount: (baseOutput * 0.998).toFixed(6),
          priceImpact: 0.15,
          fee: 0.3,
          gasEstimate: "0.002",
          path: [fromToken.symbol, toToken.symbol],
          estimatedTime: 30,
          confidence: 95,
        },
        {
          id: "2",
          dex: "Curve",
          dexLogo: "🌊",
          inputAmount: fromAmount,
          outputAmount: (baseOutput * 0.997).toFixed(6),
          priceImpact: 0.12,
          fee: 0.04,
          gasEstimate: "0.0018",
          path: [fromToken.symbol, toToken.symbol],
          estimatedTime: 25,
          confidence: 92,
        },
        {
          id: "3",
          dex: "SushiSwap",
          dexLogo: "🍣",
          inputAmount: fromAmount,
          outputAmount: (baseOutput * 0.996).toFixed(6),
          priceImpact: 0.18,
          fee: 0.3,
          gasEstimate: "0.0022",
          path: [fromToken.symbol, "WETH", toToken.symbol],
          estimatedTime: 35,
          confidence: 88,
        },
        {
          id: "4",
          dex: "Balancer",
          dexLogo: "⚖️",
          inputAmount: fromAmount,
          outputAmount: (baseOutput * 0.995).toFixed(6),
          priceImpact: 0.2,
          fee: 0.25,
          gasEstimate: "0.0025",
          path: [fromToken.symbol, "DAI", toToken.symbol],
          estimatedTime: 40,
          confidence: 85,
        },
      ];

      setRoutes(mockRoutes.sort((a, b) => parseFloat(b.outputAmount) - parseFloat(a.outputAmount)));
      setSelectedRoute(mockRoutes[0]);
      setToAmount(mockRoutes[0].outputAmount);
      setIsSearchingRoutes(false);
    }, 1500);
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !selectedRoute) return;

    setIsSwapping(true);

    try {
      // In a real implementation, this would call the swap aggregator contract
      setTimeout(() => {
        const newSwap: SwapHistory = {
          id: Date.now().toString(),
          fromToken: fromToken.symbol,
          toToken: toToken.symbol,
          fromAmount,
          toAmount: selectedRoute.outputAmount,
          route: selectedRoute.dex,
          timestamp: Date.now(),
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          status: "success",
        };

        const updated = [newSwap, ...swapHistory];
        setSwapHistory(updated);
        localStorage.setItem(`swap_history_${address}`, JSON.stringify(updated));

        // Reset form
        setFromAmount("");
        setToAmount("");
        setRoutes([]);
        setSelectedRoute(null);
        setIsSwapping(false);
      }, 3000);
    } catch (error) {
      console.error("Swap failed:", error);
      setIsSwapping(false);
    }
  };

  const switchTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const selectToken = (token: Token) => {
    if (showTokenSelector === "from") {
      setFromToken(token);
    } else if (showTokenSelector === "to") {
      setToToken(token);
    }
    setShowTokenSelector(null);
    setTokenSearchQuery("");
  };

  const getFilteredTokens = () => {
    if (!tokenSearchQuery) return tokens;
    return tokens.filter(
      (t) =>
        t.name.toLowerCase().includes(tokenSearchQuery.toLowerCase()) ||
        t.symbol.toLowerCase().includes(tokenSearchQuery.toLowerCase())
    );
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ArrowDownUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-sm text-gray-600">
            Please connect your wallet to use the token swap
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <ArrowDownUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Token Swap Aggregator
              </h1>
              <p className="text-sm text-gray-600">
                Find the best swap routes across DEXes
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Swap Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* From Token */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setShowTokenSelector("from")}
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                  >
                    <span className="text-2xl">{fromToken?.logo}</span>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        {fromToken?.symbol}
                      </div>
                      <div className="text-xs text-gray-500">
                        {fromToken?.name}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>
                  <div className="text-right">
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="text-right text-2xl font-semibold bg-transparent border-none focus:outline-none w-full"
                    />
                    {fromToken && (
                      <div className="text-xs text-gray-500 mt-1">
                        Balance: {fromToken.balance}
                      </div>
                    )}
                  </div>
                </div>
                {fromToken && fromAmount && (
                  <div className="text-right text-sm text-gray-600">
                    ≈ ${(parseFloat(fromAmount) * fromToken.price).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Switch Button */}
            <div className="flex justify-center -my-3 relative z-10">
              <button
                onClick={switchTokens}
                className="p-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
              >
                <ArrowDownUp className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* To Token */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setShowTokenSelector("to")}
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                  >
                    <span className="text-2xl">{toToken?.logo}</span>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        {toToken?.symbol}
                      </div>
                      <div className="text-xs text-gray-500">{toToken?.name}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-gray-900">
                      {toAmount || "0.0"}
                    </div>
                    {toToken && (
                      <div className="text-xs text-gray-500 mt-1">
                        Balance: {toToken.balance}
                      </div>
                    )}
                  </div>
                </div>
                {toToken && toAmount && (
                  <div className="text-right text-sm text-gray-600">
                    ≈ ${(parseFloat(toAmount) * toToken.price).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Route Info */}
            {selectedRoute && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedRoute.dexLogo}</span>
                    <span className="font-semibold text-gray-900">
                      {selectedRoute.dex}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Best Rate
                    </span>
                  </div>
                  <button
                    onClick={() => setIsSearchingRoutes(true)}
                    disabled={isSearchingRoutes}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {isSearchingRoutes ? "Searching..." : "Update"}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Price Impact</div>
                    <div
                      className={`font-semibold ${
                        selectedRoute.priceImpact < 0.5
                          ? "text-green-600"
                          : selectedRoute.priceImpact < 3
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedRoute.priceImpact}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Fee</div>
                    <div className="font-semibold text-gray-900">
                      {selectedRoute.fee}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Gas</div>
                    <div className="font-semibold text-gray-900">
                      ~{selectedRoute.gasEstimate} ETH
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              disabled={
                !fromToken ||
                !toToken ||
                !fromAmount ||
                !selectedRoute ||
                isSwapping ||
                isSearchingRoutes
              }
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSwapping ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Swapping...
                </>
              ) : isSearchingRoutes ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Finding Best Route...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Swap Tokens
                </>
              )}
            </button>
          </div>

          {/* Swap History */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Swaps
            </h3>
            {swapHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No swap history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {swapHistory.slice(0, 5).map((swap) => (
                  <div
                    key={swap.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          swap.status === "success"
                            ? "bg-green-100"
                            : swap.status === "pending"
                            ? "bg-yellow-100"
                            : "bg-red-100"
                        }`}
                      >
                        {swap.status === "success" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : swap.status === "pending" ? (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {swap.fromAmount} {swap.fromToken} → {swap.toAmount}{" "}
                          {swap.toToken}
                        </div>
                        <div className="text-xs text-gray-500">
                          via {swap.route} •{" "}
                          {new Date(swap.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        window.open(
                          `https://sepolia.basescan.org/tx/${swap.txHash}`,
                          "_blank"
                        )
                      }
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Route Comparison & Settings */}
        <div className="space-y-6">
          {/* Available Routes */}
          {routes.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Routes ({routes.length})
              </h3>
              <div className="space-y-3">
                {routes.map((route, index) => (
                  <button
                    key={route.id}
                    onClick={() => {
                      setSelectedRoute(route);
                      setToAmount(route.outputAmount);
                    }}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedRoute?.id === route.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{route.dexLogo}</span>
                        <span className="font-semibold text-sm text-gray-900">
                          {route.dex}
                        </span>
                        {index === 0 && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Best
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {route.outputAmount}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div>
                        <div>Impact</div>
                        <div className="font-medium">{route.priceImpact}%</div>
                      </div>
                      <div>
                        <div>Gas</div>
                        <div className="font-medium">{route.gasEstimate}</div>
                      </div>
                      <div>
                        <div>Time</div>
                        <div className="font-medium">{route.estimatedTime}s</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Swap Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slippage Tolerance (%)
                  </label>
                  <div className="flex gap-2">
                    {["0.1", "0.5", "1.0"].map((value) => (
                      <button
                        key={value}
                        onClick={() => setSlippageTolerance(value)}
                        className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                          slippageTolerance === value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {value}%
                      </button>
                    ))}
                    <input
                      type="number"
                      value={slippageTolerance}
                      onChange={(e) => setSlippageTolerance(e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                      step="0.1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Deadline (minutes)
                  </label>
                  <input
                    type="number"
                    value={transactionDeadline}
                    onChange={(e) => setTransactionDeadline(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Auto Router</div>
                    <div className="text-xs text-gray-500">
                      Automatically find best routes
                    </div>
                  </div>
                  <button
                    onClick={() => setAutoRouter(!autoRouter)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoRouter ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoRouter ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Smart Routing</p>
                <p>
                  We search across 10+ DEXes to find you the best swap rates
                  with lowest fees and price impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Selector Modal */}
      {showTokenSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select Token
            </h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={tokenSearchQuery}
                onChange={(e) => setTokenSearchQuery(e.target.value)}
                placeholder="Search by name or symbol..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getFilteredTokens().map((token) => (
                <button
                  key={token.id}
                  onClick={() => selectToken(token)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{token.logo}</span>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        {token.symbol}
                      </div>
                      <div className="text-sm text-gray-600">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {token.balance}
                    </div>
                    <div
                      className={`text-xs ${
                        token.change24h >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {token.change24h >= 0 ? "+" : ""}
                      {token.change24h}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTokenSelector(null)}
              className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

