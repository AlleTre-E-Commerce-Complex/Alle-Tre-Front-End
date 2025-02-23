// import React, { useState } from "react";
// import { FileUploader } from "react-drag-drop-files";
// import { MdOutlineImage } from "react-icons/md";
// import addImage from "../../../src/assets/icons/add-image.svg";
// import TrashIcon from "../../../src/assets/icons/trash-Icon.png";
// import useAxios from "../../hooks/use-axios";
// import { authAxios } from "../../config/axios-config";
// import api from "../../api";
// import { toast } from "react-hot-toast";

// const fileTypes = ["JPEG", "PNG", "GIF", "JPG", "MOV", "mp4"];

// const EditImgeMedia = ({
//   auctionId,
//   imgOne,
//   fileOne,
//   setFileOne,
//   imgTwo,
//   fileTwo,
//   setFileTwo,
//   imgThree,
//   fileThree,
//   setFileThree,
//   imgFour,
//   fileFour,
//   setFileFour,
//   imgFive,
//   fileFive,
//   setFileFive,
//   onReload,
//   setLoadingImg,
// }) => {
//   const [coverPhotoIndex, setCoverPhotoIndex] = useState(1);

//   const { run: runDelete, isLoading: isloadingDelete } = useAxios([]);
//   const { run: runUpload, isLoading: isloadingUpload } = useAxios([]);

//   const handelDeleteImg = (imgId) => {
//     runDelete(
//       authAxios.delete(api.app.Imagees.delete(auctionId, imgId)).then((res) => {
//         toast.success("Image deleted successfully");
//         onReload();
//       })
//     );
//   };

//   const handleSetCover = (index, e) => {
//     e.stopPropagation();
//     setCoverPhotoIndex(index);
//   };

//   const handleChange = (file, setFile, index) => {
//     const formData = new FormData();
//     formData.append("image", file);
//     runUpload(
//       authAxios
//         .patch(api.app.Imagees.upload(auctionId), formData)
//         .then((res) => {
//           onReload();
//         })
//     );
//     setLoadingImg(isloadingUpload);
//     setFile(file);
//   };

//   const imageData = [
//     { img: imgOne, file: fileOne, setFile: setFileOne },
//     { img: imgTwo, file: fileTwo, setFile: setFileTwo },
//     { img: imgThree, file: fileThree, setFile: setFileThree },
//     { img: imgFour, file: fileFour, setFile: setFileFour },
//     { img: imgFive, file: fileFive, setFile: setFileFive },
//   ];

//   return (
//     <div className="">
//       <div className="flex flex-wrap gap-y-4 md:gap-y-0 gap-x-4">
//         {imageData.map((data, index) => {
//           const { img, file, setFile } = data;
//           const isCoverPhoto = index + 1 === coverPhotoIndex;

//           return (
//             <div key={index} className="relative">
//               {img?.imageLink || file ? (
//                 <div className="relative group">
//                   {/* Delete button */}
//                   <div className="sm:w-[154px] w-full h-[139px] hover:bg-gradient-to-t hover:from-[#25252562] absolute z-30 group">
//                     <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ">
//                       <button
//                         className="bg-white/50 hover:bg-gray-med hover:text-white p-2 rounded-full shadow hover:shadow-lg transition-all duration-300"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handelDeleteImg(img?.id);
//                           setFile(null);
//                         }}
//                       >
//                         <img
//                           className="w-4 h-4"
//                           src={TrashIcon}
//                           alt="TrashIcon"
//                         />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Cover badge */}
//                   {isCoverPhoto && (
//                     <div className="absolute top-2 left-2 z-10 ">
//                       <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
//                         Cover
//                       </span>
//                     </div>
//                   )}

//                   {/* Image display */}
//                   <div>
//                     <img
//                       className={`border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px] ${
//                         isCoverPhoto ? "ring-2 ring-primary" : ""
//                       }`}
//                       src={
//                         img?.imageLink
//                           ? img.imageLink
//                           : file instanceof File
//                           ? URL.createObjectURL(file)
//                           : addImage
//                       }
//                       alt={`img ${index + 1}`}
//                     />
//                   </div>

//                   {/* Set as Cover button */}
//                   {!isCoverPhoto && (
//                     <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-40">
//                       <button
//                         onClick={(e) => handleSetCover(index + 1, e)}
//                         className="bg-primary hover:bg-white/90 text-white hover:text-primary px-3 py-1 rounded-full text-sm shadow hover:shadow-lg transition-all duration-300 flex items-center gap-1 mx-auto"
//                       >
//                         <MdOutlineImage className="w-4 h-4" />
//                         Set as Cover
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="cursor-pointer">
//                   <FileUploader
//                     handleChange={(file) =>
//                       handleChange(file, setFile, index + 1)
//                     }
//                     name={`file${index + 1}`}
//                   >
//                     <img
//                       className={`border-primary border-solid rounded-lg w-[154px] h-[139px] object-cover ${
//                         isCoverPhoto ? "ring-2 ring-primary" : ""
//                       }`}
//                       src={
//                         img?.imageLink
//                           ? img.imageLink
//                           : file instanceof File
//                           ? URL.createObjectURL(file)
//                           : addImage
//                       }
//                       alt="Product img"
//                       onError={(e) => {
//                         console.error("Image failed to load:", e.target.src);
//                         e.target.src = addImage;
//                       }}
//                     />
//                   </FileUploader>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default EditImgeMedia;
