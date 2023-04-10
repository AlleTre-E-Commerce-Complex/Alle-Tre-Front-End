import { React, useState } from "react";
import AnglesRight from "../../../../src/assets/icons/angles-right-icon.png";
import AnglesLeft from "../../../../src/assets/icons/angles-left-icon.png";
import Category from "./Category";

const testData = [
  {
    img: "https://www.seekpng.com/png/full/2-21511_laptop-hd-png-picture-png-format-laptop-png.png",
    title: "Electronic Devices",
  },
  {
    img: "https://www.seekpng.com/png/full/2-21511_laptop-hd-png-picture-png-format-laptop-png.png",
    title: "Jewelry",
  },
  {
    img: "https://www.seekpng.com/png/full/2-21511_laptop-hd-png-picture-png-format-laptop-png.png",
    title: "Properties",
  },
  {
    img: "https://pngimg.com/d/acura_PNG129.png",
    title: "Cars",
  },
];

const SliderRow = () => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const sliderLeft = () => {
    var slider = document.getElementById("slider");
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      slider.scrollLeft = (selectedIndex - 1) * slider.offsetWidth;
    }
  };

  const sliderRight = () => {
    var slider = document.getElementById("slider");
    if (selectedIndex < testData.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      slider.scrollLeft = (selectedIndex + 1) * slider.offsetWidth;
    } else setSelectedIndex(selectedIndex);
  };

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (isMouseDown) {
      var slider = document.getElementById("slider");
      slider.scrollLeft = slider.scrollLeft - e.movementX;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="">
        <div
          className="relative flex gap-x-4 items-center "
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <img
            onClick={sliderLeft}
            className="rounded-full left-14 absolute cursor-pointer z-20 w-14 h-14 "
            src={AnglesLeft}
            alt="AnglesLeft"
          />
          <div
            id={"slider"}
            className="w-full h-full overflow-x-scroll scrollbar-hide whitespace-nowrap scroll-smooth relative sm:px-24 px-14"
          >
            {/* slider */}
            {testData.map((e, index) => (
              <Category key={index} img={e?.img} title={e?.title} />
            ))}
          </div>
          <img
            onClick={sliderRight}
            className="rounded-full right-14 absolute cursor-pointer z-20 w-14 h-14 "
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
