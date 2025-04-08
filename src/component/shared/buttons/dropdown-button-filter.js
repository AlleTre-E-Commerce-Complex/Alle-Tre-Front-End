import React from "react";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import useFilter from "../../../hooks/use-filter";
import useGetSubGatogry from "../../../hooks/use-get-sub-category";
import { motion, AnimatePresence } from "framer-motion";

const removeFromArray = (arr, v) => arr.filter((a) => a !== v);

const DropdownButtonFilter = ({ name, values = [], myRef, isMultiSelect = true }) => {
  const [filter, setFilter] = useFilter(name, isMultiSelect ? [] : "");
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  // Get subcategories for the selected category
  const selectedCategoryId = filter.length >= 1 ? filter[filter.length - 1] : null;
  const { SubGatogryOptions } = useGetSubGatogry(selectedCategoryId);

  // Ensure values is always an array
  const filterValues = Array.isArray(values) ? values : [];

  const handleClick = (value) => {
    if (isMultiSelect) {
      const currentFilter = Array.isArray(filter) ? filter : [];
      if (name === 'categories' && !currentFilter.includes(value)) {
        currentFilter.length = 0;
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

  // Create a combined array of categories and subcategories
  const combinedItems = filterValues.reduce((acc, category, index) => {
    // Add the category
    acc.push({
      ...category,
      isCategory: true,
      index
    });

    // If this category is selected, add its subcategories right after it
    if (isSelected(category?.value?.toString()) && SubGatogryOptions?.length > 0) {
      acc.push(...SubGatogryOptions.map(sub => ({
        ...sub,
        isSubCategory: true,
        parentIndex: index
      })));
    }

    return acc;
  }, []);

  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        {selectedContent[localizationKeys.selectSubCategory]}
      </h4>
      <div className="flex flex-col space-y-2 max-h-[350px] overflow-y-auto pr-2">
        <AnimatePresence>
          {combinedItems.map((item, index) => (
            <motion.div
              key={item.isSubCategory ? `sub-${item.value}-${item.parentIndex}` : `cat-${item.value}-${item.index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div 
                onClick={() => handleClick(item?.value?.toString())}
                className={`flex items-center ${item.isSubCategory ? 'pl-8' : 'pl-4'} p-3 cursor-pointer rounded-lg transition-all duration-200 ease-in-out
                  ${
                    isSelected(item?.value?.toString())
                      ? `bg-primary ${item.isSubCategory ? 'bg-opacity-90' : ''} text-white shadow-md`
                      : `bg-white text-gray-dark border ${item.isSubCategory ? 'border-gray-200' : 'border-gray-300'} hover:bg-gray-50 hover:border-primary`
                  }`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`${item.isSubCategory ? 'w-3.5 h-3.5' : 'w-4 h-4'} rounded-full border-2 flex items-center justify-center relative
                    ${isSelected(item?.value?.toString()) 
                      ? "border-white" 
                      : "border-gray-400"
                    }`}
                  >
                    {isSelected(item?.value?.toString()) && (
                      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${item.isSubCategory ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full bg-white`} />
                    )}
                  </div>
                  <span className={`font-medium ${item.isSubCategory ? 'text-sm' : ''}`}>
                    {item?.text || item?.name || ""}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DropdownButtonFilter;
