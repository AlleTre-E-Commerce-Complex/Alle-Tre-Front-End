import React, { useState } from "react";
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

const FilterSections = ({ myRef, hiddenGatogry, categoryId }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { GatogryOptions } = useGetGatogry();
  const { NotAllBranOptions } = useGetBrand(categoryId);
  const { AllBranOptions } = useGetALLBrand();
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

  return (
    <div className="relative hidden lg:block bg-[#f5f5f5] flex flex-col gap-6 p-4 rounded-xl shadow-xl transition-shadow duration-300 max-w-full mx-auto w-full lg:max-w-xs border border-gray-200">
      <div className={`absolute top-4 ${lang === "ar" ? "left-1" : "right-1"}`}>
        <ShowFilterSections />
      </div>

      <h2 className="text-xl font-bold text-start text-gray-500 mb-3">
        {selectedContent[localizationKeys.filterOptions]}
      </h2>
      {/* Categories Section */}
      {!hiddenGatogry && (
        <div className="mb-3">
          <div
            onClick={() => toggleSection("categories")}
            className="cursor-pointer p-3 border-gray-500 rounded-lg shadow-md transition-all duration-300 ease-in-out
            bg-gradient-to-r from-[#a91d3a] via-[#c83250] to-[#d85b73] text-white/90
            hover:bg-gradient-to-r hover:from-[#f19ab1] hover:via-[#f1a1b1] hover:to-[#f1abba] hover:text-primary
            hover:opacity-90 hover:shadow-xl transform hover:scale-105
            flex justify-between items-center"
            // className="cursor-pointer p-3 border border-gray-veryLight rounded-lg shadow-md transition-all duration-300 ease-in-out
            // bg-gradient-to-r from-[#7d7d7d] via-[#a4a4a4] to-[#c1c1c1] text-black hover:bg-gradient-to-r hover:from-[#252525] hover:via-[#4c4c4c] hover:to-[#7d7d7d] hover:text-white
            // hover:opacity-90 hover:shadow-xl transform hover:scale-105
            // flex justify-between items-center"
          >
            <h3 className="font-medium text-lg">
              {selectedContent[localizationKeys.categories]}
            </h3>
            {renderArrowIcon("categories")}
          </div>

          {expandedSections.categories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="mt-2 p-2 rounded-lg bg-white shadow-sm"
            >
              <MultiButtonFilter
                seeAll={GatogryOptions?.length}
                name="categories"
                values={GatogryOptions?.map((CategoryName) => ({
                  name: CategoryName?.text,
                  value: `${CategoryName?.value}`,
                })).filter(Boolean)}
                myRef={myRef}
              />
            </motion.div>
          )}
        </div>
      )}

      {/* Brands Section */}
      <div className="mb-3">
        <div
          onClick={() => toggleSection("brands")}
          className="cursor-pointer p-3 border-gray-500 rounded-lg shadow-md transition-all duration-100 ease-in-out bg-gradient-to-r from-[#a91d3a] to-[#d85b73] text-white/90 hover:from-[#f19ab1] hover:to-[#f1abba] hover:text-primary
            hover:shadow-lg flex justify-between items-center"
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
            {categoryId ? (
              NotAllBranOptions?.length > 0 && (
                <MultiButtonFilter
                  name="brands"
                  values={NotAllBranOptions?.map((brandName) => ({
                    name: brandName?.text,
                    value: `${brandName?.value}`,
                  })).filter(Boolean)}
                  myRef={myRef}
                />
              )
            ) : (
              <MultiButtonFilter
                name="brands"
                values={AllBranOptions?.map((brandName) => ({
                  name: brandName?.text,
                  value: `${brandName?.value}`,
                })).filter(Boolean)}
                myRef={myRef}
              />
            )}
          </motion.div>
        )}
      </div>

      {/* Other Sections */}
      {[
        {
          key: "sellingType",
          title: selectedContent[localizationKeys.sellingType],
          values: [
            {
              name: selectedContent[localizationKeys.auction],
              value: "Auction",
            },
            {
              name: selectedContent[localizationKeys.buyNow],
              value: "Buy_Now",
            },
          ],
        },
        {
          key: "auctionState",
          title: selectedContent[localizationKeys.auctionState],
          values: [
            {
              name: selectedContent[localizationKeys.comingSoon],
              value: "IN_SCHEDULED",
            },
            {
              name: selectedContent[localizationKeys.liveAuction],
              value: "ACTIVE",
            },
          ],
        },
        {
          key: "location",
          title: selectedContent[localizationKeys.location],
          values: AllCountriesOptions?.map((countryName) => ({
            name: countryName?.text,
            value: `${countryName?.value}`,
          })).filter(Boolean),
        },
        {
          key: "condition",
          title: selectedContent[localizationKeys.condition],
          values: [
            { name: selectedContent[localizationKeys.new], value: "NEW" },
            { name: selectedContent[localizationKeys.used], value: "USED" },
            {
              name: selectedContent[localizationKeys.openBox],
              value: "OPEN_BOX",
            },
          ],
        },
      ].map(({ key, title, values }) => (
        <div key={key} className="mb-3">
          <div
            onClick={() => toggleSection(key)}
            className="cursor-pointer p-3 border-gray-500 rounded-lg shadow-md transition-all duration-100 ease-in-out bg-gradient-to-r from-[#a91d3a] to-[#d85b73] text-white/90 hover:from-[#f19ab1] hover:to-[#f1abba] hover:text-primary
            hover:shadow-lg flex justify-between items-center"
          >
            <h3 className="font-medium text-lg">{title}</h3>
            {renderArrowIcon(key)}
          </div>
          {expandedSections[key] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="mt-3 p-4 rounded-lg bg-white shadow-sm"
            >
              <MultiButtonFilter
                seeAll={values?.length}
                name={key}
                values={values}
                myRef={myRef}
              />
            </motion.div>
          )}
        </div>
      ))}

      {/* Price Range Section */}
      <div>
        <div
          onClick={() => toggleSection("price")}
          className="cursor-pointer p-3 border-gray-500 rounded-lg shadow-md transition-all duration-100 ease-in-out bg-gradient-to-r from-[#a91d3a] to-[#d85b73] text-white/90 hover:from-[#f19ab1] hover:to-[#f1abba] hover:text-primary
            hover:shadow-lg flex justify-between items-center"
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
            className="mt-3 "
          >
            <RangeInput className="" myRef={myRef} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FilterSections;
