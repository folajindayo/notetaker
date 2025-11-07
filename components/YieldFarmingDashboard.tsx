"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  TrendingUp,
  Sprout,
  DollarSign,
  Lock,
  Unlock,
  RefreshCw,
  AlertCircle,
  Calculator,
  BarChart3,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Star,
  Clock,
  Zap,
  Award,
  Target,
} from "lucide-react";

interface Farm {
  id: string;
  name: string;
  protocol: string;
  lpToken: string;
  token0: string;
  token1: string;
  tvl: number;
  apr: number;
  apy: number;
  dailyRewards: number;
  rewardToken: string;
  userStaked: number;
  userRewards: number;
  lockPeriod: number; // in days, 0 for no lock
  riskLevel: "low" | "medium" | "high";
  isActive: boolean;
  verified: boolean;
  createdAt: Date;
}

interface APRHistory {
  date: string;
  apr: number;
}

interface PortfolioStats {
  totalStaked: number;
  totalRewards: number;
  avgAPY: number;
  dailyEarnings: number;
}

export function YieldFarmingDashboard() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"farms" | "portfolio" | "calculator">("farms");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [filteredFarms, setFilteredFarms] = useState<Farm[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"apr" | "tvl" | "rewards">("apr");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculator state
  const [calcAmount, setCalcAmount] = useState<number>(0);
  const [calcAPR, setCalcAPR] = useState<number>(0);
  const [calcDuration, setCalcDuration] = useState<number>(365);

  useEffect(() => {
    if (isConnected && address) {
      loadFarmsData();
    }
  }, [isConnected, address]);

  useEffect(() => {
    filterAndSortFarms();
  }, [farms, searchTerm, sortBy, filterRisk]);

  const loadFarmsData = () => {
    setIsLoading(true);
    // Mock farms data
    const mockFarms: Farm[] = [
      {
        id: "1",
        name: "ETH-USDC",
        protocol: "Uniswap V3",
        lpToken: "ETH-USDC-LP",
        token0: "ETH",
        token1: "USDC",
        tvl: 125000000,
        apr: 45.8,
        apy: 57.5,
        dailyRewards: 150,
        rewardToken: "UNI",
        userStaked: 5000,
        userRewards: 125.5,
        lockPeriod: 0,
        riskLevel: "low",
        isActive: true,
        verified: true,
        createdAt: new Date("2023-01-15"),
      },
      {
        id: "2",
        name: "WBTC-ETH",
        protocol: "SushiSwap",
        lpToken: "WBTC-ETH-SLP",
        token0: "WBTC",
        token1: "ETH",
        tvl: 89000000,
        apr: 68.3,
        apy: 97.2,
        dailyRewards: 200,
        rewardToken: "SUSHI",
        userStaked: 10000,
        userRewards: 320.8,
        lockPeriod: 7,
        riskLevel: "medium",
        isActive: true,
        verified: true,
        createdAt: new Date("2023-02-20"),
      },
      {
        id: "3",
        name: "DOGE-USDT",
        protocol: "PancakeSwap",
        lpToken: "DOGE-USDT-LP",
        token0: "DOGE",
        token1: "USDT",
        tvl: 12000000,
        apr: 125.5,
        apy: 249.8,
        dailyRewards: 450,
        rewardToken: "CAKE",
        userStaked: 0,
        userRewards: 0,
        lockPeriod: 30,
        riskLevel: "high",
        isActive: true,
        verified: false,
        createdAt: new Date("2023-06-10"),
      },
      {
        id: "4",
        name: "DAI-USDC",
        protocol: "Curve Finance",
        lpToken: "DAI-USDC-CRV",
        token0: "DAI",
        token1: "USDC",
        tvl: 245000000,
        apr: 12.3,
        apy: 13.1,
        dailyRewards: 80,
        rewardToken: "CRV",
        userStaked: 15000,
        userRewards: 45.2,
        lockPeriod: 0,
        riskLevel: "low",
        isActive: true,
        verified: true,
        createdAt: new Date("2022-11-05"),
      },
      {
        id: "5",
        name: "MATIC-ETH",
        protocol: "QuickSwap",
        lpToken: "MATIC-ETH-LP",
        token0: "MATIC",
        token1: "ETH",
        tvl: 34000000,
        apr: 89.7,
        apy: 144.3,
        dailyRewards: 300,
        rewardToken: "QUICK",
        userStaked: 2500,
        userRewards: 89.3,
        lockPeriod: 14,
        riskLevel: "medium",
        isActive: true,
        verified: true,
        createdAt: new Date("2023-03-12"),
      },
      {
        id: "6",
        name: "AVAX-USDC",
        protocol: "Trader Joe",
        lpToken: "AVAX-USDC-JLP",
        token0: "AVAX",
        token1: "USDC",
        tvl: 56000000,
        apr: 78.9,
        apy: 119.5,
        dailyRewards: 250,
        rewardToken: "JOE",
        userStaked: 0,
        userRewards: 0,
        lockPeriod: 0,
        riskLevel: "medium",
        isActive: true,
        verified: true,
        createdAt: new Date("2023-04-18"),
      },
    ];

    setFarms(mockFarms);
    setIsLoading(false);
  };

  const filterAndSortFarms = () => {
    let filtered = [...farms];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (farm) =>
          farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          farm.protocol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Risk filter
    if (filterRisk !== "all") {
      filtered = filtered.filter((farm) => farm.riskLevel === filterRisk);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "apr":
          return b.apr - a.apr;
        case "tvl":
          return b.tvl - a.tvl;
        case "rewards":
          return b.dailyRewards - a.dailyRewards;
        default:
          return 0;
      }
    });

    setFilteredFarms(filtered);
  };

  const handleStake = (farmId: string, amount: number) => {
    alert(`Staking ${amount} in farm ${farmId}`);
    // Implement staking logic
  };

  const handleUnstake = (farmId: string, amount: number) => {
    alert(`Unstaking ${amount} from farm ${farmId}`);
    // Implement unstaking logic
  };

  const handleClaimRewards = (farmId: string) => {
    alert(`Claiming rewards from farm ${farmId}`);
    // Implement claim logic
  };

  const calculateReturns = () => {
    const principal = calcAmount;
    const rate = calcAPR / 100;
    const time = calcDuration / 365;
    
    // Simple interest
    const simpleInterest = principal * rate * time;
    
    // Compound interest (daily compounding)
    const compoundInterest = principal * (Math.pow(1 + rate / 365, 365 * time) - 1);
    
    return {
      simple: simpleInterest,
      compound: compoundInterest,
      total: principal + compoundInterest,
    };
  };

  const portfolioStats: PortfolioStats = farms.reduce(
    (acc, farm) => ({
      totalStaked: acc.totalStaked + farm.userStaked,
      totalRewards: acc.totalRewards + farm.userRewards,
      avgAPY:
        acc.avgAPY +
        (farm.userStaked > 0 ? farm.apy * (farm.userStaked / (acc.totalStaked + farm.userStaked)) : 0),
      dailyEarnings:
        acc.dailyEarnings + (farm.userStaked > 0 ? (farm.userStaked * farm.apr) / 365 / 100 : 0),
    }),
    { totalStaked: 0, totalRewards: 0, avgAPY: 0, dailyEarnings: 0 }
  );

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg border border-gray-200 p-8">
        <Sprout className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600 text-center max-w-md">
          Connect your wallet to access yield farming opportunities
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sprout className="w-6 h-6 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Yield Farming Dashboard</h2>
            <p className="text-sm text-gray-600">
              Maximize your crypto earnings with optimized farming strategies
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Calculator className="w-4 h-4" />
          Calculator
        </button>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <Lock className="w-8 h-8 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">STAKED</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${portfolioStats.totalStaked.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">Total value locked</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <Award className="w-8 h-8 text-green-600" />
            <span className="text-xs text-green-600 font-medium">REWARDS</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${portfolioStats.totalRewards.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">Claimable rewards</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">AVG APY</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {portfolioStats.avgAPY.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-600 mt-1">Weighted average</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <Zap className="w-8 h-8 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">DAILY</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${portfolioStats.dailyEarnings.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">Est. daily earnings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {["farms", "portfolio", "calculator"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Farms Tab */}
      {activeTab === "farms" && (
        <div>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search farms or protocols..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="apr">Sort by APR</option>
              <option value="tvl">Sort by TVL</option>
              <option value="rewards">Sort by Rewards</option>
            </select>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>

          {/* Farms List */}
          <div className="space-y-4">
            {filteredFarms.map((farm) => (
              <div
                key={farm.id}
                className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {farm.token0[0]}
                      {farm.token1[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
                        {farm.verified && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                            <Award className="w-3 h-3" />
                            Verified
                          </div>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            farm.riskLevel === "low"
                              ? "bg-green-100 text-green-700"
                              : farm.riskLevel === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {farm.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{farm.protocol}</p>
                      {farm.lockPeriod > 0 && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                          <Clock className="w-3 h-3" />
                          {farm.lockPeriod} days lock period
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">{farm.apr.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">APR</p>
                    <p className="text-sm text-gray-900 font-medium mt-1">
                      {farm.apy.toFixed(1)}% APY
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">TVL</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ${(farm.tvl / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Daily Rewards</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {farm.dailyRewards} {farm.rewardToken}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Your Stake</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ${farm.userStaked.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Your Rewards</p>
                    <p className="text-sm font-semibold text-green-600">
                      ${farm.userRewards.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {farm.userStaked > 0 ? (
                    <>
                      <button
                        onClick={() => handleUnstake(farm.id, farm.userStaked)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        <Unlock className="w-4 h-4 inline mr-2" />
                        Unstake
                      </button>
                      <button
                        onClick={() => handleClaimRewards(farm.id)}
                        disabled={farm.userRewards === 0}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Award className="w-4 h-4 inline mr-2" />
                        Claim ${farm.userRewards.toFixed(2)}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleStake(farm.id, 1000)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Lock className="w-4 h-4 inline mr-2" />
                      Stake Now
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedFarm(farm)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredFarms.length === 0 && (
              <div className="text-center py-12">
                <Sprout className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No farms found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === "portfolio" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Active Farms</h3>
          <div className="space-y-4">
            {farms.filter((f) => f.userStaked > 0).map((farm) => (
              <div
                key={farm.id}
                className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{farm.name}</h4>
                    <p className="text-sm text-gray-600">{farm.protocol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">{farm.apy.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">APY</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Staked</p>
                    <p className="font-semibold text-gray-900">
                      ${farm.userStaked.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Earned</p>
                    <p className="font-semibold text-green-600">
                      ${farm.userRewards.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Daily Est.</p>
                    <p className="font-semibold text-gray-900">
                      ${((farm.userStaked * farm.apr) / 365 / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calculator Tab */}
      {activeTab === "calculator" && (
        <div>
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Yield Calculator
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount (USD)
                </label>
                <input
                  type="number"
                  value={calcAmount || ""}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  APR (%)
                </label>
                <input
                  type="number"
                  value={calcAPR || ""}
                  onChange={(e) => setCalcAPR(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={calcDuration}
                  onChange={(e) => setCalcDuration(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="365"
                />
              </div>
            </div>

            {calcAmount > 0 && calcAPR > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Estimated Returns
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Initial Investment:</span>
                    <span className="font-semibold text-gray-900">
                      ${calcAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Simple Interest:</span>
                    <span className="font-semibold text-green-600">
                      ${calculateReturns().simple.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compound Interest:</span>
                    <span className="font-semibold text-green-600">
                      ${calculateReturns().compound.toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Total Value:
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ${calculateReturns().total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

