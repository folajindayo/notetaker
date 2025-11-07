'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  proposerName?: string;
  category: 'governance' | 'treasury' | 'technical' | 'social';
  status: 'active' | 'passed' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  totalVotes: number;
  quorum: number;
  threshold: number;
  startTime: number;
  endTime: number;
  executionTime?: number;
  voters: { address: string; vote: 'for' | 'against' | 'abstain'; power: number }[];
}

interface DAOStats {
  totalProposals: number;
  activeProposals: number;
  passedProposals: number;
  totalMembers: number;
  votingPower: number;
}

export default function DAOProposals() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [stats, setStats] = useState<DAOStats>({
    totalProposals: 0,
    activeProposals: 0,
    passedProposals: 0,
    totalMembers: 0,
    votingPower: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'passed' | 'rejected'>('active');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Proposal['category']>('all');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'governance' as Proposal['category'],
  });

  useEffect(() => {
    const loadProposals = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockProposals: Proposal[] = [
        {
          id: '1',
          title: 'Increase Platform Treasury Allocation',
          description: 'Proposal to allocate 10% of platform fees to the community treasury for future development.',
          proposer: address || '0x1234567890123456789012345678901234567890',
          proposerName: 'Community Member',
          category: 'treasury',
          status: 'active',
          votesFor: 1245,
          votesAgainst: 234,
          votesAbstain: 89,
          totalVotes: 1568,
          quorum: 1000,
          threshold: 60,
          startTime: Date.now() - 86400000,
          endTime: Date.now() + 518400000, // 6 days
          voters: [],
        },
        {
          id: '2',
          title: 'Implement New Moderation Features',
          description: 'Add AI-powered content moderation and community reporting system with appeal process.',
          proposer: '0x9876543210987654321098765432109876543210',
          proposerName: 'Tech Lead',
          category: 'technical',
          status: 'active',
          votesFor: 892,
          votesAgainst: 156,
          votesAbstain: 45,
          totalVotes: 1093,
          quorum: 1000,
          threshold: 60,
          startTime: Date.now() - 172800000,
          endTime: Date.now() + 432000000, // 5 days
          voters: [],
        },
        {
          id: '3',
          title: 'Launch Community Events Program',
          description: 'Create a monthly budget of 5 ETH for community events, meetups, and hackathons.',
          proposer: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          proposerName: 'Community Manager',
          category: 'social',
          status: 'passed',
          votesFor: 2145,
          votesAgainst: 345,
          votesAbstain: 123,
          totalVotes: 2613,
          quorum: 1000,
          threshold: 60,
          startTime: Date.now() - 604800000,
          endTime: Date.now() - 86400000,
          executionTime: Date.now() - 43200000,
          voters: [],
        },
        {
          id: '4',
          title: 'Update Governance Parameters',
          description: 'Reduce quorum requirement from 10% to 5% to increase participation.',
          proposer: '0x1111111111111111111111111111111111111111',
          proposerName: 'Governance Team',
          category: 'governance',
          status: 'rejected',
          votesFor: 567,
          votesAgainst: 1234,
          votesAbstain: 67,
          totalVotes: 1868,
          quorum: 1000,
          threshold: 60,
          startTime: Date.now() - 1209600000,
          endTime: Date.now() - 604800000,
          voters: [],
        },
      ];

      setProposals(mockProposals);
      setStats({
        totalProposals: mockProposals.length,
        activeProposals: mockProposals.filter((p) => p.status === 'active').length,
        passedProposals: mockProposals.filter((p) => p.status === 'passed').length,
        totalMembers: 5420,
        votingPower: 100,
      });
      setLoading(false);
    };

    loadProposals();
  }, [address]);

  const handleVote = (proposalId: string, vote: 'for' | 'against' | 'abstain') => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          const votePower = 10; // Mock voting power
          return {
            ...p,
            votesFor: vote === 'for' ? p.votesFor + votePower : p.votesFor,
            votesAgainst: vote === 'against' ? p.votesAgainst + votePower : p.votesAgainst,
            votesAbstain: vote === 'abstain' ? p.votesAbstain + votePower : p.votesAbstain,
            totalVotes: p.totalVotes + votePower,
            voters: [
              ...p.voters,
              { address: address!, vote, power: votePower },
            ],
          };
        }
        return p;
      })
    );
  };

  const handleCreateProposal = () => {
    if (!newProposal.title || !newProposal.description) {
      alert(t('pleaseFillAllFields'));
      return;
    }

    const proposal: Proposal = {
      id: Date.now().toString(),
      title: newProposal.title,
      description: newProposal.description,
      proposer: address!,
      proposerName: 'You',
      category: newProposal.category,
      status: 'active',
      votesFor: 0,
      votesAgainst: 0,
      votesAbstain: 0,
      totalVotes: 0,
      quorum: 1000,
      threshold: 60,
      startTime: Date.now(),
      endTime: Date.now() + 604800000, // 7 days
      voters: [],
    };

    setProposals([proposal, ...proposals]);
    setShowCreateModal(false);
    setNewProposal({ title: '', description: '', category: 'governance' });
  };

  const getTimeRemaining = (endTime: number) => {
    const remaining = endTime - Date.now();
    if (remaining <= 0) return t('ended');

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h ${t('remaining')}`;
    return `${hours}h ${t('remaining')}`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      governance: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      treasury: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      technical: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      social: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };
    return colors[category as keyof typeof colors] || colors.governance;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      passed: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      rejected: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      executed: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const filteredProposals = proposals.filter((p) => {
    const matchesStatus = filter === 'all' || p.status === filter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToParticipate')}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* DAO Stats */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-6">{t('daoGovernance')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-indigo-100 mb-1">{t('totalProposals')}</p>
            <p className="text-3xl font-bold">{stats.totalProposals}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-indigo-100 mb-1">{t('activeProposals')}</p>
            <p className="text-3xl font-bold">{stats.activeProposals}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-indigo-100 mb-1">{t('members')}</p>
            <p className="text-3xl font-bold">{stats.totalMembers.toLocaleString()}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-indigo-100 mb-1">{t('yourVotingPower')}</p>
            <p className="text-3xl font-bold">{stats.votingPower}</p>
          </div>
        </div>
      </div>

      {/* Filters and Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'active', 'passed', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t(f)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">{t('allCategories')}</option>
            <option value="governance">{t('governance')}</option>
            <option value="treasury">{t('treasury')}</option>
            <option value="technical">{t('technical')}</option>
            <option value="social">{t('social')}</option>
          </select>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('newProposal')}
          </button>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">{t('noProposals')}</p>
          </div>
        ) : (
          filteredProposals.map((proposal) => {
            const votingPercentage = proposal.totalVotes > 0
              ? {
                  for: (proposal.votesFor / proposal.totalVotes) * 100,
                  against: (proposal.votesAgainst / proposal.totalVotes) * 100,
                  abstain: (proposal.votesAbstain / proposal.totalVotes) * 100,
                }
              : { for: 0, against: 0, abstain: 0 };

            const hasVoted = proposal.voters.some(
              (v) => v.address.toLowerCase() === address?.toLowerCase()
            );

            const quorumReached = proposal.totalVotes >= proposal.quorum;
            const thresholdMet = (proposal.votesFor / proposal.totalVotes) * 100 >= proposal.threshold;

            return (
              <div
                key={proposal.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3
                        className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => setSelectedProposal(proposal)}
                      >
                        {proposal.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(proposal.category)}`}>
                        {proposal.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(proposal.status)}`}>
                        {proposal.status}
                      </span>
                      {hasVoted && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                          {t('voted')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {proposal.description}
                    </p>
                  </div>
                </div>

                {/* Voting Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()} {t('votes')}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {proposal.status === 'active' ? getTimeRemaining(proposal.endTime) : t(proposal.status)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden flex">
                    <div
                      className="bg-green-500 transition-all"
                      style={{ width: `${votingPercentage.for}%` }}
                      title={`For: ${proposal.votesFor}`}
                    ></div>
                    <div
                      className="bg-red-500 transition-all"
                      style={{ width: `${votingPercentage.against}%` }}
                      title={`Against: ${proposal.votesAgainst}`}
                    ></div>
                    <div
                      className="bg-gray-400 transition-all"
                      style={{ width: `${votingPercentage.abstain}%` }}
                      title={`Abstain: ${proposal.votesAbstain}`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-green-600 dark:text-green-400">
                      {t('for')}: {proposal.votesFor} ({votingPercentage.for.toFixed(1)}%)
                    </span>
                    <span className="text-red-600 dark:text-red-400">
                      {t('against')}: {proposal.votesAgainst} ({votingPercentage.against.toFixed(1)}%)
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('abstain')}: {proposal.votesAbstain} ({votingPercentage.abstain.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="flex gap-4 mb-4 text-xs">
                  <div className="flex items-center gap-1">
                    {quorumReached ? (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={quorumReached ? 'text-green-600' : 'text-gray-600'}>
                      {t('quorum')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {thresholdMet ? (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={thresholdMet ? 'text-green-600' : 'text-gray-600'}>
                      {proposal.threshold}% {t('threshold')}
                    </span>
                  </div>
                </div>

                {/* Voting Buttons */}
                {proposal.status === 'active' && !hasVoted && (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleVote(proposal.id, 'for')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                    >
                      {t('voteFor')}
                    </button>
                    <button
                      onClick={() => handleVote(proposal.id, 'against')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                    >
                      {t('voteAgainst')}
                    </button>
                    <button
                      onClick={() => handleVote(proposal.id, 'abstain')}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                    >
                      {t('abstain')}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('createProposal')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('title')}
                </label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  placeholder={t('proposalTitle')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('category')}
                </label>
                <select
                  value={newProposal.category}
                  onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="governance">{t('governance')}</option>
                  <option value="treasury">{t('treasury')}</option>
                  <option value="technical">{t('technical')}</option>
                  <option value="social">{t('social')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('description')}
                </label>
                <textarea
                  rows={6}
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  placeholder={t('describeYourProposal')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCreateProposal}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

