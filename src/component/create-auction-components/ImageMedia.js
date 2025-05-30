import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "component/shared/lotties-file/loding-test-allatre";
import watermarkImage from "../../../src/assets/logo/WaterMarkFinal.png";
// import { BiPlayCircle } from "react-icons/bi";

// Supported file types (images and videos)
const fileTypes = ["JPG", "PNG", "JPEG", "HEIC", "MP4", "MOV"];

const heic2any = require("heic2any");

const MAX_VIDEO_SIZE_MB = 50;

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
  // Check if there's already a video in the images array
  const hasExistingVideo = images.some(
    (img) =>
      img?.imagePath?.includes("AlletreVideo") ||
      img?.isVideo ||
      img?.file?.type?.startsWith("video/")
  );
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { run: runDelete, isLoading: isloadingDelete } = useAxios([]);
  const { run: runUpload, isLoading: isloadingUpload } = useAxios([]);

  useEffect(() => {
    setLoadingImg?.(isloadingUpload);
  }, [isloadingUpload, setLoadingImg]);

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

      // If in edit mode and the image has an ID (existing image), delete from backend
      if ((isEditMode && auctionId && imgId) || auctionState === "DRAFTED") {
        try {
          await runDelete(
            authAxios.delete(api.app.Imagees.delete(auctionId, imgId))
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
                  authAxios.patch(api.app.Imagees.upload(auctionId), formData)
                );
              }
            }
          }

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
                authAxios.patch(api.app.Imagees.upload(auctionId), formData)
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
          return;
        }

        // Reject if there's already a video
        if (existingVideo) {
          toast.error(
            selectedContent[localizationKeys.onlyOneVideoFileIsAllowed]
          );
          return;
        }

        // Reject if trying to upload multiple videos
        if (videoFiles.length > 1) {
          toast.error(
            selectedContent[localizationKeys.onlyOneVideoFileIsAllowed]
          );
          return;
        }

        const videoFile = videoFiles[0];

        // Check video size
        if (videoFile.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
          toast.error(selectedContent[localizationKeys.videoSizeLimitExceeded]);
          return;
        }

        // Process the single video
        const processedVideo = {
          file: videoFile,
          imageLink: URL.createObjectURL(videoFile),
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
            // Upload each image one at a time
            for (const img of newImages) {
              if (img?.file) {
                const formData = new FormData();
                formData.append("image", img.file); // Use 'image' as the key
                await runUpload(
                  authAxios.patch(
                    api.app.Imagees.upload(auctionId, isListing),
                    formData
                  )
                );
              }
            }
            if (typeof onReload === "function") {
              onReload();
            }
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            toast.error(selectedContent[localizationKeys.failedToUploadImage]);
            setimgtest(images); // Revert on error
          }
        }
      } else {
        // Handle image uploads
        const processedFiles = await Promise.all(
          imageFiles.map(async (file) => {
            const watermarkedFile = await addImageWatermark(file);
            const compressedFile = await compressImage(watermarkedFile);
            return {
              file: compressedFile,
              imageLink: URL.createObjectURL(compressedFile),
              id: file.name,
              isVideo: false,
            };
          })
        );

        // Update state with images
        let newImages;
        if (index !== undefined) {
          newImages = [...images];
          processedFiles.forEach((processedFile, i) => {
            if (index + i < 50) {
              newImages[index + i] = processedFile;
            }
          });
        } else {
          newImages = [...images, ...processedFiles].slice(0, 50);
        }

        // Update state first
        setimgtest(newImages);

        // Handle backend update in edit mode
        if (isEditMode && auctionId) {
          try {
            // Upload each image one at a time
            for (const img of newImages) {
              if (img?.file) {
                const formData = new FormData();
                formData.append("image", img.file); // Use 'image' as the key
                await runUpload(
                  authAxios.patch(api.app.Imagees.upload(auctionId), formData)
                );
              }
            }
            if (typeof onReload === "function") {
              onReload();
            }
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            toast.error(selectedContent[localizationKeys.failedToUploadImage]);
            setimgtest(images); // Revert on error
          }
        }
      }
    } catch (error) {
      console.error("Error handling files:", error);
      toast.error("Failed to process files");
      setimgtest(images);
    }
  };

  const addImageWatermark = async (file) => {
    if (file.type.startsWith("video/")) {
      return file;
    }

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    try {
      const [img, watermarkImg] = await Promise.all([
        loadImage(URL.createObjectURL(file)),
        loadImage(watermarkImage),
      ]);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const watermarkWidth = img.width * 0.3;
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
            quality: 0.7, // Reduced from 0.8
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

      // Skip compression if already small enough
      if (processedFile.size <= 500 * 1024) {
        // Reduced from 800KB to 500KB
        return processedFile;
      }

      const options = {
        maxSizeMB: 0.5, // Reduced from 0.8
        maxWidthOrHeight: 1600, // Reduced from 1920
        initialQuality: 0.6, // Reduced from 0.7
        useWebWorker: true,
        fileType: "image/jpeg",
        preserveExif: false,
        alwaysKeepResolution: false, // Changed to false to allow downscaling
        exifOrientation: true,
      };

      let compressedFile = await imageCompression(processedFile, options);

      // If still too large, compress further
      if (compressedFile.size > 500 * 1024) {
        // Target 500KB max
        options.maxSizeMB = 0.3;
        options.initialQuality = 0.5;
        options.maxWidthOrHeight = 1200;
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
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isloadingDelete || isloadingUpload}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <div className="image-upload-container">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-y-4 gap-x-4">
            {[...images, ...Array(Math.max(3 - images.length, 1)).fill(null)]
              .slice(0, Math.min(50, Math.max(images.length + 1, 3)))
              .map((img, index) => {
                const isCoverPhoto = index === 0;
                const existingVideo = images.some((img) =>
                  img?.file?.type?.startsWith("video/")
                );

                return (
                  <div key={index} className="relative">
                    {img ? (
                      <div className="relative group">
                        <div className="sm:w-[154px] w-full h-[139px] hover:bg-gradient-to-t hover:from-[#25252562] absolute z-30 group">
                          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                              className="bg-white/50 hover:bg-gray-med hover:text-white p-2 rounded-full shadow hover:shadow-lg transition-all duration-300"
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
                                  className={`border-primary border-solid rounded-lg w-[154px] h-[139px] object-cover ${
                                    isCoverPhoto ? "ring-2 ring-primary" : ""
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
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                  <img
                                    src={watermarkImage}
                                    className="opacity-50 w-1/3 h-auto"
                                    alt="Watermark"
                                  />
                                </div>
                              </div>
                            ) : (
                              <img
                                className={`border-primary border-solid rounded-lg w-[154px] h-[139px] object-cover ${
                                  isCoverPhoto ? "ring-2 ring-primary" : ""
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
                          !auctionState === "DRAFTED" &&
                          !img.file?.type?.startsWith("video/") && (
                            <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-40">
                              <button
                                onClick={(e) => handleSetCover(index, e)}
                                className="bg-primary hover:bg-white/90 text-white hover:text-primary px-3 py-1 rounded-full text-sm shadow hover:shadow-lg transition-all duration-300 flex items-center gap-1 mx-auto"
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
                        <div className="border-gray-med border-[1px] border-dashed rounded-lg w-[154px] h-[139px] flex justify-center items-center cursor-pointer">
                          <img
                            className="w-6 h-6"
                            src={addImage}
                            alt="Add Icon"
                          />
                        </div>
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
