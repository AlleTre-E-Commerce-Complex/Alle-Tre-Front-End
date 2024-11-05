import React from "react";
import { useHistory } from "react-router-dom";
import routes from "../../../routes";
import addImage from "../../../../src/assets/icons/add-image-icon.png";

const Category = ({ img, title, id, view }) => {
  const history = useHistory();
  return (
    <div className="md:px-24 px-8">
      <div className="group">
        <div
          onClick={
            view
              ? ""
              : () =>
                  history.push(
                    `${routes.app.categories(title, id)}?categories[]=${id}`
                  )
          }
          className=" w-[119px] h-[119px] bg-white hover:bg-primary/10 duration-300 ease-in-out transform rounded-full pt-2.5 cursor-pointer"
        >
          <div className="w-[98px] h-[98px] rounded-full bg-secondary  group-hover:bg-primary duration-300 ease-in-out transform  mx-auto my-auto p-2 flex justify-center items-center">
            <img
              className={
                img
                  ? "group-hover:scale-125  duration-300 ease-in-out transform flex justify-center items-center"
                  : "  group-hover:scale-125  duration-300 ease-in-out transform flex justify-center items-center"
              }
              src={img || addImage}
              alt={title}
            />
          </div>
        </div>
        <p className="text-gray-dark font-normal text-base text-center group-hover:text-primary ">
          {title}
        </p>
      </div>
    </div>
  );
};

export default Category;
