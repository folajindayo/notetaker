"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther, Address } from "viem";
import {
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  RefreshCw,
  Pause,
  Play,
  Settings,
  Plus,
  ExternalLink,
  Bell,
  Crown,
  Zap,
  Gift,
} from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  description: string;
  provider: string;
  providerAddress: string;
  price: string;
  interval: "daily" | "weekly" | "monthly" | "yearly";
  token: string;
  status: "active" | "paused" | "cancelled" | "expired";
  startDate: number;
  nextPayment: number;
  totalPaid: string;
  paymentsCount: number;
  autoRenew: boolean;
  benefits: string[];
}

interface Plan {
  id: string;
  name: string;
  description: string;
  provider: string;
  price: string;
  interval: "monthly" | "yearly";
  token: string;
  features: string[];
  subscribers: number;
  popular: boolean;
  tier: "basic" | "pro" | "premium";
}

interface SubscriptionStats {
  activeSubscriptions: number;
  totalSpent: string;
  upcomingPayments: string;
  savedAmount: string;
}

export function SubscriptionService() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"subscriptions" | "browse" | "create" | "analytics">("subscriptions");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Create subscription plan form
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [planInterval, setPlanInterval] = useState<"monthly" | "yearly">("monthly");
  const [planFeatures, setPlanFeatures] = useState<string[]>([""]);
  const [isCreating, setIsCreating] = useState(false);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConnected && address) {
      loadSubscriptions();
      loadAvailablePlans();
      loadStats();
    }
  }, [isConnected, address]);

  const loadSubscriptions = () => {
    // Simulate loading user's subscriptions
    const mockSubscriptions: Subscription[] = [
      {
        id: "1",
        name: "Premium NFT Marketplace",
        description: "Access to exclusive NFT drops and zero trading fees",
        provider: "NFT Hub",
        providerAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        price: "0.05",
        interval: "monthly",
        token: "ETH",
        status: "active",
        startDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
        nextPayment: Date.now() + 5 * 24 * 60 * 60 * 1000,
        totalPaid: "0.15",
        paymentsCount: 3,
        autoRenew: true,
        benefits: ["Zero trading fees", "Early access to drops", "Priority support"],
      },
      {
        id: "2",
        name: "DeFi Analytics Pro",
        description: "Advanced analytics and portfolio tracking",
        provider: "DeFi Insights",
        providerAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        price: "0.1",
        interval: "monthly",
        token: "ETH",
        status: "active",
        startDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
        nextPayment: Date.now() + 15 * 24 * 60 * 60 * 1000,
        totalPaid: "0.2",
        paymentsCount: 2,
        autoRenew: true,
        benefits: ["Real-time alerts", "Advanced charts", "API access"],
      },
      {
        id: "3",
        name: "DAO Governance Tools",
        description: "Enhanced voting and proposal creation features",
        provider: "DAO Platform",
        providerAddress: "0x5555...9999",
        price: "0.02",
        interval: "monthly",
        token: "ETH",
        status: "paused",
        startDate: Date.now() - 120 * 24 * 60 * 60 * 1000,
        nextPayment: Date.now() + 30 * 24 * 60 * 60 * 1000,
        totalPaid: "0.08",
        paymentsCount: 4,
        autoRenew: false,
        benefits: ["Delegate voting", "Proposal templates", "Analytics"],
      },
    ];

    setSubscriptions(mockSubscriptions);
  };

  const loadAvailablePlans = () => {
    // Simulate loading available plans
    const mockPlans: Plan[] = [
      {
        id: "1",
        name: "Creator Basic",
        description: "Perfect for individual creators",
        provider: "Content Platform",
        price: "0.01",
        interval: "monthly",
        token: "ETH",
        features: ["10 posts/month", "Basic analytics", "Community access"],
        subscribers: 1234,
        popular: false,
        tier: "basic",
      },
      {
        id: "2",
        name: "Creator Pro",
        description: "For professional content creators",
        provider: "Content Platform",
        price: "0.05",
        interval: "monthly",
        token: "ETH",
        features: [
          "Unlimited posts",
          "Advanced analytics",
          "Priority support",
          "Monetization tools",
          "NFT minting",
        ],
        subscribers: 456,
        popular: true,
        tier: "pro",
      },
      {
        id: "3",
        name: "Web3 Studio Premium",
        description: "Complete suite for Web3 development",
        provider: "Dev Tools",
        price: "0.2",
        interval: "monthly",
        token: "ETH",
        features: [
          "All dev tools",
          "Cloud hosting",
          "Smart contract templates",
          "Audit assistance",
          "24/7 support",
        ],
        subscribers: 89,
        popular: false,
        tier: "premium",
      },
      {
        id: "4",
        name: "Trading Bot Pro",
        description: "Automated trading strategies",
        provider: "Trading Platform",
        price: "0.15",
        interval: "monthly",
        token: "ETH",
        features: [
          "10 active bots",
          "Custom strategies",
          "Backtesting",
          "Risk management",
          "Real-time signals",
        ],
        subscribers: 234,
        popular: true,
        tier: "pro",
      },
    ];

    setAvailablePlans(mockPlans);
  };

  const loadStats = () => {
    const mockStats: SubscriptionStats = {
      activeSubscriptions: 2,
      totalSpent: "0.35",
      upcomingPayments: "0.15",
      savedAmount: "0.05",
    };

    setStats(mockStats);
  };

  const handleSubscribe = async (plan: Plan) => {
    setIsSubscribing(true);
    setSelectedPlan(plan);

    try {
      // In a real implementation, this would call the subscription contract
      setTimeout(() => {
        const newSubscription: Subscription = {
          id: Date.now().toString(),
          name: plan.name,
          description: plan.description,
          provider: plan.provider,
          providerAddress: "0x123...",
          price: plan.price,
          interval: plan.interval,
          token: plan.token,
          status: "active",
          startDate: Date.now(),
          nextPayment: Date.now() + 30 * 24 * 60 * 60 * 1000,
          totalPaid: plan.price,
          paymentsCount: 1,
          autoRenew: true,
          benefits: plan.features,
        };

        setSubscriptions([newSubscription, ...subscriptions]);
        setIsSubscribing(false);
        setSelectedPlan(null);
        setActiveTab("subscriptions");
      }, 3000);
    } catch (error) {
      console.error("Subscription failed:", error);
      setIsSubscribing(false);
    }
  };

  const handleToggleSubscription = (subscriptionId: string, newStatus: "active" | "paused") => {
    const updated = subscriptions.map((sub) =>
      sub.id === subscriptionId ? { ...sub, status: newStatus } : sub
    );
    setSubscriptions(updated);
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    const updated = subscriptions.map((sub) =>
      sub.id === subscriptionId ? { ...sub, status: "cancelled" as const } : sub
    );
    setSubscriptions(updated);
  };

  const getDaysUntilNextPayment = (nextPayment: number) => {
    return Math.floor((nextPayment - Date.now()) / (24 * 60 * 60 * 1000));
  };

  const getIntervalLabel = (interval: string) => {
    return interval.charAt(0).toUpperCase() + interval.slice(1);
  };

  const getTierColor = (tier: Plan["tier"]) => {
    const colors: Record<Plan["tier"], string> = {
      basic: "from-gray-400 to-gray-500",
      pro: "from-blue-500 to-purple-600",
      premium: "from-yellow-400 to-orange-500",
    };
    return colors[tier];
  };

  const getStatusColor = (status: Subscription["status"]) => {
    const colors: Record<Subscription["status"], string> = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-sm text-gray-600">
            Please connect your wallet to manage subscriptions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Subscription Service
            </h1>
            <p className="text-sm text-gray-600">
              Manage your crypto subscriptions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.activeSubscriptions}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalSpent}
                </p>
                <p className="text-xs text-gray-500">ETH</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Next Payments</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.upcomingPayments}
                </p>
                <p className="text-xs text-gray-500">ETH</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Saved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.savedAmount}
                </p>
                <p className="text-xs text-gray-500">ETH</p>
              </div>
              <Gift className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "subscriptions"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          My Subscriptions ({subscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab("browse")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "browse"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Browse Plans
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "create"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Create Plan
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "analytics"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Subscriptions Tab */}
      {activeTab === "subscriptions" && (
        <div className="space-y-4">
          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Subscriptions Yet
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Browse available plans and subscribe
              </p>
              <button
                onClick={() => setActiveTab("browse")}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Browse Plans
              </button>
            </div>
          ) : (
            subscriptions.map((subscription) => {
              const daysUntilPayment = getDaysUntilNextPayment(subscription.nextPayment);
              const isPaymentSoon = daysUntilPayment <= 7;

              return (
                <div
                  key={subscription.id}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {subscription.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            subscription.status
                          )}`}
                        >
                          {subscription.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {subscription.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Provider: {subscription.provider}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {subscription.price} {subscription.token}
                      </div>
                      <div className="text-xs text-gray-500">
                        /{subscription.interval}
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-600">Next Payment</div>
                      <div
                        className={`text-sm font-semibold ${
                          isPaymentSoon ? "text-orange-600" : "text-gray-900"
                        }`}
                      >
                        {isPaymentSoon && <Bell className="h-3 w-3 inline mr-1" />}
                        {daysUntilPayment} days
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Total Paid</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {subscription.totalPaid} {subscription.token}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Payments</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {subscription.paymentsCount}
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      Benefits:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subscription.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {subscription.status === "active" && (
                      <button
                        onClick={() =>
                          handleToggleSubscription(subscription.id, "paused")
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Pause className="h-4 w-4" />
                        Pause
                      </button>
                    )}
                    {subscription.status === "paused" && (
                      <button
                        onClick={() =>
                          handleToggleSubscription(subscription.id, "active")
                        }
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Resume
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelSubscription(subscription.id)}
                      className="flex-1 px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Browse Plans Tab */}
      {activeTab === "browse" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availablePlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white border-2 rounded-lg p-6 hover:shadow-lg transition-shadow ${
                plan.popular ? "border-purple-500" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="mb-4">
                  <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`w-12 h-12 bg-gradient-to-r ${getTierColor(
                  plan.tier
                )} rounded-lg flex items-center justify-center text-white text-2xl mb-4`}
              >
                {plan.tier === "premium" ? "👑" : plan.tier === "pro" ? "⭐" : "📦"}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  {plan.price} {plan.token}
                </div>
                <div className="text-sm text-gray-500">/{plan.interval}</div>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  {plan.subscribers.toLocaleString()} subscribers
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={isSubscribing}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubscribing && selectedPlan?.id === plan.id ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Subscribe Now
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Plan Tab */}
      {activeTab === "create" && (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Create Subscription Plan
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Enter plan name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                placeholder="Describe your subscription plan..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (ETH)
                </label>
                <input
                  type="number"
                  value={planPrice}
                  onChange={(e) => setPlanPrice(e.target.value)}
                  placeholder="0.05"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Interval
                </label>
                <select
                  value={planInterval}
                  onChange={(e) =>
                    setPlanInterval(e.target.value as "monthly" | "yearly")
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="space-y-2">
                {planFeatures.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const updated = [...planFeatures];
                        updated[idx] = e.target.value;
                        setPlanFeatures(updated);
                      }}
                      placeholder="Enter a feature..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {planFeatures.length > 1 && (
                      <button
                        onClick={() =>
                          setPlanFeatures(planFeatures.filter((_, i) => i !== idx))
                        }
                        className="px-3 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setPlanFeatures([...planFeatures, ""])}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Feature
                </button>
              </div>
            </div>

            <button
              disabled={!planName || !planDescription || !planPrice || isCreating}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Creating Plan...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Plan
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Spending Overview
            </h3>
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8 h-64">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Spending analytics chart</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Subscriptions by Category
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Content & Media", count: 2, color: "bg-blue-500" },
                  { name: "Dev Tools", count: 1, color: "bg-purple-500" },
                  { name: "Analytics", count: 1, color: "bg-green-500" },
                ].map((category) => (
                  <div key={category.name} className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${category.color} rounded-full`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {category.count}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment History
              </h3>
              <div className="space-y-2">
                {[
                  { date: "2024-11-01", amount: "0.05", service: "NFT Hub" },
                  { date: "2024-10-15", amount: "0.1", service: "DeFi Insights" },
                  { date: "2024-10-01", amount: "0.05", service: "NFT Hub" },
                ].map((payment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.service}
                      </div>
                      <div className="text-xs text-gray-500">{payment.date}</div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {payment.amount} ETH
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

