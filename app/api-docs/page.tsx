'use client';

import { useState } from 'react';
import { Code, Book, Key, Zap, Shield, ExternalLink, Copy, Check } from 'lucide-react';

export default function ApiDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      category: 'Notes',
      endpoints: [
        {
          id: 'get-notes',
          method: 'GET',
          path: '/api/notes',
          description: 'Retrieve all notes with pagination',
          params: [
            { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
            { name: 'limit', type: 'number', required: false, description: 'Items per page (default: 20)' },
          ],
          response: `{
  "notes": [
    {
      "id": "1",
      "author": "0x1234...",
      "content": "Hello Web3!",
      "timestamp": 1699123456,
      "likes": 42
    }
  ],
  "total": 100,
  "page": 1
}`,
        },
        {
          id: 'post-note',
          method: 'POST',
          path: '/api/notes',
          description: 'Create a new note',
          body: `{
  "content": "string (required)",
  "mediaUrl": "string (optional)",
  "pollOptions": ["string"] (optional)
}`,
          response: `{
  "noteId": "123",
  "txHash": "0xabc...",
  "timestamp": 1699123456
}`,
        },
        {
          id: 'get-note',
          method: 'GET',
          path: '/api/notes/:id',
          description: 'Get a specific note by ID',
          response: `{
  "id": "1",
  "author": "0x1234...",
  "content": "Hello Web3!",
  "timestamp": 1699123456,
  "likes": 42,
  "replies": 5
}`,
        },
      ],
    },
    {
      category: 'Users',
      endpoints: [
        {
          id: 'get-profile',
          method: 'GET',
          path: '/api/users/:address',
          description: 'Get user profile by wallet address',
          response: `{
  "address": "0x1234...",
  "displayName": "Alice",
  "bio": "Web3 builder",
  "followers": 1234,
  "following": 567,
  "isVerified": true
}`,
        },
        {
          id: 'update-profile',
          method: 'PUT',
          path: '/api/users/:address',
          description: 'Update user profile',
          body: `{
  "displayName": "string (optional)",
  "bio": "string (optional)",
  "avatarUrl": "string (optional)"
}`,
          response: `{
  "success": true,
  "txHash": "0xabc..."
}`,
        },
      ],
    },
    {
      category: 'Social',
      endpoints: [
        {
          id: 'follow-user',
          method: 'POST',
          path: '/api/users/:address/follow',
          description: 'Follow a user',
          response: `{
  "success": true,
  "txHash": "0xabc..."
}`,
        },
        {
          id: 'like-note',
          method: 'POST',
          path: '/api/notes/:id/like',
          description: 'Like a note',
          response: `{
  "success": true,
  "txHash": "0xabc..."
}`,
        },
      ],
    },
  ];

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      POST: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      PUT: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
      DELETE: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    };
    return colors[method] || 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Book className="w-12 h-12 text-blue-500" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">API Documentation</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Integrate NoteBoard into your applications with our REST API
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Quick Start</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Key className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg mb-2">1. Get API Key</h3>
              <p className="text-sm text-white/90">
                Generate your API key from the developer dashboard
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Code className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg mb-2">2. Make Requests</h3>
              <p className="text-sm text-white/90">
                Use REST endpoints to interact with the platform
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Zap className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg mb-2">3. Go Live</h3>
              <p className="text-sm text-white/90">
                Start building amazing Web3 applications
              </p>
            </div>
          </div>
        </div>

        {/* Base URL */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Base URL</h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex items-center justify-between">
            <code className="text-lg text-blue-600 dark:text-blue-400 font-mono">
              https://api.noteboard.io/v1
            </code>
            <button
              onClick={() => copyToClipboard('https://api.noteboard.io/v1', 'base-url')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {copiedEndpoint === 'base-url' ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Authentication</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Include your API key in the request header:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 font-mono text-sm">
              {`Authorization: Bearer YOUR_API_KEY`}
            </pre>
          </div>
        </div>

        {/* Endpoints */}
        {endpoints.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {section.category}
            </h2>
            <div className="space-y-6">
              {section.endpoints.map((endpoint) => (
                <div
                  key={endpoint.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                >
                  {/* Endpoint Header */}
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded font-semibold text-sm ${getMethodColor(
                            endpoint.method
                          )}`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-lg font-mono text-gray-900 dark:text-white">
                          {endpoint.path}
                        </code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(endpoint.path, endpoint.id)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {copiedEndpoint === endpoint.id ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{endpoint.description}</p>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Parameters */}
                    {endpoint.params && endpoint.params.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Parameters
                        </h4>
                        <div className="space-y-2">
                          {endpoint.params.map((param, paramIndex) => (
                            <div
                              key={paramIndex}
                              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                            >
                              <code className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                                {param.name}
                              </code>
                              <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                {param.type}
                              </span>
                              {param.required && (
                                <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                                  required
                                </span>
                              )}
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {param.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Request Body */}
                    {endpoint.body && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Request Body
                        </h4>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-green-400 font-mono text-sm">{endpoint.body}</pre>
                        </div>
                      </div>
                    )}

                    {/* Response */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Response</h4>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 font-mono text-sm">{endpoint.response}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Rate Limits */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rate Limits</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>• Free Tier: 100 requests per minute</li>
            <li>• Pro Tier: 1,000 requests per minute</li>
            <li>• Enterprise: Custom limits available</li>
          </ul>
        </div>

        {/* SDK & Libraries */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            SDKs & Libraries
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'JavaScript/TypeScript', icon: '📦' },
              { name: 'Python', icon: '🐍' },
              { name: 'Go', icon: '🔵' },
            ].map((sdk, index) => (
              <a
                key={index}
                href="#"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sdk.icon}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{sdk.name}</span>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Need Help?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Join our developer community or check out the full documentation
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/help"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              View Full Docs
            </a>
            <a
              href="#"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

