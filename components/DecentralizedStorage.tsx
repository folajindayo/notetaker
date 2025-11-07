'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface StorageFile {
  id: string;
  name: string;
  type: string;
  size: number;
  ipfsHash?: string;
  arweaveId?: string;
  uploadedAt: number;
  status: 'uploading' | 'completed' | 'failed';
  provider: 'ipfs' | 'arweave';
  cost?: string;
  permanent: boolean;
}

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  ipfsFiles: number;
  arweaveFiles: number;
  monthlyUsage: number;
}

export default function DecentralizedStorage() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [stats, setStats] = useState<StorageStats>({
    totalFiles: 0,
    totalSize: 0,
    ipfsFiles: 0,
    arweaveFiles: 0,
    monthlyUsage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'ipfs' | 'arweave'>('ipfs');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockFiles: StorageFile[] = [
        {
          id: '1',
          name: 'profile-picture.jpg',
          type: 'image/jpeg',
          size: 2547896,
          ipfsHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
          uploadedAt: Date.now() - 3600000,
          status: 'completed',
          provider: 'ipfs',
          permanent: false,
        },
        {
          id: '2',
          name: 'whitepaper.pdf',
          type: 'application/pdf',
          size: 5894632,
          arweaveId: 'jZiYEJArXLu_3kXxJk7EYmkKY8D9aTpBm8cQ-4jP8Qw',
          uploadedAt: Date.now() - 7200000,
          status: 'completed',
          provider: 'arweave',
          cost: '0.002',
          permanent: true,
        },
        {
          id: '3',
          name: 'video-tutorial.mp4',
          type: 'video/mp4',
          size: 125896325,
          ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
          uploadedAt: Date.now() - 10800000,
          status: 'completed',
          provider: 'ipfs',
          permanent: false,
        },
      ];

      setFiles(mockFiles);
      setStats({
        totalFiles: mockFiles.length,
        totalSize: mockFiles.reduce((sum, f) => sum + f.size, 0),
        ipfsFiles: mockFiles.filter((f) => f.provider === 'ipfs').length,
        arweaveFiles: mockFiles.filter((f) => f.provider === 'arweave').length,
        monthlyUsage: 0.045,
      });
      setLoading(false);
    };

    if (address) {
      loadFiles();
    }
  }, [address]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    await handleFileUpload(droppedFiles);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      await handleFileUpload(selectedFiles);
    }
  };

  const handleFileUpload = async (filesToUpload: File[]) => {
    setUploading(true);

    for (const file of filesToUpload) {
      const newFile: StorageFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: Date.now(),
        status: 'uploading',
        provider: selectedProvider,
        permanent: selectedProvider === 'arweave',
      };

      setFiles((prev) => [newFile, ...prev]);

      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update with hash
      setFiles((prev) =>
        prev.map((f) =>
          f.id === newFile.id
            ? {
                ...f,
                status: 'completed',
                ipfsHash:
                  selectedProvider === 'ipfs'
                    ? `Qm${Math.random().toString(36).substring(2, 15)}`
                    : undefined,
                arweaveId:
                  selectedProvider === 'arweave'
                    ? `${Math.random().toString(36).substring(2, 15)}`
                    : undefined,
                cost: selectedProvider === 'arweave' ? '0.001' : undefined,
              }
            : f
        )
      );
    }

    setUploading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type === 'application/pdf') return '📄';
    if (type.includes('zip') || type.includes('compressed')) return '📦';
    return '📁';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t('copiedToClipboard'));
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
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToAccess')}</p>
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
          {t('decentralizedStorage')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('storeFilesOnIPFSAndArweave')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('totalFiles')}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFiles}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('totalStorage')}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatFileSize(stats.totalSize)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">IPFS {t('files')}</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.ipfsFiles}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Arweave {t('files')}</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.arweaveFiles}
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('selectProvider')}
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedProvider('ipfs')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                selectedProvider === 'ipfs'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              <div className="text-3xl mb-2">📌</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">IPFS</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('freeTemporaryStorage')}
              </p>
            </button>
            <button
              onClick={() => setSelectedProvider('arweave')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                selectedProvider === 'arweave'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
              }`}
            >
              <div className="text-3xl mb-2">🌐</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Arweave</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('permanentStorage')} (~$0.001/MB)
              </p>
            </button>
          </div>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }`}
        >
          <div className="text-6xl mb-4">☁️</div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('dragAndDropFiles')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('or')}</p>
          <label className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer font-medium">
            {t('selectFiles')}
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {uploading && (
            <p className="mt-4 text-sm text-blue-600 dark:text-blue-400">
              {t('uploading')}...
            </p>
          )}
        </div>
      </div>

      {/* Files List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('yourFiles')}</h3>
        {files.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
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
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">{t('noFilesYet')}</p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        file.provider === 'ipfs'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      }`}
                    >
                      {file.provider.toUpperCase()}
                    </span>
                    {file.permanent && (
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-xs font-medium">
                        {t('permanent')}
                      </span>
                    )}
                  </div>
                  {file.status === 'uploading' && (
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full animate-pulse w-3/4"></div>
                    </div>
                  )}
                </div>
                {file.status === 'completed' && (
                  <svg
                    className="w-6 h-6 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* File Details Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('fileDetails')}
              </h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-5xl">{getFileIcon(selectedFile.type)}</div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                    {selectedFile.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedFile.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('size')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('provider')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedFile.provider.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('uploaded')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedFile.uploadedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('status')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">
                    {selectedFile.permanent ? t('permanent') : t('temporary')}
                  </p>
                </div>
              </div>

              {selectedFile.ipfsHash && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">IPFS {t('hash')}</p>
                  <div className="flex gap-2">
                    <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm text-gray-900 dark:text-white break-all">
                      {selectedFile.ipfsHash}
                    </code>
                    <button
                      onClick={() => copyToClipboard(selectedFile.ipfsHash!)}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {t('copy')}
                    </button>
                  </div>
                  <a
                    href={`https://ipfs.io/ipfs/${selectedFile.ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-600 mt-1 inline-block"
                  >
                    {t('viewOnIPFS')} →
                  </a>
                </div>
              )}

              {selectedFile.arweaveId && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Arweave ID</p>
                  <div className="flex gap-2">
                    <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm text-gray-900 dark:text-white break-all">
                      {selectedFile.arweaveId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(selectedFile.arweaveId!)}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {t('copy')}
                    </button>
                  </div>
                  <a
                    href={`https://arweave.net/${selectedFile.arweaveId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-500 hover:text-green-600 mt-1 inline-block"
                  >
                    {t('viewOnArweave')} →
                  </a>
                  {selectedFile.cost && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {t('storageCost')}: {selectedFile.cost} AR
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

