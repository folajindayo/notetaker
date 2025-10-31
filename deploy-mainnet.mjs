import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

let PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY.startsWith('0x')) {
  PRIVATE_KEY = '0x' + PRIVATE_KEY;
}

const RPC_URL = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const contractJSON = JSON.parse(fs.readFileSync("./artifacts/contracts/NoteBoard.sol/NoteBoard.json", "utf8"));

async function main() {
  console.log("🚀 Deploying NoteBoard to Base Mainnet...\n");
  console.log("⚠️  WARNING: This will cost REAL ETH!\n");

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log("📝 Deploying with account:", wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  if (parseFloat(ethers.formatEther(balance)) < 0.001) {
    console.error("❌ Insufficient balance! Need at least 0.001 ETH");
    process.exit(1);
  }

  const factory = new ethers.ContractFactory(contractJSON.abi, contractJSON.bytecode, wallet);
  
  console.log("⏳ Deploying contract to MAINNET...");
  const contract = await factory.deploy();
  
  console.log("⏳ Waiting for confirmation...");
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  
  console.log("\n✅ NoteBoard deployed to MAINNET!");
  console.log("📍 Contract address:", address);
  console.log("\n🔍 View on BaseScan:");
  console.log(`https://basescan.org/address/${address}`);
  console.log("\n📝 Update your .env.local:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  
  // Update .env.local
  const envContent = fs.readFileSync(".env.local", "utf8");
  const updated = envContent.replace(/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/, `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  fs.writeFileSync(".env.local", updated);
  console.log("\n✅ .env.local updated!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
