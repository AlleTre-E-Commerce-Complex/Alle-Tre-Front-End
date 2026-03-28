import React, { useState } from "react";
import { Modal, Icon } from "semantic-ui-react";
import { HiSelector, HiHeart } from "react-icons/hi";
import { useHistory, useLocation } from "react-router-dom";
import localizationKeys from "../../localization/localization-keys";
import { DEFAULT_PAGE } from "../../constants/pagination";
import useGetGatogry from "../../hooks/use-get-category";
import routes from "routes";

const MobileSortToggle = ({ lang, selectedContent, categoryId }) => {
  const [open, setOpen] = useState(false);
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

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split("_");
    const queryParams = new URLSearchParams(search);
    queryParams.set("sortBy", sortBy);
    queryParams.set("sortOrder", sortOrder);
    queryParams.set("productPage", DEFAULT_PAGE);
    history.push({ search: queryParams.toString() });
    setOpen(false);
  };

  const currentSortValue = `${queryParams.get("sortBy") || "createdAt"}_${queryParams.get("sortOrder") || "desc"}`;

  return (
    <>
      {/* Mobile Bar: Sort | Save (Fixed Bottom Center) - Vice Versa Theme */}
      <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[40] flex items-center bg-[#1b2331] dark:bg-white border border-gray-700 dark:border-gray-200 rounded-xl overflow-hidden shadow-2xl h-[38px] min-w-[150px]">
        <button
          onClick={() => setOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 hover:bg-gray-800 dark:hover:bg-gray-50 transition-all border-r border-gray-700/50 dark:border-gray-100 h-full"
        >
          <HiSelector className="text-white dark:text-gray-900 w-4 h-4 shrink-0" />
          <span className="text-[13px] font-bold leading-none text-white dark:text-gray-900 whitespace-nowrap">
            {selectedContent[localizationKeys.sort]}
          </span>
        </button>
        <button
          onClick={() => history.push(routes.app.profile.watchlist)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 hover:bg-gray-800 dark:hover:bg-gray-50 transition-all h-full"
        >
          <HiHeart className="text-white dark:text-gray-900 w-4 h-4 shrink-0" />
          <span className="text-[13px] font-bold leading-none text-white dark:text-gray-900 whitespace-nowrap">
            {selectedContent[localizationKeys.saved]}
          </span>
        </button>
      </div>

      {/* Sort Results Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="tiny"
        className="!fixed !bottom-0 !left-0 !right-0 !top-auto !m-0 !w-full !max-w-none !rounded-t-2xl !rounded-b-none md:!relative md:!top-auto md:!m-auto md:!w-[450px] md:!rounded-xl animate-slide-up"
        style={{
          width: window.innerWidth < 768 ? '100%' : '450px',
          maxWidth: 'none',
          margin: window.innerWidth < 768 ? '0' : 'auto',
          borderRadius: window.innerWidth < 768 ? '1.5rem 1.5rem 0 0' : '0.75rem',
          backgroundColor: 'transparent' // Semantic UI Modal fix
        }}
      >
        <div className="bg-white dark:bg-[#1b2331] p-5 pb-8">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedContent[localizationKeys.sortResults] || "Sort Results"}
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
            >
              <Icon name="close" size="large" className="!m-0 text-gray-900 dark:text-white" />
            </button>
          </div>

          <div className="flex flex-col px-2">
            {sortOptions.map((option, index) => (
              <React.Fragment key={option.key}>
                <button
                  onClick={() => handleSortChange(option.value)}
                  className={`py-4 text-left text-[15px] transition-all ${
                    currentSortValue === option.value
                      ? "font-bold text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {option.text}
                </button>
                {index < sortOptions.length - 1 && (
                  <div className="border-b border-gray-100 dark:border-gray-800/50" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Modal>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default MobileSortToggle;
