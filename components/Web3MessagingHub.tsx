import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MessageSquare, Send, Search, MoreVertical, Lock, Users, User, CheckCheck, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { format, parseISO } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  from: string;
  to: string | string[]; // string for DM, string[] for group
  content: string;
  timestamp: string;
  encrypted: boolean;
  read: boolean;
  type: 'text' | 'image' | 'link';
}

interface Conversation {
  id: string;
  participants: string[];
  type: 'direct' | 'group';
  name?: string; // For group chats
  lastMessage: Message;
  unreadCount: number;
  avatar?: string;
}

const mockConversations: Conversation[] = [
  {
    id: 'conv_001',
    participants: ['0xAlice', '0xYou'],
    type: 'direct',
    lastMessage: {
      id: 'msg_001',
      from: '0xAlice',
      to: '0xYou',
      content: 'Hey! Did you see the latest DAO proposal?',
      timestamp: '2024-07-22T16:30:00Z',
      encrypted: true,
      read: false,
      type: 'text',
    },
    unreadCount: 2,
    avatar: 'https://picsum.photos/seed/alice/100/100',
  },
  {
    id: 'conv_002',
    participants: ['0xBob', '0xYou'],
    type: 'direct',
    lastMessage: {
      id: 'msg_002',
      from: '0xYou',
      to: '0xBob',
      content: 'Thanks for the help with the smart contract!',
      timestamp: '2024-07-22T14:15:00Z',
      encrypted: true,
      read: true,
      type: 'text',
    },
    unreadCount: 0,
    avatar: 'https://picsum.photos/seed/bob/100/100',
  },
  {
    id: 'conv_003',
    participants: ['0xCharlie', '0xDave', '0xEve', '0xYou'],
    type: 'group',
    name: 'Web3 Builders Group',
    lastMessage: {
      id: 'msg_003',
      from: '0xCharlie',
      to: ['0xCharlie', '0xDave', '0xEve', '0xYou'],
      content: 'Anyone interested in collaborating on a new DeFi project?',
      timestamp: '2024-07-22T10:00:00Z',
      encrypted: false,
      read: true,
      type: 'text',
    },
    unreadCount: 5,
    avatar: 'https://picsum.photos/seed/group1/100/100',
  },
  {
    id: 'conv_004',
    participants: ['0xFrank', '0xYou'],
    type: 'direct',
    lastMessage: {
      id: 'msg_004',
      from: '0xFrank',
      to: '0xYou',
      content: 'Can you review my NFT collection?',
      timestamp: '2024-07-21T18:45:00Z',
      encrypted: true,
      read: true,
      type: 'text',
    },
    unreadCount: 0,
    avatar: 'https://picsum.photos/seed/frank/100/100',
  },
];

const mockMessages: { [key: string]: Message[] } = {
  conv_001: [
    {
      id: 'msg_001_1',
      from: '0xYou',
      to: '0xAlice',
      content: 'Hi Alice! How are you doing?',
      timestamp: '2024-07-22T15:00:00Z',
      encrypted: true,
      read: true,
      type: 'text',
    },
    {
      id: 'msg_001_2',
      from: '0xAlice',
      to: '0xYou',
      content: 'Doing great! Just finished reviewing the new features.',
      timestamp: '2024-07-22T15:15:00Z',
      encrypted: true,
      read: true,
      type: 'text',
    },
    {
      id: 'msg_001_3',
      from: '0xAlice',
      to: '0xYou',
      content: 'Hey! Did you see the latest DAO proposal?',
      timestamp: '2024-07-22T16:30:00Z',
      encrypted: true,
      read: false,
      type: 'text',
    },
    {
      id: 'msg_001_4',
      from: '0xAlice',
      to: '0xYou',
      content: 'It looks really promising for the community!',
      timestamp: '2024-07-22T16:31:00Z',
      encrypted: true,
      read: false,
      type: 'text',
    },
  ],
  conv_002: [
    {
      id: 'msg_002_1',
      from: '0xBob',
      to: '0xYou',
      content: 'Hey, I saw your question about the contract bug.',
      timestamp: '2024-07-22T13:00:00Z',
      encrypted: true,
      read: true,
      type: 'text',
    },
    {
      id: 'msg_002_2',
      from: '0xYou',
      to: '0xBob',
      content: 'Yes! I was stuck on that for hours.',
      timestamp: '2024-07-22T13:30:00Z',
      encrypted: true,
      read: true,
      type: 'text',
    },
    {
      id: 'msg_002_3',
      from: '0xBob',
      to: '0xYou',
      content: 'The issue was with the gas estimation. Try using a fixed value.',
      timestamp: '2024-07-22T13:45:00Z',
      encrypted: true,
      read: true,
      type: 'text',
    },
    {
      id: 'msg_002_4',
      from: '0xYou',
      to: '0xBob',
      content: 'Thanks for the help with the smart contract!',
      timestamp: '2024-07-22T14:15:00Z',
      encrypted: true,
      read: true,
      type: 'text',
    },
  ],
  conv_003: [
    {
      id: 'msg_003_1',
      from: '0xCharlie',
      to: ['0xCharlie', '0xDave', '0xEve', '0xYou'],
      content: 'Welcome everyone to the Web3 Builders Group!',
      timestamp: '2024-07-22T09:00:00Z',
      encrypted: false,
      read: true,
      type: 'text',
    },
    {
      id: 'msg_003_2',
      from: '0xDave',
      to: ['0xCharlie', '0xDave', '0xEve', '0xYou'],
      content: 'Excited to be here! Looking forward to collaborating.',
      timestamp: '2024-07-22T09:15:00Z',
      encrypted: false,
      read: true,
      type: 'text',
    },
    {
      id: 'msg_003_3',
      from: '0xCharlie',
      to: ['0xCharlie', '0xDave', '0xEve', '0xYou'],
      content: 'Anyone interested in collaborating on a new DeFi project?',
      timestamp: '2024-07-22T10:00:00Z',
      encrypted: false,
      read: true,
      type: 'text',
    },
  ],
};

