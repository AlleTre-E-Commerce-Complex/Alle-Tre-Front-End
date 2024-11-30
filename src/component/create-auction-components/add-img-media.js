import React from "react";
import { FileUploader } from "react-drag-drop-files";
import imageCompression from "browser-image-compression";

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
  selectedCover,
  setSelectedCover,
}) => {
  const compressImage = async (file) => {
    try {
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
        maxSizeMB: 0.8, // Reduced target size
        maxWidthOrHeight: 1920,
        initialQuality: 0.7, // Slightly more aggressive compression
        useWebWorker: true,
        fileType: "image/jpeg", // Force JPEG output for consistency
        preserveExif: true,
        alwaysKeepResolution: true, // Maintain resolution for high-quality photos
        exifOrientation: true, // Handle image orientation correctly
      };

      let compressedFile = await imageCompression(file, options);

      // If compression wasn't effective, try one more time with more aggressive settings
      if (compressedFile.size > file.size * 0.9) {
        // If saved less than 10%
        console.log(
          "First compression not effective, trying again with more aggressive settings"
        );
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
      console.error("Error compressing image:", error);
      return file;
    }
  };

  const handleChange = async (file, setFile) => {
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

          return (
            <div key={index} className="relative">
              {file ? (
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      className="bg-white p-2 rounded-full shadow hover:shadow-lg"
                      onClick={() => setFile(null)}
                    >
                      <img className="w-4 h-4" src={TrashIcon} alt="Remove" />
                    </button>
                  </div>
                  <FileUploader
                    handleChange={(file) => handleChange(file, setFile)}
                    name={`file${index}`}
                  >
                    <img
                      className={`${
                        selectedCover === index
                          ? "border-[3px]"
                          : "border-[1px]"
                      } border-primary  border-solid rounded-lg w-[154px] h-[139px] object-cover`}
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded ${index}`}
                    />
                  </FileUploader>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`coverPhoto${index}`}
                      name="selectCoverPhoto"
                      className="accent-primary mt-1"
                      checked={selectedCover === index}
                      onChange={() => setSelectedCover(index)}
                    />
                    {selectedCover === index && (
                      <label htmlFor={`coverPhoto${index}`}>Cover Photo</label>
                    )}
                  </div>
                </div>
              ) : (
                <FileUploader
                  handleChange={(file) => handleChange(file, setFile)}
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
