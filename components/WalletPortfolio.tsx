'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useTranslation } from '@/lib/i18n';
import { formatEther } from 'viem';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
  priceUSD: number;
  valueUSD: number;
  change24h: number;
  logo?: string;
}

interface NFT {
  contractAddress: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  collection: string;
  floorPrice?: number;
  lastSale?: number;
}

interface PortfolioStats {
  totalValueUSD: number;
  change24h: number;
  change7d: number;
  totalNFTs: number;
  totalTokens: number;
}

export default function WalletPortfolio() {
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const { t } = useTranslation();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [stats, setStats] = useState<PortfolioStats>({
    totalValueUSD: 0,
    change24h: 0,
    change7d: 0,
    totalNFTs: 0,
    totalTokens: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tokens' | 'nfts' | 'activity'>('tokens');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [sortBy, setSortBy] = useState<'value' | 'alphabetical' | 'change'>('value');

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!address) return;
      
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock token data
      const mockTokens: Token[] = [
        {
          address: '0x0000000000000000000000000000000000000000',
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
          balance: ethBalance?.value.toString() || '0',
          balanceFormatted: ethBalance?.formatted || '0',
          priceUSD: 2000,
          valueUSD: parseFloat(ethBalance?.formatted || '0') * 2000,
          change24h: 3.45,
          logo: '⚡',
        },
        {
          address: '0x4200000000000000000000000000000000000006',
          symbol: 'WETH',
          name: 'Wrapped Ether',
          decimals: 18,
          balance: '2500000000000000000',
          balanceFormatted: '2.5',
          priceUSD: 2000,
          valueUSD: 5000,
          change24h: 3.45,
          logo: '💎',
        },
        {
          address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          balance: '1000000000',
          balanceFormatted: '1000',
          priceUSD: 1,
          valueUSD: 1000,
          change24h: 0.01,
          logo: '💵',
        },
      ];

      // Mock NFT data
      const mockNFTs: NFT[] = [
        {
          contractAddress: '0x1234567890123456789012345678901234567890',
          tokenId: '1',
          name: 'Based Ape #1234',
          description: 'A cool ape on Base',
          image: '/api/placeholder/300/300',
          collection: 'Based Apes',
          floorPrice: 0.5,
          lastSale: 0.75,
        },
        {
          contractAddress: '0x2345678901234567890123456789012345678901',
          tokenId: '567',
          name: 'Base Punk #567',
          description: 'Punk on Base blockchain',
          image: '/api/placeholder/300/300',
          collection: 'Base Punks',
          floorPrice: 1.2,
          lastSale: 1.5,
        },
        {
          contractAddress: '0x3456789012345678901234567890123456789012',
          tokenId: '89',
          name: 'OnChain NFT #89',
          description: 'Fully on-chain art',
          image: '/api/placeholder/300/300',
          collection: 'OnChain Collection',
          floorPrice: 0.3,
        },
      ];

      const totalValue =
        mockTokens.reduce((sum, token) => sum + token.valueUSD, 0) +
        mockNFTs.reduce((sum, nft) => sum + (nft.floorPrice || 0) * 2000, 0);

      setTokens(mockTokens);
      setNFTs(mockNFTs);
      setStats({
        totalValueUSD: totalValue,
        change24h: 5.67,
        change7d: 12.34,
        totalNFTs: mockNFTs.length,
        totalTokens: mockTokens.length,
      });
      setLoading(false);
    };

    fetchPortfolio();
  }, [address, ethBalance]);

  const sortedTokens = [...tokens].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.valueUSD - a.valueUSD;
      case 'alphabetical':
        return a.symbol.localeCompare(b.symbol);
      case 'change':
        return b.change24h - a.change24h;
      default:
        return 0;
    }
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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToViewPortfolio')}</p>
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
      {/* Portfolio Overview */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-2">{t('portfolioValue')}</h2>
        <div className="flex items-end gap-4 mb-4">
          <div className="text-5xl font-bold">${stats.totalValueUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-lg font-semibold ${stats.change24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {stats.change24h >= 0 ? '+' : ''}{stats.change24h.toFixed(2)}%
            </span>
            <span className="text-sm text-blue-100">(24h)</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-blue-100 mb-1">{t('tokens')}</p>
            <p className="text-2xl font-bold">{stats.totalTokens}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-blue-100 mb-1">{t('nfts')}</p>
            <p className="text-2xl font-bold">{stats.totalNFTs}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-blue-100 mb-1">7d {t('change')}</p>
            <p className={`text-2xl font-bold ${stats.change7d >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {stats.change7d >= 0 ? '+' : ''}{stats.change7d.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-6">
          {(['tokens', 'nfts', 'activity'] as const).map((tab) => (
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

      {/* Tokens Tab */}
      {activeTab === 'tokens' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('yourTokens')}</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="value">{t('sortByValue')}</option>
              <option value="alphabetical">{t('alphabetical')}</option>
              <option value="change">{t('sortByChange')}</option>
            </select>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedTokens.map((token) => (
                <div key={token.address} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{token.logo}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{token.symbol}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {parseFloat(token.balanceFormatted).toFixed(4)} {token.symbol}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${token.valueUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-sm text-gray-600 dark:text-gray-400">${token.priceUSD.toLocaleString()}</p>
                      <p className={`text-sm font-semibold ${token.change24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NFTs Tab */}
      {activeTab === 'nfts' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('yourNFTs')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nfts.map((nft) => (
              <div
                key={`${nft.contractAddress}-${nft.tokenId}`}
                onClick={() => setSelectedNFT(nft)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{nft.collection}</p>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{nft.name}</h4>
                  {nft.floorPrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('floor')}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {nft.floorPrice} ETH
                      </span>
                    </div>
                  )}
                  {nft.lastSale && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('lastSale')}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {nft.lastSale} ETH
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('recentActivity')}</h3>
          <div className="space-y-3">
            {[
              { type: 'receive', amount: '0.5 ETH', from: '0x1234...5678', time: '2 hours ago' },
              { type: 'send', amount: '100 USDC', to: '0x9876...5432', time: '5 hours ago' },
              { type: 'receive', amount: 'Based Ape #1234', from: '0xabcd...efgh', time: '1 day ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className={`p-2 rounded-lg ${activity.type === 'receive' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={activity.type === 'receive' ? 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4' : 'M7 16l4-4m0 0l4 4m-4-4v12'}
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.type === 'receive' ? t('received') : t('sent')} {activity.amount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.type === 'receive' ? t('from') : t('to')}: {activity.from || activity.to}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img src={selectedNFT.image} alt={selectedNFT.name} className="w-full aspect-square object-cover" />
              <button
                onClick={() => setSelectedNFT(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedNFT.collection}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{selectedNFT.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedNFT.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedNFT.floorPrice && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('floorPrice')}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedNFT.floorPrice} ETH</p>
                  </div>
                )}
                {selectedNFT.lastSale && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('lastSale')}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedNFT.lastSale} ETH</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
                  {t('viewOnExplorer')}
                </button>
                <button className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                  {t('share')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

