'use client';

import { useState } from 'react';
import { Download, FileText, Image, MessageSquare, Users, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface ExportOptions {
  notes: boolean;
  replies: boolean;
  likes: boolean;
  followers: boolean;
  following: boolean;
  bookmarks: boolean;
  media: boolean;
  profile: boolean;
  communities: boolean;
  rewards: boolean;
}

export default function ExportDataPage() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    notes: true,
    replies: true,
    likes: true,
    followers: true,
    following: true,
    bookmarks: true,
    media: false,
    profile: true,
    communities: true,
    rewards: true,
  });

  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const dataCategories = [
    {
      key: 'notes' as keyof ExportOptions,
      label: 'Notes',
      description: 'All your posted notes and threads',
      icon: FileText,
      estimatedSize: '2.4 MB',
      count: 342,
    },
    {
      key: 'replies' as keyof ExportOptions,
      label: 'Replies',
      description: 'Comments and replies to other notes',
      icon: MessageSquare,
      estimatedSize: '1.1 MB',
      count: 567,
    },
    {
      key: 'likes' as keyof ExportOptions,
      label: 'Likes',
      description: 'Notes you\'ve liked',
      icon: CheckCircle,
      estimatedSize: '156 KB',
      count: 1234,
    },
    {
      key: 'followers' as keyof ExportOptions,
      label: 'Followers',
      description: 'Accounts following you',
      icon: Users,
      estimatedSize: '89 KB',
      count: 456,
    },
    {
      key: 'following' as keyof ExportOptions,
      label: 'Following',
      description: 'Accounts you follow',
      icon: Users,
      estimatedSize: '67 KB',
      count: 234,
    },
    {
      key: 'bookmarks' as keyof ExportOptions,
      label: 'Bookmarks',
      description: 'Saved notes',
      icon: FileText,
      estimatedSize: '234 KB',
      count: 89,
    },
    {
      key: 'media' as keyof ExportOptions,
      label: 'Media Files',
      description: 'Images and videos from your notes',
      icon: Image,
      estimatedSize: '145 MB',
      count: 78,
    },
    {
      key: 'profile' as keyof ExportOptions,
      label: 'Profile Data',
      description: 'Your profile information and settings',
      icon: Users,
      estimatedSize: '45 KB',
      count: 1,
    },
    {
      key: 'communities' as keyof ExportOptions,
      label: 'Communities',
      description: 'Communities you\'ve joined',
      icon: Users,
      estimatedSize: '123 KB',
      count: 12,
    },
    {
      key: 'rewards' as keyof ExportOptions,
      label: 'Rewards History',
      description: 'Points and earnings history',
      icon: CheckCircle,
      estimatedSize: '78 KB',
      count: 245,
    },
  ];

  const toggleOption = (key: keyof ExportOptions) => {
    setExportOptions({ ...exportOptions, [key]: !exportOptions[key] });
  };

  const toggleAll = () => {
    const allSelected = Object.values(exportOptions).every((v) => v);
    const newOptions = Object.keys(exportOptions).reduce((acc, key) => {
      acc[key as keyof ExportOptions] = !allSelected;
      return acc;
    }, {} as ExportOptions);
    setExportOptions(newOptions);
  };

  const calculateTotalSize = () => {
    let totalBytes = 0;
    dataCategories.forEach((cat) => {
      if (exportOptions[cat.key]) {
        const sizeStr = cat.estimatedSize;
        const value = parseFloat(sizeStr);
        if (sizeStr.includes('MB')) {
          totalBytes += value * 1024 * 1024;
        } else if (sizeStr.includes('KB')) {
          totalBytes += value * 1024;
        }
      }
    });

    if (totalBytes > 1024 * 1024) {
      return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(totalBytes / 1024).toFixed(0)} KB`;
  };

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // In a real app, this would:
    // 1. Fetch data from smart contract
    // 2. Retrieve media from IPFS
    // 3. Format data according to selected format
    // 4. Create downloadable file

    console.log('Exporting data:', exportOptions, format);

    setIsExporting(false);
    setExportComplete(true);

    // Simulate download
    setTimeout(() => {
      setExportComplete(false);
    }, 5000);
  };

  const selectedCount = Object.values(exportOptions).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Export Your Data</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Download a copy of your NoteBoard data for backup or migration
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                About Data Export
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>✅ All data is retrieved directly from the blockchain and IPFS</li>
                <li>✅ Your private keys are never included in the export</li>
                <li>✅ Media files are downloaded from decentralized storage</li>
                <li>✅ Export is GDPR compliant and portable</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Export Success */}
        {exportComplete && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Export Complete!
                </h3>
                <p className="text-sm text-green-800 dark:text-green-300 mb-3">
                  Your data has been exported successfully. The download should start automatically.
                </p>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Download Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Format Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Export Format</h2>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                format === 'json'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="format"
                value="json"
                checked={format === 'json'}
                onChange={(e) => setFormat(e.target.value as 'json' | 'csv')}
                className="w-5 h-5 text-green-500 focus:ring-2 focus:ring-green-500"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">JSON</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Best for full data structure
                </div>
              </div>
            </label>

            <label
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                format === 'csv'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="format"
                value="csv"
                checked={format === 'csv'}
                onChange={(e) => setFormat(e.target.value as 'json' | 'csv')}
                className="w-5 h-5 text-green-500 focus:ring-2 focus:ring-green-500"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">CSV</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Easy to open in spreadsheets
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Data Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Select Data to Export
              </h2>
              <button
                onClick={toggleAll}
                className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors font-medium"
              >
                {Object.values(exportOptions).every((v) => v) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {dataCategories.map((category) => {
              const Icon = category.icon;
              return (
                <label
                  key={category.key}
                  className="flex items-center gap-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={exportOptions[category.key]}
                    onChange={() => toggleOption(category.key)}
                    className="w-5 h-5 text-green-500 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <div className="p-3 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                    <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {category.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {category.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.count.toLocaleString()} items
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {category.estimatedSize}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Export Summary & Action */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Export Size</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {calculateTotalSize()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Selected Categories</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCount} / {dataCategories.length}
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={selectedCount === 0 || isExporting}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Preparing Export...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export {selectedCount > 0 ? `${selectedCount} Categories` : 'Data'}
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            By exporting your data, you agree that this is for personal use and backup purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}

