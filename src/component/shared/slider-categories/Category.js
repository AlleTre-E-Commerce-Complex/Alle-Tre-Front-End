import React from "react";
import { useHistory } from "react-router-dom";
import routes from "../../../routes";
import addImage from "../../../../src/assets/icons/add-image-icon.png";
import { useAuthState } from "../../../context/auth-context";
import { useDispatch } from "react-redux";
import { Open } from "../../../redux-store/auth-model-slice";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

const Category = ({ img, title, id, view, className, isSubCategory, auctionCount = 0, listingCount = 0 }) => {
  const history = useHistory();
  const { user } = useAuthState();
  const dispatch = useDispatch();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const handleClick = () => {
    if (user) {
    history.push(`${routes.app.categories(title, id)}?categories[]=${id}`);
    } else {
      dispatch(Open());
    }
  };
  
  return (
    <div onClick={handleClick} className="group cursor-pointer">
      <div className={`relative w-full h-48 sm:h-56 md:h-80 overflow-hidden rounded-t-xl shadow-lg ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/[0.005] to-secondary/[0.01] group-hover:from-primary-dark/[0.01] group-hover:to-secondary/[0.02] transition-all duration-500 z-10"></div>
        <div className="absolute inset-0 border border-gray-light/10 group-hover:border-gray-light/20 rounded-t-xl transition-all duration-500 z-20"></div>

        <img
          className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-all duration-700 ease-out"
          src={img || addImage}
          alt={title}
          loading="lazy"
        />
      </div>

      <div className="w-full bg-gradient-to-br from-secondary/90 to-primary/90  p-3 rounded-b-xl shadow-lg border-t border-gray-light/10">
        <p className="text-gray-light font-bold text-base sm:text-lg md:text-xl text-center mb-3 group-hover:text-white transition-colors duration-300">
          {title}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 hover:bg-secondary/70 rounded-lg py-2 px-3 text-center transition-all duration-300 border border-gray-dark/20">
            <span className="text-gray-light text-sm sm:text-base font-medium block mb-0.5">
              {auctionCount}
            </span>
            <span className="block text-gray-med text-xs">
            {selectedContent[localizationKeys.auctions]}  
            </span>
          </div>
          <div className="bg-secondary/50 hover:bg-secondary/70 rounded-lg py-2 px-3 text-center transition-all duration-300 border border-gray-dark/20">
            <span className="text-gray-light text-sm sm:text-base font-medium block mb-0.5">
              {listingCount}
            </span>
            <span className="block text-gray-med text-xs">
                {selectedContent[localizationKeys.listings]}  
            </span>
          </div>
        </div>
      </div>
    </div>
  
  );
};

export default Category;
