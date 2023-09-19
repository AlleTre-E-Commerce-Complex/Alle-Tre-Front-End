import { React, useEffect, useRef, useState } from "react";
import AnglesRight from "../../../../src/assets/icons/angles-right-icon.png";
import AnglesLeft from "../../../../src/assets/icons/angles-left-icon.png";
import Category from "./Category";
import Swiper from "swiper";
import useGetGatogry from "../../../hooks/use-get-category";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";

const SliderRow = () => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
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

  const swiperRef4 = useRef(null);
  const swiper4 = new Swiper(swiperRef4?.current, { ...swiperOptions });

  useEffect(() => {
    return () => {
      swiper4 && swiper4?.destroy();
    };
  }, []);

  useEffect(() => {
    if (GatogryOptions?.length && swiper4) {
      swiper4.slideTo(0, 0); // Go to the first index of the slider
    }
  }, [GatogryOptions]);

  const handleNextClick = () => {
    swiper4?.slideNext();
  };

  const handlePrevClick = () => {
    swiper4?.slidePrev();
  };
  return (
    <div className="max-w-[1440px] mx-auto   ">
      <div className="ezd-content relative ltr:ml-2 rtl:mr-2">
        <div className="ezd-snapslider pt-10 ">
          <div className="snapslider-wrapper">
            <div ref={swiperRef4} className={`snapslider-overflow`}>
              <div
                className={`${
                  GatogryOptions?.length > 4
                    ? ""
                    : "md:justify-center justify-start"
                } snapslider-scroll swiper-wrapper py-2`}
              >
                {/* slider */}
                {GatogryOptions?.map((e, index) => (
                  <div className="snapslider-card swiper-slide">
                    <Category
                      key={index}
                      img={e?.sliderLink}
                      title={e?.text}
                      id={e?.value}
                    />
                  </div>
                ))}
                <button
                  onClick={handleNextClick}
                  className={`swiper-button-next absolute top-1/2 -right-3 overflow-hidden`}
                >
                  <img
                    className="rounded-full  cursor-pointer z-20 w-14 h-14 "
                    src={AnglesRight}
                    alt="AnglesRight"
                  />
                </button>
                <button
                  onClick={handlePrevClick}
                  className={`swiper-button-prev absolute top-1/2 -left-5 overflow-hidden `}
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

export default SliderRow;
