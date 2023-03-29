import React from "react";

const Category = ({ img, title }) => {
  return (
    <div className="inline-block mx-24">
      <div className="group w-28 h-28 hover:bg-primary/10 duration-100 rounded-full pt-2">
        <div className="w-24 h-24 rounded-full bg-primary-light mx-auto my-auto p-2">
          <img
            className="group-hover:scale-125 pt-3 duration-100"
            src={img}
            alt={title}
          />
        </div>
      </div>
      <p className="text-gray-dark font-normal text-base text-center">
        {title}
      </p>
    </div>
  );
};

export default Category;
