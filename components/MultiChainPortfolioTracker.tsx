"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatEther, Address } from "viem";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  Search,
  Filter,
  Download,
  DollarSign,
  AlertCircle,
  Check,
  Globe,
  Layers,
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  value: number;
  price: number;
  change24h: number;
  chain: Chain;
  address?: string;
  logo: string;
}

interface Chain {
  id: string;
  name: string;
  logo: string;
  color: string;
  rpcUrl: string;
  explorer: string;
  nativeCurrency: string;
}

interface PortfolioHistory {
  date: number;
  value: number;
}

interface NFTAsset {
  id: string;
  name: string;
  collection: string;
  image: string;
  chain: string;
  floorPrice: number;
}

export function MultiChainPortfolioTracker() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"overview" | "tokens" | "nfts" | "history">("overview");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [nfts, setNFTs] = useState<NFTAsset[]>([]);
  const [portfolioHistory, setPortfolioHistory] = useState<PortfolioHistory[]>([]);
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hideSmallBalances, setHideSmallBalances] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showValue, setShowValue] = useState(true);

  // Statistics
  const [totalValue, setTotalValue] = useState(0);
  const [change24h, setChange24h] = useState(0);
  const [change7d, setChange7d] = useState(0);
  const [change30d, setChange30d] = useState(0);

  // Supported chains
  const chains: Chain[] = [
    {
      id: "ethereum",
      name: "Ethereum",
      logo: "Ξ",
      color: "bg-blue-500",
      rpcUrl: "https://eth.llamarpc.com",
      explorer: "https://etherscan.io",
      nativeCurrency: "ETH",
    },
    {
      id: "base",
      name: "Base",
      logo: "🔵",
      color: "bg-blue-600",
      rpcUrl: "https://mainnet.base.org",
      explorer: "https://basescan.org",
      nativeCurrency: "ETH",
    },
    {
      id: "optimism",
      name: "Optimism",
      logo: "🔴",
      color: "bg-red-500",
      rpcUrl: "https://mainnet.optimism.io",
      explorer: "https://optimistic.etherscan.io",
      nativeCurrency: "ETH",
    },
    {
      id: "arbitrum",
      name: "Arbitrum",
      logo: "🔷",
      color: "bg-blue-400",
      rpcUrl: "https://arb1.arbitrum.io/rpc",
      explorer: "https://arbiscan.io",
      nativeCurrency: "ETH",
    },
    {
      id: "polygon",
      name: "Polygon",
      logo: "🟣",
      color: "bg-purple-500",
      rpcUrl: "https://polygon-rpc.com",
      explorer: "https://polygonscan.com",
      nativeCurrency: "MATIC",
    },
    {
      id: "avalanche",
      name: "Avalanche",
      logo: "🔺",
      color: "bg-red-600",
      rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
      explorer: "https://snowtrace.io",
      nativeCurrency: "AVAX",
    },
  ];

  useEffect(() => {
    if (isConnected && address) {
      loadPortfolioData();
    }
  }, [isConnected, address, selectedChains]);

  const loadPortfolioData = async () => {
    setIsLoading(true);

    // Simulate loading portfolio data
    // In a real implementation, this would fetch from multiple chains via RPC
    const mockAssets: Asset[] = [
      {
        id: "1",
        name: "Ethereum",
        symbol: "ETH",
        balance: "2.5",
        value: 4500,
        price: 1800,
        change24h: 3.2,
        chain: chains[0],
        logo: "Ξ",
      },
      {
        id: "2",
        name: "USD Coin",
        symbol: "USDC",
        balance: "5000",
        value: 5000,
        price: 1,
        change24h: 0.1,
        chain: chains[1],
        address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        logo: "$",
      },
      {
        id: "3",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
        balance: "0.1",
        value: 4300,
        price: 43000,
        change24h: 2.5,
        chain: chains[0],
        address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        logo: "₿",
      },
      {
        id: "4",
        name: "Polygon",
        symbol: "MATIC",
        balance: "1500",
        value: 1200,
        price: 0.8,
        change24h: -1.5,
        chain: chains[4],
        logo: "🟣",
      },
      {
        id: "5",
        name: "Optimism",
        symbol: "OP",
        balance: "500",
        value: 800,
        price: 1.6,
        change24h: 5.2,
        chain: chains[2],
        logo: "🔴",
      },
    ];

    const mockNFTs: NFTAsset[] = [
      {
        id: "1",
        name: "Bored Ape #1234",
        collection: "Bored Ape Yacht Club",
        image: "🐵",
        chain: "Ethereum",
        floorPrice: 30000,
      },
      {
        id: "2",
        name: "CryptoPunk #5678",
        collection: "CryptoPunks",
        image: "👾",
        chain: "Ethereum",
        floorPrice: 45000,
      },
      {
        id: "3",
        name: "Azuki #9012",
        collection: "Azuki",
        image: "🎨",
        chain: "Ethereum",
        floorPrice: 15000,
      },
    ];

    // Generate portfolio history (last 30 days)
    const history: PortfolioHistory[] = [];
    const baseValue = 15800;
    for (let i = 30; i >= 0; i--) {
      const date = Date.now() - i * 24 * 60 * 60 * 1000;
      const variation = Math.sin(i / 3) * 500 + Math.random() * 300;
      history.push({
        date,
        value: baseValue + variation,
      });
    }

    setAssets(mockAssets);
    setNFTs(mockNFTs);
    setPortfolioHistory(history);

    // Calculate statistics
    const total = mockAssets.reduce((sum, asset) => sum + asset.value, 0);
    setTotalValue(total);

    const weightedChange24h =
      mockAssets.reduce(
        (sum, asset) => sum + (asset.change24h * asset.value) / total,
        0
      );
    setChange24h(weightedChange24h);

    // Simulate 7d and 30d changes
    setChange7d(weightedChange24h * 1.5);
    setChange30d(weightedChange24h * 2.2);

    setIsLoading(false);
  };

  const toggleChain = (chainId: string) => {
    if (selectedChains.includes(chainId)) {
      setSelectedChains(selectedChains.filter((id) => id !== chainId));
    } else {
      setSelectedChains([...selectedChains, chainId]);
    }
  };

  const getFilteredAssets = () => {
    let filtered = assets;

    // Filter by selected chains
    if (selectedChains.length > 0) {
      filtered = filtered.filter((asset) =>
        selectedChains.includes(asset.chain.id)
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Hide small balances
    if (hideSmallBalances) {
      filtered = filtered.filter((asset) => asset.value > 10);
    }

    return filtered;
  };

  const exportPortfolio = () => {
    const data = {
      address,
      timestamp: Date.now(),
      totalValue,
      assets,
      nfts,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio_${address}_${Date.now()}.json`;
    a.click();
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-sm text-gray-600">
            Please connect your wallet to view your portfolio
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Multi-Chain Portfolio
              </h1>
              <p className="text-sm text-gray-600">
                Track your assets across all chains
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowValue(!showValue)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={showValue ? "Hide values" : "Show values"}
            >
              {showValue ? (
                <Eye className="h-5 w-5 text-gray-600" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={loadPortfolioData}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-5 w-5 text-gray-600 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
            </button>
            <button
              onClick={exportPortfolio}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Total Portfolio Value */}
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Portfolio Value</p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-4xl font-bold">
                  {showValue ? `$${totalValue.toLocaleString()}` : "••••••"}
                </h2>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    change24h >= 0
                      ? "bg-green-400/30"
                      : "bg-red-400/30"
                  }`}
                >
                  {change24h >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-semibold">
                    {change24h >= 0 ? "+" : ""}
                    {change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs opacity-75">7D Change</p>
                  <p
                    className={`text-lg font-semibold ${
                      change7d >= 0 ? "text-green-200" : "text-red-200"
                    }`}
                  >
                    {change7d >= 0 ? "+" : ""}
                    {change7d.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-75">30D Change</p>
                  <p
                    className={`text-lg font-semibold ${
                      change30d >= 0 ? "text-green-200" : "text-red-200"
                    }`}
                  >
                    {change30d >= 0 ? "+" : ""}
                    {change30d.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chain Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filter by Chain</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {chains.map((chain) => (
            <button
              key={chain.id}
              onClick={() => toggleChain(chain.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                selectedChains.includes(chain.id)
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-lg">{chain.logo}</span>
              <span className="text-sm font-medium text-gray-900">
                {chain.name}
              </span>
              {selectedChains.includes(chain.id) && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setHideSmallBalances(!hideSmallBalances)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
            hideSmallBalances
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-gray-200 text-gray-700 hover:border-gray-300"
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Hide Small
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "overview"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("tokens")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "tokens"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Tokens ({assets.length})
        </button>
        <button
          onClick={() => setActiveTab("nfts")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "nfts"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          NFTs ({nfts.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "history"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          History
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Asset Allocation */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Asset Allocation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart Placeholder */}
              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8">
                <div className="text-center">
                  <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Asset allocation chart
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                {getFilteredAssets()
                  .sort((a, b) => b.value - a.value)
                  .map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{asset.logo}</div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {asset.symbol}
                          </div>
                          <div className="text-xs text-gray-500">
                            {asset.chain.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {showValue ? `$${asset.value.toLocaleString()}` : "••••"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {((asset.value / totalValue) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Performers (24h)
            </h3>
            <div className="space-y-3">
              {assets
                .sort((a, b) => b.change24h - a.change24h)
                .slice(0, 5)
                .map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{asset.logo}</div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {asset.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {asset.symbol} • {asset.chain.name}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded ${
                        asset.change24h >= 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {asset.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="text-sm font-semibold">
                        {asset.change24h >= 0 ? "+" : ""}
                        {asset.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tokens Tab */}
      {activeTab === "tokens" && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chain
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    24h Change
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getFilteredAssets().map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{asset.logo}</div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {asset.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {asset.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                        {asset.chain.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {showValue ? asset.balance : "••••"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {showValue ? `$${asset.price.toLocaleString()}` : "••••"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                      {showValue ? `$${asset.value.toLocaleString()}` : "••••"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${
                          asset.change24h >= 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {asset.change24h >= 0 ? "+" : ""}
                        {asset.change24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() =>
                          window.open(
                            `${asset.chain.explorer}/address/${asset.address}`,
                            "_blank"
                          )
                        }
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NFTs Tab */}
      {activeTab === "nfts" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center text-6xl">
                {nft.image}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{nft.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{nft.collection}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Floor Price</div>
                    <div className="font-semibold text-gray-900">
                      {showValue ? `$${nft.floorPrice.toLocaleString()}` : "••••"}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                    {nft.chain}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Portfolio Value History (30 Days)
          </h3>

          {/* Chart Placeholder */}
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Historical performance chart
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-700 mb-1">All-Time High</div>
              <div className="text-2xl font-bold text-blue-900">
                {showValue ? "$16,250" : "••••••"}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-sm text-red-700 mb-1">All-Time Low</div>
              <div className="text-2xl font-bold text-red-900">
                {showValue ? "$12,400" : "••••••"}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-700 mb-1">Avg. Daily Change</div>
              <div className="text-2xl font-bold text-green-900">
                +{showValue ? "2.3%" : "•••"}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-700 mb-1">Volatility</div>
              <div className="text-2xl font-bold text-purple-900">
                {showValue ? "12.5%" : "••••"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

