'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface Stream {
  id: string;
  title: string;
  description: string;
  streamer: string;
  streamerName: string;
  streamerAvatar: string;
  thumbnail: string;
  isLive: boolean;
  viewers: number;
  startedAt: number;
  category: string;
  recordingUrl?: string;
  ipfsHash?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderName: string;
  message: string;
  timestamp: number;
  isTip?: boolean;
  tipAmount?: number;
}

interface LiveStreamPlayerProps {
  streamId?: string;
}

export default function LiveStreamPlayer({ streamId }: LiveStreamPlayerProps) {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<Stream | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState('');

  useEffect(() => {
    // Load stream data
    const loadStream = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockStream: Stream = {
        id: streamId || '1',
        title: 'Building DApps on Base - Live Coding Session',
        description: 'Join me as I build a decentralized social platform on Base!',
        streamer: '0x1234567890123456789012345678901234567890',
        streamerName: 'CryptoBuilder',
        streamerAvatar: '/api/placeholder/50/50',
        thumbnail: '/api/placeholder/1280/720',
        isLive: true,
        viewers: 1247,
        startedAt: Date.now() - 3600000,
        category: 'Development',
        ipfsHash: 'QmX...',
      };

      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          sender: '0x9876543210987654321098765432109876543210',
          senderName: 'Viewer123',
          message: 'Great stream! Love the content 🔥',
          timestamp: Date.now() - 120000,
        },
        {
          id: '2',
          sender: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          senderName: 'Web3Fan',
          message: 'Can you explain that last part again?',
          timestamp: Date.now() - 60000,
        },
        {
          id: '3',
          sender: '0x1111111111111111111111111111111111111111',
          senderName: 'GenerousTipper',
          message: 'Amazing work! Here\'s a tip 💰',
          timestamp: Date.now() - 30000,
          isTip: true,
          tipAmount: 0.1,
        },
      ];

      setStream(mockStream);
      setChatMessages(mockMessages);
    };

    loadStream();
  }, [streamId]);

  useEffect(() => {
    // Simulate live viewers count update
    const interval = setInterval(() => {
      if (stream) {
        setStream({
          ...stream,
          viewers: stream.viewers + Math.floor(Math.random() * 10) - 5,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [stream]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: address!,
      senderName: 'You',
      message: message,
      timestamp: Date.now(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessage('');
  };

  const handleSendTip = () => {
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      alert(t('enterValidAmount'));
      return;
    }

    const tipMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: address!,
      senderName: 'You',
      message: `Sent a tip of ${tipAmount} ETH! 🎁`,
      timestamp: Date.now(),
      isTip: true,
      tipAmount: parseFloat(tipAmount),
    };

    setChatMessages([...chatMessages, tipMessage]);
    setShowTipModal(false);
    setTipAmount('');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      handleVolumeChange(volume || 50);
    } else {
      handleVolumeChange(0);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // In production, implement actual recording to IPFS
    console.log('Recording started - will save to IPFS');
  };

  const stopRecording = () => {
    setIsRecording(false);
    // In production, upload to IPFS and get hash
    console.log('Recording stopped - uploading to IPFS');
  };

  const getStreamDuration = () => {
    if (!stream) return '0:00';
    const duration = Date.now() - stream.startedAt;
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` : `${minutes}:00`;
  };

  if (!stream) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Player Container */}
      <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
        <div className="relative aspect-video">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full"
            poster={stream.thumbnail}
            controls={false}
          >
            <source src="/api/placeholder-video" type="video/mp4" />
          </video>

          {/* Live Indicator */}
          {stream.isLive && (
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="px-3 py-1 bg-red-600 text-white rounded-full flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                {t('live')}
              </div>
              <div className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                {stream.viewers.toLocaleString()}
              </div>
            </div>
          )}

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white rounded-full flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              {t('recording')}
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button className="text-white hover:text-blue-400 transition-colors">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      {isMuted ? (
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      )}
                    </svg>
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>

                {/* Duration */}
                <span className="text-white text-sm font-mono">{getStreamDuration()}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Recording Controls */}
                {stream.streamer.toLowerCase() === address?.toLowerCase() && (
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      isRecording
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {isRecording ? t('stopRecording') : t('record')}
                  </button>
                )}

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Info and Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stream Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stream.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={stream.streamerAvatar}
                alt={stream.streamerName}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{stream.streamerName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stream.category}</p>
              </div>
              <button
                onClick={() => setShowTipModal(true)}
                className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                {t('sendTip')} 💰
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{stream.description}</p>
            {stream.ipfsHash && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('recordedOnIPFS')}:
                </p>
                <p className="text-sm font-mono text-gray-900 dark:text-white">
                  {stream.ipfsHash}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Live Chat */}
        {showChat && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('liveChat')}</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg ${
                    msg.isTip
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700'
                      : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {msg.senderName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {msg.senderName}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                        {msg.message}
                      </p>
                      {msg.isTip && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mt-1">
                          💰 {msg.tipAmount} ETH
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            {isConnected && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t('typeMessage')}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    {t('send')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('sendTip')} to {stream.streamerName}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('amount')} (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0.01, 0.05, 0.1, 0.5].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTipAmount(amount.toString())}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {amount} ETH
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTipModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSendTip}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

