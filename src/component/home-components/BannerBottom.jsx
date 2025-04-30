import React, { useState, useEffect } from "react";
import BannerTopImage1 from "../../assets/images/mainImg1.jpg";
import BannerTopImage2 from "../../assets/images/mainImg2.jpg";
import BannerTopImage3 from "../../assets/images/mainImg3.jpg";
import BannerTopImage4 from "../../assets/images/mainImg4.jpg";
import BannerMobImage1 from "../../assets/images/mobileeSIze3.jpg";
import BannerMobImage2 from "../../assets/images/mobileeSiz1.jpg";
import BannerMobImage3 from "../../assets/images/mobileeSize2.jpg";
// import BannerMobImage4 from "../../assets/images/BannerMob4.jpg";
import { useLanguage } from "../../context/language-context";

const BannerBottom = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("right");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const images = isMobile
    ? [BannerMobImage1, BannerMobImage2, BannerMobImage3]
    : [BannerTopImage1, BannerTopImage2, BannerTopImage3, BannerTopImage4];

  const [lang] = useLanguage();
  const autoSlideInterval = 6000; 
  const handleSlide = (newDirection) => {
    if (animating) return;
    setDirection(newDirection);
    setAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        newDirection === "left"
          ? (prevIndex + 1) % images.length
          : (prevIndex - 1 + images.length) % images.length
      );
      setAnimating(false);
    }, 700);
  };

  const nextSlide = () => handleSlide("left");
  const prevSlide = () => handleSlide("right");

  useEffect(() => {
    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToSlide = (index) => {
    if (index !== currentIndex) {
      handleSlide(index > currentIndex ? "right" : "left");
      setCurrentIndex(index);
    }
  };

  // Dynamic height based on screen width

  return (
    <div
      className={`relative w-full mx-auto ${
        lang === "ar" ? "sm:pl-6" : "sm:pr-6"
      }`}
    >
      <style jsx global>{`
        .swiper-pagination {
          bottom: 0px !important;
        }
        .swiper-pagination-bullet {
          background: rgba(0,0,0,0.3) !important;
          width: 8px !important;
          height: 8px !important;
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active {
          background: #5b0c1f !important;
          width: 16px !important;
          border-radius: 4px !important;
        }
        .swiper-button-next,
        .swiper-button-prev,
        button.swiper-button-next,
        button.swiper-button-prev {
          display: none !important;
        }
      `}</style>
      <div className="relative overflow-hidden h-[12rem] md:h-[20rem] lg:h-[27rem] xl:h-[23rem] rounded-lg">
        {images.map((image, index) => {
          const isActive = currentIndex === index;
          let position = isActive
            ? "translate-x-0"
            : direction === "right"
            ? "-translate-x-full"
            : "translate-x-full";

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out ${position} flex items-center justify-center`}
            >
              <img
                src={image}
                className="w-full h-full object-fill"
                alt={`Slide ${index + 1}`}
              />
            </div>
          );
        })}
      </div>

      {images.length > 0 && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-[#5b0c1f]" : "bg-gray-400"
              }`}
              aria-current={currentIndex === index}
              aria-label={`Slide ${index + 1}`}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      )}


    </div>
  );
};

export default BannerBottom;
