import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { useLanguage } from '../../context/language-context';

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
  const { AllCitiesOptions } = useGetAllCities(1); 

  const [activeModal, setActiveModal] = useState(null);


  const filterOptions = [
    { id: 'emirate', label: lang === 'ar' ? 'الإمارة' : 'Emirate' },
    { id: 'year', label: lang === 'ar' ? 'السنة' : 'Year' },
    { id: 'price', label: lang === 'ar' ? 'السعر' : 'Price Range' },
    { id: 'kilometers', label: lang === 'ar' ? 'الكيلومترات' : 'Kilometers' },
    { id: 'regionalSpecs', label: lang === 'ar' ? 'المواصفات الإقليمية' : 'Regional Specs' },
    { id: 'transmissionType', label: lang === 'ar' ? 'ناقل الحركة' : 'Transmission' },
    { id: 'carType', label: lang === 'ar' ? 'نوع السيارة' : 'Body Type' },
    { id: 'fuelType', label: lang === 'ar' ? 'نوع الوقود' : 'Fuel Type' }
  ];





  const history = useHistory();

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

  const emirateOptions = getFilterOptions("emirate");


  return (
    <div className="md:hidden w-full bg-white dark:bg-background border-b border-gray-100 dark:border-gray-800 z-30">

      <div className="flex items-center overflow-x-auto scrollbar-hide py-3 px-4 gap-2">
        {/* Full Filters Button */}
        <button
          onClick={onOpenFullFilters}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-900 shadow-sm whitespace-nowrap flex-shrink-0"
        >
           <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 xs:h-6 xs:w-6 text-primary dark:text-primary-veryLight"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {selectedContent[localizationKeys.filter]}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary dark:text-primary-veryLight">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

        </button>

        <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1 flex-shrink-0"></div>

        {/* Dynamic Filter Buttons */}
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleOpenModal(opt.id)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-900 shadow-sm whitespace-nowrap flex-shrink-0"
          >
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {opt.label}
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary dark:text-[#7484a0]">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

          </button>
        ))}
      </div>

      {/* Modals */}
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


        {/* Add more as needed */}

      </MobileFilterModal>
    </div>
  );
};

export default MobileFilterBar;
