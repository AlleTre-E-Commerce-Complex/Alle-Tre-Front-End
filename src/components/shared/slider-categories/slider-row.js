import axios from "axios";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { React, useState, useEffect } from "react";
import { sliderData } from "./slider-data";
import AnglesRight from "../../../../src/assets/icons/angles-right-icon.png";
import AnglesLeft from "../../../../src/assets/icons/angles-left-icon.png";
import Category from "./Category";

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
            {/* slider */}
            <Category
              img={
                "https://www.seekpng.com/png/full/2-21511_laptop-hd-png-picture-png-format-laptop-png.png"
              }
              title="test"
            />
            <Category
              img={
                "https://www.seekpng.com/png/full/2-21511_laptop-hd-png-picture-png-format-laptop-png.png"
              }
              title="test"
            />
            <Category
              img={
                "https://www.seekpng.com/png/full/2-21511_laptop-hd-png-picture-png-format-laptop-png.png"
              }
              title="test"
            />
            <Category
              img={
                "https://www.seekpng.com/png/full/2-21511_laptop-hd-png-picture-png-format-laptop-png.png"
              }
              title="test"
            />
            <Category
              img={
                "https://www.seekpng.com/png/full/2-21511_laptop-hd-png-picture-png-format-laptop-png.png"
              }
              title="test"
            />
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
