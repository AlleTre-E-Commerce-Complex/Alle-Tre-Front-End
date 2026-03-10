import React from "react";
import useFilter from "../../../hooks/use-filter";
import DropdownButtonFilter from "./dropdown-button-filter";

const removeFromArray = (arr, v) => arr.filter((a) => a !== v);

const MultiButtonFilter = ({
  name,
  values = [],
  myRef,
  isMultiSelect = true,
  subCategories,
  variant = "checkbox",
}) => {
  const [filter, setFilter] = useFilter(name, isMultiSelect ? [] : "");

  // Ensure values is always an array
  const filterValues = Array.isArray(values) ? values : [];

  const handleClick = (value) => {
    if (isMultiSelect) {
      const currentFilter = Array.isArray(filter) ? filter : [];
      if (name === "categories" && !currentFilter.includes(value)) {
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

  return (
    <div className="w-full">
      <div
        className={
          variant === "button"
            ? "flex flex-wrap gap-2 mt-2"
            : "flex flex-col space-y-3 max-h-[350px] overflow-y-auto pr-2"
        }
      >
        {filterValues.map((v, index) => {
          const selected = isSelected(v?.value.toString());

          if (variant === "button") {
            return (
              <button
                key={index}
                onClick={() => handleClick(v?.value.toString())}
                className={`px-4 py-2 text-[11px] font-bold tracking-wider rounded transition-colors duration-200 uppercase
                  ${
                    selected
                      ? "border border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10"
                      : "border border-gray-200 dark:border-gray-700 text-[#1e2738] dark:text-gray-300 hover:border-gray-300"
                  }
                `}
              >
                {v?.name || ""}
              </button>
            );
          }

          return (
            <React.Fragment key={index}>
              <div
                onClick={() => handleClick(v?.value.toString())}
                className="flex items-center space-x-3 cursor-pointer group py-1"
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-200 shrink-0
                  ${
                    selected
                      ? "bg-[#d4af37] border-[#d4af37]"
                      : "border-gray-500 dark:border-gray-400 group-hover:border-[#d4af37] bg-white dark:bg-transparent"
                  }`}
                >
                  {selected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-[15px] transition-colors font-serifEN tracking-wide ${selected ? "text-[#1e2738] dark:text-white" : "text-[#1e2738]/90 dark:text-gray-300 group-hover:text-[#1e2738] dark:group-hover:text-white"}`}
                >
                  {v?.name || ""}
                </span>
              </div>
              {selected && subCategories?.length > 0 && (
                <div className="ml-7 mt-1">
                  <DropdownButtonFilter
                    myRef={myRef}
                    values={subCategories}
                    name="subCategory"
                    isMultiSelect={true}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default MultiButtonFilter;
