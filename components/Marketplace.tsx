import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ShoppingCart, Filter, Search, Heart, TrendingUp, Clock, DollarSign, Image, Info, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'nft' | 'token' | 'collectible';
  collection?: string;
  price: string;
  currency: 'ETH' | 'USDC' | 'NOTE';
  seller: string;
  sellerAvatar?: string;
  listedAt: string;
  views: number;
  likes: number;
  isLiked: boolean;
  chain: 'base' | 'ethereum' | 'polygon';
  tokenId?: string;
  contractAddress?: string;
  attributes?: { trait_type: string; value: string }[];
  rarity?: string;
}

interface Listing {
  id: string;
  itemId: string;
  price: string;
  currency: string;
  listedAt: string;
  expiresAt?: string;
  status: 'active' | 'sold' | 'cancelled';
}

const mockItems: MarketplaceItem[] = [
  {
    id: 'item_001',
    name: 'Base Builder #1234',
    description: 'An exclusive NFT for early builders on Base blockchain.',
    image: 'https://picsum.photos/seed/nft1/400/400',
    type: 'nft',
    collection: 'Base Builders',
    price: '0.5',
    currency: 'ETH',
    seller: '0xSeller1',
    sellerAvatar: 'https://picsum.photos/seed/seller1/100/100',
    listedAt: '2024-07-20T10:00:00Z',
    views: 1250,
    likes: 45,
    isLiked: false,
    chain: 'base',
    tokenId: '1234',
    contractAddress: '0x1234...5678',
    attributes: [
      { trait_type: 'Background', value: 'Blue' },
      { trait_type: 'Type', value: 'Builder' },
    ],
    rarity: 'Rare',
  },
  {
    id: 'item_002',
    name: 'NoteBoard Premium Pass',
    description: 'Lifetime premium access to all NoteBoard features.',
    image: 'https://picsum.photos/seed/pass/400/400',
    type: 'nft',
    collection: 'NoteBoard Genesis',
    price: '2.5',
    currency: 'ETH',
    seller: '0xSeller2',
    listedAt: '2024-07-21T14:30:00Z',
    views: 3420,
    likes: 120,
    isLiked: true,
    chain: 'base',
    rarity: 'Legendary',
  },
  {
    id: 'item_003',
    name: 'Community Badge #101',
    description: 'Special badge for active community members.',
    image: 'https://picsum.photos/seed/badge/400/400',
    type: 'collectible',
    price: '0.1',
    currency: 'ETH',
    seller: '0xSeller3',
    listedAt: '2024-07-22T09:00:00Z',
    views: 450,
    likes: 12,
    isLiked: false,
    chain: 'base',
  },
  {
    id: 'item_004',
    name: 'CryptoArt Masterpiece',
    description: 'Digital art NFT from renowned Web3 artist.',
    image: 'https://picsum.photos/seed/art/400/400',
    type: 'nft',
    collection: 'CryptoArt Collection',
    price: '1.2',
    currency: 'ETH',
    seller: '0xSeller4',
    listedAt: '2024-07-19T16:00:00Z',
    views: 890,
    likes: 34,
    isLiked: false,
    chain: 'ethereum',
    rarity: 'Epic',
  },
  {
    id: 'item_005',
    name: 'DAO Governance Token Bundle',
    description: 'Package of 1000 governance tokens.',
    image: 'https://picsum.photos/seed/tokens/400/400',
    type: 'token',
    price: '500',
    currency: 'USDC',
    seller: '0xSeller5',
    listedAt: '2024-07-18T11:00:00Z',
    views: 234,
    likes: 8,
    isLiked: false,
    chain: 'base',
  },
];

