"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Zap,
  TrendingDown,
  Shield,
  Clock,
  Check,
  X,
  AlertCircle,
  DollarSign,
  ArrowRight,
  Settings,
  Info,
  Users,
  Award,
  Sparkles,
  Activity,
  Timer,
} from "lucide-react";

interface GaslessTransaction {
  id: string;
  type: "transfer" | "approve" | "swap" | "mint" | "stake";
  from: string;
  to: string;
  amount?: string;
  token?: string;
  timestamp: Date;
  status: "pending" | "processing" | "completed" | "failed";
  relayer: string;
  estimatedGas: string;
  savedGas: string;
  txHash?: string;
  meta?: any;
}

interface Relayer {
  id: string;
  name: string;
  address: string;
  reputation: number;
  totalTxs: number;
  successRate: number;
  avgProcessingTime: number; // seconds
  supportedNetworks: string[];
  isActive: boolean;
}

interface GasBalance {
  address: string;
  freeTransactions: number;
  monthlyLimit: number;
  used: number;
  resetDate: Date;
  tier: "free" | "basic" | "premium" | "enterprise";
}

export function GaslessTransactions() {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<GaslessTransaction[]>([]);
  const [relayers, setRelayers] = useState<Relayer[]>([]);
  const [gasBalance, setGasBalance] = useState<GasBalance | null>(null);
  const [selectedRelayer, setSelectedRelayer] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"send" | "history" | "relayers" | "settings">("send");

  // New Transaction Form
  const [newTx, setNewTx] = useState({
    type: "transfer" as "transfer" | "approve" | "swap" | "mint" | "stake",
    to: "",
    amount: "",
    token: "ETH",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const tierBenefits = {
    free: { limit: 5, features: ["Basic transfers", "Standard speed"] },
    basic: { limit: 50, features: ["All transaction types", "Standard speed", "Email support"] },
    premium: { limit: 500, features: ["Priority processing", "Advanced features", "24/7 support", "Analytics"] },
    enterprise: { limit: Infinity, features: ["Unlimited transactions", "Dedicated relayer", "SLA guarantee", "Custom integration"] },
  };

  // Mock data - Replace with blockchain data
  useEffect(() => {
    if (isConnected && address) {
      const mockRelayers: Relayer[] = [
        {
          id: "1",
          name: "FastRelay",
          address: "0x1234567890123456789012345678901234567890",
          reputation: 98,
          totalTxs: 15234,
          successRate: 99.2,
          avgProcessingTime: 12,
          supportedNetworks: ["Ethereum", "Polygon", "Base", "Arbitrum"],
          isActive: true,
        },
        {
          id: "2",
          name: "SecureRelay",
          address: "0x2345678901234567890123456789012345678901",
          reputation: 96,
          totalTxs: 12456,
          successRate: 98.8,
          avgProcessingTime: 15,
          supportedNetworks: ["Ethereum", "Base", "Optimism"],
          isActive: true,
        },
        {
          id: "3",
          name: "SpeedyRelay",
          address: "0x3456789012345678901234567890123456789012",
          reputation: 94,
          totalTxs: 9876,
          successRate: 97.5,
          avgProcessingTime: 8,
          supportedNetworks: ["Polygon", "Base", "Arbitrum", "Avalanche"],
          isActive: true,
        },
      ];
      setRelayers(mockRelayers);
      setSelectedRelayer(mockRelayers[0].id);

      const mockBalance: GasBalance = {
        address: address,
        freeTransactions: 3,
        monthlyLimit: 50,
        used: 27,
        resetDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        tier: "basic",
      };
      setGasBalance(mockBalance);

      const mockTransactions: GaslessTransaction[] = [
        {
          id: "1",
          type: "transfer",
          from: address,
          to: "0x9876...5432",
          amount: "0.5",
          token: "ETH",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: "completed",
          relayer: "FastRelay",
          estimatedGas: "0.002",
          savedGas: "0.002",
          txHash: "0xabc...def",
        },
        {
          id: "2",
          type: "approve",
          from: address,
          to: "0x1234...5678",
          token: "USDC",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          status: "completed",
          relayer: "SecureRelay",
          estimatedGas: "0.001",
          savedGas: "0.001",
          txHash: "0x123...456",
        },
        {
          id: "3",
          type: "swap",
          from: address,
          to: "0x5678...9012",
          amount: "100",
          token: "USDC → ETH",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          status: "processing",
          relayer: "FastRelay",
          estimatedGas: "0.003",
          savedGas: "0.003",
        },
      ];
      setTransactions(mockTransactions);
    }
  }, [address, isConnected]);

  const submitGaslessTransaction = async () => {
    if (!newTx.to || !newTx.amount || !selectedRelayer) {
      alert("Please fill in all required fields and select a relayer");
      return;
    }

    if (gasBalance && gasBalance.freeTransactions <= 0) {
      alert("You've reached your free transaction limit for this month");
      return;
    }

    setIsSubmitting(true);

    // Simulate transaction submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const relayer = relayers.find((r) => r.id === selectedRelayer);
    const tx: GaslessTransaction = {
      id: Date.now().toString(),
      type: newTx.type,
      from: address || "0x0000...0000",
      to: newTx.to,
      amount: newTx.amount,
      token: newTx.token,
      timestamp: new Date(),
      status: "processing",
      relayer: relayer?.name || "Unknown",
      estimatedGas: "0.002",
      savedGas: "0.002",
    };

    setTransactions([tx, ...transactions]);

    // Update gas balance
    if (gasBalance) {
      setGasBalance({
        ...gasBalance,
        freeTransactions: gasBalance.freeTransactions - 1,
        used: gasBalance.used + 1,
      });
    }

    setIsSubmitting(false);
    setNewTx({
      type: "transfer",
      to: "",
      amount: "",
      token: "ETH",
    });
    setActiveTab("history");

    // Simulate completion
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === tx.id
            ? {
                ...t,
                status: "completed",
                txHash: "0x" + Math.random().toString(16).substring(2, 42),
              }
            : t
        )
      );
    }, 5000);

    alert("Gasless transaction submitted successfully!");
  };

  const getStatusIcon = (status: GaslessTransaction["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="w-5 h-5 text-green-600" />;
      case "failed":
        return <X className="w-5 h-5 text-red-600" />;
      case "processing":
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const myTransactions = transactions.filter((t) => t.from === address);
  const totalSavedGas = myTransactions.reduce((sum, t) => sum + parseFloat(t.savedGas), 0);

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to use gasless transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gasless Transactions</h2>
            <p className="text-sm text-gray-600">Meta-transaction support with relayers</p>
          </div>
        </div>
        {gasBalance && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg px-4 py-3 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Free Transactions Left</div>
            <div className="text-3xl font-bold text-green-600">{gasBalance.freeTransactions}</div>
            <div className="text-xs text-gray-600 mt-1">
              {gasBalance.used}/{gasBalance.monthlyLimit} used this month
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{myTransactions.length}</div>
          <div className="text-sm text-gray-600">Total Transactions</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{totalSavedGas.toFixed(4)} ETH</div>
          <div className="text-sm text-gray-600">Gas Saved</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {myTransactions.filter((t) => t.status === "completed").length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{relayers.filter((r) => r.isActive).length}</div>
          <div className="text-sm text-gray-600">Active Relayers</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "send", label: "Send Transaction", icon: Zap },
          { id: "history", label: "History", icon: Clock },
          { id: "relayers", label: "Relayers", icon: Users },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Send Tab */}
      {activeTab === "send" && (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">No Gas Fees Required!</p>
                <p className="text-blue-700">
                  Your transaction will be processed by a trusted relayer who pays the gas fees for you.
                  You have {gasBalance?.freeTransactions} free transactions remaining this month.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[
                  { id: "transfer", label: "Transfer" },
                  { id: "approve", label: "Approve" },
                  { id: "swap", label: "Swap" },
                  { id: "mint", label: "Mint" },
                  { id: "stake", label: "Stake" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNewTx({ ...newTx, type: type.id as any })}
                    className={`p-3 border-2 rounded-lg transition-colors text-sm font-medium ${
                      newTx.type === type.id
                        ? "border-green-600 bg-green-50 text-green-900"
                        : "border-gray-300 hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
              <input
                type="text"
                value={newTx.to}
                onChange={(e) => setNewTx({ ...newTx, to: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0x..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newTx.amount}
                  onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Token</label>
                <select
                  value={newTx.token}
                  onChange={(e) => setNewTx({ ...newTx, token: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="ETH">ETH</option>
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                  <option value="DAI">DAI</option>
                  <option value="NOTE">NOTE</option>
                </select>
              </div>
            </div>

            {/* Relayer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Relayer</label>
              <div className="space-y-2">
                {relayers
                  .filter((r) => r.isActive)
                  .map((relayer) => (
                    <div
                      key={relayer.id}
                      onClick={() => setSelectedRelayer(relayer.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedRelayer === relayer.id
                          ? "border-green-600 bg-green-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{relayer.name}</h4>
                            {selectedRelayer === relayer.id && (
                              <Check className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Reputation:</span>
                              <div className="font-semibold text-gray-900">{relayer.reputation}%</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Success Rate:</span>
                              <div className="font-semibold text-gray-900">{relayer.successRate}%</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Avg Speed:</span>
                              <div className="font-semibold text-gray-900">{relayer.avgProcessingTime}s</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Gas Estimation */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Estimated Gas Fee:</span>
                <span className="text-lg font-bold text-gray-900">~0.002 ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-semibold">You Pay:</span>
                <span className="text-2xl font-bold text-green-600">0 ETH</span>
              </div>
              <div className="mt-2 text-xs text-gray-600 flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span>100% gas savings with gasless transactions!</span>
              </div>
            </div>

            <button
              onClick={submitGaslessTransaction}
              disabled={!newTx.to || !newTx.amount || !selectedRelayer || isSubmitting || (gasBalance?.freeTransactions || 0) <= 0}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Send Gasless Transaction
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {myTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transactions yet</p>
              <button
                onClick={() => setActiveTab("send")}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Send Your First Transaction
              </button>
            </div>
          ) : (
            myTransactions.map((tx) => (
              <div key={tx.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(tx.status)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 capitalize">{tx.type}</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          From: {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                        </div>
                        <div>
                          To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                        </div>
                        {tx.amount && (
                          <div>
                            Amount: {tx.amount} {tx.token}
                          </div>
                        )}
                        <div>Relayer: {tx.relayer}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-green-600 font-semibold">
                      <TrendingDown className="w-4 h-4" />
                      Saved {tx.savedGas} ETH
                    </div>
                  </div>
                </div>

                {tx.txHash && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Transaction Hash:</span>
                      <a
                        href={`https://basescan.org/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Relayers Tab */}
      {activeTab === "relayers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relayers.map((relayer) => (
            <div key={relayer.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{relayer.name}</h3>
                  <div className="text-sm text-gray-600 break-all">
                    {relayer.address.slice(0, 20)}...{relayer.address.slice(-10)}
                  </div>
                </div>
                {relayer.isActive && (
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">{relayer.reputation}%</div>
                  <div className="text-xs text-gray-600">Reputation</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">{relayer.successRate}%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{relayer.totalTxs.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Total TXs</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{relayer.avgProcessingTime}s</div>
                  <div className="text-xs text-gray-600">Avg Speed</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Supported Networks:</div>
                <div className="flex flex-wrap gap-2">
                  {relayer.supportedNetworks.map((network) => (
                    <span
                      key={network}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {network}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && gasBalance && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Current Tier */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Current Plan</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-purple-600 capitalize mb-1">{gasBalance.tier}</div>
                <div className="text-sm text-gray-600">
                  {gasBalance.used}/{gasBalance.monthlyLimit} transactions used this month
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Resets on</div>
                <div className="font-semibold text-gray-900">
                  {gasBalance.resetDate.toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${(gasBalance.used / gasBalance.monthlyLimit) * 100}%` }}
              />
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Features:</div>
              <ul className="space-y-1">
                {tierBenefits[gasBalance.tier].features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Upgrade Options */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upgrade Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(tierBenefits)
                .filter(([tier]) => tier !== gasBalance.tier)
                .map(([tier, benefits]) => (
                  <div
                    key={tier}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-purple-600 transition-colors"
                  >
                    <div className="text-xl font-bold text-gray-900 capitalize mb-2">{tier}</div>
                    <div className="text-3xl font-bold text-purple-600 mb-4">
                      {benefits.limit === Infinity ? "Unlimited" : benefits.limit}
                      <span className="text-sm text-gray-600 font-normal"> TXs/month</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {benefits.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Upgrade to {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

