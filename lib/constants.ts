// Import the contract ABI from Hardhat compilation
import NoteBoardArtifact from "../artifacts/contracts/NoteBoard.sol/NoteBoard.json";

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "") as `0x${string}`;

export const CONTRACT_ABI = NoteBoardArtifact.abi;

export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_CHAIN_ID = 8453;

// Maximum message length (must match contract)
export const MAX_MESSAGE_LENGTH = 280;

