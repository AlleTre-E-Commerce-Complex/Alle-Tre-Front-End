import { React, useEffect, useRef } from "react";
import AnglesRight from "../../../../src/assets/icons/arrow-right.svg";
import AnglesLeft from "../../../../src/assets/icons/arrow-left.svg";
import Category from "./Category";
import Swiper from "swiper";
import SubCategory from "./SubCategory";

const  SubCategorySlider = ({ SubGatogryOptions }) => {
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
    <div className="px-4 mx-auto">
      <div className="ezd-content relative tr:ml-2 rtl:mr-2 ">
        <div className="ezd-snapslider pt-10">
          <div className="snapslider-wrapper">
            <div ref={swiperRef} className={`snapslider-overflow`}>
              <div
                className={`${
                  SubGatogryOptions?.length > 3
                    ? ""
                    : "md:justify-center justify-start"
                } snapslider-scroll swiper-wrapper py-2`}
              >
                {/* slider */}
                {SubGatogryOptions.map((e, index) => (
                  <div key={index} className="snapslider-card swiper-slide ">
                    <SubCategory
                      view
                      img={e?.imageLink}
                      title={e?.text}
                      id={e?.value}
                      className={"md:px-20 lg:px-32"}
                      // isSubCategory={true}
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
