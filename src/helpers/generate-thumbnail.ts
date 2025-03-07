import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { log } from "./logger";

const execAsync = promisify(exec);

/**
 * Generates a thumbnail image from a video file using FFmpeg
 * The thumbnail is created from the first frame of the video
 *
 * @param {string} videoPath - Full path to the source video file
 * @returns {Promise<boolean>} True if thumbnail was generated successfully, false otherwise
 *
 * @example
 * const success = await generateThumbnail('/path/to/video.mp4');
 * // Creates thumbnail at '/path/to/video_thumb.jpg'
 *
 * @throws {Error} If FFmpeg command execution fails
 */
export const generateThumbnail = async (
  videoPath: string
): Promise<boolean> => {
  try {
    const thumbnailPath = videoPath.replace(".mp4", "_thumb.jpg");
    const videoName = path.basename(videoPath);

    if (fs.existsSync(thumbnailPath)) {
      log.skip("Thumbnail", `Already exists for ${videoName}`);
      return true;
    }

    log.info("Thumbnail", `Starting generation for ${videoName}`);
    log.detail("Thumbnail", `Source: ${videoPath}`);
    log.detail("Thumbnail", `Target: ${thumbnailPath}`);

    const { stdout, stderr } = await execAsync(
      `ffmpeg -i "${videoPath}" -ss 00:00:00 -vframes 1 -q:v 2 "${thumbnailPath}"`
    );

    if (stderr) {
      log.detail("FFmpeg", stderr);
    }
    if (stdout) {
      log.detail("FFmpeg", stdout);
    }

    log.success("Thumbnail", `Generated for ${videoName}`);
    return true;
  } catch (error) {
    log.error("Thumbnail", `Failed for ${path.basename(videoPath)}: ${error}`);
    return false;
  }
};
