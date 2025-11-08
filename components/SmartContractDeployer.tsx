import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Code, Upload, CheckCircle, XCircle, Clock, FileText, Info, ExternalLink, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';

interface DeployedContract {
  id: string;
  name: string;
  address: string;
  chainId: number;
  chainName: string;
  compilerVersion: string;
  deployedAt: string;
  deployer: string;
  transactionHash: string;
  verified: boolean;
  abi?: string;
  sourceCode?: string;
}

interface DeploymentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'token' | 'nft' | 'dao' | 'marketplace' | 'custom';
  code: string;
  constructorParams: {
    name: string;
    type: string;
    description: string;
  }[];
}

const deploymentTemplates: DeploymentTemplate[] = [
  {
    id: 'erc20',
    name: 'ERC-20 Token',
    description: 'Standard fungible token contract',
    category: 'token',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC20Token {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
}`,
    constructorParams: [
      { name: 'name', type: 'string', description: 'Token name' },
      { name: 'symbol', type: 'string', description: 'Token symbol' },
      { name: 'decimals', type: 'uint8', description: 'Token decimals' },
      { name: 'totalSupply', type: 'uint256', description: 'Total supply' },
          ],
        },
        {
    id: 'erc721',
          name: 'ERC-721 NFT',
    description: 'Non-fungible token contract',
          category: 'nft',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC721 {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }
    
    function mint(address to, uint256 tokenId) public {
        require(ownerOf[tokenId] == address(0), "Token already exists");
        ownerOf[tokenId] = to;
        balanceOf[to]++;
        totalSupply++;
        emit Transfer(address(0), to, tokenId);
    }
}`,
    constructorParams: [
      { name: 'name', type: 'string', description: 'NFT collection name' },
      { name: 'symbol', type: 'string', description: 'NFT collection symbol' },
          ],
        },
      ];

const mockDeployedContracts: DeployedContract[] = [
        {
    id: 'contract_001',
          name: 'MyToken',
          address: '0x1234567890123456789012345678901234567890',
    chainId: 8453,
    chainName: 'Base',
    compilerVersion: '0.8.28',
    deployedAt: '2024-07-20T10:00:00Z',
    deployer: '0xYou',
    transactionHash: '0xabc123...',
          verified: true,
  },
];

const chains = [
  { id: 8453, name: 'Base', explorer: 'https://basescan.org' },
  { id: 1, name: 'Ethereum', explorer: 'https://etherscan.io' },
  { id: 42161, name: 'Arbitrum', explorer: 'https://arbiscan.io' },
  { id: 10, name: 'Optimism', explorer: 'https://optimistic.etherscan.io' },
];

