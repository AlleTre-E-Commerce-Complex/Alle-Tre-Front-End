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

// Supported file types (images and videos)
const fileTypes = ["JPG", "PNG", "JPEG", "HEIC", "MP4", "MOV"];

const heic2any = require("heic2any");

const MAX_VIDEO_SIZE_MB = 50;

const ImageMedia = ({
  auctionId,
  onReload,
  setLoadingImg,
  isEditMode = false,
  setimgtest,
  images = [],
}) => {
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

      // Update local state first for better UX
      setimgtest(newImages);

      if (isEditMode) {
        if (imgId) {
          await runDelete(
            authAxios.delete(api.app.Imagees.delete(auctionId, imgId))
          );
        }

        // Update backend with remaining files
        const formData = new FormData();
        newImages.forEach((img, i) => {
          if (img?.file) {
            formData.append(`image${i + 1}`, img.file);
          }
        });

        await runUpload(
          authAxios.patch(api.app.Imagees.upload(auctionId), formData)
        );

        toast.success(
          selectedContent[localizationKeys.imageDeletedSuccessfully]
        );
      }

      // Call onReload after all operations are complete
      if (typeof onReload === "function") {
        onReload();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(selectedContent[localizationKeys.failedToDeleteImage]);
      // Revert local state on error
      setimgtest(images);
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
        const formData = new FormData();
        reorderedImages.forEach((img, i) => {
          if (img?.file) {
            formData.append(`image${i + 1}`, img.file);
          }
        });

        await authAxios.patch(api.app.Imagees.upload(auctionId), formData);
        toast.success(
          selectedContent[localizationKeys.coverPhotoUpdatedSuccessfully]
        );
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

      // Check for existing video first
      const existingVideo = images.some((img) =>
        img?.file?.type?.startsWith("video/")
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
          id: videoFile.name,
          isVideo: true,
        };

        // Update state with the video
        const newImages =
          index !== undefined
            ? [
              ...images.slice(0, index),
              processedVideo,
              ...images.slice(index + 1),
            ]
            : [...images, processedVideo];

        setimgtest(newImages);

        // Handle backend update
        if (isEditMode) {
          const formData = new FormData();
          newImages.forEach((img, i) => {
            if (img?.file) {
              formData.append(`image${i + 1}`, img.file);
            }
          });
          await authAxios.patch(api.app.Imagees.upload(auctionId), formData);
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

        setimgtest(newImages);

        // Handle backend update
        if (isEditMode) {
          const formData = new FormData();
          newImages.forEach((img, i) => {
            if (img?.file) {
              formData.append(`image${i + 1}`, img.file);
            }
          });
          await authAxios.patch(api.app.Imagees.upload(auctionId), formData);
        }
      }

      // Call onReload after all operations are complete
      if (typeof onReload === "function") {
        onReload();
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

      if (
        file.type.toLowerCase().includes("heic") ||
        file.type.toLowerCase().includes("heif")
      ) {
        try {
          const blob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
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

      if (processedFile.size <= 800 * 1024) {
        return processedFile;
      }

      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        initialQuality: 0.7,
        useWebWorker: true,
        fileType: "image/jpeg",
        preserveExif: false,
        alwaysKeepResolution: true,
        exifOrientation: true,
      };

      let compressedFile = await imageCompression(processedFile, options);
      if (compressedFile.size > processedFile.size * 0.9) {
        options.maxSizeMB = 0.5;
        options.initialQuality = 0.6;
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
            {[...images, null]
              .slice(0, Math.min(50, images.length + 1))
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
                        <FileUploader
                          handleChange={(files) => handleChange(files, index)}
                          name={`file${index + 1}`}
                          types={fileTypes}
                          multiple={
                            !existingVideo &&
                            !img?.file?.type?.startsWith("video/")
                          }
                        >
                          <div className="relative">

                            {img?.file?.type?.startsWith("video/") ? (
                              <div className="relative">
                                <video
                                  className={`border-primary border-solid rounded-lg w-[154px] h-[139px] object-cover ${isCoverPhoto ? "ring-2 ring-primary" : ""
                                    }`}
                                  controls
                                  poster={img.imageLink} // Use the watermarked thumbnail as poster
                                >
                                  <source
                                    src={URL.createObjectURL(img.file)}
                                    type={img.file.type}
                                  />
                                  Your browser does not support the video tag.
                                </video>
                                {/* Watermark overlay for video */}
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
                                className={`border-primary border-solid rounded-lg w-[154px] h-[139px] object-cover ${isCoverPhoto ? "ring-2 ring-primary" : ""
                                  }`}
                                src={img.imageLink || addImage}
                                alt="Product img"
                                onError={(e) => {
                                  console.error("Image failed to load:", e.target.src);
                                  e.target.src = addImage;
                                }}
                              />
                            )}
                          </div>
                        </FileUploader>

                        {!isCoverPhoto &&
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
