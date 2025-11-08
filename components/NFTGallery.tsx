import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Image, Grid, List, ExternalLink, Filter, Search, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  collection: string;
  tokenId: string;
  contractAddress: string;
  chain: 'base' | 'ethereum' | 'polygon' | 'optimism';
  attributes?: { trait_type: string; value: string }[];
  externalUrl?: string;
  lastPrice?: string;
  rarity?: string;
}

const mockNFTs: NFT[] = [
  {
    id: '1',
    name: 'Base Builder #1234',
    description: 'An exclusive NFT for early builders on Base blockchain.',
    image: 'https://picsum.photos/seed/nft1/400/400',
    collection: 'Base Builders',
    tokenId: '1234',
    contractAddress: '0x1234...5678',
    chain: 'base',
    attributes: [
      { trait_type: 'Background', value: 'Blue' },
      { trait_type: 'Type', value: 'Builder' },
      { trait_type: 'Rarity', value: 'Rare' },
    ],
    externalUrl: 'https://opensea.io/assets/base/0x1234',
    lastPrice: '0.5',
    rarity: 'Rare',
  },
  {
    id: '2',
    name: 'NoteBoard Genesis Pass',
    description: 'Genesis pass holder NFT with exclusive perks.',
    image: 'https://picsum.photos/seed/nft2/400/400',
    collection: 'NoteBoard Genesis',
    tokenId: '42',
    contractAddress: '0xabcd...efgh',
    chain: 'base',
    attributes: [
      { trait_type: 'Tier', value: 'Genesis' },
      { trait_type: 'Benefits', value: 'Lifetime Premium' },
    ],
    externalUrl: 'https://opensea.io/assets/base/0xabcd',
    rarity: 'Legendary',
  },
  {
    id: '3',
    name: 'CryptoArt Masterpiece #789',
    description: 'Digital art NFT from renowned Web3 artist.',
    image: 'https://picsum.photos/seed/nft3/400/400',
    collection: 'CryptoArt Collection',
    tokenId: '789',
    contractAddress: '0x9876...5432',
    chain: 'ethereum',
    attributes: [
      { trait_type: 'Artist', value: 'CryptoArtist' },
      { trait_type: 'Style', value: 'Abstract' },
      { trait_type: 'Year', value: '2024' },
    ],
    externalUrl: 'https://opensea.io/assets/ethereum/0x9876',
    lastPrice: '1.2',
    rarity: 'Epic',
  },
  {
    id: '4',
    name: 'Community Badge #101',
    description: 'Special badge for active community members.',
    image: 'https://picsum.photos/seed/nft4/400/400',
    collection: 'Community Badges',
    tokenId: '101',
    contractAddress: '0xbadg...e101',
    chain: 'base',
    attributes: [
      { trait_type: 'Activity Level', value: 'High' },
      { trait_type: 'Member Since', value: '2023' },
    ],
    rarity: 'Uncommon',
  },
  {
    id: '5',
    name: 'DAO Governance Token #555',
    description: 'NFT representing voting power in the DAO.',
    image: 'https://picsum.photos/seed/nft5/400/400',
    collection: 'DAO Governance',
    tokenId: '555',
    contractAddress: '0xdao0...0dao',
    chain: 'base',
    attributes: [
      { trait_type: 'Voting Power', value: '100' },
      { trait_type: 'Delegation', value: 'Enabled' },
    ],
    rarity: 'Rare',
  },
  {
    id: '6',
    name: 'Music NFT #2468',
    description: 'Exclusive music track as an NFT.',
    image: 'https://picsum.photos/seed/nft6/400/400',
    collection: 'Web3 Music',
    tokenId: '2468',
    contractAddress: '0xmus1...c123',
    chain: 'polygon',
    attributes: [
      { trait_type: 'Genre', value: 'Electronic' },
      { trait_type: 'Duration', value: '3:45' },
      { trait_type: 'Artist', value: 'Web3DJ' },
    ],
    lastPrice: '0.3',
    rarity: 'Common',
  },
];

