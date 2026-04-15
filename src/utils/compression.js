import imageCompression from "browser-image-compression";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

/**
 * Compresses an image file using browser-image-compression
 * @param {File} file - The image file to compress
 * @returns {Promise<File>} - The compressed image file
 */
export const compressImage = async (file) => {
  try {
    // Skip small images
    if (file.size <= 500 * 1024) return file;

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
      fileType: "image/jpeg",
    };

    const compressedBlob = await imageCompression(file, options);
    return new File([compressedBlob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Image compression failed:", error);
    return file;
  }
};

/**
 * Compresses a video file using ffmpeg.wasm fallback to original if COOP/COEP headers are missing
 * @param {File} file - The video file to compress
 * @returns {Promise<File>} - The compressed video file
 */
export const compressVideo = async (file) => {
  // Skip small videos
  if (file.size <= 2 * 1024 * 1024) return file;

  // Check for SharedArrayBuffer (required for ffmpeg.wasm @0.10+)
  if (!window.crossOriginIsolated) {
    console.warn("SharedArrayBuffer not available. Skipping video compression.");
    return file;
  }

  try {
    const ffmpeg = createFFmpeg({ 
      log: false,
      corePath: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js"
    });
    await ffmpeg.load();

    const { name } = file;
    ffmpeg.FS("writeFile", name, await fetchFile(file));

    // Fast x264 compression with high CRF (lower quality, higher compression)
    await ffmpeg.run(
      "-i", name,
      "-vcodec", "libx264",
      "-crf", "32",
      "-preset", "ultrafast",
      "-vf", "scale='min(720,iw)':'-2'", // Max 720p
      "output.mp4"
    );

    const data = ffmpeg.FS("readFile", "output.mp4");
    return new File([data.buffer], name.replace(/\.[^/.]+$/, ".mp4"), {
      type: "video/mp4",
    });
  } catch (error) {
    console.error("Video compression failed:", error);
    return file;
  }
};

/**
 * Main helper to compress any chat media file
 * @param {File} file 
 * @returns {Promise<File>}
 */
export const compressChatMedia = async (file) => {
  if (file.type.startsWith("image/")) {
    return await compressImage(file);
  }
  if (file.type.startsWith("video/")) {
    return await compressVideo(file);
  }
  return file;
};
