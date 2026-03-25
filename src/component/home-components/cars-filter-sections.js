import React from 'react';
import FilterBlock from "./filter-block";
import TextRangeFilter from "./text-range-filter";
import MultiButtonFilter from "component/shared/buttons/multi-button-filter";
import { allCustomFileOptions } from "../../utils/all-custom-fields-options";

const CarsFilterSections = ({ lang, myRef }) => {
  const getFilterOptions = (key) => {
    return allCustomFileOptions[key]?.map(opt => {
      const parts = opt.text.split(" | ");
      return { name: lang === "ar" ? (parts.length > 1 ? parts[1] : parts[0]) : parts[0], value: opt.value };
    }) || [];
  };

  const carConfigs = [
    { id: "emirate", label: lang === "ar" ? "الإمارة" : "Emirate", options: getFilterOptions("emirate") },
    { id: "regionalSpecs", label: lang === "ar" ? "المواصفات الإقليمية" : "Regional Specs", options: getFilterOptions("regionalSpecs") },
    { id: "bodyType", label: lang === "ar" ? "نوع الكابينة" : "Body Type", options: getFilterOptions("carType") },
    { id: "seatingCapacity", label: lang === "ar" ? "المقاعد" : "Seats", options: getFilterOptions("seatingCapacity") },
    { id: "transmissionType", label: lang === "ar" ? "نوع ناقل الحركة" : "Transmission Type", options: getFilterOptions("transmissionType") },
    { id: "fuelType", label: lang === "ar" ? "نوع الوقود" : "Fuel Type", options: getFilterOptions("fuelType") },
    { id: "exteriorColor", label: lang === "ar" ? "اللون الخارجي" : "Exterior Color", options: getFilterOptions("color") },
    { id: "interiorColor", label: lang === "ar" ? "اللون الداخلي" : "Interior Color", options: getFilterOptions("color") },
    { id: "horsepower", label: lang === "ar" ? "قوة المحرك" : "Horsepower", options: getFilterOptions("horsepower") },
    { id: "engineCapacity", label: lang === "ar" ? "سعة المحرك (cc)" : "Engine Capacity (cc)", options: getFilterOptions("engineCapacity") },
    { id: "doors", label: lang === "ar" ? "الأبواب" : "Doors", options: getFilterOptions("doors") },
    { id: "warranty", label: lang === "ar" ? "الضمان" : "Warranty", options: getFilterOptions("warranty") },
    { id: "cylinders", label: lang === "ar" ? "عدد الأسطوانات" : "Number of Cylinders", options: getFilterOptions("cylinders") },
  ];


  return (
    <>
      <FilterBlock title={lang === "ar" ? "السنة" : "Year"} isPadding={false}>
         <TextRangeFilter minKey="minYear" maxKey="maxYear" placeholderMin="1950" placeholderMax="2025" myRef={myRef} lang={lang} />
      </FilterBlock>
      <FilterBlock title={lang === "ar" ? "الكيلومترات" : "Kilometers"} isPadding={false}>
         <TextRangeFilter minKey="minKilometer" maxKey="maxKilometer" placeholderMin="0" placeholderMax="Any" myRef={myRef} lang={lang} />
      </FilterBlock>
      
      {carConfigs.map(c => (
         <FilterBlock key={c.id} title={c.label}>
            <MultiButtonFilter name={c.id} values={c.options} isMultiSelect={true} myRef={myRef} variant="button" />
         </FilterBlock>
      ))}
    </>
  );
};

export default CarsFilterSections;
