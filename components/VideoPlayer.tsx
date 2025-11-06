'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
}

export default function VideoPlayer({ src, poster, title, autoPlay = false }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVolume(value);
      setIsMuted(value === 0);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSettings(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-xl overflow-hidden shadow-2xl group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-auto"
        autoPlay={autoPlay}
        onClick={togglePlay}
      />

      {/* Title Overlay */}
      {title && (
        <div
          className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6 transition-opacity ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="text-white text-xl font-bold">{title}</h3>
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-2xl"
          >
            <Play className="w-10 h-10 text-gray-900 ml-1" />
          </button>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-blue-500"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`,
            }}
          />
        </div>

        {/* Control Buttons */}
        <div className="px-6 pb-4 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Skip Buttons */}
            <button
              onClick={() => skip(-10)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <SkipBack className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => skip(10)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <SkipForward className="w-5 h-5 text-white" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Time */}
            <div className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg shadow-xl overflow-hidden">
                  <div className="p-2">
                    <div className="text-white text-xs font-semibold mb-2 px-2">Playback Speed</div>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => changePlaybackSpeed(speed)}
                        className={`w-full text-left px-4 py-2 text-sm text-white hover:bg-white/20 rounded transition-colors ${
                          playbackSpeed === speed ? 'bg-blue-500' : ''
                        }`}
                      >
                        {speed}x {speed === 1 && '(Normal)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Maximize className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo component
export function VideoPlayerDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Video Player</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Custom video player with full controls and features
          </p>
        </div>

        <VideoPlayer
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          poster="https://via.placeholder.com/1280x720/667eea/ffffff?text=Video+Thumbnail"
          title="Sample Video - Big Buck Bunny"
        />

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Features</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Play/Pause controls</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Volume control</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Fullscreen support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Playback speed adjustment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Skip forward/backward</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Progress bar with seek</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Auto-hide controls</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Custom styling</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

