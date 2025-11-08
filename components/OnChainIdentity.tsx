import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Shield, CheckCircle, XCircle, PlusCircle, Edit, Trash2, Info, Key, Globe } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';

interface IdentityAttribute {
  id: string;
  key: string;
  value: string;
  verified: boolean;
  verifier?: string;
  verifiedAt?: string;
  createdAt: string;
}

interface IdentityCredential {
  id: string;
  type: 'email' | 'phone' | 'social' | 'kyc' | 'reputation' | 'custom';
  name: string;
  value: string;
  issuer: string;
  issuedAt: string;
  expiresAt?: string;
  verified: boolean;
  credentialHash: string;
}

interface IdentityLink {
  id: string;
  platform: 'twitter' | 'github' | 'discord' | 'telegram' | 'custom';
  username: string;
  verified: boolean;
  verifiedAt?: string;
  link: string;
}

const mockAttributes: IdentityAttribute[] = [
  {
    id: 'attr_001',
    key: 'name',
    value: 'John Doe',
    verified: true,
    verifier: '0xVerifier',
    verifiedAt: '2024-07-20T10:00:00Z',
    createdAt: '2024-07-19T14:00:00Z',
  },
  {
    id: 'attr_002',
    key: 'bio',
    value: 'Web3 enthusiast and developer',
    verified: false,
    createdAt: '2024-07-19T14:00:00Z',
  },
  {
    id: 'attr_003',
    key: 'location',
    value: 'San Francisco, CA',
    verified: false,
    createdAt: '2024-07-20T09:00:00Z',
  },
];

const mockCredentials: IdentityCredential[] = [
  {
    id: 'cred_001',
    type: 'kyc',
    name: 'KYC Verification',
    value: 'Verified',
    issuer: '0xKYCProvider',
    issuedAt: '2024-07-15T10:00:00Z',
    expiresAt: '2025-07-15T10:00:00Z',
    verified: true,
    credentialHash: '0xhash123...',
  },
  {
    id: 'cred_002',
    type: 'reputation',
    name: 'Community Reputation',
    value: '950 points',
    issuer: '0xCommunity',
    issuedAt: '2024-07-20T12:00:00Z',
    verified: true,
    credentialHash: '0xhash456...',
  },
];

const mockLinks: IdentityLink[] = [
  {
    id: 'link_001',
    platform: 'twitter',
    username: '@johndoe',
    verified: true,
    verifiedAt: '2024-07-18T10:00:00Z',
    link: 'https://twitter.com/johndoe',
  },
  {
    id: 'link_002',
    platform: 'github',
    username: 'johndoe',
    verified: true,
    verifiedAt: '2024-07-18T11:00:00Z',
    link: 'https://github.com/johndoe',
  },
  {
    id: 'link_003',
    platform: 'discord',
    username: 'johndoe#1234',
    verified: false,
    link: 'https://discord.com/users/johndoe',
  },
];

