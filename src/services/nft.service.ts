import Moralis from "moralis";
import { log } from "../helpers/logger";
import { NFTMetadata } from "../types";

/**
 * Service for interacting with NFTs on the blockchain
 * Handles metadata retrieval and blockchain communication
 */
export class NFTService {
  /**
   * Creates a new NFTService instance
   *
   * @param {string} chainId - The blockchain network identifier
   * @param {string} contractAddress - The NFT contract address
   * @param {string} apiKey - Moralis API key for authentication
   */
  constructor(
    private readonly chainId: string,
    private readonly contractAddress: string,
    private readonly apiKey: string
  ) {}

  /**
   * Initializes the Moralis connection
   * Must be called before using any other methods
   *
   * @returns {Promise<void>}
   * @throws {Error} If Moralis initialization fails
   */
  async initialize(): Promise<void> {
    log.info("Init", "Starting blockchain connection...");
    await Moralis.start({
      apiKey: this.apiKey,
    });
    log.success("Init", "Blockchain connected");
  }

  /**
   * Retrieves metadata for a specific NFT token
   *
   * @param {number} tokenId - The ID of the token to fetch metadata for
   * @returns {Promise<NFTMetadata | null>} The token metadata if found, null otherwise
   * @throws {Error} If metadata retrieval fails
   */
  async getNFTMetadata(tokenId: number): Promise<NFTMetadata | null> {
    try {
      log.info("NFT", `Fetching metadata for token ${tokenId}`);
      const response = await Moralis.EvmApi.nft.getNFTMetadata({
        chain: this.chainId,
        format: "decimal",
        normalizeMetadata: true,
        mediaItems: false,
        address: this.contractAddress,
        tokenId: tokenId.toString(),
      });

      if (!response?.raw?.metadata) {
        log.warning("NFT", `No metadata found for token ${tokenId}`);
        return null;
      }

      const metadata = JSON.parse(response.raw.metadata) as NFTMetadata;
      log.detail(
        "NFT",
        `Token ${tokenId} metadata: ${JSON.stringify(metadata, null, 2)}`
      );

      return metadata;
    } catch (error) {
      log.error(
        "NFT",
        `Failed to fetch metadata for token ${tokenId}: ${error}`
      );
      throw error;
    }
  }
}
