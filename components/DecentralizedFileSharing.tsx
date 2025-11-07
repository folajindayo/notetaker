'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface SharedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  cid: string; // IPFS Content Identifier
  owner: string;
  shared: boolean;
  sharedWith: string[];
  uploadedAt: number;
  downloads: number;
  encrypted: boolean;
  password?: string;
  expiresAt?: number;
}

interface AccessRequest {
  id: string;
  fileId: string;
  fileName: string;
  requester: string;
  requesterName: string;
  requestedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
}

export default function DecentralizedFileSharing() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [filePassword, setFilePassword] = useState('');
  const [shareWith, setShareWith] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedForShare, setSelectedForShare] = useState<SharedFile | null>(null);
  const [filter, setFilter] = useState<'all' | 'my' | 'shared'>('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockFiles: SharedFile[] = [
        {
          id: '1',
          name: 'project-whitepaper.pdf',
          size: '2.4 MB',
          type: 'application/pdf',
          cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
          owner: address || '',
          shared: true,
          sharedWith: ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'],
          uploadedAt: Date.now() - 7 * 24 * 3600000,
          downloads: 42,
          encrypted: false,
        },
        {
          id: '2',
          name: 'smart-contract-audit.pdf',
          size: '1.8 MB',
          type: 'application/pdf',
          cid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
          owner: '0x9876543210987654321098765432109876543210',
          shared: true,
          sharedWith: [address || ''],
          uploadedAt: Date.now() - 3 * 24 * 3600000,
          downloads: 18,
          encrypted: false,
        },
        {
          id: '3',
          name: 'confidential-data.zip',
          size: '15.2 MB',
          type: 'application/zip',
          cid: 'QmPDKm8CKhm9zfz8dZPKJcYH8j7HKjRAuW4zZ9QZZLxR9k',
          owner: address || '',
          shared: false,
          sharedWith: [],
          uploadedAt: Date.now() - 24 * 3600000,
          downloads: 0,
          encrypted: true,
          password: 'secret123',
        },
      ];

      const mockRequests: AccessRequest[] = [
        {
          id: '1',
          fileId: '1',
          fileName: 'project-whitepaper.pdf',
          requester: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          requesterName: 'alice.eth',
          requestedAt: Date.now() - 2 * 3600000,
          status: 'pending',
          message: 'Need this for my research project',
        },
      ];

      setFiles(mockFiles);
      setAccessRequests(mockRequests);
      setLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert(t('selectFile'));
      return;
    }

    setUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newFile: SharedFile = {
      id: Date.now().toString(),
      name: selectedFile.name,
      size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
      type: selectedFile.type,
      cid: `Qm${Math.random().toString(36).substring(2, 48)}`,
      owner: address || '',
      shared: false,
      sharedWith: [],
      uploadedAt: Date.now(),
      downloads: 0,
      encrypted: isEncrypted,
      password: isEncrypted ? filePassword : undefined,
    };

    setFiles([newFile, ...files]);
    setSelectedFile(null);
    setIsEncrypted(false);
    setFilePassword('');
    setUploading(false);
  };

  const handleShareFile = () => {
    if (!selectedForShare || !shareWith) {
      alert(t('enterAddress'));
      return;
    }

    setFiles(
      files.map((f) =>
        f.id === selectedForShare.id
          ? { ...f, shared: true, sharedWith: [...f.sharedWith, shareWith] }
          : f
      )
    );

    setShowShareModal(false);
    setShareWith('');
    setSelectedForShare(null);
  };

  const handleAccessRequest = (requestId: string, approved: boolean) => {
    const request = accessRequests.find((r) => r.id === requestId);
    if (!request) return;

    if (approved) {
      setFiles(
        files.map((f) =>
          f.id === request.fileId
            ? { ...f, shared: true, sharedWith: [...f.sharedWith, request.requester] }
            : f
        )
      );
    }

    setAccessRequests(
      accessRequests.map((r) =>
        r.id === requestId ? { ...r, status: approved ? 'approved' : 'rejected' } : r
      )
    );
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📁';
  };

  const filteredFiles = files.filter((file) => {
    if (filter === 'my') return file.owner === address;
    if (filter === 'shared') return file.sharedWith.includes(address || '');
    return true;
  });

  const myFiles = files.filter((f) => f.owner === address);
  const sharedFiles = files.filter((f) => f.sharedWith.includes(address || ''));
  const pendingRequests = accessRequests.filter((r) => r.status === 'pending');

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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToShare')}</p>
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('decentralizedFileSharing')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('shareFilesSecurely')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-xs opacity-90">{t('myFiles')}</p>
          <p className="text-2xl font-bold mt-1">{myFiles.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <p className="text-xs opacity-90">{t('sharedWithMe')}</p>
          <p className="text-2xl font-bold mt-1">{sharedFiles.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-xs opacity-90">{t('totalDownloads')}</p>
          <p className="text-2xl font-bold mt-1">
            {files.reduce((sum, f) => sum + f.downloads, 0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <p className="text-xs opacity-90">{t('pendingRequests')}</p>
          <p className="text-2xl font-bold mt-1">{pendingRequests.length}</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('uploadFile')}
        </h3>
        <div className="space-y-4">
          <div>
            <input
              type="file"
              onChange={handleFileSelect}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isEncrypted}
                onChange={(e) => setIsEncrypted(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('encrypt')}</span>
            </label>

            {isEncrypted && (
              <input
                type="password"
                value={filePassword}
                onChange={(e) => setFilePassword(e.target.value)}
                placeholder={t('password')}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading || (isEncrypted && !filePassword)}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? t('uploading') : t('uploadToIPFS')}
          </button>
        </div>
      </div>

      {/* Access Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('accessRequests')}
          </h3>
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {request.requesterName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {t('requestsAccessTo')}: <strong>{request.fileName}</strong>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                    "{request.message}"
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(request.requestedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccessRequest(request.id, true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                  >
                    {t('approve')}
                  </button>
                  <button
                    onClick={() => handleAccessRequest(request.id, false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                  >
                    {t('reject')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'my', 'shared'] as const).map((f) => (
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

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl">{getFileIcon(file.type)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {file.name}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{file.size}</p>
              </div>
              {file.encrypted && (
                <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded">
                  🔒
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex justify-between">
                <span>{t('cid')}:</span>
                <span className="font-mono truncate ml-2">{file.cid.substring(0, 12)}...</span>
              </div>
              <div className="flex justify-between">
                <span>{t('downloads')}:</span>
                <span>{file.downloads}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('uploaded')}:</span>
                <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
              </div>
              {file.shared && (
                <div className="flex justify-between">
                  <span>{t('sharedWith')}:</span>
                  <span>{file.sharedWith.length}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm">
                {t('download')}
              </button>
              {file.owner === address && (
                <button
                  onClick={() => {
                    setSelectedForShare(file);
                    setShowShareModal(true);
                  }}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm"
                >
                  {t('share')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {showShareModal && selectedForShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('shareFile')}: {selectedForShare.name}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('recipientAddress')}
              </label>
              <input
                type="text"
                value={shareWith}
                onChange={(e) => setShareWith(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                ℹ️ {t('fileWillBeShared')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setShareWith('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleShareFile}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                {t('share')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

