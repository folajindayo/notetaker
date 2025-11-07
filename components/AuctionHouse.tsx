"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  Gavel,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Image as ImageIcon,
  Calendar,
  Award,
  AlertCircle,
  Check,
  X,
  Play,
  Pause,
  Timer,
  Trophy,
  Flame,
  Eye,
  Heart,
  Share2,
  ExternalLink,
} from "lucide-react";

interface NFTAsset {
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  imageUrl: string;
  collection: string;
  attributes: { trait_type: string; value: string }[];
}

interface Auction {
  id: string;
  asset: NFTAsset;
  seller: string;
  startingPrice: string;
  currentBid: string;
  highestBidder: string | null;
  startTime: Date;
  endTime: Date;
  status: "upcoming" | "active" | "ended" | "cancelled";
  bidCount: number;
  reservePrice?: string;
  reserveMet: boolean;
  buyNowPrice?: string;
  minBidIncrement: string;
  category: string;
  watchers: number;
  likes: number;
}

interface Bid {
  id: string;
  auctionId: string;
  bidder: string;
  amount: string;
  timestamp: Date;
  status: "active" | "outbid" | "won" | "refunded";
}

export function AuctionHouse() {
  const { address, isConnected } = useAccount();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "ended" | "myBids" | "myAuctions">("active");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"endingSoon" | "popular" | "newest" | "highestBid">("endingSoon");

  const categories = ["all", "art", "collectibles", "gaming", "music", "photography", "sports"];

  // New Auction Form
  const [newAuction, setNewAuction] = useState({
    tokenId: "",
    contractAddress: "",
    startingPrice: "",
    reservePrice: "",
    buyNowPrice: "",
    duration: "24",
    minBidIncrement: "0.01",
    category: "art",
  });

  // Mock data - Replace with blockchain data
  useEffect(() => {
    const now = new Date();
    const mockAuctions: Auction[] = [
      {
        id: "1",
        asset: {
          tokenId: "1234",
          contractAddress: "0x1234567890123456789012345678901234567890",
          name: "Cyber Punk #1234",
          description: "Rare cyber punk NFT from the genesis collection",
          imageUrl: "https://placehold.co/400x400/6366f1/white?text=Cyber+Punk",
          collection: "CyberPunks",
          attributes: [
            { trait_type: "Background", value: "Neon" },
            { trait_type: "Eyes", value: "Laser" },
            { trait_type: "Rarity", value: "Legendary" },
          ],
        },
        seller: "0x1111...2222",
        startingPrice: "0.5",
        currentBid: "2.3",
        highestBidder: "0x3333...4444",
        startTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        status: "active",
        bidCount: 15,
        reservePrice: "2.0",
        reserveMet: true,
        buyNowPrice: "5.0",
        minBidIncrement: "0.1",
        category: "art",
        watchers: 234,
        likes: 156,
      },
      {
        id: "2",
        asset: {
          tokenId: "5678",
          contractAddress: "0x2345678901234567890123456789012345678901",
          name: "Mutant Ape #5678",
          description: "Unique mutant ape with rare traits",
          imageUrl: "https://placehold.co/400x400/10b981/white?text=Mutant+Ape",
          collection: "MutantApes",
          attributes: [
            { trait_type: "Fur", value: "Gold" },
            { trait_type: "Mutation", value: "Laser Eyes" },
            { trait_type: "Rarity", value: "Epic" },
          ],
        },
        seller: "0x5555...6666",
        startingPrice: "1.0",
        currentBid: "3.5",
        highestBidder: address || "0x7777...8888",
        startTime: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 30 * 60 * 1000),
        status: "active",
        bidCount: 28,
        reservePrice: "3.0",
        reserveMet: true,
        minBidIncrement: "0.2",
        category: "collectibles",
        watchers: 567,
        likes: 389,
      },
      {
        id: "3",
        asset: {
          tokenId: "9999",
          contractAddress: "0x3456789012345678901234567890123456789012",
          name: "Legendary Sword",
          description: "Epic gaming item from MetaWorld",
          imageUrl: "https://placehold.co/400x400/f59e0b/white?text=Sword",
          collection: "MetaWorld Items",
          attributes: [
            { trait_type: "Damage", value: "999" },
            { trait_type: "Element", value: "Fire" },
            { trait_type: "Tier", value: "Legendary" },
          ],
        },
        seller: address || "0x9999...0000",
        startingPrice: "0.3",
        currentBid: "0.3",
        highestBidder: null,
        startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 26 * 60 * 60 * 1000),
        status: "upcoming",
        bidCount: 0,
        reservePrice: "0.8",
        reserveMet: false,
        buyNowPrice: "2.0",
        minBidIncrement: "0.05",
        category: "gaming",
        watchers: 89,
        likes: 45,
      },
      {
        id: "4",
        asset: {
          tokenId: "111",
          contractAddress: "0x4567890123456789012345678901234567890123",
          name: "Abstract Art #111",
          description: "Digital abstract art by renowned artist",
          imageUrl: "https://placehold.co/400x400/ec4899/white?text=Abstract",
          collection: "Modern Art",
          attributes: [
            { trait_type: "Style", value: "Abstract" },
            { trait_type: "Colors", value: "Rainbow" },
            { trait_type: "Year", value: "2024" },
          ],
        },
        seller: "0xaaaa...bbbb",
        startingPrice: "2.0",
        currentBid: "4.8",
        highestBidder: "0xcccc...dddd",
        startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        status: "ended",
        bidCount: 42,
        reservePrice: "3.0",
        reserveMet: true,
        minBidIncrement: "0.2",
        category: "art",
        watchers: 345,
        likes: 278,
      },
    ];
    setAuctions(mockAuctions);

    // Mock bids
    const mockBids: Bid[] = [
      {
        id: "1",
        auctionId: "2",
        bidder: address || "0x7777...8888",
        amount: "3.5",
        timestamp: new Date(now.getTime() - 15 * 60 * 1000),
        status: "active",
      },
      {
        id: "2",
        auctionId: "1",
        bidder: address || "0x7777...8888",
        amount: "2.0",
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        status: "outbid",
      },
    ];
    setBids(mockBids);
  }, [address]);

  // Calculate time remaining
  const getTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const placeBid = async (auction: Auction) => {
    if (!bidAmount || !address) return;

    const bid = parseFloat(bidAmount);
    const currentBid = parseFloat(auction.currentBid);
    const minIncrement = parseFloat(auction.minBidIncrement);

    if (bid < currentBid + minIncrement) {
      alert(`Bid must be at least ${(currentBid + minIncrement).toFixed(2)} ETH`);
      return;
    }

    // Simulate placing bid
    const newBid: Bid = {
      id: Date.now().toString(),
      auctionId: auction.id,
      bidder: address,
      amount: bidAmount,
      timestamp: new Date(),
      status: "active",
    };

    // Update previous high bid to outbid
    setBids(
      bids.map((b) =>
        b.auctionId === auction.id && b.status === "active"
          ? { ...b, status: "outbid" }
          : b
      )
    );

    setBids([...bids, newBid]);

    // Update auction
    setAuctions(
      auctions.map((a) =>
        a.id === auction.id
          ? {
              ...a,
              currentBid: bidAmount,
              highestBidder: address,
              bidCount: a.bidCount + 1,
              reserveMet: auction.reservePrice
                ? parseFloat(bidAmount) >= parseFloat(auction.reservePrice)
                : true,
            }
          : a
      )
    );

    setBidAmount("");
    alert("Bid placed successfully!");
  };

  const buyNow = async (auction: Auction) => {
    if (!auction.buyNowPrice || !address) return;

    // Simulate buy now
    setAuctions(
      auctions.map((a) =>
        a.id === auction.id
          ? {
              ...a,
              status: "ended",
              currentBid: auction.buyNowPrice!,
              highestBidder: address,
            }
          : a
      )
    );

    alert("Purchase successful!");
  };

  const createAuction = () => {
    if (
      !newAuction.tokenId ||
      !newAuction.contractAddress ||
      !newAuction.startingPrice
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const now = new Date();
    const auction: Auction = {
      id: Date.now().toString(),
      asset: {
        tokenId: newAuction.tokenId,
        contractAddress: newAuction.contractAddress,
        name: `NFT #${newAuction.tokenId}`,
        description: "Description of the NFT",
        imageUrl: "https://placehold.co/400x400/8b5cf6/white?text=NFT",
        collection: "My Collection",
        attributes: [],
      },
      seller: address || "0x0000...0000",
      startingPrice: newAuction.startingPrice,
      currentBid: newAuction.startingPrice,
      highestBidder: null,
      startTime: now,
      endTime: new Date(now.getTime() + parseInt(newAuction.duration) * 60 * 60 * 1000),
      status: "active",
      bidCount: 0,
      reservePrice: newAuction.reservePrice || undefined,
      reserveMet: !newAuction.reservePrice,
      buyNowPrice: newAuction.buyNowPrice || undefined,
      minBidIncrement: newAuction.minBidIncrement,
      category: newAuction.category,
      watchers: 0,
      likes: 0,
    };

    setAuctions([auction, ...auctions]);
    setIsCreating(false);
    setNewAuction({
      tokenId: "",
      contractAddress: "",
      startingPrice: "",
      reservePrice: "",
      buyNowPrice: "",
      duration: "24",
      minBidIncrement: "0.01",
      category: "art",
    });
    setActiveTab("myAuctions");
    alert("Auction created successfully!");
  };

  // Filter and sort auctions
  const filteredAuctions = auctions
    .filter((a) => {
      if (activeTab === "active") return a.status === "active";
      if (activeTab === "upcoming") return a.status === "upcoming";
      if (activeTab === "ended") return a.status === "ended";
      if (activeTab === "myBids") return bids.some((b) => b.bidder === address && b.auctionId === a.id);
      if (activeTab === "myAuctions") return a.seller === address;
      return true;
    })
    .filter((a) => filterCategory === "all" || a.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === "endingSoon") {
        return a.endTime.getTime() - b.endTime.getTime();
      } else if (sortBy === "popular") {
        return b.watchers - a.watchers;
      } else if (sortBy === "newest") {
        return b.startTime.getTime() - a.startTime.getTime();
      } else if (sortBy === "highestBid") {
        return parseFloat(b.currentBid) - parseFloat(a.currentBid);
      }
      return 0;
    });

  const myActiveBids = bids.filter((b) => b.bidder === address && b.status === "active");

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to participate in auctions</p>
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
            <Gavel className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Auction House</h2>
            <p className="text-sm text-gray-600">Bid on exclusive NFTs and digital assets</p>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Gavel className="w-4 h-4" />
          Create Auction
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{auctions.filter((a) => a.status === "active").length}</div>
          <div className="text-sm text-gray-600">Active Auctions</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{myActiveBids.length}</div>
          <div className="text-sm text-gray-600">My Active Bids</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {auctions.reduce((sum, a) => sum + parseFloat(a.currentBid), 0).toFixed(1)} ETH
          </div>
          <div className="text-sm text-gray-600">Total Volume</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {auctions.filter((a) => a.seller === address).length}
          </div>
          <div className="text-sm text-gray-600">My Auctions</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {[
          { id: "active", label: "Active", icon: Play },
          { id: "upcoming", label: "Upcoming", icon: Clock },
          { id: "ended", label: "Ended", icon: Trophy },
          { id: "myBids", label: "My Bids", icon: Gavel },
          { id: "myAuctions", label: "My Auctions", icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
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

      {/* Filters */}
      <div className="flex gap-4 mb-6">
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
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="endingSoon">Ending Soon</option>
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="highestBid">Highest Bid</option>
        </select>
      </div>

      {/* Auctions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuctions.map((auction) => (
          <div
            key={auction.id}
            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* NFT Image */}
            <div className="relative aspect-square bg-gray-100">
              <img
                src={auction.asset.imageUrl}
                alt={auction.asset.name}
                className="w-full h-full object-cover"
              />
              {auction.status === "active" && (
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    LIVE
                  </span>
                </div>
              )}
              {auction.status === "upcoming" && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                    UPCOMING
                  </span>
                </div>
              )}
              {auction.status === "ended" && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg">
                    ENDED
                  </span>
                </div>
              )}
            </div>

            {/* Auction Info */}
            <div className="p-4">
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">{auction.asset.collection}</div>
                <h3 className="font-bold text-gray-900 mb-1">{auction.asset.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{auction.asset.description}</p>
              </div>

              {/* Current Bid */}
              <div className="mb-3 p-3 bg-purple-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">
                  {auction.bidCount === 0 ? "Starting Price" : "Current Bid"}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-purple-600">{auction.currentBid}</span>
                  <span className="text-sm text-gray-600">ETH</span>
                </div>
                {auction.highestBidder && (
                  <div className="text-xs text-gray-600 mt-1">
                    by {auction.highestBidder.slice(0, 6)}...{auction.highestBidder.slice(-4)}
                  </div>
                )}
              </div>

              {/* Time Remaining */}
              {auction.status !== "ended" && (
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <Timer className="w-4 h-4 text-orange-600" />
                  <span className="text-gray-700 font-medium">{getTimeRemaining(auction.endTime)}</span>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Gavel className="w-4 h-4" />
                  <span>{auction.bidCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{auction.watchers}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{auction.likes}</span>
                </div>
              </div>

              {/* Reserve Price Indicator */}
              {auction.reservePrice && !auction.reserveMet && (
                <div className="mb-3 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 rounded px-2 py-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Reserve not met ({auction.reservePrice} ETH)</span>
                </div>
              )}

              {/* Action Buttons */}
              {auction.status === "active" && (
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedAuction(auction)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Gavel className="w-4 h-4" />
                    Place Bid
                  </button>
                  {auction.buyNowPrice && (
                    <button
                      onClick={() => buyNow(auction)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Buy Now - {auction.buyNowPrice} ETH
                    </button>
                  )}
                </div>
              )}
              {auction.status === "upcoming" && (
                <button className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-lg cursor-not-allowed">
                  Starts in {getTimeRemaining(auction.startTime)}
                </button>
              )}
              {auction.status === "ended" && (
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed">
                  Auction Ended
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAuctions.length === 0 && (
        <div className="text-center py-12">
          <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No auctions found</p>
        </div>
      )}

      {/* Bid Modal */}
      {selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Place Your Bid</h3>
                  <p className="text-sm text-gray-600">{selectedAuction.asset.name}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedAuction(null);
                    setBidAmount("");
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Current Bid</div>
                <div className="text-2xl font-bold text-gray-900">{selectedAuction.currentBid} ETH</div>
                <div className="text-xs text-gray-600 mt-1">
                  Minimum bid: {(parseFloat(selectedAuction.currentBid) + parseFloat(selectedAuction.minBidIncrement)).toFixed(2)} ETH
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Bid Amount (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="0.00"
                />
              </div>

              <button
                onClick={() => placeBid(selectedAuction)}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <Gavel className="w-5 h-5" />
                Place Bid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Auction Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create New Auction</h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Token ID</label>
                    <input
                      type="text"
                      value={newAuction.tokenId}
                      onChange={(e) => setNewAuction({ ...newAuction, tokenId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newAuction.category}
                      onChange={(e) => setNewAuction({ ...newAuction, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      {categories.filter((c) => c !== "all").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contract Address</label>
                  <input
                    type="text"
                    value={newAuction.contractAddress}
                    onChange={(e) => setNewAuction({ ...newAuction, contractAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="0x..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Starting Price (ETH)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAuction.startingPrice}
                      onChange={(e) => setNewAuction({ ...newAuction, startingPrice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                    <input
                      type="number"
                      value={newAuction.duration}
                      onChange={(e) => setNewAuction({ ...newAuction, duration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="24"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reserve Price (ETH)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAuction.reservePrice}
                      onChange={(e) => setNewAuction({ ...newAuction, reservePrice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Buy Now Price (ETH)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAuction.buyNowPrice}
                      onChange={(e) => setNewAuction({ ...newAuction, buyNowPrice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Bid Increment (ETH)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAuction.minBidIncrement}
                    onChange={(e) => setNewAuction({ ...newAuction, minBidIncrement: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="0.01"
                  />
                </div>

                <button
                  onClick={createAuction}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Gavel className="w-5 h-5" />
                  Create Auction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

