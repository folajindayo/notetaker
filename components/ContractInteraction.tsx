'use client';

import { useState } from 'react';
import { FileCode, Send, Loader, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface ContractFunction {
  name: string;
  inputs: { name: string; type: string; placeholder?: string }[];
  description: string;
  type: 'read' | 'write';
}

export default function ContractInteraction() {
  const [selectedFunction, setSelectedFunction] = useState<string>('');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const contractFunctions: ContractFunction[] = [
    {
      name: 'postNote',
      type: 'write',
      description: 'Create a new note on the blockchain',
      inputs: [
        { name: 'content', type: 'string', placeholder: 'Your note content...' },
        { name: 'mediaUrl', type: 'string', placeholder: 'https://ipfs.io/...' },
      ],
    },
    {
      name: 'likeNote',
      type: 'write',
      description: 'Like a specific note',
      inputs: [{ name: 'noteId', type: 'uint256', placeholder: '1' }],
    },
    {
      name: 'followUser',
      type: 'write',
      description: 'Follow another user',
      inputs: [{ name: 'userAddress', type: 'address', placeholder: '0x...' }],
    },
    {
      name: 'getNote',
      type: 'read',
      description: 'Retrieve a note by ID',
      inputs: [{ name: 'noteId', type: 'uint256', placeholder: '1' }],
    },
    {
      name: 'getUserProfile',
      type: 'read',
      description: 'Get user profile information',
      inputs: [{ name: 'userAddress', type: 'address', placeholder: '0x...' }],
    },
    {
      name: 'getNoteCount',
      type: 'read',
      description: 'Get total number of notes',
      inputs: [],
    },
    {
      name: 'isFollowing',
      type: 'read',
      description: 'Check if one user follows another',
      inputs: [
        { name: 'follower', type: 'address', placeholder: '0x...' },
        { name: 'followed', type: 'address', placeholder: '0x...' },
      ],
    },
  ];

  const selectedFn = contractFunctions.find((fn) => fn.name === selectedFunction);

  const handleInputChange = (name: string, value: string) => {
    setInputs({ ...inputs, [name]: value });
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setError(null);
    setResult(null);

    try {
      // Simulate contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (selectedFn?.type === 'write') {
        // Simulate write transaction
        setResult({
          txHash: '0x' + Math.random().toString(16).substring(2, 66),
          blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
          gasUsed: '0x' + Math.floor(Math.random() * 100000).toString(16),
          status: 'success',
        });
      } else {
        // Simulate read call
        if (selectedFunction === 'getNoteCount') {
          setResult({ count: Math.floor(Math.random() * 10000) });
        } else if (selectedFunction === 'getNote') {
          setResult({
            id: inputs.noteId,
            author: '0x' + Math.random().toString(16).substring(2, 42),
            content: 'Sample note content from blockchain',
            timestamp: Date.now() - Math.random() * 86400000,
            likes: Math.floor(Math.random() * 1000),
          });
        } else if (selectedFunction === 'getUserProfile') {
          setResult({
            address: inputs.userAddress,
            displayName: 'Alice Creator',
            bio: 'Web3 enthusiast',
            followers: Math.floor(Math.random() * 10000),
            following: Math.floor(Math.random() * 5000),
          });
        } else if (selectedFunction === 'isFollowing') {
          setResult({ isFollowing: Math.random() > 0.5 });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <FileCode className="w-12 h-12 text-blue-500" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Contract Interaction
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Interact directly with the NoteBoard smart contract
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Function List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Functions
              </h2>

              {/* Read Functions */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Read Functions
                </h3>
                <div className="space-y-2">
                  {contractFunctions
                    .filter((fn) => fn.type === 'read')
                    .map((fn) => (
                      <button
                        key={fn.name}
                        onClick={() => {
                          setSelectedFunction(fn.name);
                          setInputs({});
                          setResult(null);
                          setError(null);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                          selectedFunction === fn.name
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-2 border-green-500'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="font-semibold">{fn.name}</div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Write Functions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Write Functions
                </h3>
                <div className="space-y-2">
                  {contractFunctions
                    .filter((fn) => fn.type === 'write')
                    .map((fn) => (
                      <button
                        key={fn.name}
                        onClick={() => {
                          setSelectedFunction(fn.name);
                          setInputs({});
                          setResult(null);
                          setError(null);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                          selectedFunction === fn.name
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="font-semibold">{fn.name}</div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {selectedFn ? (
              <>
                {/* Function Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded font-semibold text-sm ${
                        selectedFn.type === 'read'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {selectedFn.type.toUpperCase()}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedFn.name}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{selectedFn.description}</p>
                </div>

                {/* Inputs */}
                {selectedFn.inputs.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Parameters
                    </h3>
                    <div className="space-y-4">
                      {selectedFn.inputs.map((input) => (
                        <div key={input.name}>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {input.name}
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              ({input.type})
                            </span>
                          </label>
                          {input.type === 'string' && input.name === 'content' ? (
                            <textarea
                              value={inputs[input.name] || ''}
                              onChange={(e) => handleInputChange(input.name, e.target.value)}
                              placeholder={input.placeholder}
                              rows={4}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                          ) : (
                            <input
                              type="text"
                              value={inputs[input.name] || ''}
                              onChange={(e) => handleInputChange(input.name, e.target.value)}
                              placeholder={input.placeholder}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Execute Button */}
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {isExecuting ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      {selectedFn.type === 'write' ? 'Sending Transaction...' : 'Reading...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      {selectedFn.type === 'write' ? 'Send Transaction' : 'Query'}
                    </>
                  )}
                </button>

                {/* Result */}
                {result && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Success</h3>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 font-mono text-sm">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                    {result.txHash && (
                      <a
                        href={`https://basescan.org/tx/${result.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View on Block Explorer
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Error
                        </h3>
                        <p className="text-red-700 dark:text-red-300">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <FileCode className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Function
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a function from the left to interact with the smart contract
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contract Info */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Contract Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Network:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">Base</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Contract Address:</span>
              <code className="ml-2 text-blue-600 dark:text-blue-400 font-mono text-xs">
                0x1234...5678
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

