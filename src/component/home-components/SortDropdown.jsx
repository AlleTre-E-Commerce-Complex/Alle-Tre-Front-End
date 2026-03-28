import React from "react";
import { Dropdown } from "semantic-ui-react";
import { HiSelector } from "react-icons/hi";
import { useHistory, useLocation } from "react-router-dom";
import localizationKeys from "../../localization/localization-keys";
import { DEFAULT_PAGE } from "../../constants/pagination";
import useGetGatogry from "../../hooks/use-get-category";

const SortDropdown = ({ lang, selectedContent, categoryId }) => {
  const history = useHistory();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const { GatogryOptions } = useGetGatogry();

  const selectedCategoryObj = GatogryOptions?.find(
    (c) => c.value?.toString() === categoryId?.toString(),
  );
  const selectedCategoryName = selectedCategoryObj
    ? selectedCategoryObj.name.toLowerCase()
    : "";

  const isCar = parseInt(categoryId) === 4;
  const isProperties =
    selectedCategoryName.includes("prop") ||
    selectedCategoryName.includes("real estate") ||
    selectedCategoryName.includes("عقار");

  const sortOptions = [
    {
      key: "newestToOldest",
      text: selectedContent[localizationKeys.newestToOldest],
      value: "createdAt_desc",
    },
    {
      key: "oldestToNewest",
      text: selectedContent[localizationKeys.oldestToNewest],
      value: "createdAt_asc",
    },
    {
      key: "priceHighestToLowest",
      text: selectedContent[localizationKeys.priceHighestToLowest],
      value: "price_desc",
    },
    {
      key: "priceLowestToHighest",
      text: selectedContent[localizationKeys.priceLowestToHighest],
      value: "price_asc",
    },
    // Car specific options
    ...(isCar ? [
      {
        key: "kilometersHighestToLowest",
        text: selectedContent[localizationKeys.kilometersHighestToLowest],
        value: "kilometer_desc",
      },
      {
        key: "kilometersLowestToHighest",
        text: selectedContent[localizationKeys.kilometersLowestToHighest],
        value: "kilometer_asc",
      },
      {
        key: "yearHighestToLowest",
        text: selectedContent[localizationKeys.yearHighestToLowest],
        value: "year_desc",
      },
      {
        key: "yearLowestToHighest",
        text: selectedContent[localizationKeys.yearLowestToHighest],
        value: "year_asc",
      },
    ] : []),
    // Property specific options
    ...(isProperties ? [
      {
        key: "areaHighestToLowest",
        text: selectedContent[localizationKeys.areaHighestToLowest],
        value: "area_desc",
      },
      {
        key: "areaLowestToHighest",
        text: selectedContent[localizationKeys.areaLowestToHighest],
        value: "area_asc",
      },
    ] : [])
  ];

  const handleSortChange = (e, { value }) => {
    const [sortBy, sortOrder] = value.split("_");
    const queryParams = new URLSearchParams(search);
    queryParams.set("sortBy", sortBy);
    queryParams.set("sortOrder", sortOrder);
    queryParams.set("productPage", DEFAULT_PAGE);
    history.push({ search: queryParams.toString() });
  };

  const currentSortValue = `${queryParams.get("sortBy") || "createdAt"}_${queryParams.get("sortOrder") || "desc"}`;

  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 h-[42px] cursor-pointer bg-white dark:bg-[#1b2331] hover:border-gray-300 transition-all font-sansEN">
          <HiSelector className="text-gray-500 w-4 h-4" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {selectedContent[localizationKeys.sort]}:{" "}
            <span className="font-bold">
              {sortOptions.find((o) => o.value === currentSortValue)?.text ||
                selectedContent[localizationKeys.popular]}
            </span>
          </span>
        </div>
      }
      icon={null}
      direction={lang === "ar" ? "left" : "right"}
    >
      <Dropdown.Menu className="dark:bg-[#1b2331] dark:border-gray-700 !min-w-max !max-h-none !overflow-visible !z-[1000]">
        {sortOptions.map((option) => (
          <Dropdown.Item
            key={option.key}
            text={option.text}
            value={option.value}
            active={currentSortValue === option.value}
            onClick={() => handleSortChange(null, { value: option.value })}
            className={`dark:text-white dark:hover:bg-gray-700 ltr:border-l-2 rtl:border-r-2 ${
              currentSortValue === option.value
                ? "!font-bold border-primary bg-gray-50 dark:bg-gray-800"
                : "border-transparent"
            } transition-all`}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SortDropdown;
