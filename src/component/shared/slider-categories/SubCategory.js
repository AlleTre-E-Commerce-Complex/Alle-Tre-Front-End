import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import addImage from "../../../../src/assets/icons/add-image-icon.png";
const SubCategory = ({ img, title, id, view, className = "" }) => {
  const history = useHistory();
  const { search } = useLocation();
  const parsed = queryString.parse(search, { arrayFormat: "bracket" });

  // Normalize parsed.subCategory into an array for reliable checking
  let activeSubs = [];
  if (Array.isArray(parsed?.subCategory)) {
    activeSubs = parsed.subCategory;
  } else if (parsed?.subCategory) {
    activeSubs = [parsed.subCategory];
  }

  const isActive = activeSubs.some(
    (subId) => subId?.toString() === id?.toString(),
  );

  const handleClick = () => {
    let updatedQuery = { ...parsed };
    updatedQuery.subCategory = [id];
    const updatedSearch = queryString.stringify(updatedQuery, {
      arrayFormat: "bracket",
    });

    history.push(`${window.location.pathname}?${updatedSearch}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`group flex flex-col items-center justify-start gap-2 md:gap-3 h-full cursor-pointer w-full px-2 sm:px-4 ${className}`}
    >
      <div className="w-full aspect-square flex items-center justify-center p-2 sm:p-3">
        <div
          className={`relative flex items-center justify-center rounded-full transition-all duration-300 w-full h-full
            ${
              isActive
                ? "bg-[#1b2331] dark:bg-[#1b2331] ring-2 md:ring-[3px] ring-yellow ring-offset-[#ffffff] dark:ring-offset-[#0b101a] ring-offset-[3px] md:ring-offset-[4px] shadow-sm"
                : "bg-primary dark:bg-[#1b2331] hover:bg-[#2a3648] dark:hover:bg-[#2a3648] ring-2 ring-[#d4af37]/40"
            }
          `}
        >
          <img
            className={`object-contain transition-transform duration-300
              ${
                isActive
                  ? "w-[40%] h-[40%] scale-110 opacity-100"
                  : "w-[35%] h-[35%] scale-100 opacity-60 dark:opacity-70 group-hover:scale-110 group-hover:opacity-80 dark:group-hover:opacity-100"
              }
            `}
            src={img || addImage}
            alt={title}
            loading="lazy"
            style={{
              filter: isActive
                ? "brightness(0) saturate(100%) invert(70%) sepia(85%) saturate(750%) hue-rotate(3deg) brightness(1.05)"
                : "brightness(0) invert(1) opacity(0.8)",
            }}
          />
        </div>
      </div>
      <p
        className={`text-center font-bold tracking-[0.15em] uppercase transition-colors duration-300 leading-tight mt-1
          ${
            isActive
              ? "text-[#1e2738] dark:text-primary-light text-[10px] md:text-xs"
              : "text-[#6b7280] dark:text-primary-veryLight text-[10px] md:text-xs"
          }
        `}
      >
        {title}
      </p>
    </div>
  );
};

export default SubCategory;
