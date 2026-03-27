import React from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import routes from "../../../routes";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

// Icons (using the same ones as Header/Sidebar where possible, or similar)
import { RiHome2Fill } from "react-icons/ri";
import { FiList } from "react-icons/fi";
import { FaPlus, FaGavel, FaArrowRight } from "react-icons/fa";
import { BsPersonFill } from "react-icons/bs";
import { TbTag } from "react-icons/tb";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const MobileBottomNav = ({
  isExpanded,
  toggleExpand,
  handleOnSell,
  handleListProduct,
  user,
  dispatch,
  Open, // Action to open Auth Modal
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();

  const location = useLocation();
  const { pathname } = location;

  const handleProfileClick = () => {
    if (user) {
      history.push(routes.app.profile.profileSettings);
    } else {
      dispatch(Open());
    }
  };

  const handleMyProducts = () => {
    if (user) {
      history.push(routes.app.profile.myProducts.default);
    } else {
      dispatch(Open());
    }
  };

  const handlePurchased = () => {
    if (user) {
      history.push(routes.app.profile.purchased);
    } else {
      dispatch(Open());
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full z-[60] bg-[#2c3e50] md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.15)] rounded-t-2xl px-2 pb-safe pt-2">
        <div className="flex justify-between items-center h-16 relative">
          {/* 1. Home */}
          <button
            onClick={() => history.push(routes.app.home)}
            className="flex-1 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-yellow active:scale-95 transition-all"
          >
            <RiHome2Fill
              size={22}
              className={
                window.location.pathname === routes.app.home
                  ? "text-yellow"
                  : "text-primary-veryLight"
              }
            />
            <span
              className={`text-[10px] sm:text-xs font-medium ${window.location.pathname === routes.app.home ? "text-yellow" : ""}`}
            >
              {selectedContent[localizationKeys.home]}
            </span>
          </button>

          {/* 2. My Products */}
          <button
            onClick={handleMyProducts}
            className="flex-1 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-yellow active:scale-95 transition-all"
          >
            <FiList
              size={24}
              className={
                pathname.startsWith(routes.app.profile.myProducts.default)
                  ? "text-yellow"
                  : "text-primary-veryLight"
              }
            />
            <span
              className={`text-[10px] sm:text-xs font-medium ${
                pathname.startsWith(routes.app.profile.myProducts.default)
                  ? "text-yellow"
                  : ""
              }`}
            >
              {selectedContent[localizationKeys.myProducts]}
            </span>
          </button>

          {/* 3. CENTER BUTTON (Sell) */}
          <div className="flex-1 flex justify-center relative -top-6">
            <button
              onClick={toggleExpand}
              className={`bg-yellow text-primary-dark font-semibold rounded-full w-16 h-16 flex flex-col items-center justify-center  border-4 border-[#2c3e50] transform transition-all duration-300 ease-in-out active:scale-95 z-50 ${
                isExpanded ? "rotate-45" : "rotate-0"
              }`}
            >
              <FaPlus size={20} className="mb-0.5" />
              <span
                className={`text-[9px] font-bold ${isExpanded ? "hidden" : "block"}`}
              >
                {/* {selectedContent[localizationKeys.sell]} */}
              </span>
            </button>
          </div>

          {/* 4. Purchased */}
          <button
            onClick={handlePurchased}
            className="flex-1 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-yellow active:scale-95 transition-all"
          >
            <HiOutlineShoppingBag
              size={22}
              className={
                pathname.startsWith(routes.app.profile.purchased)
                  ? "text-yellow"
                  : "text-primary-veryLight"
              }
            />
            <span
              className={`text-[10px] sm:text-xs font-medium ${
                pathname.startsWith(routes.app.profile.purchased)
                  ? "text-yellow"
                  : ""
              }`}
            >
              {selectedContent[localizationKeys.Purchased]}
            </span>
          </button>

          {/* 5. Profile */}
          <button
            onClick={handleProfileClick}
            className="flex-1 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-yellow active:scale-95 transition-all"
          >
            <BsPersonFill
              size={24}
              className={
                window.location.pathname.includes("/profile")
                  ? "text-yellow"
                  : "text-primary-veryLight"
              }
            />
            <span
              className={`text-[10px] sm:text-xs font-medium ${window.location.pathname.includes("/profile") ? "text-yellow" : ""}`}
            >
              {selectedContent[localizationKeys.profile]}
            </span>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        onClick={toggleExpand}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[55] transition-opacity duration-300 md:hidden ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed left-0 w-full bg-[#1b2331] rounded-t-[32px] z-[58] px-5 pt-5 pb-24 transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${
          isExpanded ? "translate-y-0 bottom-0" : "translate-y-full bottom-0"
        }`}
      >
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-600 rounded-full mb-6"></div>

        {/* Header */}
        <h2 className="text-white text-[22px] font-bold mb-2 tracking-wide">
          {selectedContent[localizationKeys.sellYourAsset]}
        </h2>
        <p className="text-gray-400 text-[13px] text-center mb-8 px-4 leading-relaxed">
          {selectedContent[localizationKeys.chooseTheBestWayToSellYourItem]}
        </p>

        {/* Options */}
        <div className="w-full flex flex-col gap-4 max-w-sm">
          {/* Public Auction */}
          {/* <button
            onClick={handleOnSell}
            className="flex items-center gap-4 bg-[#232a38] border border-gray-700/60 p-4 rounded-2xl hover:bg-[#2c3648] active:scale-[0.98] transition-all text-left w-full shadow-lg"
          >
            <div className="w-14 h-14 bg-yellow-veryLight rounded-xl flex items-center justify-center shrink-0">
              <FaGavel className="text-yellow text-2xl transform -scale-x-100" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold text-[15px]">
                  {selectedContent[localizationKeys.createAuction]}
                </span>
                <FaArrowRight className="text-yellow" size={14} />
              </div>
              <p className="text-gray-400 text-[11px] leading-[1.4]">
                {selectedContent[localizationKeys.letBuyersBidForTheBestPrice]}
              </p>
            </div>
          </button> */}

          {/* Private Listing */}
          <button
            onClick={handleListProduct}
            className="flex items-center gap-4 bg-[#232a38] border border-gray-700/60 p-4 rounded-2xl hover:bg-[#2c3648] active:scale-[0.98] transition-all text-left w-full shadow-lg mt-1"
          >
            <div className="w-14 h-14 bg-yellow-veryLight rounded-xl flex items-center justify-center shrink-0">
              <TbTag className="text-yellow text-2xl" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold text-[15px]">
                  {selectedContent[localizationKeys.listProduct]}
                </span>
                <FaArrowRight className="text-yellow" size={14} />
              </div>
              <p className="text-gray-400 text-[11px] leading-[1.4]">
                {selectedContent[localizationKeys.sellInstantlyAtYourSetPrice]}
              </p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileBottomNav;
