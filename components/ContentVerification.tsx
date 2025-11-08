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
import { Shield, CheckCircle, XCircle, Clock, FileText, PlusCircle, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';

interface VerificationRequest {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: 'text' | 'image' | 'video' | 'document';
  contentHash: string;
  requester: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  certificateUrl?: string;
  rejectionReason?: string;
}

interface VerificationCertificate {
  id: string;
  contentId: string;
  contentTitle: string;
  contentHash: string;
  verifiedAt: string;
  verifiedBy: string;
  certificateUrl: string;
  blockchainTx: string;
  validUntil?: string;
}

const mockVerificationRequests: VerificationRequest[] = [
  {
    id: 'verify_001',
    contentId: 'content_123',
    contentTitle: 'Building on Base Guide',
    contentType: 'text',
    contentHash: '0xabc123...',
    requester: '0xYou',
    status: 'verified',
    submittedAt: '2024-07-20T10:00:00Z',
    verifiedAt: '2024-07-21T14:30:00Z',
    verifiedBy: '0xVerifier',
    certificateUrl: 'https://ipfs.io/ipfs/cert_001',
  },
  {
    id: 'verify_002',
    contentId: 'content_456',
    contentTitle: 'Web3 Tutorial Video',
    contentType: 'video',
    contentHash: '0xdef456...',
    requester: '0xYou',
    status: 'pending',
    submittedAt: '2024-07-22T09:00:00Z',
  },
];

const mockCertificates: VerificationCertificate[] = [
  {
    id: 'cert_001',
    contentId: 'content_123',
    contentTitle: 'Building on Base Guide',
    contentHash: '0xabc123...',
    verifiedAt: '2024-07-21T14:30:00Z',
    verifiedBy: '0xVerifier',
    certificateUrl: 'https://ipfs.io/ipfs/cert_001',
    blockchainTx: '0xtx123...',
  },
];

const ContentVerification: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [requests, setRequests] = useState<VerificationRequest[]>(mockVerificationRequests);
  const [certificates, setCertificates] = useState<VerificationCertificate[]>(mockCertificates);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    contentId: '',
    contentTitle: '',
    contentType: 'text' as VerificationRequest['contentType'],
    contentHash: '',
  });

  useEffect(() => {
    if (isConnected && address) {
      fetchVerificationData(address);
    }
  }, [address, isConnected]);

  const fetchVerificationData = async (userAddress: string) => {
    // In a real application, this would fetch from blockchain
    console.log(`Fetching verification data for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleRequestVerification = async () => {
    if (!newRequest.contentId || !newRequest.contentHash) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet.');
      return;
    }

    console.log('Requesting verification:', newRequest);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const request: VerificationRequest = {
      id: `verify_${Date.now()}`,
      contentId: newRequest.contentId,
      contentTitle: newRequest.contentTitle,
      contentType: newRequest.contentType,
      contentHash: newRequest.contentHash,
      requester: address!,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    setRequests(prev => [request, ...prev]);
    setIsRequestModalOpen(false);
    setNewRequest({ contentId: '', contentTitle: '', contentType: 'text', contentHash: '' });
    alert('Verification request submitted!');
  };

  const getStatusBadge = (status: VerificationRequest['status']) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to verify content authenticity.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-8 w-8 mr-3 text-primary" /> Content Verification
          </h1>
          <p className="text-muted-foreground mt-1">
            Verify content authenticity and get blockchain certificates
          </p>
        </div>
        <Button onClick={() => setIsRequestModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Request Verification
        </Button>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList>
          <TabsTrigger value="requests">Verification Requests ({requests.length})</TabsTrigger>
          <TabsTrigger value="certificates">Certificates ({certificates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4 mt-6">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No verification requests yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map(request => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(request.status)}
                          <Badge variant="outline" className="capitalize">{request.contentType}</Badge>
                        </div>
                        <CardTitle className="text-lg">{request.contentTitle}</CardTitle>
                        <CardDescription>
                          Content ID: {request.contentId}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Content Hash</p>
                      <p className="text-sm font-mono">{request.contentHash}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Submitted</p>
                        <p className="font-medium">{format(parseISO(request.submittedAt), 'PPp')}</p>
                      </div>
                      {request.verifiedAt && (
                        <div>
                          <p className="text-muted-foreground">Verified</p>
                          <p className="font-medium">{format(parseISO(request.verifiedAt), 'PPp')}</p>
                        </div>
                      )}
                    </div>
                    {request.rejectionReason && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{request.rejectionReason}</AlertDescription>
                      </Alert>
                    )}
                    {request.certificateUrl && (
                      <Alert className="bg-green-50 dark:bg-green-950">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-300">
                          Certificate available: <a href={request.certificateUrl} target="_blank" rel="noopener noreferrer" className="underline">View Certificate</a>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4 mt-6">
          {certificates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No verification certificates yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {certificates.map(cert => (
                <Card key={cert.id} className="border-green-500">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-lg">Verified Certificate</CardTitle>
                    </div>
                    <CardDescription>{cert.contentTitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Content Hash</p>
                      <p className="text-sm font-mono">{cert.contentHash}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Verified At</p>
                        <p className="font-medium">{format(parseISO(cert.verifiedAt), 'PPp')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Verified By</p>
                        <p className="font-medium">{cert.verifiedBy.slice(0, 10)}...</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Blockchain Transaction</p>
                      <p className="text-sm font-mono">{cert.blockchainTx}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" /> View Certificate
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Request Verification Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Content Verification</DialogTitle>
            <DialogDescription>Verify your content authenticity on the blockchain</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contentId">Content ID *</Label>
              <Input
                id="contentId"
                placeholder="content_123"
                value={newRequest.contentId}
                onChange={(e) => setNewRequest(prev => ({ ...prev, contentId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contentTitle">Content Title</Label>
              <Input
                id="contentTitle"
                placeholder="Title of your content"
                value={newRequest.contentTitle}
                onChange={(e) => setNewRequest(prev => ({ ...prev, contentTitle: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={newRequest.contentType}
                onValueChange={(value: VerificationRequest['contentType']) => 
                  setNewRequest(prev => ({ ...prev, contentType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contentHash">Content Hash *</Label>
              <Input
                id="contentHash"
                placeholder="0x..."
                value={newRequest.contentHash}
                onChange={(e) => setNewRequest(prev => ({ ...prev, contentHash: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Hash of your content (IPFS hash or content hash)
              </p>
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Verification ensures content authenticity and creates an immutable record on the blockchain.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={handleRequestVerification}>Request Verification</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentVerification;

