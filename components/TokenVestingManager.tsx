"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, formatEther, Address } from "viem";
import {
  Lock,
  Unlock,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Users,
  PieChart,
  Download,
  ExternalLink,
  Plus,
  Settings,
} from "lucide-react";

interface VestingSchedule {
  id: string;
  beneficiary: string;
  token: string;
  totalAmount: string;
  vestedAmount: string;
  claimedAmount: string;
  startTime: number;
  cliffDuration: number;
  vestingDuration: number;
  vestingType: "linear" | "milestone" | "staged";
  status: "active" | "completed" | "revoked";
  releasedPercentage: number;
  nextRelease: number;
  milestones?: Milestone[];
}

interface Milestone {
  id: string;
  name: string;
  percentage: number;
  releaseDate: number;
  released: boolean;
  amount: string;
}

interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
  balance: string;
}

export function TokenVestingManager() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"overview" | "schedules" | "create" | "analytics">("overview");
  const [vestingSchedules, setVestingSchedules] = useState<VestingSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<VestingSchedule | null>(null);
  
  // Create vesting form state
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [cliffDuration, setCliffDuration] = useState("0");
  const [vestingDuration, setVestingDuration] = useState("365");
  const [vestingType, setVestingType] = useState<"linear" | "milestone" | "staged">("linear");
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Statistics
  const [totalLocked, setTotalLocked] = useState("0");
  const [totalVested, setTotalVested] = useState("0");
  const [totalClaimed, setTotalClaimed] = useState("0");
  const [activeSchedulesCount, setActiveSchedulesCount] = useState(0);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    // Load vesting schedules from localStorage
    const stored = localStorage.getItem(`vesting_schedules_${address}`);
    if (stored) {
      const schedules = JSON.parse(stored);
      setVestingSchedules(schedules);
      updateScheduleStatuses(schedules);
    }
  }, [address]);

  useEffect(() => {
    // Calculate statistics
    const locked = vestingSchedules.reduce(
      (sum, s) => sum + parseFloat(s.totalAmount) - parseFloat(s.vestedAmount),
      0
    );
    const vested = vestingSchedules.reduce(
      (sum, s) => sum + parseFloat(s.vestedAmount),
      0
    );
    const claimed = vestingSchedules.reduce(
      (sum, s) => sum + parseFloat(s.claimedAmount),
      0
    );
    const active = vestingSchedules.filter((s) => s.status === "active").length;

    setTotalLocked(locked.toFixed(4));
    setTotalVested(vested.toFixed(4));
    setTotalClaimed(claimed.toFixed(4));
    setActiveSchedulesCount(active);
  }, [vestingSchedules]);

  const updateScheduleStatuses = (schedules: VestingSchedule[]) => {
    const now = Date.now();
    const updated = schedules.map((schedule) => {
      if (schedule.status === "revoked") return schedule;

      const elapsed = now - schedule.startTime;
      const cliffEnd = schedule.startTime + schedule.cliffDuration * 24 * 60 * 60 * 1000;
      const vestingEnd = schedule.startTime + schedule.vestingDuration * 24 * 60 * 60 * 1000;

      let vestedAmount = "0";
      let releasedPercentage = 0;

      if (now < cliffEnd) {
        vestedAmount = "0";
        releasedPercentage = 0;
      } else if (now >= vestingEnd) {
        vestedAmount = schedule.totalAmount;
        releasedPercentage = 100;
      } else {
        const totalDuration = schedule.vestingDuration * 24 * 60 * 60 * 1000;
        const elapsedSinceCliff = elapsed - schedule.cliffDuration * 24 * 60 * 60 * 1000;
        releasedPercentage = (elapsedSinceCliff / totalDuration) * 100;
        vestedAmount = (
          (parseFloat(schedule.totalAmount) * releasedPercentage) /
          100
        ).toString();
      }

      return {
        ...schedule,
        vestedAmount,
        releasedPercentage,
        status:
          now >= vestingEnd
            ? ("completed" as const)
            : ("active" as const),
        nextRelease: cliffEnd > now ? cliffEnd : vestingEnd,
      };
    });

    setVestingSchedules(updated);
    localStorage.setItem(`vesting_schedules_${address}`, JSON.stringify(updated));
  };

  const handleCreateVesting = () => {
    if (!beneficiaryAddress || !tokenAddress || !totalAmount || !startDate) {
      return;
    }

    const newSchedule: VestingSchedule = {
      id: Date.now().toString(),
      beneficiary: beneficiaryAddress,
      token: tokenAddress,
      totalAmount,
      vestedAmount: "0",
      claimedAmount: "0",
      startTime: new Date(startDate).getTime(),
      cliffDuration: parseInt(cliffDuration),
      vestingDuration: parseInt(vestingDuration),
      vestingType,
      status: "active",
      releasedPercentage: 0,
      nextRelease: new Date(startDate).getTime() + parseInt(cliffDuration) * 24 * 60 * 60 * 1000,
      milestones: vestingType === "milestone" ? milestones : undefined,
    };

    const updated = [...vestingSchedules, newSchedule];
    setVestingSchedules(updated);
    localStorage.setItem(`vesting_schedules_${address}`, JSON.stringify(updated));

    // Reset form
    setBeneficiaryAddress("");
    setTokenAddress("");
    setTotalAmount("");
    setStartDate("");
    setCliffDuration("0");
    setVestingDuration("365");
    setMilestones([]);
  };

  const handleClaimTokens = async (schedule: VestingSchedule) => {
    const claimable =
      parseFloat(schedule.vestedAmount) - parseFloat(schedule.claimedAmount);
    if (claimable <= 0) return;

    try {
      // In a real implementation, this would call the vesting contract
      // For now, we'll simulate the claim
      const updated = vestingSchedules.map((s) =>
        s.id === schedule.id
          ? { ...s, claimedAmount: s.vestedAmount }
          : s
      );
      setVestingSchedules(updated);
      localStorage.setItem(`vesting_schedules_${address}`, JSON.stringify(updated));
    } catch (error) {
      console.error("Claim failed:", error);
    }
  };

  const handleRevokeVesting = (scheduleId: string) => {
    const updated = vestingSchedules.map((s) =>
      s.id === scheduleId ? { ...s, status: "revoked" as const } : s
    );
    setVestingSchedules(updated);
    localStorage.setItem(`vesting_schedules_${address}`, JSON.stringify(updated));
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      name: `Milestone ${milestones.length + 1}`,
      percentage: 0,
      releaseDate: Date.now(),
      released: false,
      amount: "0",
    };
    setMilestones([...milestones, newMilestone]);
  };

  const getVestingTypeColor = (type: VestingSchedule["vestingType"]) => {
    switch (type) {
      case "linear":
        return "bg-blue-100 text-blue-800";
      case "milestone":
        return "bg-purple-100 text-purple-800";
      case "staged":
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status: VestingSchedule["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "revoked":
        return "bg-red-100 text-red-800";
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-sm text-gray-600">
            Please connect your wallet to manage token vesting
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
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Token Vesting Manager
            </h1>
            <p className="text-sm text-gray-600">
              Create and manage token vesting schedules
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Locked</p>
              <p className="text-2xl font-bold text-purple-600">{totalLocked}</p>
              <p className="text-xs text-gray-500 mt-1">Tokens</p>
            </div>
            <Lock className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Vested</p>
              <p className="text-2xl font-bold text-green-600">{totalVested}</p>
              <p className="text-xs text-gray-500 mt-1">Available</p>
            </div>
            <Unlock className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Claimed</p>
              <p className="text-2xl font-bold text-blue-600">{totalClaimed}</p>
              <p className="text-xs text-gray-500 mt-1">Withdrawn</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Schedules</p>
              <p className="text-2xl font-bold text-orange-600">
                {activeSchedulesCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                of {vestingSchedules.length} total
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "overview"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("schedules")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "schedules"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Schedules ({vestingSchedules.length})
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "create"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Create New
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "analytics"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Recent Schedules */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Vesting Schedules
            </h2>

            {vestingSchedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No vesting schedules created yet</p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create First Schedule
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {vestingSchedules.slice(0, 5).map((schedule) => (
                  <div
                    key={schedule.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedSchedule(schedule);
                      setActiveTab("schedules");
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {schedule.beneficiary.slice(0, 8)}...
                            {schedule.beneficiary.slice(-6)}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              schedule.status
                            )}`}
                          >
                            {schedule.status}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getVestingTypeColor(
                              schedule.vestingType
                            )}`}
                          >
                            {schedule.vestingType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {schedule.totalAmount} tokens over {schedule.vestingDuration} days
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {schedule.releasedPercentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Released</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all"
                        style={{ width: `${schedule.releasedPercentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                      <span>
                        Vested: {schedule.vestedAmount} / {schedule.totalAmount}
                      </span>
                      <span>
                        Claimed: {schedule.claimedAmount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab("create")}
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <Plus className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">
                Create Schedule
              </h3>
              <p className="text-sm text-gray-600">
                Set up a new vesting schedule
              </p>
            </button>

            <button
              onClick={() => setActiveTab("schedules")}
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">
                View All Schedules
              </h3>
              <p className="text-sm text-gray-600">
                Manage existing vesting schedules
              </p>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <PieChart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">
                View Analytics
              </h3>
              <p className="text-sm text-gray-600">
                Track vesting performance
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Schedules Tab */}
      {activeTab === "schedules" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Vesting Schedules
          </h2>

          {vestingSchedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No vesting schedules yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vestingSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Beneficiary: {schedule.beneficiary.slice(0, 10)}...
                          {schedule.beneficiary.slice(-8)}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            schedule.status
                          )}`}
                        >
                          {schedule.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getVestingTypeColor(
                            schedule.vestingType
                          )}`}
                        >
                          {schedule.vestingType}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Total Amount:</span>{" "}
                          {schedule.totalAmount} tokens
                        </div>
                        <div>
                          <span className="font-medium">Start Date:</span>{" "}
                          {new Date(schedule.startTime).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Cliff:</span>{" "}
                          {schedule.cliffDuration} days
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span>{" "}
                          {schedule.vestingDuration} days
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {schedule.releasedPercentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">Released</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all"
                      style={{ width: `${schedule.releasedPercentage}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Vested</div>
                      <div className="font-semibold text-gray-900">
                        {schedule.vestedAmount}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Claimed</div>
                      <div className="font-semibold text-gray-900">
                        {schedule.claimedAmount}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Remaining</div>
                      <div className="font-semibold text-gray-900">
                        {(
                          parseFloat(schedule.vestedAmount) -
                          parseFloat(schedule.claimedAmount)
                        ).toFixed(4)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {schedule.status === "active" && (
                      <>
                        <button
                          onClick={() => handleClaimTokens(schedule)}
                          disabled={
                            parseFloat(schedule.vestedAmount) <=
                            parseFloat(schedule.claimedAmount)
                          }
                          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                          <Unlock className="h-4 w-4" />
                          Claim Tokens
                        </button>
                        <button
                          onClick={() => handleRevokeVesting(schedule.id)}
                          className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Revoke
                        </button>
                      </>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Tab */}
      {activeTab === "create" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Create Vesting Schedule
          </h2>

          <div className="space-y-6">
            {/* Beneficiary Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiary Address
              </label>
              <input
                type="text"
                value={beneficiaryAddress}
                onChange={(e) => setBeneficiaryAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Token Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token Address
              </label>
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount
              </label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Cliff Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliff Duration (days)
              </label>
              <input
                type="number"
                value={cliffDuration}
                onChange={(e) => setCliffDuration(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Period before vesting begins
              </p>
            </div>

            {/* Vesting Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vesting Duration (days)
              </label>
              <input
                type="number"
                value={vestingDuration}
                onChange={(e) => setVestingDuration(e.target.value)}
                placeholder="365"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Vesting Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vesting Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setVestingType("linear")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    vestingType === "linear"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="font-medium text-sm">Linear</div>
                  <div className="text-xs text-gray-500">Continuous release</div>
                </button>
                <button
                  onClick={() => setVestingType("milestone")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    vestingType === "milestone"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="font-medium text-sm">Milestone</div>
                  <div className="text-xs text-gray-500">Goal-based</div>
                </button>
                <button
                  onClick={() => setVestingType("staged")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    vestingType === "staged"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="font-medium text-sm">Staged</div>
                  <div className="text-xs text-gray-500">Fixed intervals</div>
                </button>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateVesting}
              disabled={
                !beneficiaryAddress ||
                !tokenAddress ||
                !totalAmount ||
                !startDate
              }
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Vesting Schedule
            </button>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Vesting Analytics
            </h2>

            {/* Distribution Chart Placeholder */}
            <div className="bg-gray-50 rounded-lg p-8 mb-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Vesting distribution chart
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-700 mb-1">
                  Average Vesting Period
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {vestingSchedules.length > 0
                    ? (
                        vestingSchedules.reduce(
                          (sum, s) => sum + s.vestingDuration,
                          0
                        ) / vestingSchedules.length
                      ).toFixed(0)
                    : 0}{" "}
                  days
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-700 mb-1">
                  Total Beneficiaries
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {new Set(vestingSchedules.map((s) => s.beneficiary)).size}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

