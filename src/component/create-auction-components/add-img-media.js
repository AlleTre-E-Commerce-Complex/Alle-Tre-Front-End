// import React from "react";

// import { FileUploader } from "react-drag-drop-files";

// import addImage from "../../../src/assets/icons/add-image.svg";
// import TrashIcon from "../../../src/assets/icons/trash-Icon.png";
// import { Dimmer, Loader, Segment } from "semantic-ui-react";

// const fileTypes = ["JPEG", "PNG", "GIF", "JPG", "MOV", "mp4"];

// const AddImgMedia = ({
//   fileOne,
//   setFileOne,
//   fileTwo,
//   setFileTwo,
//   fileThree,
//   setFileThree,
//   fileFour,
//   setFileFour,
//   fileFive,
//   setFileFive,
// }) => {
//   const handleChangeOne = (fileOne) => {
//     setFileOne(fileOne);
//   };
//   const handleChangeTwo = (fileTwo) => {
//     setFileTwo(fileTwo);
//   };
//   const handleChangeThree = (fileThree) => {
//     setFileThree(fileThree);
//   };
//   const handleChangeFour = (fileFour) => {
//     setFileFour(fileFour);
//   };
//   const handleChangeFive = (fileFive) => {
//     setFileFive(fileFive);
//   };

