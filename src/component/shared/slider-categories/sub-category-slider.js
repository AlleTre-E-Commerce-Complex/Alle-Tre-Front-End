import { React, useEffect, useRef } from "react";
import SubCategory from "./SubCategory";
import Swiper from "swiper";
import "swiper/css";
import AnglesRight from "../../../../src/assets/icons/arrow-right.svg";
import AnglesLeft from "../../../../src/assets/icons/arrow-left.svg";
import { useLanguage } from "../../../context/language-context";

const SubCategorySlider = ({ SubGatogryOptions }) => {
  const swiperRef = useRef(null);
  const swiper = useRef(null);
  const [lang] = useLanguage("");
  const swiperOptions = {
    slidesPerView: 2.2,
    spaceBetween: 12,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      480: {
        slidesPerView: 2.5,
        spaceBetween: 12
      },
      640: {
        slidesPerView: 3.5,
        spaceBetween: 16
      },
      768: {
        slidesPerView: 4.5,
        spaceBetween: 16
      },
      1024: {
        slidesPerView: 5.5,
        spaceBetween: 16
      },
      1280: {
        slidesPerView: 6,
        spaceBetween: 16
      }
    }
  };

  useEffect(() => {
    if (swiperRef.current) {
      swiper.current = new Swiper(swiperRef.current, swiperOptions);
    }

    return () => {
      if (swiper.current) {
        swiper.current.destroy();
      }
    };
  }, []);

  const handleNextClick = () => {
    swiper.current?.slideNext();
  };

  const handlePrevClick = () => {
    swiper.current?.slidePrev();
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-6 my-8 relative">
      <div className="max-w-[1400px] mx-auto overflow-hidden">
        <div ref={swiperRef} className="swiper">
          <div className="swiper-wrapper h-full">
            {SubGatogryOptions?.map((e, index) => (
              <div key={index} className="swiper-slide h-auto">
                <SubCategory
                  view
                  img={e?.imageLink}
                  title={e?.text}
                  id={e?.value}
                  className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              </div>
            ))}
          </div>
        </div>
        <button
                    onClick={lang === "ar" ? handlePrevClick : handleNextClick}
                    className="swiper-button-next absolute top-1/2 -translate-y-1/2 -right-2 md:right-0 z-10 transition-transform hover:scale-105"
                  >
                    <div className="rounded-full bg-white shadow-lg p-2 cursor-pointer w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <img
                        className="w-6 h-6 md:w-8 md:h-8"
                        src={AnglesRight}
                        alt="Next"
                      />
                    </div>
                  </button>
                  <button
                    onClick={lang === "ar" ? handleNextClick : handlePrevClick}
                    className="swiper-button-prev absolute top-1/2 -translate-y-1/2 -left-2 md:left-0 z-10 transition-transform hover:scale-105"
                  >
                    <div className="rounded-full bg-white shadow-lg p-2 cursor-pointer w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <img
                        className="w-6 h-6 md:w-8 md:h-8"
                        src={AnglesLeft}
                        alt="Previous"
                      />
                    </div>
                  </button>
      </div>
    </div>
  );
};

export default SubCategorySlider;
