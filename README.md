# 🚀 NoteBoard - Complete Web3 Social Platform

A comprehensive decentralized social media platform built on Base blockchain with Next.js. Features notes, communities, polls, subscriptions, rewards, and more - all on-chain!

## ✨ Key Features

### 📝 Content Creation
- Post notes (max 280 characters) with IPFS media attachments
- Add tags (up to 5 per note)
- Create conversation threads
- Mention users with @ addresses
- Create polls (2-10 options, time-limited)
- Edit and delete your notes
- Reply to notes
- Quote repost notes

### 🎭 Social Interactions
- ❤️ Like/Unlike posts
- 😊 6 Emoji reactions (LIKE, LOVE, LAUGH, WOW, SAD, ANGRY)
- 👥 Follow/unfollow users
- 🚫 Block and mute users
- 🔖 Bookmark notes for later
- 📌 Pin up to 3 notes to your profile

### 💰 Monetization & Rewards
- 💎 Earn reward points (10 per note, 5 per like, 3 per reply)
- 🎁 Convert points to ETH
- 💸 Tip creators with ETH
- 💳 Creator subscriptions (set your own price)
- ⭐ Premium accounts (0.01 ETH)
- 📊 Track total earnings

### 👥 Communities
- Create public/private communities
- Set community subscription fees
- Community member management
- Exclusive community content
- Community browsing and discovery

### 🏆 Gamification
- 🏅 20+ Achievement badges
- 🔥 Activity streak tracking
- 📊 Leaderboards
- 💎 Point-based rewards
- 🎯 Milestone celebrations

### 👤 User Profiles
- Custom usernames and bios
- 🖼️ NFT profile pictures
- ✅ Verified user badges
- 📈 Complete statistics
- 📅 Join date and activity tracking
- 🏆 Badge collection display

### 🔍 Discovery
- Full-text search in notes
- Personalized feed from followed users
- Trending notes algorithm
- Tag-based exploration
- Community browser
- User leaderboards

### 🛡️ Moderation
- Community reporting system
- Auto-delete after 10 reports
- Moderator roles and permissions
- User verification system
- Content flagging

## 🎨 Pages (20+)

- `/` - Home feed with all notes
- `/profile/[address]` - User profile pages with stats, badges, and activity
- `/communities` - Browse and create public/private communities
- `/leaderboard` - Top users rankings with point system
- `/rewards` - Rewards dashboard with point claiming
- `/trending` - Trending notes and popular content
- `/search` - Full-text search for notes, users, and tags
- `/bookmarks` - Saved notes collection
- `/settings` - Account settings and profile customization
- `/analytics` - Platform statistics and insights
- `/notifications` - Notification center with filtering
- `/following` - Following/followers management
- `/explore` - Content discovery hub
- `/tags/[tag]` - Tag-based content pages
- `/admin` - Admin/moderator dashboard
- `/help` - Comprehensive help center
- `/about` - About/landing page

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v2, Viem v2, Reown AppKit
- **Smart Contracts**: Solidity 0.8.28, Hardhat
- **Network**: Base (Ethereum L2)

## 🏗️ Smart Contract

The NoteBoard.sol contract is a production-ready, feature-complete social platform:

- **1,700+ lines** of Solidity code
- **40+ write functions** for interactions
- **35+ read functions** for data retrieval
- **27 events** for real-time updates
- **30+ mappings** for efficient data storage
- **4 structs**: Note, Reply, Poll, Community, Subscription, UserProfile

### Core Contract Features

