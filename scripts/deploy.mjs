import { ethers } from "hardhat";

async function main() {
  console.log("Deploying NoteBoard contract to Base Sepolia...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const NoteBoard = await ethers.getContractFactory("NoteBoard");
  const noteBoard = await NoteBoard.deploy();

  await noteBoard.waitForDeployment();

  const address = await noteBoard.getAddress();
  console.log("\n✅ NoteBoard deployed to:", address);
  console.log("\nAdd this to your .env.local file:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  console.log("\nTo verify on BaseScan, run:");
  console.log(`npx hardhat verify --network baseSepolia ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
