"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Coins,
  TrendingUp,
  Users,
  Zap,
  DollarSign,
  BarChart3,
  Settings,
  Upload,
  Award,
  Share2,
  Lock,
  Unlock,
  ArrowUpDown,
  Plus,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface SocialToken {
  id: string;
  name: string;
  symbol: string;
  creator: string;
  contractAddress: string;
  totalSupply: string;
  currentPrice: string;
  marketCap: string;
  holders: number;
  description: string;
  logoUrl: string;
  website?: string;
  twitter?: string;
  discord?: string;
  createdAt: Date;
  features: {
    transferable: boolean;
    burnable: boolean;
    mintable: boolean;
    pausable: boolean;
  };
  utility: string[];
  tokenomics: {
    initialSupply: string;
    maxSupply: string;
    distributionPlan: { category: string; percentage: number }[];
  };
}

interface TokenTransaction {
  id: string;
  tokenId: string;
  type: "mint" | "burn" | "transfer" | "buy" | "sell";
  from: string;
  to: string;
  amount: string;
  price?: string;
  timestamp: Date;
  txHash: string;
}

interface TokenHolder {
  id: string;
  tokenId: string;
  address: string;
  balance: string;
  percentage: number;
  value: string;
}

export function SocialTokenCreator() {
  const { address, isConnected } = useAccount();
  const [tokens, setTokens] = useState<SocialToken[]>([]);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [selectedToken, setSelectedToken] = useState<SocialToken | null>(null);
  const [activeTab, setActiveTab] = useState<"marketplace" | "create" | "myTokens" | "analytics">("marketplace");

  const [newToken, setNewToken] = useState({
    name: "",
    symbol: "",
    description: "",
    totalSupply: "",
    initialPrice: "",
    logoUrl: "",
    website: "",
    twitter: "",
    discord: "",
    transferable: true,
    burnable: false,
    mintable: true,
    pausable: true,
    utility: "",
  });

  const [distribution, setDistribution] = useState([
    { category: "Public Sale", percentage: 40 },
    { category: "Team", percentage: 20 },
    { category: "Community Rewards", percentage: 25 },
    { category: "Treasury", percentage: 15 },
  ]);

  useEffect(() => {
    const mockTokens: SocialToken[] = [
      {
        id: "1",
        name: "Creator Token",
        symbol: "CREATE",
        creator: "0x1111...2222",
        contractAddress: "0x1234567890123456789012345678901234567890",
        totalSupply: "1000000",
        currentPrice: "0.05",
        marketCap: "50000",
        holders: 234,
        description: "Token for supporting digital creators and accessing exclusive content",
        logoUrl: "https://placehold.co/100x100/6366f1/white?text=CREATE",
        website: "https://example.com",
        twitter: "@creatortoken",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        features: {
          transferable: true,
          burnable: true,
          mintable: false,
          pausable: true,
        },
        utility: ["Access to exclusive content", "Voting rights", "Revenue sharing"],
        tokenomics: {
          initialSupply: "1000000",
          maxSupply: "1000000",
          distributionPlan: [
            { category: "Public Sale", percentage: 40 },
            { category: "Team", percentage: 20 },
            { category: "Community", percentage: 25 },
            { category: "Treasury", percentage: 15 },
          ],
        },
      },
      {
        id: "2",
        name: "Community Coin",
        symbol: "COMM",
        creator: address || "0x3333...4444",
        contractAddress: "0x2345678901234567890123456789012345678901",
        totalSupply: "5000000",
        currentPrice: "0.02",
        marketCap: "100000",
        holders: 567,
        description: "Community-driven token with governance features",
        logoUrl: "https://placehold.co/100x100/10b981/white?text=COMM",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        features: {
          transferable: true,
          burnable: false,
          mintable: true,
          pausable: false,
        },
        utility: ["Governance voting", "Staking rewards", "Platform discounts"],
        tokenomics: {
          initialSupply: "2000000",
          maxSupply: "5000000",
          distributionPlan: [
            { category: "Public Sale", percentage: 50 },
            { category: "Team", percentage: 15 },
            { category: "Rewards", percentage: 30 },
            { category: "Treasury", percentage: 5 },
          ],
        },
      },
    ];
    setTokens(mockTokens);

    const mockTransactions: TokenTransaction[] = [
      {
        id: "1",
        tokenId: "2",
        type: "mint",
        from: "0x0000000000000000000000000000000000000000",
        to: address || "0x5555...6666",
        amount: "1000",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        txHash: "0xabc...def",
      },
      {
        id: "2",
        tokenId: "1",
        type: "buy",
        from: address || "0x5555...6666",
        to: "0x7777...8888",
        amount: "500",
        price: "0.05",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        txHash: "0x123...456",
      },
    ];
    setTransactions(mockTransactions);

    const mockHolders: TokenHolder[] = [
      {
        id: "1",
        tokenId: "2",
        address: address || "0x5555...6666",
        balance: "50000",
        percentage: 5,
        value: "1000",
      },
      {
        id: "2",
        tokenId: "2",
        address: "0x9999...0000",
        balance: "100000",
        percentage: 10,
        value: "2000",
      },
    ];
    setHolders(mockHolders);
  }, [address]);

  const createToken = async () => {
    if (!newToken.name || !newToken.symbol || !newToken.totalSupply || !newToken.initialPrice) {
      alert("Please fill in all required fields");
      return;
    }

    const token: SocialToken = {
      id: Date.now().toString(),
      name: newToken.name,
      symbol: newToken.symbol,
      creator: address || "0x0000...0000",
      contractAddress: "0x" + Math.random().toString(16).substring(2, 42),
      totalSupply: newToken.totalSupply,
      currentPrice: newToken.initialPrice,
      marketCap: (parseFloat(newToken.totalSupply) * parseFloat(newToken.initialPrice)).toString(),
      holders: 1,
      description: newToken.description,
      logoUrl: newToken.logoUrl || "https://placehold.co/100x100/8b5cf6/white?text=" + newToken.symbol,
      website: newToken.website || undefined,
      twitter: newToken.twitter || undefined,
      discord: newToken.discord || undefined,
      createdAt: new Date(),
      features: {
        transferable: newToken.transferable,
        burnable: newToken.burnable,
        mintable: newToken.mintable,
        pausable: newToken.pausable,
      },
      utility: newToken.utility.split(",").map((u) => u.trim()).filter((u) => u),
      tokenomics: {
        initialSupply: newToken.totalSupply,
        maxSupply: newToken.totalSupply,
        distributionPlan: distribution,
      },
    };

    setTokens([token, ...tokens]);
    setNewToken({
      name: "",
      symbol: "",
      description: "",
      totalSupply: "",
      initialPrice: "",
      logoUrl: "",
      website: "",
      twitter: "",
      discord: "",
      transferable: true,
      burnable: false,
      mintable: true,
      pausable: true,
      utility: "",
    });
    setActiveTab("myTokens");
    alert("Social token created successfully! 🎉");
  };

  const updateDistribution = (index: number, value: number) => {
    const newDist = [...distribution];
    newDist[index].percentage = value;
    
    // Ensure total is 100%
    const total = newDist.reduce((sum, d) => sum + d.percentage, 0);
    if (total <= 100) {
      setDistribution(newDist);
    }
  };

  const myTokens = tokens.filter((t) => t.creator === address);
  const myHoldings = holders.filter((h) => h.address === address);

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to create social tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Coins className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Social Token Creator</h2>
            <p className="text-sm text-gray-600">Launch your personal token in minutes</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab("create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Token
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{tokens.length}</div>
          <div className="text-sm text-gray-600">Total Tokens</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{myTokens.length}</div>
          <div className="text-sm text-gray-600">My Tokens</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{myHoldings.length}</div>
          <div className="text-sm text-gray-600">My Holdings</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {tokens.reduce((sum, t) => sum + t.holders, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Holders</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "marketplace", label: "Marketplace", icon: Coins },
          { id: "create", label: "Create Token", icon: Plus },
          { id: "myTokens", label: "My Tokens", icon: Award },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "marketplace" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <div
              key={token.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedToken(token)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={token.logoUrl}
                    alt={token.symbol}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{token.name}</h3>
                    <p className="text-sm text-gray-600">${token.symbol}</p>
                  </div>
                </div>
                {token.creator === address && (
                  <Award className="w-5 h-5 text-yellow-600" />
                )}
              </div>

              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{token.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Price</div>
                  <div className="text-lg font-bold text-blue-600">${token.currentPrice}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Market Cap</div>
                  <div className="text-lg font-bold text-green-600">${parseFloat(token.marketCap).toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{token.holders} holders</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">+12.5%</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Buy
                </button>
                <button className="flex-1 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "create" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Launch Your Social Token</p>
                <p className="text-blue-700">
                  Create a token to build your creator economy, reward supporters, and enable governance in your community.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Token Name *</label>
              <input
                type="text"
                value={newToken.name}
                onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Creator Token"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symbol *</label>
              <input
                type="text"
                value={newToken.symbol}
                onChange={(e) => setNewToken({ ...newToken, symbol: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="CREATE"
                maxLength={10}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={newToken.description}
              onChange={(e) => setNewToken({ ...newToken, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[100px]"
              placeholder="Describe your token's purpose and utility..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Supply *</label>
              <input
                type="number"
                value={newToken.totalSupply}
                onChange={(e) => setNewToken({ ...newToken, totalSupply: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="1000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Price (USD) *</label>
              <input
                type="number"
                step="0.01"
                value={newToken.initialPrice}
                onChange={(e) => setNewToken({ ...newToken, initialPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="0.10"
              />
            </div>
          </div>

          {newToken.totalSupply && newToken.initialPrice && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-700 mb-1">Initial Market Cap</div>
              <div className="text-3xl font-bold text-green-600">
                ${(parseFloat(newToken.totalSupply) * parseFloat(newToken.initialPrice)).toLocaleString()}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Token Utility (comma-separated)</label>
            <input
              type="text"
              value={newToken.utility}
              onChange={(e) => setNewToken({ ...newToken, utility: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Governance, Staking rewards, Access to content"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
              <input
                type="url"
                value={newToken.logoUrl}
                onChange={(e) => setNewToken({ ...newToken, logoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={newToken.website}
                onChange={(e) => setNewToken({ ...newToken, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
              <input
                type="text"
                value={newToken.twitter}
                onChange={(e) => setNewToken({ ...newToken, twitter: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="@username"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Token Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "transferable", label: "Transferable", icon: ArrowUpDown },
                { key: "burnable", label: "Burnable", icon: Zap },
                { key: "mintable", label: "Mintable", icon: Plus },
                { key: "pausable", label: "Pausable", icon: Lock },
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={key}
                    checked={newToken[key as keyof typeof newToken] as boolean}
                    onChange={(e) => setNewToken({ ...newToken, [key]: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <label htmlFor={key} className="text-sm text-gray-700 flex items-center gap-1">
                    <Icon className="w-4 h-4" />
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Distribution Plan</h3>
            <div className="space-y-3">
              {distribution.map((dist, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    type="text"
                    value={dist.category}
                    onChange={(e) => {
                      const newDist = [...distribution];
                      newDist[index].category = e.target.value;
                      setDistribution(newDist);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={dist.percentage}
                    onChange={(e) => updateDistribution(index, parseFloat(e.target.value) || 0)}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <span className="text-gray-600 w-8">%</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold text-gray-900 pt-2 border-t">
                <span>Total:</span>
                <span>{distribution.reduce((sum, d) => sum + d.percentage, 0)}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={createToken}
            disabled={distribution.reduce((sum, d) => sum + d.percentage, 0) !== 100}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-2"
          >
            <Coins className="w-6 h-6" />
            Launch Social Token
          </button>
        </div>
      )}

      {activeTab === "myTokens" && (
        <div className="space-y-4">
          {myTokens.length === 0 ? (
            <div className="text-center py-12">
              <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You haven't created any tokens yet</p>
              <button
                onClick={() => setActiveTab("create")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Token
              </button>
            </div>
          ) : (
            myTokens.map((token) => (
              <div key={token.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img src={token.logoUrl} alt={token.symbol} className="w-16 h-16 rounded-full" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{token.name}</h3>
                      <p className="text-sm text-gray-600">${token.symbol}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {token.contractAddress.slice(0, 10)}...{token.contractAddress.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">${token.currentPrice}</div>
                    <div className="text-xs text-gray-600">Price</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{token.holders}</div>
                    <div className="text-xs text-gray-600">Holders</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{token.totalSupply}</div>
                    <div className="text-xs text-gray-600">Supply</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">${parseFloat(token.marketCap).toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Market Cap</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    View Analytics
                  </button>
                  <button className="flex-1 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                    Manage
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                ${tokens.reduce((sum, t) => sum + parseFloat(t.marketCap), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Market Cap</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">{transactions.length}</div>
              <div className="text-sm text-gray-600">Total Transactions</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {tokens.reduce((sum, t) => sum + t.holders, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Token Holders</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-2">
              {transactions.slice(0, 10).map((tx) => {
                const token = tokens.find((t) => t.id === tx.tokenId);
                return (
                  <div key={tx.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        tx.type === "mint" ? "bg-green-100" :
                        tx.type === "burn" ? "bg-red-100" :
                        tx.type === "buy" ? "bg-blue-100" :
                        "bg-purple-100"
                      }`}>
                        {tx.type === "mint" ? <Plus className="w-4 h-4 text-green-600" /> :
                         tx.type === "burn" ? <Zap className="w-4 h-4 text-red-600" /> :
                         <ArrowUpDown className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 capitalize">{tx.type}</div>
                        <div className="text-sm text-gray-600">
                          {tx.amount} {token?.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-900">{tx.timestamp.toLocaleString()}</div>
                      {tx.price && (
                        <div className="text-sm text-green-600">${tx.price}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

