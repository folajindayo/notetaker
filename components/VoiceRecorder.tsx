'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Send, Volume2 } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number; // in seconds
}

export default function VoiceRecorder({ onRecordingComplete, maxDuration = 300 }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newDuration;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const sendRecording = () => {
    if (audioBlob && onRecordingComplete) {
      onRecordingComplete(audioBlob, duration);
      deleteRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWaveformBars = () => {
    const bars = 30;
    return Array.from({ length: bars }, (_, i) => {
      const height = isRecording && !isPaused
        ? Math.random() * 40 + 10
        : 15;
      return (
        <div
          key={i}
          className="w-1 bg-blue-500 rounded-full transition-all duration-100"
          style={{ height: `${height}px` }}
        />
      );
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-blue-500" />
          Voice Message
        </h3>
        <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
          {formatTime(isRecording ? duration : audioBlob ? duration : 0)}
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center gap-1 h-24">
        {audioBlob ? (
          <div className="w-full flex items-center gap-2">
            <button
              onClick={playAudio}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          getWaveformBars()
        )}
      </div>

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={(e) => setCurrentTime(Math.floor(e.currentTarget.currentTime))}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
        />
      )}

      {/* Status */}
      <div className="text-center mb-4">
        {isRecording ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isPaused ? 'Recording paused' : 'Recording...'}
            </span>
          </div>
        ) : audioBlob ? (
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            ✓ Recording complete
          </span>
        ) : (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Tap the mic to start recording
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full hover:from-red-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <Mic className="w-8 h-8" />
          </button>
        )}

        {isRecording && (
          <>
            <button
              onClick={pauseRecording}
              className="p-4 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors shadow-lg"
            >
              {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </button>
            <button
              onClick={stopRecording}
              className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <Square className="w-6 h-6" />
            </button>
          </>
        )}

        {audioBlob && (
          <>
            <button
              onClick={deleteRecording}
              className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <Trash2 className="w-6 h-6" />
            </button>
            <button
              onClick={sendRecording}
              className="p-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
            >
              <Send className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Max Duration Warning */}
      {isRecording && duration > maxDuration * 0.8 && (
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-center">
          <p className="text-sm text-orange-700 dark:text-orange-300">
            Recording will stop at {formatTime(maxDuration)}
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        {audioBlob
          ? 'Review your recording or record a new one'
          : `Max duration: ${formatTime(maxDuration)}`}
      </div>
    </div>
  );
}

// Example usage component
export function VoiceRecorderDemo() {
  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    console.log('Recording complete:', { size: audioBlob.size, duration });
    // In real app, upload to IPFS or server
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Voice Recorder
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Record voice messages for your notes and replies
          </p>
        </div>

        <VoiceRecorder onRecordingComplete={handleRecordingComplete} maxDuration={60} />

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Features</h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Record high-quality audio messages</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Pause and resume recording</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Preview before sending</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Real-time waveform visualization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>Automatic stop at max duration</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

