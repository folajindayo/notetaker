import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Layout, Filter, TrendingUp, Clock, Users, Heart, MessageSquare, Save, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';

interface FeedSettings {
  layout: 'list' | 'grid' | 'compact';
  sortBy: 'recent' | 'popular' | 'trending' | 'following';
  filters: {
    showLikes: boolean;
    showComments: boolean;
    showShares: boolean;
    minLikes: number;
    minComments: number;
    verifiedOnly: boolean;
    followingOnly: boolean;
  };
  categories: {
    web3: boolean;
    nft: boolean;
    defi: boolean;
    dao: boolean;
    tutorial: boolean;
    news: boolean;
  };
  algorithm: 'chronological' | 'relevance' | 'engagement';
  contentTypes: {
    text: boolean;
    image: boolean;
    video: boolean;
    link: boolean;
  };
}

const FeedCustomization: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [settings, setSettings] = useState<FeedSettings>({
    layout: 'list',
    sortBy: 'recent',
    filters: {
      showLikes: true,
      showComments: true,
      showShares: true,
      minLikes: 0,
      minComments: 0,
      verifiedOnly: false,
      followingOnly: false,
    },
    categories: {
      web3: true,
      nft: true,
      defi: true,
      dao: true,
      tutorial: true,
      news: true,
    },
    algorithm: 'relevance',
    contentTypes: {
      text: true,
      image: true,
      video: true,
      link: true,
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchFeedSettings(address);
    }
  }, [address, isConnected]);

  const fetchFeedSettings = async (userAddress: string) => {
    // In a real application, this would fetch from IPFS or backend
    console.log(`Fetching feed settings for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSave = async () => {
    setIsSaving(true);
    console.log('Saving feed settings:', settings);
    
    try {
      // In a real application, this would save to IPFS or backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Feed settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFilter = (key: keyof FeedSettings['filters'], value: any) => {
    setSettings(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
    }));
  };

  const updateCategory = (key: keyof FeedSettings['categories'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      categories: { ...prev.categories, [key]: value },
    }));
  };

  const updateContentType = (key: keyof FeedSettings['contentTypes'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      contentTypes: { ...prev.contentTypes, [key]: value },
    }));
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to customize your feed.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Layout className="h-8 w-8 mr-3 text-primary" /> Feed Customization
        </h1>
        <p className="text-muted-foreground mt-1">
          Personalize your feed to see what matters most to you
        </p>
      </div>

      <Tabs defaultValue="display" className="w-full">
        <TabsList>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="content">Content Types</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
        </TabsList>

        <TabsContent value="display" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize how content is displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Layout</Label>
                <Select
                  value={settings.layout}
                  onValueChange={(value: FeedSettings['layout']) => 
                    setSettings(prev => ({ ...prev, layout: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="list">List View</SelectItem>
                    <SelectItem value="grid">Grid View</SelectItem>
                    <SelectItem value="compact">Compact View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Default Sort</Label>
                <Select
                  value={settings.sortBy}
                  onValueChange={(value: FeedSettings['sortBy']) => 
                    setSettings(prev => ({ ...prev, sortBy: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="following">From Following</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Filters</CardTitle>
              <CardDescription>Filter what appears in your feed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Engagement Metrics</Label>
                    <p className="text-sm text-muted-foreground">Display likes, comments, and shares</p>
                  </div>
                  <Switch
                    checked={settings.filters.showLikes && settings.filters.showComments && settings.filters.showShares}
                    onCheckedChange={(checked) => {
                      updateFilter('showLikes', checked);
                      updateFilter('showComments', checked);
                      updateFilter('showShares', checked);
                    }}
                  />
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Minimum Likes</Label>
                    <span className="text-sm font-medium">{settings.filters.minLikes}</span>
                  </div>
                  <Slider
                    value={[settings.filters.minLikes]}
                    onValueChange={(value) => updateFilter('minLikes', value[0])}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Minimum Comments</Label>
                    <span className="text-sm font-medium">{settings.filters.minComments}</span>
                  </div>
                  <Slider
                    value={[settings.filters.minComments]}
                    onValueChange={(value) => updateFilter('minComments', value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Verified Users Only</Label>
                    <p className="text-sm text-muted-foreground">Show content only from verified accounts</p>
                  </div>
                  <Switch
                    checked={settings.filters.verifiedOnly}
                    onCheckedChange={(checked) => updateFilter('verifiedOnly', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Following Only</Label>
                    <p className="text-sm text-muted-foreground">Show content only from people you follow</p>
                  </div>
                  <Switch
                    checked={settings.filters.followingOnly}
                    onCheckedChange={(checked) => updateFilter('followingOnly', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Select which categories to include</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(settings.categories).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <Label className="capitalize">{key}</Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => updateCategory(key as keyof FeedSettings['categories'], checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Types</CardTitle>
              <CardDescription>Choose which content types to display</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5" />
                    <Label>Text Posts</Label>
                  </div>
                  <Switch
                    checked={settings.contentTypes.text}
                    onCheckedChange={(checked) => updateContentType('text', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Layout className="h-5 w-5" />
                    <Label>Images</Label>
                  </div>
                  <Switch
                    checked={settings.contentTypes.image}
                    onCheckedChange={(checked) => updateContentType('image', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5" />
                    <Label>Videos</Label>
                  </div>
                  <Switch
                    checked={settings.contentTypes.video}
                    onCheckedChange={(checked) => updateContentType('video', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5" />
                    <Label>Links</Label>
                  </div>
                  <Switch
                    checked={settings.contentTypes.link}
                    onCheckedChange={(checked) => updateContentType('link', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithm" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Feed Algorithm</CardTitle>
              <CardDescription>Choose how content is ranked in your feed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    settings.algorithm === 'chronological' ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSettings(prev => ({ ...prev, algorithm: 'chronological' }))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-lg font-semibold">Chronological</Label>
                      <p className="text-sm text-muted-foreground">Show posts in order of publication</p>
                    </div>
                    {settings.algorithm === 'chronological' && (
                      <Badge>Selected</Badge>
                    )}
                  </div>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    settings.algorithm === 'relevance' ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSettings(prev => ({ ...prev, algorithm: 'relevance' }))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-lg font-semibold">Relevance</Label>
                      <p className="text-sm text-muted-foreground">AI-powered ranking based on your interests</p>
                    </div>
                    {settings.algorithm === 'relevance' && (
                      <Badge>Selected</Badge>
                    )}
                  </div>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    settings.algorithm === 'engagement' ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSettings(prev => ({ ...prev, algorithm: 'engagement' }))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-lg font-semibold">Engagement</Label>
                      <p className="text-sm text-muted-foreground">Prioritize highly engaging content</p>
                    </div>
                    {settings.algorithm === 'engagement' && (
                      <Badge>Selected</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeedCustomization;

