'use client';

import { useState } from 'react';
import { QrCode, Download, Share2, Copy, Check } from 'lucide-react';

interface QRCodeGeneratorProps {
  address?: string;
  noteId?: string;
  profileUrl?: string;
}

export default function QRCodeGenerator({ address, noteId, profileUrl }: QRCodeGeneratorProps) {
  const [qrSize, setQrSize] = useState(256);
  const [copied, setCopied] = useState(false);

  // Generate QR code data URL (simplified - in real app would use a QR library)
  const getQRCodeUrl = () => {
    const data = address || profileUrl || `https://noteboard.io/note/${noteId}`;
    // This is a placeholder - in production, use a QR code library like qrcode.react
    return `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(data)}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = getQRCodeUrl();
    link.download = `noteboard-qr-${Date.now()}.png`;
    link.click();
  };

  const handleCopy = async () => {
    const data = address || profileUrl || `https://noteboard.io/note/${noteId}`;
    await navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const data = address || profileUrl || `https://noteboard.io/note/${noteId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NoteBoard',
          text: 'Check this out on NoteBoard!',
          url: data,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">QR Code</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Scan to {address ? 'send funds' : noteId ? 'view note' : 'visit profile'}
          </p>
        </div>
      </div>

      {/* QR Code Display */}
      <div className="bg-white p-6 rounded-xl border-4 border-gray-200 dark:border-gray-700 mb-6">
        <img
          src={getQRCodeUrl()}
          alt="QR Code"
          className="w-full h-auto"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Data Display */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {address ? 'Wallet Address' : noteId ? 'Note Link' : 'Profile Link'}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={address || profileUrl || `https://noteboard.io/note/${noteId}`}
            readOnly
            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-white"
          />
          <button
            onClick={handleCopy}
            className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Size Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          QR Code Size
        </label>
        <div className="flex gap-2">
          {[128, 256, 512].map((size) => (
            <button
              key={size}
              onClick={() => setQrSize(size)}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                qrSize === size
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {size}px
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download
        </button>
        <button
          onClick={handleShare}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Tip:</strong> Anyone can scan this QR code to {address ? 'send you crypto' : noteId ? 'view this note' : 'view your profile'} instantly!
        </p>
      </div>
    </div>
  );
}

// Demo component showing different use cases
export function QRCodeGeneratorDemo() {
  const [activeTab, setActiveTab] = useState<'wallet' | 'note' | 'profile'>('wallet');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            QR Code Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate QR codes for wallets, notes, and profiles
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'wallet', label: 'Wallet Address' },
              { id: 'note', label: 'Note Link' },
              { id: 'profile', label: 'Profile Link' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code */}
          <div>
            {activeTab === 'wallet' && (
              <QRCodeGenerator address="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" />
            )}
            {activeTab === 'note' && <QRCodeGenerator noteId="12345" />}
            {activeTab === 'profile' && (
              <QRCodeGenerator profileUrl="https://noteboard.io/profile/alice" />
            )}
          </div>

          {/* Features */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Features</h2>
            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">✓</span>
                <div>
                  <strong>Instant Scanning</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Scan with any QR code reader app
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">✓</span>
                <div>
                  <strong>Multiple Sizes</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose from 128px, 256px, or 512px
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">✓</span>
                <div>
                  <strong>Easy Sharing</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download or share directly
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">✓</span>
                <div>
                  <strong>Wallet Integration</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generate payment QR codes
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">✓</span>
                <div>
                  <strong>Content Links</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Share notes and profiles easily
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Pro Tip
              </h3>
              <p className="text-sm text-purple-800 dark:text-purple-300">
                Print your wallet QR code and display it at events to receive tips and payments instantly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

