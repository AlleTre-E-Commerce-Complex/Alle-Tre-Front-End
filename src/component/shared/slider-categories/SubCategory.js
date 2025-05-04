import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import addImage from "../../../../src/assets/icons/add-image-icon.png";
const SubCategory = ({ img, title, id, view, className }) => {
  const history = useHistory();
  const { search } = useLocation()
  const parsed = queryString.parse(search, { arrayFormat: "bracket" });


  const handleClick = () => {
    let updatedQuery = { ...parsed };
    updatedQuery.subCategory = [id];
    const updatedSearch = queryString.stringify(updatedQuery, { arrayFormat: "bracket" });

    history.push(`${window.location.pathname}?${updatedSearch}`)
  }

  return (
    <div
      onClick={handleClick}
      className={`group relative w-full pb-[75%] overflow-hidden rounded-xl cursor-pointer ${className}`}
    >
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          src={img || addImage}
          alt={title}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
      </div>
      <div className="absolute inset-0 flex items-end justify-center p-4">
        <p className="text-white font-medium text-xs sm:text-sm md:text-base text-center group-hover:transform group-hover:-translate-y-1 transition-transform duration-300">
          {title}
        </p>
      </div>
    </div>
  );
};

export default SubCategory;
