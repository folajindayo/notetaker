"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther, Address } from "viem";
import {
  Vote,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  Plus,
  Filter,
  Search,
  ExternalLink,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Zap,
} from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: "active" | "passed" | "rejected" | "expired" | "executed";
  category: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorum: number;
  startTime: number;
  endTime: number;
  executionTime?: number;
  votes: Vote[];
  actions: ProposalAction[];
  discussion: Comment[];
}

interface Vote {
  voter: string;
  choice: "for" | "against" | "abstain";
  weight: number;
  timestamp: number;
  reason?: string;
}

interface ProposalAction {
  target: string;
  value: string;
  signature: string;
  calldata: string;
  description: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  replies: Comment[];
}

interface DAOStats {
  totalProposals: number;
  activeProposals: number;
  passedProposals: number;
  members: number;
  treasury: string;
  votingPower: number;
}

export function DAOProposalsDashboard() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"proposals" | "create" | "stats" | "history">("proposals");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<DAOStats | null>(null);

  // Create proposal form
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [proposalCategory, setProposalCategory] = useState("governance");
  const [proposalDuration, setProposalDuration] = useState("7");
  const [isCreating, setIsCreating] = useState(false);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const categories = [
    { id: "governance", name: "Governance", icon: <Vote className="h-4 w-4" />, color: "blue" },
    { id: "treasury", name: "Treasury", icon: <Target className="h-4 w-4" />, color: "green" },
    { id: "protocol", name: "Protocol", icon: <Zap className="h-4 w-4" />, color: "purple" },
    { id: "community", name: "Community", icon: <Users className="h-4 w-4" />, color: "orange" },
  ];

  useEffect(() => {
    if (isConnected && address) {
      loadProposals();
      loadStats();
    }
  }, [isConnected, address]);

  const loadProposals = () => {
    // Simulate loading proposals
    const mockProposals: Proposal[] = [
      {
        id: "1",
        title: "Increase Staking Rewards by 25%",
        description: "This proposal aims to increase staking rewards from 8% APY to 10% APY to incentivize more users to stake their tokens and participate in governance.",
        proposer: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        status: "active",
        category: "protocol",
        votesFor: 1250000,
        votesAgainst: 450000,
        votesAbstain: 100000,
        quorum: 1000000,
        startTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
        endTime: Date.now() + 5 * 24 * 60 * 60 * 1000,
        votes: [
          {
            voter: "0x1234...5678",
            choice: "for",
            weight: 50000,
            timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
            reason: "This will help grow the ecosystem",
          },
        ],
        actions: [
          {
            target: "0xStakingContract",
            value: "0",
            signature: "setAPY(uint256)",
            calldata: "0x...",
            description: "Set staking APY to 10%",
          },
        ],
        discussion: [],
      },
      {
        id: "2",
        title: "Allocate 500 ETH for Marketing Campaign",
        description: "Propose to allocate 500 ETH from the treasury to fund a comprehensive marketing campaign targeting institutional investors.",
        proposer: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        status: "active",
        category: "treasury",
        votesFor: 850000,
        votesAgainst: 920000,
        votesAbstain: 50000,
        quorum: 1000000,
        startTime: Date.now() - 4 * 24 * 60 * 60 * 1000,
        endTime: Date.now() + 3 * 24 * 60 * 60 * 1000,
        votes: [],
        actions: [
          {
            target: "0xTreasury",
            value: "500",
            signature: "transfer(address,uint256)",
            calldata: "0x...",
            description: "Transfer 500 ETH to marketing wallet",
          },
        ],
        discussion: [],
      },
      {
        id: "3",
        title: "Implement Cross-Chain Bridge to Polygon",
        description: "Technical proposal to implement a secure bridge allowing users to transfer assets between our protocol and Polygon network.",
        proposer: address!,
        status: "passed",
        category: "protocol",
        votesFor: 2100000,
        votesAgainst: 300000,
        votesAbstain: 50000,
        quorum: 1000000,
        startTime: Date.now() - 10 * 24 * 60 * 60 * 1000,
        endTime: Date.now() - 3 * 24 * 60 * 60 * 1000,
        executionTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
        votes: [],
        actions: [],
        discussion: [],
      },
      {
        id: "4",
        title: "Update Governance Voting Period",
        description: "Propose to extend the voting period from 7 days to 10 days to allow more time for community participation.",
        proposer: "0x5555...9999",
        status: "rejected",
        category: "governance",
        votesFor: 650000,
        votesAgainst: 1450000,
        votesAbstain: 75000,
        quorum: 1000000,
        startTime: Date.now() - 15 * 24 * 60 * 60 * 1000,
        endTime: Date.now() - 8 * 24 * 60 * 60 * 1000,
        votes: [],
        actions: [],
        discussion: [],
      },
    ];

    setProposals(mockProposals);
  };

  const loadStats = () => {
    const mockStats: DAOStats = {
      totalProposals: 47,
      activeProposals: 2,
      passedProposals: 28,
      members: 1234,
      treasury: "12500",
      votingPower: 50000,
    };

    setStats(mockStats);
  };

  const handleCreateProposal = async () => {
    if (!proposalTitle || !proposalDescription) return;

    setIsCreating(true);

    try {
      // In a real implementation, this would call the DAO contract
      const newProposal: Proposal = {
        id: Date.now().toString(),
        title: proposalTitle,
        description: proposalDescription,
        proposer: address!,
        status: "active",
        category: proposalCategory,
        votesFor: 0,
        votesAgainst: 0,
        votesAbstain: 0,
        quorum: 1000000,
        startTime: Date.now(),
        endTime: Date.now() + parseInt(proposalDuration) * 24 * 60 * 60 * 1000,
        votes: [],
        actions: [],
        discussion: [],
      };

      setProposals([newProposal, ...proposals]);

      // Reset form
      setProposalTitle("");
      setProposalDescription("");
      setProposalCategory("governance");
      setProposalDuration("7");
      setIsCreating(false);
      setActiveTab("proposals");
    } catch (error) {
      console.error("Failed to create proposal:", error);
      setIsCreating(false);
    }
  };

  const handleVote = async (proposalId: string, choice: "for" | "against" | "abstain") => {
    try {
      // In a real implementation, this would call the DAO contract
      const updatedProposals = proposals.map((p) => {
        if (p.id === proposalId) {
          const voteWeight = stats?.votingPower || 0;
          const newVote: Vote = {
            voter: address!,
            choice,
            weight: voteWeight,
            timestamp: Date.now(),
          };

          return {
            ...p,
            votesFor: choice === "for" ? p.votesFor + voteWeight : p.votesFor,
            votesAgainst: choice === "against" ? p.votesAgainst + voteWeight : p.votesAgainst,
            votesAbstain: choice === "abstain" ? p.votesAbstain + voteWeight : p.votesAbstain,
            votes: [...p.votes, newVote],
          };
        }
        return p;
      });

      setProposals(updatedProposals);
    } catch (error) {
      console.error("Vote failed:", error);
    }
  };

  const getFilteredProposals = () => {
    let filtered = proposals;

    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusColor = (status: Proposal["status"]) => {
    const colors: Record<Proposal["status"], string> = {
      active: "bg-blue-100 text-blue-800",
      passed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
      executed: "bg-purple-100 text-purple-800",
    };
    return colors[status];
  };

  const getStatusIcon = (status: Proposal["status"]) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />;
      case "passed":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "expired":
        return <AlertCircle className="h-4 w-4" />;
      case "executed":
        return <Zap className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    const colors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      purple: "bg-purple-100 text-purple-800",
      orange: "bg-orange-100 text-orange-800",
    };
    return colors[category?.color || "blue"];
  };

  const calculateProgress = (proposal: Proposal) => {
    const total = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
    if (total === 0) return { for: 0, against: 0, abstain: 0 };

    return {
      for: (proposal.votesFor / total) * 100,
      against: (proposal.votesAgainst / total) * 100,
      abstain: (proposal.votesAbstain / total) * 100,
    };
  };

  const hasVoted = (proposal: Proposal) => {
    return proposal.votes.some((v) => v.voter === address);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-sm text-gray-600">
            Please connect your wallet to participate in DAO governance
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
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Vote className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                DAO Proposals Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Create and vote on governance proposals
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("create")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Proposal
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Proposals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProposals}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-gray-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.activeProposals}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Passed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.passedProposals}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Treasury</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.treasury}
                  </p>
                  <p className="text-xs text-gray-500">ETH</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Power</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.votingPower.toLocaleString()}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("proposals")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "proposals"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Proposals ({proposals.length})
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "create"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Create Proposal
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "stats"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "history"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          History
        </button>
      </div>

      {/* Proposals Tab */}
      {activeTab === "proposals" && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search proposals..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="passed">Passed</option>
              <option value="rejected">Rejected</option>
              <option value="executed">Executed</option>
            </select>
          </div>

          {/* Proposals List */}
          <div className="space-y-4">
            {getFilteredProposals().map((proposal) => {
              const progress = calculateProgress(proposal);
              const voted = hasVoted(proposal);
              const isActive = proposal.status === "active";

              return (
                <div
                  key={proposal.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {proposal.title}
                        </h3>
                        <span
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            proposal.status
                          )}`}
                        >
                          {getStatusIcon(proposal.status)}
                          {proposal.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            proposal.category
                          )}`}
                        >
                          {proposal.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {proposal.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Proposed by {proposal.proposer.slice(0, 8)}...</span>
                        <span>
                          Ends {new Date(proposal.endTime).toLocaleDateString()}
                        </span>
                        {voted && (
                          <span className="text-blue-600 font-medium">✓ Voted</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vote Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-green-600 font-medium">
                          For: {proposal.votesFor.toLocaleString()}
                        </span>
                        <span className="text-red-600 font-medium">
                          Against: {proposal.votesAgainst.toLocaleString()}
                        </span>
                        <span className="text-gray-600">
                          Abstain: {proposal.votesAbstain.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-gray-600">
                        Quorum: {proposal.quorum.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bars */}
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-green-500 transition-all"
                        style={{ width: `${progress.for}%` }}
                      />
                      <div
                        className="absolute top-0 h-full bg-red-500 transition-all"
                        style={{
                          left: `${progress.for}%`,
                          width: `${progress.against}%`,
                        }}
                      />
                      <div
                        className="absolute top-0 h-full bg-gray-400 transition-all"
                        style={{
                          left: `${progress.for + progress.against}%`,
                          width: `${progress.abstain}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Vote Buttons */}
                  {isActive && !voted && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(proposal.id, "for")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Vote For
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, "against")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Vote Against
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, "abstain")}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Abstain
                      </button>
                    </div>
                  )}

                  {voted && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        You have already voted on this proposal
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Proposal Tab */}
      {activeTab === "create" && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Create New Proposal
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  placeholder="Enter proposal title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                  placeholder="Provide a detailed description of your proposal..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={proposalCategory}
                    onChange={(e) => setProposalCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voting Duration (days)
                  </label>
                  <input
                    type="number"
                    value={proposalDuration}
                    onChange={(e) => setProposalDuration(e.target.value)}
                    min="1"
                    max="30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Important</p>
                    <p>
                      Creating a proposal requires a minimum of{" "}
                      <strong>10,000 voting power</strong>. Your current voting
                      power: <strong>{stats?.votingPower.toLocaleString()}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateProposal}
                disabled={
                  !proposalTitle ||
                  !proposalDescription ||
                  isCreating ||
                  (stats?.votingPower || 0) < 10000
                }
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Creating Proposal...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Proposal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === "stats" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Proposal Status Distribution */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Proposal Status Distribution
              </h3>
              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8">
                <div className="text-center">
                  <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Status distribution chart</p>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Proposals by Category
              </h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {cat.icon}
                      <span className="text-sm font-medium text-gray-900">
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${cat.color}-500`}
                          style={{ width: "60%" }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        12
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Participation Metrics
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-700 mb-1">Avg. Turnout</div>
                <div className="text-2xl font-bold text-blue-900">67.5%</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-700 mb-1">Pass Rate</div>
                <div className="text-2xl font-bold text-green-900">59.6%</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-700 mb-1">Active Members</div>
                <div className="text-2xl font-bold text-purple-900">
                  {stats.members}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-700 mb-1">Avg. Duration</div>
                <div className="text-2xl font-bold text-orange-900">7.2d</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Voting History
          </h3>
          <div className="space-y-3">
            {proposals
              .filter((p) => hasVoted(p))
              .map((proposal) => (
                <div
                  key={proposal.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {proposal.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            proposal.status
                          )}`}
                        >
                          {proposal.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          Voted{" "}
                          {new Date(
                            proposal.votes.find((v) => v.voter === address)
                              ?.timestamp || 0
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        Your Vote:{" "}
                        {proposal.votes.find((v) => v.voter === address)?.choice}
                      </div>
                      <div className="text-xs text-gray-500">
                        Weight:{" "}
                        {proposal.votes
                          .find((v) => v.voter === address)
                          ?.weight.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

