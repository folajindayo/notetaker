'use client';

import { useState } from 'react';
import { Activity, Zap, Users, MessageSquare, TrendingUp, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function StatusPage() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  const systemStatus = {
    overall: 'operational',
    services: [
      {
        name: 'Smart Contract',
        status: 'operational',
        uptime: 99.99,
        latency: '12ms',
        description: 'Base blockchain contract interactions',
      },
      {
        name: 'API Server',
        status: 'operational',
        uptime: 99.95,
        latency: '45ms',
        description: 'REST API and WebSocket connections',
      },
      {
        name: 'IPFS Storage',
        status: 'operational',
        uptime: 99.98,
        latency: '180ms',
        description: 'Decentralized media storage',
      },
      {
        name: 'Database',
        status: 'operational',
        uptime: 99.97,
        latency: '8ms',
        description: 'Off-chain data and caching',
      },
      {
        name: 'CDN',
        status: 'operational',
        uptime: 100,
        latency: '25ms',
        description: 'Content delivery network',
      },
    ],
    incidents: [
      {
        id: '1',
        title: 'Scheduled Maintenance - Smart Contract Upgrade',
        status: 'resolved',
        severity: 'maintenance',
        date: 'Nov 3, 2025',
        duration: '2 hours',
        description: 'Upgraded smart contract with new features. All services restored.',
      },
      {
        id: '2',
        title: 'Intermittent IPFS Connectivity',
        status: 'resolved',
        severity: 'minor',
        date: 'Oct 28, 2025',
        duration: '45 minutes',
        description: 'Brief connectivity issues with IPFS gateway. Resolved by switching gateways.',
      },
    ],
  };

  const metrics = {
    '24h': {
      users: 12450,
      notes: 8934,
      transactions: 15230,
      gasUsed: '2.4 ETH',
    },
    '7d': {
      users: 45600,
      notes: 34210,
      transactions: 67890,
      gasUsed: '12.8 ETH',
    },
    '30d': {
      users: 156000,
      notes: 123450,
      transactions: 234560,
      gasUsed: '48.5 ETH',
    },
  };

  const currentMetrics = metrics[timeRange];

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; icon: any }> = {
      operational: {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-700 dark:text-green-300',
        icon: CheckCircle,
      },
      degraded: {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-700 dark:text-yellow-300',
        icon: AlertCircle,
      },
      outage: {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-700 dark:text-red-300',
        icon: AlertCircle,
      },
      maintenance: {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-700 dark:text-blue-300',
        icon: Clock,
      },
    };
    return colors[status] || colors.operational;
  };

  const getIncidentSeverity = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
      major: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
      minor: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
      maintenance: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    };
    return colors[severity] || colors.minor;
  };

  const overallColors = getStatusColor(systemStatus.overall);
  const OverallIcon = overallColors.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Activity className="w-12 h-12 text-blue-500" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">System Status</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Real-time platform health and performance metrics
          </p>
        </div>

        {/* Overall Status */}
        <div className={`${overallColors.bg} rounded-2xl p-8 mb-8 border-2 ${overallColors.text.replace('text-', 'border-')}`}>
          <div className="flex items-center justify-center gap-4">
            <OverallIcon className={`w-12 h-12 ${overallColors.text}`} />
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                All Systems {systemStatus.overall}
              </div>
              <div className={`text-lg ${overallColors.text}`}>
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Services Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {systemStatus.services.map((service, index) => {
              const statusInfo = getStatusColor(service.status);
              const StatusIcon = statusInfo.icon;
              return (
                <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {service.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text} flex items-center gap-1 capitalize`}>
                          <StatusIcon className="w-3 h-3" />
                          {service.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Uptime:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                            {service.uptime}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Latency:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                            {service.latency}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-24 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Metrics</h2>
            <div className="flex gap-2">
              {(['24h', '7d', '30d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    timeRange === range
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-6">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {currentMetrics.users.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl p-6">
              <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {currentMetrics.notes.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Notes Posted</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-xl p-6">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {currentMetrics.transactions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Transactions</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-xl p-6">
              <Zap className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {currentMetrics.gasUsed}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Gas Used</div>
            </div>
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Incidents</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {systemStatus.incidents.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Recent Incidents
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All systems have been running smoothly!
                </p>
              </div>
            ) : (
              systemStatus.incidents.map((incident) => (
                <div key={incident.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {incident.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getIncidentSeverity(incident.severity)} capitalize`}>
                          {incident.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {incident.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{incident.date}</span>
                        <span>•</span>
                        <span>Duration: {incident.duration}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold capitalize">
                      {incident.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Subscribe */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Stay Informed</h3>
          <p className="mb-4">Subscribe to get notified about system updates and incidents</p>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
            Subscribe to Updates
          </button>
        </div>
      </div>
    </div>
  );
}

