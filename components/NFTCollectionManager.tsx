"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther, Address } from "viem";
import {
  Image as ImageIcon,
  Plus,
  Upload,
  Grid,
  List,
  Filter,
  Search,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Share2,
  Download,
  ExternalLink,
  Star,
  Heart,
  MessageCircle,
  Tag,
  Layers,
  Settings,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  tokenId: string;
  collectionId: string;
  owner: string;
  creator: string;
  price?: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  attributes: NFTAttribute[];
  views: number;
  likes: number;
  comments: number;
  listed: boolean;
  createdAt: number;
}

interface NFTAttribute {
  trait_type: string;
  value: string;
  rarity?: number;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  symbol: string;
  coverImage: string;
  contractAddress?: string;
  owner: string;
  totalSupply: number;
  floorPrice: string;
  volume: string;
  items: number;
  owners: number;
  verified: boolean;
  createdAt: number;
  royalty: number;
}

interface CollectionStats {
  totalCollections: number;
  totalNFTs: number;
  totalVolume: string;
  totalRevenue: string;
  avgPrice: string;
}

export function NFTCollectionManager() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"collections" | "nfts" | "create" | "analytics">("collections");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRarity, setFilterRarity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [stats, setStats] = useState<CollectionStats | null>(null);

  // Create collection form
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionSymbol, setCollectionSymbol] = useState("");
  const [collectionRoyalty, setCollectionRoyalty] = useState("5");
  const [isCreating, setIsCreating] = useState(false);

  // Create NFT form
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftRarity, setNftRarity] = useState<NFT["rarity"]>("common");
  const [nftAttributes, setNftAttributes] = useState<NFTAttribute[]>([]);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConnected && address) {
      loadCollections();
      loadNFTs();
      loadStats();
    }
  }, [isConnected, address]);

  const loadCollections = () => {
    // Simulate loading collections
    const mockCollections: Collection[] = [
      {
        id: "1",
        name: "Cosmic Creatures",
        description: "A collection of unique cosmic creatures exploring the universe",
        symbol: "COSMIC",
        coverImage: "🌌",
        contractAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        owner: address!,
        totalSupply: 10000,
        floorPrice: "0.5",
        volume: "250",
        items: 150,
        owners: 89,
        verified: true,
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        royalty: 5,
      },
      {
        id: "2",
        name: "Digital Dragons",
        description: "Legendary dragons living on the blockchain",
        symbol: "DRAGON",
        coverImage: "🐉",
        contractAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        owner: address!,
        totalSupply: 5000,
        floorPrice: "1.2",
        volume: "450",
        items: 87,
        owners: 62,
        verified: true,
        createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
        royalty: 7.5,
      },
      {
        id: "3",
        name: "Cyber Punks 2077",
        description: "Futuristic cyber-enhanced characters",
        symbol: "CP2077",
        coverImage: "🤖",
        owner: address!,
        totalSupply: 7500,
        floorPrice: "0.8",
        volume: "180",
        items: 120,
        owners: 95,
        verified: false,
        createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
        royalty: 10,
      },
    ];

    setCollections(mockCollections);
    if (mockCollections.length > 0) {
      setSelectedCollection(mockCollections[0]);
    }
  };

  const loadNFTs = () => {
    // Simulate loading NFTs
    const mockNFTs: NFT[] = [
      {
        id: "1",
        name: "Cosmic Explorer #001",
        description: "The first explorer to venture into the cosmic realm",
        image: "🚀",
        tokenId: "1",
        collectionId: "1",
        owner: address!,
        creator: address!,
        price: "0.75",
        rarity: "legendary",
        attributes: [
          { trait_type: "Background", value: "Nebula", rarity: 95 },
          { trait_type: "Suit", value: "Quantum", rarity: 88 },
          { trait_type: "Helmet", value: "Transparent", rarity: 72 },
        ],
        views: 1234,
        likes: 567,
        comments: 89,
        listed: true,
        createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      },
      {
        id: "2",
        name: "Dragon Lord #042",
        description: "A majestic dragon ruling the digital realm",
        image: "🐲",
        tokenId: "42",
        collectionId: "2",
        owner: address!,
        creator: address!,
        price: "1.5",
        rarity: "epic",
        attributes: [
          { trait_type: "Element", value: "Fire", rarity: 65 },
          { trait_type: "Wings", value: "Golden", rarity: 80 },
          { trait_type: "Eyes", value: "Glowing", rarity: 55 },
        ],
        views: 892,
        likes: 421,
        comments: 67,
        listed: true,
        createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      },
      {
        id: "3",
        name: "Cyber Samurai #777",
        description: "A warrior enhanced with cybernetic implants",
        image: "⚔️",
        tokenId: "777",
        collectionId: "3",
        owner: address!,
        creator: address!,
        rarity: "rare",
        attributes: [
          { trait_type: "Weapon", value: "Plasma Katana", rarity: 70 },
          { trait_type: "Armor", value: "Nanotech", rarity: 60 },
          { trait_type: "Implant", value: "Neural Link", rarity: 75 },
        ],
        views: 567,
        likes: 234,
        comments: 45,
        listed: false,
        createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      },
    ];

    setNFTs(mockNFTs);
  };

  const loadStats = () => {
    const mockStats: CollectionStats = {
      totalCollections: 3,
      totalNFTs: 357,
      totalVolume: "880",
      totalRevenue: "66",
      avgPrice: "0.95",
    };

    setStats(mockStats);
  };

  const handleCreateCollection = async () => {
    if (!collectionName || !collectionDescription || !collectionSymbol) return;

    setIsCreating(true);

    try {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: collectionName,
        description: collectionDescription,
        symbol: collectionSymbol,
        coverImage: "🎨",
        owner: address!,
        totalSupply: 10000,
        floorPrice: "0",
        volume: "0",
        items: 0,
        owners: 0,
        verified: false,
        createdAt: Date.now(),
        royalty: parseFloat(collectionRoyalty),
      };

      setCollections([newCollection, ...collections]);

      // Reset form
      setCollectionName("");
      setCollectionDescription("");
      setCollectionSymbol("");
      setCollectionRoyalty("5");
      setIsCreating(false);
      setActiveTab("collections");
    } catch (error) {
      console.error("Failed to create collection:", error);
      setIsCreating(false);
    }
  };

  const getFilteredNFTs = () => {
    let filtered = nfts;

    if (selectedCollection) {
      filtered = filtered.filter((nft) => nft.collectionId === selectedCollection.id);
    }

    if (filterRarity !== "all") {
      filtered = filtered.filter((nft) => nft.rarity === filterRarity);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => parseFloat(b.price || "0") - parseFloat(a.price || "0"));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => parseFloat(a.price || "0") - parseFloat(b.price || "0"));
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.likes - a.likes);
    }

    return filtered;
  };

  const getRarityColor = (rarity: NFT["rarity"]) => {
    const colors: Record<NFT["rarity"], string> = {
      legendary: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
      epic: "bg-gradient-to-r from-purple-500 to-pink-600 text-white",
      rare: "bg-gradient-to-r from-blue-400 to-cyan-500 text-white",
      uncommon: "bg-gradient-to-r from-green-400 to-teal-500 text-white",
      common: "bg-gray-400 text-white",
    };
    return colors[rarity];
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-sm text-gray-600">
            Please connect your wallet to manage NFT collections
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
            <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                NFT Collection Manager
              </h1>
              <p className="text-sm text-gray-600">
                Create and manage your NFT collections
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("create")}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Collection
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Collections</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {stats.totalCollections}
                  </p>
                </div>
                <Layers className="h-8 w-8 text-pink-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total NFTs</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.totalNFTs}
                  </p>
                </div>
                <ImageIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Volume</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.totalVolume}
                  </p>
                  <p className="text-xs text-gray-500">ETH</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.totalRevenue}
                  </p>
                  <p className="text-xs text-gray-500">ETH</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Price</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.avgPrice}
                  </p>
                  <p className="text-xs text-gray-500">ETH</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("collections")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "collections"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Collections ({collections.length})
        </button>
        <button
          onClick={() => setActiveTab("nfts")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "nfts"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          NFTs ({nfts.length})
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "create"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Create
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "analytics"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Collections Tab */}
      {activeTab === "collections" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCollection(collection)}
            >
              <div className="aspect-video bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-6xl">
                {collection.coverImage}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {collection.name}
                      </h3>
                      {collection.verified && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {collection.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-600">Floor Price</div>
                    <div className="font-semibold text-gray-900">
                      {collection.floorPrice} ETH
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Volume</div>
                    <div className="font-semibold text-gray-900">
                      {collection.volume} ETH
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Items</div>
                    <div className="font-semibold text-gray-900">
                      {collection.items}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Owners</div>
                    <div className="font-semibold text-gray-900">
                      {collection.owners}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm">
                    View Details
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NFTs Tab */}
      {activeTab === "nfts" && (
        <div className="space-y-6">
          {/* Filters and Controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search NFTs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Rarities</option>
                <option value="legendary">Legendary</option>
                <option value="epic">Epic</option>
                <option value="rare">Rare</option>
                <option value="uncommon">Uncommon</option>
                <option value="common">Common</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="recent">Recent</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="popular">Most Popular</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* NFTs Grid */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {getFilteredNFTs().map((nft) => (
                <div
                  key={nft.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center text-6xl relative">
                    {nft.image}
                    <span
                      className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(
                        nft.rarity
                      )}`}
                    >
                      {nft.rarity}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {nft.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {nft.description}
                    </p>

                    {nft.listed && nft.price && (
                      <div className="mb-3 p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-600">Price</div>
                        <div className="text-lg font-bold text-gray-900">
                          {nft.price} ETH
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {nft.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {nft.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {nft.comments}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm">
                        View
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {getFilteredNFTs().map((nft) => (
                <div
                  key={nft.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-300 rounded-lg flex items-center justify-center text-3xl">
                      {nft.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {nft.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(
                            nft.rarity
                          )}`}
                        >
                          {nft.rarity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {nft.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Token ID: {nft.tokenId}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {nft.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {nft.likes}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {nft.listed && nft.price ? (
                        <>
                          <div className="text-sm text-gray-600">Listed</div>
                          <div className="text-xl font-bold text-gray-900">
                            {nft.price} ETH
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">Not Listed</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                        View
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Tab */}
      {activeTab === "create" && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Create New Collection
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="Enter collection name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={collectionDescription}
                  onChange={(e) => setCollectionDescription(e.target.value)}
                  placeholder="Describe your collection..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={collectionSymbol}
                    onChange={(e) => setCollectionSymbol(e.target.value)}
                    placeholder="e.g. NFT"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Royalty (%)
                  </label>
                  <input
                    type="number"
                    value={collectionRoyalty}
                    onChange={(e) => setCollectionRoyalty(e.target.value)}
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Choose File
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Deployment Cost</p>
                    <p>
                      Creating a new NFT collection requires deploying a smart
                      contract. Estimated gas fee: <strong>~0.05 ETH</strong>
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateCollection}
                disabled={
                  !collectionName ||
                  !collectionDescription ||
                  !collectionSymbol ||
                  isCreating
                }
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Creating Collection...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Collection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sales Over Time
              </h3>
              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8 h-64">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Sales analytics chart</p>
                </div>
              </div>
            </div>

            {/* Top Collections */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Collections by Volume
              </h3>
              <div className="space-y-3">
                {collections
                  .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
                  .map((collection, index) => (
                    <div
                      key={collection.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-500">
                          #{index + 1}
                        </span>
                        <span className="text-2xl">{collection.coverImage}</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {collection.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {collection.items} items
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {collection.volume} ETH
                        </div>
                        <div className="text-xs text-gray-500">
                          Floor: {collection.floorPrice} ETH
                        </div>
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

