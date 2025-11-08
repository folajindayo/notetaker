import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Vote, ThumbsUp, ThumbsDown, MinusCircle, Clock, CheckCircle, XCircle, PlusCircle, Users, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO, differenceInHours } from 'date-fns';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'executed' | 'cancelled';
  category: 'treasury' | 'governance' | 'technical' | 'community' | 'other';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorum: number; // Percentage
  startTime: string;
  endTime: string;
  executionTime?: string;
  votingPower: number; // User's voting power
  hasVoted: boolean;
  userVote?: 'for' | 'against' | 'abstain';
  details?: {
    target?: string; // Contract address for execution
    value?: string; // ETH value
    calldata?: string; // Function calldata
  };
}

const mockProposals: Proposal[] = [
  {
    id: 'prop_001',
    title: 'Increase Community Grants Budget',
    description: 'Proposal to increase the monthly community grants budget from 10 ETH to 20 ETH to support more builders on the platform.',
    proposer: '0xAlice',
    status: 'active',
    category: 'treasury',
    votesFor: 15000,
    votesAgainst: 5000,
    votesAbstain: 1000,
    quorum: 50,
    startTime: '2024-07-20T10:00:00Z',
    endTime: '2024-07-27T10:00:00Z',
    votingPower: 100,
    hasVoted: false,
  },
  {
    id: 'prop_002',
    title: 'Implement NFT Profile Pictures',
    description: 'Add support for using owned NFTs as profile pictures across the platform.',
    proposer: '0xBob',
    status: 'active',
    category: 'technical',
    votesFor: 8500,
    votesAgainst: 2000,
    votesAbstain: 500,
    quorum: 40,
    startTime: '2024-07-19T14:00:00Z',
    endTime: '2024-07-26T14:00:00Z',
    votingPower: 100,
    hasVoted: true,
    userVote: 'for',
  },
  {
    id: 'prop_003',
    title: 'Change Voting Period Duration',
    description: 'Proposal to extend the standard voting period from 7 days to 10 days to allow more time for community deliberation.',
    proposer: '0xCharlie',
    status: 'passed',
    category: 'governance',
    votesFor: 20000,
    votesAgainst: 3000,
    votesAbstain: 2000,
    quorum: 50,
    startTime: '2024-07-10T10:00:00Z',
    endTime: '2024-07-17T10:00:00Z',
    executionTime: '2024-07-18T10:00:00Z',
    votingPower: 100,
    hasVoted: true,
    userVote: 'for',
  },
  {
    id: 'prop_004',
    title: 'Launch Ambassador Program',
    description: 'Create a global ambassador program to promote NoteBoard in different regions and communities.',
    proposer: '0xDave',
    status: 'active',
    category: 'community',
    votesFor: 12000,
    votesAgainst: 8000,
    votesAbstain: 3000,
    quorum: 50,
    startTime: '2024-07-18T08:00:00Z',
    endTime: '2024-07-25T08:00:00Z',
    votingPower: 100,
    hasVoted: false,
  },
  {
    id: 'prop_005',
    title: 'Reduce Transaction Fees',
    description: 'Proposal to reduce platform transaction fees from 2% to 1% to encourage more activity.',
    proposer: '0xEve',
    status: 'rejected',
    category: 'governance',
    votesFor: 8000,
    votesAgainst: 15000,
    votesAbstain: 1000,
    quorum: 50,
    startTime: '2024-07-05T10:00:00Z',
    endTime: '2024-07-12T10:00:00Z',
    votingPower: 100,
    hasVoted: true,
    userVote: 'against',
  },
];

