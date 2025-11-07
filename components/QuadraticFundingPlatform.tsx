"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Heart,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  Award,
  BarChart3,
  Plus,
  Share2,
  Zap,
  Crown,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  creator: string;
  goal: string;
  raised: string;
  contributors: number;
  matchedFunds: string;
  totalFunding: string;
  image: string;
  deadline: number;
  status: "active" | "funded" | "ended";
}

interface Contribution {
  id: string;
  projectId: string;
  contributor: string;
  amount: string;
  matchAmount: string;
  timestamp: number;
}

interface Round {
  id: string;
  name: string;
  matchingPool: string;
  projects: number;
  contributors: number;
  startDate: number;
  endDate: number;
  status: "upcoming" | "active" | "ended";
}

export function QuadraticFundingPlatform() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"projects" | "rounds" | "mycontributions">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contributionAmount, setContributionAmount] = useState("");

  useEffect(() => {
    loadProjects();
    loadRounds();
  }, []);

  const loadProjects = () => {
    const mockProjects: Project[] = [
      {
        id: "1",
        title: "Open Source DeFi Protocol",
        description: "Building a community-owned decentralized exchange with fair token distribution",
        category: "DeFi",
        creator: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        goal: "50",
        raised: "32.5",
        contributors: 234,
        matchedFunds: "48.7",
        totalFunding: "81.2",
        image: "🏦",
        deadline: Date.now() + 15 * 24 * 60 * 60 * 1000,
        status: "active",
      },
      {
        id: "2",
        title: "Web3 Education Platform",
        description: "Free blockchain education for underserved communities worldwide",
        category: "Education",
        creator: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        goal: "30",
        raised: "18.3",
        contributors: 156,
        matchedFunds: "27.4",
        totalFunding: "45.7",
        image: "📚",
        deadline: Date.now() + 20 * 24 * 60 * 60 * 1000,
        status: "active",
      },
    ];
    setProjects(mockProjects);
  };

  const loadRounds = () => {
    const mockRounds: Round[] = [
      {
        id: "1",
        name: "Public Goods Round #5",
        matchingPool: "250",
        projects: 45,
        contributors: 1234,
        startDate: Date.now() - 10 * 24 * 60 * 60 * 1000,
        endDate: Date.now() + 20 * 24 * 60 * 60 * 1000,
        status: "active",
      },
    ];
    setRounds(mockRounds);
  };

  const calculateMatch = (amount: string) => {
    const base = parseFloat(amount);
    return (Math.sqrt(base) * 1.5).toFixed(3);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-sm text-gray-600">
            Please connect your wallet to participate
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quadratic Funding Platform
            </h1>
            <p className="text-sm text-gray-600">
              Democratic funding for public goods
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "projects"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("rounds")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "rounds"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Funding Rounds
        </button>
        <button
          onClick={() => setActiveTab("mycontributions")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "mycontributions"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          My Contributions
        </button>
      </div>

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{project.image}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-pink-50 rounded-lg p-3">
                  <div className="text-xs text-pink-700 mb-1">Direct Contributions</div>
                  <div className="text-lg font-bold text-pink-900">
                    {project.raised} ETH
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-xs text-purple-700 mb-1">Matched Funds</div>
                  <div className="text-lg font-bold text-purple-900">
                    {project.matchedFunds} ETH
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Total Funding</span>
                  <span className="font-semibold">{project.totalFunding} ETH</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                    style={{
                      width: `${(parseFloat(project.totalFunding) / parseFloat(project.goal)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {project.contributors} contributors
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {Math.floor((project.deadline - Date.now()) / (24 * 60 * 60 * 1000))} days left
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(project)}
                className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Contribute
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for contribution */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Contribute to {selectedProject.title}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contribution Amount (ETH)
              </label>
              <input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {contributionAmount && (
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-purple-700 mb-1">Estimated Match</div>
                <div className="text-2xl font-bold text-purple-900">
                  +{calculateMatch(contributionAmount)} ETH
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  Your total impact: {(parseFloat(contributionAmount) + parseFloat(calculateMatch(contributionAmount))).toFixed(3)} ETH
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setContributionAmount("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!contributionAmount}
                className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300"
              >
                Contribute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

