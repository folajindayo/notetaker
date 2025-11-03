"use client";

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import { useState } from "react";

interface PollCardProps {
  pollId: number;
  noteId: number;
}

export function PollCard({ pollId, noteId }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const { data: poll } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPoll",
    args: [BigInt(pollId)],
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleVote = () => {
    if (selectedOption === null) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "voteOnPoll",
      args: [BigInt(pollId), BigInt(selectedOption)],
    });
  };

  if (!poll) return null;

  const pollData = poll as any;
  const options = pollData.options || [];
  const votes = pollData.votes || [];
  const totalVotes = votes.reduce((sum: number, v: bigint) => sum + Number(v), 0);
  const isActive = pollData.isActive && Date.now() < Number(pollData.endTime) * 1000;

  return (
    <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-gray-50">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        📊 Poll
        {!isActive && (
          <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
            Ended
          </span>
        )}
      </h4>

      <div className="space-y-2">
        {options.map((option: string, index: number) => {
          const voteCount = Number(votes[index] || 0);
          const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

          return (
            <div
              key={index}
              onClick={() => isActive && setSelectedOption(index)}
              className={`relative p-3 rounded-lg border transition-all cursor-pointer ${
                selectedOption === index
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <span className="font-medium text-gray-900">{option}</span>
                <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
              </div>
              {totalVotes > 0 && (
                <div
                  className="absolute inset-0 bg-blue-100 rounded-lg transition-all"
                  style={{ width: `${percentage}%`, opacity: 0.3 }}
                />
              )}
            </div>
          );
        })}
      </div>

      {isActive && selectedOption !== null && (
        <button
          onClick={handleVote}
          disabled={isPending}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50"
        >
          {isPending ? "Voting..." : "Submit Vote"}
        </button>
      )}

      {isSuccess && (
        <div className="mt-3 p-2 bg-green-50 text-green-800 rounded-lg text-sm text-center">
          ✓ Vote submitted!
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 text-center">
        {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
      </div>
    </div>
  );
}

