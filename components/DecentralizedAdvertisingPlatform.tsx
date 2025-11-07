"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Megaphone,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  Calendar,
  Target,
  BarChart3,
  Settings,
  PlayCircle,
  PauseCircle,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

interface AdCampaign {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  status: "active" | "paused" | "completed" | "draft";
  startDate: Date;
  endDate: Date;
  targeting: {
    countries: string[];
    interests: string[];
    minAge: number;
    maxAge: number;
  };
  createdAt: Date;
}

interface AdSlot {
  id: string;
  location: "sidebar" | "feed" | "header" | "modal";
  size: "small" | "medium" | "large" | "banner";
  price: number; // Per impression in tokens
  available: boolean;
}

interface AdPerformance {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
}

export function DecentralizedAdvertisingPlatform() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"campaigns" | "create" | "analytics" | "slots">("campaigns");
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New campaign form state
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    imageUrl: "",
    targetUrl: "",
    budget: 0,
    startDate: "",
    endDate: "",
    targeting: {
      countries: [] as string[],
      interests: [] as string[],
      minAge: 18,
      maxAge: 65,
    },
  });

  // Mock data initialization
  useEffect(() => {
    if (isConnected && address) {
      loadMockData();
    }
  }, [isConnected, address]);

  const loadMockData = () => {
    // Mock campaigns
    const mockCampaigns: AdCampaign[] = [
      {
        id: "1",
        name: "DeFi Protocol Launch",
        description: "Promote our new DeFi lending protocol",
        imageUrl: "/api/placeholder/400/200",
        targetUrl: "https://example.com/defi",
        budget: 5000,
        spent: 3200,
        impressions: 125000,
        clicks: 2500,
        conversions: 125,
        ctr: 2.0,
        cpc: 1.28,
        status: "active",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-02-01"),
        targeting: {
          countries: ["US", "UK", "CA"],
          interests: ["DeFi", "Crypto", "Trading"],
          minAge: 25,
          maxAge: 55,
        },
        createdAt: new Date("2023-12-15"),
      },
      {
        id: "2",
        name: "NFT Collection Drop",
        description: "Limited edition NFT collection announcement",
        imageUrl: "/api/placeholder/400/200",
        targetUrl: "https://example.com/nft",
        budget: 3000,
        spent: 3000,
        impressions: 98000,
        clicks: 1960,
        conversions: 98,
        ctr: 2.0,
        cpc: 1.53,
        status: "completed",
        startDate: new Date("2023-12-01"),
        endDate: new Date("2023-12-31"),
        targeting: {
          countries: ["US", "JP", "KR"],
          interests: ["NFT", "Art", "Collectibles"],
          minAge: 18,
          maxAge: 45,
        },
        createdAt: new Date("2023-11-20"),
      },
      {
        id: "3",
        name: "Token Staking Promotion",
        description: "High APY staking opportunities",
        imageUrl: "/api/placeholder/400/200",
        targetUrl: "https://example.com/stake",
        budget: 2000,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        status: "paused",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-02-15"),
        targeting: {
          countries: ["Global"],
          interests: ["Staking", "Yield Farming", "Passive Income"],
          minAge: 21,
          maxAge: 60,
        },
        createdAt: new Date("2024-01-10"),
      },
    ];

    // Mock ad slots
    const mockSlots: AdSlot[] = [
      { id: "1", location: "sidebar", size: "medium", price: 0.01, available: true },
      { id: "2", location: "feed", size: "large", price: 0.02, available: true },
      { id: "3", location: "header", size: "banner", price: 0.015, available: false },
      { id: "4", location: "modal", size: "large", price: 0.025, available: true },
    ];

    setCampaigns(mockCampaigns);
    setAdSlots(mockSlots);
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.budget || !newCampaign.targetUrl) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const campaign: AdCampaign = {
        id: Date.now().toString(),
        ...newCampaign,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        status: "draft",
        startDate: new Date(newCampaign.startDate),
        endDate: new Date(newCampaign.endDate),
        createdAt: new Date(),
      };

      setCampaigns([...campaigns, campaign]);
      setShowCreateModal(false);
      setNewCampaign({
        name: "",
        description: "",
        imageUrl: "",
        targetUrl: "",
        budget: 0,
        startDate: "",
        endDate: "",
        targeting: {
          countries: [],
          interests: [],
          minAge: 18,
          maxAge: 65,
        },
      });
      alert("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(
      campaigns.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              status: c.status === "active" ? "paused" : "active",
            }
          : c
      )
    );
  };

  const deleteCampaign = (campaignId: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns(campaigns.filter((c) => c.id !== campaignId));
    }
  };

  const filteredCampaigns =
    filterStatus === "all"
      ? campaigns
      : campaigns.filter((c) => c.status === filterStatus);

  const totalStats = campaigns.reduce(
    (acc, campaign) => ({
      totalSpent: acc.totalSpent + campaign.spent,
      totalImpressions: acc.totalImpressions + campaign.impressions,
      totalClicks: acc.totalClicks + campaign.clicks,
      totalConversions: acc.totalConversions + campaign.conversions,
    }),
    { totalSpent: 0, totalImpressions: 0, totalClicks: 0, totalConversions: 0 }
  );

  const avgCTR =
    totalStats.totalImpressions > 0
      ? (totalStats.totalClicks / totalStats.totalImpressions) * 100
      : 0;
  const avgCPC =
    totalStats.totalClicks > 0 ? totalStats.totalSpent / totalStats.totalClicks : 0;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg border border-gray-200 p-8">
        <Megaphone className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          Connect your wallet to access the Decentralized Advertising Platform
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Advertising Platform
            </h2>
            <p className="text-sm text-gray-600">
              Manage your crypto-based ad campaigns
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">SPENT</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${totalStats.totalSpent.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Avg CPC: ${avgCPC.toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <Eye className="w-8 h-8 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">IMPRESSIONS</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {(totalStats.totalImpressions / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Total views across campaigns
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <MousePointer className="w-8 h-8 text-green-600" />
            <span className="text-xs text-green-600 font-medium">CLICKS</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {totalStats.totalClicks.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">CTR: {avgCTR.toFixed(2)}%</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">CONVERSIONS</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {totalStats.totalConversions}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {((totalStats.totalConversions / totalStats.totalClicks) * 100).toFixed(1)}%
            conversion rate
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {["campaigns", "create", "analytics", "slots"].map((tab) => (
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

      {/* Campaigns Tab */}
      {activeTab === "campaigns" && (
        <div>
          {/* Filter */}
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Campaigns</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {campaign.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === "active"
                            ? "bg-green-100 text-green-700"
                            : campaign.status === "paused"
                            ? "bg-yellow-100 text-yellow-700"
                            : campaign.status === "completed"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {campaign.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {campaign.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-600">Budget: </span>
                        <span className="font-medium text-gray-900">
                          ${campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Spent: </span>
                        <span className="font-medium text-gray-900">
                          ${campaign.spent.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">CTR: </span>
                        <span className="font-medium text-gray-900">
                          {campaign.ctr.toFixed(2)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">CPC: </span>
                        <span className="font-medium text-gray-900">
                          ${campaign.cpc.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCampaignStatus(campaign.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={
                        campaign.status === "active" ? "Pause campaign" : "Activate campaign"
                      }
                    >
                      {campaign.status === "active" ? (
                        <PauseCircle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <PlayCircle className="w-5 h-5 text-green-600" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedCampaign(campaign)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View analytics"
                    >
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Delete campaign"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Budget Used</span>
                    <span>
                      {((campaign.spent / campaign.budget) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Impressions</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {(campaign.impressions / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Clicks</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {campaign.clicks.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Conversions</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {campaign.conversions}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {Math.ceil(
                        (campaign.endDate.getTime() - campaign.startDate.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}d
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No campaigns found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ad Slots Tab */}
      {activeTab === "slots" && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Available advertising slots on the platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adSlots.map((slot) => (
              <div
                key={slot.id}
                className={`border rounded-lg p-4 ${
                  slot.available
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">
                      {slot.location} - {slot.size}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {slot.price} tokens per impression
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      slot.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {slot.available ? "Available" : "Occupied"}
                  </span>
                </div>
                <button
                  disabled={!slot.available}
                  className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    slot.available
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {slot.available ? "Book Slot" : "Not Available"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Create New Campaign</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter campaign name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCampaign.description}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your campaign"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target URL *
                </label>
                <input
                  type="url"
                  value={newCampaign.targetUrl}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, targetUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (USD) *
                </label>
                <input
                  type="number"
                  value={newCampaign.budget || ""}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Targeting Options</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Age
                    </label>
                    <input
                      type="number"
                      value={newCampaign.targeting.minAge}
                      onChange={(e) =>
                        setNewCampaign({
                          ...newCampaign,
                          targeting: {
                            ...newCampaign.targeting,
                            minAge: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="18"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Age
                    </label>
                    <input
                      type="number"
                      value={newCampaign.targeting.maxAge}
                      onChange={(e) =>
                        setNewCampaign({
                          ...newCampaign,
                          targeting: {
                            ...newCampaign.targeting,
                            maxAge: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="18"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateCampaign}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Campaign"}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

