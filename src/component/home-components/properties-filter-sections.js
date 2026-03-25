import React from 'react';
import FilterBlock from "./filter-block";
import TextRangeFilter from "./text-range-filter";
import MultiButtonFilter from "component/shared/buttons/multi-button-filter";
import { allCustomFileOptions } from "../../utils/all-custom-fields-options";

const PropertiesFilterSections = ({ lang, myRef }) => {
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

  const bedroomsOptions = [
    { value: "studio", name: "Studio | استوديو" },
    ...Array.from({ length: 11 }, (_, i) => ({ value: `${i + 1}`, name: `${i + 1}` })),
    { value: "12+", name: "12+" },
  ];
  const bathroomsOptions = [
    ...Array.from({ length: 11 }, (_, i) => ({ value: `${i + 1}`, name: `${i + 1}` })),
    { value: "12+", name: "12+" },
  ];
  const furnishedOptions = [
    { value: "furnished", name: "Furnished | مفروش" },
    { value: "unfurnished", name: "Unfurnished | غير مفروش" },
  ];

  const propertyConfigs = [
    { id: "propertyType", label: lang === "ar" ? "نوع العقار" : "Property Type", options: getFilterOptions("propertyType") },
    { id: "amenities", label: lang === "ar" ? "وسائل الراحة" : "Amenities", options: getFilterOptions("amenities") },
    { id: "bedrooms", label: lang === "ar" ? "غرف النوم" : "Bedrooms", options: mapLocalOptions(bedroomsOptions) },
    { id: "bathrooms", label: lang === "ar" ? "الحمامات" : "Baths", options: mapLocalOptions(bathroomsOptions) },
    { id: "furnished", label: lang === "ar" ? "مفروش" : "Furnished", options: mapLocalOptions(furnishedOptions) },
  ];

  return (
    <>
      <FilterBlock title={lang === "ar" ? "المساحة (قدم مربع)" : "Area / Size (Sqft)"} isPadding={false}>
         <TextRangeFilter minKey="minSqft" maxKey="maxSqft" placeholderMin="0" placeholderMax="Any" myRef={myRef} lang={lang} />
      </FilterBlock>
      
      {propertyConfigs.map(c => (
         <FilterBlock key={c.id} title={c.label}>
            <MultiButtonFilter name={c.id} values={c.options} isMultiSelect={true} myRef={myRef} variant="button" />
         </FilterBlock>
      ))}
    </>
  );
};

export default PropertiesFilterSections;
