import React, { useState } from "react";

import anglesRightIcon from "../../../src/assets/icons/angles-right-icon.png";
import anglesLeftIcon from "../../../src/assets/icons/angles-left-icon.png";
import { ReactComponent as ScrollingIcon } from "../../../src/assets/icons/scrolling-icon.svg";

import "./image-slider.css";
import { truncateString } from "../../utils/truncate-string";
import CountdownTimer from "../shared/timers/countdown-timer";
import routes from "../../routes";
import { useHistory } from "react-router-dom";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const ImageSlider = ({ myRef, images, slidesData }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();

  const [translate, setTranslate] = useState("");
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setTranslate("slideRight");
    setCurrent(current === images[0]?.length - 1 ? 0 : current + 1);
  };
  const prevSlide = () => {
    setTranslate("slideleft");
    setCurrent(current === 0 ? images[0]?.length - 1 : current - 1);
  };

  if (!Array.isArray(images) || images.length <= 0) {
    return null;
  }
  const nextindex =
    current + 1 === images[0]?.length ? current - 1 : current + 1;
  const previndex = current + 1 && current - 1 < 0 ? 0 : current - 1;

  const handelGoDetails = (id, isMyAuction, status) => {
    if (isMyAuction) {
      if (status === "ACTIVE") {
        history.push(routes.app.profile.myAuctions.activeDetails(id));
      }
      if (status === "IN_SCHEDULED") {
        history.push(routes.app.profile.myAuctions.scheduledDetails(id));
      }
      if (status === "SOLD") {
        history.push(routes.app.profile.myAuctions.soldDetails(id));
      }
      if (status === "PENDING_OWNER_DEPOIST") {
        history.push(routes.app.profile.myAuctions.pendingDetails(id));
      }
      if (status === "EXPIRED") {
        history.push(routes.app.profile.myAuctions.activeDetails(id));
      }
    } else history.push(routes.app.homeDetails(id));
  };

  return (
    <section className="mt-7 relative max-w-[1440px] lg:h-[561px] md:h-[350px] h-[200px] mx-auto">
      <div className="relative hidden lg:block ">
        <img
          className="object-cover absolute -right-8 lg:-top-6 md:-top-2 w-1/2 lg:h-[541px] md:h-[350px] h-[200px] rounded-r-[32px] drop-shadow-home-img blur-[0.1px] opacity-30  "
          src={images[0]?.[nextindex]?.imageLink}
          alt="travel"
        />
        <img
          className="object-cover absolute -left-8 lg:-top-6 md:-top-2  w-1/2 lg:h-[541px] md:h-[350px] h-[200px] rounded-l-[32px] drop-shadow-home-img blur-[0.1px] opacity-30 "
          src={images[0]?.[previndex]?.imageLink}
          alt="travel"
        />
      </div>
      {slidesData?.map((slide, index) => {
        return (
          <div
            className={index === current ? "slide active" : translate}
            key={index}
          >
            {index === current && (
              <div className="lg:h-[561px] md:h-[350px] h-[200px] lg:mx-16 mx-4 relative rounded-[32px]  ">
                <div onClick={nextSlide} className="overflow-hidden ">
                  {/* right */}
                  <img
                    src={anglesRightIcon}
                    alt="anglesRightIcon"
                    className="absolute z-20 lg:right-5 md:right-0 right-1 top-1/2 lg:w-16 md:w-14 lg:h-16 md:h-14 w-8 cursor-pointer right-arrow-parent"
                  />
                  <div className="overflow-hidden absolute inset-0 hidden l:block">
                    <div className="right-arrow lg:w-[541px] md:w-[490px] w-[300px] -rotate-90 lg:right-2.5 md:-right-20 -right-14 top-0"></div>
                  </div>
                </div>
                <div onClick={prevSlide} className="overflow-hidden">
                  {/* left */}
                  <img
                    src={anglesLeftIcon}
                    alt="anglesLeftIcon"
                    className="absolute z-20 lg:left-5 md:left-1 left-1 top-1/2 lg:w-16 md:w-14 lg:h-16 md:h-14 w-8 cursor-pointer left-arrow-parent "
                  />
                  <div className="overflow-hidden absolute inset-0 hidden l:block">
                    <div className="left-arrow lg:w-[541px] md:w-[490px] w-[299px] rotate-90 lg:left-2.5 md:-left-20 -left-14 top-0"></div>
                  </div>
                </div>
                <div className="drop-shadow-[0px 3px 16px #E9E9E980] lg:h-[561px] md:h-[350px] h-[200px] shadow-img ">
                  <img
                    className="object-cover w-full lg:h-[541px] md:h-[350px] h-[200px] rounded-[32px] drop-shadow-[0px 3px 16px #E9E9E980]  "
                    src={slide?.product?.images[0]?.imageLink}
                    alt="travel"
                  />
                </div>
                <div className="w-full lg:h-[541px] md:h-[350px] h-[200px] rounded-[32px] bg-gradient-to-r from-black/80 absolute top-0  text-white lg:pt-24 md:pt-10 ltr:sm:pl-24 rtl:sm:pr-24 ltr:pl-10 rtl:pr-10 pt-5 ">
                  <ScrollingIcon
                    onClick={() =>
                      window.scrollTo({
                        behavior: "smooth",
                        top: myRef?.current?.offsetTop,
                      })
                    }
                    className="absolute -bottom-9 z-50 left-1/2 transform -translate-x-1/2 cursor-pointer hidden l:block"
                  />
                  <div>
                    {/* title */}
                    <h1 className="lg:text-4xl md:text-2xl text-base font-normal">
                      {/* The 2023 Range Rover Evoque */}
                      {slide?.product?.title}
                    </h1>
                    {/* pragraf */}
                    <p className="text-gray-veryLight lg:text-base md:text-sm text-xs pt-4 font-normal max-w-xl h-16 ">
                      {truncateString(slide?.product?.description, 200)}
                    </p>
                    {/* timer */}
                    <button className="bg-gradient-to-br from-red to-red-dark lg:w-56 md:w-44 w-36 lg:h-11 md:h-9 h-8 rounded-xl lg:mt-16 md:mt-8 mt-5 lg:text-base md:text-sm text-xs ">
                      <CountdownTimer date={slide?.expiryDate} />
                    </button>
                    {/* button pagination */}
                    <div className="lg:mt-12 md:mt-8 hidden md:block ">
                      <div id="navigation">
                        {slidesData?.map((_, index) => (
                          <div
                            className={
                              index === current ? "active button " : "button"
                            }
                          ></div>
                        ))}
                      </div>
                    </div>
                    {/* button */}
                    <div className="md:mt-12 mt-5 flex gap-x-8">
                      <button
                        onClick={() =>
                          handelGoDetails(
                            slide?.id,
                            slide?.isMyAuction,
                            slide?.status
                          )
                        }
                        className="lg:w-32 md:w-28 w-24 lg:h-12 md:h-10 rounded-lg bg-primary hover:bg-primary-dark sm:text-base text-xs font-normal ltr:font-serifEN rtl:font-serifAR"
                      >
                        {selectedContent[localizationKeys.bidNow]}
                      </button>
                      <button
                        onClick={() =>
                          handelGoDetails(
                            slide?.id,
                            slide?.isMyAuction,
                            slide?.status
                          )
                        }
                        className="lg:w-32 md:w-28 w-24 lg:h-12 md:h-10 rounded-lg bg-transparent border-white border-[1px] text-white sm:text-base text-xs py-1  md:py-0 font-normal ltr:font-serifEN rtl:font-serifAR"
                      >
                        {selectedContent[localizationKeys.viewDetails]}
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
