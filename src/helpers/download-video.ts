import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { generateThumbnail } from "./generate-thumbnail";
import { log } from "./logger";

/**
 * Downloads a video file from a specified URI and saves it to the local filesystem.
 * Also generates a thumbnail for the downloaded video.
 *
 * @param {string} dirPath - The relative directory path where the video will be saved
 * @param {string} baseUri - The base URI of the video source
 * @param {string} videoName - The name of the video file on the server
 * @param {string} fileName - The name to save the file as locally
 * @param {Object} metadata - Metadata object containing information about the video
 * @param {string} metadata.name - The display name of the video
 * @param {string} metadata.description - The description of the video
 * @param {Object[]} [metadata.attributes] - Optional array of video attributes
 *
 * @returns {Promise<boolean>} Returns true if the video was downloaded successfully,
 *                            false if the file already exists or if an error occurred
 *
 * @throws {Error} Throws an error if the video fetch request fails
 */
export const downloadVideo = async (
  dirPath: string,
  baseUri: string,
  videoName: string,
  fileName: string,
  metadata: any
): Promise<boolean> => {
  try {
    const videosDir = path.join(process.cwd(), dirPath);
    if (!fs.existsSync(videosDir)) {
      log.info("Setup", `Creating videos directory: ${videosDir}`);
      fs.mkdirSync(videosDir);
    }

    const filePath = path.join(videosDir, fileName);

    if (fs.existsSync(filePath)) {
      log.skip("Download", `File exists: ${fileName}`);
      log.detail("Metadata", `Name: ${metadata.name}`);
      log.detail("Metadata", `Description: ${metadata.description}`);
      if (metadata.attributes) {
        log.detail("Attributes", JSON.stringify(metadata.attributes, null, 2));
      }
      await generateThumbnail(filePath);
      return false;
    }

    log.info("Download", `Starting for: ${fileName}`);
    const url = `${baseUri}${videoName}`;
    log.detail("Download", `URL: ${url}`);

    const response = await fetch(url);
    log.detail(
      "Download",
      `Response: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    log.info("Write", `Starting file write: ${fileName}`);
    const fileStream = fs.createWriteStream(filePath);
    await finished(Readable.fromWeb(response.body as any).pipe(fileStream));

    log.success("Download", `Saved: ${fileName}`);
    log.detail("Metadata", `Name: ${metadata.name}`);
    log.detail("Metadata", `Description: ${metadata.description}`);
    if (metadata.attributes) {
      log.detail("Attributes", JSON.stringify(metadata.attributes, null, 2));
    }

    await generateThumbnail(filePath);
    return true;
  } catch (error) {
    log.error("Download", `Failed for ${fileName}: ${error}`);
    return false;
  }
};
