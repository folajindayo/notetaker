"use client";

import { use } from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";

export default function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = use(params);
  const decodedTag = decodeURIComponent(tag);

  const { data: notes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getNotesByTag",
    args: [decodedTag, 50n],
  });

  const notesList = (notes as any[]) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/explore" className="text-blue-600 hover:text-blue-700 mb-4 inline-block text-sm">
            ← Back to Explore
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-3xl">#️⃣</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">#{decodedTag}</h1>
              <p className="text-gray-600 mt-1">{notesList.length} posts</p>
            </div>
          </div>

          {/* Tag Actions */}
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm">
              Follow Tag
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="lg:col-span-2 space-y-4">
            {notesList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <div className="text-6xl mb-4">🏷️</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts with #{decodedTag}
                </h2>
                <p className="text-gray-600 mb-6">Be the first to post with this tag!</p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  Create Post
                </Link>
              </div>
            ) : (
              notesList.map((note, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Link href={`/profile/${note.author}`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform">
                        {note.author[2]?.toUpperCase() || "?"}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/profile/${note.author}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {note.author.slice(0, 8)}...
                        </Link>
                        <span className="text-sm text-gray-500">
                          {new Date(Number(note.timestamp) * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-3">{note.message}</p>
                      
                      {/* Tags */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {note.tags.map((t: string, i: number) => (
                            <Link
                              key={i}
                              href={`/tags/${t}`}
                              className={`px-2 py-1 text-xs rounded-full transition-all ${
                                t === decodedTag
                                  ? "bg-blue-600 text-white"
                                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                              }`}
                            >
                              #{t}
                            </Link>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>❤️ {Number(note.likes)}</span>
                        <span>💬 {Number(note.replyCount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Related Tags</h2>
              <div className="space-y-2">
                {["web3", "blockchain", "defi", "nft", "crypto", "dao"].map((relatedTag, i) => (
                  <Link
                    key={i}
                    href={`/tags/${relatedTag}`}
                    className="block p-2 hover:bg-gray-50 rounded-lg transition-all"
                  >
                    <span className="text-blue-600 font-medium">#{relatedTag}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tag Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Tag Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Posts</span>
                  <span className="font-semibold text-gray-900">{notesList.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contributors</span>
                  <span className="font-semibold text-gray-900">
                    {new Set(notesList.map((n) => n.author)).size}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Likes</span>
                  <span className="font-semibold text-gray-900">
                    {notesList.reduce((sum, n) => sum + Number(n.likes), 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Top Contributors</h2>
              <div className="space-y-3">
                {Array.from(new Set(notesList.map((n) => n.author)))
                  .slice(0, 5)
                  .map((author, i) => (
                    <Link
                      key={i}
                      href={`/profile/${author}`}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                        {author[2]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {author.slice(0, 10)}...
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

