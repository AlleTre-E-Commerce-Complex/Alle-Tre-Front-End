import React, { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { useLanguage } from '../../context/language-context';
import useGetGatogry from '../../hooks/use-get-category';

import content from '../../localization/content';
import localizationKeys from '../../localization/localization-keys';

import MobileFilterModal from './mobile-filter-modal';
import RangeInput from './range-input';
import TextRangeFilter from './text-range-filter';
import MultiButtonFilter from '../shared/buttons/multi-button-filter';
import useGetAllCities from '../../hooks/use-get-all-cities';
import { allCustomFileOptions } from '../../utils/all-custom-fields-options';




const MobileFilterBar = ({ onOpenFullFilters }) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const history = useHistory();
  const { AllCitiesOptions } = useGetAllCities(1); 
  const { GatogryOptions } = useGetGatogry();
  const { search } = useLocation();
  const { categoryId } = useParams();

  const [activeModal, setActiveModal] = useState(null);

  // Identify Active Category (Logic synced with filter-sections.js)
  const parsedSearch = queryString.parse(search, { arrayFormat: "bracket" });
  const categoriesFromSearch = parsedSearch?.categories || [];
  const category_Id = categoriesFromSearch.length >= 1 ? categoriesFromSearch[categoriesFromSearch.length - 1] : null;
  const activeCategoryId = categoryId || category_Id;

  const selectedCategoryObj = GatogryOptions?.find(
    (c) => c.value?.toString() === activeCategoryId?.toString()
  );
  const selectedCategoryName = selectedCategoryObj ? selectedCategoryObj.name.toLowerCase() : "";

  const isProperties = selectedCategoryName.includes("prop") || selectedCategoryName.includes("real estate") || selectedCategoryName.includes("عقار");

  // Define Filter Sets
  const carFilters = [
    { id: 'emirate', label: lang === 'ar' ? 'الإمارة' : 'Emirate' },
    { id: 'year', label: lang === 'ar' ? 'السنة' : 'Year' },
    { id: 'price', label: lang === 'ar' ? 'السعر' : 'Price Range' },
    { id: 'kilometers', label: lang === 'ar' ? 'الكيلومترات' : 'Kilometers' },
    { id: 'regionalSpecs', label: lang === 'ar' ? 'المواصفات الإقليمية' : 'Regional Specs' },
    { id: 'transmissionType', label: lang === 'ar' ? 'ناقل الحركة' : 'Transmission' },
    { id: 'carType', label: lang === 'ar' ? 'نوع السيارة' : 'Body Type' },
    { id: 'fuelType', label: lang === 'ar' ? 'نوع الوقود' : 'Fuel Type' }
  ];

  const propertyFilters = [
    { id: 'emirate', label: lang === 'ar' ? 'الإمارة' : 'Emirate' },
    { id: 'price', label: lang === 'ar' ? 'السعر' : 'Price' },
    { id: 'bedrooms', label: lang === 'ar' ? 'غرف النوم' : 'Bedrooms' },
    { id: 'bathrooms', label: lang === 'ar' ? 'الحمامات' : 'Baths' },
    { id: 'sqft', label: lang === 'ar' ? 'المساحة' : 'Size (Sqft)' },
    { id: 'propertyType', label: lang === 'ar' ? 'نوع العقار' : 'Property Type' },
    { id: 'furnished', label: lang === 'ar' ? 'مفروش' : 'Furnished' },
    { id: 'amenities', label: lang === 'ar' ? 'وسائل الراحة' : 'Amenities' }
  ];

  const filterOptions = isProperties ? propertyFilters : carFilters;

  const handleOpenModal = (id) => {
    setActiveModal(id);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleClearFilter = () => {
    if (!activeModal) return;

    const parsed = queryString.parse(window.location.search, { arrayFormat: "bracket" });
    
    if (activeModal === 'year') {
      delete parsed.minYear;
      delete parsed.maxYear;
    } else if (activeModal === 'price') {
      delete parsed.priceFrom;
      delete parsed.priceTo;
    } else if (activeModal === 'kilometers') {
      delete parsed.minKilometer;
      delete parsed.maxKilometer;
    } else if (activeModal === 'sqft') {
      delete parsed.minSqft;
      delete parsed.maxSqft;
    } else if (activeModal === 'city') {
      delete parsed.cityId;
    } else {
      delete parsed[activeModal];
    }

    history.replace(`?${queryString.stringify(parsed, { arrayFormat: "bracket" })}`);
    handleCloseModal();
  };

  const getFilterOptions = (key) => {
    return allCustomFileOptions[key]?.map(opt => {
      const parts = opt.text.split(" | ");
      return { name: lang === "ar" ? (parts.length > 1 ? parts[1] : parts[0]) : parts[0], value: opt.value };
    }) || [];
  };

  const mapLocalOptions = (opts) => opts.map(opt => {
    const parts = opt.name.split(" | ");
    return { name: lang === "ar" ? (parts.length > 1 ? parts[1] : parts[0]) : parts[0], value: opt.value };
  });

  const bedroomsOptions = mapLocalOptions([
    { value: "studio", name: "Studio | استوديو" },
    ...Array.from({ length: 11 }, (_, i) => ({ value: `${i + 1}`, name: `${i + 1}` })),
    { value: "12+", name: "12+" },
  ]);

  const bathroomsOptions = mapLocalOptions([
    ...Array.from({ length: 11 }, (_, i) => ({ value: `${i + 1}`, name: `${i + 1}` })),
    { value: "12+", name: "12+" },
  ]);

  const furnishedOptions = mapLocalOptions([
    { value: "furnished", name: "Furnished | مفروش" },
    { value: "unfurnished", name: "Unfurnished | غير مفروش" },
  ]);

  const emirateOptions = getFilterOptions("emirate");

  return (
    <>
      <div className="md:hidden w-full bg-transparent backdrop-blur-md z-30 sticky top-0 transition-all duration-300">
        <div className="flex items-center overflow-x-auto scrollbar-hide py-3.5 px-4 gap-2.5">
          {/* Full Filters Button */}
          <button
            onClick={onOpenFullFilters}
            className="flex items-center gap-2 px-4 py-2 border border-[#d4af37]/30 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-sm backdrop-blur-sm whitespace-nowrap flex-shrink-0 transition-all active:scale-95 hover:bg-white"
          >
            <div className="bg-[#d4af37] p-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight">
              {selectedContent[localizationKeys.filter]}
            </span>
          </button>

          <div className="h-6 w-[1.5px] bg-gray-300/50 dark:bg-gray-700/50 mx-0.5 flex-shrink-0"></div>

          {/* Dynamic Filter Buttons */}
          {filterOptions.map((opt) => {
            const parsed = queryString.parse(window.location.search, { arrayFormat: "bracket" });
            const isActive = opt.id === 'year' ? (parsed.minYear || parsed.maxYear) :
                            opt.id === 'price' ? (parsed.priceFrom || parsed.priceTo) :
                            opt.id === 'kilometers' ? (parsed.minKilometer || parsed.maxKilometer) :
                            opt.id === 'sqft' ? (parsed.minSqft || parsed.maxSqft) :
                            opt.id === 'city' ? parsed.cityId : 
                            parsed[opt.id];

            return (
              <button
                key={opt.id}
                onClick={() => handleOpenModal(opt.id)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-full shadow-sm whitespace-nowrap flex-shrink-0 transition-all duration-300 active:scale-95
                  ${isActive 
                    ? 'border-[#d4af37] bg-white dark:bg-gray-800 text-[#d4af37] ring-2 ring-[#d4af37]/10' 
                    : 'border-white/50 bg-white/60 dark:bg-gray-900/60 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 backdrop-blur-sm'
                  }`}
              >
                <span className={`text-[13px] font-medium ${isActive ? 'font-bold' : ''}`}>
                  {opt.label}
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" 
                    className={`${isActive ? 'text-primary-dark dark:text-primary-light' : 'text-primary-dark dark:text-primary-light'} transition-colors`}>
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals - Moved outside the sticky container */}
      <MobileFilterModal
        isOpen={activeModal !== null}
        onClose={handleCloseModal}
        onClear={handleClearFilter}
        title={filterOptions.find(o => o.id === activeModal)?.label}
      >
        {activeModal === 'price' && (
          <div className="p-4">
            <RangeInput isFullPage={true} />
          </div>
        )}
        {activeModal === 'year' && (
          <div className="p-4">
              <TextRangeFilter minKey="minYear" maxKey="maxYear" placeholderMin="1950" placeholderMax="2025" lang={lang} />
          </div>
        )}
        {activeModal === 'kilometers' && (
          <div className="p-4">
              <TextRangeFilter minKey="minKilometer" maxKey="maxKilometer" placeholderMin="0" placeholderMax="Any" lang={lang} />
          </div>
        )}
        {activeModal === 'sqft' && (
          <div className="p-4">
              <TextRangeFilter minKey="minSqft" maxKey="maxSqft" placeholderMin="0" placeholderMax="Any" lang={lang} />
          </div>
        )}
        {activeModal === 'emirate' && (
          <div className="p-4">
            <MultiButtonFilter name="emirate" values={emirateOptions} isMultiSelect={true} variant="button" />
          </div>
        )}
        {activeModal === 'city' && (
          <div className="p-4">
            <MultiButtonFilter name="cityId" values={AllCitiesOptions} isMultiSelect={false} variant="button" />
          </div>
        )}
        {activeModal === 'regionalSpecs' && (
          <div className="p-4">
            <MultiButtonFilter name="regionalSpecs" values={getFilterOptions("regionalSpecs")} isMultiSelect={true} variant="button" />
          </div>
        )}
        {activeModal === 'transmissionType' && (
          <div className="p-4">
            <MultiButtonFilter name="transmissionType" values={getFilterOptions("transmissionType")} isMultiSelect={true} variant="button" />
          </div>
        )}
        {activeModal === 'carType' && (
          <div className="p-4">
            <MultiButtonFilter name="carType" values={getFilterOptions("carType")} isMultiSelect={true} variant="button" />
          </div>
        )}
        {activeModal === 'fuelType' && (
          <div className="p-4">
            <MultiButtonFilter name="fuelType" values={getFilterOptions("fuelType")} isMultiSelect={true} variant="button" />
          </div>
        )}
        {/* Properties Specific Modals */}
        {activeModal === 'bedrooms' && (
          <div className="p-4">
            <MultiButtonFilter name="bedrooms" values={bedroomsOptions} isMultiSelect={true} variant="button" />
          </div>
        )}
        {activeModal === 'bathrooms' && (
          <div className="p-4">
            <MultiButtonFilter name="bathrooms" values={bathroomsOptions} isMultiSelect={true} variant="button" />
          </div>
        )}
        {activeModal === 'furnished' && (
          <div className="p-4">
            <MultiButtonFilter name="furnished" values={furnishedOptions} isMultiSelect={true} variant="button" />
          </div>
        )}
        {activeModal === 'propertyType' && (
          <div className="p-4">
            <MultiButtonFilter name="propertyType" values={getFilterOptions("propertyType")} isMultiSelect={true} variant="button" />
          </div>
        )}
        {activeModal === 'amenities' && (
          <div className="p-4">
            <MultiButtonFilter name="amenities" values={getFilterOptions("amenities")} isMultiSelect={true} variant="button" />
          </div>
        )}
      </MobileFilterModal>
    </>
  );
};

export default MobileFilterBar;
