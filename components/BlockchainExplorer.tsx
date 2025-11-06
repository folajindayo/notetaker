'use client';

import { useState } from 'react';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
  gasUsed: string;
  functionName?: string;
  blockNumber: number;
}

interface Block {
  number: number;
  hash: string;
  timestamp: Date;
  transactions: number;
  miner: string;
  gasUsed: string;
  gasLimit: string;
}

interface BlockchainExplorerProps {
  transactions?: Transaction[];
  blocks?: Block[];
  contractAddress: string;
  networkName?: string;
}

export default function BlockchainExplorer({
  transactions = [],
  blocks = [],
  contractAddress,
  networkName = 'Base',
}: BlockchainExplorerProps) {
  const [activeTab, setActiveTab] = useState<'transactions' | 'blocks' | 'contract'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      searchQuery === '' ||
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    }
  };

  // Get status icon
  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'pending':
        return '⏳';
      case 'failed':
        return '❌';
    }
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Open in BaseScan
  const openInBaseScan = (type: 'tx' | 'address' | 'block', value: string | number) => {
    const baseUrl = 'https://basescan.org';
    let url = '';
    
    switch (type) {
      case 'tx':
        url = `${baseUrl}/tx/${value}`;
        break;
      case 'address':
        url = `${baseUrl}/address/${value}`;
        break;
      case 'block':
        url = `${baseUrl}/block/${value}`;
        break;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              ⛓️ Blockchain Explorer
            </h2>
            <p className="text-blue-100">
              Explore transactions and blocks on {networkName}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100 mb-1">Contract Address</div>
            <button
              onClick={() => copyToClipboard(contractAddress)}
              className="font-mono text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-colors"
            >
              {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 p-2">
          {(['transactions', 'blocks', 'contract'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by hash, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🔍</div>
                  <p>No transactions found</p>
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.hash}
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getStatusIcon(tx.status)}</span>
                        <div>
                          <button
                            onClick={() => openInBaseScan('tx', tx.hash)}
                            className="font-mono text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                          </button>
                          {tx.functionName && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Function: <span className="font-mono">{tx.functionName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                          tx.status
                        )}`}
                      >
                        {tx.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">From:</span>
                        <button
                          onClick={() => openInBaseScan('address', tx.from)}
                          className="ml-2 font-mono text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {tx.from.slice(0, 8)}...{tx.from.slice(-6)}
                        </button>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">To:</span>
                        <button
                          onClick={() => openInBaseScan('address', tx.to)}
                          className="ml-2 font-mono text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {tx.to.slice(0, 8)}...{tx.to.slice(-6)}
                        </button>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Value:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                          {tx.value} ETH
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Gas Used:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {tx.gasUsed}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Block:</span>
                        <button
                          onClick={() => openInBaseScan('block', tx.blockNumber)}
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          #{tx.blockNumber}
                        </button>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Time:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {formatTimeAgo(tx.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Blocks Tab */}
        {activeTab === 'blocks' && (
          <div className="space-y-4">
            {blocks.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">📦</div>
                <p>No blocks found</p>
              </div>
            ) : (
              blocks.map((block) => (
                <div
                  key={block.number}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <button
                        onClick={() => openInBaseScan('block', block.number)}
                        className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Block #{block.number}
                      </button>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {formatTimeAgo(block.timestamp)}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
                      {block.transactions} TXs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Hash:</span>
                      <button
                        onClick={() => copyToClipboard(block.hash)}
                        className="ml-2 font-mono text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {block.hash.slice(0, 12)}...{block.hash.slice(-10)}
                      </button>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Miner:</span>
                      <button
                        onClick={() => openInBaseScan('address', block.miner)}
                        className="ml-2 font-mono text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {block.miner.slice(0, 8)}...{block.miner.slice(-6)}
                      </button>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Gas Used:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {block.gasUsed} / {block.gasLimit}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Contract Tab */}
        {activeTab === 'contract' && (
          <div className="space-y-6">
            {/* Contract Info */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                📋 Contract Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Contract Address:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(contractAddress)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => openInBaseScan('address', contractAddress)}
                      className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Network:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {networkName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Contract Name:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    NoteBoard
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {transactions.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Total TXs
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {transactions.filter((tx) => tx.status === 'success').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Successful
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {transactions.filter((tx) => tx.status === 'pending').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Pending
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {transactions.filter((tx) => tx.status === 'failed').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Failed
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                🔗 External Resources
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => openInBaseScan('address', contractAddress)}
                  className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    View on BaseScan
                  </span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => window.open(`https://base.org`, '_blank')}
                  className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    Base Network Info
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

