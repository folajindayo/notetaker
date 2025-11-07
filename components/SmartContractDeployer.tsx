'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: 'token' | 'nft' | 'dao' | 'defi' | 'marketplace' | 'governance';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  features: string[];
  gasEstimate: string;
  code: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
    defaultValue?: string;
  }[];
}

interface DeployedContract {
  id: string;
  templateId: string;
  name: string;
  address: string;
  network: string;
  deployedAt: number;
  deployer: string;
  txHash: string;
  verified: boolean;
  gasUsed: string;
}

export default function SmartContractDeployer() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [deployedContracts, setDeployedContracts] = useState<DeployedContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [deploying, setDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'deployed'>('templates');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockTemplates: ContractTemplate[] = [
        {
          id: '1',
          name: 'ERC-20 Token',
          description: 'Standard fungible token with minting and burning capabilities',
          category: 'token',
          complexity: 'beginner',
          icon: '🪙',
          features: ['Mintable', 'Burnable', 'Pausable', 'Access Control'],
          gasEstimate: '0.002',
          code: 'pragma solidity ^0.8.0; contract Token { ... }',
          parameters: [
            { name: 'tokenName', type: 'string', description: 'Name of the token', required: true },
            { name: 'tokenSymbol', type: 'string', description: 'Token symbol (e.g., ETH)', required: true },
            { name: 'initialSupply', type: 'uint256', description: 'Initial token supply', required: true },
          ],
        },
        {
          id: '2',
          name: 'ERC-721 NFT',
          description: 'Non-fungible token contract with metadata and royalties',
          category: 'nft',
          complexity: 'intermediate',
          icon: '🎨',
          features: ['Enumerable', 'URI Storage', 'Royalties', 'Whitelist Minting'],
          gasEstimate: '0.004',
          code: 'pragma solidity ^0.8.0; contract NFT { ... }',
          parameters: [
            { name: 'collectionName', type: 'string', description: 'NFT collection name', required: true },
            { name: 'collectionSymbol', type: 'string', description: 'Collection symbol', required: true },
            { name: 'baseURI', type: 'string', description: 'Base URI for metadata', required: true },
            { name: 'maxSupply', type: 'uint256', description: 'Maximum supply', required: true },
            { name: 'royaltyPercentage', type: 'uint256', description: 'Royalty % (0-10)', required: false, defaultValue: '5' },
          ],
        },
        {
          id: '3',
          name: 'DAO Governance',
          description: 'Decentralized autonomous organization with voting and proposals',
          category: 'dao',
          complexity: 'advanced',
          icon: '🏛️',
          features: ['Proposal Creation', 'Voting', 'Timelock', 'Treasury Management'],
          gasEstimate: '0.008',
          code: 'pragma solidity ^0.8.0; contract DAO { ... }',
          parameters: [
            { name: 'daoName', type: 'string', description: 'DAO name', required: true },
            { name: 'votingPeriod', type: 'uint256', description: 'Voting period in blocks', required: true },
            { name: 'quorum', type: 'uint256', description: 'Quorum percentage', required: true },
            { name: 'proposalThreshold', type: 'uint256', description: 'Tokens needed to propose', required: true },
          ],
        },
        {
          id: '4',
          name: 'Staking Contract',
          description: 'Token staking with rewards distribution and lock periods',
          category: 'defi',
          complexity: 'intermediate',
          icon: '💎',
          features: ['Flexible Staking', 'Rewards', 'Lock Periods', 'Emergency Withdraw'],
          gasEstimate: '0.005',
          code: 'pragma solidity ^0.8.0; contract Staking { ... }',
          parameters: [
            { name: 'stakingToken', type: 'address', description: 'Token to stake address', required: true },
            { name: 'rewardToken', type: 'address', description: 'Reward token address', required: true },
            { name: 'rewardRate', type: 'uint256', description: 'Rewards per block', required: true },
            { name: 'minLockPeriod', type: 'uint256', description: 'Minimum lock period (days)', required: true },
          ],
        },
        {
          id: '5',
          name: 'NFT Marketplace',
          description: 'Decentralized marketplace for buying and selling NFTs',
          category: 'marketplace',
          complexity: 'advanced',
          icon: '🛒',
          features: ['Fixed Price', 'Auctions', 'Offers', 'Royalty Support'],
          gasEstimate: '0.006',
          code: 'pragma solidity ^0.8.0; contract Marketplace { ... }',
          parameters: [
            { name: 'platformFee', type: 'uint256', description: 'Platform fee percentage', required: true },
            { name: 'feeRecipient', type: 'address', description: 'Fee recipient address', required: true },
          ],
        },
        {
          id: '6',
          name: 'Multi-Sig Wallet',
          description: 'Multi-signature wallet with customizable approval threshold',
          category: 'governance',
          complexity: 'intermediate',
          icon: '🔐',
          features: ['Multiple Owners', 'Threshold Approval', 'Transaction Queue', 'Owner Management'],
          gasEstimate: '0.003',
          code: 'pragma solidity ^0.8.0; contract MultiSig { ... }',
          parameters: [
            { name: 'owners', type: 'address[]', description: 'Array of owner addresses', required: true },
            { name: 'threshold', type: 'uint256', description: 'Approval threshold', required: true },
          ],
        },
      ];

      const mockDeployed: DeployedContract[] = [
        {
          id: '1',
          templateId: '1',
          name: 'MyToken',
          address: '0x1234567890123456789012345678901234567890',
          network: 'Base Sepolia',
          deployedAt: Date.now() - 7 * 24 * 3600000,
          deployer: address || '0x0',
          txHash: '0xabc123def456...',
          verified: true,
          gasUsed: '0.0021',
        },
        {
          id: '2',
          templateId: '2',
          name: 'CoolNFTs',
          address: '0x9876543210987654321098765432109876543210',
          network: 'Base Mainnet',
          deployedAt: Date.now() - 3 * 24 * 3600000,
          deployer: address || '0x0',
          txHash: '0xdef456ghi789...',
          verified: false,
          gasUsed: '0.0042',
        },
      ];

      setTemplates(mockTemplates);
      setDeployedContracts(mockDeployed);
      setLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address]);

  const handleDeploy = async () => {
    if (!selectedTemplate) return;

    // Validate required parameters
    const missingParams = selectedTemplate.parameters
      .filter((p) => p.required && !parameters[p.name])
      .map((p) => p.name);

    if (missingParams.length > 0) {
      alert(`${t('pleaseFillRequired')}: ${missingParams.join(', ')}`);
      return;
    }

    setDeploying(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const newContract: DeployedContract = {
      id: Date.now().toString(),
      templateId: selectedTemplate.id,
      name: parameters.tokenName || parameters.collectionName || parameters.daoName || 'New Contract',
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      network: 'Base Sepolia',
      deployedAt: Date.now(),
      deployer: address!,
      txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      verified: false,
      gasUsed: selectedTemplate.gasEstimate,
    };

    setDeployedContracts([newContract, ...deployedContracts]);
    setDeploying(false);
    setShowDeployModal(false);
    setParameters({});
    setSelectedTemplate(null);
    setActiveTab('deployed');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      token: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      nft: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      dao: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      defi: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      marketplace: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
      governance: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    };
    return colors[category as keyof typeof colors] || colors.token;
  };

  const getComplexityColor = (complexity: string) => {
    const colors = {
      beginner: 'text-green-600 dark:text-green-400',
      intermediate: 'text-orange-600 dark:text-orange-400',
      advanced: 'text-red-600 dark:text-red-400',
    };
    return colors[complexity as keyof typeof colors] || colors.beginner;
  };

  const filteredTemplates = categoryFilter === 'all' 
    ? templates 
    : templates.filter((t) => t.category === categoryFilter);

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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToDeployContracts')}</p>
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('smartContractDeployer')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('deployContractsWithOneClick')}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-6">
          {(['templates', 'deployed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium transition-colors relative capitalize ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t(tab)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {['all', 'token', 'nft', 'dao', 'defi', 'marketplace', 'governance'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  categoryFilter === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t(cat)}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{template.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{template.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('complexity')}:</span>
                    <span className={`font-semibold capitalize ${getComplexityColor(template.complexity)}`}>
                      {template.complexity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('gasEstimate')}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ~{template.gasEstimate} ETH
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('features')}:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                        +{template.features.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowDeployModal(true);
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                >
                  {t('deploy')}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Deployed Tab */}
      {activeTab === 'deployed' && (
        <div className="space-y-4">
          {deployedContracts.length === 0 ? (
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
              <p className="text-gray-600 dark:text-gray-400">{t('noDeployedContracts')}</p>
            </div>
          ) : (
            deployedContracts.map((contract) => {
              const template = templates.find((t) => t.id === contract.templateId);
              return (
                <div
                  key={contract.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{template?.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {contract.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {template?.name}
                        </p>
                      </div>
                    </div>
                    {contract.verified ? (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
                        ✓ {t('verified')}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-medium">
                        {t('unverified')}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('network')}</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {contract.network}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('gasUsed')}</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {contract.gasUsed} ETH
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('address')}</p>
                      <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                        {contract.address}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('deployedAt')}</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(contract.deployedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">
                      {t('viewOnExplorer')}
                    </button>
                    {!contract.verified && (
                      <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium">
                        {t('verifyContract')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Deploy Modal */}
      {showDeployModal && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{selectedTemplate.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('deploy')} {selectedTemplate.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTemplate.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeployModal(false);
                  setParameters({});
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {selectedTemplate.parameters.map((param) => (
                <div key={param.name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {param.name} {param.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={parameters[param.name] || param.defaultValue || ''}
                    onChange={(e) => setParameters({ ...parameters, [param.name]: e.target.value })}
                    placeholder={param.description}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {param.description} • Type: {param.type}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300">{t('estimatedGas')}:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  ~{selectedTemplate.gasEstimate} ETH
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">{t('network')}:</span>
                <span className="font-bold text-gray-900 dark:text-white">Base Sepolia</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeployModal(false);
                  setParameters({});
                }}
                disabled={deploying}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium disabled:opacity-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDeploy}
                disabled={deploying}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deploying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t('deploying')}...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    {t('deployContract')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