const Web3MessagingHub: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = (conversationId: string) => {
    // In a real application, this would involve:
    // 1. Fetching encrypted messages from IPFS or decentralized storage
    // 2. Decrypting messages using user's private key
    // 3. Loading message history from blockchain or indexer
    const convMessages = mockMessages[conversationId] || [];
    setMessages(convMessages);
    
    // Mark messages as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    if (!isConnected) {
      alert('Please connect your wallet to send messages.');
      return;
    }

    const messageToSend: Message = {
      id: `msg_${Date.now()}`,
      from: address!,
      to: selectedConversation.type === 'direct' 
        ? selectedConversation.participants.find(p => p !== '0xYou')! 
        : selectedConversation.participants,
      content: newMessage,
      timestamp: new Date().toISOString(),
      encrypted: selectedConversation.type === 'direct',
      read: false,
      type: 'text',
    };

    console.log('Sending message:', messageToSend);
    // In a real app: encrypt, sign, and send to decentralized network
    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages(prev => [...prev, messageToSend]);
    setNewMessage('');
    
    // Update conversation's last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: messageToSend } 
        : conv
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getParticipantName = (address: string) => {
    if (address === '0xYou') return 'You';
    return address.slice(0, 10) + '...';
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return conversation.name || 'Group Chat';
    }
    const otherParticipant = conversation.participants.find(p => p !== '0xYou');
    return getParticipantName(otherParticipant || '');
  };

  const filteredConversations = conversations.filter(conv => 
    getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to access decentralized messaging.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <MessageSquare className="h-8 w-8 mr-3 text-primary" /> Web3 Messaging Hub
        </h1>
        <p className="text-muted-foreground mt-1">
          Encrypted, decentralized messaging on the blockchain
        </p>
      </div>

      <Card className="h-[700px]">
        <div className="grid grid-cols-12 h-full">
          {/* Conversations Sidebar */}
          <div className="col-span-12 md:col-span-4 border-r flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Messages</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-4">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-primary/10 border-l-4 border-l-primary'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>
                          {conversation.type === 'group' ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate">
                          {getConversationName(conversation)}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(conversation.lastMessage.timestamp), 'p')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {conversation.lastMessage.encrypted && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage.from === '0xYou' ? 'You: ' : ''}
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="col-span-12 md:col-span-8 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedConversation.avatar} />
                        <AvatarFallback>
                          {selectedConversation.type === 'group' ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {getConversationName(selectedConversation)}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          {selectedConversation.type === 'direct' ? (
                            <>
                              <Lock className="h-3 w-3" />
                              End-to-end encrypted
                            </>
                          ) : (
                            <>
                              <Users className="h-3 w-3" />
                              {selectedConversation.participants.length} members
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.from === '0xYou' || message.from === address;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-end gap-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                            {!isOwnMessage && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {message.from.slice(2, 4).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              {!isOwnMessage && selectedConversation.type === 'group' && (
                                <p className="text-xs text-muted-foreground mb-1">
                                  {getParticipantName(message.from)}
                                </p>
                              )}
                              <div
                                className={`p-3 rounded-lg ${
                                  isOwnMessage
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {format(parseISO(message.timestamp), 'p')}
                                </span>
                                {message.encrypted && (
                                  <Lock className="h-3 w-3 text-muted-foreground" />
                                )}
                                {isOwnMessage && message.read && (
                                  <CheckCheck className="h-3 w-3 text-blue-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-end gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedConversation.type === 'direct' && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Messages are end-to-end encrypted
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Alert className="bg-blue-50 dark:bg-blue-950">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">Decentralized Messaging</AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          Messages are encrypted end-to-end and stored on decentralized networks. Direct messages use your private key for encryption, ensuring only you and the recipient can read them.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Web3MessagingHub;

