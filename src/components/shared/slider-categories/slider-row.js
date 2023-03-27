import axios from "axios";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { React, useState, useEffect } from "react";
import { sliderData } from "./slider-data";
import AnglesRight from "../../../../src/assets/icons/angles-right-icon.png";
import AnglesLeft from "../../../../src/assets/icons/angles-left-icon.png";

const SliderRow = ({ title, fetchURL, rowID }) => {
  const sliderLeft = () => {
    var slider = document.getElementById("slider" + rowID);
    slider.scrollLeft = slider.scrollLeft - 200;
  };
  const sliderRight = () => {
    var slider = document.getElementById("slider" + rowID);
    slider.scrollLeft = slider.scrollLeft + 200;
  };

  return (
    <div className="">
      <div className="">
        <h2 className="text-white font-bold md:text-xl p-4">{title}</h2>
        <div className="relative flex gap-x-4 items-center ">
          <img
            onClick={sliderLeft}
            className=" rounded-full left-14 absolute cursor-pointer z-20 w-14 h-14 "
            src={AnglesLeft}
            alt="AnglesLeft"
          />
          <div
            id={"slider" + rowID}
            className="w-full h-full overflow-x-scroll scrollbar-hide whitespace-nowrap scroll-smooth relative px-24 "
          >
            {sliderData.map((item, id) => (
              <div className="w-24 h-24 rounded-full inline-block  bg-primary-light mx-24">
                <img
                  className="w-full h-auto block"
                  src={item.img}
                  alt={item?.title}
                />
                <div className="absolute top-0 left-0 w-full h-full text-black">
                  <p className="whitespace-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center cursor-default">
                    {item?.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <img
            onClick={sliderRight}
            className="rounded-full right-14 absolute cursor-pointer z-10 w-14 h-14 "
            src={AnglesRight}
            alt="AnglesRight"
          />
          <div className="absolute right-0 bg-white/80 h-full w-32"></div>
          <div className="absolute bg-white/80 h-full w-32"></div>
        </div>
      </div>
    </div>
  );
};

export default SliderRow;
