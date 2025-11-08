import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Lock, Unlock, Shield, PlusCircle, Trash2, Edit, CheckCircle, XCircle, Info, Coins } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TokenRequirement {
  id: string;
  type: 'ERC20' | 'ERC721' | 'ERC1155';
  contractAddress: string;
  tokenName: string;
  chain: 'base' | 'ethereum' | 'polygon' | 'optimism';
  minimumBalance?: string; // For ERC20
  tokenIds?: string[]; // For ERC721/1155
  operator: 'AND' | 'OR';
}

interface GatedContent {
  id: string;
  title: string;
  description: string;
  content: string;
  createdBy: string;
  requirements: TokenRequirement[];
  unlocked: boolean;
  category: 'post' | 'video' | 'document' | 'course' | 'community';
  createdAt: string;
}

const mockGatedContent: GatedContent[] = [
  {
    id: 'gate_001',
    title: 'Exclusive Alpha Newsletter',
    description: 'Weekly insights and market analysis for token holders.',
    content: 'This is premium content about DeFi trends, market analysis, and investment strategies. Only accessible to holders of our community token.',
    createdBy: '0xAlice',
    requirements: [
      {
        id: 'req_001',
        type: 'ERC20',
        contractAddress: '0x1234...5678',
        tokenName: 'NOTEBOARD Token',
        chain: 'base',
        minimumBalance: '100',
        operator: 'AND',
      },
    ],
    unlocked: true,
    category: 'post',
    createdAt: '2024-07-20T10:00:00Z',
  },
  {
    id: 'gate_002',
    title: 'NFT Holder Exclusive Community',
    description: 'Private community access for Genesis NFT holders.',
    content: 'Welcome to the Genesis holders community! Here you can network with other early supporters and get exclusive perks.',
    createdBy: '0xBob',
    requirements: [
      {
        id: 'req_002',
        type: 'ERC721',
        contractAddress: '0xabcd...efgh',
        tokenName: 'NoteBoard Genesis Pass',
        chain: 'base',
        tokenIds: [],
        operator: 'AND',
      },
    ],
    unlocked: false,
    category: 'community',
    createdAt: '2024-07-18T14:30:00Z',
  },
  {
    id: 'gate_003',
    title: 'Advanced Web3 Development Course',
    description: 'Premium course for developers holding DAO tokens.',
    content: 'Module 1: Building on Base - Learn how to deploy smart contracts on Base L2...',
    createdBy: '0xCharlie',
    requirements: [
      {
        id: 'req_003',
        type: 'ERC20',
        contractAddress: '0x9876...5432',
        tokenName: 'DAO Governance Token',
        chain: 'base',
        minimumBalance: '50',
        operator: 'OR',
      },
      {
        id: 'req_004',
        type: 'ERC721',
        contractAddress: '0xdao0...0dao',
        tokenName: 'DAO Member NFT',
        chain: 'base',
        tokenIds: [],
        operator: 'OR',
      },
    ],
    unlocked: true,
    category: 'course',
    createdAt: '2024-07-15T09:00:00Z',
  },
];

