import React, { useEffect, useRef } from "react";
import SubCategory from "./SubCategory";
import Swiper from "swiper";
import "swiper/css";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import localizationKeys from "../../../localization/localization-keys";

const SubCategorySlider = ({ SubGatogryOptions }) => {
  const swiperRef = useRef(null);
  const swiper = useRef(null);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const swiperOptions = {
    slidesPerView: 3,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-custom-next",
      prevEl: ".swiper-custom-prev",
    },
    breakpoints: {
      480: { slidesPerView: 4, spaceBetween: 15 },
      640: { slidesPerView: 5, spaceBetween: 20 },
      768: { slidesPerView: 6, spaceBetween: 30 },
      1024: { slidesPerView: 7, spaceBetween: 40 },
      1280: { slidesPerView: 8, spaceBetween: 50 },
    },
  };

  useEffect(() => {
    if (swiperRef.current) {
      if (swiper.current) {
        swiper.current.destroy();
      }
      swiper.current = new Swiper(swiperRef.current, swiperOptions);
    }

    return () => {
      if (swiper.current) {
        swiper.current.destroy();
      }
    };
  }, [lang, SubGatogryOptions]);

  const handleNextClick = () => {
    swiper.current?.slideNext();
  };

  const handlePrevClick = () => {
    swiper.current?.slidePrev();
  };

  if (!SubGatogryOptions || SubGatogryOptions.length === 0) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-1 md:my-2 overflow-visible">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-1 md:mb-2 w-full">
          <h2 className="text-2xl md:text-[28px] font-serifEN text-[#1e2738] dark:text-gray-100 tracking-wide">
           {selectedContent[localizationKeys.exploreCategories]}
          </h2>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button
              onClick={lang === "ar" ? handleNextClick : handlePrevClick}
              className="swiper-custom-prev group w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-[#1e2738] dark:hover:border-gray-300 transition-all duration-300 bg-white dark:bg-transparent cursor-pointer active:scale-95 shadow-sm"
              aria-label="Previous"
            >
              <MdNavigateBefore className="text-[#1e2738] group-hover:text-white dark:text-gray-400 dark:group-hover:text-white text-xl transition-colors" />
            </button>
            <button
              onClick={lang === "ar" ? handlePrevClick : handleNextClick}
              className="swiper-custom-next group w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-[#1e2738] dark:hover:border-gray-300 transition-all duration-300 bg-white dark:bg-transparent cursor-pointer active:scale-95 shadow-sm"
              aria-label="Next"
            >
              <MdNavigateNext className="text-[#1e2738] group-hover:text-white dark:text-gray-400 dark:group-hover:text-white text-xl transition-colors" />
            </button>
          </div>
        </div>

        {/* Swiper Section */}
        <div className="px-2 py-0 -mx-2">
          <div
            ref={swiperRef}
            className="swiper flex justify-center overflow-visible"
          >
            <div className="swiper-wrapper flex items-start justify-center pt-0">
              {SubGatogryOptions?.map((e, index) => (
                <div
                  key={index}
                  className="swiper-slide !h-auto flex justify-center pb-0"
                >
                  <SubCategory
                    img={e?.imageLink}
                    title={e?.text}
                    id={e?.value}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategorySlider;