const NFTGallery: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChain, setFilterChain] = useState<string>('all');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    if (address) {
      fetchNFTs(address);
    } else {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [nfts, searchQuery, filterChain, filterRarity, sortBy]);

  const fetchNFTs = async (walletAddress: string) => {
    setLoading(true);
    setError(null);
    try {
      // In a real application, this would involve:
      // 1. Calling NFT indexer APIs (Alchemy, Moralis, Reservoir, SimpleHash)
      // 2. Fetching NFTs across multiple chains (Base, Ethereum, Polygon, etc.)
      // 3. Parsing metadata and images from IPFS or centralized storage
      // 4. Handling different token standards (ERC-721, ERC-1155)
      console.log(`Fetching NFTs for wallet ${walletAddress}...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setNfts(mockNFTs);
      setFilteredNfts(mockNFTs);
    } catch (err) {
      console.error('Failed to fetch NFTs:', err);
      setError('Failed to load NFT collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...nfts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(nft =>
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Chain filter
    if (filterChain !== 'all') {
      filtered = filtered.filter(nft => nft.chain === filterChain);
    }

    // Rarity filter
    if (filterRarity !== 'all') {
      filtered = filtered.filter(nft => nft.rarity?.toLowerCase() === filterRarity.toLowerCase());
    }

    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'collection':
        filtered.sort((a, b) => a.collection.localeCompare(b.collection));
        break;
      case 'price':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.lastPrice || '0');
          const priceB = parseFloat(b.lastPrice || '0');
          return priceB - priceA;
        });
        break;
      case 'recent':
      default:
        // Keep original order (most recent first)
        break;
    }

    setFilteredNfts(filtered);
  };

  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft);
    setIsDetailModalOpen(true);
  };

  const getChainBadgeColor = (chain: NFT['chain']) => {
    switch (chain) {
      case 'base': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ethereum': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'polygon': return 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300';
      case 'optimism': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRarityBadgeColor = (rarity?: string) => {
    if (!rarity) return 'bg-gray-100 text-gray-800';
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'uncommon': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'common': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to view your NFT collection.</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>NFT Gallery</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading your NFT collection...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>NFT Gallery</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-destructive">
          <p>{error}</p>
          <Button onClick={() => fetchNFTs(address!)} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NFT Gallery</h1>
          <p className="text-muted-foreground mt-1">
            {filteredNfts.length} {filteredNfts.length === 1 ? 'NFT' : 'NFTs'} in your collection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterChain} onValueChange={setFilterChain}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chains</SelectItem>
                <SelectItem value="base">Base</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="optimism">Optimism</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRarity} onValueChange={setFilterRarity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="common">Common</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="collection">Collection</SelectItem>
                <SelectItem value="price">Price (High-Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* NFT Grid/List */}
      {filteredNfts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Image className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {searchQuery || filterChain !== 'all' || filterRarity !== 'all'
                ? 'No NFTs match your filters.'
                : 'No NFTs found in your wallet.'}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNfts.map((nft) => (
            <Card
              key={nft.id}
              className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
              onClick={() => handleNFTClick(nft)}
            >
              <div className="aspect-square relative overflow-hidden bg-muted">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge className={getChainBadgeColor(nft.chain)}>
                    {nft.chain}
                  </Badge>
                  {nft.rarity && (
                    <Badge className={getRarityBadgeColor(nft.rarity)}>
                      {nft.rarity}
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">{nft.name}</CardTitle>
                <CardDescription className="line-clamp-1">{nft.collection}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{nft.description}</p>
                {nft.lastPrice && (
                  <p className="text-sm font-medium mt-2">Last Price: {nft.lastPrice} ETH</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNfts.map((nft) => (
            <Card
              key={nft.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleNFTClick(nft)}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-48 relative overflow-hidden bg-muted">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{nft.name}</h3>
                      <p className="text-muted-foreground">{nft.collection}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge className={getChainBadgeColor(nft.chain)}>
                        {nft.chain}
                      </Badge>
                      {nft.rarity && (
                        <Badge className={getRarityBadgeColor(nft.rarity)}>
                          {nft.rarity}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-2">{nft.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-sm text-muted-foreground">Token ID: {nft.tokenId}</span>
                    {nft.lastPrice && (
                      <span className="text-sm font-medium">Last Price: {nft.lastPrice} ETH</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* NFT Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedNFT && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedNFT.name}</DialogTitle>
                <DialogDescription>{selectedNFT.collection}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                  <img
                    src={selectedNFT.image}
                    alt={selectedNFT.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Badge className={getChainBadgeColor(selectedNFT.chain)}>
                      {selectedNFT.chain}
                    </Badge>
                    {selectedNFT.rarity && (
                      <Badge className={getRarityBadgeColor(selectedNFT.rarity)}>
                        {selectedNFT.rarity}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedNFT.description}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Token ID</p>
                      <p className="font-medium">{selectedNFT.tokenId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Contract</p>
                      <p className="font-medium truncate">{selectedNFT.contractAddress}</p>
                    </div>
                    {selectedNFT.lastPrice && (
                      <div>
                        <p className="text-muted-foreground">Last Price</p>
                        <p className="font-medium">{selectedNFT.lastPrice} ETH</p>
                      </div>
                    )}
                  </div>
                  {selectedNFT.attributes && selectedNFT.attributes.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Attributes</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedNFT.attributes.map((attr, index) => (
                            <div
                              key={index}
                              className="p-2 bg-muted rounded-md"
                            >
                              <p className="text-xs text-muted-foreground">{attr.trait_type}</p>
                              <p className="text-sm font-medium">{attr.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <DialogFooter>
                {selectedNFT.externalUrl && (
                  <Button asChild variant="outline">
                    <a
                      href={selectedNFT.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      View on OpenSea <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NFTGallery;

