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
      className={`flex flex-col items-center justify-center px-0.5 sm:px-8 relative w-full  ${className}`}
    >
      <div className="group relative">
        <div
          onClick={handleClick}
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-white hover:bg-primary/10 cursor-pointer transition-all duration-300 ease-in-out rounded-full flex items-center justify-center custom-sm-padding custom-lg-padding"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-primary group-hover:bg-primary-dark transition-all duration-300 ease-in-out flex items-center justify-center">
            <img
              className="w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 group-hover:scale-110 transition-transform duration-300 ease-in-out rounded-full"
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
