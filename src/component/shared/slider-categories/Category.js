import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import routes from "../../../routes";
import addImage from "../../../../src/assets/icons/add-image-icon.png";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

const Category = ({
  img,
  title,
  id,
  subCategoryId,
  usageStatus,
  view,
  className,
  isSubCategory,
  auctionCount = 0,
  listingCount = 0,
}) => {
  const history = useHistory();
  const { search } = useLocation();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const handleClick = () => {
    const queryParams = new URLSearchParams(search);
    const subCatQuery = subCategoryId ? `&subCategory[]=${subCategoryId}` : "";
    const usageStatusQuery = usageStatus ? `&usageStatus=${usageStatus}` : "";
    history.push(
      `${routes.app.categories(title, id)}?categories[]=${id}${subCatQuery}${usageStatusQuery}&${queryParams}`,
    );
  };

  return (
    <div
      onClick={handleClick}
      className={`group cursor-pointer flex flex-col h-[320px] sm:h-[350px] md:h-[380px] rounded-xl shadow-lg border border-primary-light overflow-hidden bg-[#39485C] transform hover:-translate-y-1 transition-all duration-300 ${className || ""}`}
    >
      {/* Image Section */}
      <div className="relative h-[60%] w-full overflow-hidden shrink-0">
        <img
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
          src={img || addImage}
          alt={title}
          loading="lazy"
        />
        {/* Gradient overlay to smoothly blend image into the bottom section */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#39485C]/20 to-[#39485C] z-10"></div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 justify-between px-4 pb-6 w-full relative z-20 bg-[#39485C]">
        <div className="flex justify-center items-center -mt-2 mb-2">
          <h3 className="text-white text-lg sm:text-xl md:text-2xl font-serif font-normal text-center line-clamp-2 px-2 drop-shadow-sm">
            {title}
          </h3>
        </div>

        <div className="flex w-full px-4 sm:px-8 justify-center mt-auto">
          {/* Listings Box */}
          <div className="w-full max-w-[200px] flex flex-col items-center justify-center py-2 px-1 rounded-lg border border-[#52637D] bg-transparent group-hover:bg-[#43536A] transition-colors duration-300">
            <span className="text-yellow text-sm sm:text-base font-bold mb-0.5">
              {listingCount}
            </span>
            <span className="text-[#A4B1C6] text-[8px] sm:text-[10px] sm:tracking-[0.15em] tracking-widest font-semibold text-center w-full truncate uppercase">
              {selectedContent[localizationKeys.listings]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
    // <div onClick={handleClick} className="group cursor-pointer">
    //   <div className={`relative w-full h-48 sm:h-56 md:h-80 overflow-hidden rounded-t-xl shadow-lg ${className}`}>
    //     <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/[0.005] to-secondary/[0.01] group-hover:from-primary-dark/[0.01] group-hover:to-secondary/[0.02] transition-all duration-500 z-10"></div>
    //     <div className="absolute inset-0 border border-gray-light/10 group-hover:border-gray-light/20 rounded-t-xl transition-all duration-500 z-20"></div>

    //     <img
    //       className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-all duration-700 ease-out"
    //       src={img || addImage}
    //       alt={title}
    //       loading="lazy"
    //     />
    //   </div>

    //   <div className="w-full bg-gradient-to-br from-secondary/90 to-primary/90  p-3 rounded-b-xl shadow-lg border-t border-gray-light/10">
    //     <p className="text-gray-light font-bold text-base sm:text-lg md:text-xl text-center mb-3 group-hover:text-white transition-colors duration-300 min-h-[3rem] leading-tight flex items-center justify-center">
    //       {title}
    //     </p>
    //     <div className="grid grid-cols-2 gap-3">
    //       <div className="bg-secondary/50 hover:bg-secondary/70 rounded-lg py-2 px-3 text-center transition-all duration-300 border border-gray-dark/20">
    //         <span className="text-gray-light text-sm sm:text-base font-medium block mb-0.5">
    //           {auctionCount}
    //         </span>
    //         <span className="block text-gray-med text-xs">
    //         {selectedContent[localizationKeys.auctions]}  
    //         </span>
    //       </div>
    //       <div className="bg-secondary/50 hover:bg-secondary/70 rounded-lg py-2 px-3 text-center transition-all duration-300 border border-gray-dark/20">
    //         <span className="text-gray-light text-sm sm:text-base font-medium block mb-0.5">
    //           {listingCount}
    //         </span>
    //         <span className="block text-gray-med text-xs">
    //             {selectedContent[localizationKeys.listings]}  
    //         </span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
};

export default Category;
