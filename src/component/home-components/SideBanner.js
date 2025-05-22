import React from "react";
import sideBannerImg from "../../assets/images/sideBannerImg.png";
import sideBannerAr from "../../assets/images/sideBannerAr.jpg";
import { useLanguage } from "../../context/language-context";

const SideBanner = () => {
  const [lang] = useLanguage();
  return (
    <div
      className={`hidden md:block md:w-1/5 mt-20 ${
        lang === "ar" ? "sm:pl-6" : "sm:pr-6"
      }`}
    >
      <div className="sticky top-40 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300">
        {lang === "en" ? (
          <img
            src={sideBannerImg}
            alt="Side Banner"
            className="w-full h-auto object-cover"
          />
        ) : (
          <img
            src={sideBannerAr}
            alt="Side Banner"
            className="w-full h-auto object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default SideBanner;
