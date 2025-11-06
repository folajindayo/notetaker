'use client';

import { useState } from 'react';
import { Shield, Key, Lock, Eye, EyeOff, Smartphone, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function SecurityPage() {
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [sessions, setSessions] = useState([
    {
      id: '1',
      device: 'MacBook Pro',
      location: 'San Francisco, CA',
      ip: '192.168.1.1',
      lastActive: Date.now() - 300000,
      current: true,
    },
    {
      id: '2',
      device: 'iPhone 14 Pro',
      location: 'San Francisco, CA',
      ip: '192.168.1.25',
      lastActive: Date.now() - 3600000,
      current: false,
    },
    {
      id: '3',
      device: 'Chrome on Windows',
      location: 'New York, NY',
      ip: '203.0.113.42',
      lastActive: Date.now() - 86400000,
      current: false,
    },
  ]);

  const securitySettings = {
    twoFactorEnabled: false,
    biometricsEnabled: true,
    sessionTimeout: 30,
    emailAlerts: true,
    loginNotifications: true,
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const revokeSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Security Settings</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account security and privacy settings
          </p>
        </div>

        {/* Security Score */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Security Score</h2>
              <p className="text-green-100">Your account security level</p>
            </div>
            <div className="text-5xl font-bold">85%</div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div className="bg-white h-3 rounded-full" style={{ width: '85%' }} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <CheckCircle className="w-5 h-5 mb-1" />
              <div className="text-sm">Wallet Connected</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <CheckCircle className="w-5 h-5 mb-1" />
              <div className="text-sm">Email Verified</div>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  securitySettings.twoFactorEnabled
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {!securitySettings.twoFactorEnabled && !show2FASetup && (
            <div className="p-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Recommended:</strong> Enable 2FA to protect your account from
                    unauthorized access.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShow2FASetup(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                Enable Two-Factor Authentication
              </button>
            </div>
          )}

          {show2FASetup && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center">
                  <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 mx-auto mb-4 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">QR Code</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Scan this QR code with your authenticator app
                  </p>
                  <code className="px-4 py-2 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-sm">
                    ABCD-EFGH-IJKL-MNOP
                  </code>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShow2FASetup(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold">
                    Verify & Enable
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active Sessions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Devices currently logged into your account
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sessions.map((session) => (
              <div key={session.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {session.device}
                      </h4>
                      {session.current && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs font-semibold">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div>📍 {session.location}</div>
                      <div>🌐 {session.ip}</div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last active {formatTimeAgo(session.lastActive)}
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => revokeSession(session.id)}
                      className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-semibold"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Additional Settings
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Biometric Authentication
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Use fingerprint or face recognition
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked={securitySettings.biometricsEnabled}
                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Email Security Alerts
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified of suspicious activity
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked={securitySettings.emailAlerts}
                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Login Notifications
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Alert on new device logins
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked={securitySettings.loginNotifications}
                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-semibold text-left">
              Revoke All Sessions
            </button>
            <button className="w-full px-4 py-3 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-semibold text-left">
              Change Wallet Address
            </button>
            <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-left">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

