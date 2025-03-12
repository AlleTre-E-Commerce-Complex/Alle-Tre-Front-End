// Code of coming soon category skider
// import React from "react";
// import { useHistory } from "react-router-dom";
// import routes from "../../../routes";
// import addImage from "../../../../src/assets/icons/add-image-icon.png";
// import content from "../../../localization/content";
// import { useLanguage } from "../../../context/language-context";
// import localizationKeys from "../../../localization/localization-keys";

// const Category = ({ img, title, id, view, className }) => {
//   const history = useHistory();
//   const isDisabled = id === 1 || id === undefined;
//   const [lang] = useLanguage("");
//   const selectedContent = content[lang];

//   return (
//     <div
//       className={`flex flex-col items-center justify-center px-0.5 sm:px-8 relative w-full  ${className}`}
//     >
//       <div className="group relative">
//         {!isDisabled && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="bg-primary bg-opacity-95 text-white text-[8px] sm:text-xs md:text-sm font-bold px-1 md:px-2 py-0.5 md:py-2 rounded-md md:rounded-xl shadow-lg">
//               {selectedContent[localizationKeys.comingSoon].toUpperCase()}
//             </div>
//           </div>
//         )}

//         <div
//           onClick={
//             view || !isDisabled
//               ? null
//               : () =>
//                   history.push(
//                     `${routes.app.categories(title, id)}?categories[]=${id}`
//                   )
//           }
//           className={`w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-white ${
//             !isDisabled
//               ? "opacity-40 cursor-not-allowed"
//               : "hover:bg-primary/10 cursor-pointer"
//           } transition-all duration-300 ease-in-out rounded-full flex items-center justify-center custom-sm-padding custom-lg-padding`}
//         >
//           <div
//             className={`w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full ${
//               !isDisabled
//                 ? "bg-gray-med"
//                 : "bg-primary group-hover:bg-primary-dark"
//             } transition-all duration-300 ease-in-out flex items-center justify-center`}
//           >
//             <img
//               className={`w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24 ${
//                 !isDisabled
//                   ? "opacity-90"
//                   : "group-hover:scale-110 transition-transform duration-300 ease-in-out"
//               } rounded-full`}
//               src={img || addImage}
//               alt={title}
//             />
//           </div>
//         </div>
//       </div>

//       <p
//         className={`mt-1 sm:mt-3 text-gray-700 font-medium text-xs sm:text-sm md:text-base text-center ${
//           !isDisabled ? "opacity-80" : "group-hover:text-primary"
//         }`}
//       >
//         {title}
//       </p>
//     </div>
//   );
// };

// export default Category;

import React from "react";
import { useHistory } from "react-router-dom";
import routes from "../../../routes";
import addImage from "../../../../src/assets/icons/add-image-icon.png";

const Category = ({ img, title, id, view, className }) => {
  const history = useHistory();;
  return (
    <div
      className={`flex flex-col items-center justify-center px-0.5 sm:px-8 relative w-full  ${className}`}
    >
      <div className="group relative">
        <div
          onClick={() =>
            history.push(
              `${routes.app.categories(title, id)}?categories[]=${id}`
            )
          }
          className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-white hover:bg-primary/10 cursor-pointer transition-all duration-300 ease-in-out rounded-full flex items-center justify-center custom-sm-padding custom-lg-padding"
        >
          <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full bg-primary group-hover:bg-primary-dark transition-all duration-300 ease-in-out flex items-center justify-center">
            <img
              className="w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24 group-hover:scale-110 transition-transform duration-300 ease-in-out rounded-full"
              src={img || addImage}
              alt={title}
            />
          </div>
        </div>
      </div>

      <p className="mt-1 sm:mt-3 text-gray-700 font-medium text-xs sm:text-sm md:text-base text-center group-hover:text-primary">
        {title}
      </p>
    </div>
  );
};

export default Category;
