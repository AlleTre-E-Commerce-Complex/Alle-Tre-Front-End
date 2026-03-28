import React from 'react';
import FilterBlock from "./filter-block";
import TextRangeFilter from "./text-range-filter";
import MultiButtonFilter from "component/shared/buttons/multi-button-filter";
import { allCustomFileOptions } from "../../utils/all-custom-fields-options";
import { useCarData } from "../../hooks/use-car-data";
import useFilter from "../../hooks/use-filter";

const CarsFilterSections = ({ lang, myRef }) => {
  const [selectedBrand] = useFilter("brand", "");
  const [selectedModel, setSelectedModel] = useFilter("model", "");
  const { makes, models } = useCarData(selectedBrand);

  // Clear model when brand changes if current model is not found in the new models list
  React.useEffect(() => {
    if (selectedModel && models.length > 0) {
      const modelArray = Array.isArray(selectedModel) ? selectedModel : [selectedModel];
      const validModels = modelArray.filter(sm => models.some(m => m.value === sm));
      
      if (validModels.length !== modelArray.length) {
        setSelectedModel(Array.isArray(selectedModel) ? validModels : (validModels[0] || ""));
      }
    }
  }, [models, setSelectedModel, selectedModel]); // Added selectedModel back, models change when brand changes

  const getFilterOptions = (key) => {
    return allCustomFileOptions[key]?.map(opt => {
      const parts = opt.text.split(" | ");
      return { name: lang === "ar" ? (parts.length > 1 ? parts[1] : parts[0]) : parts[0], value: opt.value };
    }) || [];
  };

  const carConfigs = [
    { id: "brand", label: lang === "ar" ? "الماركة" : "Brand", options: makes.map(m => ({ name: m.text, value: m.value })) },
    { id: "model", label: lang === "ar" ? "الموديل" : "Model", options: models.map(m => ({ name: m.text, value: m.value })) },
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
      {carConfigs.slice(0, 2).map(c => (
         <FilterBlock key={c.id} title={c.label}>
            <MultiButtonFilter name={c.id} values={c.options} isMultiSelect={true} myRef={myRef} variant="button" maxHeight="250px" />
            {c.id === "model" && c.options.length === 0 && (
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 italic px-1 text-center">
                {lang === "ar" ? "اختر ماركة لعرض الموديلات" : "Select a brand to show models"}
              </p>
            )}
         </FilterBlock>
      ))}

      <FilterBlock title={lang === "ar" ? "السنة" : "Year"} isPadding={false}>
         <TextRangeFilter minKey="minYear" maxKey="maxYear" placeholderMin="1950" placeholderMax="2025" myRef={myRef} lang={lang} />
      </FilterBlock>
      <FilterBlock title={lang === "ar" ? "الكيلومترات" : "Kilometers"} isPadding={false}>
         <TextRangeFilter minKey="minKilometer" maxKey="maxKilometer" placeholderMin="0" placeholderMax="Any" myRef={myRef} lang={lang} />
      </FilterBlock>
      
      {carConfigs.slice(2).map(c => (
         <FilterBlock key={c.id} title={c.label}>
            <MultiButtonFilter name={c.id} values={c.options} isMultiSelect={true} myRef={myRef} variant="button" />
         </FilterBlock>
      ))}
    </>
  );
};

export default CarsFilterSections;
