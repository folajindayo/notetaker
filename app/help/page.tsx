"use client";

import Link from "next/link";
import { useState } from "react";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I connect my wallet?",
          a: "Click the 'Connect Wallet' button in the top right corner and select your wallet provider (MetaMask, Coinbase Wallet, etc.). Make sure you're on the Base Sepolia network for testing.",
        },
        {
          q: "What is Base network?",
          a: "Base is a Layer 2 blockchain built on Ethereum, offering low gas fees and fast transactions. It's perfect for social applications like NoteBoard.",
        },
        {
          q: "Do I need ETH to use NoteBoard?",
          a: "Yes, you'll need a small amount of Base Sepolia ETH (for testnet) or Base ETH (for mainnet) to pay for gas fees when posting notes, liking, or performing other on-chain actions.",
        },
      ],
    },
    {
      category: "Creating Content",
      questions: [
        {
          q: "How long can my notes be?",
          a: "Notes are limited to 280 characters, similar to Twitter. This ensures efficient on-chain storage and keeps content concise.",
        },
        {
          q: "Can I add images or videos to my notes?",
          a: "Yes! You can upload media which will be stored on IPFS (decentralized storage). Simply click the media button when creating a note.",
        },
        {
          q: "How do I mention other users?",
          a: "Type @ followed by the user's address. An autocomplete menu will appear to help you select the user you want to mention.",
        },
        {
          q: "Can I edit or delete my notes?",
          a: "Yes, you can edit or delete notes you've created. Click the three dots menu on your note and select 'Edit' or 'Delete'.",
        },
      ],
    },
    {
      category: "Social Features",
      questions: [
        {
          q: "How do likes work?",
          a: "Liking a note requires a blockchain transaction. The like is permanently recorded on-chain, and the author earns reward points.",
        },
        {
          q: "What are reward points?",
          a: "You earn points for activity: 10 points per note, 5 points per like received, and 3 points per reply. Points can be converted to ETH in the Rewards page.",
        },
        {
          q: "How do I follow someone?",
          a: "Visit their profile and click the 'Follow' button. Following is an on-chain action recorded permanently.",
        },
        {
          q: "What are communities?",
          a: "Communities are groups where members can share content around specific topics. They can be public or private, with optional subscription fees.",
        },
      ],
    },
    {
      category: "Monetization",
      questions: [
        {
          q: "How do tips work?",
          a: "You can send ETH tips to content creators by clicking the tip button on their notes. Tips go directly to the creator's wallet.",
        },
        {
          q: "What is premium membership?",
          a: "Premium members get a verified badge, additional features, and priority support. It costs 0.01 ETH and is a one-time payment.",
        },
        {
          q: "How do creator subscriptions work?",
          a: "Creators can set a monthly subscription price. Subscribers get access to exclusive content and support their favorite creators.",
        },
        {
          q: "How do I claim my rewards?",
          a: "Go to the Rewards page, enter the amount of points you want to convert, and click 'Claim Rewards'. Your ETH will be sent to your wallet.",
        },
      ],
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          q: "Is my data private?",
          a: "All notes and interactions are stored on the blockchain, which is public by default. Don't share sensitive information in notes.",
        },
        {
          q: "Can I delete my account?",
          a: "You can stop using the platform anytime, but blockchain data is permanent. You can delete individual notes you've created.",
        },
        {
          q: "What if I lose access to my wallet?",
          a: "Make sure to securely backup your wallet's recovery phrase. If you lose access, there's no way to recover your account.",
        },
        {
          q: "How do I report inappropriate content?",
          a: "Click the three dots menu on any note and select 'Report'. After 10 reports, content is automatically removed.",
        },
      ],
    },
  ];

  const filteredFaqs = searchQuery
    ? faqs
        .map((category) => ({
          ...category,
          questions: category.questions.filter(
            (q) =>
              q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.a.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((category) => category.questions.length > 0)
    : faqs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-white/90 text-lg mb-6">
            Everything you need to know about NoteBoard
          </p>

          {/* Search */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full px-6 py-4 rounded-xl text-gray-900 pr-12 focus:ring-4 focus:ring-white/30 focus:outline-none"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/explore"
            className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-bold text-gray-900 mb-1">Explore</h3>
            <p className="text-sm text-gray-600">Discover trending content</p>
          </Link>

          <Link
            href="/communities"
            className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-bold text-gray-900 mb-1">Communities</h3>
            <p className="text-sm text-gray-600">Join groups & discussions</p>
          </Link>

          <Link
            href="/rewards"
            className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="text-3xl mb-3">💎</div>
            <h3 className="font-bold text-gray-900 mb-1">Rewards</h3>
            <p className="text-sm text-gray-600">Earn points & ETH</p>
          </Link>
        </div>

        {/* FAQs */}
        <div className="space-y-8">
          {filteredFaqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((item, qIndex) => {
                  const index = catIndex * 100 + qIndex;
                  const isOpen = openFaq === index;

                  return (
                    <div key={qIndex} className="border-b border-gray-100 last:border-0">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full flex items-start justify-between py-4 text-left hover:text-blue-600 transition-all"
                      >
                        <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                        <svg
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="pb-4 text-gray-600 leading-relaxed">{item.a}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Reach out to our community!
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="https://discord.gg/noteboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium"
            >
              Join Discord
            </a>
            <a
              href="https://twitter.com/noteboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium"
            >
              Follow on X
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

