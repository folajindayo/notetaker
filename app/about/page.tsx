import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            The Future of Social Media<br />is On-Chain
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mb-8">
            NoteBoard is a decentralized social platform where your content, connections, and rewards live on the blockchain. Forever.
          </p>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all font-bold text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/help"
              className="px-8 py-4 bg-white/10 text-white border-2 border-white rounded-xl hover:bg-white/20 transition-all font-bold text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Why NoteBoard?
        </h2>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Experience true ownership of your content and connections with blockchain-powered social networking
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🔗",
              title: "Truly Decentralized",
              description: "Your data lives on the blockchain, not on centralized servers. No single entity can delete or censor your content.",
            },
            {
              icon: "💎",
              title: "Earn Real Rewards",
              description: "Get rewarded for your content with crypto. Earn points for engagement and convert them to ETH.",
            },
            {
              icon: "🔐",
              title: "Own Your Identity",
              description: "Your wallet is your identity. No email required, no password to forget. True digital ownership.",
            },
            {
              icon: "🚀",
              title: "Low Gas Fees",
              description: "Built on Base L2 for lightning-fast transactions and minimal fees. Post without breaking the bank.",
            },
            {
              icon: "🌍",
              title: "Global & Permissionless",
              description: "Access from anywhere in the world. No KYC, no restrictions. Just connect your wallet and start.",
            },
            {
              icon: "🎨",
              title: "Full-Featured Platform",
              description: "Everything you expect from a modern social platform: posts, polls, communities, subscriptions, and more.",
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Users" },
              { value: "100K+", label: "Notes Posted" },
              { value: "1M+", label: "Interactions" },
              { value: "$50K+", label: "Rewards Earned" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          How It Works
        </h2>

        <div className="space-y-12">
          {[
            {
              step: "1",
              title: "Connect Your Wallet",
              description: "Use MetaMask, Coinbase Wallet, or any Web3 wallet to connect. Your wallet is your identity.",
              icon: "🔌",
            },
            {
              step: "2",
              title: "Create & Share",
              description: "Post notes, create polls, start communities. Everything is stored permanently on the blockchain.",
              icon: "✍️",
            },
            {
              step: "3",
              title: "Engage & Earn",
              description: "Like, reply, follow, and share. Earn reward points for your activity and convert them to ETH.",
              icon: "💰",
            },
            {
              step: "4",
              title: "Build Your Audience",
              description: "Grow your following, monetize with subscriptions, and become a creator on the decentralized web.",
              icon: "📈",
            },
          ].map((step, i) => (
            <div key={i} className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                {step.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{step.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-lg text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Built with Modern Web3 Tech
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16">
            Powered by the best tools in blockchain and web development
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Base Network", desc: "Ethereum L2" },
              { name: "Solidity", desc: "Smart Contracts" },
              { name: "Next.js 14", desc: "React Framework" },
              { name: "Wagmi", desc: "Web3 React Hooks" },
              { name: "IPFS", desc: "Decentralized Storage" },
              { name: "Tailwind CSS", desc: "Modern Styling" },
              { name: "TypeScript", desc: "Type Safety" },
              { name: "Hardhat", desc: "Smart Contract Dev" },
            ].map((tech, i) => (
              <div key={i} className="p-6 bg-white rounded-xl border border-gray-200 text-center">
                <h4 className="font-bold text-gray-900 mb-1">{tech.name}</h4>
                <p className="text-sm text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Ready to Join the Revolution?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Be part of the decentralized social media movement. Your content, your data, your rewards.
        </p>
        <Link
          href="/"
          className="inline-block px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all font-bold text-lg"
        >
          Launch App →
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div>© 2025 NoteBoard. Built on Base.</div>
          <div className="flex gap-6">
            <Link href="/help" className="hover:text-gray-900">Help</Link>
            <Link href="/about" className="hover:text-gray-900">About</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">GitHub</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">Twitter</a>
          </div>
        </div>
      </div>
    </div>
  );
}

