import React from "react";
import useFilter from "../../../hooks/use-filter";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import DropdownButtonFilter from "./dropdown-button-filter";

const removeFromArray = (arr, v) => arr.filter((a) => a !== v);

const MultiButtonFilter = ({ name, values = [], myRef, isMultiSelect = true ,subCategories}) => {
  const [filter, setFilter] = useFilter(name, isMultiSelect ? [] : "");
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  
  // Ensure values is always an array
  const filterValues = Array.isArray(values) ? values : [];
  

  const handleClick = (value) => {
    if (isMultiSelect) {
      const currentFilter = Array.isArray(filter) ? filter : [];
      if(name ==='categories' && !currentFilter.includes(value) ){
         currentFilter.length = 0
      }


      const newFilter = currentFilter.includes(value)
        ? removeFromArray(currentFilter, value)
        : [...currentFilter, value];
      setFilter(newFilter);
    } else {
      setFilter(filter === value ? "" : value);
    }
    window.scrollTo({
      behavior: "smooth",
      top: myRef?.current?.offsetTop,
    });
  };

  const isSelected = (value) => {
    if (isMultiSelect) {
      const currentFilter = Array.isArray(filter) ? filter : [];
      return currentFilter.includes(value);
    }
    return filter === value;
  };

  return (
    <div className="mb-4">
      <h4 className="text-md font-semibold text-gray-900 mb-3">
        {selectedContent[localizationKeys.selectOptions]}
      </h4>
      <div className="flex flex-col space-y-2 max-h-[350px] overflow-y-auto pr-2">
        {filterValues.map((v, index) => (
          <React.Fragment key={index}>
            <div 
              onClick={() => handleClick(v?.value.toString())}
              className={`flex items-center p-3 cursor-pointer rounded-lg transition-all duration-200 ease-in-out
                ${
                  isSelected(v?.value.toString())
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-dark border border-gray-300 hover:bg-gray-50 hover:border-primary"
                }`}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center relative
                  ${isSelected(v?.value.toString()) 
                    ? "border-white" 
                    : "border-gray-400"
                  }`}
                >
                  {isSelected(v?.value.toString()) && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="font-medium">{v?.name || ''}</span>
              </div>
            </div>
            {isSelected(v?.value.toString()) && subCategories?.length > 0 && (
              <div className="ml-6">
                <DropdownButtonFilter 
                  myRef={myRef}
                  values={subCategories}
                  name='subCategory'
                  isMultiSelect={true}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
    </div>
  );
};

export default MultiButtonFilter;
