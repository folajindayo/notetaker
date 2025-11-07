"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, formatEther, Address } from "viem";
import {
  Globe,
  Search,
  Check,
  X,
  Clock,
  Star,
  TrendingUp,
  Shield,
  ExternalLink,
  Copy,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap,
  Crown,
  Tag,
  Calendar,
  DollarSign,
  Settings,
  Link as LinkIcon,
} from "lucide-react";

interface Domain {
  name: string;
  owner: string;
  registeredAt: number;
  expiresAt: number;
  price: string;
  premium: boolean;
  status: "available" | "registered" | "expired" | "reserved";
  records: DomainRecord[];
  subdomains: Subdomain[];
}

interface DomainRecord {
  type: "address" | "content" | "text" | "avatar" | "email" | "url" | "twitter" | "github";
  key: string;
  value: string;
}

interface Subdomain {
  name: string;
  owner: string;
  resolver: string;
  createdAt: number;
}

interface SearchResult {
  domain: string;
  available: boolean;
  price: string;
  premium: boolean;
  length: number;
  suggestions?: string[];
}

export function Web3DomainNameSystem() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"search" | "mydomains" | "manage" | "marketplace">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [myDomains, setMyDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationYears, setRegistrationYears] = useState(1);

  // Marketplace state
  const [listedDomains, setListedDomains] = useState<Domain[]>([]);
  const [listingPrice, setListingPrice] = useState("");
  const [showListingModal, setShowListingModal] = useState(false);

  // Domain management
  const [recordType, setRecordType] = useState<DomainRecord["type"]>("address");
  const [recordValue, setRecordValue] = useState("");
  const [isUpdatingRecord, setIsUpdatingRecord] = useState(false);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const recordTypes: Array<{ type: DomainRecord["type"]; label: string; icon: JSX.Element }> = [
    { type: "address", label: "ETH Address", icon: <Globe className="h-4 w-4" /> },
    { type: "avatar", label: "Avatar", icon: <Star className="h-4 w-4" /> },
    { type: "email", label: "Email", icon: <LinkIcon className="h-4 w-4" /> },
    { type: "url", label: "Website", icon: <Globe className="h-4 w-4" /> },
    { type: "twitter", label: "Twitter", icon: <LinkIcon className="h-4 w-4" /> },
    { type: "github", label: "GitHub", icon: <LinkIcon className="h-4 w-4" /> },
  ];

  useEffect(() => {
    if (isConnected && address) {
      loadMyDomains();
      loadMarketplaceDomains();
    }
  }, [isConnected, address]);

  const loadMyDomains = () => {
    // Simulate loading user's domains
    const mockDomains: Domain[] = [
      {
        name: "alice.eth",
        owner: address!,
        registeredAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
        expiresAt: Date.now() + 185 * 24 * 60 * 60 * 1000,
        price: "0.05",
        premium: true,
        status: "registered",
        records: [
          { type: "address", key: "ETH", value: address! },
          { type: "avatar", key: "avatar", value: "ipfs://QmXx..." },
          { type: "twitter", key: "com.twitter", value: "@alice" },
        ],
        subdomains: [
          {
            name: "nft.alice.eth",
            owner: address!,
            resolver: "0x123...",
            createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
          },
        ],
      },
      {
        name: "myproject.eth",
        owner: address!,
        registeredAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
        expiresAt: Date.now() + 275 * 24 * 60 * 60 * 1000,
        price: "0.1",
        premium: false,
        status: "registered",
        records: [
          { type: "address", key: "ETH", value: address! },
          { type: "url", key: "url", value: "https://myproject.com" },
        ],
        subdomains: [],
      },
    ];

    setMyDomains(mockDomains);
  };

  const loadMarketplaceDomains = () => {
    // Simulate loading marketplace listings
    const mockListings: Domain[] = [
      {
        name: "crypto.eth",
        owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        registeredAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
        expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
        price: "50",
        premium: true,
        status: "registered",
        records: [],
        subdomains: [],
      },
      {
        name: "nft.eth",
        owner: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        registeredAt: Date.now() - 500 * 24 * 60 * 60 * 1000,
        expiresAt: Date.now() + 230 * 24 * 60 * 60 * 1000,
        price: "75",
        premium: true,
        status: "registered",
        records: [],
        subdomains: [],
      },
    ];

    setListedDomains(mockListings);
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    setIsSearching(true);

    // Simulate domain search
    setTimeout(() => {
      const domainName = searchQuery.toLowerCase().replace(/\s+/g, "");
      const isAvailable = Math.random() > 0.3; // 70% chance of being available
      const basePrice = domainName.length <= 3 ? "0.5" : domainName.length === 4 ? "0.1" : "0.05";
      const isPremium = domainName.length <= 4;

      const result: SearchResult = {
        domain: `${domainName}.eth`,
        available: isAvailable,
        price: basePrice,
        premium: isPremium,
        length: domainName.length,
        suggestions: isAvailable
          ? []
          : [
              `${domainName}1.eth`,
              `${domainName}web3.eth`,
              `the${domainName}.eth`,
              `${domainName}dao.eth`,
            ],
      };

      setSearchResult(result);
      setIsSearching(false);
    }, 1500);
  };

  const handleRegister = async () => {
    if (!searchResult || !searchResult.available) return;

    setIsRegistering(true);

    try {
      // In a real implementation, this would call the ENS registrar contract
      setTimeout(() => {
        const newDomain: Domain = {
          name: searchResult.domain,
          owner: address!,
          registeredAt: Date.now(),
          expiresAt: Date.now() + registrationYears * 365 * 24 * 60 * 60 * 1000,
          price: (parseFloat(searchResult.price) * registrationYears).toString(),
          premium: searchResult.premium,
          status: "registered",
          records: [{ type: "address", key: "ETH", value: address! }],
          subdomains: [],
        };

        setMyDomains([newDomain, ...myDomains]);
        setIsRegistering(false);
        setSearchResult(null);
        setSearchQuery("");
        setActiveTab("mydomains");
      }, 3000);
    } catch (error) {
      console.error("Registration failed:", error);
      setIsRegistering(false);
    }
  };

  const handleUpdateRecord = async () => {
    if (!selectedDomain || !recordValue) return;

    setIsUpdatingRecord(true);

    try {
      // In a real implementation, this would call the ENS resolver contract
      setTimeout(() => {
        const updatedDomains = myDomains.map((domain) => {
          if (domain.name === selectedDomain.name) {
            const existingRecordIndex = domain.records.findIndex(
              (r) => r.type === recordType
            );

            if (existingRecordIndex >= 0) {
              domain.records[existingRecordIndex].value = recordValue;
            } else {
              domain.records.push({
                type: recordType,
                key: recordType,
                value: recordValue,
              });
            }
          }
          return domain;
        });

        setMyDomains(updatedDomains);
        setSelectedDomain(
          updatedDomains.find((d) => d.name === selectedDomain.name) || null
        );
        setRecordValue("");
        setIsUpdatingRecord(false);
      }, 2000);
    } catch (error) {
      console.error("Update failed:", error);
      setIsUpdatingRecord(false);
    }
  };

  const calculateRegistrationCost = () => {
    if (!searchResult) return "0";
    return (parseFloat(searchResult.price) * registrationYears).toFixed(3);
  };

  const getDaysUntilExpiry = (expiresAt: number) => {
    const days = Math.floor((expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
    return days;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-sm text-gray-600">
            Please connect your wallet to use Web3 domains
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
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Web3 Domain Name System
            </h1>
            <p className="text-sm text-gray-600">
              Register and manage your blockchain domains
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("search")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "search"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Search Domains
        </button>
        <button
          onClick={() => setActiveTab("mydomains")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "mydomains"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          My Domains ({myDomains.length})
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "manage"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Manage
        </button>
        <button
          onClick={() => setActiveTab("marketplace")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "marketplace"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Marketplace ({listedDomains.length})
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Search for a Domain
            </h2>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Enter domain name..."
                  className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  .eth
                </span>
              </div>
              <button
                onClick={handleSearch}
                disabled={!searchQuery || isSearching}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Popular:</span>
              {["crypto", "web3", "defi", "nft", "dao"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    handleSearch();
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {term}.eth
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchResult && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {searchResult.domain}
                    </h3>
                    {searchResult.premium && (
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium flex items-center gap-1">
                        <Crown className="h-4 w-4" />
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {searchResult.length} characters
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    searchResult.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {searchResult.available ? (
                    <>
                      <Check className="h-5 w-5" />
                      Available
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5" />
                      Taken
                    </>
                  )}
                </div>
              </div>

              {searchResult.available ? (
                <>
                  {/* Registration Options */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Registration Period
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setRegistrationYears(Math.max(1, registrationYears - 1))
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-16 text-center font-semibold">
                          {registrationYears} {registrationYears === 1 ? "year" : "years"}
                        </span>
                        <button
                          onClick={() =>
                            setRegistrationYears(Math.min(10, registrationYears + 1))
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Total Cost
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {calculateRegistrationCost()} ETH
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isRegistering ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        Register Domain
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Suggestions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Similar available domains:
                    </h4>
                    <div className="space-y-2">
                      {searchResult.suggestions?.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setSearchQuery(suggestion.replace(".eth", ""))}
                          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="font-medium text-gray-900">
                            {suggestion}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                              0.05 ETH/year
                            </span>
                            <Check className="h-5 w-5 text-green-600" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* My Domains Tab */}
      {activeTab === "mydomains" && (
        <div className="space-y-4">
          {myDomains.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Domains Yet
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Search and register your first domain
              </p>
              <button
                onClick={() => setActiveTab("search")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search Domains
              </button>
            </div>
          ) : (
            myDomains.map((domain) => {
              const daysUntilExpiry = getDaysUntilExpiry(domain.expiresAt);
              const isExpiringSoon = daysUntilExpiry < 30;

              return (
                <div
                  key={domain.name}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {domain.name}
                        </h3>
                        {domain.premium && (
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-medium">
                            Premium
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isExpiringSoon
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isExpiringSoon ? (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Expiring in {daysUntilExpiry} days
                            </span>
                          ) : (
                            `Active`
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Expires: {new Date(domain.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(domain.name)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Copy className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Domain Records */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Records
                    </h4>
                    <div className="space-y-2">
                      {domain.records.map((record, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-600 capitalize">
                            {record.type}
                          </span>
                          <code className="text-sm text-gray-900 truncate max-w-xs">
                            {record.value}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subdomains */}
                  {domain.subdomains.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Subdomains ({domain.subdomains.length})
                      </h4>
                      <div className="space-y-1">
                        {domain.subdomains.map((subdomain, idx) => (
                          <div
                            key={idx}
                            className="text-sm text-gray-600 p-2 bg-gray-50 rounded"
                          >
                            {subdomain.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedDomain(domain);
                        setActiveTab("manage");
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Manage
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Tag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Manage Tab */}
      {activeTab === "manage" && (
        <div className="max-w-3xl mx-auto">
          {selectedDomain ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Manage {selectedDomain.name}
              </h2>

              {/* Update Records */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Update Records
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Record Type
                    </label>
                    <select
                      value={recordType}
                      onChange={(e) =>
                        setRecordType(e.target.value as DomainRecord["type"])
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {recordTypes.map((type) => (
                        <option key={type.type} value={type.type}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value
                    </label>
                    <input
                      type="text"
                      value={recordValue}
                      onChange={(e) => setRecordValue(e.target.value)}
                      placeholder={`Enter ${recordTypes.find((t) => t.type === recordType)?.label}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleUpdateRecord}
                    disabled={!recordValue || isUpdatingRecord}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isUpdatingRecord ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Update Record
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Current Records */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Current Records
                </h3>
                <div className="space-y-2">
                  {selectedDomain.records.map((record, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {record.type}
                        </div>
                        <code className="text-xs text-gray-600 break-all">
                          {record.value}
                        </code>
                      </div>
                      <button className="text-red-600 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a Domain
              </h3>
              <p className="text-sm text-gray-600">
                Choose a domain from "My Domains" to manage
              </p>
            </div>
          )}
        </div>
      )}

      {/* Marketplace Tab */}
      {activeTab === "marketplace" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listedDomains.map((domain) => (
            <div
              key={domain.name}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {domain.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    by {domain.owner.slice(0, 8)}...
                  </p>
                </div>
                {domain.premium && (
                  <Crown className="h-5 w-5 text-yellow-500" />
                )}
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700 mb-1">Listed Price</div>
                <div className="text-2xl font-bold text-blue-900">
                  {domain.price} ETH
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Buy Now
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

