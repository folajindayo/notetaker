'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface LaunchProject {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  website: string;
  category: 'defi' | 'gaming' | 'nft' | 'infrastructure' | 'dao';
  saleType: 'public' | 'whitelist' | 'fcfs';
  status: 'upcoming' | 'live' | 'ended' | 'successful';
  tokenPrice: number;
  hardCap: string;
  softCap: string;
  raised: string;
  progress: number;
  startTime: number;
  endTime: number;
  vesting: string;
  allocation: string;
  participants: number;
  myContribution: string;
}

export default function TokenLaunchPad() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [projects, setProjects] = useState<LaunchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<LaunchProject | null>(null);
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'ended'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockProjects: LaunchProject[] = [
        {
          id: '1',
          name: 'DeFi Nexus',
          symbol: 'DNEX',
          logo: '🌐',
          description: 'Next-generation decentralized exchange with cross-chain capabilities',
          website: 'https://definexus.io',
          category: 'defi',
          saleType: 'public',
          status: 'live',
          tokenPrice: 0.15,
          hardCap: '500000',
          softCap: '100000',
          raised: '325000',
          progress: 65,
          startTime: Date.now() - 2 * 24 * 3600000,
          endTime: Date.now() + 5 * 24 * 3600000,
          vesting: '10% TGE, 90% over 6 months',
          allocation: '5000',
          participants: 1250,
          myContribution: '500',
        },
        {
          id: '2',
          name: 'GameVerse',
          symbol: 'GVERSE',
          logo: '🎮',
          description: 'Metaverse gaming platform with play-to-earn mechanics',
          website: 'https://gameverse.gg',
          category: 'gaming',
          saleType: 'whitelist',
          status: 'upcoming',
          tokenPrice: 0.08,
          hardCap: '750000',
          softCap: '150000',
          raised: '0',
          progress: 0,
          startTime: Date.now() + 3 * 24 * 3600000,
          endTime: Date.now() + 10 * 24 * 3600000,
          vesting: '20% TGE, 80% over 4 months',
          allocation: '10000',
          participants: 0,
          myContribution: '0',
        },
        {
          id: '3',
          name: 'ArtChain',
          symbol: 'ARTC',
          logo: '🎨',
          description: 'NFT marketplace with artist royalty protection',
          website: 'https://artchain.nft',
          category: 'nft',
          saleType: 'fcfs',
          status: 'ended',
          tokenPrice: 0.25,
          hardCap: '300000',
          softCap: '50000',
          raised: '300000',
          progress: 100,
          startTime: Date.now() - 10 * 24 * 3600000,
          endTime: Date.now() - 3 * 24 * 3600000,
          vesting: '15% TGE, 85% over 8 months',
          allocation: '3000',
          participants: 890,
          myContribution: '1000',
        },
        {
          id: '4',
          name: 'ChainDAO',
          symbol: 'CDAO',
          logo: '🏛️',
          description: 'Governance infrastructure for decentralized organizations',
          website: 'https://chaindao.org',
          category: 'dao',
          saleType: 'public',
          status: 'live',
          tokenPrice: 0.12,
          hardCap: '400000',
          softCap: '80000',
          raised: '180000',
          progress: 45,
          startTime: Date.now() - 24 * 3600000,
          endTime: Date.now() + 6 * 24 * 3600000,
          vesting: '5% TGE, 95% over 12 months',
          allocation: '8000',
          participants: 620,
          myContribution: '0',
        },
      ];

      setProjects(mockProjects);
      setLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address]);

  const handleContribute = async () => {
    if (!selectedProject || !amount || parseFloat(amount) <= 0) {
      alert(t('enterValidAmount'));
      return;
    }

    const tokenAmount = (parseFloat(amount) / selectedProject.tokenPrice).toFixed(2);
    alert(`${t('contributed')} $${amount} (${tokenAmount} ${selectedProject.symbol})`);

    setProjects(
      projects.map((p) =>
        p.id === selectedProject.id
          ? {
              ...p,
              raised: (parseFloat(p.raised) + parseFloat(amount)).toString(),
              progress: ((parseFloat(p.raised) + parseFloat(amount)) / parseFloat(p.hardCap)) * 100,
              myContribution: (parseFloat(p.myContribution || '0') + parseFloat(amount)).toString(),
              participants: p.participants + (p.myContribution === '0' ? 1 : 0),
            }
          : p
      )
    );

    setShowModal(false);
    setAmount('');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      defi: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      gaming: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      nft: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
      infrastructure: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      dao: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };
    return colors[category as keyof typeof colors] || colors.defi;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      live: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      ended: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      successful: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    };
    return colors[status as keyof typeof colors] || colors.upcoming;
  };

  const getTimeRemaining = (endTime: number) => {
    const remaining = endTime - Date.now();
    if (remaining <= 0) return t('ended');
    const days = Math.floor(remaining / (24 * 3600000));
    const hours = Math.floor((remaining % (24 * 3600000)) / 3600000);
    return `${days}d ${hours}h`;
  };

  const filteredProjects = projects.filter((project) => {
    if (filter !== 'all' && project.status !== filter) return false;
    if (categoryFilter !== 'all' && project.category !== categoryFilter) return false;
    return true;
  });

  const myInvestments = projects.filter((p) => parseFloat(p.myContribution) > 0);
  const totalInvested = myInvestments.reduce((sum, p) => sum + parseFloat(p.myContribution), 0);

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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('tokenLaunchPad')}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('participateInIDOs')}
        </p>
      </div>

      {/* Stats */}
      {myInvestments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90">{t('totalInvested')}</p>
            <p className="text-3xl font-bold mt-2">${totalInvested.toFixed(2)}</p>
            <p className="text-xs opacity-75 mt-1">{myInvestments.length} {t('projects')}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90">{t('activeIDOs')}</p>
            <p className="text-3xl font-bold mt-2">{projects.filter((p) => p.status === 'live').length}</p>
            <p className="text-xs opacity-75 mt-1">{t('liveNow')}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90">{t('avgROI')}</p>
            <p className="text-3xl font-bold mt-2">+287%</p>
            <p className="text-xs opacity-75 mt-1">{t('historical')}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'upcoming', 'live', 'ended'] as const).map((f) => (
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
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">{t('allCategories')}</option>
          <option value="defi">{t('defi')}</option>
          <option value="gaming">{t('gaming')}</option>
          <option value="nft">{t('nft')}</option>
          <option value="infrastructure">{t('infrastructure')}</option>
          <option value="dao">{t('dao')}</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">{project.logo}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    ${project.symbol}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(project.category)}`}>
                    {project.category}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                    {project.saleType}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">{t('progress')}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  ${parseFloat(project.raised).toLocaleString()} / ${parseFloat(project.hardCap).toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(project.progress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {project.progress.toFixed(1)}% • {project.participants.toLocaleString()} {t('participants')}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">{t('tokenPrice')}</p>
                <p className="font-bold text-gray-900 dark:text-white">${project.tokenPrice}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">{t('allocation')}</p>
                <p className="font-bold text-gray-900 dark:text-white">{project.allocation}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 dark:text-gray-400">{t('vesting')}</p>
                <p className="font-medium text-gray-900 dark:text-white text-xs">{project.vesting}</p>
              </div>
            </div>

            {/* Time */}
            {project.status === 'live' && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-xs text-green-800 dark:text-green-200">
                  ⏰ {t('endsIn')}: <strong>{getTimeRemaining(project.endTime)}</strong>
                </p>
              </div>
            )}

            {project.status === 'upcoming' && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  📅 {t('startsIn')}: <strong>{getTimeRemaining(project.startTime)}</strong>
                </p>
              </div>
            )}

            {/* My Contribution */}
            {parseFloat(project.myContribution) > 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  💰 {t('myContribution')}: <strong>${project.myContribution}</strong> ({(parseFloat(project.myContribution) / project.tokenPrice).toFixed(0)} {project.symbol})
                </p>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={() => {
                setSelectedProject(project);
                setShowModal(true);
              }}
              disabled={project.status !== 'live'}
              className={`w-full py-3 rounded-lg font-bold transition-colors ${
                project.status === 'live'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              {project.status === 'live' ? t('contribute') : project.status === 'upcoming' ? t('upcoming') : t('ended')}
            </button>
          </div>
        ))}
      </div>

      {/* Contribute Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('contribute')} - {selectedProject.name}
            </h3>

            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">{t('tokenPrice')}:</span>
                <span className="font-bold text-gray-900 dark:text-white">${selectedProject.tokenPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('remaining')}:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  ${(parseFloat(selectedProject.hardCap) - parseFloat(selectedProject.raised)).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('contributionAmount')} (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {amount && parseFloat(amount) > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t('youWillReceive')}:{' '}
                  <strong className="text-blue-600 dark:text-blue-400">
                    {(parseFloat(amount) / selectedProject.tokenPrice).toFixed(2)} {selectedProject.symbol}
                  </strong>
                </p>
              )}
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ {t('tokenSaleDsclaimer')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setAmount('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleContribute}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

