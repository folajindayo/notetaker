import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Vote, PlusCircle, Clock, Users, CheckCircle, BarChart, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO, differenceInHours } from 'date-fns';

interface Poll {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorAvatar?: string;
  options: PollOption[];
  status: 'active' | 'ended' | 'scheduled';
  startTime: string;
  endTime: string;
  totalVotes: number;
  category: 'general' | 'governance' | 'community' | 'feature' | 'other';
  allowMultiple: boolean;
  isPublic: boolean;
  hasVoted: boolean;
  userVote?: string[];
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

const mockPolls: Poll[] = [
  {
    id: 'poll_001',
    title: 'Which new feature should we prioritize?',
    description: 'Help us decide which feature to build next for NoteBoard.',
    creator: '0xAdmin',
    creatorAvatar: 'https://picsum.photos/seed/admin/100/100',
    options: [
      { id: 'opt_1', text: 'Mobile App', votes: 1250, percentage: 45 },
      { id: 'opt_2', text: 'Advanced Analytics', votes: 850, percentage: 31 },
      { id: 'opt_3', text: 'Video Support', votes: 650, percentage: 24 },
    ],
    status: 'active',
    startTime: '2024-07-20T10:00:00Z',
    endTime: '2024-07-27T10:00:00Z',
    totalVotes: 2750,
    category: 'feature',
    allowMultiple: false,
    isPublic: true,
    hasVoted: true,
    userVote: ['opt_1'],
  },
  {
    id: 'poll_002',
    title: 'Community Event Preferences',
    description: 'What type of community events would you like to see?',
    creator: '0xCommunity',
    options: [
      { id: 'opt_1', text: 'Virtual Meetups', votes: 320, percentage: 28 },
      { id: 'opt_2', text: 'Gaming Tournaments', votes: 450, percentage: 39 },
      { id: 'opt_3', text: 'Educational Workshops', votes: 380, percentage: 33 },
    ],
    status: 'active',
    startTime: '2024-07-21T14:00:00Z',
    endTime: '2024-07-28T14:00:00Z',
    totalVotes: 1150,
    category: 'community',
    allowMultiple: true,
    isPublic: true,
    hasVoted: false,
  },
  {
    id: 'poll_003',
    title: 'Token Distribution Method',
    description: 'How should we distribute community rewards?',
    creator: '0xDAO',
    options: [
      { id: 'opt_1', text: 'Equal Distribution', votes: 850, percentage: 35 },
      { id: 'opt_2', text: 'Activity-Based', votes: 1200, percentage: 50 },
      { id: 'opt_3', text: 'Staking Rewards', votes: 350, percentage: 15 },
    ],
    status: 'ended',
    startTime: '2024-07-10T10:00:00Z',
    endTime: '2024-07-17T10:00:00Z',
    totalVotes: 2400,
    category: 'governance',
    allowMultiple: false,
    isPublic: true,
    hasVoted: true,
    userVote: ['opt_2'],
  },
];

const PollsVoting: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [polls, setPolls] = useState<Poll[]>(mockPolls);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    category: 'general' as Poll['category'],
    allowMultiple: false,
    isPublic: true,
    options: ['', ''] as string[],
    endTime: '',
  });

  useEffect(() => {
    if (selectedPoll) {
      setSelectedOptions(selectedPoll.userVote || []);
    }
  }, [selectedPoll]);

  const handlePollClick = (poll: Poll) => {
    setSelectedPoll(poll);
  };

  const handleVote = async (pollId: string) => {
    if (!isConnected) {
      alert('Please connect your wallet to vote.');
      return;
    }
    if (selectedOptions.length === 0) {
      alert('Please select at least one option.');
      return;
    }

    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    if (!poll.allowMultiple && selectedOptions.length > 1) {
      alert('This poll only allows one vote.');
      return;
    }

    setIsVoting(true);
    console.log(`Voting on poll ${pollId} with options:`, selectedOptions);

    try {
      // In a real application, this would involve:
      // 1. Signing the vote with wallet
      // 2. Submitting vote to smart contract or backend
      // 3. Updating poll results
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update poll with new votes
      const updatedPoll = { ...poll };
      selectedOptions.forEach(optionId => {
        const option = updatedPoll.options.find(opt => opt.id === optionId);
        if (option) {
          option.votes += 1;
        }
      });
      updatedPoll.totalVotes += selectedOptions.length;
      updatedPoll.hasVoted = true;
      updatedPoll.userVote = selectedOptions;

      // Recalculate percentages
      updatedPoll.options.forEach(opt => {
        opt.percentage = (opt.votes / updatedPoll.totalVotes) * 100;
      });

      setPolls(prev => prev.map(p => p.id === pollId ? updatedPoll : p));
      if (selectedPoll?.id === pollId) {
        setSelectedPoll(updatedPoll);
      }

      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Voting failed:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleCreatePoll = async () => {
    if (!newPoll.title || !newPoll.description) {
      alert('Please fill in all required fields.');
      return;
    }
    if (newPoll.options.filter(opt => opt.trim()).length < 2) {
      alert('Please provide at least 2 options.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet to create a poll.');
      return;
    }

    console.log('Creating poll:', newPoll);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const poll: Poll = {
      id: `poll_${Date.now()}`,
      title: newPoll.title,
      description: newPoll.description,
      creator: address!,
      options: newPoll.options
        .filter(opt => opt.trim())
        .map((opt, idx) => ({
          id: `opt_${idx + 1}`,
          text: opt,
          votes: 0,
          percentage: 0,
        })),
      status: 'active',
      startTime: new Date().toISOString(),
      endTime: newPoll.endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalVotes: 0,
      category: newPoll.category,
      allowMultiple: newPoll.allowMultiple,
      isPublic: newPoll.isPublic,
      hasVoted: false,
    };

    setPolls(prev => [poll, ...prev]);
    setIsCreateModalOpen(false);
    setNewPoll({
      title: '',
      description: '',
      category: 'general',
      allowMultiple: false,
      isPublic: true,
      options: ['', ''],
      endTime: '',
    });
    alert('Poll created successfully!');
  };

  const getStatusBadge = (status: Poll['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case 'ended':
        return <Badge variant="secondary">Ended</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Scheduled</Badge>;
      default:
        return null;
    }
  };

  const getTimeRemaining = (endTime: string) => {
    const hours = differenceInHours(parseISO(endTime), new Date());
    if (hours < 0) return 'Ended';
    if (hours < 24) return `${hours}h remaining`;
    const days = Math.floor(hours / 24);
    return `${days}d remaining`;
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to participate in polls and create your own.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Vote className="h-8 w-8 mr-3 text-primary" /> Community Polls
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and vote on community polls to shape the platform
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Create Poll
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active ({polls.filter(p => p.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="ended">Ended ({polls.filter(p => p.status === 'ended').length})</TabsTrigger>
          <TabsTrigger value="all">All Polls</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {polls.filter(p => p.status === 'active').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Vote className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active polls at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {polls.filter(p => p.status === 'active').map(poll => (
                <Card
                  key={poll.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePollClick(poll)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(poll.status)}
                          <Badge variant="outline" className="capitalize">{poll.category}</Badge>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {getTimeRemaining(poll.endTime)}
                          </span>
                        </div>
                        <CardTitle className="text-xl">{poll.title}</CardTitle>
                        <CardDescription className="mt-2">{poll.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {poll.options.slice(0, 3).map(option => (
                        <div key={option.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{option.text}</span>
                            <span className="font-medium">{option.percentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={option.percentage} />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {poll.totalVotes.toLocaleString()} votes
                      </span>
                      {poll.hasVoted && (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Voted
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ended" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {polls.filter(p => p.status === 'ended').map(poll => (
              <Card key={poll.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(poll.status)}
                    <Badge variant="outline" className="capitalize">{poll.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{poll.title}</CardTitle>
                  <CardDescription>{poll.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {poll.options.map(option => (
                      <div key={option.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{option.text}</span>
                          <span className="font-medium">{option.percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={option.percentage} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {polls.map(poll => (
              <Card
                key={poll.id}
                className={poll.status === 'ended' ? 'opacity-75' : 'cursor-pointer hover:shadow-lg transition-shadow'}
                onClick={() => poll.status === 'active' && handlePollClick(poll)}
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(poll.status)}
                    <Badge variant="outline" className="capitalize">{poll.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{poll.title}</CardTitle>
                  <CardDescription>{poll.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {poll.totalVotes.toLocaleString()} votes • {format(parseISO(poll.endTime), 'PP')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Poll Detail Modal */}
      {selectedPoll && (
        <Dialog open={!!selectedPoll} onOpenChange={() => setSelectedPoll(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(selectedPoll.status)}
                <Badge variant="outline" className="capitalize">{selectedPoll.category}</Badge>
              </div>
              <DialogTitle>{selectedPoll.title}</DialogTitle>
              <DialogDescription>{selectedPoll.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedPoll.status === 'active' && !selectedPoll.hasVoted ? (
                <div>
                  <Label className="mb-3 block">Select your {selectedPoll.allowMultiple ? 'options' : 'option'}</Label>
                  {selectedPoll.allowMultiple ? (
                    <div className="space-y-3">
                      {selectedPoll.options.map(option => (
                        <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted">
                          <Checkbox
                            id={option.id}
                            checked={selectedOptions.includes(option.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedOptions([...selectedOptions, option.id]);
                              } else {
                                setSelectedOptions(selectedOptions.filter(id => id !== option.id));
                              }
                            }}
                          />
                          <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <RadioGroup value={selectedOptions[0]} onValueChange={(value) => setSelectedOptions([value])}>
                      {selectedPoll.options.map(option => (
                        <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedPoll.options.map(option => (
                    <div key={option.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{option.text}</span>
                        <span className="font-bold">{option.percentage.toFixed(1)}% ({option.votes} votes)</span>
                      </div>
                      <Progress value={option.percentage} />
                    </div>
                  ))}
                  {selectedPoll.hasVoted && selectedPoll.userVote && (
                    <Alert className="bg-green-50 dark:bg-green-950">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-300">
                        You voted for: {selectedPoll.userVote.map(id => selectedPoll.options.find(opt => opt.id === id)?.text).join(', ')}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Votes</p>
                  <p className="font-bold text-lg">{selectedPoll.totalVotes.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time Remaining</p>
                  <p className="font-medium">{getTimeRemaining(selectedPoll.endTime)}</p>
                </div>
              </div>
            </div>
            {selectedPoll.status === 'active' && !selectedPoll.hasVoted && (
              <DialogFooter>
                <Button onClick={() => handleVote(selectedPoll.id)} disabled={isVoting || selectedOptions.length === 0}>
                  {isVoting ? 'Submitting...' : 'Submit Vote'}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Create Poll Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Poll</DialogTitle>
            <DialogDescription>Create a poll to gather community feedback</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={newPoll.title}
                onChange={(e) => setNewPoll(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter poll title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newPoll.description}
                onChange={(e) => setNewPoll(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this poll is about"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Options *</Label>
              {newPoll.options.map((opt, idx) => (
                <Input
                  key={idx}
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...newPoll.options];
                    newOptions[idx] = e.target.value;
                    setNewPoll(prev => ({ ...prev, options: newOptions }));
                  }}
                  placeholder={`Option ${idx + 1}`}
                  className="mb-2"
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewPoll(prev => ({ ...prev, options: [...prev.options, ''] }))}
              >
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newPoll.category}
                onValueChange={(value: Poll['category']) => setNewPoll(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowMultiple"
                checked={newPoll.allowMultiple}
                onCheckedChange={(checked) => setNewPoll(prev => ({ ...prev, allowMultiple: !!checked }))}
              />
              <Label htmlFor="allowMultiple">Allow multiple selections</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={newPoll.isPublic}
                onCheckedChange={(checked) => setNewPoll(prev => ({ ...prev, isPublic: !!checked }))}
              />
              <Label htmlFor="isPublic">Make poll public</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreatePoll}>Create Poll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PollsVoting;

