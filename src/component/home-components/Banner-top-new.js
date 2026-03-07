import React from "react";
import { useHistory } from "react-router-dom";
import routes from "../../routes";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import BannerImg from "../../assets/images/arbobBannerTop.png";
import BannerImgAr from "../../assets/images/arbobBannerTop.png"; // Fallback to EN if Arabic isn't available
import { useAuthState } from "../../context/auth-context";
import { useDispatch } from "react-redux";
import { Open } from "../../redux-store/auth-model-slice";

const BannerTopNew = () => {
  const { user } = useAuthState();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const dispatch = useDispatch();

  const handelRegister = () => {
    if (user) {
      history.push(routes.app.profile.profileSettings);
    } else dispatch(Open());
  };

  return (
    <div className="w-full pt-0 md:pt-2">
      <div className="relative w-full overflow-hidden rounded-xl shadow-2xl h-[400px] md:h-[450px]">
        {/* Background Image with Opacity and Gradient overlay */}
        <div className="absolute inset-0">
          <img
            src={lang === "ar" ? BannerImgAr : BannerImg}
            alt="Banner"
            className="w-full h-full object-cover opacity-90 "
          />
          {/* Subtle gradient to focus attention on center */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#172234]/80 via-transparent to-[#172234]/80"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#172234]/50 via-transparent to-[#172234]/90"></div>
        </div>

        {/* Content Section */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-8 sm:w-12 bg-yellow"></div>
            <p className="text-yellow text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">
              {selectedContent[localizationKeys.joinToday] || "JOIN TODAY"}
            </p>
            <div className="h-[1px] w-8 sm:w-12 bg-yellow"></div>
          </div>

          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-serif font-medium mb-6 drop-shadow-lg">
            {selectedContent[localizationKeys.beginYourCollectionJourney]}
          </h2>

          <p className="text-white text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light drop-shadow-md">
            {selectedContent[localizationKeys.joinThousandsDiscerning]}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full">
            <button
              onClick={handelRegister}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-b from-[#eac566] to-[#d4af37] hover:from-[#f0d488] hover:to-[#e0b942] text-primary-dark font-bold text-sm sm:text-base rounded-md transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_14px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 group"
            >
              {selectedContent[localizationKeys.createFreeAccount]}
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform rtl:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
            <a
              href="tel:+971501400414"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-white/10 text-white font-bold text-sm sm:text-base rounded-md border-2 border-white/40 hover:border-white transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm flex items-center justify-center"
            >
              {selectedContent[localizationKeys.contactUs]}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerTopNew;
