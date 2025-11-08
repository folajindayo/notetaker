import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Share2, PlusCircle, CheckCircle, XCircle, Settings, ExternalLink, Clock, Info, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';

interface ConnectedPlatform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  connectedAt?: string;
  username?: string;
  status: 'active' | 'error' | 'disconnected';
  lastSync?: string;
}

interface CrossPost {
  id: string;
  content: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  scheduledTime?: string;
  postedAt?: string;
  results: PostResult[];
}

interface PostResult {
  platform: string;
  success: boolean;
  postUrl?: string;
  error?: string;
  postedAt?: string;
}

const availablePlatforms: ConnectedPlatform[] = [
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    connected: true,
    connectedAt: '2024-07-15T10:00:00Z',
    username: '@noteboard_user',
    status: 'active',
    lastSync: '2024-07-22T14:30:00Z',
  },
  {
    id: 'farcaster',
    name: 'Farcaster',
    icon: '🔷',
    connected: true,
    connectedAt: '2024-07-10T09:00:00Z',
    username: 'noteboard.eth',
    status: 'active',
    lastSync: '2024-07-22T15:00:00Z',
  },
  {
    id: 'lens',
    name: 'Lens Protocol',
    icon: '🔍',
    connected: true,
    connectedAt: '2024-07-12T11:00:00Z',
    username: 'noteboard.lens',
    status: 'active',
    lastSync: '2024-07-22T13:45:00Z',
  },
  {
    id: 'mirror',
    name: 'Mirror',
    icon: '🪞',
    connected: false,
    status: 'disconnected',
  },
  {
    id: 'medium',
    name: 'Medium',
    icon: '📝',
    connected: false,
    status: 'disconnected',
  },
];

const mockCrossPosts: CrossPost[] = [
  {
    id: 'post_001',
    content: 'Just launched a new feature on NoteBoard! Check it out 🚀',
    platforms: ['twitter', 'farcaster', 'lens'],
    status: 'posted',
    postedAt: '2024-07-22T10:00:00Z',
    results: [
      { platform: 'twitter', success: true, postUrl: 'https://twitter.com/...', postedAt: '2024-07-22T10:00:00Z' },
      { platform: 'farcaster', success: true, postUrl: 'https://warpcast.com/...', postedAt: '2024-07-22T10:00:01Z' },
      { platform: 'lens', success: true, postUrl: 'https://lens.xyz/...', postedAt: '2024-07-22T10:00:02Z' },
    ],
  },
  {
    id: 'post_002',
    content: 'Excited to share our roadmap for Q3 2024!',
    platforms: ['twitter', 'farcaster'],
    status: 'scheduled',
    scheduledTime: '2024-07-23T12:00:00Z',
    results: [],
  },
  {
    id: 'post_003',
    content: 'Join our community event this weekend!',
    platforms: ['twitter'],
    status: 'failed',
    postedAt: '2024-07-21T14:00:00Z',
    results: [
      { platform: 'twitter', success: false, error: 'Rate limit exceeded', postedAt: '2024-07-21T14:00:00Z' },
    ],
  },
];

