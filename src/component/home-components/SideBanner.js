import React, { useEffect, useState } from "react";
import sideBannerLightEn from "../../assets/sideBanner/1.png";
import sideBannerDarkEn from "../../assets/sideBanner/2.png";
import sideBannerLightAr from "../../assets/sideBanner/3.png";
import sideBannerDarkAr from "../../assets/sideBanner/4.png";
import { useLanguage } from "../../context/language-context";

const SideBanner = () => {
  const [lang] = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const getBannerImage = () => {
    if (lang === "ar") {
      return isDarkMode ? sideBannerDarkAr : sideBannerLightAr;
    }
    return isDarkMode ? sideBannerDarkEn : sideBannerLightEn;
  };

  return (
    <div
      className={`hidden md:block md:w-1/5 mt-20 ${
        lang === "ar" ? "sm:pl-6" : "sm:pr-6"
      }`}
    >
      <div className="sticky top-40 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300">
        <img
          src={getBannerImage()}
          alt="Side Banner"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default SideBanner;
