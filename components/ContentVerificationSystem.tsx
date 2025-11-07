"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Shield,
  Check,
  X,
  AlertCircle,
  Clock,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Database,
  Search,
  TrendingUp,
  Award,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Zap,
  Globe,
} from "lucide-react";

interface VerificationRequest {
  id: string;
  contentHash: string;
  contentType: "text" | "image" | "video" | "url";
  contentPreview: string;
  requester: string;
  timestamp: Date;
  status: "pending" | "verifying" | "verified" | "failed" | "disputed";
  oracleUsed: string[];
  verificationScore: number;
  metadata?: {
    source?: string;
    author?: string;
    publishedDate?: string;
    license?: string;
  };
}

interface VerificationResult {
  id: string;
  requestId: string;
  oracle: string;
  result: "authentic" | "fake" | "inconclusive";
  confidence: number;
  evidence: string[];
  timestamp: Date;
  txHash?: string;
}

interface Oracle {
  id: string;
  name: string;
  description: string;
  type: "fact-checking" | "plagiarism" | "deepfake" | "metadata" | "consensus";
  reputation: number;
  totalVerifications: number;
  accuracy: number;
  isActive: boolean;
  fee: string;
}

export function ContentVerificationSystem() {
  const { address, isConnected } = useAccount();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [oracles, setOracles] = useState<Oracle[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [activeTab, setActiveTab] = useState<"verify" | "myRequests" | "oracles" | "analytics">("verify");

  // New Verification Form
  const [newVerification, setNewVerification] = useState({
    contentType: "text" as "text" | "image" | "video" | "url",
    content: "",
    source: "",
    author: "",
  });

  const [selectedOracles, setSelectedOracles] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  // Mock data - Replace with blockchain/oracle data
  useEffect(() => {
    const mockOracles: Oracle[] = [
      {
        id: "1",
        name: "FactCheck Oracle",
        description: "Verifies factual claims against trusted databases",
        type: "fact-checking",
        reputation: 95,
        totalVerifications: 1234,
        accuracy: 94.5,
        isActive: true,
        fee: "0.01",
      },
      {
        id: "2",
        name: "PlagiarismGuard",
        description: "Detects plagiarized content across multiple sources",
        type: "plagiarism",
        reputation: 92,
        totalVerifications: 987,
        accuracy: 91.8,
        isActive: true,
        fee: "0.015",
      },
      {
        id: "3",
        name: "DeepFake Detector",
        description: "AI-powered detection of manipulated images and videos",
        type: "deepfake",
        reputation: 88,
        totalVerifications: 654,
        accuracy: 89.2,
        isActive: true,
        fee: "0.02",
      },
      {
        id: "4",
        name: "MetaVerify",
        description: "Verifies metadata, timestamps, and digital signatures",
        type: "metadata",
        reputation: 90,
        totalVerifications: 1567,
        accuracy: 96.3,
        isActive: true,
        fee: "0.008",
      },
      {
        id: "5",
        name: "ConsensusNet",
        description: "Aggregates verification from multiple oracles",
        type: "consensus",
        reputation: 93,
        totalVerifications: 2341,
        accuracy: 92.7,
        isActive: true,
        fee: "0.025",
      },
    ];
    setOracles(mockOracles);

    const mockRequests: VerificationRequest[] = [
      {
        id: "1",
        contentHash: "0x1234567890abcdef1234567890abcdef12345678",
        contentType: "text",
        contentPreview: "Breaking news: Major development in blockchain technology...",
        requester: address || "0x1111...2222",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: "verified",
        oracleUsed: ["1", "5"],
        verificationScore: 92,
        metadata: {
          source: "TechNews",
          author: "John Doe",
          publishedDate: "2024-01-15",
        },
      },
      {
        id: "2",
        contentHash: "0xabcdef1234567890abcdef1234567890abcdef12",
        contentType: "image",
        contentPreview: "Image showing alleged event...",
        requester: "0x3333...4444",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: "verifying",
        oracleUsed: ["3", "4"],
        verificationScore: 0,
      },
      {
        id: "3",
        contentHash: "0x567890abcdef1234567890abcdef1234567890ab",
        contentType: "video",
        contentPreview: "Video clip from social media...",
        requester: address || "0x1111...2222",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: "failed",
        oracleUsed: ["3"],
        verificationScore: 23,
        metadata: {
          source: "SocialMedia",
        },
      },
    ];
    setRequests(mockRequests);

    const mockResults: VerificationResult[] = [
      {
        id: "1",
        requestId: "1",
        oracle: "FactCheck Oracle",
        result: "authentic",
        confidence: 94,
        evidence: [
          "Matched with verified source",
          "Author credentials confirmed",
          "Timeline consistent with events",
        ],
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        txHash: "0xabc...def",
      },
      {
        id: "2",
        requestId: "1",
        oracle: "ConsensusNet",
        result: "authentic",
        confidence: 90,
        evidence: [
          "Multiple oracles confirm authenticity",
          "No manipulation detected",
        ],
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        txHash: "0x123...456",
      },
      {
        id: "3",
        requestId: "3",
        oracle: "DeepFake Detector",
        result: "fake",
        confidence: 87,
        evidence: [
          "Video manipulation detected",
          "Inconsistent lighting patterns",
          "Audio-video desynchronization",
        ],
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        txHash: "0x789...abc",
      },
    ];
    setResults(mockResults);
  }, [address]);

  const submitVerification = async () => {
    if (!newVerification.content || selectedOracles.length === 0) {
      alert("Please provide content and select at least one oracle");
      return;
    }

    setIsVerifying(true);

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const contentHash = "0x" + Math.random().toString(16).substring(2, 42);
    const request: VerificationRequest = {
      id: Date.now().toString(),
      contentHash,
      contentType: newVerification.contentType,
      contentPreview: newVerification.content.substring(0, 100) + "...",
      requester: address || "0x0000...0000",
      timestamp: new Date(),
      status: "verifying",
      oracleUsed: selectedOracles,
      verificationScore: 0,
      metadata: {
        source: newVerification.source || undefined,
        author: newVerification.author || undefined,
      },
    };

    setRequests([request, ...requests]);
    setIsVerifying(false);
    setNewVerification({
      contentType: "text",
      content: "",
      source: "",
      author: "",
    });
    setSelectedOracles([]);
    setActiveTab("myRequests");

    // Simulate oracle responses
    setTimeout(() => {
      const updatedRequest = {
        ...request,
        status: "verified" as const,
        verificationScore: Math.floor(Math.random() * 30) + 70,
      };
      setRequests((prev) => prev.map((r) => (r.id === request.id ? updatedRequest : r)));
    }, 5000);

    alert("Verification request submitted!");
  };

  const getStatusIcon = (status: VerificationRequest["status"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "verifying":
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case "disputed":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const myRequests = requests.filter((r) => r.requester === address);
  const totalFee = selectedOracles.reduce((sum, id) => {
    const oracle = oracles.find((o) => o.id === id);
    return sum + (oracle ? parseFloat(oracle.fee) : 0);
  }, 0);

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to verify content</p>
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
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Content Verification System</h2>
            <p className="text-sm text-gray-600">Oracle-based content authentication</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{requests.filter((r) => r.status === "verified").length}</div>
          <div className="text-sm text-gray-600">Verified</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{requests.filter((r) => r.status === "verifying").length}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{myRequests.length}</div>
          <div className="text-sm text-gray-600">My Requests</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{oracles.filter((o) => o.isActive).length}</div>
          <div className="text-sm text-gray-600">Active Oracles</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "verify", label: "Verify Content", icon: Shield },
          { id: "myRequests", label: "My Requests", icon: FileText },
          { id: "oracles", label: "Oracles", icon: Database },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
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

      {/* Verify Tab */}
      {activeTab === "verify" && (
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "text", icon: FileText, label: "Text" },
                  { id: "image", icon: ImageIcon, label: "Image" },
                  { id: "video", icon: Video, label: "Video" },
                  { id: "url", icon: LinkIcon, label: "URL" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNewVerification({ ...newVerification, contentType: type.id as any })}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                      newVerification.contentType === type.id
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <type.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content to Verify</label>
              <textarea
                value={newVerification.content}
                onChange={(e) => setNewVerification({ ...newVerification, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[150px]"
                placeholder={`Enter ${newVerification.contentType} content or URL...`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source (Optional)</label>
                <input
                  type="text"
                  value={newVerification.source}
                  onChange={(e) => setNewVerification({ ...newVerification, source: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Source name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author (Optional)</label>
                <input
                  type="text"
                  value={newVerification.author}
                  onChange={(e) => setNewVerification({ ...newVerification, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Author name"
                />
              </div>
            </div>

            {/* Oracle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Verification Oracles ({selectedOracles.length} selected)
              </label>
              <div className="space-y-2">
                {oracles
                  .filter((o) => o.isActive)
                  .map((oracle) => (
                    <div
                      key={oracle.id}
                      onClick={() => {
                        if (selectedOracles.includes(oracle.id)) {
                          setSelectedOracles(selectedOracles.filter((id) => id !== oracle.id));
                        } else {
                          setSelectedOracles([...selectedOracles, oracle.id]);
                        }
                      }}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedOracles.includes(oracle.id)
                          ? "border-green-600 bg-green-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{oracle.name}</h4>
                            {selectedOracles.includes(oracle.id) && (
                              <Check className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{oracle.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              <span>{oracle.reputation}% reputation</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>{oracle.accuracy}% accuracy</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              <span>{oracle.fee} ETH</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {selectedOracles.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Total Fee:</span> {totalFee.toFixed(3)} ETH
                </div>
                <div className="text-xs text-gray-600">
                  {selectedOracles.length} oracle{selectedOracles.length !== 1 ? "s" : ""} selected
                </div>
              </div>
            )}

            <button
              onClick={submitVerification}
              disabled={!newVerification.content || selectedOracles.length === 0 || isVerifying}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Submit for Verification
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* My Requests Tab */}
      {activeTab === "myRequests" && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You haven't submitted any verification requests yet</p>
              <button
                onClick={() => setActiveTab("verify")}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Your First Request
              </button>
            </div>
          ) : (
            myRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(request.status)}
                      <span className="font-semibold text-gray-900 capitalize">{request.status}</span>
                      {request.status === "verified" && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(request.verificationScore)}`}>
                          Score: {request.verificationScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.contentPreview}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{request.contentType.toUpperCase()}</span>
                      <span>{request.oracleUsed.length} oracles</span>
                      <span>{new Date(request.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRequest(request)}
                  className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Oracles Tab */}
      {activeTab === "oracles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {oracles.map((oracle) => (
            <div key={oracle.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{oracle.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{oracle.description}</p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    {oracle.type}
                  </span>
                </div>
                {oracle.isActive && (
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="text-lg font-bold text-purple-600">{oracle.reputation}%</div>
                  <div className="text-xs text-gray-600">Reputation</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-600">{oracle.accuracy}%</div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-lg font-bold text-blue-600">{oracle.totalVerifications}</div>
                  <div className="text-xs text-gray-600">Verifications</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fee:</span>
                <span className="font-semibold text-gray-900">{oracle.fee} ETH</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {((requests.filter((r) => r.status === "verified").length / requests.length) * 100 || 0).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Verification Rate</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {(requests.reduce((sum, r) => sum + r.verificationScore, 0) / requests.length || 0).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Avg Verification Score</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {requests.filter((r) => r.requester === address).length}
              </div>
              <div className="text-sm text-gray-600">Your Submissions</div>
            </div>
          </div>

          {/* Recent Verifications */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Recent Verifications</h3>
            <div className="space-y-2">
              {requests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {request.contentPreview.substring(0, 50)}...
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(request.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {request.status === "verified" && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(request.verificationScore)}`}>
                      {request.verificationScore}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Details</h2>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedRequest.status)}
                    <span className="font-semibold capitalize">{selectedRequest.status}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedRequest.status === "verified" && (
                <div className={`mb-4 p-4 rounded-lg ${getScoreColor(selectedRequest.verificationScore)}`}>
                  <div className="text-2xl font-bold mb-1">
                    Verification Score: {selectedRequest.verificationScore}%
                  </div>
                  <div className="text-sm">
                    {selectedRequest.verificationScore >= 80
                      ? "High confidence - Content appears authentic"
                      : selectedRequest.verificationScore >= 60
                      ? "Moderate confidence - Further review recommended"
                      : "Low confidence - Content may be fake or manipulated"}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Content</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRequest.contentPreview}</p>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Type:</span>
                  <div className="font-medium text-gray-900">{selectedRequest.contentType.toUpperCase()}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Hash:</span>
                  <div className="font-medium text-gray-900 text-xs break-all">
                    {selectedRequest.contentHash}
                  </div>
                </div>
              </div>

              {selectedRequest.metadata && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Metadata</h3>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                    {selectedRequest.metadata.source && (
                      <div>
                        <span className="text-gray-600">Source:</span>{" "}
                        <span className="text-gray-900">{selectedRequest.metadata.source}</span>
                      </div>
                    )}
                    {selectedRequest.metadata.author && (
                      <div>
                        <span className="text-gray-600">Author:</span>{" "}
                        <span className="text-gray-900">{selectedRequest.metadata.author}</span>
                      </div>
                    )}
                    {selectedRequest.metadata.publishedDate && (
                      <div>
                        <span className="text-gray-600">Published:</span>{" "}
                        <span className="text-gray-900">{selectedRequest.metadata.publishedDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Oracle Results</h3>
                <div className="space-y-2">
                  {results
                    .filter((r) => r.requestId === selectedRequest.id)
                    .map((result) => (
                      <div key={result.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{result.oracle}</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              result.result === "authentic"
                                ? "bg-green-100 text-green-600"
                                : result.result === "fake"
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {result.result.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Confidence: {result.confidence}%
                        </div>
                        <div className="text-xs text-gray-600">
                          <div className="font-medium mb-1">Evidence:</div>
                          <ul className="list-disc list-inside space-y-1">
                            {result.evidence.map((e, i) => (
                              <li key={i}>{e}</li>
                            ))}
                          </ul>
                        </div>
                        {result.txHash && (
                          <div className="mt-2 text-xs text-gray-600">
                            TX: {result.txHash}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

