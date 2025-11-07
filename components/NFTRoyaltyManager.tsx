"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Crown,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  Settings,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Percent,
  Wallet,
  Share2,
  FileText,
  Filter,
  Search,
  ExternalLink,
} from "lucide-react";

interface NFTCollection {
  id: string;
  name: string;
  contractAddress: string;
  totalSupply: number;
  floorPrice: number;
  volumeTraded: number;
  royaltyPercentage: number;
  totalRoyaltiesEarned: number;
  pendingRoyalties: number;
  lastClaimDate: Date | null;
  createdAt: Date;
}

interface RoyaltyTransaction {
  id: string;
  collectionId: string;
  collectionName: string;
  tokenId: number;
  salePrice: number;
  royaltyAmount: number;
  buyer: string;
  seller: string;
  marketplace: string;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
  txHash: string;
}

interface Beneficiary {
  id: string;
  address: string;
  name: string;
  percentage: number;
  totalEarned: number;
  role: string;
}

interface RoyaltySplit {
  collectionId: string;
  beneficiaries: Beneficiary[];
}

export function NFTRoyaltyManager() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"overview" | "collections" | "transactions" | "splits">(
    "overview"
  );
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [transactions, setTransactions] = useState<RoyaltyTransaction[]>([]);
  const [royaltySplits, setRoyaltySplits] = useState<RoyaltySplit[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadData();
    }
  }, [isConnected, address]);

  const loadData = () => {
    setIsLoading(true);

    // Mock collections
    const mockCollections: NFTCollection[] = [
      {
        id: "1",
        name: "Crypto Punks Genesis",
        contractAddress: "0x1234...5678",
        totalSupply: 10000,
        floorPrice: 2.5,
        volumeTraded: 125000,
        royaltyPercentage: 5,
        totalRoyaltiesEarned: 6250,
        pendingRoyalties: 125.5,
        lastClaimDate: new Date("2024-01-15"),
        createdAt: new Date("2023-01-01"),
      },
      {
        id: "2",
        name: "Bored Apes Club",
        contractAddress: "0xabcd...efgh",
        totalSupply: 5000,
        floorPrice: 5.2,
        volumeTraded: 89000,
        royaltyPercentage: 7.5,
        totalRoyaltiesEarned: 6675,
        pendingRoyalties: 320.8,
        lastClaimDate: new Date("2024-01-10"),
        createdAt: new Date("2023-03-15"),
      },
      {
        id: "3",
        name: "Digital Art Collective",
        contractAddress: "0x9876...5432",
        totalSupply: 1000,
        floorPrice: 0.8,
        volumeTraded: 12500,
        royaltyPercentage: 10,
        totalRoyaltiesEarned: 1250,
        pendingRoyalties: 45.2,
        lastClaimDate: null,
        createdAt: new Date("2023-06-20"),
      },
    ];

    // Mock transactions
    const mockTransactions: RoyaltyTransaction[] = [
      {
        id: "1",
        collectionId: "1",
        collectionName: "Crypto Punks Genesis",
        tokenId: 1234,
        salePrice: 3.2,
        royaltyAmount: 0.16,
        buyer: "0xbuyer1...abc",
        seller: "0xseller1...def",
        marketplace: "OpenSea",
        timestamp: new Date("2024-01-20T10:30:00"),
        status: "completed",
        txHash: "0xtx1...hash1",
      },
      {
        id: "2",
        collectionId: "2",
        collectionName: "Bored Apes Club",
        tokenId: 567,
        salePrice: 6.5,
        royaltyAmount: 0.4875,
        buyer: "0xbuyer2...xyz",
        seller: "0xseller2...uvw",
        marketplace: "Blur",
        timestamp: new Date("2024-01-20T14:15:00"),
        status: "completed",
        txHash: "0xtx2...hash2",
      },
      {
        id: "3",
        collectionId: "1",
        collectionName: "Crypto Punks Genesis",
        tokenId: 8901,
        salePrice: 2.8,
        royaltyAmount: 0.14,
        buyer: "0xbuyer3...lmn",
        seller: "0xseller3...opq",
        marketplace: "OpenSea",
        timestamp: new Date("2024-01-21T09:45:00"),
        status: "pending",
        txHash: "0xtx3...hash3",
      },
    ];

    // Mock royalty splits
    const mockRoyaltySplits: RoyaltySplit[] = [
      {
        collectionId: "1",
        beneficiaries: [
          {
            id: "1",
            address: "0xartist1...abc",
            name: "Lead Artist",
            percentage: 60,
            totalEarned: 3750,
            role: "Creator",
          },
          {
            id: "2",
            address: "0xdev1...def",
            name: "Developer",
            percentage: 25,
            totalEarned: 1562.5,
            role: "Technical",
          },
          {
            id: "3",
            address: "0xmarketing1...ghi",
            name: "Marketing Team",
            percentage: 15,
            totalEarned: 937.5,
            role: "Marketing",
          },
        ],
      },
      {
        collectionId: "2",
        beneficiaries: [
          {
            id: "4",
            address: "0xartist2...xyz",
            name: "Art Director",
            percentage: 50,
            totalEarned: 3337.5,
            role: "Creator",
          },
          {
            id: "5",
            address: "0xteam1...uvw",
            name: "Project Team",
            percentage: 50,
            totalEarned: 3337.5,
            role: "Team",
          },
        ],
      },
    ];

    setCollections(mockCollections);
    setTransactions(mockTransactions);
    setRoyaltySplits(mockRoyaltySplits);
    setIsLoading(false);
  };

  const handleClaimRoyalties = (collectionId: string) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (collection && collection.pendingRoyalties > 0) {
      alert(`Claiming ${collection.pendingRoyalties} ETH from ${collection.name}`);
      // Implement claim logic
      setCollections(
        collections.map((c) =>
          c.id === collectionId
            ? {
                ...c,
                pendingRoyalties: 0,
                lastClaimDate: new Date(),
              }
            : c
        )
      );
    }
  };

  const handleClaimAll = () => {
    const totalPending = collections.reduce((sum, c) => sum + c.pendingRoyalties, 0);
    if (totalPending > 0) {
      alert(`Claiming total of ${totalPending.toFixed(4)} ETH from all collections`);
      // Implement bulk claim logic
      setCollections(
        collections.map((c) => ({
          ...c,
          pendingRoyalties: 0,
          lastClaimDate: new Date(),
        }))
      );
    }
  };

  const totalStats = collections.reduce(
    (acc, collection) => ({
      totalEarned: acc.totalEarned + collection.totalRoyaltiesEarned,
      totalPending: acc.totalPending + collection.pendingRoyalties,
      totalVolume: acc.totalVolume + collection.volumeTraded,
      avgRoyalty: acc.avgRoyalty + collection.royaltyPercentage / collections.length,
    }),
    { totalEarned: 0, totalPending: 0, totalVolume: 0, avgRoyalty: 0 }
  );

  const filteredTransactions =
    filterStatus === "all"
      ? transactions
      : transactions.filter((t) => t.status === filterStatus);

  const searchedTransactions = searchTerm
    ? filteredTransactions.filter(
        (t) =>
          t.collectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.marketplace.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredTransactions;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg border border-gray-200 p-8">
        <Crown className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600 text-center max-w-md">
          Connect your wallet to manage your NFT royalties
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">NFT Royalty Manager</h2>
            <p className="text-sm text-gray-600">
              Automated royalty distribution and tracking
            </p>
          </div>
        </div>
        <button
          onClick={handleClaimAll}
          disabled={totalStats.totalPending === 0}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="w-4 h-4" />
          Claim All ({totalStats.totalPending.toFixed(4)} ETH)
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <DollarSign className="w-8 h-8 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">EARNED</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {totalStats.totalEarned.toFixed(2)} ETH
          </p>
          <p className="text-xs text-gray-600 mt-1">Total royalties earned</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <Wallet className="w-8 h-8 text-green-600" />
            <span className="text-xs text-green-600 font-medium">PENDING</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {totalStats.totalPending.toFixed(4)} ETH
          </p>
          <p className="text-xs text-gray-600 mt-1">Ready to claim</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">VOLUME</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {totalStats.totalVolume.toLocaleString()} ETH
          </p>
          <p className="text-xs text-gray-600 mt-1">Total traded volume</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <Percent className="w-8 h-8 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">AVG ROYALTY</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {totalStats.avgRoyalty.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-600 mt-1">Average rate</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {["overview", "collections", "transactions", "splits"].map((tab) => (
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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                      #{tx.tokenId}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tx.collectionName}</p>
                      <p className="text-sm text-gray-600">
                        Sold on {tx.marketplace} • {tx.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{tx.salePrice} ETH</p>
                    <p className="text-sm text-green-600">
                      +{tx.royaltyAmount} ETH royalty
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Collections */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Performing Collections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collections
                .sort((a, b) => b.totalRoyaltiesEarned - a.totalRoyaltiesEarned)
                .slice(0, 4)
                .map((collection) => (
                  <div
                    key={collection.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{collection.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Earned:</span>
                        <span className="font-medium text-gray-900">
                          {collection.totalRoyaltiesEarned} ETH
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending:</span>
                        <span className="font-medium text-green-600">
                          {collection.pendingRoyalties.toFixed(4)} ETH
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Royalty Rate:</span>
                        <span className="font-medium text-gray-900">
                          {collection.royaltyPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Collections Tab */}
      {activeTab === "collections" && (
        <div className="space-y-4">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {collection.name}
                    </h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {collection.royaltyPercentage}% Royalty
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {collection.contractAddress}
                  </p>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Supply</p>
                      <p className="font-semibold text-gray-900">
                        {collection.totalSupply.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Floor Price</p>
                      <p className="font-semibold text-gray-900">
                        {collection.floorPrice} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Volume</p>
                      <p className="font-semibold text-gray-900">
                        {collection.volumeTraded.toLocaleString()} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Earned</p>
                      <p className="font-semibold text-green-600">
                        {collection.totalRoyaltiesEarned} ETH
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Pending Royalties</p>
                  <p className="text-2xl font-bold text-green-600">
                    {collection.pendingRoyalties.toFixed(4)} ETH
                  </p>
                  {collection.lastClaimDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last claimed: {collection.lastClaimDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleClaimRoyalties(collection.id)}
                  disabled={collection.pendingRoyalties === 0}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wallet className="w-4 h-4 inline mr-2" />
                  Claim Royalties
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by collection or marketplace..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Transactions List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Collection
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Token ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Sale Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Royalty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Marketplace
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900">{tx.collectionName}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                      #{tx.tokenId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                      {tx.salePrice} ETH
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-green-600">
                      {tx.royaltyAmount} ETH
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                      {tx.marketplace}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tx.timestamp.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : tx.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {searchedTransactions.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Splits Tab */}
      {activeTab === "splits" && (
        <div className="space-y-6">
          {royaltySplits.map((split) => {
            const collection = collections.find((c) => c.id === split.collectionId);
            if (!collection) return null;

            return (
              <div key={split.collectionId} className="border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {collection.name}
                </h3>
                <div className="space-y-3">
                  {split.beneficiaries.map((beneficiary) => (
                    <div
                      key={beneficiary.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {beneficiary.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{beneficiary.name}</p>
                          <p className="text-sm text-gray-600">{beneficiary.address}</p>
                          <p className="text-xs text-gray-500">{beneficiary.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">
                          {beneficiary.percentage}%
                        </p>
                        <p className="text-sm text-gray-600">
                          Earned: {beneficiary.totalEarned.toFixed(2)} ETH
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

