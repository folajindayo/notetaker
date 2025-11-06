'use client';

import { useState } from 'react';
import { ShoppingCart, Star, Filter, Search, TrendingUp, Zap, Heart, Eye } from 'lucide-react';

interface NFTItem {
  id: string;
  name: string;
  creator: string;
  price: string;
  image: string;
  likes: number;
  views: number;
  category: string;
  verified: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function MarketplacePage() {
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');

  const items: NFTItem[] = [
    {
      id: '1',
      name: 'Cosmic Dreams #042',
      creator: 'Alice Creator',
      price: '2.5',
      image: 'https://via.placeholder.com/400x400/667eea/ffffff?text=Cosmic+Dreams',
      likes: 342,
      views: 1234,
      category: 'art',
      verified: true,
      rarity: 'legendary',
    },
    {
      id: '2',
      name: 'Digital Sunrise',
      creator: 'Bob Artist',
      price: '1.8',
      image: 'https://via.placeholder.com/400x400/f093fb/ffffff?text=Digital+Sunrise',
      likes: 256,
      views: 892,
      category: 'art',
      verified: false,
      rarity: 'epic',
    },
    {
      id: '3',
      name: 'CyberPunk #123',
      creator: 'Carol NFT',
      price: '3.2',
      image: 'https://via.placeholder.com/400x400/4facfe/ffffff?text=CyberPunk',
      likes: 489,
      views: 2145,
      category: 'collectible',
      verified: true,
      rarity: 'rare',
    },
    {
      id: '4',
      name: 'Abstract Thoughts',
      creator: 'Dave Digital',
      price: '0.9',
      image: 'https://via.placeholder.com/400x400/00f2fe/ffffff?text=Abstract',
      likes: 178,
      views: 645,
      category: 'art',
      verified: false,
      rarity: 'common',
    },
    {
      id: '5',
      name: 'Neon City #007',
      creator: 'Eve Creator',
      price: '4.1',
      image: 'https://via.placeholder.com/400x400/43e97b/ffffff?text=Neon+City',
      likes: 623,
      views: 3456,
      category: 'photography',
      verified: true,
      rarity: 'legendary',
    },
    {
      id: '6',
      name: 'Pixel Paradise',
      creator: 'Frank Pixel',
      price: '1.5',
      image: 'https://via.placeholder.com/400x400/fa709a/ffffff?text=Pixel+Paradise',
      likes: 312,
      views: 1087,
      category: 'collectible',
      verified: false,
      rarity: 'rare',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Items', icon: '🎨' },
    { id: 'art', label: 'Art', icon: '🖼️' },
    { id: 'collectible', label: 'Collectibles', icon: '💎' },
    { id: 'photography', label: 'Photography', icon: '📸' },
    { id: 'music', label: 'Music', icon: '🎵' },
  ];

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'text-gray-600 dark:text-gray-400',
      rare: 'text-blue-600 dark:text-blue-400',
      epic: 'text-purple-600 dark:text-purple-400',
      legendary: 'text-yellow-600 dark:text-yellow-400',
    };
    return colors[rarity] || colors.common;
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">NFT Marketplace</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and collect unique digital assets on Base
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              12.5K
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">8.9K</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Creators</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              234 ETH
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Volume</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              1.2 ETH
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Floor Price</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category */}
            <div className="md:col-span-1">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="md:col-span-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="trending">🔥 Trending</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="newest">⚡ Recently Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-400 to-pink-600">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm ${getRarityColor(
                      item.rarity
                    )} capitalize shadow-lg`}
                  >
                    {item.rarity}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                  <div className="flex-1 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-semibold text-gray-900">{item.likes}</span>
                  </div>
                  <div className="flex-1 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold text-gray-900">{item.views}</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.creator}</p>
                      {item.verified && (
                        <span className="text-blue-500" title="Verified Creator">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</div>
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {item.price} ETH
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg font-semibold">
                    Buy Now
                  </button>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 border border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-medium">
                    Make Offer
                  </button>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredItems.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold border border-gray-200 dark:border-gray-700">
              Load More Items
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No items found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

