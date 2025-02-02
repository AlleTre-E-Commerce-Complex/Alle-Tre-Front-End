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

const fileTypes = ["JPEG", "PNG", "GIF", "JPG", "MOV", "mp4"];

const ImageMedia = ({
  auctionId,
  imgOne,
  fileOne,
  setFileOne,
  imgTwo,
  fileTwo,
  setFileTwo,
  imgThree,
  fileThree,
  setFileThree,
  imgFour,
  fileFour,
  setFileFour,
  imgFive,
  fileFive,
  setFileFive,
  onReload,
  setLoadingImg,
  isEditMode = false,
  onReorderImages,
  setimgtest,
}) => {
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(1);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const { run: runDelete, isLoading: isloadingDelete } = useAxios([]);
  const { run: runUpload, isLoading: isloadingUpload } = useAxios([]);

  useEffect(() => {
    setLoadingImg(isloadingUpload);
  }, [isloadingUpload]);

  const handleReorderImages = useCallback(() => {
    try {
      if (coverPhotoIndex !== 1) {
        setCoverPhotoIndex(1);
      }
    } catch (error) {
      console.error("Error in handleReorderImages:", error);
    }
  }, [coverPhotoIndex]);

  useEffect(() => {
    handleReorderImages();
  }, [handleReorderImages]);

  const handelDeleteImg = async (imgId, setFile, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      if (isEditMode) {
        await runDelete(
          authAxios.delete(api.app.Imagees.delete(auctionId, imgId))
        );
        toast.success("Image deleted successfully");
      }
      setFile(null);
      onReload();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleSetCover = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const images = [imgOne, imgTwo, imgThree, imgFour, imgFive];
    const files = [fileOne, fileTwo, fileThree, fileFour, fileFive];

    const coverImage = images[index - 1];
    const coverFile = files[index - 1];
    const reorderedImages = [
      coverImage,
      ...images.filter((img, i) => i !== index - 1 && img),
    ];

    const reorderedFiles = [
      coverFile,
      ...files.filter((file, i) => i !== index - 1 && file),
    ];

    setFileOne(reorderedFiles[0] || null);
    setFileTwo(reorderedFiles[1] || null);
    setFileThree(reorderedFiles[2] || null);
    setFileFour(reorderedFiles[3] || null);
    setFileFive(reorderedFiles[4] || null);

    setimgtest(reorderedImages);
    setCoverPhotoIndex(1);
  };

  const handleChange = async (file, setFile, index) => {
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        console.log("Original size:", file.size / 1024 / 1024, "MB");
        console.log(
          "Compressed size:",
          compressedFile.size / 1024 / 1024,
          "MB"
        );

        if (isEditMode) {
          const formData = new FormData();
          formData.append("image", compressedFile);
          runUpload(
            authAxios
              .patch(api.app.Imagees.upload(auctionId), formData)
              .then(() => {
                onReload();
              })
              .catch((err) => {
                console.error("Upload failed:", err);
                toast.error("Failed to upload image");
              })
          );
        }

        setFile(compressedFile);
      } catch (error) {
        console.error("Error handling file:", error);
        toast.error("Failed to process image");
        setFile(file);
      }
    }
  };

  const compressImage = async (file) => {
    try {
      console.log("Input file:", file.type, file.size / 1024 / 1024, "MB");

      if (file.type.includes("heic") || file.type.includes("heif")) {
        console.warn(
          "HEIC/HEIF format detected, compression might not work optimally"
        );
      }

      if (file.size <= 800 * 1024) {
        console.log("File already small enough, skipping compression");
        return file;
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

      let compressedFile = await imageCompression(file, options);
      if (compressedFile.size > file.size * 0.9) {
        options.maxSizeMB = 0.5;
        options.initialQuality = 0.6;
        compressedFile = await imageCompression(file, options);
      }

      return new File([compressedFile], file.name, {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });
    } catch (error) {
      console.error("Compression failed:", error);
      return file;
    }
  };

  const imageData = useMemo(
    () => [
      { img: imgOne, file: fileOne, setFile: setFileOne },
      { img: imgTwo, file: fileTwo, setFile: setFileTwo },
      { img: imgThree, file: fileThree, setFile: setFileThree },
      { img: imgFour, file: fileFour, setFile: setFileFour },
      { img: imgFive, file: fileFive, setFile: setFileFive },
    ],
    [
      imgOne,
      fileOne,
      imgTwo,
      fileTwo,
      imgThree,
      fileThree,
      imgFour,
      fileFour,
      imgFive,
      fileFive,
    ]
  );

  const reorderedImageData = useMemo(() => {
    return [
      imageData[coverPhotoIndex - 1],
      ...imageData.filter((_, index) => index !== coverPhotoIndex - 1),
    ];
  }, [coverPhotoIndex, imageData]);

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
        <div className="flex flex-wrap gap-y-4 md:gap-y-0 gap-x-4">
          {reorderedImageData.map((data, index) => {
            const { img, file, setFile } = data;
            const isCoverPhoto = index === 0;

            return (
              <div key={index} className="relative">
                {img?.imageLink || file ? (
                  <div className="relative group">
                    <div className="sm:w-[154px] w-full h-[139px] hover:bg-gradient-to-t hover:from-[#25252562] absolute z-30 group">
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          className="bg-white/50 hover:bg-gray-med hover:text-white p-2 rounded-full shadow hover:shadow-lg transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handelDeleteImg(img?.id, setFile, e);
                          }}
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
                      handleChange={(file) =>
                        handleChange(file, setFile, index + 1)
                      }
                      name={`file${index + 1}`}
                    >
                      <img
                        className={`border-primary border-solid rounded-lg w-[154px] h-[139px] object-cover ${
                          isCoverPhoto ? "ring-2 ring-primary" : ""
                        }`}
                        src={
                          img?.imageLink
                            ? img.imageLink
                            : file instanceof File
                            ? URL.createObjectURL(file)
                            : addImage
                        }
                        alt="Product img"
                        onError={(e) => {
                          console.error("Image failed to load:", e.target.src);
                          e.target.src = addImage;
                        }}
                      />
                    </FileUploader>

                    {!isCoverPhoto && (
                      <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-40">
                        <button
                          onClick={(e) => handleSetCover(index + 1, e)}
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
                    handleChange={(file) =>
                      handleChange(file, setFile, index + 1)
                    }
                    name={`file${index + 1}`}
                    types={fileTypes}
                  >
                    <div className="border-gray-med border-[1px] border-dashed rounded-lg w-[154px] h-[139px] flex justify-center items-center cursor-pointer">
                      <img className="w-6 h-6" src={addImage} alt="Add Icon" />
                    </div>
                  </FileUploader>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ImageMedia;
