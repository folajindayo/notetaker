"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";

export default function BookmarksPage() {
  const { address, isConnected } = useAccount();

  const { data: bookmarkIds } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserBookmarks",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const bookmarkedNotes = (bookmarkIds as bigint[]) || [];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view bookmarks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-2 inline-block text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">🔖 Bookmarks</h1>
          <p className="text-gray-600 mt-1">
            {bookmarkedNotes.length} saved {bookmarkedNotes.length === 1 ? "note" : "notes"}
          </p>
        </div>
      </div>

      {/* Bookmarked Notes */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {bookmarkedNotes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="text-6xl mb-4">🔖</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h2>
            <p className="text-gray-600 mb-6">
              Save notes you want to read later by clicking the bookmark icon
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Explore Notes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarkedNotes.map((noteId) => (
              <BookmarkedNoteCard key={Number(noteId)} noteId={Number(noteId)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookmarkedNoteCard({ noteId }: { noteId: number }) {
  const { data: note } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getNote",
    args: [BigInt(noteId)],
  });

  if (!note) return null;

  const noteData = note as any;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-2">
        <Link
          href={`/profile/${noteData.author}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {noteData.author.slice(0, 10)}...{noteData.author.slice(-8)}
        </Link>
        <span className="text-xs text-gray-500">
          {new Date(Number(noteData.timestamp) * 1000).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-900 mb-3">{noteData.message}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>❤️ {Number(noteData.likes)}</span>
        <span>💬 {Number(noteData.replyCount)}</span>
        {noteData.isEdited && <span className="text-xs">(edited)</span>}
      </div>
    </div>
  );
}

