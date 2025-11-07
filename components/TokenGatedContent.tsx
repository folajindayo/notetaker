"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatEther, parseEther } from "viem";
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Shield,
  Coins,
  Users,
  Settings,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";

interface TokenRequirement {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  minAmount: string;
  tokenType: "ERC20" | "ERC721" | "ERC1155";
  tokenId?: string; // For NFTs
}

interface GatedContent {
  id: string;
  title: string;
  description: string;
  content: string;
  creator: string;
  requirements: TokenRequirement[];
  accessCount: number;
  createdAt: Date;
  expiresAt?: Date;
  isPremium: boolean;
  category: string;
}

interface AccessLog {
  id: string;
  contentId: string;
  userAddress: string;
  timestamp: Date;
  method: string;
}

export function TokenGatedContent() {
  const { address, isConnected } = useAccount();
  const [contents, setContents] = useState<GatedContent[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [selectedContent, setSelectedContent] = useState<GatedContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [hasAccess, setHasAccess] = useState<{ [key: string]: boolean }>({});
  const [checkingAccess, setCheckingAccess] = useState<{ [key: string]: boolean }>({});

  // New Content Form State
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    content: "",
    category: "articles",
    isPremium: false,
    expiresAt: "",
  });
  const [requirements, setRequirements] = useState<TokenRequirement[]>([]);
  const [newRequirement, setNewRequirement] = useState({
    tokenAddress: "",
    tokenSymbol: "",
    minAmount: "",
    tokenType: "ERC20" as "ERC20" | "ERC721" | "ERC1155",
    tokenId: "",
  });

  const [activeTab, setActiveTab] = useState<"browse" | "create" | "myContent" | "analytics">("browse");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["all", "articles", "videos", "courses", "premium", "exclusive"];

  // Mock data - Replace with blockchain data
  useEffect(() => {
    const mockContents: GatedContent[] = [
      {
        id: "1",
        title: "Premium Trading Strategies",
        description: "Advanced crypto trading strategies for holders",
        content: "This exclusive content reveals advanced trading strategies...",
        creator: "0x1234...5678",
        requirements: [
          {
            id: "1",
            tokenAddress: "0x1234567890123456789012345678901234567890",
            tokenSymbol: "NOTE",
            minAmount: "100",
            tokenType: "ERC20",
          },
        ],
        accessCount: 234,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isPremium: true,
        category: "articles",
      },
      {
        id: "2",
        title: "NFT Collector's Guide",
        description: "Exclusive guide for NFT holders",
        content: "Learn the secrets of NFT collecting...",
        creator: "0x8765...4321",
        requirements: [
          {
            id: "2",
            tokenAddress: "0x2345678901234567890123456789012345678901",
            tokenSymbol: "BAYC",
            minAmount: "1",
            tokenType: "ERC721",
          },
        ],
        accessCount: 89,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isPremium: false,
        category: "courses",
      },
      {
        id: "3",
        title: "Web3 Development Masterclass",
        description: "Complete Web3 development course",
        content: "Master Web3 development with this comprehensive course...",
        creator: address || "0x9999...8888",
        requirements: [
          {
            id: "3",
            tokenAddress: "0x3456789012345678901234567890123456789012",
            tokenSymbol: "DEV",
            minAmount: "50",
            tokenType: "ERC20",
          },
        ],
        accessCount: 456,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        isPremium: true,
        category: "courses",
      },
    ];
    setContents(mockContents);

    // Mock access logs
    const mockLogs: AccessLog[] = [
      {
        id: "1",
        contentId: "1",
        userAddress: address || "0x1111...2222",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        method: "Token Verification",
      },
      {
        id: "2",
        contentId: "3",
        userAddress: address || "0x1111...2222",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        method: "Token Verification",
      },
    ];
    setAccessLogs(mockLogs);
  }, [address]);

  // Check access for content
  const checkAccess = async (content: GatedContent) => {
    if (!address) return false;

    setCheckingAccess({ ...checkingAccess, [content.id]: true });

    // Simulate checking token balances
    // In production, use wagmi's useReadContract to check actual balances
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock: Grant access randomly for demo
    const hasRequiredTokens = Math.random() > 0.5;

    setHasAccess({ ...hasAccess, [content.id]: hasRequiredTokens });
    setCheckingAccess({ ...checkingAccess, [content.id]: false });

    if (hasRequiredTokens) {
      // Log access
      const newLog: AccessLog = {
        id: Date.now().toString(),
        contentId: content.id,
        userAddress: address,
        timestamp: new Date(),
        method: "Token Verification",
      };
      setAccessLogs([...accessLogs, newLog]);

      // Update access count
      setContents(
        contents.map((c) =>
          c.id === content.id ? { ...c, accessCount: c.accessCount + 1 } : c
        )
      );
    }

    return hasRequiredTokens;
  };

  const viewContent = async (content: GatedContent) => {
    const access = await checkAccess(content);
    if (access) {
      setSelectedContent(content);
    }
  };

  const addRequirement = () => {
    if (!newRequirement.tokenAddress || !newRequirement.tokenSymbol || !newRequirement.minAmount) {
      return;
    }

    const requirement: TokenRequirement = {
      id: Date.now().toString(),
      ...newRequirement,
    };

    setRequirements([...requirements, requirement]);
    setNewRequirement({
      tokenAddress: "",
      tokenSymbol: "",
      minAmount: "",
      tokenType: "ERC20",
      tokenId: "",
    });
  };

  const removeRequirement = (id: string) => {
    setRequirements(requirements.filter((r) => r.id !== id));
  };

  const createContent = () => {
    if (!newContent.title || !newContent.content || requirements.length === 0) {
      return;
    }

    const content: GatedContent = {
      id: Date.now().toString(),
      ...newContent,
      creator: address || "0x0000...0000",
      requirements,
      accessCount: 0,
      createdAt: new Date(),
      expiresAt: newContent.expiresAt ? new Date(newContent.expiresAt) : undefined,
    };

    setContents([content, ...contents]);
    setNewContent({
      title: "",
      description: "",
      content: "",
      category: "articles",
      isPremium: false,
      expiresAt: "",
    });
    setRequirements([]);
    setIsCreating(false);
    setActiveTab("myContent");
  };

  const filteredContents = contents.filter((content) => {
    const matchesCategory = filterCategory === "all" || content.category === filterCategory;
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const myContents = contents.filter((c) => c.creator === address);

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to access token-gated content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Lock className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Token-Gated Content</h2>
            <p className="text-sm text-gray-600">Exclusive content for token holders</p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setActiveTab("create");
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Create Gated Content
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "browse", label: "Browse", icon: Eye },
          { id: "create", label: "Create", icon: Lock },
          { id: "myContent", label: "My Content", icon: Shield },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Browse Tab */}
      {activeTab === "browse" && (
        <div>
          {/* Filters */}
          <div className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContents.map((content) => (
              <div key={content.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{content.title}</h3>
                    <p className="text-sm text-gray-600">{content.description}</p>
                  </div>
                  {content.isPremium && (
                    <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  )}
                </div>

                {/* Requirements */}
                <div className="mb-3 space-y-2">
                  {content.requirements.map((req) => (
                    <div key={req.id} className="flex items-center gap-2 text-sm bg-gray-50 rounded px-2 py-1">
                      <Coins className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700">
                        {req.minAmount} {req.tokenSymbol}
                      </span>
                      <span className="text-gray-400">({req.tokenType})</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{content.accessCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor((Date.now() - content.createdAt.getTime()) / (24 * 60 * 60 * 1000))}d ago</span>
                  </div>
                </div>

                {/* Access Button */}
                <button
                  onClick={() => viewContent(content)}
                  disabled={checkingAccess[content.id]}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {checkingAccess[content.id] ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Checking Access...
                    </>
                  ) : hasAccess[content.id] ? (
                    <>
                      <Unlock className="w-4 h-4" />
                      View Content
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Verify Access
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Tab */}
      {activeTab === "create" && (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Premium Trading Guide"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={newContent.description}
                onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Short description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={newContent.content}
                onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[200px]"
                placeholder="Your exclusive content..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newContent.category}
                  onChange={(e) => setNewContent({ ...newContent, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.filter((c) => c !== "all").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expires At (Optional)</label>
                <input
                  type="date"
                  value={newContent.expiresAt}
                  onChange={(e) => setNewContent({ ...newContent, expiresAt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPremium"
                checked={newContent.isPremium}
                onChange={(e) => setNewContent({ ...newContent, isPremium: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="isPremium" className="text-sm text-gray-700">
                Mark as Premium Content
              </label>
            </div>

            {/* Token Requirements */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Token Requirements</h3>

              <div className="space-y-3 mb-4">
                {requirements.map((req) => (
                  <div key={req.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <Coins className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {req.minAmount} {req.tokenSymbol}
                        </div>
                        <div className="text-sm text-gray-600">{req.tokenType}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeRequirement(req.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Token Symbol</label>
                    <input
                      type="text"
                      value={newRequirement.tokenSymbol}
                      onChange={(e) => setNewRequirement({ ...newRequirement, tokenSymbol: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="NOTE"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Minimum Amount</label>
                    <input
                      type="text"
                      value={newRequirement.minAmount}
                      onChange={(e) => setNewRequirement({ ...newRequirement, minAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Token Address</label>
                  <input
                    type="text"
                    value={newRequirement.tokenAddress}
                    onChange={(e) => setNewRequirement({ ...newRequirement, tokenAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="0x..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Token Type</label>
                  <select
                    value={newRequirement.tokenType}
                    onChange={(e) => setNewRequirement({ ...newRequirement, tokenType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="ERC20">ERC-20 (Fungible Token)</option>
                    <option value="ERC721">ERC-721 (NFT)</option>
                    <option value="ERC1155">ERC-1155 (Multi-Token)</option>
                  </select>
                </div>

                <button
                  onClick={addRequirement}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Add Requirement
                </button>
              </div>
            </div>

            <button
              onClick={createContent}
              disabled={!newContent.title || !newContent.content || requirements.length === 0}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              <Lock className="w-5 h-5" />
              Create Gated Content
            </button>
          </div>
        </div>
      )}

      {/* My Content Tab */}
      {activeTab === "myContent" && (
        <div className="space-y-4">
          {myContents.length === 0 ? (
            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You haven't created any gated content yet</p>
              <button
                onClick={() => setActiveTab("create")}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Your First Content
              </button>
            </div>
          ) : (
            myContents.map((content) => (
              <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{content.title}</h3>
                    <p className="text-sm text-gray-600">{content.description}</p>
                  </div>
                  {content.isPremium && (
                    <Star className="w-5 h-5 text-yellow-500" />
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{content.accessCount}</div>
                    <div className="text-xs text-gray-600">Total Views</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{content.requirements.length}</div>
                    <div className="text-xs text-gray-600">Requirements</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {content.expiresAt ? Math.floor((content.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : "∞"}
                    </div>
                    <div className="text-xs text-gray-600">Days Left</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    View Analytics
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600 mb-1">{contents.length}</div>
              <div className="text-sm text-gray-600">Total Content</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {contents.reduce((sum, c) => sum + c.accessCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600 mb-1">{myContents.length}</div>
              <div className="text-sm text-gray-600">My Content</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {accessLogs.filter((log) => log.userAddress === address).length}
              </div>
              <div className="text-sm text-gray-600">My Views</div>
            </div>
          </div>

          {/* Recent Access Logs */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Recent Access Logs</h3>
            <div className="space-y-2">
              {accessLogs.slice(-10).reverse().map((log) => (
                <div key={log.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {contents.find((c) => c.id === log.contentId)?.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {log.userAddress.slice(0, 6)}...{log.userAddress.slice(-4)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Viewer Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedContent.title}</h2>
                  <p className="text-gray-600">{selectedContent.description}</p>
                </div>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedContent.content}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{selectedContent.accessCount} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{selectedContent.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