1. **Notes System**: Post, edit, delete, like, reply, repost
2. **Reactions**: 6 types of emoji reactions
3. **Polls**: Time-limited polls with multiple options
4. **Communities**: Public/private groups with fees
5. **Subscriptions**: Creator monetization
6. **Rewards**: Point-based engagement system
7. **User Profiles**: Usernames, bios, avatars, verification
8. **Social Graph**: Follow, block, mute functionality
9. **Content Moderation**: Reporting and auto-deletion
10. **NFT Integration**: NFT profile pictures

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask or compatible Web3 wallet
- Base Sepolia ETH ([get from faucet](https://www.coinbase.com/faucets))
- WalletConnect Project ID ([create free](https://cloud.reown.com/))

### Installation

1. **Clone and install dependencies:**

```bash
git clone https://github.com/yourusername/notetaker.git
cd notetaker
npm install
```

2. **Set up environment variables:**

Create `.env.local`:

```env
# WalletConnect Project ID (from https://cloud.reown.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Deployment keys
PRIVATE_KEY=your_wallet_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Contract address (fill after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Optional: BaseScan API key for verification
BASESCAN_API_KEY=your_api_key
```

3. **Compile the smart contract:**

```bash
npm run compile
```

4. **Deploy to Base Sepolia:**

```bash
npm run deploy:sepolia
```

Copy the deployed contract address to your `.env.local` file.

5. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start using the app!

## 📁 Project Structure

```
notetaker/
├── app/                        # Next.js app directory
│   ├── page.tsx               # Home feed
│   ├── layout.tsx             # Root layout
│   ├── communities/           # Communities page
│   │   └── page.tsx
│   ├── leaderboard/           # Leaderboard page
│   │   └── page.tsx
│   ├── profile/[address]/     # Dynamic user profiles
│   │   └── page.tsx
│   ├── rewards/               # Rewards dashboard
│   │   └── page.tsx
│   └── globals.css            # Global styles
├── components/                 # React components
│   ├── BottomToolbar.tsx      # Action toolbar
│   ├── CreatePollModal.tsx    # Poll creation modal
│   ├── MainContent.tsx        # Main content area
│   ├── NoteCard.tsx          # Interactive note card with actions
│   ├── NoteFeed.tsx          # Notes feed display
│   ├── PollCard.tsx          # Poll voting UI
│   ├── PostNoteModal.tsx     # Note creation modal
│   ├── Sidebar.tsx           # Navigation sidebar
│   └── WalletConnect.tsx     # Wallet connection UI
├── contracts/                 # Solidity contracts
│   └── NoteBoard.sol         # Main contract (1700+ lines)
├── lib/                      # Utilities
│   ├── constants.ts          # Contract config
│   ├── wagmi.ts             # Web3 config
│   └── Web3Provider.tsx     # Context provider
├── scripts/                  # Deployment
│   └── deploy.ts
├── hardhat.config.ts         # Hardhat config
├── tailwind.config.ts        # Tailwind config
└── README.md                 # This file
```

## 📜 Smart Contract Functions

### Write Functions (40+)
- `postNote`, `editNote`, `deleteNote`
- `likeNote`, `unlikeNote`, `reactToNote`
- `postReply`, `repostNote`
- `createPoll`, `voteOnPoll`
- `followUser`, `unfollowUser`
- `blockUser`, `muteUser`
- `bookmarkNote`, `pinNote`
- `createCommunity`, `joinCommunity`
- `subscribe`, `tipNote`
- `claimRewards`, `upgradeToPremium`
- `reportNote`, `verifyUser`
- And more!

### Read Functions (35+)
- `getAllNotes`, `getActiveNotes`, `getTrendingNotes`
- `getNotesByAuthor`, `getNotesByTag`
- `getUserProfile`, `getUserBadges`
- `getCommunities`, `getCommunityMembers`
- `getRewardPoints`, `getTotalEarnings`
- `getFeed`, `searchNotes`
- `getPlatformStats`
- And more!

## 🎯 Usage Examples

### Post a Note

```typescript
// With tags and media
writeContract({
  functionName: "postNote",
  args: [
    "Hello Web3!",                    // message
    ["welcome", "blockchain"],        // tags
    "ipfs://Qm...",                   // IPFS hash
    0n,                               // threadId (0 for new)
    0n,                               // replyToNoteId
    []                                // mentions
  ]
});
```

### Create a Poll

```typescript
writeContract({
  functionName: "createPoll",
  args: [
    noteId,                           // Note to attach poll to
    ["Option A", "Option B"],         // Poll options
    86400n                            // Duration (24 hours)
  ]
});
```

### Join a Community

```typescript
writeContract({
  functionName: "joinCommunity",
  args: [communityId],
  value: subscriptionFee             // Pay community fee
});
```

## 🚢 Deployment

### To Base Sepolia (Testnet)

```bash
npm run deploy:sepolia
```

### To Base Mainnet (Production)

⚠️ **Only when ready!**

```bash
npm run deploy:base
```

### Verify Contract

```bash
npx hardhat verify --network baseSepolia CONTRACT_ADDRESS
```

## 🧪 Testing

Run contract tests:

```bash
npx hardhat test
```

## 🎨 Component Highlights

### NoteCard
Interactive note cards featuring:
- Like, reply, repost, bookmark actions
- User avatar and profile links
- Tag display with click navigation
- More actions menu (edit, delete, report)
- Real-time interaction counts
- Smooth animations and transitions

### NoteFeed
Real-time updating feed with:
- Auto-refresh on new blocks
- Event-based updates
- Reverse chronological order
- Loading states

### PostNoteModal
Rich note creation with:
- Character counter (280 max)
- Tag input (up to 5 tags)
- IPFS media attachment
- Poll creation option
- Mention support (@addresses)

### PollCard
Interactive poll voting with:
- Real-time vote percentages
- Visual progress bars
- Vote submission handling
- Time remaining display
- Results visualization

### Profile Page
Complete user profiles showing:
- Stats (notes, followers, streak)
- Badge collection display
- Pinned notes section
- Activity feed tabs
- Follow/subscribe buttons
- Reward points

### Search Page
Advanced search functionality:
- Full-text search in notes
- Filter by type (all, notes, users, tags)
- Real-time results
- Highlighted matches

### Trending Page
Discover popular content:
- Trending notes algorithm
- Time period filters (1h, 24h, 7d)
- Category filters
- Ranked display with medals
- Engagement metrics

### Settings Page
Comprehensive settings:
- Profile customization (username, bio)
- Monetization setup (subscription pricing)
- Premium account upgrade
- Tab-based navigation
- Privacy settings (coming soon)

## 🔧 Troubleshooting

### Contract Address Not Configured
1. Deploy contract: `npm run deploy:sepolia`
2. Add address to `.env.local`
3. Restart dev server

### Insufficient Funds
Get Base Sepolia ETH from [Base Faucet](https://www.coinbase.com/faucets)

### Network Mismatch
Switch to Base Sepolia in your wallet:
- Chain ID: 84532
- RPC: https://sepolia.base.org

## 📚 Resources

- [Base Documentation](https://docs.base.org/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Next.js Documentation](https://nextjs.org/)
- [Hardhat Documentation](https://hardhat.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🙏 Acknowledgments

Built with ❤️ for the Web3 community using Next.js, Wagmi, and Base.

---

**Note**: This is a fully decentralized application. All data is stored on the blockchain and transactions require gas fees. Always test on testnet before deploying to mainnet!

🚀 Happy posting and building the decentralized social future!
