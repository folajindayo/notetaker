'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  balance?: string;
  price?: number;
}

interface SwapRoute {
  dex: string;
  icon: string;
  outputAmount: string;
  priceImpact: number;
  gasEstimate: string;
  path: string[];
}

interface SwapHistory {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  price: string;
  timestamp: number;
  txHash: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function TokenSwap() {
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const { t } = useTranslation();
  
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [routes, setRoutes] = useState<SwapRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<SwapRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [swapping, setSwapping] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState<'from' | 'to' | null>(null);
  const [slippage, setSlippage] = useState('0.5');
  const [history, setHistory] = useState<SwapHistory[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const loadTokens = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockTokens: Token[] = [
        {
          address: '0x0000000000000000000000000000000000000000',
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
          logoURI: '⚡',
          balance: ethBalance?.formatted || '0',
          price: 2000,
        },
        {
          address: '0x1234567890123456789012345678901234567890',
          symbol: 'NOTE',
          name: 'NoteBoard Token',
          decimals: 18,
          logoURI: '📝',
          balance: '5000',
          price: 0.25,
        },
        {
          address: '0x2345678901234567890123456789012345678901',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          logoURI: '💵',
          balance: '1000',
          price: 1,
        },
        {
          address: '0x3456789012345678901234567890123456789012',
          symbol: 'DAI',
          name: 'Dai Stablecoin',
          decimals: 18,
          logoURI: '💰',
          balance: '500',
          price: 1,
        },
        {
          address: '0x4567890123456789012345678901234567890123',
          symbol: 'WBTC',
          name: 'Wrapped Bitcoin',
          decimals: 8,
          logoURI: '₿',
          balance: '0.05',
          price: 45000,
        },
      ];

      const mockHistory: SwapHistory[] = [
        {
          id: '1',
          fromToken: 'ETH',
          toToken: 'NOTE',
          fromAmount: '0.5',
          toAmount: '4000',
          price: '8000',
          timestamp: Date.now() - 3600000,
          txHash: '0xabc123...',
          status: 'completed',
        },
        {
          id: '2',
          fromToken: 'NOTE',
          toToken: 'USDC',
          fromAmount: '1000',
          toAmount: '250',
          price: '0.25',
          timestamp: Date.now() - 7200000,
          txHash: '0xdef456...',
          status: 'completed',
        },
      ];

      setTokens(mockTokens);
      setFromToken(mockTokens[0]);
      setToToken(mockTokens[1]);
      setHistory(mockHistory);
      setLoading(false);
    };

    if (address) {
      loadTokens();
    }
  }, [address, ethBalance]);

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      findBestRoutes();
    }
  }, [fromAmount, fromToken, toToken]);

  const findBestRoutes = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setRoutes([]);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockRoutes: SwapRoute[] = [
      {
        dex: 'Uniswap V3',
        icon: '🦄',
        outputAmount: (parseFloat(fromAmount) * 8000).toFixed(2),
        priceImpact: 0.15,
        gasEstimate: '0.003',
        path: [fromToken!.symbol, toToken!.symbol],
      },
      {
        dex: 'SushiSwap',
        icon: '🍣',
        outputAmount: (parseFloat(fromAmount) * 7950).toFixed(2),
        priceImpact: 0.28,
        gasEstimate: '0.0025',
        path: [fromToken!.symbol, 'USDC', toToken!.symbol],
      },
      {
        dex: 'Curve',
        icon: '🌀',
        outputAmount: (parseFloat(fromAmount) * 7980).toFixed(2),
        priceImpact: 0.18,
        gasEstimate: '0.0028',
        path: [fromToken!.symbol, toToken!.symbol],
      },
    ];

    setRoutes(mockRoutes);
    setSelectedRoute(mockRoutes[0]);
    setToAmount(mockRoutes[0].outputAmount);
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !selectedRoute) {
      alert(t('fillAllFields'));
      return;
    }

    if (parseFloat(fromAmount) > parseFloat(fromToken.balance || '0')) {
      alert(t('insufficientBalance'));
      return;
    }

    setSwapping(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const newSwap: SwapHistory = {
      id: Date.now().toString(),
      fromToken: fromToken.symbol,
      toToken: toToken.symbol,
      fromAmount,
      toAmount,
      price: (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4),
      timestamp: Date.now(),
      txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      status: 'completed',
    };

    setHistory([newSwap, ...history]);
    setSwapping(false);
    setFromAmount('');
    setToAmount('');
  };

  const handleTokenSwitch = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount('');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToSwap')}</p>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('tokenSwap')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('swapTokensAtBestRates')}
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          ⚙️
        </button>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('swapSettings')}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('slippageTolerance')} (%)
            </label>
            <div className="flex gap-2">
              {['0.1', '0.5', '1.0'].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    slippage === value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <input
                type="number"
                step="0.1"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Swap Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
        {/* From Token */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('from')}
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTokenSelector('from')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <span className="text-2xl">{fromToken?.logoURI}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{fromToken?.symbol}</span>
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <input
              type="number"
              step="0.01"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 px-4 py-2 text-2xl border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          {fromToken && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('balance')}: {parseFloat(fromToken.balance || '0').toFixed(4)} {fromToken.symbol}
            </p>
          )}
        </div>

        {/* Switch Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={handleTokenSwitch}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-transform hover:rotate-180"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Token */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('to')}
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTokenSelector('to')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <span className="text-2xl">{toToken?.logoURI}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{toToken?.symbol}</span>
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <input
              type="text"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 px-4 py-2 text-2xl border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white"
            />
          </div>
          {toToken && fromAmount && toAmount && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              1 {fromToken?.symbol} ≈ {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4)} {toToken.symbol}
            </p>
          )}
        </div>

        {/* Routes */}
        {routes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('bestRoutes')}
            </h3>
            <div className="space-y-2">
              {routes.map((route, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedRoute(route);
                    setToAmount(route.outputAmount);
                  }}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedRoute?.dex === route.dex
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{route.icon}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{route.dex}</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {route.outputAmount} {toToken?.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{t('priceImpact')}: {route.priceImpact}%</span>
                    <span>{t('gas')}: ~{route.gasEstimate} ETH</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {route.path.map((token, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {token}
                        </span>
                        {idx < route.path.length - 1 && <span className="text-xs">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={swapping || !fromAmount || !toAmount || parseFloat(fromAmount) <= 0}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {swapping ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              {t('swapping')}...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {t('swap')}
            </>
          )}
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('recentSwaps')}</h3>
          {history.map((swap) => (
            <div
              key={swap.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {swap.fromAmount} {swap.fromToken}
                  </span>
                  <span className="text-gray-500">→</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {swap.toAmount} {swap.toToken}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(swap.status)}`}>
                  {swap.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{new Date(swap.timestamp).toLocaleString()}</span>
                <span className="font-mono text-xs">{swap.txHash}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Token Selector Modal */}
      {showTokenSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('selectToken')}</h3>
              <button
                onClick={() => setShowTokenSelector(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tokens.map((token) => (
                <div
                  key={token.address}
                  onClick={() => {
                    if (showTokenSelector === 'from') {
                      setFromToken(token);
                    } else {
                      setToToken(token);
                    }
                    setShowTokenSelector(null);
                  }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{token.logoURI}</span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{token.symbol}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {parseFloat(token.balance || '0').toFixed(4)}
                    </p>
                    {token.price && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        ${token.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

