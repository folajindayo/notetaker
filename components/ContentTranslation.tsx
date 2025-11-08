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
import { Languages, Globe, CheckCircle, Clock, PlusCircle, Download, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';

interface Translation {
  id: string;
  contentId: string;
  contentTitle: string;
  sourceLanguage: string;
  targetLanguage: string;
  translatedText: string;
  translator: string;
  translatorUsername?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  qualityScore?: number;
  ipfsHash?: string;
}

interface TranslationRequest {
  id: string;
  contentId: string;
  contentTitle: string;
  sourceLanguage: string;
  targetLanguages: string[];
  requester: string;
  status: 'open' | 'in-progress' | 'completed';
  createdAt: string;
  translations: Translation[];
}

const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
];

const mockTranslationRequests: TranslationRequest[] = [
  {
    id: 'req_001',
    contentId: 'content_123',
    contentTitle: 'Building on Base Guide',
    sourceLanguage: 'en',
    targetLanguages: ['es', 'fr', 'de'],
    requester: '0xYou',
    status: 'in-progress',
    createdAt: '2024-07-20T10:00:00Z',
    translations: [
      {
        id: 'trans_001',
        contentId: 'content_123',
        contentTitle: 'Building on Base Guide',
        sourceLanguage: 'en',
        targetLanguage: 'es',
        translatedText: 'Guía para construir en Base...',
        translator: '0xTranslator1',
        translatorUsername: 'SpanishTranslator',
        status: 'approved',
        createdAt: '2024-07-21T14:00:00Z',
        approvedAt: '2024-07-22T10:00:00Z',
        qualityScore: 95,
        ipfsHash: 'QmHash123...',
      },
      {
        id: 'trans_002',
        contentId: 'content_123',
        contentTitle: 'Building on Base Guide',
        sourceLanguage: 'en',
        targetLanguage: 'fr',
        translatedText: 'Guide pour construire sur Base...',
        translator: '0xTranslator2',
        translatorUsername: 'FrenchExpert',
        status: 'pending',
        createdAt: '2024-07-22T09:00:00Z',
      },
    ],
  },
];

const mockAvailableTranslations: Translation[] = [
  {
    id: 'trans_003',
    contentId: 'content_456',
    contentTitle: 'Web3 Tutorial',
    sourceLanguage: 'en',
    targetLanguage: 'es',
    translatedText: 'Tutorial de Web3...',
    translator: '0xTranslator3',
    translatorUsername: 'Web3Spanish',
    status: 'approved',
    createdAt: '2024-07-19T12:00:00Z',
    approvedAt: '2024-07-20T08:00:00Z',
    qualityScore: 92,
    ipfsHash: 'QmHash456...',
  },
];

