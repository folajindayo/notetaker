"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  PieChart,
  Sparkles,
  Users,
  TrendingUp,
  DollarSign,
  ArrowUpDown,
  Lock,
  Unlock,
  Share2,
  Target,
  Award,
  Activity,
  CheckCircle,
  Clock,
} from "lucide-react";

interface FractionalNFT {
  id: string;
  originalNFT: {
    tokenId: string;
    contractAddress: string;
    name: string;
    imageUrl: string;
    collection: string;
  };
  totalShares: number;
  availableShares: number;
  pricePerShare: string;
  totalValue: string;
  curator: string;
  shareholders: number;
  createdAt: Date;
  status: "active" | "fully_minted" | "buyout_pending" | "redeemed";
  metadata: {
    description: string;
    externalUrl?: string;
    traits: { trait_type: string; value: string }[];
  };
}

interface ShareHolding {
  id: string;
  fractionalNFTId: string;
  owner: string;
  shares: number;
  purchasePrice: string;
  purchaseDate: Date;
  votingPower: number;
}

interface BuyoutOffer {
  id: string;
  fractionalNFTId: string;
  bidder: string;
  offerPrice: string;
  timestamp: Date;
  votesFor: number;
  votesAgainst: number;
  status: "pending" | "accepted" | "rejected";
  deadline: Date;
}

