import { React, useEffect, useRef, useState } from "react";
import AnglesRight from "../../../../src/assets/icons/angles-right-icon.png";
import AnglesLeft from "../../../../src/assets/icons/angles-left-icon.png";
import Category from "./Category";
import Swiper from "swiper";

const SubCategorySlider = ({ SubGatogryOptions }) => {
  const swiperOptions = {
    cssMode: true,
    speed: 1000,
    navigation: {
      nextEl: `.swiper-button-next`,
      prevEl: `.swiper-button-prev`,
    },
    slidesPerView: "auto",
    mousewheel: true,
    keyboard: true,
  };

  const swiperRef = useRef(null);
  const swiper = new Swiper(swiperRef?.current, { ...swiperOptions });

  useEffect(() => {
    return () => {
      swiper?.destroy();
    };
  }, []);

  const handleNextClick = () => {
    if (SubGatogryOptions?.length) {
      swiper?.slideNext();
    } else swiper?.slideNext();
  };

  const handlePrevClick = () => {
    swiper?.slidePrev();
  };
  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="ezd-content relative ">
        <div className="ezd-snapslider pt-10">
          <div className="snapslider-wrapper">
            <div ref={swiperRef} className={`snapslider-overflow`}>
              <div
                className={`${
                  SubGatogryOptions?.length > 4 ? "" : "justify-center"
                } snapslider-scroll swiper-wrapper py-2`}
              >
                {/* slider */}
                {SubGatogryOptions.map((e, index) => (
                  <div className="snapslider-card swiper-slide">
                    <Category
                      view
                      key={index}
                      img={e?.imageLink}
                      title={e?.text}
                      id={e?.id}
                    />
                  </div>
                ))}
                <button
                  onClick={handleNextClick}
                  className={`swiper-button-next absolute top-1/2 -right-3`}
                >
                  <img
                    className="rounded-full cursor-pointer z-20 w-14 h-14 "
                    src={AnglesRight}
                    alt="AnglesRight"
                  />
                </button>
                <button
                  onClick={handlePrevClick}
                  className={`swiper-button-prev absolute top-1/2 -left-5 `}
                >
                  <img
                    className="rounded-full  cursor-pointer z-20 w-14 h-14 "
                    src={AnglesLeft}
                    alt="AnglesLeft"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategorySlider;
