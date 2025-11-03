"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: searchResults, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "searchNotes",
    args: [query, 50n],
    query: {
      enabled: query.length > 0,
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      refetch();
    }
  };

  const results = (searchResults as any[]) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search</h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes, users, tags..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-lg"
              autoFocus
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" strokeWidth="2" />
            </svg>
          </form>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("notes")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === "notes"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveFilter("users")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === "users"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveFilter("tags")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === "tags"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tags
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {query.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Search NoteBoard</h2>
            <p className="text-gray-600">Find notes, users, communities, and more</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No results found</h2>
            <p className="text-gray-600">Try different keywords or check your spelling</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Found {results.length} {results.length === 1 ? "result" : "results"}
            </p>
            {results.map((note: any, index: number) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <Link
                    href={`/profile/${note.author}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {note.author.slice(0, 8)}...
                  </Link>
                  <span className="text-xs text-gray-500">
                    {new Date(Number(note.timestamp) * 1000).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-900 mb-3">{note.message}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>❤️ {Number(note.likes)}</span>
                  <span>💬 {Number(note.replyCount)}</span>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1">
                      {note.tags.map((tag: string, i: number) => (
                        <span key={i} className="text-blue-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

