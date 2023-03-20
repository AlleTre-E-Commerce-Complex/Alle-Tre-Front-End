import React, { useState } from "react";
import { SliderData } from "./imge-data";

import anglesRightIcon from "../../../src/assets/icons/angles-right-icon.png";
import anglesLeftIcon from "../../../src/assets/icons/angles-left-icon.png";

import "./image-slider.css";

const ImageSlider = ({ slides }) => {
  const [translate, setTranslate] = useState("");
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setTranslate("slideRight");
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setTranslate("slideleft");
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }
  const nextindex = current + 1 === 5 ? current - 1 : current + 1;
  const previndex = current + 1 && current - 1 < 0 ? 0 : current - 1;

  return (
    <section className="mt-7 ">
      <div className="relative mx-6">
        <img
          className="object-cover absolute right-0 -top-6 w-1/2 h-[561px] rounded-r-[32px] drop-shadow-home-img blur-[0.1px] opacity-30  "
          src={SliderData[nextindex]?.image}
          alt="travel"
        />
        <img
          className="object-cover absolute left-0 -top-6 w-1/2 h-[561px] rounded-l-[32px] drop-shadow-home-img blur-[0.1px] opacity-30 "
          src={SliderData[previndex]?.image}
          alt="travel"
        />
      </div>
      {SliderData.map((slide, index) => {
        return (
          <div
            className={index === current ? "slide active" : translate}
            key={index}
          >
            {index === current && (
              <div className="h-[561px] mx-32 relative rounded-[32px]   ">
                <div onClick={nextSlide} className="overflow-hidden ">
                  {/* right */}
                  <img
                    src={anglesRightIcon}
                    alt="anglesRightIcon"
                    className="absolute z-20 right-5 top-1/2 w-16 h-16 cursor-pointer right-arrow-parent"
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
                    className="absolute z-20 left-5 top-1/2 w-16 h-16 cursor-pointer left-arrow-parent "
                  />
                  <div className="overflow-hidden absolute inset-0">
                    <div className="left-arrow w-[541px] rotate-90 left-2.5 top-0"></div>
                  </div>
                </div>
                <img
                  className="object-cover w-full h-[561px] rounded-[32px] drop-shadow-home-img"
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
