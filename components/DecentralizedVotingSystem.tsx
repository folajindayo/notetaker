"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Vote,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Shield,
  Lock,
  Unlock,
  Target,
  Award,
  Eye,
  MessageSquare,
} from "lucide-react";

interface Poll {
  id: string;
  title: string;
  description: string;
  creator: string;
  category: "governance" | "feature" | "treasury" | "general";
  options: PollOption[];
  startTime: Date;
  endTime: Date;
  status: "upcoming" | "active" | "ended";
  votingType: "single" | "multiple" | "weighted";
  requiresToken: boolean;
  requiredTokenAmount?: string;
  tokenSymbol?: string;
  totalVotes: number;
  quorumRequired: number;
  quorumReached: boolean;
  isPrivate: boolean;
  allowedVoters?: string[];
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  voters: string[];
}

interface UserVote {
  id: string;
  pollId: string;
  voter: string;
  optionIds: string[];
  weight: number;
  timestamp: Date;
  txHash: string;
}

export function DecentralizedVotingSystem() {
  const { address, isConnected } = useAccount();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "create" | "myVotes" | "results">("active");

  const [newPoll, setNewPoll] = useState({
    title: "",
    description: "",
    category: "general" as "governance" | "feature" | "treasury" | "general",
    votingType: "single" as "single" | "multiple" | "weighted",
    duration: "7",
    quorumRequired: "10",
    requiresToken: false,
    tokenSymbol: "",
    requiredAmount: "",
    isPrivate: false,
  });

  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const categoryColors = {
    governance: "bg-purple-100 text-purple-700",
    feature: "bg-blue-100 text-blue-700",
    treasury: "bg-green-100 text-green-700",
    general: "bg-gray-100 text-gray-700",
  };

  useEffect(() => {
    const now = new Date();
    const mockPolls: Poll[] = [
      {
        id: "1",
        title: "Should we implement NFT staking rewards?",
        description: "Vote on whether to add NFT staking with 15% APY rewards for holders",
        creator: "0x1111...2222",
        category: "feature",
        options: [
          { id: "1a", text: "Yes, implement immediately", votes: 450, percentage: 75, voters: [address || "0x5555...6666"] },
          { id: "1b", text: "No, focus on other features", votes: 100, percentage: 16.7, voters: [] },
          { id: "1c", text: "Need more information", votes: 50, percentage: 8.3, voters: [] },
        ],
        startTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        status: "active",
        votingType: "single",
        requiresToken: true,
        requiredTokenAmount: "100",
        tokenSymbol: "NOTE",
        totalVotes: 600,
        quorumRequired: 500,
        quorumReached: true,
        isPrivate: false,
      },
      {
        id: "2",
        title: "Allocate 10 ETH from treasury for marketing",
        description: "Proposal to allocate funds for Q1 marketing campaign",
        creator: address || "0x3333...4444",
        category: "treasury",
        options: [
          { id: "2a", text: "Approve allocation", votes: 320, percentage: 64, voters: [] },
          { id: "2b", text: "Reject allocation", votes: 180, percentage: 36, voters: [] },
        ],
        startTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        status: "active",
        votingType: "weighted",
        requiresToken: true,
        requiredTokenAmount: "1000",
        tokenSymbol: "GOV",
        totalVotes: 500,
        quorumRequired: 400,
        quorumReached: true,
        isPrivate: false,
      },
      {
        id: "3",
        title: "Choose the next feature to develop",
        description: "Community vote on development priorities",
        creator: "0x5555...6666",
        category: "governance",
        options: [
          { id: "3a", text: "Mobile app", votes: 230, percentage: 46, voters: [] },
          { id: "3b", text: "DeFi integration", votes: 170, percentage: 34, voters: [] },
          { id: "3c", text: "Social features", votes: 100, percentage: 20, voters: [] },
        ],
        startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        status: "ended",
        votingType: "multiple",
        requiresToken: false,
        totalVotes: 500,
        quorumRequired: 300,
        quorumReached: true,
        isPrivate: false,
      },
    ];
    setPolls(mockPolls);

    const mockVotes: UserVote[] = [
      {
        id: "1",
        pollId: "1",
        voter: address || "0x5555...6666",
        optionIds: ["1a"],
        weight: 150,
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        txHash: "0xabc...def",
      },
    ];
    setUserVotes(mockVotes);
  }, [address]);

  const createPoll = () => {
    if (!newPoll.title || !newPoll.description) {
      alert("Please fill in required fields");
      return;
    }

    const validOptions = pollOptions.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      alert("Please add at least 2 options");
      return;
    }

    const now = new Date();
    const poll: Poll = {
      id: Date.now().toString(),
      title: newPoll.title,
      description: newPoll.description,
      creator: address || "0x0000...0000",
      category: newPoll.category,
      options: validOptions.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
        votes: 0,
        percentage: 0,
        voters: [],
      })),
      startTime: now,
      endTime: new Date(now.getTime() + parseInt(newPoll.duration) * 24 * 60 * 60 * 1000),
      status: "active",
      votingType: newPoll.votingType,
      requiresToken: newPoll.requiresToken,
      requiredTokenAmount: newPoll.requiresToken ? newPoll.requiredAmount : undefined,
      tokenSymbol: newPoll.requiresToken ? newPoll.tokenSymbol : undefined,
      totalVotes: 0,
      quorumRequired: parseInt(newPoll.quorumRequired),
      quorumReached: false,
      isPrivate: newPoll.isPrivate,
    };

    setPolls([poll, ...polls]);
    setNewPoll({
      title: "",
      description: "",
      category: "general",
      votingType: "single",
      duration: "7",
      quorumRequired: "10",
      requiresToken: false,
      tokenSymbol: "",
      requiredAmount: "",
      isPrivate: false,
    });
    setPollOptions(["", ""]);
    setActiveTab("active");
    alert("Poll created successfully!");
  };

  const vote = (poll: Poll) => {
    if (!address || selectedOptions.length === 0) {
      alert("Please select at least one option");
      return;
    }

    if (poll.votingType === "single" && selectedOptions.length > 1) {
      alert("You can only select one option for this poll");
      return;
    }

    // Check if already voted
    const hasVoted = userVotes.some((v) => v.pollId === poll.id && v.voter === address);
    if (hasVoted) {
      alert("You have already voted on this poll");
      return;
    }

    const vote: UserVote = {
      id: Date.now().toString(),
      pollId: poll.id,
      voter: address,
      optionIds: selectedOptions,
      weight: 100, // Can be calculated based on token holdings
      timestamp: new Date(),
      txHash: "0x" + Math.random().toString(16).substring(2, 42),
    };

    setUserVotes([vote, ...userVotes]);

    // Update poll with new votes
    setPolls(
      polls.map((p) => {
        if (p.id === poll.id) {
          const updatedOptions = p.options.map((opt) => {
            if (selectedOptions.includes(opt.id)) {
              return {
                ...opt,
                votes: opt.votes + 1,
                voters: [...opt.voters, address],
              };
            }
            return opt;
          });

          const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);
          const optionsWithPercentage = updatedOptions.map((opt) => ({
            ...opt,
            percentage: totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0,
          }));

          return {
            ...p,
            options: optionsWithPercentage,
            totalVotes: totalVotes,
            quorumReached: totalVotes >= p.quorumRequired,
          };
        }
        return p;
      })
    );

    setSelectedOptions([]);
    setSelectedPoll(null);
    alert("Vote submitted successfully!");
  };

  const addOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const removeOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const toggleOption = (optionId: string, poll: Poll) => {
    if (poll.votingType === "single") {
      setSelectedOptions([optionId]);
    } else {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    }
  };

  const activePolls = polls.filter((p) => p.status === "active");
  const endedPolls = polls.filter((p) => p.status === "ended");
  const myPolls = polls.filter((p) => p.creator === address);
  const myVotedPolls = polls.filter((p) => userVotes.some((v) => v.pollId === p.id && v.voter === address));

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to participate in voting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Vote className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Decentralized Voting</h2>
            <p className="text-sm text-gray-600">On-chain governance and community polls</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab("create")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Vote className="w-4 h-4" />
          Create Poll
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{activePolls.length}</div>
          <div className="text-sm text-gray-600">Active Polls</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{myVotedPolls.length}</div>
          <div className="text-sm text-gray-600">My Votes</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{myPolls.length}</div>
          <div className="text-sm text-gray-600">My Polls</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {polls.reduce((sum, p) => sum + p.totalVotes, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Votes</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "active", label: "Active Polls", icon: Vote },
          { id: "create", label: "Create Poll", icon: Target },
          { id: "myVotes", label: "My Votes", icon: CheckCircle },
          { id: "results", label: "Results", icon: BarChart3 },
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

      {activeTab === "active" && (
        <div className="space-y-4">
          {activePolls.length === 0 ? (
            <div className="text-center py-12">
              <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No active polls at the moment</p>
            </div>
          ) : (
            activePolls.map((poll) => {
              const hasVoted = userVotes.some((v) => v.pollId === poll.id && v.voter === address);
              const timeLeft = poll.endTime.getTime() - Date.now();
              const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60 * 1000));

              return (
                <div
                  key={poll.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{poll.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${categoryColors[poll.category]}`}>
                          {poll.category}
                        </span>
                        {poll.requiresToken && (
                          <Shield className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{poll.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{poll.totalVotes} votes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{daysLeft} days left</span>
                        </div>
                        {poll.quorumReached && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Quorum reached</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {hasVoted && (
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Voted
                      </div>
                    )}
                  </div>

                  {!hasVoted ? (
                    <button
                      onClick={() => setSelectedPoll(poll)}
                      className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Vote className="w-5 h-5" />
                      Vote Now
                    </button>
                  ) : (
                    <div className="space-y-2">
                      {poll.options.map((option) => (
                        <div key={option.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{option.text}</span>
                            <span className="text-sm font-semibold text-purple-600">
                              {option.percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all"
                              style={{ width: `${option.percentage}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{option.votes} votes</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "create" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Vote className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-purple-900">
                <p className="font-semibold mb-1">Create a Community Poll</p>
                <p className="text-purple-700">
                  Create polls for governance decisions, feature requests, or general community feedback.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Poll Title *</label>
            <input
              type="text"
              value={newPoll.title}
              onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="What should we prioritize next?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={newPoll.description}
              onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[100px]"
              placeholder="Provide details about what you're asking..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newPoll.category}
                onChange={(e) => setNewPoll({ ...newPoll, category: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="general">General</option>
                <option value="governance">Governance</option>
                <option value="feature">Feature Request</option>
                <option value="treasury">Treasury</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voting Type</label>
              <select
                value={newPoll.votingType}
                onChange={(e) => setNewPoll({ ...newPoll, votingType: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="single">Single Choice</option>
                <option value="multiple">Multiple Choice</option>
                <option value="weighted">Weighted (by tokens)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Poll Options *</label>
            <div className="space-y-2">
              {pollOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder={`Option ${index + 1}`}
                  />
                  {pollOptions.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOption}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-gray-600 hover:text-purple-600"
              >
                + Add Option
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
              <input
                type="number"
                min="1"
                value={newPoll.duration}
                onChange={(e) => setNewPoll({ ...newPoll, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quorum Required</label>
              <input
                type="number"
                min="0"
                value={newPoll.quorumRequired}
                onChange={(e) => setNewPoll({ ...newPoll, quorumRequired: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Minimum votes needed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requiresToken"
              checked={newPoll.requiresToken}
              onChange={(e) => setNewPoll({ ...newPoll, requiresToken: e.target.checked })}
              className="rounded border-gray-300 text-purple-600"
            />
            <label htmlFor="requiresToken" className="text-sm text-gray-700">
              Token-Gated Voting
            </label>
          </div>

          {newPoll.requiresToken && (
            <div className="pl-6 border-l-2 border-purple-200 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Token Symbol</label>
                  <input
                    type="text"
                    value={newPoll.tokenSymbol}
                    onChange={(e) => setNewPoll({ ...newPoll, tokenSymbol: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="NOTE"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Required Amount</label>
                  <input
                    type="number"
                    value={newPoll.requiredAmount}
                    onChange={(e) => setNewPoll({ ...newPoll, requiredAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={createPoll}
            className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
          >
            <Vote className="w-6 h-6" />
            Create Poll
          </button>
        </div>
      )}

      {activeTab === "myVotes" && (
        <div className="space-y-4">
          {myVotedPolls.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You haven't voted on any polls yet</p>
            </div>
          ) : (
            myVotedPolls.map((poll) => {
              const myVote = userVotes.find((v) => v.pollId === poll.id && v.voter === address);
              return (
                <div key={poll.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{poll.title}</h3>
                      <p className="text-sm text-gray-600">{poll.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      poll.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {poll.status}
                    </span>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">Your Vote</span>
                    </div>
                    {myVote?.optionIds.map((optionId) => {
                      const option = poll.options.find((o) => o.id === optionId);
                      return (
                        <div key={optionId} className="text-sm text-green-800">
                          • {option?.text}
                        </div>
                      );
                    })}
                    <div className="text-xs text-green-700 mt-2">
                      Voted on {myVote?.timestamp.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {poll.options.map((option) => (
                      <div key={option.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{option.text}</span>
                          <span className="text-sm font-semibold text-purple-600">
                            {option.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "results" && (
        <div className="space-y-4">
          {endedPolls.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No completed polls yet</p>
            </div>
          ) : (
            endedPolls.map((poll) => {
              const winningOption = poll.options.reduce((prev, current) => 
                (current.votes > prev.votes) ? current : prev
              );

              return (
                <div key={poll.id} className="border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{poll.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{poll.totalVotes} total votes</span>
                        <span>Ended {poll.endTime.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-900">Winner</span>
                    </div>
                    <div className="text-lg font-bold text-yellow-900">{winningOption.text}</div>
                    <div className="text-sm text-yellow-700">
                      {winningOption.votes} votes ({winningOption.percentage.toFixed(1)}%)
                    </div>
                  </div>

                  <div className="space-y-2">
                    {poll.options.map((option) => (
                      <div key={option.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{option.text}</span>
                          <span className="text-sm font-semibold text-gray-600">
                            {option.votes} votes
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Voting Modal */}
      {selectedPoll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPoll.title}</h2>
                  <p className="text-gray-600">{selectedPoll.description}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPoll(null);
                    setSelectedOptions([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {selectedPoll.requiresToken && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <div className="text-sm">
                      <span className="font-semibold text-purple-900">Token Required: </span>
                      <span className="text-purple-700">
                        {selectedPoll.requiredTokenAmount} {selectedPoll.tokenSymbol}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  {selectedPoll.votingType === "single" ? "Choose one option:" : "Choose one or more options:"}
                </div>
                <div className="space-y-2">
                  {selectedPoll.options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => toggleOption(option.id, selectedPoll)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedOptions.includes(option.id)
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedOptions.includes(option.id)
                            ? "border-purple-600 bg-purple-600"
                            : "border-gray-300"
                        }`}>
                          {selectedOptions.includes(option.id) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{option.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => vote(selectedPoll)}
                  disabled={selectedOptions.length === 0}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                >
                  <Vote className="w-5 h-5" />
                  Submit Vote
                </button>
                <button
                  onClick={() => {
                    setSelectedPoll(null);
                    setSelectedOptions([]);
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