const Marketplace: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [items, setItems] = useState<MarketplaceItem[]>(mockItems);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>(mockItems);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterChain, setFilterChain] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    applyFiltersAndSort();
  }, [items, searchQuery, filterType, filterChain, sortBy]);

  const applyFiltersAndSort = () => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.collection?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Chain filter
    if (filterChain !== 'all') {
      filtered = filtered.filter(item => item.chain === filterChain);
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price_high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime());
        break;
    }

    setFilteredItems(filtered);
  };

  const handleItemClick = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handlePurchase = async () => {
    if (!selectedItem || !isConnected) {
      alert('Please connect your wallet to make a purchase.');
      return;
    }

    setIsPurchasing(true);
    console.log(`Purchasing ${selectedItem.name} for ${selectedItem.price} ${selectedItem.currency}...`);

    try {
      // In a real application, this would involve:
      // 1. Approve token spending (if not native currency)
      // 2. Call marketplace contract purchase function
      // 3. Transfer NFT/token to buyer
      // 4. Transfer payment to seller
      // 5. Update listing status
      await new Promise(resolve => setTimeout(resolve, 3000));

      setItems(prev => prev.filter(item => item.id !== selectedItem.id));
      setIsDetailModalOpen(false);
      alert(`Successfully purchased ${selectedItem.name}!`);
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleLike = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
        : item
    ));
    if (selectedItem?.id === itemId) {
      setSelectedItem(prev => prev ? {
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      } : null);
    }
  };

  const getRarityBadge = (rarity?: string) => {
    if (!rarity) return null;
    const colors = {
      Legendary: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      Epic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      Rare: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Uncommon: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Common: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return <Badge className={colors[rarity as keyof typeof colors] || colors.Common}>{rarity}</Badge>;
  };

  const getChainBadge = (chain: MarketplaceItem['chain']) => {
    const colors = {
      base: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      ethereum: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      polygon: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
    };
    return <Badge className={colors[chain]}>{chain}</Badge>;
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to browse and purchase items from the marketplace.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <ShoppingCart className="h-8 w-8 mr-3 text-primary" /> Marketplace
        </h1>
        <p className="text-muted-foreground mt-1">
          Buy and sell NFTs, tokens, and collectibles
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="nft">NFTs</SelectItem>
                <SelectItem value="token">Tokens</SelectItem>
                <SelectItem value="collectible">Collectibles</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterChain} onValueChange={setFilterChain}>
              <SelectTrigger>
                <SelectValue placeholder="Chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chains</SelectItem>
                <SelectItem value="base">Base</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Listed</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center justify-center">
              <Filter className="h-4 w-4 mr-2" /> More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No items found matching your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
              onClick={() => handleItemClick(item)}
            >
              <div className="aspect-square relative overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  {getChainBadge(item.chain)}
                  {item.rarity && getRarityBadge(item.rarity)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(item.id);
                  }}
                >
                  <Heart className={`h-4 w-4 ${item.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                {item.collection && (
                  <CardDescription className="line-clamp-1">{item.collection}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{item.price}</p>
                    <p className="text-sm text-muted-foreground">{item.currency}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {item.views}
                    </p>
                    <p className="flex items-center gap-1">
                      <Heart className="h-3 w-3" /> {item.likes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.name}</DialogTitle>
                <DialogDescription>
                  {selectedItem.collection && `${selectedItem.collection} • `}
                  Listed {format(parseISO(selectedItem.listedAt), 'PPP')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getChainBadge(selectedItem.chain)}
                    {selectedItem.rarity && getRarityBadge(selectedItem.rarity)}
                    <Badge variant="outline" className="capitalize">{selectedItem.type}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                  </div>
                  {selectedItem.attributes && selectedItem.attributes.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Attributes</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedItem.attributes.map((attr, index) => (
                            <div key={index} className="p-2 bg-muted rounded-md">
                              <p className="text-xs text-muted-foreground">{attr.trait_type}</p>
                              <p className="text-sm font-medium">{attr.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Seller</p>
                      <p className="font-medium">{selectedItem.seller.slice(0, 10)}...</p>
                    </div>
                    {selectedItem.tokenId && (
                      <div>
                        <p className="text-muted-foreground">Token ID</p>
                        <p className="font-medium">{selectedItem.tokenId}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Views</p>
                      <p className="font-medium">{selectedItem.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Likes</p>
                      <p className="font-medium">{selectedItem.likes}</p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-3xl font-bold">{selectedItem.price} {selectedItem.currency}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleLike(selectedItem.id)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${selectedItem.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    {selectedItem.likes}
                  </Button>
                  <Button onClick={handlePurchase} disabled={isPurchasing}>
                    {isPurchasing ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;

