import React, { useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import imageCompression from "browser-image-compression";
import { MdOutlineImage } from "react-icons/md";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import addImage from "../../../src/assets/icons/add-image.svg";
import TrashIcon from "../../../src/assets/icons/trash-Icon.png";

const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];

const AddImgMedia = ({
  fileOne,
  setFileOne,
  fileTwo,
  setFileTwo,
  fileThree,
  setFileThree,
  fileFour,
  setFileFour,
  fileFive,
  setFileFive,
}) => {
  const [coverPhotoIndex, setCoverPhotoIndex] = React.useState(1);

  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  // Reorder files when cover photo changes
  useEffect(() => {
    const files = [fileOne, fileTwo, fileThree, fileFour, fileFive];
    const setters = [
      setFileOne,
      setFileTwo,
      setFileThree,
      setFileFour,
      setFileFive,
    ];

    // Skip if cover photo is already first or no files
    if (coverPhotoIndex === 1 || !files[coverPhotoIndex - 1]) return;

    // Create new order with cover photo first
    const coverPhoto = files[coverPhotoIndex - 1];
    const reorderedFiles = [
      coverPhoto,
      ...files.slice(0, coverPhotoIndex - 1),
      ...files.slice(coverPhotoIndex).filter(Boolean),
    ];

    reorderedFiles.forEach((file, idx) => {
      setters[idx](file || null);
    });

    for (let i = reorderedFiles.length; i < 5; i++) {
      setters[i](null);
    }

    setCoverPhotoIndex(1);
  }, [
    coverPhotoIndex,
    fileOne,
    fileTwo,
    fileThree,
    fileFour,
    fileFive,
    setFileOne,
    setFileTwo,
    setFileThree,
    setFileFour,
    setFileFive,
  ]);

  const compressImage = async (file) => {
    try {
      // For debugging
      // For debugging
      console.log("Input file:", file.type, file.size / 1024 / 1024, "MB");

      // Convert HEIC/HEIF to JPEG if needed
      if (file.type.includes("heic") || file.type.includes("heif")) {
        // You might want to add heic2any library for HEIC support
        console.warn(
          "HEIC/HEIF format detected, compression might not work optimally"
        );
      }

      // Skip small files
      if (file.size <= 800 * 1024) {
        // If less than 800KB
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
      // If compression wasn't effective, try one more time with more aggressive settings
      if (compressedFile.size > file.size * 0.9) {
        options.maxSizeMB = 0.5;
        options.initialQuality = 0.6;
        compressedFile = await imageCompression(file, options);
      }

      // Create a new File object
      const finalFile = new File([compressedFile], file.name, {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });
      return finalFile;
    } catch (error) {
      return file;
    }
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
        setFile(compressedFile);
      } catch (error) {
        console.error("Error handling file:", error);
        setFile(file);
      }
    }
  };

  const handleSetCover = (index) => {
    setCoverPhotoIndex(index);
  };

  return (
    <div className="image-upload-container">
      <div className="flex flex-wrap gap-y-4 md:gap-y-0 gap-x-4">
        {[1, 2, 3, 4, 5].map((index) => {
          const file = {
            1: fileOne,
            2: fileTwo,
            3: fileThree,
            4: fileFour,
            5: fileFive,
          }[index];

          const setFile = {
            1: setFileOne,
            2: setFileTwo,
            3: setFileThree,
            4: setFileFour,
            5: setFileFive,
          }[index];

          const isCoverPhoto = index === coverPhotoIndex;

          return (
            <div key={index} className="relative">
              {file ? (
                <div className="relative group">
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      className="bg-white hover:bg-gray-med hover:text-white p-2 rounded-full shadow hover:shadow-lg transition-all duration-300"
                      onClick={() => setFile(null)}
                    >
                      <img className="w-4 h-4" src={TrashIcon} alt="Remove" />
                    </button>
                  </div>
                  {isCoverPhoto && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {selectedContent[localizationKeys.cover]}
                      </span>
                    </div>
                  )}
                  <FileUploader
                    handleChange={(file) => handleChange(file, setFile, index)}
                    name={`file${index}`}
                  >
                    <img
                      className={`border-primary border-solid rounded-lg w-[154px] h-[139px] object-cover ${
                        isCoverPhoto ? "ring-2 ring-primary" : ""
                      }`}
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded ${index}`}
                    />
                  </FileUploader>
                  {!isCoverPhoto && (
                    <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => handleSetCover(index)}
                        className="bg-primary hover:bg-white/90 text-white hover:text-primary px-3 py-1 rounded-full text-sm shadow hover:shadow-lg transition-all duration-300 flex items-center gap-1 mx-auto"
                      >
                        <MdOutlineImage className="w-4 h-4" />
                        {selectedContent[localizationKeys.setAsCover]}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <FileUploader
                  handleChange={(file) => handleChange(file, setFile, index)}
                  name={`file${index}`}
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
  );
};

export default AddImgMedia;
