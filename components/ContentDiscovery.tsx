import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, TrendingUp, Sparkles, Clock, Heart, MessageSquare, Share2, Filter, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { format, parseISO } from 'date-fns';

interface DiscoveredContent {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  authorUsername?: string;
  category: 'trending' | 'popular' | 'new' | 'recommended';
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timestamp: string;
  tags: string[];
  isLiked: boolean;
  engagementScore: number;
}

const mockContent: DiscoveredContent[] = [
  {
    id: 'content_001',
    title: 'Building on Base: A Complete Guide',
    content: 'Learn how to deploy smart contracts on Base L2 and optimize for gas efficiency...',
    author: '0xBuilder',
    authorAvatar: 'https://picsum.photos/seed/builder/100/100',
    authorUsername: 'Web3Builder',
    category: 'trending',
    likes: 1250,
    comments: 89,
    shares: 45,
    views: 15000,
    timestamp: '2024-07-22T10:00:00Z',
    tags: ['web3', 'base', 'tutorial'],
    isLiked: false,
    engagementScore: 95,
  },
  {
    id: 'content_002',
    title: 'The Future of Decentralized Social Media',
    content: 'Exploring how Web3 is revolutionizing social networking and content creation...',
    author: '0xCreator',
    authorAvatar: 'https://picsum.photos/seed/creator/100/100',
    authorUsername: 'CryptoCreator',
    category: 'popular',
    likes: 890,
    comments: 67,
    shares: 32,
    views: 12000,
    timestamp: '2024-07-21T14:30:00Z',
    tags: ['web3', 'social', 'future'],
    isLiked: true,
    engagementScore: 88,
  },
  {
    id: 'content_003',
    title: 'NFT Marketplace Deep Dive',
    content: 'Understanding the mechanics of NFT marketplaces and how to navigate them...',
    author: '0xExpert',
    authorUsername: 'NFTExpert',
    category: 'new',
    likes: 234,
    comments: 12,
    shares: 8,
    views: 3500,
    timestamp: '2024-07-22T15:00:00Z',
    tags: ['nft', 'marketplace', 'guide'],
    isLiked: false,
    engagementScore: 65,
  },
  {
    id: 'content_004',
    title: 'DAO Governance Best Practices',
    content: 'Tips and strategies for effective DAO participation and governance...',
    author: '0xGovernor',
    authorAvatar: 'https://picsum.photos/seed/governor/100/100',
    authorUsername: 'DAOGuru',
    category: 'recommended',
    likes: 567,
    comments: 34,
    shares: 19,
    views: 8500,
    timestamp: '2024-07-20T09:00:00Z',
    tags: ['dao', 'governance', 'best-practices'],
    isLiked: false,
    engagementScore: 78,
  },
];

const ContentDiscovery: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [content, setContent] = useState<DiscoveredContent[]>(mockContent);
  const [filteredContent, setFilteredContent] = useState<DiscoveredContent[]>(mockContent);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('engagement');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [content, searchQuery, filterCategory, sortBy, selectedTags]);

  const applyFiltersAndSort = () => {
    let filtered = [...content];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item =>
        selectedTags.some(tag => item.tags.includes(tag))
      );
    }

    // Sort
    switch (sortBy) {
      case 'engagement':
        filtered.sort((a, b) => b.engagementScore - a.engagementScore);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'likes':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }

    setFilteredContent(filtered);
  };

  const handleLike = (contentId: string) => {
    setContent(prev => prev.map(item => 
      item.id === contentId 
        ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
        : item
    ));
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    content.forEach(item => item.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getCategoryBadge = (category: DiscoveredContent['category']) => {
    const colors = {
      trending: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      popular: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      new: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      recommended: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    };
    return <Badge className={colors[category]}>{category}</Badge>;
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to discover and explore content.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Sparkles className="h-8 w-8 mr-3 text-primary" /> Content Discovery
        </h1>
        <p className="text-muted-foreground mt-1">
          Discover trending, popular, and recommended content tailored for you
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content, tags, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="recommended">Recommended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engagement">Engagement Score</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center justify-center">
                <Filter className="h-4 w-4 mr-2" /> More Filters
              </Button>
            </div>
            {/* Tags */}
            <div>
              <p className="text-sm font-medium mb-2">Filter by Tags</p>
              <div className="flex flex-wrap gap-2">
                {getAllTags().map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="recommended">For You</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {filteredContent.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Search className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No content found matching your filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredContent.map(item => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryBadge(item.category)}
                          <Badge variant="outline" className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {item.engagementScore}% engagement
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{item.content}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={item.authorAvatar} />
                          <AvatarFallback>
                            {item.authorUsername?.[0] || item.author.slice(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {item.authorUsername || item.author.slice(0, 10) + '...'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(item.timestamp), 'PP')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" /> {item.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" /> {item.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" /> {item.shares}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {item.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant={item.isLiked ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleLike(item.id)}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${item.isLiked ? 'fill-current' : ''}`} />
                        {item.isLiked ? 'Liked' : 'Like'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-4 mt-6">
          <div className="space-y-4">
            {content.filter(c => c.category === 'trending').map(item => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-red-500" />
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2">{item.content}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.authorAvatar} />
                        <AvatarFallback>{item.authorUsername?.[0] || item.author.slice(2, 4).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{item.authorUsername || item.author.slice(0, 10) + '...'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" /> {item.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" /> {item.comments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4 mt-6">
          <div className="space-y-4">
            {content.filter(c => c.category === 'recommended').map(item => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2">{item.content}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.authorAvatar} />
                        <AvatarFallback>{item.authorUsername?.[0] || item.author.slice(2, 4).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{item.authorUsername || item.author.slice(0, 10) + '...'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" /> {item.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" /> {item.comments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentDiscovery;

