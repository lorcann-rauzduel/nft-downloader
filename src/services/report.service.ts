import fs from "fs";
import path from "path";
import { log } from "../helpers/logger";
import { DownloadResults } from "../types";

/**
 * Service for generating and saving download operation reports
 */
export class ReportService {
  /**
   * Saves download results to a JSON file and prints a summary
   *
   * @param {DownloadResults} results - The results of the download operation
   * @returns {Promise<void>}
   * @throws {Error} If writing the results file fails
   */
  async saveResults(results: DownloadResults): Promise<void> {
    const resultsPath = path.join(process.cwd(), "results.json");
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    log.success("Report", `Detailed results saved to ${resultsPath}`);

    this.printSummary(results);
  }

  /**
   * Prints a formatted summary of the download results to the console
   *
   * @param {DownloadResults} results - The results to summarize
   * @private
   */
  private printSummary(results: DownloadResults): void {
    log.success(
      "Complete",
      `\nProcess finished with following results:\n` +
        `📊 Total NFTs: ${results.stats.totalNFTs}\n` +
        `✨ Processed: ${results.stats.processed}\n` +
        `📥 Downloaded: ${results.stats.downloaded}\n` +
        `⏭️ Skipped: ${results.stats.skipped}\n` +
        `❌ Failed: ${results.stats.failed}\n` +
        `⚠️ No Metadata: ${results.stats.noMetadata}\n` +
        `🖼️ No Image URL: ${results.stats.noImage}\n\n` +
        `Successful Downloads: ${results.successful.length} NFTs\n` +
        results.successful.map((s) => `  - Token ${s.tokenId}`).join("\n") +
        `\n\nFailed Downloads: ${results.failed.length} NFTs\n` +
        results.failed
          .map((f) => `  - Token ${f.tokenId}: ${f.error}`)
          .join("\n") +
        `\n\nSkipped (Already Downloaded): ${results.skipped.length} NFTs\n` +
        results.skipped.map((s) => `  - Token ${s.tokenId}`).join("\n") +
        `\n\nTokens Without Metadata: ${results.noMetadata.join(", ")}\n` +
        `Tokens Without Image URL: ${results.noImage.join(", ")}`
    );
  }
}
