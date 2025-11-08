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
import { FileText, Copyright, PlusCircle, CheckCircle, XCircle, Info, Download, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';

interface License {
  id: string;
  name: string;
  description: string;
  type: 'CC0' | 'CC-BY' | 'CC-BY-SA' | 'CC-BY-NC' | 'CC-BY-ND' | 'All Rights Reserved' | 'Custom';
  allowsCommercial: boolean;
  allowsDerivatives: boolean;
  requiresAttribution: boolean;
  shareAlike: boolean;
  customTerms?: string;
}

interface LicensedContent {
  id: string;
  title: string;
  contentId: string;
  licenseId: string;
  licenseName: string;
  owner: string;
  createdAt: string;
  usageCount: number;
  revenue: string;
}

interface LicenseRequest {
  id: string;
  requester: string;
  requesterUsername?: string;
  contentId: string;
  contentTitle: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
}

const availableLicenses: License[] = [
  {
    id: 'cc0',
    name: 'CC0 - Public Domain',
    description: 'Dedicate work to the public domain. No restrictions.',
    type: 'CC0',
    allowsCommercial: true,
    allowsDerivatives: true,
    requiresAttribution: false,
    shareAlike: false,
  },
  {
    id: 'cc-by',
    name: 'CC BY - Attribution',
    description: 'Others can use, remix, and distribute, even commercially, as long as credit is given.',
    type: 'CC-BY',
    allowsCommercial: true,
    allowsDerivatives: true,
    requiresAttribution: true,
    shareAlike: false,
  },
  {
    id: 'cc-by-sa',
    name: 'CC BY-SA - Share Alike',
    description: 'Others can remix and distribute, even commercially, but must credit and license under identical terms.',
    type: 'CC-BY-SA',
    allowsCommercial: true,
    allowsDerivatives: true,
    requiresAttribution: true,
    shareAlike: true,
  },
  {
    id: 'cc-by-nc',
    name: 'CC BY-NC - Non-Commercial',
    description: 'Others can remix and distribute, but only non-commercially and must credit.',
    type: 'CC-BY-NC',
    allowsCommercial: false,
    allowsDerivatives: true,
    requiresAttribution: true,
    shareAlike: false,
  },
  {
    id: 'cc-by-nd',
    name: 'CC BY-ND - No Derivatives',
    description: 'Others can use commercially, but cannot remix and must credit.',
    type: 'CC-BY-ND',
    allowsCommercial: true,
    allowsDerivatives: false,
    requiresAttribution: true,
    shareAlike: false,
  },
  {
    id: 'all-rights',
    name: 'All Rights Reserved',
    description: 'Full copyright protection. No use without explicit permission.',
    type: 'All Rights Reserved',
    allowsCommercial: false,
    allowsDerivatives: false,
    requiresAttribution: false,
    shareAlike: false,
  },
];

const mockLicensedContent: LicensedContent[] = [
  {
    id: 'licensed_001',
    title: 'Building on Base Guide',
    contentId: 'content_123',
    licenseId: 'cc-by',
    licenseName: 'CC BY - Attribution',
    owner: '0xYou',
    createdAt: '2024-07-15T10:00:00Z',
    usageCount: 12,
    revenue: '0.05',
  },
  {
    id: 'licensed_002',
    title: 'Web3 Tutorial Series',
    contentId: 'content_456',
    licenseId: 'cc-by-nc',
    licenseName: 'CC BY-NC - Non-Commercial',
    owner: '0xYou',
    createdAt: '2024-07-10T14:30:00Z',
    usageCount: 5,
    revenue: '0.02',
  },
];

const mockLicenseRequests: LicenseRequest[] = [
  {
    id: 'req_001',
    requester: '0xRequester1',
    requesterUsername: 'ContentCreator',
    contentId: 'content_123',
    contentTitle: 'Building on Base Guide',
    purpose: 'Educational use in my course',
    status: 'pending',
    requestedAt: '2024-07-22T10:00:00Z',
  },
  {
    id: 'req_002',
    requester: '0xRequester2',
    contentId: 'content_456',
    contentTitle: 'Web3 Tutorial Series',
    purpose: 'Commercial use in my platform',
    status: 'approved',
    requestedAt: '2024-07-20T14:00:00Z',
    respondedAt: '2024-07-21T10:00:00Z',
  },
];

const ContentLicensing: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [licensedContent, setLicensedContent] = useState<LicensedContent[]>(mockLicensedContent);
  const [licenseRequests, setLicenseRequests] = useState<LicenseRequest[]>(mockLicenseRequests);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [selectedLicense, setSelectedLicense] = useState<string>('');

  useEffect(() => {
    if (isConnected && address) {
      fetchLicensingData(address);
    }
  }, [address, isConnected]);

  const fetchLicensingData = async (userAddress: string) => {
    // In a real application, this would fetch from blockchain
    console.log(`Fetching licensing data for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleApplyLicense = async () => {
    if (!selectedContent || !selectedLicense) {
      alert('Please select content and license.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet.');
      return;
    }

    console.log(`Applying license ${selectedLicense} to content ${selectedContent}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const license = availableLicenses.find(l => l.id === selectedLicense);
    const newLicensedContent: LicensedContent = {
      id: `licensed_${Date.now()}`,
      title: `Content ${selectedContent}`,
      contentId: selectedContent,
      licenseId: selectedLicense,
      licenseName: license?.name || '',
      owner: address!,
      createdAt: new Date().toISOString(),
      usageCount: 0,
      revenue: '0',
    };

    setLicensedContent(prev => [newLicensedContent, ...prev]);
    setIsLicenseModalOpen(false);
    setSelectedContent('');
    setSelectedLicense('');
    alert('License applied successfully!');
  };

  const handleApproveRequest = async (requestId: string) => {
    console.log(`Approving license request ${requestId}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLicenseRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'approved' as LicenseRequest['status'], respondedAt: new Date().toISOString() }
        : req
    ));

    alert('License request approved!');
  };

  const handleRejectRequest = async (requestId: string) => {
    console.log(`Rejecting license request ${requestId}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLicenseRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected' as LicenseRequest['status'], respondedAt: new Date().toISOString() }
        : req
    ));

    alert('License request rejected.');
  };

  const getStatusBadge = (status: LicenseRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to manage content licensing.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Copyright className="h-8 w-8 mr-3 text-primary" /> Content Licensing
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage licenses and permissions for your content
          </p>
        </div>
        <Button onClick={() => setIsLicenseModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Apply License
        </Button>
      </div>

      <Tabs defaultValue="licenses" className="w-full">
        <TabsList>
          <TabsTrigger value="licenses">Licensed Content ({licensedContent.length})</TabsTrigger>
          <TabsTrigger value="requests">License Requests ({licenseRequests.filter(r => r.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="available">Available Licenses</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="space-y-4 mt-6">
          {licensedContent.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No licensed content yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {licensedContent.map(content => (
                <Card key={content.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{content.title}</CardTitle>
                        <CardDescription>
                          Licensed on {format(parseISO(content.createdAt), 'PP')}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{content.licenseName}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Usage Count</p>
                        <p className="text-2xl font-bold">{content.usageCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-bold text-green-600">{content.revenue} ETH</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Content ID</p>
                        <p className="text-sm font-mono">{content.contentId}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4 mt-6">
          {licenseRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No license requests yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {licenseRequests.map(request => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{request.contentTitle}</CardTitle>
                        <CardDescription>
                          Requested by {request.requesterUsername || request.requester.slice(0, 10) + '...'}
                        </CardDescription>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Purpose</p>
                        <p className="text-sm text-muted-foreground">{request.purpose}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Requested: {format(parseISO(request.requestedAt), 'PPp')}</span>
                        {request.respondedAt && (
                          <span>Responded: {format(parseISO(request.respondedAt), 'PPp')}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  {request.status === 'pending' && (
                    <CardFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" /> Reject
                      </Button>
                      <Button
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> Approve
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {availableLicenses.map(license => (
              <Card key={license.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{license.name}</CardTitle>
                  <CardDescription>{license.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Commercial Use:</span>
                      <Badge variant={license.allowsCommercial ? 'default' : 'secondary'}>
                        {license.allowsCommercial ? 'Allowed' : 'Not Allowed'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Derivatives:</span>
                      <Badge variant={license.allowsDerivatives ? 'default' : 'secondary'}>
                        {license.allowsDerivatives ? 'Allowed' : 'Not Allowed'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Attribution Required:</span>
                      <Badge variant={license.requiresAttribution ? 'default' : 'secondary'}>
                        {license.requiresAttribution ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    {license.shareAlike && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Share Alike:</span>
                        <Badge>Required</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Apply License Modal */}
      <Dialog open={isLicenseModalOpen} onOpenChange={setIsLicenseModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply License to Content</DialogTitle>
            <DialogDescription>Select content and choose a license</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content ID *</Label>
              <Input
                id="content"
                placeholder="content_123"
                value={selectedContent}
                onChange={(e) => setSelectedContent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License *</Label>
              <Select value={selectedLicense} onValueChange={setSelectedLicense}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a license" />
                </SelectTrigger>
                <SelectContent>
                  {availableLicenses.map(license => (
                    <SelectItem key={license.id} value={license.id}>
                      {license.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedLicense && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {availableLicenses.find(l => l.id === selectedLicense)?.description}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleApplyLicense} disabled={!selectedContent || !selectedLicense}>
              Apply License
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentLicensing;

