'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { formatEther } from 'viem';

interface GasPrice {
  slow: number;
  standard: number;
  fast: number;
  instant: number;
}

interface GasEstimate {
  action: string;
  gasLimit: number;
  slowCost: string;
  standardCost: string;
  fastCost: string;
  instantCost: string;
}

interface GasTrend {
  timestamp: number;
  price: number;
}

export default function GasTracker() {
  const { t } = useTranslation();
  const [gasPrices, setGasPrices] = useState<GasPrice>({
    slow: 0.5,
    standard: 1.2,
    fast: 2.5,
    instant: 4.0,
  });
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'standard' | 'fast' | 'instant'>('standard');
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [history, setHistory] = useState<GasTrend[]>([]);
  const [ethPrice, setEthPrice] = useState(2000);

  // Common transaction gas estimates
  const estimates: GasEstimate[] = [
    {
      action: 'Post Note',
      gasLimit: 100000,
      slowCost: ((gasPrices.slow * 100000) / 1e9).toFixed(4),
      standardCost: ((gasPrices.standard * 100000) / 1e9).toFixed(4),
      fastCost: ((gasPrices.fast * 100000) / 1e9).toFixed(4),
      instantCost: ((gasPrices.instant * 100000) / 1e9).toFixed(4),
    },
    {
      action: 'Like/Reply',
      gasLimit: 50000,
      slowCost: ((gasPrices.slow * 50000) / 1e9).toFixed(4),
      standardCost: ((gasPrices.standard * 50000) / 1e9).toFixed(4),
      fastCost: ((gasPrices.fast * 50000) / 1e9).toFixed(4),
      instantCost: ((gasPrices.instant * 50000) / 1e9).toFixed(4),
    },
    {
      action: 'Send Tip',
      gasLimit: 21000,
      slowCost: ((gasPrices.slow * 21000) / 1e9).toFixed(4),
      standardCost: ((gasPrices.standard * 21000) / 1e9).toFixed(4),
      fastCost: ((gasPrices.fast * 21000) / 1e9).toFixed(4),
      instantCost: ((gasPrices.instant * 21000) / 1e9).toFixed(4),
    },
    {
      action: 'Vote on Poll',
      gasLimit: 80000,
      slowCost: ((gasPrices.slow * 80000) / 1e9).toFixed(4),
      standardCost: ((gasPrices.standard * 80000) / 1e9).toFixed(4),
      fastCost: ((gasPrices.fast * 80000) / 1e9).toFixed(4),
      instantCost: ((gasPrices.instant * 80000) / 1e9).toFixed(4),
    },
  ];

  useEffect(() => {
    const fetchGasPrices = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate realistic gas prices with some randomness
      const baseGas = 0.5 + Math.random() * 2;
      setGasPrices({
        slow: Number(baseGas.toFixed(2)),
        standard: Number((baseGas * 2.4).toFixed(2)),
        fast: Number((baseGas * 5).toFixed(2)),
        instant: Number((baseGas * 8).toFixed(2)),
      });

      // Generate history
      const now = Date.now();
      const historyData: GasTrend[] = Array.from({ length: 24 }, (_, i) => ({
        timestamp: now - (23 - i) * 3600000,
        price: baseGas + Math.random() * 2 - 1,
      }));
      setHistory(historyData);

      // Determine trend
      if (historyData.length >= 2) {
        const recent = historyData.slice(-3).reduce((sum, d) => sum + d.price, 0) / 3;
        const older = historyData.slice(-6, -3).reduce((sum, d) => sum + d.price, 0) / 3;
        setTrend(recent > older * 1.1 ? 'up' : recent < older * 0.9 ? 'down' : 'stable');
      }

      setEthPrice(2000 + Math.random() * 200 - 100);
      setLoading(false);
    };

    fetchGasPrices();
    const interval = setInterval(fetchGasPrices, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const getSpeedColor = (speed: string) => {
    const colors = {
      slow: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700',
      standard: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
      fast: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
      instant: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
    };
    return colors[speed as keyof typeof colors] || colors.standard;
  };

  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <span className="flex items-center text-red-600 dark:text-red-400">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {t('increasing')}
        </span>
      );
    } else if (trend === 'down') {
      return (
        <span className="flex items-center text-green-600 dark:text-green-400">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {t('decreasing')}
        </span>
      );
    }
    return (
      <span className="flex items-center text-gray-600 dark:text-gray-400">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
        {t('stable')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('gasTracker')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('realTimeGasPrices')} · Base Network
          </p>
        </div>
        <div className="text-sm">{getTrendIcon()}</div>
      </div>

      {/* Gas Price Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['slow', 'standard', 'fast', 'instant'] as const).map((speed) => (
          <button
            key={speed}
            onClick={() => setSelectedSpeed(speed)}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedSpeed === speed
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
            } ${getSpeedColor(speed)}`}
          >
            <div className="text-center">
              <div className="text-xs font-medium uppercase mb-2">{t(speed)}</div>
              <div className="text-3xl font-bold mb-1">{gasPrices[speed]}</div>
              <div className="text-xs opacity-75">Gwei</div>
              <div className="text-xs mt-2 opacity-75">
                ~{speed === 'slow' ? '5' : speed === 'standard' ? '2' : speed === 'fast' ? '30' : '15'}s
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Gas Price Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('gasPriceHistory')} (24h)
        </h3>
        <div className="h-48 flex items-end justify-between gap-1">
          {history.map((point, index) => {
            const maxPrice = Math.max(...history.map((h) => h.price));
            const height = (point.price / maxPrice) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div
                  className="w-full bg-blue-500 hover:bg-blue-600 rounded-t transition-all cursor-pointer"
                  style={{ height: `${height}%`, minHeight: '4px' }}
                  title={`${point.price.toFixed(2)} Gwei`}
                ></div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>24h ago</span>
          <span>Now</span>
        </div>
      </div>

      {/* Transaction Cost Estimates */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('estimatedCosts')} ({selectedSpeed})
        </h3>
        <div className="space-y-3">
          {estimates.map((estimate) => {
            const cost =
              selectedSpeed === 'slow'
                ? estimate.slowCost
                : selectedSpeed === 'standard'
                ? estimate.standardCost
                : selectedSpeed === 'fast'
                ? estimate.fastCost
                : estimate.instantCost;
            const usdCost = (parseFloat(cost) * ethPrice).toFixed(2);

            return (
              <div
                key={estimate.action}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{estimate.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Gas Limit: {estimate.gasLimit.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">{cost} ETH</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">≈ ${usdCost}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          {t('gasOptimizationTips')}
        </h3>
        <ul className="space-y-2 text-sm text-purple-100">
          <li className="flex items-start gap-2">
            <span className="text-white">•</span>
            <span>{t('tip1Transaction')}: {t('batchTransactions')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white">•</span>
            <span>{t('tip2Timing')}: {t('transactDuringLowUsage')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white">•</span>
            <span>{t('tip3Speed')}: {t('useStandardForNonUrgent')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white">•</span>
            <span>{t('tip4Layer2')}: {t('considerLayer2Solutions')}</span>
          </li>
        </ul>
      </div>

      {/* Current Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('avgBlockTime')}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">2.1s</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('networkStatus')}</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{t('healthy')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ETH {t('price')}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${ethPrice.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

