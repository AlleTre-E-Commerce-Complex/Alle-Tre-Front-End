import React, { useState } from "react";
import { SliderData } from "./imge-data";
import "./image-slider.css";
import anglesRightIcon from "../../../src/assets/icons/angles-right-icon.png";
import anglesLeftIcon from "../../../src/assets/icons/angles-left-icon.png";

const ImageSlider = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }
  console.log("====================================");
  console.log(current === 1);
  console.log(length);
  console.log("====================================");

  return (
    <section className="mt-7 ">
      <div className="relative flex justify-between mx-28 ">
        <img
          className="object-cover absolute w-full h-[561px] rounded-[32px] drop-shadow-home-img blur-[1px] opacity-20"
          src={SliderData[current === length - 1 ? 0 : current + 1].image}
          alt="travel"
        />
        <img
          className="object-cover absolute  w-full h-[561px] rounded-[32px] drop-shadow-home-img blur-[1px] opacity-20 "
          src={SliderData[current === 0 ? length - 1 : current - 1].image}
          alt="travel"
        />
      </div>
      {SliderData.map((slide, index) => {
        return (
          <div
            className={index === current ? "slide active" : "slide "}
            key={index}
          >
            {index === current && (
              <div className="h-[561px] mx-52 relative rounded-[32px]   ">
                <div onClick={nextSlide} className="overflow-hidden ">
                  {/* right */}
                  <img
                    src={anglesRightIcon}
                    alt="anglesRightIcon"
                    className="absolute z-20 right-1 top-1/2 w-20 h-20 cursor-pointer right-arrow-parent"
                  />
                  <div className="overflow-hidden absolute inset-0">
                    <div className="right-arrow w-[541px] -rotate-90 right-2.5 top-0"></div>
                  </div>
                </div>
                <div onClick={prevSlide} className="overflow-hidden">
                  {/* left */}
                  <img
                    src={anglesLeftIcon}
                    alt="anglesLeftIcon"
                    className="absolute z-20 left-1 top-1/2 w-20 h-20 cursor-pointer left-arrow-parent "
                  />
                  <div className="overflow-hidden absolute inset-0">
                    <div className="left-arrow w-[541px] rotate-90 left-2.5 top-0"></div>
                  </div>
                </div>
                <img
                  className="object-cover w-full h-[561px] rounded-[32px] drop-shadow "
                  src={slide.image}
                  alt="travel"
                />
                <div className="w-full h-[561px] rounded-[32px] bg-gradient-to-r from-black/80 absolute top-0  text-white pt-24 pl-24">
                  <div>
                    {/* title */}
                    <h1 className="text-4xl font-normal">
                      The 2023 Range Rover Evoque
                    </h1>
                    {/* pragraf */}
                    <p className="text-gray-veryLight text-base pt-4 font-normal ">
                      elitr, sed diam nonumy eirmod tempor invidunt ut labore et
                      <br></br>
                      dolore magna aliquyam erat, sed diam voluptua. At vero
                    </p>
                    {/* timer */}
                    <button className="bg-gradient-to-br from-red to-red-dark w-56 h-11 rounded-xl mt-16">
                      2 days : 13 hrs : 30 min
                    </button>
                    {/* button pagination */}
                    <div className="mt-12 ">
                      <div id="navigation">
                        <div
                          className={current === 0 ? "active button" : "button"}
                        ></div>
                        <div
                          className={current === 1 ? "active button" : "button"}
                        ></div>
                        <div
                          className={current === 2 ? "active button" : "button"}
                        ></div>
                        <div
                          className={current === 3 ? "active button" : "button"}
                        ></div>
                        <div
                          className={current === 4 ? "active button" : "button"}
                        ></div>
                      </div>
                    </div>
                    {/* button */}
                    <div className="mt-12 flex gap-x-8">
                      <button className="w-32 h-12 rounded-lg bg-primary hover:bg-primary-dark text-base font-normal ltr:font-serifEN rtl:font-serifAR">
                        Bid Now
                      </button>
                      <button className="w-32 h-12 rounded-lg bg-transparent border-white border-[1px] text-white text-base font-normal ltr:font-serifEN rtl:font-serifAR">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default ImageSlider;
