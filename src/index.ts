import dotenv from "dotenv";
import { log } from "./helpers/logger";
import { App } from "./main";
import { AppConfig } from "./types";

// Load environment variables
dotenv.config();

/**
 * Main entry point of the application
 * Initializes configuration from environment variables and starts the app
 *
 * @returns {Promise<void>}
 * @throws {Error} If initialization or execution fails
 */
async function main() {
  try {
    // Create app configuration from environment variables
    const config: AppConfig = {
      chainId: process.env.CHAIN_ID as string,
      contractAddress: process.env.NFT_CONTRACT_ADDRESS as string,
      moralisApiKey: process.env.MORALIS_API_KEY as string,
      baseIpfsUri: process.env.IPFS_BASE_URI as string,
      totalNfts: parseInt(process.env.TOTAL_NFTS || "171"),
      dirPath: process.env.DIR_PATH || "assets",
    };

    // Initialize and start the application
    const app = new App(config);
    await app.start();
  } catch (error) {
    log.error("Main", `Application failed: ${error}`);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  log.error("System", `Uncaught exception: ${error}`);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  log.error("System", `Unhandled rejection: ${error}`);
  process.exit(1);
});

// Start the application
main();
