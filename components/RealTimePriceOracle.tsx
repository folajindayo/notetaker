"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  RefreshCw,
  Bell,
  Star,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Search,
  BarChart3,
  Zap,
} from "lucide-react";

interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  marketCap: string;
  high24h: number;
  low24h: number;
  lastUpdate: number;
  sparkline: number[];
}

interface PriceAlert {
  id: string;
  symbol: string;
  condition: "above" | "below";
  targetPrice: number;
  currentPrice: number;
  active: boolean;
  createdAt: number;
}

export function RealTimePriceOracle() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"prices" | "alerts" | "watchlist" | "analytics">("prices");
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedToken, setSelectedToken] = useState<PriceData | null>(null);

  // Alert creation state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertSymbol, setAlertSymbol] = useState("");
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above");
  const [alertPrice, setAlertPrice] = useState("");

  useEffect(() => {
    loadPrices();
    const interval = setInterval(loadPrices, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loadWatchlist();
      loadAlerts();
    }
  }, [isConnected, address]);

  const loadPrices = () => {
    // Simulate real-time price data
    const mockPrices: PriceData[] = [
      {
        symbol: "ETH",
        name: "Ethereum",
        price: 2456.78,
        change24h: 3.45,
        volume24h: "12.5B",
        marketCap: "295.4B",
        high24h: 2489.32,
        low24h: 2398.54,
        lastUpdate: Date.now(),
        sparkline: Array.from({ length: 24 }, () => 2400 + Math.random() * 100),
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        price: 43567.89,
        change24h: -1.23,
        volume24h: "28.3B",
        marketCap: "852.1B",
        high24h: 44123.45,
        low24h: 43012.34,
        lastUpdate: Date.now(),
        sparkline: Array.from({ length: 24 }, () => 43000 + Math.random() * 1000),
      },
      {
        symbol: "BASE",
        name: "Base Token",
        price: 1.89,
        change24h: 5.67,
        volume24h: "456M",
        marketCap: "1.2B",
        high24h: 1.95,
        low24h: 1.78,
        lastUpdate: Date.now(),
        sparkline: Array.from({ length: 24 }, () => 1.8 + Math.random() * 0.2),
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        price: 1.0,
        change24h: 0.01,
        volume24h: "5.8B",
        marketCap: "25.4B",
        high24h: 1.001,
        low24h: 0.999,
        lastUpdate: Date.now(),
        sparkline: Array.from({ length: 24 }, () => 1.0),
      },
      {
        symbol: "LINK",
        name: "Chainlink",
        price: 14.56,
        change24h: 2.34,
        volume24h: "678M",
        marketCap: "8.1B",
        high24h: 14.89,
        low24h: 14.12,
        lastUpdate: Date.now(),
        sparkline: Array.from({ length: 24 }, () => 14 + Math.random() * 1),
      },
    ];

    setPrices(mockPrices);
    checkAlerts(mockPrices);
  };

  const loadWatchlist = () => {
    // Simulate loading user's watchlist
    setWatchlist(["ETH", "BTC", "BASE"]);
  };

  const loadAlerts = () => {
    // Simulate loading user's alerts
    const mockAlerts: PriceAlert[] = [
      {
        id: "1",
        symbol: "ETH",
        condition: "above",
        targetPrice: 2500,
        currentPrice: 2456.78,
        active: true,
        createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      },
      {
        id: "2",
        symbol: "BTC",
        condition: "below",
        targetPrice: 42000,
        currentPrice: 43567.89,
        active: true,
        createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      },
    ];

    setAlerts(mockAlerts);
  };

  const checkAlerts = (currentPrices: PriceData[]) => {
    alerts.forEach((alert) => {
      const priceData = currentPrices.find((p) => p.symbol === alert.symbol);
      if (!priceData || !alert.active) return;

      const triggered =
        (alert.condition === "above" && priceData.price >= alert.targetPrice) ||
        (alert.condition === "below" && priceData.price <= alert.targetPrice);

      if (triggered) {
        // In a real app, this would send a notification
        console.log(`Alert triggered for ${alert.symbol}!`);
      }
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    loadPrices();
    setIsRefreshing(false);
  };

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const createAlert = () => {
    if (!alertSymbol || !alertPrice) return;

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      symbol: alertSymbol,
      condition: alertCondition,
      targetPrice: parseFloat(alertPrice),
      currentPrice: prices.find((p) => p.symbol === alertSymbol)?.price || 0,
      active: true,
      createdAt: Date.now(),
    };

    setAlerts([...alerts, newAlert]);
    setShowAlertModal(false);
    setAlertSymbol("");
    setAlertPrice("");
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(alerts.filter((a) => a.id !== alertId));
  };

  const filteredPrices = prices.filter(
    (price) =>
      price.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const watchlistPrices = prices.filter((p) => watchlist.includes(p.symbol));

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-sm text-gray-600">
            Please connect your wallet to access price oracles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Real-Time Price Oracle
              </h1>
              <p className="text-sm text-gray-600">
                Live cryptocurrency price feeds
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("prices")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "prices"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          All Prices ({prices.length})
        </button>
        <button
          onClick={() => setActiveTab("watchlist")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "watchlist"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Watchlist ({watchlist.length})
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "alerts"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "analytics"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Search Bar */}
      {(activeTab === "prices" || activeTab === "watchlist") && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tokens..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Prices Tab */}
      {activeTab === "prices" && (
        <div className="space-y-4">
          {filteredPrices.map((price) => (
            <div
              key={price.symbol}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedToken(price)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    {price.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {price.name}
                      </h3>
                      <span className="text-sm text-gray-500">{price.symbol}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(price.symbol);
                        }}
                        className="ml-2"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            watchlist.includes(price.symbol)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Last updated: {new Date(price.lastUpdate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${price.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      price.change24h >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {price.change24h >= 0 ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="font-semibold">
                      {Math.abs(price.change24h).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-600">24h Volume</div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${price.volume24h}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Market Cap</div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${price.marketCap}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">24h High</div>
                  <div className="text-sm font-semibold text-green-600">
                    ${price.high24h.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">24h Low</div>
                  <div className="text-sm font-semibold text-red-600">
                    ${price.low24h.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Mini Sparkline */}
              <div className="h-16 flex items-end gap-1">
                {price.sparkline.map((value, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-green-500 rounded-t"
                    style={{
                      height: `${
                        ((value - Math.min(...price.sparkline)) /
                          (Math.max(...price.sparkline) -
                            Math.min(...price.sparkline))) *
                        100
                      }%`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Watchlist Tab */}
      {activeTab === "watchlist" && (
        <div className="space-y-4">
          {watchlistPrices.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Tokens in Watchlist
              </h3>
              <p className="text-sm text-gray-600">
                Add tokens to your watchlist to track them
              </p>
            </div>
          ) : (
            watchlistPrices.map((price) => (
              <div
                key={price.symbol}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{price.name}</h3>
                    <p className="text-sm text-gray-600">{price.symbol}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      ${price.price.toFixed(2)}
                    </div>
                    <div
                      className={`text-sm ${
                        price.change24h >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {price.change24h >= 0 ? "+" : ""}
                      {price.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === "alerts" && (
        <div>
          <div className="mb-4">
            <button
              onClick={() => setShowAlertModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Bell className="h-5 w-5" />
              Create Price Alert
            </button>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{alert.symbol}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          alert.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {alert.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Alert when price goes {alert.condition} ${alert.targetPrice}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Current: ${alert.currentPrice.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Market Analytics
          </h3>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">
                Advanced analytics coming soon
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alert Creation Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Create Price Alert
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token
                </label>
                <select
                  value={alertSymbol}
                  onChange={(e) => setAlertSymbol(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select token</option>
                  {prices.map((price) => (
                    <option key={price.symbol} value={price.symbol}>
                      {price.name} ({price.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={alertCondition}
                  onChange={(e) =>
                    setAlertCondition(e.target.value as "above" | "below")
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="above">Price goes above</option>
                  <option value="below">Price goes below</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Price (USD)
                </label>
                <input
                  type="number"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={createAlert}
                  disabled={!alertSymbol || !alertPrice}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
                >
                  Create Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

