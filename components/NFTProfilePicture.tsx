'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface NFT {
  id: string;
  contractAddress: string;
  tokenId: string;
  name: string;
  image: string;
  collection: string;
}

interface NFTProfilePictureProps {
  currentPfp?: string;
  onSelect?: (nft: NFT) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function NFTProfilePicture({
  currentPfp,
  onSelect,
  isOpen,
  onClose,
}: NFTProfilePictureProps) {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [filter, setFilter] = useState<'all' | 'erc721' | 'erc1155'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Fetch NFTs from wallet
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!isConnected || !address) {
        setNfts([]);
        return;
      }

      setLoading(true);
      try {
        // Simulated NFT data - In production, use Alchemy, Moralis, or similar API
        const mockNFTs: NFT[] = [
          {
            id: '1',
            contractAddress: '0x1234...5678',
            tokenId: '1',
            name: 'Cool Ape #1234',
            image: '/api/placeholder/400/400',
            collection: 'Cool Apes',
          },
          {
            id: '2',
            contractAddress: '0x2345...6789',
            tokenId: '42',
            name: 'Punk #42',
            image: '/api/placeholder/400/400',
            collection: 'Crypto Punks',
          },
          {
            id: '3',
            contractAddress: '0x3456...7890',
            tokenId: '100',
            name: 'Doodle #100',
            image: '/api/placeholder/400/400',
            collection: 'Doodles',
          },
          {
            id: '4',
            contractAddress: '0x4567...8901',
            tokenId: '777',
            name: 'Azuki #777',
            image: '/api/placeholder/400/400',
            collection: 'Azuki',
          },
          {
            id: '5',
            contractAddress: '0x5678...9012',
            tokenId: '999',
            name: 'Clone X #999',
            image: '/api/placeholder/400/400',
            collection: 'Clone X',
          },
          {
            id: '6',
            contractAddress: '0x6789...0123',
            tokenId: '5555',
            name: 'Moonbird #5555',
            image: '/api/placeholder/400/400',
            collection: 'Moonbirds',
          },
        ];

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setNfts(mockNFTs);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchNFTs();
    }
  }, [isConnected, address, isOpen]);

  // Filter NFTs based on search and filter
  const filteredNFTs = nfts.filter((nft) => {
    const matchesSearch =
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.collection.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSelectNFT = (nft: NFT) => {
    setSelectedNFT(nft);
  };

  const handleConfirmSelection = () => {
    if (selectedNFT && onSelect) {
      onSelect(selectedNFT);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('selectNFTProfilePicture')}
            </h2>
            <button
              onClick={onClose}
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

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t('searchNFTs')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">{t('allNFTs')}</option>
                <option value="erc721">ERC-721</option>
                <option value="erc1155">ERC-1155</option>
              </select>

              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`px-3 py-2 ${
                    view === 'grid'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-3 py-2 ${
                    view === 'list'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isConnected ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
              <p className="text-gray-600 dark:text-gray-400">
                {t('connectWalletToViewNFTs')}
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredNFTs.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">{t('noNFTsFound')}</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredNFTs.map((nft) => (
                <div
                  key={nft.id}
                  onClick={() => handleSelectNFT(nft)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedNFT?.id === nft.id
                      ? 'border-blue-500 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                  }`}
                >
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                      {nft.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {nft.collection}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNFTs.map((nft) => (
                <div
                  key={nft.id}
                  onClick={() => handleSelectNFT(nft)}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedNFT?.id === nft.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                  }`}
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{nft.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{nft.collection}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Token ID: {nft.tokenId}
                    </p>
                  </div>
                  {selectedNFT?.id === nft.id && (
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedNFT ? (
              <span>
                {t('selected')}: <strong>{selectedNFT.name}</strong>
              </span>
            ) : (
              <span>{filteredNFTs.length} NFTs available</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={!selectedNFT}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('setProfilePicture')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

