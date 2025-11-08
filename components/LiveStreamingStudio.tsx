import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Video, Radio, Users, DollarSign, Settings, MessageSquare, Eye, Heart, Send, Zap, Clock, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { format, parseISO } from 'date-fns';

interface LiveStream {
  id: string;
  title: string;
  description: string;
  streamer: string;
  streamerAvatar?: string;
  status: 'live' | 'scheduled' | 'ended';
  viewers: number;
  likes: number;
  startTime: string;
  endTime?: string;
  thumbnail?: string;
  category: 'gaming' | 'education' | 'web3' | 'music' | 'talk' | 'other';
  tokenGated: boolean;
  requiredToken?: string;
  minimumAmount?: string;
  recordingAvailable: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
  isSuperChat: boolean;
  tipAmount?: string;
}

interface StreamSettings {
  title: string;
  description: string;
  category: string;
  tokenGated: boolean;
  requiredToken: string;
  minimumAmount: string;
  enableChat: boolean;
  enableTips: boolean;
  recordStream: boolean;
  quality: '720p' | '1080p' | '4K';
}

const mockLiveStreams: LiveStream[] = [
  {
    id: 'stream_001',
    title: 'Building on Base: Smart Contract Workshop',
    description: 'Learn how to deploy and optimize smart contracts on Base L2',
    streamer: '0xAlice',
    streamerAvatar: 'https://picsum.photos/seed/alice/100/100',
    status: 'live',
    viewers: 1250,
    likes: 342,
    startTime: '2024-07-22T14:00:00Z',
    thumbnail: 'https://picsum.photos/seed/stream1/640/360',
    category: 'education',
    tokenGated: false,
    recordingAvailable: true,
  },
  {
    id: 'stream_002',
    title: 'Web3 Gaming Tournament - Final Round',
    description: 'Watch the best players compete for NFT prizes',
    streamer: '0xBob',
    streamerAvatar: 'https://picsum.photos/seed/bob/100/100',
    status: 'live',
    viewers: 3420,
    likes: 1205,
    startTime: '2024-07-22T13:30:00Z',
    thumbnail: 'https://picsum.photos/seed/stream2/640/360',
    category: 'gaming',
    tokenGated: true,
    requiredToken: 'GAME',
    minimumAmount: '100',
    recordingAvailable: true,
  },
  {
    id: 'stream_003',
    title: 'DAO Town Hall - Community Q&A',
    description: 'Monthly community update and open discussion',
    streamer: '0xCharlie',
    streamerAvatar: 'https://picsum.photos/seed/charlie/100/100',
    status: 'scheduled',
    viewers: 0,
    likes: 0,
    startTime: '2024-07-23T18:00:00Z',
    thumbnail: 'https://picsum.photos/seed/stream3/640/360',
    category: 'web3',
    tokenGated: false,
    recordingAvailable: true,
  },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg_001',
    sender: '0xViewer1',
    message: 'Great content! Thanks for the tutorial!',
    timestamp: '2024-07-22T14:15:00Z',
    isSuperChat: false,
  },
  {
    id: 'msg_002',
    sender: '0xViewer2',
    senderAvatar: 'https://picsum.photos/seed/viewer2/100/100',
    message: 'This is exactly what I needed to learn!',
    timestamp: '2024-07-22T14:16:00Z',
    isSuperChat: true,
    tipAmount: '0.01 ETH',
  },
  {
    id: 'msg_003',
    sender: '0xViewer3',
    message: 'Can you explain the gas optimization part again?',
    timestamp: '2024-07-22T14:17:00Z',
    isSuperChat: false,
  },
];

