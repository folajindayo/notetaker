import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Users, CheckCircle, XCircle, Clock, PlusCircle, Send, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Signer {
  id: string;
  address: string;
  username?: string;
  avatar?: string;
  weight: number;
  addedAt: string;
  status: 'active' | 'pending' | 'removed';
}

interface Transaction {
  id: string;
  to: string;
  amount: string;
  token: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  requiredSignatures: number;
  currentSignatures: number;
  signers: {
    address: string;
    signed: boolean;
    signedAt?: string;
  }[];
  createdAt: string;
  executedAt?: string;
}

interface MultiSigWallet {
  id: string;
  name: string;
  address: string;
  threshold: number; // Minimum signatures required
  totalSigners: number;
  balance: string;
  signers: Signer[];
  transactions: Transaction[];
}

const mockMultiSigWallet: MultiSigWallet = {
  id: 'multisig_001',
  name: 'Team Treasury',
  address: '0xMultiSig123...',
  threshold: 2,
  totalSigners: 3,
  balance: '5.5',
  signers: [
    {
      id: 'signer_001',
      address: '0xYou',
      username: 'You',
      weight: 1,
      addedAt: '2024-07-01T10:00:00Z',
      status: 'active',
    },
    {
      id: 'signer_002',
      address: '0xAlice',
      username: 'Alice',
      avatar: 'https://picsum.photos/seed/alice/100/100',
      weight: 1,
      addedAt: '2024-07-05T14:30:00Z',
      status: 'active',
    },
    {
      id: 'signer_003',
      address: '0xBob',
      username: 'Bob',
      avatar: 'https://picsum.photos/seed/bob/100/100',
      weight: 1,
      addedAt: '2024-07-10T09:00:00Z',
      status: 'active',
    },
  ],
  transactions: [
    {
      id: 'tx_001',
      to: '0xRecipient',
      amount: '1.0',
      token: 'ETH',
      description: 'Payment for development services',
      status: 'approved',
      requiredSignatures: 2,
      currentSignatures: 2,
      signers: [
        { address: '0xYou', signed: true, signedAt: '2024-07-22T10:00:00Z' },
        { address: '0xAlice', signed: true, signedAt: '2024-07-22T11:00:00Z' },
        { address: '0xBob', signed: false },
      ],
      createdAt: '2024-07-22T09:00:00Z',
      executedAt: '2024-07-22T11:30:00Z',
    },
    {
      id: 'tx_002',
      to: '0xAnother',
      amount: '0.5',
      token: 'ETH',
      description: 'Community grant payment',
      status: 'pending',
      requiredSignatures: 2,
      currentSignatures: 1,
      signers: [
        { address: '0xYou', signed: true, signedAt: '2024-07-22T15:00:00Z' },
        { address: '0xAlice', signed: false },
        { address: '0xBob', signed: false },
      ],
      createdAt: '2024-07-22T14:30:00Z',
    },
  ],
};

