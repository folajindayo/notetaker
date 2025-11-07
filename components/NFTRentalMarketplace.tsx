"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Package,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Shield,
  Award,
  Eye,
  Lock,
  Unlock,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

interface NFTRental {
  id: string;
  nftId: string;
  nftName: string;
  nftImage: string;
  collection: string;
  owner: string;
  renter: string | null;
  dailyRate: string;
  minDuration: number;
  maxDuration: number;
  collateral: string;
  status: "available" | "rented" | "expired" | "returned";
  startDate: Date | null;
  endDate: Date | null;
  totalEarned: string;
  rentCount: number;
  rating: number;
  reviews: number;
}

interface RentalAgreement {
  id: string;
  rentalId: string;
  renter: string;
  owner: string;
  duration: number;
  totalCost: string;
  collateral: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "completed" | "disputed" | "cancelled";
  autoRenew: boolean;
}

interface RentalHistory {
  id: string;
  nftId: string;
  nftName: string;
  renter: string;
  owner: string;
  duration: number;
  cost: string;
  startDate: Date;
  endDate: Date;
  rating: number;
  review?: string;
}

export function NFTRentalMarketplace() {
  const { address, isConnected } = useAccount();
  const [rentals, setRentals] = useState<NFTRental[]>([]);
  const [agreements, setAgreements] = useState<RentalAgreement[]>([]);
  const [history, setHistory] = useState<RentalHistory[]>([]);
  const [selectedRental, setSelectedRental] = useState<NFTRental | null>(null);
  const [activeTab, setActiveTab] = useState<"marketplace" | "myRentals" | "myListings" | "history">("marketplace");

  const [rentDuration, setRentDuration] = useState(7);
  const [showListingModal, setShowListingModal] = useState(false);

  const [newListing, setNewListing] = useState({
    nftId: "",
    nftName: "",
    collection: "",
    dailyRate: "",
    minDuration: "1",
    maxDuration: "30",
    collateral: "",
  });

  useEffect(() => {
    const mockRentals: NFTRental[] = [
      {
        id: "1",
        nftId: "BAYC #1234",
        nftName: "Bored Ape #1234",
        nftImage: "https://placehold.co/400x400/ff6b6b/white?text=BAYC",
        collection: "Bored Ape Yacht Club",
        owner: "0x1111...2222",
        renter: null,
        dailyRate: "0.5",
        minDuration: 1,
        maxDuration: 30,
        collateral: "2.0",
        status: "available",
        startDate: null,
        endDate: null,
        totalEarned: "15.5",
        rentCount: 12,
        rating: 4.8,
        reviews: 8,
      },
      {
        id: "2",
        nftId: "AZUKI #567",
        nftName: "Azuki #567",
        nftImage: "https://placehold.co/400x400/4ecdc4/white?text=AZUKI",
        collection: "Azuki",
        owner: address || "0x3333...4444",
        renter: "0x5555...6666",
        dailyRate: "0.3",
        minDuration: 3,
        maxDuration: 14,
        collateral: "1.5",
        status: "rented",
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        totalEarned: "8.4",
        rentCount: 5,
        rating: 5.0,
        reviews: 4,
      },
      {
        id: "3",
        nftId: "DOODLE #890",
        nftName: "Doodles #890",
        nftImage: "https://placehold.co/400x400/95e1d3/white?text=DOODLE",
        collection: "Doodles",
        owner: "0x7777...8888",
        renter: null,
        dailyRate: "0.2",
        minDuration: 1,
        maxDuration: 7,
        collateral: "1.0",
        status: "available",
        startDate: null,
        endDate: null,
        totalEarned: "12.8",
        rentCount: 18,
        rating: 4.9,
        reviews: 15,
      },
    ];
    setRentals(mockRentals);

    const mockAgreements: RentalAgreement[] = [
      {
        id: "1",
        rentalId: "2",
        renter: address || "0x5555...6666",
        owner: "0x3333...4444",
        duration: 7,
        totalCost: "2.1",
        collateral: "1.5",
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        status: "active",
        autoRenew: false,
      },
    ];
    setAgreements(mockAgreements);

    const mockHistory: RentalHistory[] = [
      {
        id: "1",
        nftId: "PUNK #123",
        nftName: "CryptoPunk #123",
        renter: address || "0x5555...6666",
        owner: "0x9999...0000",
        duration: 14,
        cost: "7.0",
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        rating: 5,
        review: "Great NFT, owner was very responsive!",
      },
    ];
    setHistory(mockHistory);
  }, [address]);

  const listNFT = () => {
    if (!newListing.nftName || !newListing.dailyRate || !newListing.collateral) {
      alert("Please fill in all required fields");
      return;
    }

    const rental: NFTRental = {
      id: Date.now().toString(),
      nftId: newListing.nftId || `NFT-${Date.now()}`,
      nftName: newListing.nftName,
      nftImage: "https://placehold.co/400x400/8b5cf6/white?text=NFT",
      collection: newListing.collection || "My Collection",
      owner: address || "0x0000...0000",
      renter: null,
      dailyRate: newListing.dailyRate,
      minDuration: parseInt(newListing.minDuration),
      maxDuration: parseInt(newListing.maxDuration),
      collateral: newListing.collateral,
      status: "available",
      startDate: null,
      endDate: null,
      totalEarned: "0",
      rentCount: 0,
      rating: 0,
      reviews: 0,
    };

    setRentals([rental, ...rentals]);
    setNewListing({
      nftId: "",
      nftName: "",
      collection: "",
      dailyRate: "",
      minDuration: "1",
      maxDuration: "30",
      collateral: "",
    });
    setShowListingModal(false);
    alert("NFT listed successfully!");
  };

  const rentNFT = (rental: NFTRental) => {
    if (rentDuration < rental.minDuration || rentDuration > rental.maxDuration) {
      alert(`Duration must be between ${rental.minDuration} and ${rental.maxDuration} days`);
      return;
    }

    const totalCost = (parseFloat(rental.dailyRate) * rentDuration).toFixed(2);
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + rentDuration * 24 * 60 * 60 * 1000);

    const agreement: RentalAgreement = {
      id: Date.now().toString(),
      rentalId: rental.id,
      renter: address || "0x0000...0000",
      owner: rental.owner,
      duration: rentDuration,
      totalCost,
      collateral: rental.collateral,
      startDate,
      endDate,
      status: "active",
      autoRenew: false,
    };

    setAgreements([agreement, ...agreements]);

    setRentals(
      rentals.map((r) =>
        r.id === rental.id
          ? {
              ...r,
              status: "rented",
              renter: address || "0x0000...0000",
              startDate,
              endDate,
            }
          : r
      )
    );

    setSelectedRental(null);
    alert(`Successfully rented ${rental.nftName} for ${rentDuration} days!`);
  };

  const returnNFT = (agreementId: string) => {
    const agreement = agreements.find((a) => a.id === agreementId);
    if (!agreement) return;

    setAgreements(
      agreements.map((a) =>
        a.id === agreementId ? { ...a, status: "completed" } : a
      )
    );

    setRentals(
      rentals.map((r) =>
        r.id === agreement.rentalId
          ? {
              ...r,
              status: "available",
              renter: null,
              startDate: null,
              endDate: null,
            }
          : r
      )
    );

    alert("NFT returned successfully!");
  };

  const myRentals = agreements.filter((a) => a.renter === address && a.status === "active");
  const myListings = rentals.filter((r) => r.owner === address);
  const availableRentals = rentals.filter((r) => r.status === "available");

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to access NFT rentals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">NFT Rental Marketplace</h2>
            <p className="text-sm text-gray-600">Rent or lend NFTs with smart contracts</p>
          </div>
        </div>
        <button
          onClick={() => setShowListingModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          List NFT
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{availableRentals.length}</div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{myRentals.length}</div>
          <div className="text-sm text-gray-600">My Rentals</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{myListings.length}</div>
          <div className="text-sm text-gray-600">My Listings</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {rentals.reduce((sum, r) => sum + parseFloat(r.totalEarned), 0).toFixed(2)} ETH
          </div>
          <div className="text-sm text-gray-600">Total Volume</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "marketplace", label: "Marketplace", icon: Package },
          { id: "myRentals", label: "My Rentals", icon: Clock },
          { id: "myListings", label: "My Listings", icon: Award },
          { id: "history", label: "History", icon: Calendar },
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
          {availableRentals.map((rental) => (
            <div
              key={rental.id}
              className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={rental.nftImage}
                  alt={rental.nftName}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                  Available
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{rental.nftName}</h3>
                  <p className="text-sm text-gray-600">{rental.collection}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Daily Rate</div>
                    <div className="text-lg font-bold text-purple-600">{rental.dailyRate} ETH</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Collateral</div>
                    <div className="text-lg font-bold text-blue-600">{rental.collateral} ETH</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{rental.minDuration}-{rental.maxDuration} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span>{rental.rating > 0 ? rental.rating.toFixed(1) : "New"}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 mb-4">
                  Rented {rental.rentCount} times • {rental.reviews} reviews
                </div>

                <button
                  onClick={() => setSelectedRental(rental)}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  Rent Now
                </button>
              </div>
            </div>
          ))}

          {availableRentals.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No NFTs available for rent</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "myRentals" && (
        <div className="space-y-4">
          {myRentals.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You don't have any active rentals</p>
            </div>
          ) : (
            myRentals.map((agreement) => {
              const rental = rentals.find((r) => r.id === agreement.rentalId);
              if (!rental) return null;

              const daysLeft = Math.ceil((agreement.endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

              return (
                <div key={agreement.id} className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <img
                        src={rental.nftImage}
                        alt={rental.nftName}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{rental.nftName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{rental.collection}</p>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            Active
                          </span>
                          <span className="text-sm text-gray-600">
                            {daysLeft} days left
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{agreement.duration}</div>
                      <div className="text-xs text-gray-600">Days</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{agreement.totalCost} ETH</div>
                      <div className="text-xs text-gray-600">Total Cost</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{agreement.collateral} ETH</div>
                      <div className="text-xs text-gray-600">Collateral</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">
                        {agreement.startDate.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-600">Start Date</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => returnNFT(agreement.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Return NFT
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                      Extend Rental
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "myListings" && (
        <div className="space-y-4">
          {myListings.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You haven't listed any NFTs</p>
              <button
                onClick={() => setShowListingModal(true)}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                List Your First NFT
              </button>
            </div>
          ) : (
            myListings.map((rental) => (
              <div key={rental.id} className="border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <img
                      src={rental.nftImage}
                      alt={rental.nftName}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{rental.nftName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{rental.collection}</p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          rental.status === "available"
                            ? "bg-green-100 text-green-700"
                            : rental.status === "rented"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {rental.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-3 mb-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{rental.dailyRate} ETH</div>
                    <div className="text-xs text-gray-600">Daily Rate</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{rental.collateral} ETH</div>
                    <div className="text-xs text-gray-600">Collateral</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{rental.totalEarned} ETH</div>
                    <div className="text-xs text-gray-600">Earned</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">{rental.rentCount}</div>
                    <div className="text-xs text-gray-600">Rentals</div>
                  </div>
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <div className="text-lg font-bold text-pink-600">
                      {rental.rating > 0 ? rental.rating.toFixed(1) : "N/A"}
                    </div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                    Edit Listing
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    Remove Listing
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No rental history yet</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.nftName}</h3>
                    <p className="text-sm text-gray-600">
                      {item.startDate.toLocaleDateString()} - {item.endDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{item.cost} ETH</div>
                    <div className="text-sm text-gray-600">{item.duration} days</div>
                  </div>
                </div>

                {item.review && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Award
                            key={i}
                            className={`w-4 h-4 ${
                              i < item.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">Rating: {item.rating}/5</span>
                    </div>
                    <p className="text-sm text-gray-700">{item.review}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Rental Modal */}
      {selectedRental && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Rent NFT</h2>
                  <p className="text-gray-600">{selectedRental.nftName}</p>
                </div>
                <button
                  onClick={() => setSelectedRental(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <img
                src={selectedRental.nftImage}
                alt={selectedRental.nftName}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rental Duration: {rentDuration} days
                </label>
                <input
                  type="range"
                  min={selectedRental.minDuration}
                  max={selectedRental.maxDuration}
                  value={rentDuration}
                  onChange={(e) => setRentDuration(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>{selectedRental.minDuration} days</span>
                  <span>{selectedRental.maxDuration} days</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Cost</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {(parseFloat(selectedRental.dailyRate) * rentDuration).toFixed(2)} ETH
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Collateral Required</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedRental.collateral} ETH
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-semibold mb-1">Important</p>
                    <p>
                      The collateral will be locked for the rental period and returned when you return
                      the NFT on time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => rentNFT(selectedRental)}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Confirm Rental
                </button>
                <button
                  onClick={() => setSelectedRental(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listing Modal */}
      {showListingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">List NFT for Rent</h2>
                  <p className="text-gray-600">Set your rental terms</p>
                </div>
                <button
                  onClick={() => setShowListingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NFT Name *</label>
                  <input
                    type="text"
                    value={newListing.nftName}
                    onChange={(e) => setNewListing({ ...newListing, nftName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Bored Ape #1234"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NFT ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={newListing.nftId}
                      onChange={(e) => setNewListing({ ...newListing, nftId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Token ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Collection</label>
                    <input
                      type="text"
                      value={newListing.collection}
                      onChange={(e) => setNewListing({ ...newListing, collection: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Collection Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Rate (ETH) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newListing.dailyRate}
                      onChange={(e) => setNewListing({ ...newListing, dailyRate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Collateral (ETH) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newListing.collateral}
                      onChange={(e) => setNewListing({ ...newListing, collateral: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="2.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Duration (days)
                    </label>
                    <input
                      type="number"
                      value={newListing.minDuration}
                      onChange={(e) => setNewListing({ ...newListing, minDuration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Duration (days)
                    </label>
                    <input
                      type="number"
                      value={newListing.maxDuration}
                      onChange={(e) => setNewListing({ ...newListing, maxDuration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <button
                  onClick={listNFT}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  List NFT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