const ContentTranslation: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [translationRequests, setTranslationRequests] = useState<TranslationRequest[]>(mockTranslationRequests);
  const [availableTranslations, setAvailableTranslations] = useState<Translation[]>(mockAvailableTranslations);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    contentId: '',
    contentTitle: '',
    sourceLanguage: 'en',
    targetLanguages: [] as string[],
  });
  const [newTranslation, setNewTranslation] = useState({
    contentId: '',
    targetLanguage: '',
    translatedText: '',
  });

  useEffect(() => {
    if (isConnected && address) {
      fetchTranslationData(address);
    }
  }, [address, isConnected]);

  const fetchTranslationData = async (userAddress: string) => {
    // In a real application, this would fetch from IPFS or blockchain
    console.log(`Fetching translation data for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleRequestTranslation = async () => {
    if (!newRequest.contentId || newRequest.targetLanguages.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet.');
      return;
    }

    console.log('Requesting translation:', newRequest);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const request: TranslationRequest = {
      id: `req_${Date.now()}`,
      contentId: newRequest.contentId,
      contentTitle: newRequest.contentTitle,
      sourceLanguage: newRequest.sourceLanguage,
      targetLanguages: newRequest.targetLanguages,
      requester: address!,
      status: 'open',
      createdAt: new Date().toISOString(),
      translations: [],
    };

    setTranslationRequests(prev => [request, ...prev]);
    setIsRequestModalOpen(false);
    setNewRequest({ contentId: '', contentTitle: '', sourceLanguage: 'en', targetLanguages: [] });
    alert('Translation request submitted!');
  };

  const handleSubmitTranslation = async () => {
    if (!newTranslation.contentId || !newTranslation.targetLanguage || !newTranslation.translatedText) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet.');
      return;
    }

    console.log('Submitting translation:', newTranslation);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const translation: Translation = {
      id: `trans_${Date.now()}`,
      contentId: newTranslation.contentId,
      contentTitle: 'Content Title',
      sourceLanguage: 'en',
      targetLanguage: newTranslation.targetLanguage,
      translatedText: newTranslation.translatedText,
      translator: address!,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setAvailableTranslations(prev => [translation, ...prev]);
    setIsTranslateModalOpen(false);
    setNewTranslation({ contentId: '', targetLanguage: '', translatedText: '' });
    alert('Translation submitted for review!');
  };

  const handleApproveTranslation = async (translationId: string) => {
    console.log(`Approving translation ${translationId}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setAvailableTranslations(prev => prev.map(t => 
      t.id === translationId 
        ? { ...t, status: 'approved' as Translation['status'], approvedAt: new Date().toISOString(), qualityScore: 90 }
        : t
    ));

    alert('Translation approved!');
  };

  const getStatusBadge = (status: Translation['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getLanguageName = (code: string) => {
    return availableLanguages.find(l => l.code === code)?.name || code.toUpperCase();
  };

  const getLanguageFlag = (code: string) => {
    return availableLanguages.find(l => l.code === code)?.flag || '🌐';
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to manage content translations.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Languages className="h-8 w-8 mr-3 text-primary" /> Content Translation
          </h1>
          <p className="text-muted-foreground mt-1">
            Translate content to reach a global audience
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsTranslateModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" /> Submit Translation
          </Button>
          <Button onClick={() => setIsRequestModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" /> Request Translation
          </Button>
        </div>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList>
          <TabsTrigger value="requests">Translation Requests ({translationRequests.length})</TabsTrigger>
          <TabsTrigger value="available">Available Translations ({availableTranslations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4 mt-6">
          {translationRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Globe className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No translation requests yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {translationRequests.map(request => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{request.contentTitle}</CardTitle>
                        <CardDescription>
                          Content ID: {request.contentId} | Source: {getLanguageFlag(request.sourceLanguage)} {getLanguageName(request.sourceLanguage)}
                        </CardDescription>
                      </div>
                      <Badge variant={request.status === 'completed' ? 'default' : 'outline'}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Target Languages:</p>
                      <div className="flex flex-wrap gap-2">
                        {request.targetLanguages.map(lang => (
                          <Badge key={lang} variant="outline">
                            {getLanguageFlag(lang)} {getLanguageName(lang)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {request.translations.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Translations:</p>
                        <div className="space-y-2">
                          {request.translations.map(translation => (
                            <Card key={translation.id} className="p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">
                                      {getLanguageFlag(translation.targetLanguage)} {getLanguageName(translation.targetLanguage)}
                                    </Badge>
                                    {getStatusBadge(translation.status)}
                                    {translation.qualityScore && (
                                      <Badge variant="secondary">Quality: {translation.qualityScore}%</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    By {translation.translatorUsername || translation.translator.slice(0, 10) + '...'}
                                  </p>
                                  <p className="text-sm line-clamp-2">{translation.translatedText}</p>
                                </div>
                                {translation.status === 'pending' && address === request.requester && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveTranslation(translation.id)}
                                  >
                                    Approve
                                  </Button>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Requested {format(parseISO(request.createdAt), 'PP')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4 mt-6">
          {availableTranslations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Languages className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No translations available yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {availableTranslations.map(translation => (
                <Card key={translation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{translation.contentTitle}</CardTitle>
                        <CardDescription>
                          {getLanguageFlag(translation.sourceLanguage)} {getLanguageName(translation.sourceLanguage)} → {getLanguageFlag(translation.targetLanguage)} {getLanguageName(translation.targetLanguage)}
                        </CardDescription>
                      </div>
                      {getStatusBadge(translation.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Translated by</p>
                      <p className="font-medium">{translation.translatorUsername || translation.translator}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Translation</p>
                      <p className="text-sm">{translation.translatedText}</p>
                    </div>
                    {translation.qualityScore && (
                      <div>
                        <p className="text-sm text-muted-foreground">Quality Score</p>
                        <p className="text-lg font-bold">{translation.qualityScore}%</p>
                      </div>
                    )}
                    {translation.ipfsHash && (
                      <div>
                        <p className="text-sm text-muted-foreground">IPFS Hash</p>
                        <p className="text-sm font-mono">{translation.ipfsHash}</p>
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Created {format(parseISO(translation.createdAt), 'PP')}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" /> Download Translation
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Request Translation Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Translation</DialogTitle>
            <DialogDescription>Request translations for your content</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="req-contentId">Content ID *</Label>
              <Input
                id="req-contentId"
                placeholder="content_123"
                value={newRequest.contentId}
                onChange={(e) => setNewRequest(prev => ({ ...prev, contentId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-contentTitle">Content Title</Label>
              <Input
                id="req-contentTitle"
                placeholder="Title of your content"
                value={newRequest.contentTitle}
                onChange={(e) => setNewRequest(prev => ({ ...prev, contentTitle: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-sourceLanguage">Source Language</Label>
              <Select
                value={newRequest.sourceLanguage}
                onValueChange={(value) => setNewRequest(prev => ({ ...prev, sourceLanguage: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Languages *</Label>
              <div className="grid grid-cols-3 gap-2">
                {availableLanguages.filter(l => l.code !== newRequest.sourceLanguage).map(lang => (
                  <Button
                    key={lang.code}
                    type="button"
                    variant={newRequest.targetLanguages.includes(lang.code) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setNewRequest(prev => ({
                        ...prev,
                        targetLanguages: prev.targetLanguages.includes(lang.code)
                          ? prev.targetLanguages.filter(l => l !== lang.code)
                          : [...prev.targetLanguages, lang.code],
                      }));
                    }}
                  >
                    {lang.flag} {lang.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleRequestTranslation} disabled={newRequest.targetLanguages.length === 0}>
              Request Translation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Translation Modal */}
      <Dialog open={isTranslateModalOpen} onOpenChange={setIsTranslateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Translation</DialogTitle>
            <DialogDescription>Contribute a translation for content</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trans-contentId">Content ID *</Label>
              <Input
                id="trans-contentId"
                placeholder="content_123"
                value={newTranslation.contentId}
                onChange={(e) => setNewTranslation(prev => ({ ...prev, contentId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trans-targetLanguage">Target Language *</Label>
              <Select
                value={newTranslation.targetLanguage}
                onValueChange={(value) => setNewTranslation(prev => ({ ...prev, targetLanguage: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trans-text">Translation *</Label>
              <Textarea
                id="trans-text"
                placeholder="Enter your translation here..."
                rows={8}
                value={newTranslation.translatedText}
                onChange={(e) => setNewTranslation(prev => ({ ...prev, translatedText: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitTranslation} disabled={!newTranslation.contentId || !newTranslation.targetLanguage || !newTranslation.translatedText}>
              Submit Translation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentTranslation;

