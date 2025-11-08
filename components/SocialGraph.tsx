import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Network, Users, UserPlus, Search, TrendingUp, Info, Link2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface Connection {
  id: string;
  address: string;
  username?: string;
  avatar?: string;
  type: 'follower' | 'following' | 'mutual';
  mutualConnections: number;
  joinedAt: string;
  reputation: number;
  verified: boolean;
}

interface GraphNode {
  id: string;
  address: string;
  username?: string;
  avatar?: string;
  x: number;
  y: number;
  connections: string[];
  type: 'user' | 'influencer' | 'community';
}

const mockConnections: Connection[] = [
  {
    id: 'conn_001',
    address: '0xAlice',
    username: 'Alice',
    avatar: 'https://picsum.photos/seed/alice/100/100',
    type: 'mutual',
    mutualConnections: 15,
    joinedAt: '2024-01-15T10:00:00Z',
    reputation: 850,
    verified: true,
  },
  {
    id: 'conn_002',
    address: '0xBob',
    username: 'Bob',
    avatar: 'https://picsum.photos/seed/bob/100/100',
    type: 'following',
    mutualConnections: 8,
    joinedAt: '2024-02-20T14:30:00Z',
    reputation: 650,
    verified: false,
  },
  {
    id: 'conn_003',
    address: '0xCharlie',
    username: 'Charlie',
    type: 'follower',
    mutualConnections: 3,
    joinedAt: '2024-03-10T09:00:00Z',
    reputation: 420,
    verified: false,
  },
];

const SocialGraph: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [graphView, setGraphView] = useState<'list' | 'network'>('list');

  useEffect(() => {
    if (isConnected && address) {
      fetchSocialGraph(address);
    }
  }, [address, isConnected]);

  const fetchSocialGraph = async (userAddress: string) => {
    // In a real application, this would fetch social connections from blockchain
    console.log(`Fetching social graph for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleFollow = async (connectionId: string) => {
    console.log(`Following connection ${connectionId}...`);
    // In a real app: call follow function
    await new Promise(resolve => setTimeout(resolve, 1000));
    setConnections(prev => prev.map(c => 
      c.id === connectionId ? { ...c, type: 'following' as Connection['type'] } : c
    ));
    alert('Now following this user!');
  };

  const filteredConnections = connections.filter(conn => {
    if (filterType !== 'all' && conn.type !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        conn.username?.toLowerCase().includes(query) ||
        conn.address.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getTypeBadge = (type: Connection['type']) => {
    switch (type) {
      case 'mutual':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Mutual</Badge>;
      case 'following':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Following</Badge>;
      case 'follower':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Follower</Badge>;
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to view your social graph.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Network className="h-8 w-8 mr-3 text-primary" /> Social Graph
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore and manage your social connections
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={graphView === 'list' ? 'default' : 'outline'}
            onClick={() => setGraphView('list')}
          >
            List View
          </Button>
          <Button
            variant={graphView === 'network' ? 'default' : 'outline'}
            onClick={() => setGraphView('network')}
          >
            Network View
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {connections.filter(c => c.type === 'follower' || c.type === 'mutual').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Following</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {connections.filter(c => c.type === 'following' || c.type === 'mutual').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mutual</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {connections.filter(c => c.type === 'mutual').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Connections</SelectItem>
                <SelectItem value="follower">Followers</SelectItem>
                <SelectItem value="following">Following</SelectItem>
                <SelectItem value="mutual">Mutual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Connections List */}
      {graphView === 'list' ? (
        <Card>
          <CardHeader>
            <CardTitle>Connections</CardTitle>
            <CardDescription>{filteredConnections.length} connections found</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredConnections.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No connections found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredConnections.map(conn => (
                  <div
                    key={conn.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => setSelectedConnection(conn)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={conn.avatar} />
                        <AvatarFallback>
                          {conn.username?.[0] || conn.address.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            {conn.username || conn.address.slice(0, 10) + '...'}
                          </p>
                          {conn.verified && (
                            <Badge className="bg-blue-500 text-white text-xs">Verified</Badge>
                          )}
                          {getTypeBadge(conn.type)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{conn.mutualConnections} mutual connections</span>
                          <span>Reputation: {conn.reputation}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {conn.type === 'follower' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollow(conn.id);
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-2" /> Follow Back
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Network Visualization</CardTitle>
            <CardDescription>Interactive network graph of your connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Network className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Network visualization coming soon</p>
                <p className="text-sm mt-2">This will show an interactive graph of your social connections</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Detail Modal */}
      {selectedConnection && (
        <Dialog open={!!selectedConnection} onOpenChange={() => setSelectedConnection(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedConnection.avatar} />
                  <AvatarFallback>
                    {selectedConnection.username?.[0] || selectedConnection.address.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedConnection.username || selectedConnection.address.slice(0, 10) + '...'}
                    {selectedConnection.verified && (
                      <Badge className="bg-blue-500 text-white">Verified</Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription>{selectedConnection.address}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Reputation</p>
                  <p className="text-2xl font-bold">{selectedConnection.reputation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mutual Connections</p>
                  <p className="text-2xl font-bold">{selectedConnection.mutualConnections}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Connection Type</p>
                <div className="mt-1">{getTypeBadge(selectedConnection.type)}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SocialGraph;