const OnChainIdentity: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [attributes, setAttributes] = useState<IdentityAttribute[]>(mockAttributes);
  const [credentials, setCredentials] = useState<IdentityCredential[]>(mockCredentials);
  const [links, setLinks] = useState<IdentityLink[]>(mockLinks);
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<IdentityAttribute | null>(null);
  const [newAttribute, setNewAttribute] = useState({ key: '', value: '' });
  const [newLink, setNewLink] = useState({
    platform: 'twitter' as IdentityLink['platform'],
    username: '',
    link: '',
  });

  useEffect(() => {
    if (isConnected && address) {
      fetchIdentityData(address);
    }
  }, [address, isConnected]);

  const fetchIdentityData = async (userAddress: string) => {
    // In a real application, this would fetch from blockchain or IPFS
    console.log(`Fetching identity data for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleAddAttribute = async () => {
    if (!newAttribute.key || !newAttribute.value) {
      alert('Please fill in all fields.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet.');
      return;
    }

    console.log('Adding attribute:', newAttribute);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const attribute: IdentityAttribute = {
      id: `attr_${Date.now()}`,
      key: newAttribute.key,
      value: newAttribute.value,
      verified: false,
      createdAt: new Date().toISOString(),
    };

    setAttributes(prev => [...prev, attribute]);
    setIsAttributeModalOpen(false);
    setNewAttribute({ key: '', value: '' });
    alert('Attribute added successfully!');
  };

  const handleEditAttribute = (attribute: IdentityAttribute) => {
    setEditingAttribute(attribute);
    setNewAttribute({ key: attribute.key, value: attribute.value });
    setIsAttributeModalOpen(true);
  };

  const handleUpdateAttribute = async () => {
    if (!editingAttribute || !newAttribute.key || !newAttribute.value) {
      alert('Please fill in all fields.');
      return;
    }

    console.log('Updating attribute:', editingAttribute.id, newAttribute);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setAttributes(prev => prev.map(a => 
      a.id === editingAttribute.id 
        ? { ...a, key: newAttribute.key, value: newAttribute.value, verified: false }
        : a
    ));

    setIsAttributeModalOpen(false);
    setEditingAttribute(null);
    setNewAttribute({ key: '', value: '' });
    alert('Attribute updated successfully!');
  };

  const handleDeleteAttribute = async (attributeId: string) => {
    if (!confirm('Are you sure you want to delete this attribute?')) return;

    console.log('Deleting attribute:', attributeId);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setAttributes(prev => prev.filter(a => a.id !== attributeId));
    alert('Attribute deleted successfully!');
  };

  const handleAddLink = async () => {
    if (!newLink.username || !newLink.link) {
      alert('Please fill in all fields.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet.');
      return;
    }

    console.log('Adding link:', newLink);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const link: IdentityLink = {
      id: `link_${Date.now()}`,
      platform: newLink.platform,
      username: newLink.username,
      verified: false,
      link: newLink.link,
    };

    setLinks(prev => [...prev, link]);
    setIsLinkModalOpen(false);
    setNewLink({ platform: 'twitter', username: '', link: '' });
    alert('Link added successfully!');
  };

  const handleVerifyLink = async (linkId: string) => {
    console.log('Verifying link:', linkId);
    await new Promise(resolve => setTimeout(resolve, 2000));

    setLinks(prev => prev.map(l => 
      l.id === linkId 
        ? { ...l, verified: true, verifiedAt: new Date().toISOString() }
        : l
    ));

    alert('Link verified successfully!');
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    console.log('Deleting link:', linkId);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setLinks(prev => prev.filter(l => l.id !== linkId));
    alert('Link deleted successfully!');
  };

  const getPlatformIcon = (platform: IdentityLink['platform']) => {
    switch (platform) {
      case 'twitter':
        return '🐦';
      case 'github':
        return '💻';
      case 'discord':
        return '💬';
      case 'telegram':
        return '✈️';
      default:
        return '🔗';
    }
  };

  const getCredentialTypeBadge = (type: IdentityCredential['type']) => {
    const colors = {
      email: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      phone: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      social: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      kyc: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      reputation: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      custom: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return (
      <Badge className={colors[type]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to manage your on-chain identity.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-8 w-8 mr-3 text-primary" /> On-Chain Identity
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your decentralized identity and credentials
          </p>
        </div>
      </div>

      <Tabs defaultValue="attributes" className="w-full">
        <TabsList>
          <TabsTrigger value="attributes">Attributes ({attributes.length})</TabsTrigger>
          <TabsTrigger value="credentials">Credentials ({credentials.length})</TabsTrigger>
          <TabsTrigger value="links">Social Links ({links.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="attributes" className="space-y-4 mt-6">
          <div className="flex justify-end">
            <Button onClick={() => {
              setEditingAttribute(null);
              setNewAttribute({ key: '', value: '' });
              setIsAttributeModalOpen(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Attribute
            </Button>
          </div>
          {attributes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <User className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No attributes added yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {attributes.map(attribute => (
                <Card key={attribute.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold capitalize">{attribute.key}:</span>
                        {attribute.verified ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline">Unverified</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{attribute.value}</p>
                      {attribute.verified && attribute.verifiedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Verified {format(parseISO(attribute.verifiedAt), 'PP')} by {attribute.verifier?.slice(0, 10)}...
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAttribute(attribute)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAttribute(attribute.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4 mt-6">
          {credentials.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Key className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No credentials available yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {credentials.map(credential => (
                <Card key={credential.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getCredentialTypeBadge(credential.type)}
                          {credential.verified ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" /> Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline">Unverified</Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{credential.name}</CardTitle>
                        <CardDescription>{credential.value}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Issuer</p>
                        <p className="font-medium">{credential.issuer.slice(0, 10)}...</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Issued</p>
                        <p className="font-medium">{format(parseISO(credential.issuedAt), 'PP')}</p>
                      </div>
                    </div>
                    {credential.expiresAt && (
                      <div>
                        <p className="text-sm text-muted-foreground">Expires</p>
                        <p className="text-sm font-medium">{format(parseISO(credential.expiresAt), 'PP')}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Credential Hash</p>
                      <p className="text-sm font-mono">{credential.credentialHash}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="links" className="space-y-4 mt-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsLinkModalOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Link
            </Button>
          </div>
          {links.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Globe className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No social links added yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {links.map(link => (
                <Card key={link.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-2xl">{getPlatformIcon(link.platform)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold capitalize">{link.platform}</span>
                          {link.verified ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" /> Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline">Unverified</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{link.username}</p>
                        {link.verified && link.verifiedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Verified {format(parseISO(link.verifiedAt), 'PP')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!link.verified && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyLink(link.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Verify
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a href={link.link} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Attribute Modal */}
      <Dialog open={isAttributeModalOpen} onOpenChange={setIsAttributeModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingAttribute ? 'Edit Attribute' : 'Add Attribute'}</DialogTitle>
            <DialogDescription>Add or update an identity attribute</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="attr-key">Key *</Label>
              <Input
                id="attr-key"
                placeholder="name, bio, location, etc."
                value={newAttribute.key}
                onChange={(e) => setNewAttribute(prev => ({ ...prev, key: e.target.value }))}
                disabled={!!editingAttribute}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attr-value">Value *</Label>
              <Textarea
                id="attr-value"
                placeholder="Enter the value"
                rows={3}
                value={newAttribute.value}
                onChange={(e) => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={editingAttribute ? handleUpdateAttribute : handleAddAttribute}>
              {editingAttribute ? 'Update' : 'Add'} Attribute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Link Modal */}
      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Social Link</DialogTitle>
            <DialogDescription>Link your social media accounts</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-platform">Platform *</Label>
              <Select
                value={newLink.platform}
                onValueChange={(value: IdentityLink['platform']) => 
                  setNewLink(prev => ({ ...prev, platform: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="discord">Discord</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-username">Username *</Label>
              <Input
                id="link-username"
                placeholder="@username or username"
                value={newLink.username}
                onChange={(e) => setNewLink(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                placeholder="https://..."
                value={newLink.link}
                onChange={(e) => setNewLink(prev => ({ ...prev, link: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddLink}>Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnChainIdentity;