//   return (
//     <div className="">
//       <div className={fileOne && "flex flex-wrap gap-y-4 md:gap-y-0 gap-x-4"}>
//         <div className={fileTwo && " gap-x-4 flex"}>
//           <div className="flex flex-wrap gap-y-4 md:gap-y-0 gap-x-4 ">
//             {fileOne ? (
//               <div className="relative">
//                 <div className="sm:w-[299px] w-full h-[189px] hover:bg-gradient-to-t hover:from-[#25252562] absolute z-30 group">
//                   <div className="flex justify-center mt-36 ">
//                     <button
//                       className="w-10 h-10 rounded-full backdrop-blur-md bg-white/50  group-hover:flex  hidden "
//                       onClick={() => setFileOne(null)}
//                     >
//                       <img className="p-3" src={TrashIcon} alt="TrashIcon" />
//                     </button>
//                   </div>
//                 </div>
//                 <FileUploader handleChange={handleChangeOne} name="file">
//                   <img
//                     className="border-primary border-[1px] border-solid rounded-lg w-[299px] h-[189px] object-cover p-[1px]"
//                     src={URL?.createObjectURL(fileOne)}
//                     alt="img two"
//                   />
//                 </FileUploader>
//               </div>
//             ) : (
//               <div className={fileOne && "hidden"}>
//                 <div className="cursor-pointer ">
//                   <FileUploader
//                     handleChange={handleChangeOne}
//                     name="file"
//                     types={fileTypes}
//                   >
//                     <div className="border-gray-med border-[1px] border-dashed rounded-lg w-[299px] h-[189px] flex justify-between cursor-pointer ">
//                       <img
//                         className="my-auto mx-auto"
//                         src={addImage}
//                         alt="imgIcon"
//                       />
//                     </div>
//                   </FileUploader>
//                 </div>
//               </div>
//             )}
//             {fileTwo ? (
//               <div className="">
//                 <div className="relative">
//                   <div className=" sm:w-[154px] w-full h-[139px]  hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 group ">
//                     <div className="flex justify-center mt-24 ">
//                       <button
//                         className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5 group-hover:block hidden "
//                         onClick={() => setFileTwo(null)}
//                       >
//                         <img
//                           className="p-[9px]"
//                           src={TrashIcon}
//                           alt="TrashIcon"
//                         />
//                       </button>
//                     </div>
//                   </div>
//                   <FileUploader handleChange={handleChangeTwo} name="file">
//                     <img
//                       className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px] "
//                       src={URL?.createObjectURL(fileTwo)}
//                       alt="img two"
//                     />
//                   </FileUploader>
//                 </div>
//               </div>
//             ) : (
//               <div
//                 className={`${fileOne ? "" : "hidden"} ${fileTwo && "hidden"}`}
//               >
//                 <div className="cursor-pointer">
//                   <FileUploader
//                     handleChange={handleChangeTwo}
//                     name="file"
//                     types={fileTypes}
//                   >
//                     <div className="border-gray-med border-[1px] border-dashed rounded-lg w-[154px] h-[139px] flex justify-between cursor-pointer ">
//                       <img
//                         className="my-auto mx-auto"
//                         src={addImage}
//                         alt="imgIcon"
//                       />
//                     </div>
//                   </FileUploader>
//                 </div>
//               </div>
//             )}
//             {fileThree ? (
//               <div>
//                 <div className="relative">
//                   <div className="w-[154px] h-[139px] hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 group ">
//                     <div className="flex justify-center mt-24 ">
//                       <button
//                         className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5 group-hover:block hidden "
//                         onClick={() => setFileThree(null)}
//                       >
//                         <img
//                           className="p-[9px]"
//                           src={TrashIcon}
//                           alt="TrashIcon"
//                         />
//                       </button>
//                     </div>
//                   </div>
//                   <FileUploader handleChange={handleChangeThree} name="file">
//                     <img
//                       className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px]"
//                       src={URL?.createObjectURL(fileThree)}
//                       alt="img two"
//                     />
//                   </FileUploader>
//                 </div>
//               </div>
//             ) : (
//               <div
//                 className={`${fileTwo ? "" : "hidden"} ${
//                   fileThree && "hidden"
//                 }`}
//               >
//                 <div className="cursor-pointer">
//                   <FileUploader
//                     className="hidden"
//                     handleChange={handleChangeThree}
//                     name="file"
//                     types={fileTypes}
//                   >
//                     <div className="border-gray-med border-[1px] border-dashed rounded-lg w-[154px] h-[139px] flex justify-between cursor-pointer ">
//                       <img
//                         className="my-auto mx-auto"
//                         src={addImage}
//                         alt="imgIcon"
//                       />
//                     </div>
//                   </FileUploader>
//                 </div>
//               </div>
//             )}
//             {fileFour ? (
//               <div>
//                 <div className="relative">
//                   <div className="w-[154px] h-[139px]  hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 group ">
//                     <div className="flex justify-center mt-24 ">
//                       <button
//                         className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5 group-hover:block hidden "
//                         onClick={() => setFileFour(null)}
//                       >
//                         <img
//                           className="p-[9px]"
//                           src={TrashIcon}
//                           alt="TrashIcon"
//                         />
//                       </button>
//                     </div>
//                   </div>
//                   <FileUploader handleChange={handleChangeFour} name="file">
//                     <img
//                       className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px]"
//                       src={URL?.createObjectURL(fileFour)}
//                       alt="img two"
//                     />
//                   </FileUploader>
//                 </div>
//               </div>
//             ) : (
//               <div
//                 className={`${fileThree ? "" : "hidden"} ${
//                   fileFour && "hidden"
//                 }`}
//               >
//                 <div className="cursor-pointer">
//                   <FileUploader
//                     className="hidden"
//                     handleChange={handleChangeFour}
//                     name="file"
//                     types={fileTypes}
//                   >
//                     <div className="border-gray-med border-[1px] border-dashed rounded-lg w-[154px] h-[139px] flex justify-between cursor-pointer ">
//                       <img
//                         className="my-auto mx-auto"
//                         src={addImage}
//                         alt="imgIcon"
//                       />
//                     </div>
//                   </FileUploader>
//                 </div>
//               </div>
//             )}
//             {fileFive ? (
//               <div>
//                 <div className="relative">
//                   <div className="w-[154px] h-[139px]  hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 group ">
//                     <div className="flex justify-center mt-24 ">
//                       <button
//                         className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5 group-hover:block hidden "
//                         onClick={() => setFileFive(null)}
//                       >
//                         <img
//                           className="p-[9px]"
//                           src={TrashIcon}
//                           alt="TrashIcon"
//                         />
//                       </button>
//                     </div>
//                   </div>
//                   <FileUploader handleChange={handleChangeFour} name="file">
//                     <img
//                       className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px]"
//                       src={URL?.createObjectURL(fileFive)}
//                       alt="img two"
//                     />
//                   </FileUploader>
//                 </div>
//               </div>
//             ) : (
//               <div className={fileFour ? "" : "hidden"}>
//                 <div className="cursor-pointer">
//                   <FileUploader
//                     className="hidden"
//                     handleChange={handleChangeFive}
//                     name="file"
//                     types={fileTypes}
//                   >
//                     <div className="border-gray-med border-[1px] border-dashed rounded-lg w-[154px] h-[139px] flex justify-between cursor-pointer ">
//                       <img
//                         className="my-auto mx-auto"
//                         src={addImage}
//                         alt="imgIcon"
//                       />
//                     </div>
//                   </FileUploader>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddImgMedia;

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
}) => {
  const compressImage = async (file) => {
    try {
      const options = {
        maxSizeMB: 1, // Max size in MB
        maxWidthOrHeight: 1024, // Max width/height in pixels
        useWebWorker: true, // Use web worker for faster compression
      };
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      return file; // Return original file if compression fails
    }
  };

  const handleChange = async (file, setFile) => {
    if (file) {
      const compressedFile = await compressImage(file);
      setFile(compressedFile);
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
                  <div className="absolute top-0 right-0 z-10">
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
                      className="border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover"
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded ${index}`}
                    />
                  </FileUploader>
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
