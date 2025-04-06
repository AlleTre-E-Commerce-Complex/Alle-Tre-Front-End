import { React, useEffect, useRef } from "react";
import AnglesRight from "../../../../src/assets/icons/arrow-right.svg";
import AnglesLeft from "../../../../src/assets/icons/arrow-left.svg";
import Category from "./Category";
import Swiper from "swiper";
import useGetGatogry from "../../../hooks/use-get-category";

const SliderRow = () => {
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
    simulateTouch: true,
    freeMode: {
      enabled: true,
      momentum: true,
      momentumRatio: 0.8,
      momentumBounce: false,
    },
    spaceBetween: 8, // Add small gap between slides
    breakpoints: {
      320: {
        slidesPerView: "auto",
        spaceBetween: 8,
      },
      640: {
        slidesPerView: "auto",
        spaceBetween: 12,
      },
      768: {
        slidesPerView: "auto",
        spaceBetween: 16,
      },
      1024: {
        slidesPerView: "auto",
        spaceBetween: 24,
      },
    },
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
      swiper4.slideTo(0, 0);
    }
  }, [GatogryOptions]);

  const handleNextClick = () => {
    swiper4?.slideNext();
  };

  const handlePrevClick = () => {
    swiper4?.slidePrev();
  };

  return (
    <div className="px-4 mx-auto">
      <div className="ezd-content relative ltr:ml-2 rtl:mr-2">
        <div className="ezd-snapslider">
          <div className="snapslider-wrapper">
            <div ref={swiperRef4} className="snapslider-overflow">
              <div className="snapslider-scroll swiper-wrapper py-2 px-2 sm:px-4 md:px-6 lg:px-10 flex justify-start sm:justify-center">
                {GatogryOptions?.map((e, index) => (
                  <div key={index} className="snapslider-card swiper-slide">
                    <Category
                      img={e?.sliderLink}
                      title={e?.text}
                      id={e?.value}
                      className={
                        GatogryOptions.length <= 4
                          ? "px-2 sm:px-4 md:px-8 lg:px-12"
                          : "px-2 sm:px-3 md:px-6 lg:px-8"
                      }
                      // isSubCategory={false}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleNextClick}
              className="swiper-button-next absolute top-1/2 -right-3 overflow-hidden md:block hidden"
            >
              <img
                className="rounded-full cursor-pointer z-20 w-14 h-14"
                src={AnglesRight}
                alt="Next"
              />
            </button>
            <button
              onClick={handlePrevClick}
              className="swiper-button-prev absolute top-1/2 -left-5 overflow-hidden md:block hidden"
            >
              <img
                className="rounded-full cursor-pointer z-20 w-14 h-14"
                src={AnglesLeft}
                alt="Previous"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderRow;
