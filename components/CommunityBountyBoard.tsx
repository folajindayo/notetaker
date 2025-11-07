"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Award,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Target,
  Flag,
  Eye,
  MessageSquare,
  Upload,
  Send,
  Filter,
  Search,
} from "lucide-react";

interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: string;
  token: string;
  creator: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  status: "open" | "in_progress" | "under_review" | "completed" | "expired";
  submissions: number;
  deadline: Date;
  createdAt: Date;
  tags: string[];
  applicants: number;
}

interface Submission {
  id: string;
  bountyId: string;
  hunter: string;
  content: string;
  attachments: string[];
  timestamp: Date;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
}

export function CommunityBountyBoard() {
  const { address, isConnected } = useAccount();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [activeTab, setActiveTab] = useState<"browse" | "create" | "myBounties" | "mySubmissions">("browse");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [newBounty, setNewBounty] = useState({
    title: "",
    description: "",
    reward: "",
    token: "ETH",
    category: "development",
    difficulty: "intermediate" as "beginner" | "intermediate" | "advanced" | "expert",
    deadline: "",
    tags: "",
  });

  const [submissionContent, setSubmissionContent] = useState("");

  const categories = ["all", "development", "design", "marketing", "content", "research", "testing", "other"];
  const difficultyColors = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-blue-100 text-blue-700",
    advanced: "bg-purple-100 text-purple-700",
    expert: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    const mockBounties: Bounty[] = [
      {
        id: "1",
        title: "Build NFT Marketplace Integration",
        description: "Integrate OpenSea API and create marketplace interface for our platform",
        reward: "2.5",
        token: "ETH",
        creator: "0x1111...2222",
        category: "development",
        difficulty: "advanced",
        status: "open",
        submissions: 0,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ["solidity", "react", "nft"],
        applicants: 5,
      },
      {
        id: "2",
        title: "Create Marketing Campaign Assets",
        description: "Design social media graphics and promotional materials for Q1 campaign",
        reward: "500",
        token: "USDC",
        creator: address || "0x3333...4444",
        category: "design",
        difficulty: "intermediate",
        status: "in_progress",
        submissions: 1,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tags: ["design", "marketing", "social-media"],
        applicants: 8,
      },
      {
        id: "3",
        title: "Write Technical Documentation",
        description: "Create comprehensive developer documentation for our smart contracts",
        reward: "0.8",
        token: "ETH",
        creator: "0x5555...6666",
        category: "content",
        difficulty: "beginner",
        status: "open",
        submissions: 0,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: ["documentation", "technical-writing"],
        applicants: 3,
      },
    ];
    setBounties(mockBounties);

    const mockSubmissions: Submission[] = [
      {
        id: "1",
        bountyId: "2",
        hunter: address || "0x7777...8888",
        content: "Completed all required assets. Attached files include...",
        attachments: ["design-pack.zip", "social-media-templates.fig"],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: "pending",
      },
    ];
    setSubmissions(mockSubmissions);
  }, [address]);

  const createBounty = () => {
    if (!newBounty.title || !newBounty.description || !newBounty.reward) {
      alert("Please fill in all required fields");
      return;
    }

    const bounty: Bounty = {
      id: Date.now().toString(),
      ...newBounty,
      creator: address || "0x0000...0000",
      status: "open",
      submissions: 0,
      deadline: new Date(newBounty.deadline),
      createdAt: new Date(),
      tags: newBounty.tags.split(",").map((t) => t.trim()).filter((t) => t),
      applicants: 0,
    };

    setBounties([bounty, ...bounties]);
    setNewBounty({
      title: "",
      description: "",
      reward: "",
      token: "ETH",
      category: "development",
      difficulty: "intermediate",
      deadline: "",
      tags: "",
    });
    setActiveTab("myBounties");
    alert("Bounty created successfully!");
  };

  const submitWork = () => {
    if (!selectedBounty || !submissionContent.trim()) {
      alert("Please enter your submission");
      return;
    }

    const submission: Submission = {
      id: Date.now().toString(),
      bountyId: selectedBounty.id,
      hunter: address || "0x0000...0000",
      content: submissionContent,
      attachments: [],
      timestamp: new Date(),
      status: "pending",
    };

    setSubmissions([submission, ...submissions]);
    setBounties(
      bounties.map((b) =>
        b.id === selectedBounty.id
          ? { ...b, submissions: b.submissions + 1, status: "under_review" }
          : b
      )
    );
    setSubmissionContent("");
    setSelectedBounty(null);
    alert("Submission sent successfully!");
  };

  const filteredBounties = bounties.filter((b) => {
    const matchesCategory = filterCategory === "all" || b.category === filterCategory;
    const matchesDifficulty = filterDifficulty === "all" || b.difficulty === filterDifficulty;
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const myBounties = bounties.filter((b) => b.creator === address);
  const mySubmissions = submissions.filter((s) => s.hunter === address);

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to view bounties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Award className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Community Bounty Board</h2>
            <p className="text-sm text-gray-600">Post and claim bounties for tasks</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab("create")}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          Post Bounty
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{bounties.filter((b) => b.status === "open").length}</div>
          <div className="text-sm text-gray-600">Open Bounties</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {bounties.reduce((sum, b) => sum + parseFloat(b.reward), 0).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Total Rewards</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{myBounties.length}</div>
          <div className="text-sm text-gray-600">My Bounties</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{mySubmissions.length}</div>
          <div className="text-sm text-gray-600">My Submissions</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "browse", label: "Browse", icon: Search },
          { id: "create", label: "Post Bounty", icon: Target },
          { id: "myBounties", label: "My Bounties", icon: Flag },
          { id: "mySubmissions", label: "My Submissions", icon: Upload },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-yellow-600 text-yellow-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "browse" && (
        <div>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bounties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredBounties.map((bounty) => (
              <div
                key={bounty.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{bounty.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColors[bounty.difficulty]}`}>
                        {bounty.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                        {bounty.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{bounty.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {bounty.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{bounty.applicants} applicants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Upload className="w-4 h-4" />
                        <span>{bounty.submissions} submissions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.ceil((bounty.deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000))} days left</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-3xl font-bold text-yellow-600">{bounty.reward}</div>
                    <div className="text-sm text-gray-600">{bounty.token}</div>
                    {bounty.status === "open" && (
                      <button
                        onClick={() => setSelectedBounty(bounty)}
                        className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        Submit Work
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bounty Title</label>
            <input
              type="text"
              value={newBounty.title}
              onChange={(e) => setNewBounty({ ...newBounty, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Build a feature, design a logo, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newBounty.description}
              onChange={(e) => setNewBounty({ ...newBounty, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[150px]"
              placeholder="Detailed description of the task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reward Amount</label>
              <input
                type="number"
                step="0.01"
                value={newBounty.reward}
                onChange={(e) => setNewBounty({ ...newBounty, reward: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Token</label>
              <select
                value={newBounty.token}
                onChange={(e) => setNewBounty({ ...newBounty, token: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
                <option value="USDT">USDT</option>
                <option value="DAI">DAI</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newBounty.category}
                onChange={(e) => setNewBounty({ ...newBounty, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {categories.filter((c) => c !== "all").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={newBounty.difficulty}
                onChange={(e) => setNewBounty({ ...newBounty, difficulty: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
            <input
              type="date"
              value={newBounty.deadline}
              onChange={(e) => setNewBounty({ ...newBounty, deadline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={newBounty.tags}
              onChange={(e) => setNewBounty({ ...newBounty, tags: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="solidity, react, design"
            />
          </div>

          <button
            onClick={createBounty}
            className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
          >
            Post Bounty
          </button>
        </div>
      )}

      {activeTab === "myBounties" && (
        <div className="space-y-4">
          {myBounties.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You haven't posted any bounties yet</p>
            </div>
          ) : (
            myBounties.map((bounty) => (
              <div key={bounty.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{bounty.title}</h3>
                    <p className="text-gray-600 mb-3">{bounty.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded capitalize">{bounty.status}</span>
                      <span>{bounty.submissions} submissions</span>
                      <span>{bounty.applicants} applicants</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">{bounty.reward} {bounty.token}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "mySubmissions" && (
        <div className="space-y-4">
          {mySubmissions.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You haven't submitted any work yet</p>
            </div>
          ) : (
            mySubmissions.map((submission) => {
              const bounty = bounties.find((b) => b.id === submission.bountyId);
              return (
                <div key={submission.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{bounty?.title}</h3>
                      <p className="text-sm text-gray-600">{submission.timestamp.toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      submission.status === "approved" ? "bg-green-100 text-green-700" :
                      submission.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                  <p className="text-gray-700">{submission.content}</p>
                </div>
              );
            })
          )}
        </div>
      )}

      {selectedBounty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Your Work</h2>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">{selectedBounty.title}</h3>
                <p className="text-sm text-gray-600">{selectedBounty.description}</p>
                <div className="text-lg font-bold text-yellow-600 mt-2">
                  Reward: {selectedBounty.reward} {selectedBounty.token}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Submission</label>
                <textarea
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-[200px]"
                  placeholder="Describe your work and provide links to deliverables..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={submitWork}
                  className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setSelectedBounty(null);
                    setSubmissionContent("");
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

