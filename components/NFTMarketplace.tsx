'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  collection: string;
  owner: string;
  creator: string;
  price: string;
  currency: 'ETH' | 'NOTE';
  lastSale?: string;
  views: number;
  likes: number;
  isListed: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  attributes: { trait: string; value: string; rarity: number }[];
}

interface Collection {
  id: string;
  name: string;
  icon: string;
  floor: string;
  volume: string;
  items: number;
}

export default function NFTMarketplace() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'listed' | 'sold'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'recent' | 'popular'>('recent');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [listPrice, setListPrice] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'ETH' | 'NOTE'>('ETH');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockCollections: Collection[] = [
        { id: '1', name: 'Base Apes', icon: '🦍', floor: '0.5', volume: '1,234', items: 10000 },
        { id: '2', name: 'Crypto Punks', icon: '👾', floor: '2.5', volume: '5,678', items: 10000 },
        { id: '3', name: 'Doodles', icon: '🎨', floor: '1.2', volume: '890', items: 10000 },
        { id: '4', name: 'Azuki', icon: '🌸', floor: '3.8', volume: '2,345', items: 10000 },
      ];

      const mockNFTs: NFT[] = [
        {
          id: '1',
          name: 'Base Ape #1234',
          description: 'A rare Base Ape with laser eyes and gold chain',
          image: '/api/placeholder/400/400',
          collection: 'Base Apes',
          owner: address || '0x1234567890123456789012345678901234567890',
          creator: '0x9876543210987654321098765432109876543210',
          price: '0.75',
          currency: 'ETH',
          lastSale: '0.65',
          views: 1247,
          likes: 89,
          isListed: true,
          rarity: 'rare',
          attributes: [
            { trait: 'Background', value: 'Cosmic', rarity: 15 },
            { trait: 'Eyes', value: 'Laser', rarity: 5 },
            { trait: 'Accessory', value: 'Gold Chain', rarity: 8 },
          ],
        },
        {
          id: '2',
          name: 'Crypto Punk #567',
          description: 'Classic punk with mohawk and shades',
          image: '/api/placeholder/400/400',
          collection: 'Crypto Punks',
          owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          creator: '0x1111111111111111111111111111111111111111',
          price: '3.2',
          currency: 'ETH',
          lastSale: '2.8',
          views: 3456,
          likes: 234,
          isListed: true,
          rarity: 'legendary',
          attributes: [
            { trait: 'Type', value: 'Alien', rarity: 2 },
            { trait: 'Hair', value: 'Mohawk', rarity: 10 },
            { trait: 'Glasses', value: 'Shades', rarity: 12 },
          ],
        },
        {
          id: '3',
          name: 'Doodle #8901',
          description: 'Colorful doodle with rainbow background',
          image: '/api/placeholder/400/400',
          collection: 'Doodles',
          owner: address || '0x2222222222222222222222222222222222222222',
          creator: '0x3333333333333333333333333333333333333333',
          price: '1.5',
          currency: 'ETH',
          views: 567,
          likes: 45,
          isListed: true,
          rarity: 'uncommon',
          attributes: [
            { trait: 'Background', value: 'Rainbow', rarity: 20 },
            { trait: 'Face', value: 'Happy', rarity: 25 },
            { trait: 'Outfit', value: 'Hoodie', rarity: 30 },
          ],
        },
      ];

      setCollections(mockCollections);
      setNfts(mockNFTs);
      setLoading(false);
    };

    loadData();
  }, [address]);

  const handleBuyNFT = async (nft: NFT) => {
    alert(`${t('purchased')} ${nft.name} ${t('for')} ${nft.price} ${nft.currency}!`);
    setNfts(nfts.map((n) => (n.id === nft.id ? { ...n, isListed: false, owner: address! } : n)));
    setSelectedNFT(null);
  };

  const handleListNFT = async () => {
    if (!listPrice || parseFloat(listPrice) <= 0 || !selectedNFT) {
      alert(t('enterValidPrice'));
      return;
    }

    setNfts(
      nfts.map((n) =>
        n.id === selectedNFT.id
          ? { ...n, isListed: true, price: listPrice, currency: selectedCurrency }
          : n
      )
    );
    setShowListModal(false);
    setListPrice('');
  };

  const handleLikeNFT = (nft: NFT) => {
    setNfts(nfts.map((n) => (n.id === nft.id ? { ...n, likes: n.likes + 1 } : n)));
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-500',
      uncommon: 'text-green-500',
      rare: 'text-blue-500',
      epic: 'text-purple-500',
      legendary: 'text-orange-500',
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityBg = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 dark:bg-gray-700',
      uncommon: 'bg-green-100 dark:bg-green-900/30',
      rare: 'bg-blue-100 dark:bg-blue-900/30',
      epic: 'bg-purple-100 dark:bg-purple-900/30',
      legendary: 'bg-orange-100 dark:bg-orange-900/30',
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const filteredNFTs = nfts.filter((nft) => {
    if (filter === 'listed') return nft.isListed;
    if (filter === 'sold') return !nft.isListed;
    return true;
  });

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    if (sortBy === 'price') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'popular') return b.likes - a.likes;
    return 0; // recent is default
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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToExploreNFTs')}</p>
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('nftMarketplace')}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('buyAndSellNFTs')}
        </p>
      </div>

      {/* Collections */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('topCollections')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{collection.icon}</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{collection.name}</h4>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>{t('floor')}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {collection.floor} ETH
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('volume')}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {collection.volume} ETH
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'listed', 'sold'] as const).map((f) => (
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
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="recent">{t('recent')}</option>
          <option value="price">{t('priceHighToLow')}</option>
          <option value="popular">{t('popular')}</option>
        </select>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNFTs.map((nft) => (
          <div
            key={nft.id}
            onClick={() => setSelectedNFT(nft)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* Image */}
            <div className="relative aspect-square bg-gray-200 dark:bg-gray-700">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${getRarityBg(
                    nft.rarity
                  )} ${getRarityColor(nft.rarity)}`}
                >
                  {nft.rarity.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{nft.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{nft.collection}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikeNFT(nft);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  ❤️ {nft.likes}
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {nft.description}
              </p>

              {nft.isListed && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('price')}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {nft.price} {nft.currency}
                    </p>
                    {nft.lastSale && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {t('last')}: {nft.lastSale} {nft.currency}
                      </p>
                    )}
                  </div>
                  {nft.owner.toLowerCase() !== address?.toLowerCase() && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyNFT(nft);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                    >
                      {t('buy')}
                    </button>
                  )}
                </div>
              )}

              {!nft.isListed && nft.owner.toLowerCase() === address?.toLowerCase() && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNFT(nft);
                    setShowListModal(true);
                  }}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                >
                  {t('listForSale')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && !showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Image */}
              <div>
                <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden mb-4">
                  <img
                    src={selectedNFT.image}
                    alt={selectedNFT.name}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${getRarityBg(
                      selectedNFT.rarity
                    )} ${getRarityColor(selectedNFT.rarity)}`}
                  >
                    {selectedNFT.rarity.toUpperCase()}
                  </span>
                </div>

                {/* Attributes */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t('attributes')}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedNFT.attributes.map((attr, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <p className="text-xs text-gray-600 dark:text-gray-400">{attr.trait}</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{attr.value}</p>
                        <p className="text-xs text-blue-500">{attr.rarity}% {t('have')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {selectedNFT.name}
                    </h3>
                    <p className="text-blue-500 hover:text-blue-600 cursor-pointer">
                      {selectedNFT.collection}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedNFT(null)}
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

                <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedNFT.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('views')}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedNFT.views.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('likes')}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedNFT.likes}
                    </p>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="space-y-3 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('owner')}</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                      {selectedNFT.owner.slice(0, 20)}...{selectedNFT.owner.slice(-10)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('creator')}</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                      {selectedNFT.creator.slice(0, 20)}...{selectedNFT.creator.slice(-10)}
                    </p>
                  </div>
                </div>

                {/* Price & Actions */}
                {selectedNFT.isListed && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {t('currentPrice')}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {selectedNFT.price} {selectedNFT.currency}
                    </p>
                    {selectedNFT.lastSale && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('lastSale')}: {selectedNFT.lastSale} {selectedNFT.currency}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  {selectedNFT.isListed &&
                    selectedNFT.owner.toLowerCase() !== address?.toLowerCase() && (
                      <button
                        onClick={() => handleBuyNFT(selectedNFT)}
                        className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                      >
                        {t('buyNow')}
                      </button>
                    )}
                  {!selectedNFT.isListed &&
                    selectedNFT.owner.toLowerCase() === address?.toLowerCase() && (
                      <button
                        onClick={() => setShowListModal(true)}
                        className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                      >
                        {t('listForSale')}
                      </button>
                    )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeNFT(selectedNFT);
                    }}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    ❤️ {selectedNFT.likes}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List Modal */}
      {showListModal && selectedNFT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('listNFTForSale')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('price')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('currency')}
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedCurrency('ETH')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedCurrency === 'ETH'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    ETH
                  </button>
                  <button
                    onClick={() => setSelectedCurrency('NOTE')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedCurrency === 'NOTE'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    NOTE
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowListModal(false);
                  setListPrice('');
                  setSelectedNFT(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleListNFT}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {t('listNFT')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