const DAOGovernance: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [newProposal, setNewProposal] = useState<Partial<Proposal>>({
    title: '',
    description: '',
    category: 'other',
    quorum: 50,
  });
  const [userVotingPower, setUserVotingPower] = useState(100);
  const [delegatedTo, setDelegatedTo] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      fetchUserVotingPower(address);
    }
  }, [address, isConnected]);

  const fetchUserVotingPower = async (userAddress: string) => {
    // In a real application, this would involve:
    // 1. Reading governance token balance
    // 2. Calculating voting power based on token holdings, delegation, etc.
    // 3. Checking if user has delegated their votes
    console.log(`Fetching voting power for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUserVotingPower(100);
    // Check delegation (mock)
    // setDelegatedTo('0xDelegate...');
  };

  const handleProposalClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsDetailModalOpen(true);
  };

  const handleVote = async (proposalId: string, voteType: 'for' | 'against' | 'abstain') => {
    if (!isConnected) {
      alert('Please connect your wallet to vote.');
      return;
    }
    if (delegatedTo) {
      alert('You have delegated your voting power. You cannot vote directly.');
      return;
    }
    setIsVoting(true);
    console.log(`Voting ${voteType} on proposal ${proposalId} with ${userVotingPower} voting power...`);

    try {
      // Simulate blockchain transaction for voting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProposals(prev => prev.map(p => {
        if (p.id === proposalId) {
          let updatedProposal = { ...p };
          if (voteType === 'for') updatedProposal.votesFor += userVotingPower;
          if (voteType === 'against') updatedProposal.votesAgainst += userVotingPower;
          if (voteType === 'abstain') updatedProposal.votesAbstain += userVotingPower;
          updatedProposal.hasVoted = true;
          updatedProposal.userVote = voteType;
          return updatedProposal;
        }
        return p;
      }));
      
      if (selectedProposal?.id === proposalId) {
        setSelectedProposal(prev => {
          if (!prev) return null;
          let updated = { ...prev, hasVoted: true, userVote: voteType };
          if (voteType === 'for') updated.votesFor += userVotingPower;
          if (voteType === 'against') updated.votesAgainst += userVotingPower;
          if (voteType === 'abstain') updated.votesAbstain += userVotingPower;
          return updated;
        });
      }
      
      alert(`Successfully voted ${voteType}!`);
    } catch (error) {
      console.error('Voting failed:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleCreateProposal = async () => {
    if (!newProposal.title || !newProposal.description) {
      alert('Please fill in all required fields.');
      return;
    }
    if (userVotingPower < 50) {
      alert('You need at least 50 voting power to create a proposal.');
      return;
    }

    const proposalToCreate: Proposal = {
      ...newProposal,
      id: `prop_${Date.now()}`,
      proposer: address || 'Anonymous',
      status: 'active',
      votesFor: 0,
      votesAgainst: 0,
      votesAbstain: 0,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      votingPower: userVotingPower,
      hasVoted: false,
    } as Proposal;

    console.log('Creating proposal:', proposalToCreate);
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProposals(prev => [proposalToCreate, ...prev]);
    setIsCreateModalOpen(false);
    setNewProposal({
      title: '',
      description: '',
      category: 'other',
      quorum: 50,
    });
    alert('Proposal created successfully!');
  };

  const getStatusBadge = (status: Proposal['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Active</Badge>;
      case 'passed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Passed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Rejected</Badge>;
      case 'executed':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Executed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: Proposal['category']) => {
    const colors = {
      treasury: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      governance: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      technical: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      community: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return <Badge className={colors[category]}>{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>;
  };

  const calculateVotePercentages = (proposal: Proposal) => {
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
    if (totalVotes === 0) return { forPercent: 0, againstPercent: 0, abstainPercent: 0 };
    return {
      forPercent: (proposal.votesFor / totalVotes) * 100,
      againstPercent: (proposal.votesAgainst / totalVotes) * 100,
      abstainPercent: (proposal.votesAbstain / totalVotes) * 100,
    };
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
        <AlertDescription>Connect your wallet to participate in DAO governance and vote on proposals.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Vote className="h-8 w-8 mr-3 text-primary" /> DAO Governance
          </h1>
          <p className="text-muted-foreground mt-1">
            Vote on proposals and shape the future of NoteBoard
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Create Proposal
        </Button>
      </div>

      {/* User Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Your Governance Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Voting Power</p>
            <p className="text-2xl font-bold">{userVotingPower}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Proposals Voted</p>
            <p className="text-2xl font-bold">{proposals.filter(p => p.hasVoted).length}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Delegation Status</p>
            <p className="text-lg font-medium">{delegatedTo ? `Delegated to ${delegatedTo.slice(0, 10)}...` : 'Not Delegated'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Proposals */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active ({proposals.filter(p => p.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="passed">Passed ({proposals.filter(p => p.status === 'passed').length})</TabsTrigger>
          <TabsTrigger value="all">All Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {proposals.filter(p => p.status === 'active').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Vote className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active proposals at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {proposals.filter(p => p.status === 'active').map((proposal) => {
                const { forPercent, againstPercent } = calculateVotePercentages(proposal);
                const timeRemaining = getTimeRemaining(proposal.endTime);
                
                return (
                  <Card
                    key={proposal.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleProposalClick(proposal)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(proposal.status)}
                            {getCategoryBadge(proposal.category)}
                            <span className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-4 w-4 mr-1" /> {timeRemaining}
                            </span>
                          </div>
                          <CardTitle className="text-xl">{proposal.title}</CardTitle>
                          <CardDescription className="mt-2">{proposal.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600 dark:text-green-400">For: {forPercent.toFixed(1)}%</span>
                          <span className="text-red-600 dark:text-red-400">Against: {againstPercent.toFixed(1)}%</span>
                        </div>
                        <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                          <div
                            className="absolute h-full bg-green-500"
                            style={{ width: `${forPercent}%` }}
                          />
                          <div
                            className="absolute h-full bg-red-500"
                            style={{ left: `${forPercent}%`, width: `${againstPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{proposal.votesFor.toLocaleString()} votes</span>
                          <span>{proposal.votesAgainst.toLocaleString()} votes</span>
                        </div>
                      </div>
                      {proposal.hasVoted && (
                        <Alert className="bg-blue-50 dark:bg-blue-950">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800 dark:text-blue-300">
                            You voted: <strong>{proposal.userVote?.toUpperCase()}</strong>
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                    {!proposal.hasVoted && (
                      <CardFooter className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(proposal.id, 'for');
                          }}
                          disabled={isVoting}
                          className="flex-1"
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" /> Vote For
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(proposal.id, 'against');
                          }}
                          disabled={isVoting}
                          className="flex-1"
                        >
                          <ThumbsDown className="h-4 w-4 mr-2" /> Vote Against
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(proposal.id, 'abstain');
                          }}
                          disabled={isVoting}
                        >
                          <MinusCircle className="h-4 w-4 mr-2" /> Abstain
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="passed" className="space-y-4 mt-6">
          <div className="space-y-4">
            {proposals.filter(p => p.status === 'passed' || p.status === 'executed').map((proposal) => {
              const { forPercent, againstPercent } = calculateVotePercentages(proposal);
              
              return (
                <Card
                  key={proposal.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleProposalClick(proposal)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(proposal.status)}
                      {getCategoryBadge(proposal.category)}
                    </div>
                    <CardTitle className="text-xl">{proposal.title}</CardTitle>
                    <CardDescription>{proposal.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400">For: {forPercent.toFixed(1)}%</span>
                        <span className="text-red-600 dark:text-red-400">Against: {againstPercent.toFixed(1)}%</span>
                      </div>
                      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-green-500"
                          style={{ width: `${forPercent}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="space-y-4">
            {proposals.map((proposal) => {
              const { forPercent, againstPercent } = calculateVotePercentages(proposal);
              
              return (
                <Card
                  key={proposal.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleProposalClick(proposal)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(proposal.status)}
                      {getCategoryBadge(proposal.category)}
                    </div>
                    <CardTitle className="text-xl">{proposal.title}</CardTitle>
                    <CardDescription>{proposal.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400">For: {forPercent.toFixed(1)}%</span>
                        <span className="text-red-600 dark:text-red-400">Against: {againstPercent.toFixed(1)}%</span>
                      </div>
                      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-green-500"
                          style={{ width: `${forPercent}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Proposal Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedProposal && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusBadge(selectedProposal.status)}
                  {getCategoryBadge(selectedProposal.category)}
                </div>
                <DialogTitle>{selectedProposal.title}</DialogTitle>
                <DialogDescription>
                  Proposed by {selectedProposal.proposer.slice(0, 10)}... • {format(parseISO(selectedProposal.startTime), 'PPP')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedProposal.description}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-3">Voting Results</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">For</span>
                        <span className="text-sm font-medium">{selectedProposal.votesFor.toLocaleString()} votes</span>
                      </div>
                      <Progress value={calculateVotePercentages(selectedProposal).forPercent} className="h-2 bg-green-200" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">Against</span>
                        <span className="text-sm font-medium">{selectedProposal.votesAgainst.toLocaleString()} votes</span>
                      </div>
                      <Progress value={calculateVotePercentages(selectedProposal).againstPercent} className="h-2 bg-red-200" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Abstain</span>
                        <span className="text-sm font-medium">{selectedProposal.votesAbstain.toLocaleString()} votes</span>
                      </div>
                      <Progress value={calculateVotePercentages(selectedProposal).abstainPercent} className="h-2 bg-gray-200" />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quorum Required</p>
                    <p className="font-medium">{selectedProposal.quorum}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time Remaining</p>
                    <p className="font-medium">{getTimeRemaining(selectedProposal.endTime)}</p>
                  </div>
                </div>
              </div>
              {selectedProposal.status === 'active' && !selectedProposal.hasVoted && (
                <DialogFooter className="flex gap-2">
                  <Button
                    onClick={() => {
                      handleVote(selectedProposal.id, 'for');
                      setIsDetailModalOpen(false);
                    }}
                    disabled={isVoting}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" /> Vote For
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleVote(selectedProposal.id, 'against');
                      setIsDetailModalOpen(false);
                    }}
                    disabled={isVoting}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" /> Vote Against
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleVote(selectedProposal.id, 'abstain');
                      setIsDetailModalOpen(false);
                    }}
                    disabled={isVoting}
                  >
                    <MinusCircle className="h-4 w-4 mr-2" /> Abstain
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Proposal Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Proposal</DialogTitle>
            <DialogDescription>
              Submit a proposal for the community to vote on. Requires minimum 50 voting power.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                value={newProposal.title}
                onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                className="col-span-3"
                placeholder="Brief title for your proposal"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={newProposal.description}
                onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                rows={5}
                placeholder="Detailed description of your proposal"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select
                value={newProposal.category}
                onValueChange={(value: Proposal['category']) => setNewProposal(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="treasury">Treasury</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quorum" className="text-right">Quorum %</Label>
              <Input
                id="quorum"
                type="number"
                min="1"
                max="100"
                value={newProposal.quorum}
                onChange={(e) => setNewProposal(prev => ({ ...prev, quorum: parseInt(e.target.value) }))}
                className="col-span-3"
              />
            </div>
            {userVotingPower < 50 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Insufficient Voting Power</AlertTitle>
                <AlertDescription>You need at least 50 voting power to create a proposal.</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleCreateProposal} disabled={userVotingPower < 50}>
              Create Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DAOGovernance;

