import { downloadVideo } from "../helpers/download-video";
import { log } from "../helpers/logger";
import { DownloadResults, NFTMetadata } from "../types";
import { NFTService } from "./nft.service";

/**
 * Service responsible for downloading NFT videos and managing download results
 */
export class DownloaderService {
  private results: DownloadResults;

  /**
   * Creates a new DownloaderService instance
   *
   * @param {NFTService} nftService - Service for interacting with NFTs
   * @param {string} baseIpfsUri - Base URI for IPFS content
   * @param {number} totalNfts - Total number of NFTs to process
   * @param {string} dirPath - Directory path for storing downloaded files
   */
  constructor(
    private readonly nftService: NFTService,
    private readonly baseIpfsUri: string,
    private readonly totalNfts: number,
    private readonly dirPath: string
  ) {
    this.results = {
      successful: [],
      failed: [],
      skipped: [],
      noMetadata: [],
      noImage: [],
      stats: {
        totalNFTs: this.totalNfts,
        processed: 0,
        downloaded: 0,
        skipped: 0,
        failed: 0,
        noMetadata: 0,
        noImage: 0,
      },
    };
  }

  /**
   * Processes a single NFT token for download
   *
   * @param {number} tokenId - The ID of the token to process
   * @param {NFTMetadata} metadata - The metadata of the token
   * @returns {Promise<void>}
   * @private
   */
  private async processNFT(
    tokenId: number,
    metadata: NFTMetadata
  ): Promise<void> {
    try {
      this.results.stats.processed++;
      const videoName = metadata.image.split("/").pop();
      const name = metadata.name
        ? metadata.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()
        : `nft_${tokenId}`;
      const fileName = `${name}.mp4`;

      log.info("NFT", `Processing ${metadata.name} (ID: ${tokenId})`);
      const wasDownloaded = await downloadVideo(
        this.dirPath,
        this.baseIpfsUri,
        videoName || "",
        fileName,
        metadata
      );

      if (wasDownloaded) {
        this.results.stats.downloaded++;
        this.results.successful.push({
          tokenId,
          uri: `https://${this.baseIpfsUri}/${tokenId}`,
        });
      } else {
        this.results.stats.skipped++;
        this.results.skipped.push({
          tokenId,
        });
      }
    } catch (error) {
      log.error("NFT", `Failed to process token ${tokenId}: ${error}`);
      this.results.failed.push({
        tokenId,
        error: String(error),
        uri: `https://${this.baseIpfsUri}/${tokenId}`,
      });
      this.results.stats.failed++;
    }
  }

  /**
   * Downloads all NFTs in the collection
   * Processes each token sequentially with rate limiting
   *
   * @returns {Promise<DownloadResults>} Results of the download operation
   * @throws {Error} If the download process fails
   */
  async downloadAll(): Promise<DownloadResults> {
    try {
      await this.nftService.initialize();

      for (let tokenId = 0; tokenId <= this.totalNfts; tokenId++) {
        log.info("Progress", `Processing NFT ${tokenId}/${this.totalNfts}`);

        try {
          const metadata = await this.nftService.getNFTMetadata(tokenId);

          if (!metadata) {
            this.results.noMetadata.push({
              tokenId,
              uri: `https://${this.baseIpfsUri}/${tokenId}`,
            });
            this.results.stats.noMetadata++;
            continue;
          }

          if (!metadata.image) {
            log.warning("NFT", `No image URL found for token ${tokenId}`);
            this.results.noImage.push(tokenId);
            this.results.stats.noImage++;
            continue;
          }

          await this.processNFT(tokenId, metadata);
        } catch (error) {
          this.results.failed.push({
            tokenId,
            error: String(error),
            uri: `https://${this.baseIpfsUri}/${tokenId}`,
          });
          this.results.stats.failed++;
        }

        log.info("Rate Limit", "Waiting 500ms before next request...");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      return this.results;
    } catch (error) {
      log.error("Fatal", `Download process failed: ${error}`);
      throw error;
    }
  }
}
