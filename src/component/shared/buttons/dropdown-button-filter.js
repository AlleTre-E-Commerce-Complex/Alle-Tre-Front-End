import React, { useState } from "react";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import useFilter from "../../../hooks/use-filter";
import { FaChevronDown, FaCheck } from "react-icons/fa";

const removeFromArray = (arr, v) => arr.filter((a) => a !== v);

const DropdownButtonFilter = ({ name, values = [], myRef, isMultiSelect = true }) => {
  const [filter, setFilter] = useFilter(name, isMultiSelect ? [] : "");
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [isOpen, setIsOpen] = useState(false);

  // Ensure values is always an array
  const filterValues = Array.isArray(values) ? values : [];

  const handleClick = (value) => {
    if (isMultiSelect) {
      const currentFilter = Array.isArray(filter) ? filter : [];
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
    <div className="mb-4 relative">
      <h4 className="text-md font-semibold text-gray-900 mb-2">
        {selectedContent[localizationKeys.selectOptions]}
      </h4>

      {/* Dropdown Button */}
      <button
        className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 hover:border-primary focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        Select Options
        <FaChevronDown size={14} className="text-gray-500" />
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {filterValues.map((v, index) => (
            <div
              key={index}
              onClick={() => handleClick(v?.value.toString())}
              className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <span className={`text-base font-medium ${isSelected(v?.value.toString()) ? "text-primary" : "text-gray-700"}`}>
                {v?.text || ""}
              </span>
              
              {/* Show checkmark if selected */}
              {isSelected(v?.value.toString()) && <FaCheck size={14} className="text-primary" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownButtonFilter;
