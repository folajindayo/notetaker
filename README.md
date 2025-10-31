# 📝 On-Chain Note Board

A decentralized application (dApp) built on Base network that allows users to post and read short messages stored on the blockchain. Think of it as a permanent, immutable message board where anyone can share their thoughts!

## 🌟 Features

- **Connect Wallet**: Seamless wallet connection using Reown AppKit (formerly WalletConnect)
- **Post Notes**: Write messages up to 280 characters and store them on-chain
- **View Feed**: Browse all notes in a beautiful, real-time updating feed
- **Base Network**: Deployed on Base Sepolia testnet (low gas fees!)
- **Modern UI**: Responsive design with dark mode support

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: TailwindCSS with NativeWind
- **Web3**: wagmi v2, viem v2, Reown AppKit
- **Smart Contracts**: Solidity 0.8.28, Hardhat
- **Network**: Base Sepolia (testnet) / Base Mainnet

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A wallet (MetaMask, Coinbase Wallet, etc.)
- Base Sepolia ETH for gas fees ([get from faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))
- A WalletConnect Project ID ([create one free](https://cloud.reown.com/))

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd /Users/mac/notetaker
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your values:

```env
# Get from https://cloud.reown.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# For contract deployment
PRIVATE_KEY=your_wallet_private_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# BaseScan API Key for contract verification (optional)
BASESCAN_API_KEY=your_basescan_api_key

# Will be filled after deployment
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

### 3. Compile Smart Contract

```bash
npm run compile
```

This compiles the `NoteBoard.sol` contract and generates TypeScript types.

### 4. Deploy to Base Sepolia

```bash
npm run deploy:sepolia
```

After deployment, you'll see output like:

```
NoteBoard deployed to: 0x123...abc
Add this to your .env.local file:
NEXT_PUBLIC_CONTRACT_ADDRESS=0x123...abc
```

**Important**: Copy the contract address to your `.env.local` file!

### 5. Verify Contract (Optional)

```bash
npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 📁 Project Structure

```
notetaker/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with Web3Provider
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── WalletConnect.tsx    # Wallet connection UI
│   ├── PostNote.tsx         # Note posting form
│   └── NoteFeed.tsx         # Notes display feed
├── contracts/               # Solidity smart contracts
│   └── NoteBoard.sol        # Main contract
├── lib/                     # Utility functions
│   ├── wagmi.ts            # wagmi & Reown configuration
│   ├── constants.ts        # Contract ABI and address
│   └── Web3Provider.tsx    # Web3 context provider
├── scripts/                 # Deployment scripts
│   └── deploy.ts           # Hardhat deployment
├── ignition/               # Hardhat Ignition modules
│   └── modules/
│       └── NoteBoard.ts    # Ignition deployment module
├── hardhat.config.ts       # Hardhat configuration
├── tailwind.config.ts      # Tailwind configuration
└── README.md              # This file
```

## 📝 Smart Contract

### NoteBoard.sol

The smart contract includes:

**Struct:**
```solidity
struct Note {
    address author;
    string message;
    uint256 timestamp;
}
```

**Key Functions:**
- `postNote(string calldata _message)`: Post a new note (max 280 chars)
- `getAllNotes()`: Get all notes from the board
- `getTotalNotes()`: Get the count of all notes
- `getNote(uint256 _noteId)`: Get a specific note by ID
- `getNotesByAuthor(address _author)`: Get all notes from a specific author

**Events:**
- `NotePosted(uint256 noteId, address author, string message, uint256 timestamp)`

## 🎨 Component Overview

### WalletConnect
- Displays wallet connection button
- Shows connected address in truncated format
- Disconnect functionality

### PostNote
- Text area for message input (max 280 chars)
- Character counter
- Transaction status feedback
- Auto-reset after successful post

### NoteFeed
- Real-time display of all notes
- Auto-refresh on new blocks
- Event-based updates
- Reverse chronological order
- Formatted timestamps and addresses

## 🧪 Testing

Run Hardhat tests (if you add test files):

```bash
npx hardhat test
```

## 🌐 Deployment

### To Base Sepolia (Testnet)

```bash
npm run deploy:sepolia
```

### To Base Mainnet (Production)

⚠️ **Only when ready for production!**

```bash
npm run deploy:base
```

## 🔧 Troubleshooting

### "Contract address not configured"

Make sure you've:
1. Deployed the contract: `npm run deploy:sepolia`
2. Added the address to `.env.local`: `NEXT_PUBLIC_CONTRACT_ADDRESS=0x...`
3. Restarted the dev server

### "User rejected the request"

This happens when you cancel a wallet transaction. Simply try again!

### "Insufficient funds"

Get Base Sepolia ETH from the [Base faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet).

### Network mismatch

Make sure your wallet is connected to Base Sepolia network:
- Chain ID: 84532
- RPC: https://sepolia.base.org

## 📚 Resources

- [Base Documentation](https://docs.base.org/)
- [wagmi Documentation](https://wagmi.sh/)
- [Reown AppKit Docs](https://docs.reown.com/appkit/overview)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 🤝 Contributing

Feel free to fork, improve, and submit pull requests!

## 📄 License

MIT License - feel free to use this project however you'd like!

## 🎉 What's Next?

Ideas to extend this project:

- Add like/reaction functionality
- Implement note editing/deletion (with ownership checks)
- Add user profiles with ENS support
- Create note categories or hashtags
- Add media attachments (IPFS integration)
- Implement pagination for large feeds
- Add search and filter functionality
- Create a trending notes section
- Add tipping functionality

## 💡 Tips

- Keep messages under 280 characters to save on gas
- Each transaction costs gas - posts are permanent!
- Use Base network for lower gas fees vs Ethereum mainnet
- Always test on Sepolia testnet before deploying to mainnet

---

Built with ❤️ using Next.js, wagmi, and Base

Happy posting! 🚀
