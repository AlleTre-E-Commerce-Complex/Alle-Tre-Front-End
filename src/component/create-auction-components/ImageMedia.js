import React, { useEffect, useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { FileUploader } from "react-drag-drop-files";
import imageCompression from "browser-image-compression";
import { MdOutlineImage } from "react-icons/md";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import addImage from "../../../src/assets/icons/add-image.svg";
import TrashIcon from "../../../src/assets/icons/trash-Icon.png";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import { toast } from "react-hot-toast";

import watermarkImage from "../../../src/assets/logo/WaterMarkFinal.png";
// import { BiPlayCircle } from "react-icons/bi";

// Supported file types (images and videos)
const fileTypes = ["JPG", "PNG", "JPEG", "HEIC", "MP4", "MOV"];


const heic2any = require("heic2any");

const ImageMedia = ({
  auctionId,
  onReload,
  setLoadingImg,
  isEditMode,
  setimgtest,
  images = [],
  isListing,
  auctionState,
}) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [ffmpeg, setFfmpeg] = useState(null);
  // Check if there's already a video in the images array
  const hasExistingVideo = images.some(
    (img) =>
      img?.imagePath?.includes("3arbonVideo") ||
      img?.isVideo ||
      img?.file?.type?.startsWith("video/")
  );
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { run: runDelete, isLoading: isloadingDelete } = useAxios([]);
  const { run: runUpload, isLoading: isloadingUpload } = useAxios([]);

  useEffect(() => {
    setLoadingImg?.(isloadingUpload || isloadingDelete);
  }, [isloadingUpload, isloadingDelete, setLoadingImg]);

  const handelDeleteImg = async (imgId, index, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Create new array without the deleted image and preserve image links
      const newImages = images
        .filter((_, i) => i !== index)
        .map((img) => ({
          ...img,
          imageLink: img.file ? URL.createObjectURL(img.file) : img.imageLink,
        }));

      // If in edit mode and the image has a numeric ID (existing image), delete from backend
      const isNumericId = imgId && !isNaN(Number(imgId));
      if (((isEditMode && auctionId && isNumericId) || auctionState === "DRAFTED") && isNumericId) {
        try {
          await runDelete(
            authAxios.delete(api.app.Imagees.delete(auctionId, imgId, isListing))
          );

          // If delete succeeds and we have new files, update them
          const hasNewFiles = newImages.some((img) => img.file);
          if (hasNewFiles) {
            // Upload each image one at a time
            for (const img of newImages) {
              if (img?.file) {
                const formData = new FormData();
                formData.append("image", img.file);
                await runUpload(
                  authAxios.patch(api.app.Imagees.upload(auctionId, isListing), formData)
                );
              }
            }
          }

          // Update local state immediately after successful backend delete
          setimgtest(newImages);

          toast.success(
            selectedContent[localizationKeys.imageDeletedSuccessfully]
          );

          // Call onReload after successful backend operations
          if (typeof onReload === "function") {
            onReload();
          }
        } catch (backendError) {
          console.error("Backend operation failed:", backendError);
          throw backendError; // Re-throw to be caught by outer try-catch
        }
      } else {
        // For new images or non-edit mode, just update local state
        setimgtest(newImages);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setimgtest(images); // Revert state on error
      toast.error(selectedContent[localizationKeys.failedToDeleteImage]);
    }
  };

  const handleSetCover = async (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      const selectedImage = images[index];
      if (!selectedImage) return;

      // Create new array with selected image as first and preserve image links
      const reorderedImages = [
        {
          ...selectedImage,
          imageLink: selectedImage.file
            ? URL.createObjectURL(selectedImage.file)
            : selectedImage.imageLink,
        },
        ...images.slice(0, index).map((img) => ({
          ...img,
          imageLink: img.file ? URL.createObjectURL(img.file) : img.imageLink,
        })),
        ...images.slice(index + 1).map((img) => ({
          ...img,
          imageLink: img.file ? URL.createObjectURL(img.file) : img.imageLink,
        })),
      ];

      // Update local state first for better UX
      setimgtest(reorderedImages);

      if (isEditMode) {
        try {
          // Upload each image one at a time
          for (const img of reorderedImages) {
            if (img?.file) {
              const formData = new FormData();
              formData.append("image", img.file); // Use 'image' as the key
              await runUpload(
                authAxios.patch(api.app.Imagees.upload(auctionId, isListing), formData)
              );
            }
          }
          toast.success(
            selectedContent[localizationKeys.coverPhotoUpdatedSuccessfully]
          );
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error(
            selectedContent[localizationKeys.failedToUpdateCoverPhoto]
          );
          // Revert local state on error
          setimgtest(images);
        }
      }

      // Call onReload after all operations are complete
      if (typeof onReload === "function") {
        onReload();
      }
    } catch (error) {
      console.error("Set cover error:", error);
      toast.error(selectedContent[localizationKeys.failedToUpdateCoverPhoto]);
      // Revert local state on error
      setimgtest(images);
    }
  };

  const handleChange = async (files, index) => {
    // Check if trying to add a video when one already exists
    if (
      isEditMode &&
      hasExistingVideo &&
      Array.from(files).some((file) => file.type.startsWith("video/"))
    ) {
      toast.error(selectedContent[localizationKeys.onlyOneVideoFileIsAllowed]);
      return;
    }
    if (!files) return;

    try {
      if (typeof setLoadingImg === 'function') setLoadingImg(true);
      const filesArray = Array.from(files);

      // First, check if we're trying to upload a video
      const videoFiles = filesArray.filter((file) =>
        file.type.startsWith("video/")
      );
      const imageFiles = filesArray.filter(
        (file) => !file.type.startsWith("video/")
      );

      // If there are both videos and images in selection, reject
      if (videoFiles.length > 0 && imageFiles.length > 0) {
        toast.error(selectedContent[localizationKeys.cannotMixVideoAndImages]);
        return;
      }

      // Check for existing video first - check both file and imageLink for video type
      const existingVideo = images.some(
        (img) => img?.file?.type?.startsWith("video/") || img?.isVideo
      );

      // If trying to upload a video
      if (videoFiles.length > 0) {
        // Prevent video as first upload
        if (images.length === 0) {
          toast.error(
            selectedContent[
              localizationKeys
                .videoCannotBeTheFirstUploadPleaseUploadAnImageFirstAsItWillBeUsedAsTheCover
            ]
          );
          if (typeof setLoadingImg === 'function') setLoadingImg(false);
          return;
        }

        // Reject if there's already a video
        if (existingVideo) {
          toast.error(
            selectedContent[localizationKeys.onlyOneVideoFileIsAllowed]
          );
          if (typeof setLoadingImg === 'function') setLoadingImg(false);
          return;
        }

        // Reject if trying to upload multiple videos
        if (videoFiles.length > 1) {
          toast.error(
            selectedContent[localizationKeys.onlyOneVideoFileIsAllowed]
          );
          if (typeof setLoadingImg === 'function') setLoadingImg(false);
          return;
        }

        const videoFile = videoFiles[0];
        
        // Reject if video size exceeds 50MB
        if (videoFile.size > 50 * 1024 * 1024) {
          toast.error(selectedContent[localizationKeys.videoSizeLimitExceeded]);
          if (typeof setLoadingImg === 'function') setLoadingImg(false);
          return;
        }

        setProcessingStatus(selectedContent[localizationKeys.validatingVideoDuration]);
        // Validate video duration (max 1 minute)
        try {
          const duration = await getVideoDuration(videoFile);
          if (duration > 61) { // 61 to give a tiny buffer for exactly 60s videos
            toast.error(selectedContent[localizationKeys.videoDurationCannotExceed1Minute]);
            if (typeof setLoadingImg === 'function') setLoadingImg(false);
            return;
          }
        } catch (durationErr) {
          console.error("Duration check error:", durationErr);
          // Only blocking if we are sure it's an error, otherwise proceed with compression
        }

        // Compress the video and extract thumbnail
        const { compressedFile, thumbnailFile } = await compressVideo(videoFile);

        // Watermark the extracted thumbnail if it exists
        let posterUrl = URL.createObjectURL(compressedFile); // Fallback to video blob
        if (thumbnailFile) {
          try {
            setProcessingStatus("Watermarking video cover...");
            const watermarkedThumb = await addImageWatermark(thumbnailFile);
            posterUrl = URL.createObjectURL(watermarkedThumb);
          } catch (thumbError) {
            console.error("Failed to watermark thumbnail:", thumbError);
          }
        }

        setProcessingProgress(100);
        // Process the single video
        const processedVideo = {
          file: compressedFile,
          imageLink: posterUrl,
          id: isEditMode ? `temp_${Date.now()}` : videoFile.name, // Use temp ID in edit mode
          isVideo: true,
        };

        // In edit mode, ensure we're replacing any existing video
        let newImages;
        if (isEditMode) {
          // Remove any existing video first
          const withoutVideo = images.filter(
            (img) => !img.isVideo && !img?.file?.type?.startsWith("video/")
          );
          newImages =
            index !== undefined
              ? [
                  ...withoutVideo.slice(0, index),
                  processedVideo,
                  ...withoutVideo.slice(index),
                ]
              : [...withoutVideo, processedVideo];
        } else {
          // Non-edit mode behavior
          newImages =
            index !== undefined
              ? [
                  ...images.slice(0, index),
                  processedVideo,
                  ...images.slice(index + 1),
                ]
              : [...images, processedVideo];
        }

        // Update state first
        setimgtest(newImages);

        // Handle backend update in edit mode
        if (isEditMode && auctionId) {
          try {
            setIsCompressing(true);
            const filesToUpload = newImages.filter(img => img?.file);
            let currentUploadCount = 0;

            for (let i = 0; i < newImages.length; i++) {
              const img = newImages[i];
              if (img?.file) {
                currentUploadCount++;
                setProcessingStatus(
                  selectedContent[
                    img.isVideo
                      ? localizationKeys.uploadingVideo
                      : localizationKeys.uploadingPhoto
                  ]
                    ?.replace("{current}", currentUploadCount)
                    ?.replace("{total}", filesToUpload.length)
                );
                setProcessingProgress(
                  Math.round((currentUploadCount / filesToUpload.length) * 100)
                );

                const formData = new FormData();
                formData.append("image", img.file);
                const response = await runUpload(
                  authAxios.patch(
                    api.app.Imagees.upload(auctionId, isListing),
                    formData
                  )
                );
                // Update the ID from the backend response
                if (response?.data?.data?.id) {
                  newImages[i].id = response.data.data.id;
                }
              }
            }
            setimgtest([...newImages]);
            if (typeof onReload === "function") {
              onReload();
            }
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            toast.error(selectedContent[localizationKeys.failedToUploadImage]);
            setimgtest(images); // Revert on error
          } finally {
            setIsCompressing(false);
            setProcessingStatus("");
          }
        }
      } else {
        setIsCompressing(true);
        setProcessingStatus(selectedContent[localizationKeys.processingPhoto]?.replace("{current}", 1)?.replace("{total}", imageFiles.length));
        setProcessingProgress(0);

        // Pre-load watermark once to save time
        const preloadedWatermark = await loadImage(watermarkImage);

        const processedFiles = await Promise.all(
          imageFiles.map(async (file, i) => {
            try {
              // STEP 1: Compress first - web worker based, safe for parallel
              const compressedFile = await compressImage(file);
              // STEP 2: Watermark second - using pre-loaded watermark image
              const watermarkedFile = await addImageWatermark(
                compressedFile,
                preloadedWatermark,
              );

              return {
                file: watermarkedFile,
                imageLink: URL.createObjectURL(watermarkedFile),
                id: file.name,
                isVideo: false,
              };
            } catch (err) {
              console.error(`Error processing file ${file.name}:`, err);
              // Fallback to original if processing fails
              return {
                file: file,
                imageLink: URL.createObjectURL(file),
                id: file.name,
                isVideo: false,
              };
            }
          }),
        );

        setProcessingProgress(100);

        // Update state with images
        let newImages;
        if (index !== undefined) {
          newImages = [...images];
          processedFiles.forEach((processedFile, i) => {
            if (index + i < 12) {
              newImages[index + i] = processedFile;
            }
          });
        } else {
          newImages = [...images, ...processedFiles].slice(0, 12);
        }

        // Update state first
        setimgtest(newImages);

        // Handle backend update in edit mode
        if (isEditMode && auctionId) {
          try {
            setIsCompressing(true);
            const filesToUpload = newImages.filter(img => img?.file);
            let currentUploadCount = 0;

            for (let i = 0; i < newImages.length; i++) {
              const img = newImages[i];
              if (img?.file) {
                currentUploadCount++;
                setProcessingStatus(
                  selectedContent[
                    img.isVideo
                      ? localizationKeys.uploadingVideo
                      : localizationKeys.uploadingPhoto
                  ]
                    ?.replace("{current}", currentUploadCount)
                    ?.replace("{total}", filesToUpload.length)
                );
                setProcessingProgress(
                  Math.round((currentUploadCount / filesToUpload.length) * 100)
                );

                const formData = new FormData();
                formData.append("image", img.file);
                const response = await runUpload(
                  authAxios.patch(
                    api.app.Imagees.upload(auctionId, isListing),
                    formData
                  )
                );
                // Update the ID from the backend response
                if (response?.data?.data?.id) {
                  newImages[i].id = response.data.data.id;
                }
              }
            }
            setimgtest([...newImages]);
            if (typeof onReload === "function") {
              onReload();
            }
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            toast.error(selectedContent[localizationKeys.failedToUploadImage]);
            setimgtest(images); // Revert on error
          } finally {
            setIsCompressing(false);
            setProcessingStatus("");
          }
        }
      }
    } catch (error) {
      console.error("Error handling files:", error);
      toast.error("Failed to process files");
      setimgtest(images);
    } finally {
      setIsCompressing(false);
      setProcessingStatus("");
      setProcessingProgress(0);
      if (typeof setLoadingImg === "function") {
        setLoadingImg(false);
      }
    }
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const addImageWatermark = async (file, preloadedWatermark = null) => {
    if (file.type.startsWith("video/")) {
      return file;
    }

    try {
      const [img, watermarkImg] = await Promise.all([
        loadImage(URL.createObjectURL(file)),
        preloadedWatermark ? Promise.resolve(preloadedWatermark) : loadImage(watermarkImage),
      ]);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const maxDim = Math.max(img.width, img.height);
      let watermarkWidth = maxDim * 0.4;
      if (watermarkWidth > img.width * 0.8) {
        watermarkWidth = img.width * 0.8;
      }
      const watermarkHeight =
        (watermarkImg.height / watermarkImg.width) * watermarkWidth;
      const x = (img.width - watermarkWidth) / 2;
      const y = (img.height - watermarkHeight) / 2;

      ctx.globalAlpha = 0.5;
      ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
      ctx.globalAlpha = 1.0;

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(
                new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: new Date().getTime(),
                })
              );
            } else {
              reject(new Error("Canvas to Blob conversion failed"));
            }
          },
          "image/jpeg",
          0.8
        );
      });
    } catch (error) {
      toast.error(selectedContent[localizationKeys.errorInWatermarkProcess]);
      throw error;
    }
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject("Failed to load video metadata");
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const generateVideoThumbnailFallback = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        // Seek to 0.5 seconds to get a valid frame
        video.currentTime = 0.5;
      };
      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], "thumbnail.jpg", { type: "image/jpeg" }));
            } else {
              resolve(null);
            }
            window.URL.revokeObjectURL(video.src);
          }, "image/jpeg", 0.7);
        } catch (err) {
          console.error("Canvas thumbnail generation failed:", err);
          window.URL.revokeObjectURL(video.src);
          resolve(null);
        }
      };
      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(null);
      };
    });
  };

  const loadFFmpeg = async () => {
    if (ffmpeg) return ffmpeg;
    const instance = createFFmpeg({
      log: false,
      logger: () => {}, // Absolute silence
      corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
    });
    
    // Add progress listener
    instance.setProgress(({ ratio }) => {
      setProcessingProgress(Math.round(ratio * 100));
    });

    await instance.load();
    setFfmpeg(instance);
    return instance;
  };

  const compressVideo = async (file) => {
    const isSmallMp4 = file.size < 30 * 1024 * 1024 && file.type === "video/mp4";
    
    // SMART BYPASS: If file is already small and in mp4 format, skip heavy compression
    if (isSmallMp4) {
      setProcessingStatus("Generating video cover...");
      const thumbnailFile = await generateVideoThumbnailFallback(file);
      return { compressedFile: file, thumbnailFile };
    }

    if (!window.crossOriginIsolated) {
      console.warn("SharedArrayBuffer is not available. Ensure COOP/COEP headers are set for compression.");
      
      // Attempt Canvas fallback for thumbnail even if compression is skipped
      setProcessingStatus("Generating video cover...");
      const thumbnailFile = await generateVideoThumbnailFallback(file);
      
      return { compressedFile: file, thumbnailFile };
    }

    setIsCompressing(true);
    setProcessingStatus(selectedContent[localizationKeys.compressingVideo]);
    setProcessingProgress(0);
    const toastId = toast.loading("Compressing video... This may take a moment.");
    try {
      const ffmpegInstance = await loadFFmpeg();
      const { name } = file;
      ffmpegInstance.FS("writeFile", name, await fetchFile(file));

      // Failsafe: Temporarily silence console to catch anything the logger missed
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      console.log = () => {};
      console.error = () => {};
      console.warn = () => {};

      try {
        // STEP 1: Compress the video
        setProcessingStatus(selectedContent[localizationKeys.compressingVideo]);
        await ffmpegInstance.run("-i", name, "-vcodec", "libx264", "-crf", "30", "-preset", "ultrafast", "output.mp4");

        // STEP 2: Extract a thumbnail frame
        setProcessingStatus("Extracting video cover...");
        await ffmpegInstance.run("-i", "output.mp4", "-ss", "00:00:00.500", "-vframes", "1", "thumbnail.jpg");
      } finally {
        // Restore console immediately
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
      }

      // Read compressed video
      const videoData = ffmpegInstance.FS("readFile", "output.mp4");
      const compressedFile = new File([videoData.buffer], name, {
        type: "video/mp4",
      });

      // Read thumbnail image
      let thumbnailFile = null;
      try {
        const thumbData = ffmpegInstance.FS("readFile", "thumbnail.jpg");
        thumbnailFile = new File([thumbData.buffer], "thumbnail.jpg", {
          type: "image/jpeg",
        });
      } catch (thumbErr) {
        console.error("Failed to extract thumbnail:", thumbErr);
      }

      // Cleanup
      ffmpegInstance.FS("unlink", name);
      ffmpegInstance.FS("unlink", "output.mp4");
      try { ffmpegInstance.FS("unlink", "thumbnail.jpg"); } catch (e) {}

      toast.success("Video processed successfully", { id: toastId });
      return { compressedFile, thumbnailFile };
    } catch (error) {
      console.error("Video compression failed details:", error);
      const errorMessage = error.message?.includes("SharedArrayBuffer") 
        ? "Video compression failed: Security headers (COOP/COEP) are missing." 
        : "Video compression failed, using original file";
      toast.error(errorMessage, { id: toastId });
      return { compressedFile: file, thumbnailFile: null };
    } finally {
      setIsCompressing(false);
    }
  };

  const compressImage = async (file) => {
    try {
      let processedFile = file;

      // Convert HEIC/HEIF to JPEG first
      if (
        file.type.toLowerCase().includes("heic") ||
        file.type.toLowerCase().includes("heif")
      ) {
        try {
          const blob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.7,
          });
          processedFile = new File(
            [blob],
            file.name.replace(/\.(heic|heif)$/i, ".jpg"),
            {
              type: "image/jpeg",
              lastModified: new Date().getTime(),
            }
          );
        } catch (heicError) {
          toast.error(selectedContent[localizationKeys.fileConversionFailed]);
          return file;
        }
      }

      const options = {
        maxSizeMB: 0.3, // Target ~300KB
        initialQuality: 0.5,
        useWebWorker: true,
        fileType: "image/jpeg",
        preserveExif: false,
        alwaysKeepResolution: true, // Keep original dimensions
        exifOrientation: true,
        maxIteration: 5, // Limit iterations for speed
      };

      let compressedFile = await imageCompression(processedFile, options);

      // Simple check to avoid redundant second pass if already close to target
      if (compressedFile.size > 500 * 1024) {
        options.initialQuality = 0.4;
        compressedFile = await imageCompression(processedFile, options);
      }

      return new File([compressedFile], processedFile.name, {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });
    } catch (error) {
      console.error("Compression failed:", error);
      return file;
    }
  };

  return (
    <>

      <div className={`image-upload-container ${isCompressing ? 'opacity-60 pointer-events-none' : ''}`}>
        <div className="flex flex-col gap-5">
          {isCompressing && (
            <div className="bg-white/50 dark:bg-[#1A1F2C]/50 backdrop-blur-sm border border-primary  rounded-2xl p-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary dark:bg-yellow animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                  <span className="text-gray-700 dark:text-gray-200 text-sm font-bold tracking-tight uppercase">
                    {processingStatus}
                  </span>
                </div>
                <span className="text-primary dark:text-yellow text-sm font-black tabular-nums">
                  {processingProgress}%
                </span>
              </div>
              
              <div className="w-full h-2.5 bg-gray-200/50 dark:bg-gray-800/50 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700/50">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary-light dark:from-yellow dark:to-yellow-400 transition-all duration-500 ease-out relative shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
                  style={{ width: `${processingProgress}%` }}
                >
                  <div className="absolute inset-0 bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] animate-[shimmer_1s_linear_infinite]" />
                </div>
              </div>
              
              <p className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-[0.1em] text-center">
                {selectedContent[localizationKeys.optimizationFinishedWarning]}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-y-4 gap-x-4">
            {[...images, ...Array(Math.max(3 - images.length, 1)).fill(null)]
              .slice(0, Math.min(12, Math.max(images.length + 1, 3)))
              .map((img, index) => {
                const isCoverPhoto = index === 0;
                const existingVideo = images.some((img) =>
                  img?.file?.type?.startsWith("video/")
                );

                return (
                  <div key={index} className="relative">
                    {img ? (
                      <div className="relative group rounded-xl overflow-hidden">
                        <div className="sm:w-[154px] w-full h-[139px] hover:bg-black/40 absolute z-30 group">
                          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                              className="bg-white/80 dark:bg-black/50 hover:bg-red-500 hover:text-white p-2 rounded-full shadow hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                              onClick={(e) => handelDeleteImg(img.id, index, e)}
                            >
                              <img
                                className="w-4 h-4"
                                src={TrashIcon}
                                alt="Remove"
                              />
                            </button>
                          </div>
                        </div>
                        {isCoverPhoto && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                              {selectedContent[localizationKeys.cover]}
                            </span>
                          </div>
                        )}
                        {/* {(isEditMode || auctionState === "DRAFTED") && (img?.imagePath?.includes("AlletreVideo") || img?.isVideo || img?.file?.type?.startsWith("video/")) ? (
                          <div className="relative w-[154px] h-[139px] overflow-hidden rounded-lg group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 group-hover:from-black/30 group-hover:to-black/70 transition-all duration-300"></div>
                            <div className="absolute inset-0 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all duration-300"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <BiPlayCircle className="w-14 h-14 drop-shadow-lg transform group-hover:scale-110 text-white/70 transition-all duration-300 ease-out" />
                            </div>
                          </div>
                        ) : */}
                        <FileUploader
                          handleChange={(files) => handleChange(files, index)}
                          name={`file${index + 1}`}
                          types={
                            isEditMode && hasExistingVideo
                              ? fileTypes.filter(
                                  (type) => !["MP4", "MOV"].includes(type)
                                )
                              : fileTypes
                          }
                          multiple={
                            !existingVideo &&
                            !(
                              img?.file?.type?.startsWith("video/") ||
                              img?.isVideo
                            )
                          }
                        >
                          <div className="relative">
                            {img?.file?.type?.startsWith("video/") ||
                            img?.isVideo ? (
                              <div className="relative">
                                <video
                                  className={`rounded-xl w-[154px] h-[139px] object-cover shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A1F2C] ${
                                    isCoverPhoto ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-[#1A1F2C]" : ""
                                  }`}
                                  controls
                                  poster={img.imageLink} // Use the watermarked thumbnail as poster
                                >
                                  <source
                                    src={
                                      img.file
                                        ? URL.createObjectURL(img.file)
                                        : img.imageLink
                                    }
                                    type={img.file?.type || "video/mp4"}
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ) : (
                              <img
                                className={`rounded-xl w-[154px] h-[139px] object-cover shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A1F2C] ${
                                  isCoverPhoto ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-[#1A1F2C]" : ""
                                }`}
                                src={img.imageLink || addImage}
                                alt="Product img"
                                onError={(e) => {
                                  console.error(
                                    "Image failed to load:",
                                     e.target.src
                                  );
                                  e.target.src = addImage;
                                }}
                              />
                            )}
                          </div>
                        </FileUploader>

                        {!isCoverPhoto &&
                          !isEditMode &&
                          auctionState !== "DRAFTED"  &&
                          !img.file?.type?.startsWith("video/") && (
                            <div className="absolute bottom-2 left-0 right-0 text-white hover:text-primary dark:text-yellow dark:hover:text-white text-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-40">
                              <button
                                onClick={(e) => handleSetCover(index, e)}
                                className="bg-primary hover:bg-white/90 dark:hover:bg-yellow px-3 py-1 rounded-full text-sm shadow hover:shadow-lg transition-all duration-300 flex items-center gap-1 mx-auto"
                              >
                                <MdOutlineImage className="w-4 h-4" />
                                Set as Cover
                              </button>
                            </div>
                          )}
                      </div>
                    ) : (
                      <FileUploader
                        handleChange={(files) => handleChange(files)}
                        name={`file${index + 1}`}
                        types={fileTypes}
                        multiple
                      >
                        {index === 0 ? (
                           <div className="border border-dashed border-yellow dark:border-yellow rounded-xl w-[154px] h-[139px] flex flex-col justify-center items-center cursor-pointer hover:bg-primary/5 dark:hover:bg-yellow-200/5 transition-colors bg-transparent">
                             <MdOutlineImage className="text-primary dark:text-yellow w-7 h-7 mb-2" />
                             <span className="text-primary dark:text-yellow text-[10px] uppercase font-bold tracking-wider">Main Photo</span>
                           </div>
                        ) : (
                           <div className="rounded-xl w-[154px] h-[139px] flex justify-center items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2A3143] transition-colors bg-gray-50 dark:bg-[#22283A]">
                              <MdOutlineImage className="text-gray-400 dark:text-gray-500 w-6 h-6 opacity-60" />
                           </div>
                        )}
                      </FileUploader>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageMedia;
