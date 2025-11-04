"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SearchResult {
  type: "note" | "user" | "tag" | "community";
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  url: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Mock search results - in production, fetch from contract/API
  const mockSearch = (searchQuery: string): SearchResult[] => {
    if (!searchQuery) return [];

    const allResults: SearchResult[] = [
      // Users
      { type: "user", id: "1", title: "Alice", subtitle: "0x1234...5678", icon: "👤", url: "/profile/0x1234" },
      { type: "user", id: "2", title: "Bob", subtitle: "0xabcd...efgh", icon: "👤", url: "/profile/0xabcd" },
      
      // Tags
      { type: "tag", id: "defi", title: "#defi", subtitle: "1.2K posts", icon: "🏷️", url: "/tags/defi" },
      { type: "tag", id: "web3", title: "#web3", subtitle: "856 posts", icon: "🏷️", url: "/tags/web3" },
      { type: "tag", id: "nft", title: "#nft", subtitle: "723 posts", icon: "🏷️", url: "/tags/nft" },
      
      // Communities
      { type: "community", id: "1", title: "DeFi Enthusiasts", subtitle: "500 members", icon: "🏛️", url: "/communities" },
      { type: "community", id: "2", title: "NFT Collectors", subtitle: "320 members", icon: "🏛️", url: "/communities" },
      
      // Notes
      { type: "note", id: "1", title: "The future of Web3 is...", subtitle: "Posted 2h ago", icon: "📝", url: "/" },
    ];

    return allResults.filter(
      (result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setResults(mockSearch(query));
        setIsSearching(false);
        setShowResults(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, users, tags..."
            className="w-full px-4 py-2.5 pl-11 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          
          {/* Search Icon */}
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" />
          </svg>

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setShowResults(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-gray-500">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(groupedResults).map(([type, items]) => (
                <div key={type} className="mb-2 last:mb-0">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    {type}s
                  </div>
                  {items.map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      onClick={() => {
                        setShowResults(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all"
                    >
                      <span className="text-2xl">{result.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                        )}
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              ))}
              
              {/* See All Results */}
              <div className="border-t border-gray-200 p-2">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setShowResults(false);
                    setQuery("");
                  }}
                  className="block w-full px-4 py-2 text-center text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
                >
                  See all results for "{query}" →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function QuickSearch() {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push("/search")}
      className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <span className="text-sm">Search</span>
      <kbd className="px-2 py-0.5 text-xs bg-white border border-gray-300 rounded">⌘K</kbd>
    </button>
  );
}