const MultiSigWallet: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [wallet, setWallet] = useState<MultiSigWallet>(mockMultiSigWallet);
  const [isCreateTxModalOpen, setIsCreateTxModalOpen] = useState(false);
  const [isAddSignerModalOpen, setIsAddSignerModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    to: '',
    amount: '',
    token: 'ETH',
    description: '',
  });
  const [newSigner, setNewSigner] = useState({
    address: '',
    weight: '1',
  });

  useEffect(() => {
    if (isConnected && address) {
      fetchMultiSigWallet(address);
    }
  }, [address, isConnected]);

  const fetchMultiSigWallet = async (userAddress: string) => {
    // In a real application, this would fetch from smart contract
    console.log(`Fetching multi-sig wallet for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleCreateTransaction = async () => {
    if (!newTransaction.to || !newTransaction.amount) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet.');
      return;
    }

    console.log('Creating transaction:', newTransaction);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      to: newTransaction.to,
      amount: newTransaction.amount,
      token: newTransaction.token,
      description: newTransaction.description,
      status: 'pending',
      requiredSignatures: wallet.threshold,
      currentSignatures: 0,
      signers: wallet.signers.map(s => ({
        address: s.address,
        signed: false,
      })),
      createdAt: new Date().toISOString(),
    };

    setWallet(prev => ({
      ...prev,
      transactions: [tx, ...prev.transactions],
    }));
    setIsCreateTxModalOpen(false);
    setNewTransaction({ to: '', amount: '', token: 'ETH', description: '' });
    alert('Transaction created! Waiting for signatures.');
  };

  const handleSignTransaction = async (txId: string) => {
    if (!isConnected) {
      alert('Please connect your wallet to sign.');
      return;
    }

    console.log(`Signing transaction ${txId}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setWallet(prev => ({
      ...prev,
      transactions: prev.transactions.map(tx => {
        if (tx.id === txId) {
          const updatedSigners = tx.signers.map(s => 
            s.address === address ? { ...s, signed: true, signedAt: new Date().toISOString() } : s
          );
          const currentSignatures = updatedSigners.filter(s => s.signed).length;
          const status = currentSignatures >= tx.requiredSignatures ? 'approved' : 'pending';
          
          return {
            ...tx,
            signers: updatedSigners,
            currentSignatures,
            status,
          };
        }
        return tx;
      }),
    }));

    alert('Transaction signed successfully!');
  };

  const handleExecuteTransaction = async (txId: string) => {
    console.log(`Executing transaction ${txId}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    setWallet(prev => ({
      ...prev,
      transactions: prev.transactions.map(tx => 
        tx.id === txId 
          ? { ...tx, status: 'executed' as Transaction['status'], executedAt: new Date().toISOString() }
          : tx
      ),
    }));

    alert('Transaction executed successfully!');
  };

  const handleAddSigner = async () => {
    if (!newSigner.address) {
      alert('Please enter a signer address.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet.');
      return;
    }

    console.log('Adding signer:', newSigner);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const signer: Signer = {
      id: `signer_${Date.now()}`,
      address: newSigner.address,
      weight: parseInt(newSigner.weight),
      addedAt: new Date().toISOString(),
      status: 'active',
    };

    setWallet(prev => ({
      ...prev,
      signers: [...prev.signers, signer],
      totalSigners: prev.totalSigners + 1,
    }));
    setIsAddSignerModalOpen(false);
    setNewSigner({ address: '', weight: '1' });
    alert('Signer added successfully!');
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'executed':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Executed</Badge>;
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
        <AlertDescription>Connect your wallet to manage multi-signature wallets.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-8 w-8 mr-3 text-primary" /> Multi-Signature Wallet
          </h1>
          <p className="text-muted-foreground mt-1">
            Secure wallet requiring multiple signatures for transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddSignerModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" /> Add Signer
          </Button>
          <Button onClick={() => setIsCreateTxModalOpen(true)}>
            <Send className="h-4 w-4 mr-2" /> New Transaction
          </Button>
        </div>
      </div>

      {/* Wallet Overview */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white mb-2">{wallet.name}</CardTitle>
              <CardDescription className="text-white/80">
                {wallet.address}
              </CardDescription>
            </div>
            <Shield className="h-12 w-12 opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm opacity-80">Balance</p>
              <p className="text-3xl font-bold">{wallet.balance} ETH</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Threshold</p>
              <p className="text-3xl font-bold">{wallet.threshold} of {wallet.totalSigners}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Signers</p>
              <p className="text-3xl font-bold">{wallet.totalSigners}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="signers" className="w-full">
        <TabsList>
          <TabsTrigger value="signers">Signers ({wallet.signers.length})</TabsTrigger>
          <TabsTrigger value="transactions">Transactions ({wallet.transactions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="signers" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Authorized Signers</CardTitle>
              <CardDescription>Addresses that can sign transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wallet.signers.map(signer => (
                  <div
                    key={signer.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={signer.avatar} />
                        <AvatarFallback>
                          {signer.username?.[0] || signer.address.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {signer.username || signer.address.slice(0, 10) + '...'}
                          {signer.address === address && (
                            <Badge className="ml-2" variant="secondary">You</Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Weight: {signer.weight} • Added {format(parseISO(signer.addedAt), 'PP')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={signer.status === 'active' ? 'default' : 'secondary'}>
                      {signer.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-6">
          {wallet.transactions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Send className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No transactions yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {wallet.transactions.map(tx => {
                const userSigned = tx.signers.find(s => s.address === address)?.signed || false;
                const canExecute = tx.status === 'approved' && !tx.executedAt;
                
                return (
                  <Card key={tx.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(tx.status)}
                          </div>
                          <CardTitle className="text-lg">
                            {tx.amount} {tx.token} → {tx.to.slice(0, 10)}...
                          </CardTitle>
                          <CardDescription>{tx.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Signatures</span>
                          <span className="font-medium">
                            {tx.currentSignatures} / {tx.requiredSignatures}
                          </span>
                        </div>
                        <Progress value={(tx.currentSignatures / tx.requiredSignatures) * 100} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Signers:</p>
                        {tx.signers.map((signer, idx) => {
                          const signerInfo = wallet.signers.find(s => s.address === signer.address);
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 bg-muted rounded"
                            >
                              <div className="flex items-center gap-2">
                                {signer.signed ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-yellow-600" />
                                )}
                                <span className="text-sm">
                                  {signerInfo?.username || signer.address.slice(0, 10) + '...'}
                                </span>
                              </div>
                              {signer.signed && signer.signedAt && (
                                <span className="text-xs text-muted-foreground">
                                  {format(parseISO(signer.signedAt), 'PPp')}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created {format(parseISO(tx.createdAt), 'PPp')}
                      </p>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      {!userSigned && tx.status === 'pending' && (
                        <Button
                          onClick={() => handleSignTransaction(tx.id)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Sign Transaction
                        </Button>
                      )}
                      {canExecute && (
                        <Button
                          onClick={() => handleExecuteTransaction(tx.id)}
                          variant="default"
                          className="flex-1"
                        >
                          <Send className="h-4 w-4 mr-2" /> Execute
                        </Button>
                      )}
                      {userSigned && tx.status === 'pending' && (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" /> You signed
                        </Badge>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Transaction Modal */}
      <Dialog open={isCreateTxModalOpen} onOpenChange={setIsCreateTxModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Transaction</DialogTitle>
            <DialogDescription>Create a new transaction requiring signatures</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="to">To Address *</Label>
              <Input
                id="to"
                placeholder="0x..."
                value={newTransaction.to}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  step="0.000001"
                  placeholder="0.0"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  className="flex-1"
                />
                <Select
                  value={newTransaction.token}
                  onValueChange={(value) => setNewTransaction(prev => ({ ...prev, token: value }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="NOTE">NOTE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Transaction purpose..."
                value={newTransaction.description}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This transaction will require {wallet.threshold} signatures to be executed.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateTransaction}>Create Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Signer Modal */}
      <Dialog open={isAddSignerModalOpen} onOpenChange={setIsAddSignerModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Signer</DialogTitle>
            <DialogDescription>Add a new authorized signer to the wallet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="signerAddress">Signer Address *</Label>
              <Input
                id="signerAddress"
                placeholder="0x..."
                value={newSigner.address}
                onChange={(e) => setNewSigner(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Voting Weight</Label>
              <Input
                id="weight"
                type="number"
                min="1"
                value={newSigner.weight}
                onChange={(e) => setNewSigner(prev => ({ ...prev, weight: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Higher weight means more influence in multi-sig decisions
              </p>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Adding a signer requires approval from existing signers. This is a sensitive operation.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={handleAddSigner}>Add Signer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiSigWallet;
