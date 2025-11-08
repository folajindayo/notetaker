import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Bell, CheckCircle, XCircle, Settings, Heart, MessageSquare, Users, DollarSign, Award, Info, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { format, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'reward' | 'achievement' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  sender?: {
    address: string;
    username?: string;
    avatar?: string;
  };
  metadata?: {
    amount?: string;
    token?: string;
    achievementName?: string;
  };
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  types: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    rewards: boolean;
    achievements: boolean;
    system: boolean;
  };
}

const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'like',
    title: 'New Like',
    message: 'Alice liked your post "Building on Base"',
    timestamp: '2024-07-22T16:30:00Z',
    read: false,
    actionUrl: '/post/123',
    sender: {
      address: '0xAlice',
      username: 'Alice',
      avatar: 'https://picsum.photos/seed/alice/100/100',
    },
  },
  {
    id: 'notif_002',
    type: 'comment',
    title: 'New Comment',
    message: 'Bob commented on your post: "Great insights!"',
    timestamp: '2024-07-22T15:45:00Z',
    read: false,
    actionUrl: '/post/123',
    sender: {
      address: '0xBob',
      username: 'Bob',
      avatar: 'https://picsum.photos/seed/bob/100/100',
    },
  },
  {
    id: 'notif_003',
    type: 'follow',
    title: 'New Follower',
    message: 'Charlie started following you',
    timestamp: '2024-07-22T14:20:00Z',
    read: true,
    actionUrl: '/profile/0xCharlie',
    sender: {
      address: '0xCharlie',
      username: 'Charlie',
    },
  },
  {
    id: 'notif_004',
    type: 'reward',
    title: 'Reward Received',
    message: 'You earned 0.05 ETH from staking rewards',
    timestamp: '2024-07-22T12:00:00Z',
    read: false,
    metadata: {
      amount: '0.05',
      token: 'ETH',
    },
  },
  {
    id: 'notif_005',
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'You unlocked the "Content Creator" badge!',
    timestamp: '2024-07-21T10:00:00Z',
    read: true,
    metadata: {
      achievementName: 'Content Creator',
    },
  },
  {
    id: 'notif_006',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Dave mentioned you in a post',
    timestamp: '2024-07-21T09:30:00Z',
    read: true,
    actionUrl: '/post/456',
    sender: {
      address: '0xDave',
      username: 'Dave',
    },
  },
  {
    id: 'notif_007',
    type: 'system',
    title: 'System Update',
    message: 'New features have been added to NoteBoard. Check them out!',
    timestamp: '2024-07-20T08:00:00Z',
    read: true,
  },
];

const NotificationCenter: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    types: {
      likes: true,
      comments: true,
      follows: true,
      mentions: true,
      rewards: true,
      achievements: true,
      system: true,
    },
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (isConnected && address) {
      fetchNotifications(address);
    }
  }, [address, isConnected]);

  const fetchNotifications = async (userAddress: string) => {
    // In a real application, this would fetch from backend or indexer
    console.log(`Fetching notifications for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like': return <Heart className="h-5 w-5 text-red-500" />;
      case 'comment': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'follow': return <Users className="h-5 w-5 text-green-500" />;
      case 'mention': return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'reward': return <DollarSign className="h-5 w-5 text-yellow-500" />;
      case 'achievement': return <Award className="h-5 w-5 text-orange-500" />;
      case 'system': return <Info className="h-5 w-5 text-gray-500" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const filteredNotifications = (filter: 'all' | 'unread') => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.read);
    }
    return notifications;
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to view notifications.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Bell className="h-8 w-8 mr-3 text-primary" /> Notifications
            {unreadCount > 0 && (
              <Badge className="ml-3 bg-red-500 text-white">{unreadCount}</Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with all your activity and interactions
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              Mark All Read
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-4 w-4 mr-2" /> Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications yet.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredNotifications('all').map(notification => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer hover:shadow-lg transition-shadow ${
                    !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                  }`}
                  onClick={() => notification.actionUrl && handleMarkAsRead(notification.id)}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {notification.sender && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={notification.sender.avatar} />
                              <AvatarFallback>
                                {notification.sender.username?.[0] || notification.sender.address.slice(2, 4).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <p className="font-semibold text-sm">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            {notification.metadata && (
                              <div className="mt-1">
                                {notification.metadata.amount && (
                                  <Badge variant="outline" className="text-xs">
                                    {notification.metadata.amount} {notification.metadata.token}
                                  </Badge>
                                )}
                                {notification.metadata.achievementName && (
                                  <Badge variant="outline" className="text-xs">
                                    {notification.metadata.achievementName}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="h-2 w-2 bg-primary rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(parseISO(notification.timestamp), 'PPp')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {notifications.length > 0 && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={handleClearAll}>
                    Clear All Notifications
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4 mt-6">
          {unreadCount === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-muted-foreground">All caught up! No unread notifications.</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications('unread').map(notification => (
              <Card
                key={notification.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary bg-primary/5"
                onClick={() => notification.actionUrl && handleMarkAsRead(notification.id)}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {notification.sender && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={notification.sender.avatar} />
                            <AvatarFallback>
                              {notification.sender.username?.[0] || notification.sender.address.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <p className="font-semibold text-sm">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                      </div>
                      <div className="h-2 w-2 bg-primary rounded-full" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(parseISO(notification.timestamp), 'PPp')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>Manage how you receive notifications</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.email}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={settings.push}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, push: checked }))}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <Label>Notification Types</Label>
              {Object.entries(settings.types).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="capitalize">{key}</Label>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      types: { ...prev.types, [key]: checked },
                    }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationCenter;
