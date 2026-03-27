import React, { useState, useEffect } from "react";
import BannerTopImage1 from "../../assets/arbonImages/New Banner/WebBannerEn/1.png";
import BannerTopImage2 from "../../assets/arbonImages/New Banner/WebBannerEn/2.png";
import BannerTopImage3 from "../../assets/arbonImages/New Banner/WebBannerEn/3.png";
import BannerTopImage4 from "../../assets/arbonImages/New Banner/WebBannerEn/4.png";
import BannerMobImage1 from "../../assets/arbonImages/New Banner/MobBannerEn/1.png";
import BannerMobImage2 from "../../assets/arbonImages/New Banner/MobBannerEn/2.png";
import BannerMobImage3 from "../../assets/arbonImages/New Banner/MobBannerEn/3.png";
import BannerMobImage4 from "../../assets/arbonImages/New Banner/MobBannerEn/4.png";
import BannerMobAr1 from "../../assets/arbonImages/New Banner/MobBannerAr/1.png";
import BannerMobAr2 from "../../assets/arbonImages/New Banner/MobBannerAr/2.png";
import BannerMobAr3 from "../../assets/arbonImages/New Banner/MobBannerAr/3.png";
import BannerMobAr4 from "../../assets/arbonImages/New Banner/MobBannerAr/4.png";
import DecAr1 from "../../assets/arbonImages/New Banner/WebBannerAr/1.png";
import DecAr2 from "../../assets/arbonImages/New Banner/WebBannerAr/2.png";
import DecAr3 from "../../assets/arbonImages/New Banner/WebBannerAr/3.png";
import DecAr4 from "../../assets/arbonImages/New Banner/WebBannerAr/4.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useLanguage } from "../../context/language-context";

const BannerBottom = () => {
  const [lang] = useLanguage();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const images = isMobile
    ? lang === "en"
      ? [BannerMobImage1, BannerMobImage2, BannerMobImage3, BannerMobImage4]
      : [BannerMobAr1, BannerMobAr2, BannerMobAr3, BannerMobAr4]
    : lang === "en"
    ? [BannerTopImage1, BannerTopImage2, BannerTopImage3, BannerTopImage4]
    : [DecAr1, DecAr2, DecAr3, DecAr4];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [lang]);

  return (
    <div
      className={`relative w-full mx-auto ${
        lang === "ar" ? "sm:pl-6" : "sm:pr-6"
      }`}
    >
      <style jsx global>{`
        .banner-bottom-slider .swiper-pagination {
          bottom: 15px !important;
        }
        .banner-bottom-slider .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5) !important;
          width: 8px !important;
          height: 8px !important;
          opacity: 1 !important;
          transition: all 0.3s ease;
        }
        .banner-bottom-slider .swiper-pagination-bullet-active {
          background: #eac566 !important; /* using the gold color for active */
          width: 24px !important;
          border-radius: 4px !important;
        }
      `}</style>
      
      <div className="relative overflow-hidden h-[12rem] md:h-[20rem] lg:h-[27rem] xl:h-[23rem] rounded-lg shadow-lg">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination, EffectFade]}
          className="w-full h-full banner-bottom-slider"
          key={lang + (isMobile ? "mobile" : "desktop")} // Force re-render on mode switch
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full bg-primary-dark/10">
                <img
                  src={image}
                  className="w-full h-full object-cover sm:object-fill"
                  alt={`Slide ${index + 1}`}
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BannerBottom;