const SmartContractDeployer: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [deployedContracts, setDeployedContracts] = useState<DeployedContract[]>(mockDeployedContracts);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DeploymentTemplate | null>(null);
  const [contractCode, setContractCode] = useState('');
  const [contractName, setContractName] = useState('');
  const [selectedChain, setSelectedChain] = useState('8453');
  const [constructorArgs, setConstructorArgs] = useState<Record<string, string>>({});
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchDeployedContracts(address);
    }
  }, [address, isConnected]);

  const fetchDeployedContracts = async (userAddress: string) => {
    // In a real application, this would fetch from blockchain
    console.log(`Fetching deployed contracts for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleUseTemplate = (template: DeploymentTemplate) => {
    setSelectedTemplate(template);
    setContractCode(template.code);
    setContractName(template.name);
    const initialArgs: Record<string, string> = {};
    template.constructorParams.forEach(param => {
      initialArgs[param.name] = '';
    });
    setConstructorArgs(initialArgs);
    setIsTemplateModalOpen(false);
    setIsDeployModalOpen(true);
  };

  const handleDeploy = async () => {
    if (!contractCode || !contractName) {
      alert('Please provide contract code and name.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet.');
      return;
    }

    setIsDeploying(true);
    console.log('Deploying contract:', { contractName, contractCode, constructorArgs, chainId: selectedChain });

    try {
      // In a real application, this would compile and deploy the contract
      await new Promise(resolve => setTimeout(resolve, 5000));

      const chain = chains.find(c => c.id.toString() === selectedChain);
    const newContract: DeployedContract = {
        id: `contract_${Date.now()}`,
        name: contractName,
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        chainId: parseInt(selectedChain),
        chainName: chain?.name || 'Unknown',
        compilerVersion: '0.8.28',
        deployedAt: new Date().toISOString(),
      deployer: address!,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      verified: false,
        sourceCode: contractCode,
      };

      setDeployedContracts(prev => [newContract, ...prev]);
      setIsDeployModalOpen(false);
      setContractCode('');
      setContractName('');
      setConstructorArgs({});
    setSelectedTemplate(null);
      alert('Contract deployed successfully!');
    } catch (error) {
      console.error('Deployment failed:', error);
      alert('Failed to deploy contract. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleVerify = async (contractId: string) => {
    console.log(`Verifying contract ${contractId}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    setDeployedContracts(prev => prev.map(c => 
      c.id === contractId ? { ...c, verified: true } : c
    ));

    alert('Contract verified successfully!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to deploy smart contracts.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
      <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Code className="h-8 w-8 mr-3 text-primary" /> Smart Contract Deployer
          </h1>
          <p className="text-muted-foreground mt-1">
            Deploy and manage smart contracts on multiple chains
        </p>
      </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsTemplateModalOpen(true)}>
            <FileText className="h-4 w-4 mr-2" /> Use Template
          </Button>
          <Button onClick={() => setIsDeployModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" /> Deploy Contract
          </Button>
        </div>
      </div>

      <Tabs defaultValue="deployed" className="w-full">
        <TabsList>
          <TabsTrigger value="deployed">Deployed Contracts ({deployedContracts.length})</TabsTrigger>
          <TabsTrigger value="templates">Templates ({deploymentTemplates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="deployed" className="space-y-4 mt-6">
          {deployedContracts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Code className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No contracts deployed yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {deployedContracts.map(contract => {
                const chain = chains.find(c => c.id === contract.chainId);
                return (
                  <Card key={contract.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {contract.verified ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                <CheckCircle className="h-3 w-3 mr-1" /> Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline">Unverified</Badge>
                            )}
                            <Badge variant="outline">{contract.chainName}</Badge>
                          </div>
                          <CardTitle className="text-xl">{contract.name}</CardTitle>
                          <CardDescription className="mt-2 font-mono text-sm">
                            {contract.address}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Compiler Version</p>
                          <p className="font-medium">{contract.compilerVersion}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Deployed</p>
                          <p className="font-medium">{format(parseISO(contract.deployedAt), 'PPp')}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-mono">{contract.transactionHash}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(contract.transactionHash)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
          </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      {chain && (
                        <Button
                          variant="outline"
                          asChild
                          className="flex-1"
                        >
                          <a
                            href={`${chain.explorer}/address/${contract.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" /> View on Explorer
                          </a>
                        </Button>
                      )}
                      {!contract.verified && (
                        <Button
                          variant="outline"
                          onClick={() => handleVerify(contract.id)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Verify Contract
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {deploymentTemplates.map(template => (
              <Card key={template.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleUseTemplate(template)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2 capitalize">{template.category}</Badge>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Constructor Parameters:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {template.constructorParams.map((param, idx) => (
                        <li key={idx}>
                          <span className="font-mono">{param.name}</span> ({param.type}): {param.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" /> Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Selection Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Template</DialogTitle>
            <DialogDescription>Choose a contract template to get started</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4 max-h-[400px] overflow-y-auto">
            {deploymentTemplates.map(template => (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleUseTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                      <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">{template.category}</Badge>
                      </div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
                  </div>
        </DialogContent>
      </Dialog>

      {/* Deploy Contract Modal */}
      <Dialog open={isDeployModalOpen} onOpenChange={setIsDeployModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Deploy Smart Contract</DialogTitle>
            <DialogDescription>Deploy your contract to the blockchain</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contract-name">Contract Name *</Label>
              <Input
                id="contract-name"
                placeholder="MyContract"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
              />
                </div>
            <div className="space-y-2">
              <Label htmlFor="chain">Network *</Label>
              <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chains.map(chain => (
                    <SelectItem key={chain.id} value={chain.id.toString()}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedTemplate && selectedTemplate.constructorParams.length > 0 && (
              <div className="space-y-2">
                <Label>Constructor Parameters</Label>
                <div className="space-y-2">
                  {selectedTemplate.constructorParams.map(param => (
                    <div key={param.name} className="space-y-1">
                      <Label htmlFor={`arg-${param.name}`} className="text-sm">
                        {param.name} ({param.type})
                      </Label>
                      <Input
                        id={`arg-${param.name}`}
                    placeholder={param.description}
                        value={constructorArgs[param.name] || ''}
                        onChange={(e) => setConstructorArgs(prev => ({ ...prev, [param.name]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="contract-code">Contract Code (Solidity) *</Label>
              <Textarea
                id="contract-code"
                placeholder="// SPDX-License-Identifier: MIT&#10;pragma solidity ^0.8.0;&#10;..."
                rows={15}
                className="font-mono text-sm"
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
              />
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Make sure your contract code is correct before deploying. Deployment costs gas fees.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={handleDeploy} disabled={isDeploying || !contractCode || !contractName}>
              {isDeploying ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Deploying...
                  </>
                ) : (
                  <>
                  <Upload className="h-4 w-4 mr-2" />
                  Deploy Contract
                  </>
                )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SmartContractDeployer;
