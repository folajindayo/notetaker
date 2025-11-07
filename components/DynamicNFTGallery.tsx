"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Image as ImageIcon,
  TrendingUp,
  Zap,
  Clock,
  Award,
  Star,
  Grid3x3,
  List,
  Filter,
  Search,
  Eye,
  Heart,
  Share2,
  ExternalLink,
  Activity,
  Flame,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NFTTrait {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTTrait[];
  external_url?: string;
  animation_url?: string;
  background_color?: string;
}

interface DynamicNFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  owner: string;
  metadata: NFTMetadata;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  level: number;
  experience: number;
  evolution_stage: number;
  last_updated: Date;
  is_evolving: boolean;
  views: number;
  likes: number;
  collection: string;
  floor_price: string;
}

interface EvolutionHistory {
  id: string;
  nftId: string;
  timestamp: Date;
  from_stage: number;
  to_stage: number;
  trigger: string;
  changes: string[];
}

export function DynamicNFTGallery() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<DynamicNFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<DynamicNFT | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "rarity" | "level" | "views">("newest");
  const [filterRarity, setFilterRarity] = useState<string>("all");
  const [filterCollection, setFilterCollection] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [evolutionHistory, setEvolutionHistory] = useState<EvolutionHistory[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const rarityColors = {
    common: "bg-gray-100 text-gray-700 border-gray-300",
    uncommon: "bg-green-100 text-green-700 border-green-300",
    rare: "bg-blue-100 text-blue-700 border-blue-300",
    epic: "bg-purple-100 text-purple-700 border-purple-300",
    legendary: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  const rarityIcons = {
    common: Star,
    uncommon: Star,
    rare: Sparkles,
    epic: Flame,
    legendary: Zap,
  };

  const collections = ["all", "CyberPunks", "Evolution Beasts", "Dynamic Heroes", "Morphing Art"];

  // Mock data - Replace with blockchain data
  useEffect(() => {
    const mockNFTs: DynamicNFT[] = [
      {
        id: "1",
        tokenId: "1234",
        contractAddress: "0x1234567890123456789012345678901234567890",
        owner: address || "0x1111...2222",
        metadata: {
          name: "Cyber Dragon #1234",
          description: "A powerful cyber dragon that evolves with experience",
          image: "https://placehold.co/400x400/6366f1/white?text=Dragon",
          attributes: [
            { trait_type: "Type", value: "Dragon" },
            { trait_type: "Power", value: 850, display_type: "number" },
            { trait_type: "Speed", value: 720, display_type: "number" },
            { trait_type: "Element", value: "Cyber" },
            { trait_type: "Generation", value: 1 },
          ],
          external_url: "https://example.com/nft/1234",
        },
        rarity: "legendary",
        level: 15,
        experience: 3450,
        evolution_stage: 2,
        last_updated: new Date(Date.now() - 2 * 60 * 60 * 1000),
        is_evolving: false,
        views: 1234,
        likes: 567,
        collection: "Evolution Beasts",
        floor_price: "2.5",
      },
      {
        id: "2",
        tokenId: "5678",
        contractAddress: "0x2345678901234567890123456789012345678901",
        owner: address || "0x1111...2222",
        metadata: {
          name: "Morphing Hero #5678",
          description: "A hero that adapts to challenges",
          image: "https://placehold.co/400x400/10b981/white?text=Hero",
          attributes: [
            { trait_type: "Class", value: "Warrior" },
            { trait_type: "Strength", value: 92, display_type: "number" },
            { trait_type: "Intelligence", value: 78, display_type: "number" },
            { trait_type: "Agility", value: 85, display_type: "number" },
            { trait_type: "Wins", value: 24, display_type: "number" },
          ],
          animation_url: "https://example.com/animation/5678.mp4",
        },
        rarity: "epic",
        level: 22,
        experience: 5890,
        evolution_stage: 3,
        last_updated: new Date(Date.now() - 5 * 60 * 60 * 1000),
        is_evolving: true,
        views: 892,
        likes: 445,
        collection: "Dynamic Heroes",
        floor_price: "1.8",
      },
      {
        id: "3",
        tokenId: "9999",
        contractAddress: "0x3456789012345678901234567890123456789012",
        owner: "0x3333...4444",
        metadata: {
          name: "Abstract Evolution #9999",
          description: "Digital art that transforms over time",
          image: "https://placehold.co/400x400/f59e0b/white?text=Abstract",
          attributes: [
            { trait_type: "Style", value: "Abstract" },
            { trait_type: "Complexity", value: 95, display_type: "number" },
            { trait_type: "Color Palette", value: "Vibrant" },
            { trait_type: "Pattern", value: "Geometric" },
          ],
          background_color: "000000",
        },
        rarity: "rare",
        level: 8,
        experience: 1200,
        evolution_stage: 1,
        last_updated: new Date(Date.now() - 12 * 60 * 60 * 1000),
        is_evolving: false,
        views: 456,
        likes: 234,
        collection: "Morphing Art",
        floor_price: "0.8",
      },
      {
        id: "4",
        tokenId: "111",
        contractAddress: "0x4567890123456789012345678901234567890123",
        owner: address || "0x1111...2222",
        metadata: {
          name: "Cyber Punk #111",
          description: "Rare cyber punk with evolving traits",
          image: "https://placehold.co/400x400/ec4899/white?text=Punk",
          attributes: [
            { trait_type: "Type", value: "Punk" },
            { trait_type: "Background", value: "Neon City" },
            { trait_type: "Eyes", value: "Laser" },
            { trait_type: "Accessory", value: "Visor" },
            { trait_type: "Cool Factor", value: 88, display_type: "number" },
          ],
        },
        rarity: "uncommon",
        level: 5,
        experience: 450,
        evolution_stage: 1,
        last_updated: new Date(Date.now() - 24 * 60 * 60 * 1000),
        is_evolving: false,
        views: 234,
        likes: 123,
        collection: "CyberPunks",
        floor_price: "0.5",
      },
    ];
    setNfts(mockNFTs);

    const mockHistory: EvolutionHistory[] = [
      {
        id: "1",
        nftId: "1",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        from_stage: 1,
        to_stage: 2,
        trigger: "Level 10 reached",
        changes: ["Power increased by 200", "New ability unlocked: Cyber Blast", "Wings evolved"],
      },
      {
        id: "2",
        nftId: "2",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        from_stage: 2,
        to_stage: 3,
        trigger: "Won 20 battles",
        changes: ["Armor upgraded", "Strength +15", "New skill: Battle Cry"],
      },
    ];
    setEvolutionHistory(mockHistory);
  }, [address]);

  const evolveNFT = async (nft: DynamicNFT) => {
    // Simulate evolution
    setNfts(
      nfts.map((n) =>
        n.id === nft.id
          ? {
              ...n,
              is_evolving: true,
              last_updated: new Date(),
            }
          : n
      )
    );

    // Simulate evolution completion after 3 seconds
    setTimeout(() => {
      const newStage = nft.evolution_stage + 1;
      setNfts(
        nfts.map((n) =>
          n.id === nft.id
            ? {
                ...n,
                evolution_stage: newStage,
                level: n.level + 1,
                is_evolving: false,
                last_updated: new Date(),
              }
            : n
        )
      );

      // Add to history
      const historyEntry: EvolutionHistory = {
        id: Date.now().toString(),
        nftId: nft.id,
        timestamp: new Date(),
        from_stage: nft.evolution_stage,
        to_stage: newStage,
        trigger: "Manual evolution",
        changes: ["Stage advanced", "Stats improved", "Visual updated"],
      };
      setEvolutionHistory([historyEntry, ...evolutionHistory]);

      alert("Evolution complete!");
    }, 3000);
  };

  const likeNFT = (nftId: string) => {
    setNfts(
      nfts.map((n) =>
        n.id === nftId ? { ...n, likes: n.likes + 1 } : n
      )
    );
  };

  // Filter and sort NFTs
  const filteredNFTs = nfts
    .filter((nft) => {
      const matchesRarity = filterRarity === "all" || nft.rarity === filterRarity;
      const matchesCollection = filterCollection === "all" || nft.collection === filterCollection;
      const matchesSearch =
        nft.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.metadata.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRarity && matchesCollection && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return b.last_updated.getTime() - a.last_updated.getTime();
      } else if (sortBy === "rarity") {
        const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      } else if (sortBy === "level") {
        return b.level - a.level;
      } else if (sortBy === "views") {
        return b.views - a.views;
      }
      return 0;
    });

  const myNFTs = nfts.filter((n) => n.owner === address);

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to view your dynamic NFT gallery</p>
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
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dynamic NFT Gallery</h2>
            <p className="text-sm text-gray-600">Showcase your evolving NFT collection</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{myNFTs.length}</div>
          <div className="text-sm text-gray-600">My NFTs</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {myNFTs.reduce((sum, n) => sum + n.level, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Levels</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {myNFTs.filter((n) => n.rarity === "legendary" || n.rarity === "epic").length}
          </div>
          <div className="text-sm text-gray-600">Rare Items</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {myNFTs.reduce((sum, n) => sum + n.likes, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Likes</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        <select
          value={filterCollection}
          onChange={(e) => setFilterCollection(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {collections.map((col) => (
            <option key={col} value={col}>
              {col === "all" ? "All Collections" : col}
            </option>
          ))}
        </select>
        <select
          value={filterRarity}
          onChange={(e) => setFilterRarity(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Rarities</option>
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="newest">Newest</option>
          <option value="rarity">Rarity</option>
          <option value="level">Level</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>

      {/* NFT Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs.map((nft) => {
            const RarityIcon = rarityIcons[nft.rarity];
            return (
              <div
                key={nft.id}
                className="border-2 rounded-xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                style={{ borderColor: nft.metadata.background_color ? `#${nft.metadata.background_color}` : undefined }}
                onClick={() => setSelectedNFT(nft)}
              >
                {/* NFT Image */}
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={nft.metadata.image}
                    alt={nft.metadata.name}
                    className="w-full h-full object-cover"
                  />
                  {nft.is_evolving && (
                    <div className="absolute inset-0 bg-purple-600 bg-opacity-50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <div className="font-semibold">Evolving...</div>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border-2 flex items-center gap-1 ${rarityColors[nft.rarity]}`}>
                      <RarityIcon className="w-3 h-3" />
                      {nft.rarity.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* NFT Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-bold text-gray-900 mb-1">{nft.metadata.name}</h3>
                    <p className="text-xs text-gray-600">{nft.collection}</p>
                  </div>

                  {/* Level & Experience */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Level {nft.level}</span>
                      <span className="text-gray-600">Stage {nft.evolution_stage}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${(nft.experience % 1000) / 10}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{nft.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{nft.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{nft.floor_price} ETH</span>
                    </div>
                  </div>

                  {nft.owner === address && !nft.is_evolving && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        evolveNFT(nft);
                      }}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Zap className="w-4 h-4" />
                      Evolve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNFTs.map((nft) => {
            const RarityIcon = rarityIcons[nft.rarity];
            return (
              <div
                key={nft.id}
                className="border border-gray-200 rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedNFT(nft)}
              >
                <img
                  src={nft.metadata.image}
                  alt={nft.metadata.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{nft.metadata.name}</h3>
                      <p className="text-sm text-gray-600">{nft.collection}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${rarityColors[nft.rarity]}`}>
                      <RarityIcon className="w-3 h-3" />
                      {nft.rarity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{nft.metadata.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>Level {nft.level}</span>
                    <span>Stage {nft.evolution_stage}</span>
                    <span>{nft.floor_price} ETH</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{nft.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{nft.likes}</span>
                    </div>
                  </div>
                </div>
                {nft.owner === address && !nft.is_evolving && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      evolveNFT(nft);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 self-center"
                  >
                    <Zap className="w-4 h-4" />
                    Evolve
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {filteredNFTs.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No NFTs found</p>
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Image */}
                <div>
                  <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                    <img
                      src={selectedNFT.metadata.image}
                      alt={selectedNFT.metadata.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedNFT.is_evolving && (
                      <div className="absolute inset-0 bg-purple-600 bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-2" />
                          <div className="text-xl font-semibold">Evolving...</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedNFT.metadata.animation_url && (
                    <div className="mb-4">
                      <video
                        src={selectedNFT.metadata.animation_url}
                        controls
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => likeNFT(selectedNFT.id)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      {selectedNFT.likes}
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    {selectedNFT.metadata.external_url && (
                      <button
                        onClick={() => window.open(selectedNFT.metadata.external_url, "_blank")}
                        className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Details */}
                <div>
                  <button
                    onClick={() => setSelectedNFT(null)}
                    className="mb-4 text-gray-600 hover:text-gray-900"
                  >
                    ← Back
                  </button>

                  <div className="mb-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedNFT.metadata.name}</h2>
                    <p className="text-gray-600 mb-2">{selectedNFT.collection}</p>
                    <p className="text-gray-700">{selectedNFT.metadata.description}</p>
                  </div>

                  {/* Rarity & Stats */}
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    <div className={`p-3 rounded-lg border-2 text-center ${rarityColors[selectedNFT.rarity]}`}>
                      <div className="text-2xl font-bold">{selectedNFT.rarity}</div>
                      <div className="text-xs">Rarity</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedNFT.level}</div>
                      <div className="text-xs text-gray-600">Level</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedNFT.evolution_stage}</div>
                      <div className="text-xs text-gray-600">Stage</div>
                    </div>
                  </div>

                  {/* Experience Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Experience</span>
                      <span>{selectedNFT.experience} XP</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${(selectedNFT.experience % 1000) / 10}%` }}
                      />
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Attributes</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNFT.metadata.attributes.map((attr, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-600 mb-1">{attr.trait_type}</div>
                          <div className="font-semibold text-gray-900">{attr.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evolution History */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Evolution History</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {evolutionHistory
                        .filter((h) => h.nftId === selectedNFT.id)
                        .map((history) => (
                          <div key={history.id} className="bg-purple-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-purple-900">
                                Stage {history.from_stage} → {history.to_stage}
                              </span>
                              <span className="text-xs text-gray-600">
                                {history.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-1">{history.trigger}</div>
                            <ul className="text-xs text-gray-700 list-disc list-inside">
                              {history.changes.map((change, i) => (
                                <li key={i}>{change}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Floor Price */}
                  <div className="mb-4 flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Floor Price</span>
                    <span className="text-2xl font-bold text-green-600">{selectedNFT.floor_price} ETH</span>
                  </div>

                  {selectedNFT.owner === address && !selectedNFT.is_evolving && (
                    <button
                      onClick={() => evolveNFT(selectedNFT)}
                      className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                      <Zap className="w-5 h-5" />
                      Evolve NFT
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

