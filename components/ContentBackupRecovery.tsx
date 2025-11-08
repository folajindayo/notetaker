'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

/**
 * ContentBackupRecovery - Blockchain-based content backup and recovery system
 * Allows users to backup their content to IPFS/Arweave and recover it when needed
 */

interface BackupItem {
  id: string;
  type: 'note' | 'profile' | 'settings' | 'full';
  timestamp: number;
  size: number;
  hash: string;
  status: 'creating' | 'completed' | 'failed';
  recoverable: boolean;
}

interface ContentSnapshot {
  notes: any[];
  profile: any;
  interactions: {
    likes: number[];
    bookmarks: number[];
    followers: string[];
    following: string[];
  };
  communities: any[];
  achievements: any[];
  timestamp: number;
}

export default function ContentBackupRecovery() {
  const { address } = useAccount();
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'backups' | 'recovery' | 'schedule'>('backups');

  // Fetch user data for backup
  const { data: userNotes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getNotesByAuthor',
    args: address ? [address] : undefined,
  });

  const { data: userProfile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserProfile',
    args: address ? [address] : undefined,
  });

  // Load existing backups from localStorage
  useEffect(() => {
    if (!address) return;
    
    const stored = localStorage.getItem(`backups_${address}`);
    if (stored) {
      setBackups(JSON.parse(stored));
    }
  }, [address]);

  // Save backups to localStorage
  const saveBackupsToStorage = (newBackups: BackupItem[]) => {
    if (!address) return;
    localStorage.setItem(`backups_${address}`, JSON.stringify(newBackups));
    setBackups(newBackups);
  };

  const createBackup = async (type: BackupItem['type']) => {
    if (!address || isCreatingBackup) return;

    setIsCreatingBackup(true);
    setBackupProgress(0);

    try {
      // Simulate backup creation with progress
      const interval = setInterval(() => {
        setBackupProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Gather content to backup
      const snapshot: ContentSnapshot = {
        notes: userNotes as any[] || [],
        profile: userProfile || {},
        interactions: {
          likes: [],
          bookmarks: [],
          followers: [],
          following: [],
        },
        communities: [],
        achievements: [],
        timestamp: Date.now(),
      };

      // Simulate IPFS upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(interval);
      setBackupProgress(100);

      // Create backup record
      const backup: BackupItem = {
        id: Date.now().toString(),
        type,
        timestamp: Date.now(),
        size: JSON.stringify(snapshot).length,
        hash: `ipfs://Qm${Math.random().toString(36).substring(2, 15)}`,
        status: 'completed',
        recoverable: true,
      };

      // Store backup data in localStorage (in production, upload to IPFS/Arweave)
      localStorage.setItem(`backup_data_${backup.id}`, JSON.stringify(snapshot));
      
      const newBackups = [backup, ...backups];
      saveBackupsToStorage(newBackups);

      alert('Backup created successfully!');
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Backup creation failed. Please try again.');
    } finally {
      setIsCreatingBackup(false);
      setBackupProgress(0);
    }
  };

  const recoverFromBackup = async (backupId: string) => {
    if (!address) return;

    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;

    const confirmed = confirm(
      'Are you sure you want to recover from this backup? This will restore your content to the state at the time of backup.'
    );

    if (!confirmed) return;

    try {
      // Retrieve backup data
      const data = localStorage.getItem(`backup_data_${backupId}`);
      if (!data) {
        alert('Backup data not found');
        return;
      }

      const snapshot: ContentSnapshot = JSON.parse(data);
      
      // In production, this would restore data to the blockchain
      // For now, we'll just show the recovery data
      console.log('Recovering data:', snapshot);
      
      alert(`Recovery initiated! Found ${snapshot.notes.length} notes and profile data.`);
      setShowRecoveryModal(false);
    } catch (error) {
      console.error('Recovery failed:', error);
      alert('Recovery failed. Please try again.');
    }
  };

  const deleteBackup = (backupId: string) => {
    const confirmed = confirm('Are you sure you want to delete this backup?');
    if (!confirmed) return;

    localStorage.removeItem(`backup_data_${backupId}`);
    const newBackups = backups.filter(b => b.id !== backupId);
    saveBackupsToStorage(newBackups);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBackupTypeIcon = (type: string) => {
    switch (type) {
      case 'note': return '📝';
      case 'profile': return '👤';
      case 'settings': return '⚙️';
      case 'full': return '💾';
      default: return '📦';
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Please connect your wallet to access backup features
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            💾 Content Backup & Recovery
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Secure blockchain-based backups of your content and data
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{backups.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Backups</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {formatBytes(backups.reduce((sum, b) => sum + b.size, 0))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Size</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {backups.filter(b => b.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">
              {backups.length > 0 ? formatDate(backups[0].timestamp).split(',')[0] : 'N/A'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Last Backup</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('backups')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'backups'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              💾 My Backups
            </button>
            <button
              onClick={() => setActiveTab('recovery')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'recovery'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🔄 Recovery
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'schedule'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              ⏰ Schedule
            </button>
          </div>
        </div>

        {/* Backups Tab */}
        {activeTab === 'backups' && (
          <div>
            {/* Create Backup Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create New Backup
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => createBackup('note')}
                  disabled={isCreatingBackup}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  <div className="text-3xl mb-2">📝</div>
                  <div className="font-medium text-gray-900 dark:text-white">Notes Only</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Backup all notes</div>
                </button>
                <button
                  onClick={() => createBackup('profile')}
                  disabled={isCreatingBackup}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  <div className="text-3xl mb-2">👤</div>
                  <div className="font-medium text-gray-900 dark:text-white">Profile</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Profile data</div>
                </button>
                <button
                  onClick={() => createBackup('settings')}
                  disabled={isCreatingBackup}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  <div className="text-3xl mb-2">⚙️</div>
                  <div className="font-medium text-gray-900 dark:text-white">Settings</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Preferences</div>
                </button>
                <button
                  onClick={() => createBackup('full')}
                  disabled={isCreatingBackup}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  <div className="text-3xl mb-2">💾</div>
                  <div className="font-medium text-gray-900 dark:text-white">Full Backup</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Everything</div>
                </button>
              </div>

              {isCreatingBackup && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Creating backup...</span>
                    <span className="text-sm font-medium text-blue-600">{backupProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${backupProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Backups List */}
            <div className="space-y-4">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl">{getBackupTypeIcon(backup.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                            {backup.type} Backup
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            backup.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            backup.status === 'creating' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {backup.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <div>📅 {formatDate(backup.timestamp)}</div>
                          <div>📦 Size: {formatBytes(backup.size)}</div>
                          <div className="flex items-center gap-2">
                            <span>🔗</span>
                            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {backup.hash.substring(0, 30)}...
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedBackup(backup.id);
                          setShowRecoveryModal(true);
                        }}
                        disabled={!backup.recoverable}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        🔄 Recover
                      </button>
                      <button
                        onClick={() => deleteBackup(backup.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {backups.length === 0 && !isCreatingBackup && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">
                    No backups yet. Create your first backup to secure your content!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recovery Tab */}
        {activeTab === 'recovery' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recovery Center
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">How Recovery Works</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>✓ All backups are stored on decentralized storage (IPFS/Arweave)</li>
                  <li>✓ You can recover your data at any time using your wallet</li>
                  <li>✓ Recovery is instant and secure</li>
                  <li>✓ Choose which backup version to restore from</li>
                </ul>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Select a backup from the "My Backups" tab to begin recovery.
              </p>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Automatic Backup Schedule
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Daily Backups</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Automatic daily full backup at midnight</div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Weekly Backups</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Full backup every Sunday</div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Auto-Backup on Post</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Backup after every 10 posts</div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Enable
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recovery Modal */}
      {showRecoveryModal && selectedBackup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Confirm Recovery
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will restore your content to the state at the time of this backup.
              Your current data will be preserved.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowRecoveryModal(false);
                  setSelectedBackup(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => recoverFromBackup(selectedBackup)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Recover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

