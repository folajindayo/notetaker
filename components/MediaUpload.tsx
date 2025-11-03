"use client";

import { useState, useRef } from "react";

interface MediaUploadProps {
  onUpload: (ipfsHash: string) => void;
  maxSize?: number; // in MB
}

export function MediaUpload({ onUpload, maxSize = 10 }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Supported: JPEG, PNG, GIF, WebP, MP4");
      return;
    }

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate IPFS upload (in production, use actual IPFS service)
    setUploading(true);
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock IPFS hash
      const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`;

      onUpload(mockHash);
      setUploading(false);
    } catch (err) {
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  const removeMedia = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUpload("");
  };

  return (
    <div className="space-y-3">
      {/* Upload Button */}
      {!preview && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4"
            onChange={handleFileSelect}
            className="hidden"
            id="media-upload"
          />
          <label
            htmlFor="media-upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-all font-medium text-sm"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Add Media
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Upload images or videos (max {maxSize}MB)
          </p>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-2"></div>
                <p className="text-sm font-medium">Uploading to IPFS...</p>
              </div>
            </div>
          )}

          {preview.startsWith("data:video") ? (
            <video src={preview} controls className="w-full max-h-96" />
          ) : (
            <img src={preview} alt="Upload preview" className="w-full max-h-96 object-cover" />
          )}

          {!uploading && (
            <button
              onClick={removeMedia}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* IPFS Info */}
      {preview && !uploading && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          ℹ️ Media will be stored on IPFS (decentralized storage)
        </div>
      )}
    </div>
  );
}

