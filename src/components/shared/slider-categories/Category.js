import React from "react";
import { useHistory } from "react-router-dom";
import routes from "../../../routes";

const Category = ({ img, title, id }) => {
  const history = useHistory();
  return (
    <div className="inline-block md:mx-24 mx-16">
      <div className="group">
        <div
          onClick={() => history.push(routes.app.categories(title, id))}
          className=" w-[119px] h-[119px] bg-white hover:bg-primary/10 duration-300 ease-in-out transform rounded-full pt-2.5 cursor-pointer"
        >
          <div className="w-[98px] h-[98px] rounded-full bg-primary-light group-hover:bg-primary duration-300 ease-in-out transform  mx-auto my-auto p-2">
            <img
              className="group-hover:scale-125 pt-3 duration-300 ease-in-out transform "
              src={img}
              alt={title}
            />
          </div>
        </div>
        <p className="text-gray-dark font-normal text-base text-center group-hover:text-primary group-hover:font-bold">
          {title}
        </p>
      </div>
    </div>
  );
};

export default Category;