export function NFTFractionalization() {
  const { address, isConnected } = useAccount();
  const [fractionalNFTs, setFractionalNFTs] = useState<FractionalNFT[]>([]);
  const [holdings, setHoldings] = useState<ShareHolding[]>([]);
  const [buyoutOffers, setBuyoutOffers] = useState<BuyoutOffer[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<FractionalNFT | null>(null);
  const [activeTab, setActiveTab] = useState<"marketplace" | "create" | "holdings" | "offers">("marketplace");
  
  const [newFraction, setNewFraction] = useState({
    tokenId: "",
    contractAddress: "",
    totalShares: "",
    pricePerShare: "",
  });

  const [buyAmount, setBuyAmount] = useState("");

  useEffect(() => {
    const mockFractionalNFTs: FractionalNFT[] = [
      {
        id: "1",
        originalNFT: {
          tokenId: "1234",
          contractAddress: "0x1234567890123456789012345678901234567890",
          name: "Rare CryptoPunk #1234",
          imageUrl: "https://placehold.co/400x400/6366f1/white?text=CryptoPunk",
          collection: "CryptoPunks",
        },
        totalShares: 10000,
        availableShares: 3500,
        pricePerShare: "0.01",
        totalValue: "100",
        curator: "0x1111...2222",
        shareholders: 42,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        status: "active",
        metadata: {
          description: "Rare CryptoPunk with unique traits",
          externalUrl: "https://cryptopunks.app",
          traits: [
            { trait_type: "Type", value: "Alien" },
            { trait_type: "Accessories", value: "3D Glasses" },
          ],
        },
      },
      {
        id: "2",
        originalNFT: {
          tokenId: "5678",
          contractAddress: "0x2345678901234567890123456789012345678901",
          name: "Bored Ape #5678",
          imageUrl: "https://placehold.co/400x400/10b981/white?text=BAYC",
          collection: "Bored Ape Yacht Club",
        },
        totalShares: 5000,
        availableShares: 0,
        pricePerShare: "0.025",
        totalValue: "125",
        curator: address || "0x3333...4444",
        shareholders: 156,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        status: "fully_minted",
        metadata: {
          description: "Iconic Bored Ape with rare fur",
          traits: [
            { trait_type: "Fur", value: "Golden" },
            { trait_type: "Eyes", value: "Laser" },
          ],
        },
      },
    ];
    setFractionalNFTs(mockFractionalNFTs);

    const mockHoldings: ShareHolding[] = [
      {
        id: "1",
        fractionalNFTId: "1",
        owner: address || "0x5555...6666",
        shares: 250,
        purchasePrice: "2.5",
        purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        votingPower: 2.5,
      },
      {
        id: "2",
        fractionalNFTId: "2",
        owner: address || "0x5555...6666",
        shares: 500,
        purchasePrice: "12.5",
        purchaseDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        votingPower: 10,
      },
    ];
    setHoldings(mockHoldings);

    const mockOffers: BuyoutOffer[] = [
      {
        id: "1",
        fractionalNFTId: "2",
        bidder: "0x7777...8888",
        offerPrice: "150",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        votesFor: 4523,
        votesAgainst: 477,
        status: "pending",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    ];
    setBuyoutOffers(mockOffers);
  }, [address]);

  const fractionalize = () => {
    if (!newFraction.tokenId || !newFraction.contractAddress || !newFraction.totalShares || !newFraction.pricePerShare) {
      alert("Please fill in all fields");
      return;
    }

    const fractional: FractionalNFT = {
      id: Date.now().toString(),
      originalNFT: {
        tokenId: newFraction.tokenId,
        contractAddress: newFraction.contractAddress,
        name: `NFT #${newFraction.tokenId}`,
        imageUrl: "https://placehold.co/400x400/8b5cf6/white?text=NFT",
        collection: "My Collection",
      },
      totalShares: parseInt(newFraction.totalShares),
      availableShares: parseInt(newFraction.totalShares),
      pricePerShare: newFraction.pricePerShare,
      totalValue: (parseInt(newFraction.totalShares) * parseFloat(newFraction.pricePerShare)).toString(),
      curator: address || "0x0000...0000",
      shareholders: 0,
      createdAt: new Date(),
      status: "active",
      metadata: {
        description: "Fractionalized NFT",
        traits: [],
      },
    };

    setFractionalNFTs([fractional, ...fractionalNFTs]);
    setNewFraction({
      tokenId: "",
      contractAddress: "",
      totalShares: "",
      pricePerShare: "",
    });
    setActiveTab("holdings");
    alert("NFT fractionalized successfully!");
  };

  const buyShares = (nft: FractionalNFT) => {
    const amount = parseInt(buyAmount);
    if (!amount || amount <= 0 || amount > nft.availableShares) {
      alert("Invalid share amount");
      return;
    }

    const totalCost = amount * parseFloat(nft.pricePerShare);
    
    setFractionalNFTs(
      fractionalNFTs.map((f) =>
        f.id === nft.id
          ? {
              ...f,
              availableShares: f.availableShares - amount,
              shareholders: f.shareholders + 1,
              status: f.availableShares - amount === 0 ? "fully_minted" : f.status,
            }
          : f
      )
    );

    const holding: ShareHolding = {
      id: Date.now().toString(),
      fractionalNFTId: nft.id,
      owner: address || "0x0000...0000",
      shares: amount,
      purchasePrice: totalCost.toString(),
      purchaseDate: new Date(),
      votingPower: (amount / nft.totalShares) * 100,
    };
    setHoldings([holding, ...holdings]);

    setBuyAmount("");
    setSelectedNFT(null);
    alert(`Successfully purchased ${amount} shares!`);
  };

  const myHoldings = holdings.filter((h) => h.owner === address);
  const myFractionalized = fractionalNFTs.filter((f) => f.curator === address);
  const totalInvested = myHoldings.reduce((sum, h) => sum + parseFloat(h.purchasePrice), 0);

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to fractionalize NFTs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <PieChart className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">NFT Fractionalization</h2>
            <p className="text-sm text-gray-600">Split NFTs into tradeable shares</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab("create")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Fractionalize NFT
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{fractionalNFTs.length}</div>
          <div className="text-sm text-gray-600">Total Fractional NFTs</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{myHoldings.length}</div>
          <div className="text-sm text-gray-600">My Holdings</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{totalInvested.toFixed(2)} ETH</div>
          <div className="text-sm text-gray-600">Total Invested</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{myFractionalized.length}</div>
          <div className="text-sm text-gray-600">Created by Me</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "marketplace", label: "Marketplace", icon: PieChart },
          { id: "create", label: "Fractionalize", icon: Sparkles },
          { id: "holdings", label: "My Holdings", icon: Award },
          { id: "offers", label: "Buyout Offers", icon: Target },
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

      {activeTab === "marketplace" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fractionalNFTs.map((nft) => (
            <div key={nft.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100">
                <img
                  src={nft.originalNFT.imageUrl}
                  alt={nft.originalNFT.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">{nft.originalNFT.collection}</div>
                  <h3 className="font-bold text-gray-900">{nft.originalNFT.name}</h3>
                </div>

                <div className="mb-3 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs text-gray-600">Price per Share</span>
                    <span className="text-lg font-bold text-purple-600">{nft.pricePerShare} ETH</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-600">Total Value</span>
                    <span className="text-sm font-semibold text-gray-900">{nft.totalValue} ETH</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Available</span>
                    <span>
                      {nft.availableShares}/{nft.totalShares}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(1 - nft.availableShares / nft.totalShares) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{nft.shareholders}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    nft.status === "active" ? "bg-green-100 text-green-700" :
                    nft.status === "fully_minted" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {nft.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                {nft.availableShares > 0 ? (
                  <button
                    onClick={() => setSelectedNFT(nft)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Buy Shares
                  </button>
                ) : (
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed">
                    Fully Minted
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "create" && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Fractionalize your NFT</p>
                <p className="text-blue-700">
                  Split your NFT into multiple shares that can be bought and sold independently.
                  You'll retain control through majority ownership.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NFT Contract Address</label>
            <input
              type="text"
              value={newFraction.contractAddress}
              onChange={(e) => setNewFraction({ ...newFraction, contractAddress: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="0x..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Token ID</label>
            <input
              type="text"
              value={newFraction.tokenId}
              onChange={(e) => setNewFraction({ ...newFraction, tokenId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="1234"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Shares</label>
              <input
                type="number"
                value={newFraction.totalShares}
                onChange={(e) => setNewFraction({ ...newFraction, totalShares: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="10000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price per Share (ETH)</label>
              <input
                type="number"
                step="0.001"
                value={newFraction.pricePerShare}
                onChange={(e) => setNewFraction({ ...newFraction, pricePerShare: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="0.01"
              />
            </div>
          </div>

          {newFraction.totalShares && newFraction.pricePerShare && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-700 mb-1">Total Value</div>
              <div className="text-3xl font-bold text-green-600">
                {(parseInt(newFraction.totalShares) * parseFloat(newFraction.pricePerShare)).toFixed(3)} ETH
              </div>
            </div>
          )}

          <button
            onClick={fractionalize}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Fractionalize NFT
          </button>
        </div>
      )}

      {activeTab === "holdings" && (
        <div className="space-y-4">
          {myHoldings.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You don't own any fractional NFT shares yet</p>
            </div>
          ) : (
            myHoldings.map((holding) => {
              const nft = fractionalNFTs.find((f) => f.id === holding.fractionalNFTId);
              if (!nft) return null;

              return (
                <div key={holding.id} className="border border-gray-200 rounded-lg p-6 flex gap-4">
                  <img
                    src={nft.originalNFT.imageUrl}
                    alt={nft.originalNFT.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{nft.originalNFT.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{nft.originalNFT.collection}</p>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-gray-600">Shares Owned</div>
                        <div className="text-lg font-bold text-purple-600">{holding.shares}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Voting Power</div>
                        <div className="text-lg font-bold text-blue-600">{holding.votingPower.toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Purchase Price</div>
                        <div className="text-lg font-bold text-green-600">{holding.purchasePrice} ETH</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Current Value</div>
                        <div className="text-lg font-bold text-gray-900">
                          {(holding.shares * parseFloat(nft.pricePerShare)).toFixed(3)} ETH
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "offers" && (
        <div className="space-y-4">
          {buyoutOffers.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No active buyout offers</p>
            </div>
          ) : (
            buyoutOffers.map((offer) => {
              const nft = fractionalNFTs.find((f) => f.id === offer.fractionalNFTId);
              if (!nft) return null;

              const userHolding = holdings.find((h) => h.fractionalNFTId === offer.fractionalNFTId && h.owner === address);
              const totalVotes = offer.votesFor + offer.votesAgainst;
              const approvalRate = totalVotes > 0 ? (offer.votesFor / totalVotes) * 100 : 0;

              return (
                <div key={offer.id} className="border-2 border-yellow-200 rounded-lg p-6 bg-yellow-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <img
                        src={nft.originalNFT.imageUrl}
                        alt={nft.originalNFT.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{nft.originalNFT.name}</h3>
                        <div className="text-sm text-gray-600 mb-2">
                          Bidder: {offer.bidder.slice(0, 6)}...{offer.bidder.slice(-4)}
                        </div>
                        <div className="text-2xl font-bold text-yellow-600">{offer.offerPrice} ETH</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      offer.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      offer.status === "accepted" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {offer.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Approval Rate</span>
                      <span>{approvalRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{ width: `${approvalRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>For: {offer.votesFor}</span>
                      <span>Against: {offer.votesAgainst}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{Math.ceil((offer.deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000))} days left</span>
                    </div>
                  </div>

                  {userHolding && offer.status === "pending" && (
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Vote For
                      </button>
                      <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                        <X className="w-4 h-4" />
                        Vote Against
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Buy Shares</h2>
              
              <div className="mb-4">
                <img
                  src={selectedNFT.originalNFT.imageUrl}
                  alt={selectedNFT.originalNFT.name}
                  className="w-full aspect-square object-cover rounded-lg mb-3"
                />
                <h3 className="font-bold text-gray-900">{selectedNFT.originalNFT.name}</h3>
                <p className="text-sm text-gray-600">{selectedNFT.originalNFT.collection}</p>
              </div>

              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Price per Share</span>
                  <span className="font-semibold text-gray-900">{selectedNFT.pricePerShare} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available</span>
                  <span className="font-semibold text-gray-900">{selectedNFT.availableShares} shares</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Shares</label>
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="0"
                  max={selectedNFT.availableShares}
                />
              </div>

              {buyAmount && parseInt(buyAmount) > 0 && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-700 mb-1">Total Cost</div>
                  <div className="text-3xl font-bold text-green-600">
                    {(parseInt(buyAmount) * parseFloat(selectedNFT.pricePerShare)).toFixed(3)} ETH
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Voting Power: {((parseInt(buyAmount) / selectedNFT.totalShares) * 100).toFixed(2)}%
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => buyShares(selectedNFT)}
                  disabled={!buyAmount || parseInt(buyAmount) <= 0}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 font-semibold"
                >
                  Buy Shares
                </button>
                <button
                  onClick={() => {
                    setSelectedNFT(null);
                    setBuyAmount("");
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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

