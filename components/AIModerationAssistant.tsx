'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface ContentAnalysis {
  contentId: string;
  content: string;
  author: string;
  analysisTimestamp: number;
  toxicityScore: number;
  sentimentScore: number;
  categories: {
    spam: number;
    harassment: number;
    hateSpeech: number;
    violence: number;
    explicitContent: number;
    misinformation: number;
  };
  recommendation: 'approve' | 'review' | 'flag' | 'remove';
  confidence: number;
  suggestedAction: string;
  reasoning: string[];
}

interface ModerationStats {
  totalAnalyzed: number;
  flaggedContent: number;
  autoApproved: number;
  humanReviewNeeded: number;
  accuracy: number;
}

export default function AIModerationAssistant() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [analyses, setAnalyses] = useState<ContentAnalysis[]>([]);
  const [stats, setStats] = useState<ModerationStats>({
    totalAnalyzed: 0,
    flaggedContent: 0,
    autoApproved: 0,
    humanReviewNeeded: 0,
    accuracy: 0,
  });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [testContent, setTestContent] = useState('');
  const [filter, setFilter] = useState<'all' | 'flagged' | 'review'>('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState<ContentAnalysis | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      const mockAnalyses: ContentAnalysis[] = [
        {
          contentId: 'note_123',
          content: 'Check out this amazing DeFi project! Guaranteed 1000% returns! 🚀',
          author: '0x1234567890123456789012345678901234567890',
          analysisTimestamp: Date.now() - 3600000,
          toxicityScore: 0.15,
          sentimentScore: 0.8,
          categories: {
            spam: 0.85,
            harassment: 0.05,
            hateSpeech: 0.02,
            violence: 0.01,
            explicitContent: 0.03,
            misinformation: 0.72,
          },
          recommendation: 'flag',
          confidence: 0.87,
          suggestedAction: 'Remove content and warn user',
          reasoning: [
            'High spam score detected',
            'Unrealistic financial claims',
            'Potential scam indicators',
          ],
        },
        {
          contentId: 'note_456',
          content: 'Just deployed my first smart contract on Base! Really excited about Web3 development.',
          author: '0x9876543210987654321098765432109876543210',
          analysisTimestamp: Date.now() - 7200000,
          toxicityScore: 0.02,
          sentimentScore: 0.95,
          categories: {
            spam: 0.05,
            harassment: 0.01,
            hateSpeech: 0.01,
            violence: 0.01,
            explicitContent: 0.01,
            misinformation: 0.03,
          },
          recommendation: 'approve',
          confidence: 0.96,
          suggestedAction: 'Auto-approve',
          reasoning: [
            'Positive sentiment detected',
            'No harmful content',
            'Genuine engagement',
          ],
        },
        {
          contentId: 'note_789',
          content: 'This user is an idiot and should be banned from the platform immediately.',
          author: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          analysisTimestamp: Date.now() - 10800000,
          toxicityScore: 0.88,
          sentimentScore: -0.75,
          categories: {
            spam: 0.12,
            harassment: 0.92,
            hateSpeech: 0.45,
            violence: 0.08,
            explicitContent: 0.05,
            misinformation: 0.05,
          },
          recommendation: 'remove',
          confidence: 0.94,
          suggestedAction: 'Remove content immediately',
          reasoning: [
            'Personal attack detected',
            'High toxicity score',
            'Violates community guidelines',
          ],
        },
      ];

      setAnalyses(mockAnalyses);
      setStats({
        totalAnalyzed: 1247,
        flaggedContent: 89,
        autoApproved: 1089,
        humanReviewNeeded: 69,
        accuracy: 94.5,
      });
      setLoading(false);
    };

    loadData();
  }, []);

  const handleAnalyzeContent = async () => {
    if (!testContent.trim()) {
      alert(t('enterContentToAnalyze'));
      return;
    }

    setAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate AI analysis
    const hasSpamWords = /guaranteed|returns|profit|investment|opportunity/i.test(testContent);
    const hasToxicWords = /idiot|stupid|hate|kill|attack/i.test(testContent);
    const isPositive = /love|great|amazing|awesome|excited/i.test(testContent);

    const analysis: ContentAnalysis = {
      contentId: `test_${Date.now()}`,
      content: testContent,
      author: address || '0x0000000000000000000000000000000000000000',
      analysisTimestamp: Date.now(),
      toxicityScore: hasToxicWords ? 0.75 : hasSpamWords ? 0.35 : 0.05,
      sentimentScore: isPositive ? 0.85 : hasToxicWords ? -0.65 : 0.15,
      categories: {
        spam: hasSpamWords ? 0.78 : 0.08,
        harassment: hasToxicWords ? 0.82 : 0.03,
        hateSpeech: hasToxicWords ? 0.45 : 0.02,
        violence: hasToxicWords ? 0.15 : 0.01,
        explicitContent: 0.02,
        misinformation: hasSpamWords ? 0.65 : 0.05,
      },
      recommendation: hasToxicWords ? 'remove' : hasSpamWords ? 'flag' : 'approve',
      confidence: 0.89,
      suggestedAction: hasToxicWords
        ? 'Remove and warn user'
        : hasSpamWords
        ? 'Flag for review'
        : 'Approve',
      reasoning: hasToxicWords
        ? ['High toxicity detected', 'Potential harassment']
        : hasSpamWords
        ? ['Spam indicators found', 'Unrealistic claims']
        : ['Content appears safe', 'No violations detected'],
    };

    setAnalyses([analysis, ...analyses]);
    setAnalyzing(false);
    setSelectedAnalysis(analysis);
  };

  const getRecommendationColor = (recommendation: string) => {
    const colors = {
      approve: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      review: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      flag: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      remove: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };
    return colors[recommendation as keyof typeof colors] || colors.review;
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-red-600 dark:text-red-400';
    if (score >= 0.4) return 'text-orange-600 dark:text-orange-400';
    if (score >= 0.2) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const filteredAnalyses = analyses.filter((a) => {
    if (filter === 'flagged') return a.recommendation === 'flag' || a.recommendation === 'remove';
    if (filter === 'review') return a.recommendation === 'review';
    return true;
  });

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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToAccessAI')}</p>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-3xl">🤖</span>
            {t('aiModerationAssistant')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('aiPoweredContentModeration')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('totalAnalyzed')}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalAnalyzed.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('flaggedContent')}</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.flaggedContent}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('autoApproved')}</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.autoApproved}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('reviewNeeded')}</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.humanReviewNeeded}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('accuracy')}</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.accuracy}%</p>
        </div>
      </div>

      {/* Test Content Analyzer */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <h3 className="text-xl font-bold mb-4">{t('testContentAnalyzer')}</h3>
        <textarea
          value={testContent}
          onChange={(e) => setTestContent(e.target.value)}
          placeholder={t('enterContentToTest')}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border-2 border-white/30 focus:border-white focus:outline-none"
        />
        <button
          onClick={handleAnalyzeContent}
          disabled={analyzing}
          className="mt-4 w-full px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {analyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              {t('analyzing')}...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {t('analyzeContent')}
            </>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'flagged', 'review'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t(f)}
          </button>
        ))}
      </div>

      {/* Analyses List */}
      <div className="space-y-4">
        {filteredAnalyses.map((analysis) => (
          <div
            key={analysis.contentId}
            onClick={() => setSelectedAnalysis(analysis)}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(
                  analysis.recommendation
                )}`}
              >
                {analysis.recommendation.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(analysis.analysisTimestamp).toLocaleString()}
              </span>
            </div>

            <p className="text-gray-900 dark:text-white mb-3 line-clamp-2">{analysis.content}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('toxicity')}</p>
                <p className={`text-lg font-bold ${getScoreColor(analysis.toxicityScore)}`}>
                  {(analysis.toxicityScore * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('confidence')}</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {(analysis.confidence * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('spam')}</p>
                <p className={`text-lg font-bold ${getScoreColor(analysis.categories.spam)}`}>
                  {(analysis.categories.spam * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('harassment')}</p>
                <p className={`text-lg font-bold ${getScoreColor(analysis.categories.harassment)}`}>
                  {(analysis.categories.harassment * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>{t('suggestedAction')}:</strong> {analysis.suggestedAction}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Analysis Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('detailedAnalysis')}
              </h3>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Content */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('content')}:
                </p>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-900 dark:text-white">{selectedAnalysis.content}</p>
                </div>
              </div>

              {/* Recommendation */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('recommendation')}:
                </p>
                <span
                  className={`inline-block px-4 py-2 rounded-lg text-lg font-semibold ${getRecommendationColor(
                    selectedAnalysis.recommendation
                  )}`}
                >
                  {selectedAnalysis.recommendation.toUpperCase()}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {selectedAnalysis.suggestedAction}
                </p>
              </div>

              {/* Category Scores */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('categoryScores')}:
                </p>
                <div className="space-y-3">
                  {Object.entries(selectedAnalysis.categories).map(([category, score]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
                          {(score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            score >= 0.7
                              ? 'bg-red-500'
                              : score >= 0.4
                              ? 'bg-orange-500'
                              : score >= 0.2
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${score * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('reasoning')}:
                </p>
                <ul className="space-y-2">
                  {selectedAnalysis.reasoning.map((reason, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-blue-500 mt-1">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metadata */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('confidence')}:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {(selectedAnalysis.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('toxicity')}:</span>
                  <span className={`font-semibold ${getScoreColor(selectedAnalysis.toxicityScore)}`}>
                    {(selectedAnalysis.toxicityScore * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('sentiment')}:</span>
                  <span
                    className={`font-semibold ${
                      selectedAnalysis.sentimentScore > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {selectedAnalysis.sentimentScore > 0 ? 'Positive' : 'Negative'} (
                    {(selectedAnalysis.sentimentScore * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

