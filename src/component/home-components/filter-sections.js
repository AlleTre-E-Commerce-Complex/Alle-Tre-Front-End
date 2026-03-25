import React, { useEffect } from "react";
import useGetALLBrand from "../../hooks/use-get-all-brands";
import useGetGatogry from "../../hooks/use-get-category";
import RangeInput from "./range-input";
import useGetBrand from "../../hooks/use-get-brand";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import MultiButtonFilter from "component/shared/buttons/multi-button-filter";
import { motion } from "framer-motion";
import useGetSubGatogry from "hooks/use-get-sub-category";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import useGetAllCities from "../../hooks/use-get-all-cities";
import { IoClose } from "react-icons/io5";


// Isolated Dynamic Category Components
import FilterBlock from "./filter-block";
import CarsFilterSections from "./cars-filter-sections";
import PropertiesFilterSections from "./properties-filter-sections";

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
  const { search } = useLocation();
  const parsed = queryString.parse(search, { arrayFormat: "bracket" });
  const categories = parsed?.categories || [];
  const category_Id =
    categories.length >= 1 ? categories[categories.length - 1] : null;
  const activeCategoryId = categoryId || category_Id;
  

  // Identify Active Top-Level Category Type
  const selectedCategoryObj = GatogryOptions?.find(
    (c) => c.value?.toString() === activeCategoryId?.toString(),
  );
  const selectedCategoryName = selectedCategoryObj
    ? selectedCategoryObj.name.toLowerCase()
    : "";
  const isCars =
    selectedCategoryName.includes("car") ||
    selectedCategoryName.includes("سيار") ||
    selectedCategoryName.includes("motor");
  const isProperties =
    selectedCategoryName.includes("prop") ||
    selectedCategoryName.includes("real estate") ||
    selectedCategoryName.includes("عقار");

  const overlayClasses = isFullPage
    ? "fixed inset-0 z-50 bg-[#fcfcfc] dark:bg-[#0b101a] overflow-y-auto px-4 w-full"
    : "hidden md:flex flex-col gap-4 py-4 md:py-6 pr-4 shadow-none backdrop-blur-none transition-all duration-300 max-w-full mx-auto w-full lg:max-w-[300px] md:max-w-[280px] sticky top-32 h-[calc(100vh-9rem)] overflow-y-auto bg-transparent scrollbar-hide shrink-0";

  useEffect(() => {
    document.body.style.overflow = isFullPage ? "hidden" : "unset";
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
        <button onClick={() => history.push({ search: "" })} className="text-[11px] font-bold text-yellow hover:text-[#b8952b] transition uppercase tracking-widest">
          {selectedContent[localizationKeys.clearAll]}
        </button>
        {isFullPage && (
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark transition rounded-md">{selectedContent[localizationKeys.apply]}</button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-primary transition rounded-full hover:bg-gray-100">
              <IoClose size={24} />
            </button>

          </div>
        )}
      </div>


      <div className="flex flex-col">
        {isFullPage && (
          <div className="px-4 py-4 flex flex-col gap-6">
            {/* <div className="flex flex-col gap-2">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white">Make And Model</h3>
               <div className="relative">
                 <input 
                    type="text" 
                    placeholder="Search Make, Model, or Trim" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                    onChange={(e) => {
                         const params = queryString.parse(search, { arrayFormat: 'bracket' });
                         params.title = e.target.value;
                         history.push({ search: queryString.stringify(params, { arrayFormat: 'bracket' }) });
                    }}
                    value={parsed.title || ""}
                 />
               </div>
            </div> */}
          </div>
        )}

        {/* Core Filters */}

        {/* {!hiddenGatogry && (
          <FilterBlock title={selectedContent[localizationKeys.category]} defaultExpanded={true}>
            <MultiButtonFilter values={GatogryOptions} name="categories" isMultiSelect={true} myRef={myRef} subCategories={SubGatogryOptions} variant="checkbox" />
          </FilterBlock>
        )} */}

        {isCars && (
          <FilterBlock
            title={selectedContent[localizationKeys.brand]}
            defaultExpanded={true}
          >
            <MultiButtonFilter
              values={categoryId ? brandOptions : allBrands}
              name="brands"
              isMultiSelect={true}
              myRef={myRef}
            />
          </FilterBlock>
        )}

        <FilterBlock
          title={selectedContent[localizationKeys.condition]}
          defaultExpanded={false}
        >
          <MultiButtonFilter
            name="usageStatus"
            values={[
              { name: selectedContent[localizationKeys.new], value: "NEW" },
              { name: selectedContent[localizationKeys.used], value: "USED" },
            ]}
            isMultiSelect={false}
            myRef={myRef}
            variant="button"
          />
        </FilterBlock>

        <FilterBlock
          title={selectedContent[localizationKeys.price]}
          isPadding={isFullPage ? false : true}
          defaultExpanded={true}
        >
          <div
            className={isFullPage ? "px-4 pb-4 w-full max-w-3xl mx-auto" : ""}
          >
            <RangeInput className="" myRef={myRef} isFullPage={isFullPage} />
          </div>
        </FilterBlock>

        {/* Dynamic Category Specific Filters */}
        {isCars && <CarsFilterSections lang={lang} myRef={myRef} />}
        {isProperties && <PropertiesFilterSections lang={lang} myRef={myRef} />}
      </div>
    </motion.div>
  );
};

export default FilterSections;
