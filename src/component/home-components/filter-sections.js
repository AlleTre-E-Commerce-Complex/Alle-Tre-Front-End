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

const FilterSections = ({
  myRef,
  hiddenGatogry,
  categoryId,
  isFullPage,
  onClose,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { GatogryOptions } = useGetGatogry();
  const { brandOptions } = useGetBrand(categoryId);
  const { allBrands } = useGetALLBrand();
  const { AllCountriesOptions } = useGetAllCountries();

  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const renderArrowIcon = (section) => {
    return expandedSections[section] ? (
      <MdKeyboardArrowUp className="text-2xl" />
    ) : (
      <MdKeyboardArrowDown className="text-2xl" />
    );
  };

  const overlayClasses = isFullPage
    ? "fixed inset-0 z-50 bg-white overflow-y-auto px-4"
    : "relative hidden lg:block bg-[#f5f5f5] flex flex-col gap-6 p-4 rounded-xl shadow-xl transition-shadow duration-300 max-w-full mx-auto w-full lg:max-w-xs border border-gray-200 h-full";

  useEffect(() => {
    if (isFullPage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
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
      <div className="relative flex items-center justify-between p-4">
        <h2 className="text-xl font-bold text-gray-500">
          {selectedContent[localizationKeys.filterOptions]}
        </h2>
        {isFullPage && (
          <div className="flex items-center justify-between">
            <div className={`${lang === "ar" ? "ml-2" : "mr-2"}`}>
              <ShowFilterSections />
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
          <div>
            <div
              onClick={() => toggleSection("categories")}
              className="cursor-pointer p-3 border-gray-500 rounded-lg shadow-md transition-all duration-100 ease-in-out bg-gradient-to-r from-[#a91d3a] to-[#d85b73] text-white/90 hover:from-[#f19ab1] hover:to-[#f1abba] hover:text-primary hover:shadow-lg flex justify-between items-center"
            >
              <h3 className="font-medium text-lg">
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
                className="mt-3 p-4 rounded-lg bg-white shadow-sm"
              >
                <MultiButtonFilter
                  values={GatogryOptions}
                  name="categories"
                  isMultiSelect={true}
                  myRef={myRef}
                />
              </motion.div>
            )}
          </div>
        )}

        {/* Brands Section */}
        <div>
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
        </div>

        {/* Selling Type */}
        <div className="mb-3">
          <div
            onClick={() => toggleSection("sellingType")}
            className="cursor-pointer p-3 border-gray-500 rounded-lg shadow-md transition-all duration-100 ease-in-out bg-gradient-to-r from-[#a91d3a] to-[#d85b73] text-white/90 hover:from-[#f19ab1] hover:to-[#f1abba] hover:text-primary hover:shadow-lg flex justify-between items-center"
          >
            <h3 className="font-medium text-lg">{selectedContent[localizationKeys.sellingType]}</h3>
            {renderArrowIcon("sellingType")}
          </div>
          {expandedSections.sellingType && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="mt-3 p-4 rounded-lg bg-white shadow-sm"
            >
              <MultiButtonFilter
                name="sellingType"
                values={[
                  { name: selectedContent[localizationKeys.auction], value: "Auction" },
                  { name: selectedContent[localizationKeys.buyNow], value: "Buy_Now" }
                ]}
                isMultiSelect={false}
                myRef={myRef}
              />
            </motion.div>
          )}
        </div>

        {/* Auction Status */}
        <div className="mb-3">
          <div
            onClick={() => toggleSection("auctionStatus")}
            className="cursor-pointer p-3 border-gray-500 rounded-lg shadow-md transition-all duration-100 ease-in-out bg-gradient-to-r from-[#a91d3a] to-[#d85b73] text-white/90 hover:from-[#f19ab1] hover:to-[#f1abba] hover:text-primary hover:shadow-lg flex justify-between items-center"
          >
            <h3 className="font-medium text-lg">{selectedContent[localizationKeys.auctionState]}</h3>
            {renderArrowIcon("auctionStatus")}
          </div>
          {expandedSections.auctionStatus && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="mt-3 p-4 rounded-lg bg-white shadow-sm"
            >
              <MultiButtonFilter
                name="auctionStatus"
                values={[
                  { name: selectedContent[localizationKeys.comingSoon], value: "IN_SCHEDULED" },
                  { name: selectedContent[localizationKeys.liveAuction], value: "ACTIVE" }
                ]}
                isMultiSelect={false}
                myRef={myRef}
              />
            </motion.div>
          )}
        </div>

        {/* Usage Status */}
        <div className="mb-3">
          <div
            onClick={() => toggleSection("usageStatus")}
            className="cursor-pointer p-3 border-gray-500 rounded-lg shadow-md transition-all duration-100 ease-in-out bg-gradient-to-r from-[#a91d3a] to-[#d85b73] text-white/90 hover:from-[#f19ab1] hover:to-[#f1abba] hover:text-primary hover:shadow-lg flex justify-between items-center"
          >
            <h3 className="font-medium text-lg">{selectedContent[localizationKeys.condition]}</h3>
            {renderArrowIcon("usageStatus")}
          </div>
          {expandedSections.usageStatus && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="mt-3 p-4 rounded-lg bg-white shadow-sm"
            >
              <MultiButtonFilter
                name="usageStatus"
                values={[
                  { name: selectedContent[localizationKeys.new], value: "NEW" },
                  { name: selectedContent[localizationKeys.used], value: "USED" },
                  { name: selectedContent[localizationKeys.openBox], value: "OPEN_BOX" }
                ]}
                isMultiSelect={false}
                myRef={myRef}
              />
            </motion.div>
          )}
        </div>

        {/* Price Range Section */}
        <div>
          <div
            onClick={() => toggleSection("price")}
            className="cursor-pointer p-3 border-gray-500 rounded-lg shadow-md transition-all duration-100 ease-in-out bg-gradient-to-r from-[#a91d3a] to-[#d85b73] text-white/90 hover:from-[#f19ab1] hover:to-[#f1abba] hover:text-primary hover:shadow-lg flex justify-between items-center"
          >
            <h3 className="font-medium text-lg">
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
              className="mt-3 p-4 rounded-lg bg-white shadow-sm"
            >
              <RangeInput myRef={myRef} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSections;
