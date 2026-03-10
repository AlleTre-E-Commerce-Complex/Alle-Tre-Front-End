import React, { useState, useEffect } from "react";
import useGetALLBrand from "../../hooks/use-get-all-brands";
import useGetAllCountries from "../../hooks/use-get-all-countries";
import useGetGatogry from "../../hooks/use-get-category";
import RangeInput from "./range-input";
import useGetBrand from "../../hooks/use-get-brand";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import MultiButtonFilter from "component/shared/buttons/multi-button-filter";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { motion } from "framer-motion";
import ShowFilterSections from "./show-filter-sections";
import useGetSubGatogry from "hooks/use-get-sub-category";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import DropdownButtonFilter from "component/shared/buttons/dropdown-button-filter";
import { useHistory } from "react-router-dom";

const FilterSections = ({
  myRef,
  hiddenGatogry,
  categoryId,
  isFullPage,
  onClose,
}) => {
  const history = useHistory();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { GatogryOptions } = useGetGatogry();
  const { brandOptions } = useGetBrand(categoryId);
  const { allBrands } = useGetALLBrand();
  const { AllCountriesOptions } = useGetAllCountries();
  const [expandedSections, setExpandedSections] = useState({});
  const { search } = useLocation();
  const parsed = queryString.parse(search, { arrayFormat: "bracket" });
  const categories = parsed?.categories || [];
  const category_Id =
    categories.length >= 1 ? categories[categories.length - 1] : null;
  const { SubGatogryOptions } = useGetSubGatogry(category_Id);
  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const renderArrowIcon = (section) => {
    return expandedSections[section] ? (
      <MdKeyboardArrowUp className="text-xl text-[#1e2738] dark:text-gray-300" />
    ) : (
      <MdKeyboardArrowDown className="text-xl text-[#1e2738] dark:text-gray-300" />
    );
  };

  const overlayClasses = isFullPage
    ? "fixed inset-0 z-50 bg-[#fcfcfc] dark:bg-[#0b101a] overflow-y-auto px-4 w-full"
    : "relative hidden md:flex flex-col gap-4 py-4 md:py-6 pr-4 shadow-none backdrop-blur-none transition-all duration-300 max-w-full mx-auto w-full lg:max-w-[300px] md:max-w-[280px] h-full bg-transparent";

  useEffect(() => {
    if (isFullPage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFullPage]);

  return (
    <motion.div
      initial={isFullPage ? { opacity: 0, y: 20 } : false}
      animate={isFullPage ? { opacity: 1, y: 0 } : false}
      exit={isFullPage ? { opacity: 0, y: 20 } : false}
      transition={{ duration: 0.3 }}
      className={overlayClasses}
    >
      <div className="relative flex items-center justify-between p-2 mb-2">
        <h2 className="text-2xl font-bold text-[#1e2738] dark:text-white font-serifEN">
          {selectedContent[localizationKeys.filter]}
        </h2>
        {/* CLEAR ALL ALWAYS VISIBLE FOR DESKTOP AND MOBILE */}
        <button
          onClick={() => {
            history.push({ search: "" });
            // add additional form resets if necessary
          }}
          className="text-[11px] font-bold text-yellow hover:text-[#b8952b] transition uppercase tracking-widest"
        >
        {selectedContent[localizationKeys.clearAll]}
        </button>
        {isFullPage && (
          <div className="flex items-center justify-between">
            <div className={`${lang === "ar" ? "ml-2" : "mr-2"}`}>
              {/* <ShowFilterSections /> */}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark transition rounded-md"
              >
                {selectedContent[localizationKeys.apply]}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-primary transition rounded-full hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Sections */}
      <div className="flex flex-col gap-4">
        {/* Categories Section */}
        {!hiddenGatogry && (
          <div className="bg-white dark:bg-[#1e2738] border border-gray-200 dark:border-[#d4af37]/40  rounded-xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div
              onClick={() => toggleSection("categories")}
              className="cursor-pointer px-4 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-[#2a3648] transition-colors"
            >
              <h3 className="font-bold text-[11px] uppercase tracking-widest text-[#d4af37]">
                {selectedContent[localizationKeys.category]}
              </h3>
              {renderArrowIcon("categories")}
            </div>
            {expandedSections.categories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.1, ease: "linear" }}
                className="px-4 pb-4"
              >
                <MultiButtonFilter
                  values={GatogryOptions}
                  name="categories"
                  isMultiSelect={true}
                  myRef={myRef}
                  subCategories={SubGatogryOptions}
                  variant="checkbox"
                />
              </motion.div>
            )}
          </div>
        )}

        {/* Brands Section */}
        {/* <div>
          <div
            onClick={() => toggleSection("brands")}
            className="cursor-pointer p-3 border-gray-500 rounded-lg shadow-md transition-all duration-100 ease-in-out bg-gradient-to-r from-[#a91d3a] to-[#d85b73] text-white/90 hover:from-[#f19ab1] hover:to-[#f1abba] hover:text-primary hover:shadow-lg flex justify-between items-center"
          >
            <h3 className="font-medium text-lg">
              {selectedContent[localizationKeys.brand]}
            </h3>
            {renderArrowIcon("brands")}
          </div>
          {expandedSections.brands && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="mt-3 p-4 rounded-lg bg-white shadow-sm"
            >
              <MultiButtonFilter
                values={categoryId ? brandOptions : allBrands}
                name="brands"
                isMultiSelect={true}
                myRef={myRef}
              />
            </motion.div>
          )}
        </div> */}

        {/* Selling Type */}
        <div className="bg-white dark:bg-[#1e2738] border border-gray-200 dark:border-[#d4af37]/40 rounded-xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div
            onClick={() => toggleSection("sellingType")}
            className="cursor-pointer px-4 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-[#2a3648] transition-colors"
          >
            <h3 className="font-bold text-[11px] uppercase tracking-widest text-[#d4af37]">
              {selectedContent[localizationKeys.sellingType]}
            </h3>
            {renderArrowIcon("sellingType")}
          </div>
          {expandedSections.sellingType && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="px-4 pb-4"
            >
              <MultiButtonFilter
                name="sellingType"
                values={[
                  {
                    name: selectedContent[localizationKeys.auction],
                    value: "Auction",
                  },
                  {
                    name: selectedContent[localizationKeys.buyNow],
                    value: "Buy_Now",
                  },
                ]}
                isMultiSelect={false}
                myRef={myRef}
                variant="button"
              />
            </motion.div>
          )}
        </div>

        {/* Auction Status */}
        <div className="bg-white dark:bg-[#1e2738] border border-gray-200 dark:border-[#d4af37]/40  rounded-xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div
            onClick={() => toggleSection("auctionStatus")}
            className="cursor-pointer px-4 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-[#2a3648] transition-colors"
          >
            <h3 className="font-bold text-[11px] uppercase tracking-widest text-[#d4af37]">
              {selectedContent[localizationKeys.auctionState]}
            </h3>
            {renderArrowIcon("auctionStatus")}
          </div>
          {expandedSections.auctionStatus && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="px-4 pb-4"
            >
              <MultiButtonFilter
                name="auctionStatus"
                values={[
                  {
                    name: selectedContent[localizationKeys.comingSoon],
                    value: "IN_SCHEDULED",
                  },
                  {
                    name: selectedContent[localizationKeys.liveAuction],
                    value: "ACTIVE",
                  },
                ]}
                isMultiSelect={false}
                myRef={myRef}
                variant="button"
              />
            </motion.div>
          )}
        </div>

        {/* Usage Status */}
        <div className="bg-white dark:bg-[#1e2738] border border-gray-200 dark:border-[#d4af37]/40  rounded-xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div
            onClick={() => toggleSection("usageStatus")}
            className="cursor-pointer px-4 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-[#2a3648] transition-colors"
          >
            <h3 className="font-bold text-[11px] uppercase tracking-widest text-[#d4af37]">
              {selectedContent[localizationKeys.condition]}
            </h3>
            {renderArrowIcon("usageStatus")}
          </div>
          {expandedSections.usageStatus && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="px-4 pb-4"
            >
              <MultiButtonFilter
                name="usageStatus"
                values={[
                  { name: selectedContent[localizationKeys.new], value: "NEW" },
                  {
                    name: selectedContent[localizationKeys.used],
                    value: "USED",
                  },
                  // {
                  //   name: selectedContent[localizationKeys.openBox],
                  //   value: "OPEN_BOX",
                  // },
                ]}
                isMultiSelect={false}
                myRef={myRef}
                variant="button"
              />
            </motion.div>
          )}
        </div>

        {/* Price Range Section */}
        <div className="bg-white dark:bg-[#1e2738] border border-gray-200 dark:border-[#d4af37]/40  rounded-xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div
            onClick={() => toggleSection("price")}
            className="cursor-pointer px-4 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-[#2a3648] transition-colors"
          >
            <h3 className="font-bold text-[11px] uppercase tracking-widest text-[#d4af37]">
              {selectedContent[localizationKeys.price]}
            </h3>
            {renderArrowIcon("price")}
          </div>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className={`px-4 pb-4 ${isFullPage ? "w-full max-w-3xl mx-auto" : ""}`}
            >
              <RangeInput className="" myRef={myRef} isFullPage={isFullPage} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSections;