const LiveStreamingStudio: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [streams, setStreams] = useState<LiveStream[]>(mockLiveStreams);
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamSettings, setStreamSettings] = useState<StreamSettings>({
    title: '',
    description: '',
    category: 'web3',
    tokenGated: false,
    requiredToken: 'NOTE',
    minimumAmount: '100',
    enableChat: true,
    enableTips: true,
    recordStream: true,
    quality: '1080p',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedStream) {
      // Simulate real-time viewer updates
      const interval = setInterval(() => {
        setStreams(prev => prev.map(s => 
          s.id === selectedStream.id && s.status === 'live'
            ? { ...s, viewers: s.viewers + Math.floor(Math.random() * 10) - 3 }
            : s
        ));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedStream]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStreamClick = (stream: LiveStream) => {
    setSelectedStream(stream);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedStream) return;
    if (!isConnected) {
      alert('Please connect your wallet to chat.');
      return;
    }

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: address!,
      message: newMessage,
      timestamp: new Date().toISOString(),
      isSuperChat: false,
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleStartStream = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to start streaming.');
      return;
    }
    if (!streamSettings.title || !streamSettings.description) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsStreaming(true);
    console.log('Starting stream with settings:', streamSettings);

    try {
      // In a real application, this would involve:
      // 1. Initialize WebRTC connection
      // 2. Connect to streaming server (Livepeer, dLive, etc.)
      // 3. Start broadcasting video/audio
      // 4. Register stream metadata on-chain
      // 5. Enable token gating if configured
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newStream: LiveStream = {
        id: `stream_${Date.now()}`,
        title: streamSettings.title,
        description: streamSettings.description,
        streamer: address!,
        status: 'live',
        viewers: 0,
        likes: 0,
        startTime: new Date().toISOString(),
        thumbnail: `https://picsum.photos/seed/${Date.now()}/640/360`,
        category: streamSettings.category as LiveStream['category'],
        tokenGated: streamSettings.tokenGated,
        requiredToken: streamSettings.tokenGated ? streamSettings.requiredToken : undefined,
        minimumAmount: streamSettings.tokenGated ? streamSettings.minimumAmount : undefined,
        recordingAvailable: streamSettings.recordStream,
      };

      setStreams(prev => [newStream, ...prev]);
      setSelectedStream(newStream);
      setIsCreateModalOpen(false);
      alert('Stream started successfully! You are now live.');
    } catch (error) {
      console.error('Failed to start stream:', error);
      alert('Failed to start stream. Please try again.');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleLikeStream = (streamId: string) => {
    setStreams(prev => prev.map(s => 
      s.id === streamId ? { ...s, likes: s.likes + 1 } : s
    ));
  };

  const getStatusBadge = (status: LiveStream['status']) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500 text-white animate-pulse"><Radio className="h-3 w-3 mr-1" />LIVE</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"><Clock className="h-3 w-3 mr-1" />Scheduled</Badge>;
      case 'ended':
        return <Badge variant="secondary">Ended</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: LiveStream['category']) => {
    return <Badge variant="outline" className="capitalize">{category}</Badge>;
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to watch streams or start broadcasting.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Video className="h-8 w-8 mr-3 text-primary" /> Live Streaming Studio
          </h1>
          <p className="text-muted-foreground mt-1">
            Stream and watch Web3 content with token-gated access
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Radio className="h-4 w-4 mr-2" /> Go Live
        </Button>
      </div>

      <Tabs defaultValue="discover" className="w-full">
        <TabsList>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="myStreams">My Streams</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6 mt-6">
          {selectedStream ? (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
                      {selectedStream.thumbnail ? (
                        <img src={selectedStream.thumbnail} alt={selectedStream.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video className="h-24 w-24 text-muted-foreground" />
                        </div>
                      )}
                      {selectedStream.status === 'live' && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-red-500 text-white">
                            <Radio className="h-3 w-3 mr-1 animate-pulse" />
                            LIVE
                          </Badge>
                        </div>
                      )}
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <Badge className="bg-black/70 text-white">
                          <Eye className="h-3 w-3 mr-1" />
                          {selectedStream.viewers.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedStream.title}</h2>
                        <p className="text-muted-foreground mt-2">{selectedStream.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src={selectedStream.streamerAvatar} />
                              <AvatarFallback>{selectedStream.streamer.slice(2, 4).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedStream.streamer.slice(0, 10)}...</p>
                              <p className="text-sm text-muted-foreground">Streamer</p>
                            </div>
                          </div>
                          {getCategoryBadge(selectedStream.category)}
                          {selectedStream.tokenGated && (
                            <Badge variant="outline" className="text-yellow-600">
                              🔒 Token Gated
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => handleLikeStream(selectedStream.id)}
                          className="flex items-center gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          {selectedStream.likes}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button variant="outline" onClick={() => setSelectedStream(null)}>
                  ← Back to Streams
                </Button>
              </div>

              {/* Live Chat */}
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4">
                    {chatMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`${msg.isSuperChat ? 'bg-yellow-100 dark:bg-yellow-950 p-3 rounded-lg' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={msg.senderAvatar} />
                            <AvatarFallback className="text-xs">
                              {msg.sender.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">
                                {msg.sender.slice(0, 10)}...
                              </p>
                              {msg.isSuperChat && (
                                <Badge className="bg-yellow-500 text-white text-xs">
                                  <Zap className="h-2 w-2 mr-1" />
                                  {msg.tipAmount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(msg.timestamp), 'p')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <CardFooter className="border-t pt-4">
                  <div className="flex gap-2 w-full">
                    <Input
                      placeholder="Send a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {streams.map(stream => (
                <Card
                  key={stream.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleStreamClick(stream)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-muted">
                      {stream.thumbnail && (
                        <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-2 left-2">
                        {getStatusBadge(stream.status)}
                      </div>
                      {stream.status === 'live' && (
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-black/70 text-white">
                            <Eye className="h-3 w-3 mr-1" />
                            {stream.viewers.toLocaleString()}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={stream.streamerAvatar} />
                          <AvatarFallback>{stream.streamer.slice(2, 4).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold line-clamp-2">{stream.title}</h3>
                          <p className="text-sm text-muted-foreground">{stream.streamer.slice(0, 10)}...</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getCategoryBadge(stream.category)}
                        {stream.tokenGated && <Badge variant="outline">🔒</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="following" className="mt-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No streams from people you follow.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="myStreams" className="mt-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Video className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">You haven't streamed yet.</p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4">
                <Radio className="h-4 w-4 mr-2" /> Start Your First Stream
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Stream Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Start Live Stream</DialogTitle>
            <DialogDescription>Configure your stream settings before going live</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Stream Title *</Label>
              <Input
                id="title"
                value={streamSettings.title}
                onChange={(e) => setStreamSettings(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter an engaging title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={streamSettings.description}
                onChange={(e) => setStreamSettings(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what your stream is about"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={streamSettings.category}
                onValueChange={(value) => setStreamSettings(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="web3">Web3</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="talk">Talk Show</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Token Gating</Label>
                <p className="text-sm text-muted-foreground">Require viewers to hold tokens</p>
              </div>
              <Switch
                checked={streamSettings.tokenGated}
                onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, tokenGated: checked }))}
              />
            </div>
            {streamSettings.tokenGated && (
              <div className="grid grid-cols-2 gap-4 pl-4 border-l-2">
                <div className="space-y-2">
                  <Label htmlFor="requiredToken">Required Token</Label>
                  <Select
                    value={streamSettings.requiredToken}
                    onValueChange={(value) => setStreamSettings(prev => ({ ...prev, requiredToken: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOTE">NOTE Token</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumAmount">Minimum Amount</Label>
                  <Input
                    id="minimumAmount"
                    type="number"
                    value={streamSettings.minimumAmount}
                    onChange={(e) => setStreamSettings(prev => ({ ...prev, minimumAmount: e.target.value }))}
                  />
                </div>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Chat</Label>
                <p className="text-sm text-muted-foreground">Allow viewers to chat</p>
              </div>
              <Switch
                checked={streamSettings.enableChat}
                onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, enableChat: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Tips</Label>
                <p className="text-sm text-muted-foreground">Allow viewers to tip with crypto</p>
              </div>
              <Switch
                checked={streamSettings.enableTips}
                onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, enableTips: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Record Stream</Label>
                <p className="text-sm text-muted-foreground">Save recording for later viewing</p>
              </div>
              <Switch
                checked={streamSettings.recordStream}
                onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, recordStream: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleStartStream} disabled={isStreaming}>
              {isStreaming ? 'Starting...' : 'Go Live'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveStreamingStudio;

