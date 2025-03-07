import { log } from "./helpers/logger";
import { DownloaderService } from "./services/downloader.service";
import { NFTService } from "./services/nft.service";
import { ReportService } from "./services/report.service";
import { AppConfig } from "./types";

/**
 * Main application class that orchestrates the NFT download process
 */
export class App {
  private readonly nftService: NFTService;
  private readonly downloaderService: DownloaderService;
  private readonly reportService: ReportService;

  /**
   * Creates a new App instance
   *
   * @param {AppConfig} config - Application configuration
   * @throws {Error} If configuration validation fails
   */
  constructor(config: AppConfig) {
    // Validate config
    this.validateConfig(config);

    // Initialize services
    this.nftService = new NFTService(
      config.chainId,
      config.contractAddress,
      config.moralisApiKey
    );

    this.downloaderService = new DownloaderService(
      this.nftService,
      config.baseIpfsUri,
      config.totalNfts,
      config.dirPath
    );

    this.reportService = new ReportService();
  }

  /**
   * Validates the application configuration
   *
   * @param {AppConfig} config - Configuration to validate
   * @throws {Error} If any required configuration parameters are missing or invalid
   * @private
   */
  private validateConfig(config: AppConfig): void {
    const { chainId, contractAddress, moralisApiKey, baseIpfsUri, totalNfts } =
      config;

    if (!chainId || !contractAddress || !moralisApiKey || !baseIpfsUri) {
      throw new Error("Missing required configuration parameters");
    }

    if (totalNfts <= 0) {
      throw new Error("Total NFTs must be greater than 0");
    }
  }

  /**
   * Starts the NFT download process
   * Initializes services, downloads NFTs, and generates a report
   *
   * @returns {Promise<void>}
   * @throws {Error} If the process fails
   */
  public async start(): Promise<void> {
    try {
      log.info("App", "Starting NFT download process...");

      // Execute download process
      const results = await this.downloaderService.downloadAll();

      // Generate and save report
      await this.reportService.saveResults(results);

      log.info("App", "Process completed successfully");
    } catch (error) {
      log.error("App", `Process failed: ${error}`);
      throw error;
    }
  }
}