const TokenGating: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [gatedContent, setGatedContent] = useState<GatedContent[]>(mockGatedContent);
  const [selectedContent, setSelectedContent] = useState<GatedContent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newContent, setNewContent] = useState<Partial<GatedContent>>({
    title: '',
    description: '',
    content: '',
    requirements: [],
    category: 'post',
  });
  const [newRequirement, setNewRequirement] = useState<Partial<TokenRequirement>>({
    type: 'ERC20',
    chain: 'base',
    operator: 'AND',
  });

  useEffect(() => {
    if (isConnected && address) {
      // In a real app, check user's token balances and update unlocked status
      checkAccessForAllContent(address);
    }
  }, [address, isConnected]);

  const checkAccessForAllContent = async (userAddress: string) => {
    // In a real application, this would involve:
    // 1. Reading ERC20 balances using contract calls
    // 2. Checking ERC721/ERC1155 ownership
    // 3. Evaluating requirements with AND/OR logic
    // 4. Updating unlocked status for each gated content
    console.log(`Checking access for user ${userAddress}...`);
    
    // Simulate checking access (for demo, we'll randomly unlock some content)
    const updatedContent = gatedContent.map(content => {
      const hasAccess = Math.random() > 0.5; // Random for demo
      return { ...content, unlocked: hasAccess };
    });
    setGatedContent(updatedContent);
  };

  const handleContentClick = (content: GatedContent) => {
    setSelectedContent(content);
    setIsDetailModalOpen(true);
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setNewContent({
      title: '',
      description: '',
      content: '',
      requirements: [],
      category: 'post',
    });
    setIsCreateModalOpen(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setNewContent(prev => ({ ...prev, [field]: value }));
  };

  const handleRequirementChange = (field: string, value: any) => {
    setNewRequirement(prev => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    if (!newRequirement.contractAddress || !newRequirement.tokenName) {
      alert('Please fill in contract address and token name.');
      return;
    }
    const requirement: TokenRequirement = {
      id: `req_${Date.now()}`,
      type: newRequirement.type as TokenRequirement['type'],
      contractAddress: newRequirement.contractAddress!,
      tokenName: newRequirement.tokenName!,
      chain: newRequirement.chain as TokenRequirement['chain'],
      minimumBalance: newRequirement.minimumBalance,
      tokenIds: newRequirement.tokenIds,
      operator: newRequirement.operator as TokenRequirement['operator'],
    };
    setNewContent(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), requirement],
    }));
    setNewRequirement({
      type: 'ERC20',
      chain: 'base',
      operator: 'AND',
    });
  };

  const removeRequirement = (requirementId: string) => {
    setNewContent(prev => ({
      ...prev,
      requirements: prev.requirements?.filter(req => req.id !== requirementId),
    }));
  };

  const handleCreateContent = () => {
    if (!newContent.title || !newContent.content || !newContent.requirements || newContent.requirements.length === 0) {
      alert('Please fill in all required fields and add at least one token requirement.');
      return;
    }
    const contentToCreate: GatedContent = {
      ...newContent,
      id: `gate_${Date.now()}`,
      createdBy: address || 'Anonymous',
      unlocked: false,
      createdAt: new Date().toISOString(),
    } as GatedContent;
    setGatedContent(prev => [contentToCreate, ...prev]);
    setIsCreateModalOpen(false);
    console.log('Gated content created:', contentToCreate);
    // In a real app, this would involve a smart contract transaction
  };

  const getRequirementBadge = (requirement: TokenRequirement) => {
    const colors = {
      ERC20: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      ERC721: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      ERC1155: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    };
    return colors[requirement.type];
  };

  const getCategoryIcon = (category: GatedContent['category']) => {
    // Simple text badges for now
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to access token-gated content and verify your holdings.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-8 w-8 mr-3 text-primary" /> Token-Gated Content
          </h1>
          <p className="text-muted-foreground mt-1">
            Access exclusive content by holding required tokens or NFTs
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <PlusCircle className="h-4 w-4 mr-2" /> Create Gated Content
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {gatedContent.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Lock className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No gated content available yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gatedContent.map((content) => (
                <Card
                  key={content.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleContentClick(content)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                          {content.unlocked ? (
                            <Unlock className="h-5 w-5 text-green-500" />
                          ) : (
                            <Lock className="h-5 w-5 text-red-500" />
                          )}
                          {content.title}
                        </CardTitle>
                        <CardDescription className="mt-1">{content.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge variant="outline">{getCategoryIcon(content.category)}</Badge>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Requirements:</p>
                      <div className="flex flex-wrap gap-1">
                        {content.requirements.map((req, idx) => (
                          <Badge key={req.id} className={getRequirementBadge(req)}>
                            {req.tokenName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {content.unlocked ? (
                      <Alert className="bg-green-50 dark:bg-green-950">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800 dark:text-green-300">Access Granted</AlertTitle>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Locked</AlertTitle>
                      </Alert>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled={!content.unlocked}>
                      {content.unlocked ? 'View Content' : 'Acquire Required Tokens'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unlocked" className="space-y-4 mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gatedContent.filter(c => c.unlocked).map((content) => (
              <Card
                key={content.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleContentClick(content)}
              >
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Unlock className="h-5 w-5 text-green-500" />
                    {content.title}
                  </CardTitle>
                  <CardDescription>{content.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{getCategoryIcon(content.category)}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="space-y-4 mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gatedContent.filter(c => !c.unlocked).map((content) => (
              <Card
                key={content.id}
                className="cursor-pointer hover:shadow-lg transition-shadow opacity-75"
                onClick={() => handleContentClick(content)}
              >
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Lock className="h-5 w-5 text-red-500" />
                    {content.title}
                  </CardTitle>
                  <CardDescription>{content.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge variant="outline">{getCategoryIcon(content.category)}</Badge>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {content.requirements.map((req) => (
                        <Badge key={req.id} className={getRequirementBadge(req)}>
                          {req.tokenName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Content Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedContent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedContent.unlocked ? (
                    <Unlock className="h-6 w-6 text-green-500" />
                  ) : (
                    <Lock className="h-6 w-6 text-red-500" />
                  )}
                  {selectedContent.title}
                </DialogTitle>
                <DialogDescription>{selectedContent.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="font-semibold mb-2">Token Requirements</h4>
                  <div className="space-y-2">
                    {selectedContent.requirements.map((req, idx) => (
                      <div key={req.id} className="p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getRequirementBadge(req)}>{req.type}</Badge>
                          {idx > 0 && (
                            <Badge variant="outline">{req.operator}</Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">{req.tokenName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {req.contractAddress}
                        </p>
                        {req.minimumBalance && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Minimum: {req.minimumBalance} tokens
                          </p>
                        )}
                        <Badge variant="secondary" className="mt-2">{req.chain}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                {selectedContent.unlocked ? (
                  <div>
                    <h4 className="font-semibold mb-2">Content</h4>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="text-sm">{selectedContent.content}</p>
                    </div>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <Lock className="h-4 w-4" />
                    <AlertTitle>Content Locked</AlertTitle>
                    <AlertDescription>
                      You need to hold the required tokens to access this content.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter>
                {!selectedContent.unlocked && (
                  <Button onClick={() => alert('Redirecting to acquire tokens...')}>
                    <Coins className="h-4 w-4 mr-2" /> Get Tokens
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Gated Content Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Token-Gated Content</DialogTitle>
            <DialogDescription>
              Set up exclusive content that requires token or NFT ownership to access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                value={newContent.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={newContent.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">Content</Label>
              <Textarea
                id="content"
                value={newContent.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="col-span-3"
                rows={5}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select
                value={newContent.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-3">Token Requirements</h4>
              {newContent.requirements && newContent.requirements.length > 0 && (
                <div className="space-y-2 mb-4">
                  {newContent.requirements.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <Badge className={getRequirementBadge(req)}>{req.type}</Badge>
                        <span className="ml-2 text-sm">{req.tokenName}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(req.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-3 p-4 border rounded-md">
                <Select
                  value={newRequirement.type}
                  onValueChange={(value) => handleRequirementChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Token Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ERC20">ERC20 Token</SelectItem>
                    <SelectItem value="ERC721">ERC721 NFT</SelectItem>
                    <SelectItem value="ERC1155">ERC1155</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Token Name"
                  value={newRequirement.tokenName || ''}
                  onChange={(e) => handleRequirementChange('tokenName', e.target.value)}
                />
                <Input
                  placeholder="Contract Address"
                  value={newRequirement.contractAddress || ''}
                  onChange={(e) => handleRequirementChange('contractAddress', e.target.value)}
                />
                <Select
                  value={newRequirement.chain}
                  onValueChange={(value) => handleRequirementChange('chain', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="optimism">Optimism</SelectItem>
                  </SelectContent>
                </Select>
                {newRequirement.type === 'ERC20' && (
                  <Input
                    type="number"
                    placeholder="Minimum Balance"
                    value={newRequirement.minimumBalance || ''}
                    onChange={(e) => handleRequirementChange('minimumBalance', e.target.value)}
                  />
                )}
                <Select
                  value={newRequirement.operator}
                  onValueChange={(value) => handleRequirementChange('operator', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Logic Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND (All required)</SelectItem>
                    <SelectItem value="OR">OR (Any one required)</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addRequirement} className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Requirement
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateContent}>Create Gated Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TokenGating;

