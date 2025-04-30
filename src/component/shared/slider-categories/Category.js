import React from "react";
import { useHistory } from "react-router-dom";
import routes from "../../../routes";
import addImage from "../../../../src/assets/icons/add-image-icon.png";
import { useAuthState } from "../../../context/auth-context";
import { useDispatch } from "react-redux";
import { Open } from "../../../redux-store/auth-model-slice";

const Category = ({ img, title, id, view, className, isSubCategory }) => {
  const history = useHistory();
  const { user } = useAuthState();
  const dispatch = useDispatch();
 
  const handleClick = () => {
    if (user) {
      history.push(`${routes.app.categories(title, id)}?categories[]=${id}`);
    } else {
      dispatch(Open());
    }
  };
  
  return (
    <div
      className={`relative w-full h-48 sm:h-56 md:h-80  cursor-pointer group overflow-hidden rounded-xl ${className}`}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 group-hover:from-black/30 group-hover:to-black/70 transition-all duration-500 z-10"></div>
      <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-xl transition-all duration-500 z-20"></div>

      <img
        className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-all duration-700 ease-out"
        src={img || addImage}
        alt={title}
        loading="lazy"
      />

      <div className="absolute inset-x-3 bottom-4 p-2.5 backdrop-blur-sm bg-black/30 rounded-lg transform group-hover:translate-y-0 transition-all duration-500 z-30">
        <p className="text-white font-bold text-base sm:text-lg md:text-xl text-center group-hover:scale-105 transition-transform duration-300">
          {title}
        </p>
      </div>
    </div>
  
  );
};

export default Category;
