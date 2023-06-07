import { React, useEffect, useRef, useState } from "react";
import AnglesRight from "../../../../src/assets/icons/angles-right-icon.png";
import AnglesLeft from "../../../../src/assets/icons/angles-left-icon.png";
import Category from "./Category";
import Swiper from "swiper";

const testData = [
  {
    img: "https://www.seekpng.com/png/full/2-21511_laptop-hd-png-picture-png-format-laptop-png.png",
    title: "Electronic Devices",
    id: "25",
  },
  {
    img: "https://www.seekpng.com/png/full/2-21511_laptop-hd-png-picture-png-format-laptop-png.png",
    title: "Jewelry",
    id: "26",
  },
  {
    img: "https://pngimg.com/d/acura_PNG129.png",
    title: "Properties",
    id: "27",
  },
  {
    img: "https://pngimg.com/d/acura_PNG129.png",
    title: "Cars",
    id: "28",
  },
];

const SliderRow = () => {
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
      swiper4?.destroy();
    };
  }, []);

  const handleNextClick = () => {
    if (testData?.length) {
      swiper4?.slideNext();
    } else swiper4?.slideNext();
  };

  const handlePrevClick = () => {
    swiper4?.slidePrev();
  };
  return (
    <div className="max-w-[1440px] mx-auto overflow-hidden  ">
      <div className="ezd-content relative ltr:ml-2 rtl:mr-2">
        <div className="ezd-snapslider pt-10 ">
          <div className="snapslider-wrapper">
            <div ref={swiperRef4} className={`snapslider-overflow`}>
              <div
                className={`snapslider-scroll swiper-wrapper py-2 justify-center`}
              >
                <div className="snapslider-card swiper-slide">
                  {/* slider */}
                  {testData.map((e, index) => (
                    <Category
                      key={index}
                      img={e?.img}
                      title={e?.title}
                      id={e?.id}
                    />
                  ))}
                </div>
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