const CrossPosting: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [platforms, setPlatforms] = useState<ConnectedPlatform[]>(availablePlatforms);
  const [crossPosts, setCrossPosts] = useState<CrossPost[]>(mockCrossPosts);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    selectedPlatforms: [] as string[],
    schedule: false,
    scheduledTime: '',
  });

  useEffect(() => {
    if (isConnected && address) {
      fetchConnectedPlatforms(address);
    }
  }, [address, isConnected]);

  const fetchConnectedPlatforms = async (userAddress: string) => {
    // In a real application, this would check connected social media accounts
    console.log(`Fetching connected platforms for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleConnectPlatform = async (platformId: string) => {
    console.log(`Connecting to ${platformId}...`);
    // In a real app: OAuth flow or wallet connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, connected: true, status: 'active', connectedAt: new Date().toISOString() }
        : p
    ));
    alert(`${platforms.find(p => p.id === platformId)?.name} connected successfully!`);
  };

  const handlePost = async () => {
    if (!newPost.content.trim()) {
      alert('Please enter content to post.');
      return;
    }
    if (newPost.selectedPlatforms.length === 0) {
      alert('Please select at least one platform.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet to post.');
      return;
    }

    setIsPosting(true);
    console.log('Cross-posting to:', newPost.selectedPlatforms);

    try {
      // In a real application, this would:
      // 1. Format content for each platform
      // 2. Post to each platform's API
      // 3. Track results
      await new Promise(resolve => setTimeout(resolve, 3000));

      const results: PostResult[] = newPost.selectedPlatforms.map(platform => ({
        platform,
        success: Math.random() > 0.1, // 90% success rate for demo
        postUrl: `https://${platform}.com/post/${Date.now()}`,
        postedAt: new Date().toISOString(),
      }));

      const post: CrossPost = {
        id: `post_${Date.now()}`,
        content: newPost.content,
        platforms: newPost.selectedPlatforms,
        status: newPost.schedule ? 'scheduled' : 'posted',
        scheduledTime: newPost.schedule ? newPost.scheduledTime : undefined,
        postedAt: newPost.schedule ? undefined : new Date().toISOString(),
        results: newPost.schedule ? [] : results,
      };

      setCrossPosts(prev => [post, ...prev]);
      setIsCreateModalOpen(false);
      setNewPost({
        content: '',
        selectedPlatforms: [],
        schedule: false,
        scheduledTime: '',
      });
      alert('Post published successfully!');
    } catch (error) {
      console.error('Posting failed:', error);
      alert('Failed to post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const getStatusBadge = (status: CrossPost['status']) => {
    switch (status) {
      case 'posted':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Posted</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Scheduled</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to use cross-posting features.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Share2 className="h-8 w-8 mr-3 text-primary" /> Cross-Posting
          </h1>
          <p className="text-muted-foreground mt-1">
            Share your content across multiple social platforms simultaneously
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      <Tabs defaultValue="platforms" className="w-full">
        <TabsList>
          <TabsTrigger value="platforms">Connected Platforms ({platforms.filter(p => p.connected).length})</TabsTrigger>
          <TabsTrigger value="posts">Post History ({crossPosts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map(platform => (
              <Card key={platform.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{platform.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        {platform.connected && platform.username && (
                          <CardDescription>{platform.username}</CardDescription>
                        )}
                      </div>
                    </div>
                    {platform.connected ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Not Connected</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {platform.connected ? (
                    <div className="space-y-2 text-sm">
                      {platform.lastSync && (
                        <p className="text-muted-foreground">
                          Last sync: {format(parseISO(platform.lastSync), 'PPp')}
                        </p>
                      )}
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="h-4 w-4 mr-2" /> Settings
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleConnectPlatform(platform.id)}
                      className="w-full"
                    >
                      Connect
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4 mt-6">
          {crossPosts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Share2 className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No posts yet. Create your first cross-post!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {crossPosts.map(post => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(post.status)}
                          {post.scheduledTime && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(parseISO(post.scheduledTime), 'PPp')}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">Cross-Post</CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">{post.content}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Posted to:</p>
                      <div className="flex flex-wrap gap-2">
                        {post.platforms.map(platformId => {
                          const platform = platforms.find(p => p.id === platformId);
                          const result = post.results.find(r => r.platform === platformId);
                          return (
                            <Badge
                              key={platformId}
                              variant={result?.success === false ? 'destructive' : 'outline'}
                              className="flex items-center gap-1"
                            >
                              {platform?.icon} {platform?.name}
                              {result?.success === false && <XCircle className="h-3 w-3" />}
                              {result?.success && <CheckCircle className="h-3 w-3" />}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    {post.results.length > 0 && (
                      <div className="space-y-2">
                        {post.results.map((result, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                            <div className="flex items-center gap-2">
                              {result.success ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="font-medium">
                                {platforms.find(p => p.id === result.platform)?.name}
                              </span>
                            </div>
                            {result.success && result.postUrl && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={result.postUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            )}
                            {result.error && (
                              <span className="text-xs text-red-600">{result.error}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {post.postedAt && (
                      <p className="text-xs text-muted-foreground">
                        Posted {format(parseISO(post.postedAt), 'PPp')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Post Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Cross-Post</DialogTitle>
            <DialogDescription>Share your content across multiple platforms</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="What's on your mind?"
                rows={6}
              />
              <p className="text-xs text-muted-foreground">{newPost.content.length} characters</p>
            </div>
            <Separator />
            <div className="space-y-3">
              <Label>Select Platforms *</Label>
              <div className="space-y-2">
                {platforms.filter(p => p.connected).map(platform => (
                  <div key={platform.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      id={platform.id}
                      checked={newPost.selectedPlatforms.includes(platform.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewPost(prev => ({
                            ...prev,
                            selectedPlatforms: [...prev.selectedPlatforms, platform.id],
                          }));
                        } else {
                          setNewPost(prev => ({
                            ...prev,
                            selectedPlatforms: prev.selectedPlatforms.filter(id => id !== platform.id),
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={platform.id} className="flex-1 cursor-pointer flex items-center gap-2">
                      <span className="text-xl">{platform.icon}</span>
                      <span>{platform.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
              {platforms.filter(p => p.connected).length === 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>Connect at least one platform to create a cross-post.</AlertDescription>
                </Alert>
              )}
            </div>
            <Separator />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="schedule"
                checked={newPost.schedule}
                onCheckedChange={(checked) => setNewPost(prev => ({ ...prev, schedule: !!checked }))}
              />
              <Label htmlFor="schedule" className="flex-1">Schedule for later</Label>
            </div>
            {newPost.schedule && (
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={newPost.scheduledTime}
                  onChange={(e) => setNewPost(prev => ({ ...prev, scheduledTime: e.target.value }))}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handlePost} disabled={isPosting || newPost.selectedPlatforms.length === 0}>
              {isPosting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : newPost.schedule ? (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Post
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Post Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrossPosting;

