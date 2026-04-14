import React from "react";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const TotalMyProducts = ({
  inProgressProducts,
  outOfStockProducts,
  soldOutProducts,
  draftProducts,
  handleStartListing,
}) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];


  return (
    <div className="flex flex-col gap-6 w-full pb-4 p-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 ">
            {selectedContent[localizationKeys.AllMyProducts] }
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">
            {selectedContent[localizationKeys.AllMyProductsDescription]}
          </p>
        </div>
        <button
          onClick={handleStartListing}
          className="flex items-center gap-2 bg-[#FDC02A] hover:bg-[#FDC02A]/90 text-gray-900 px-6 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {selectedContent[localizationKeys.startLisitng]}
        </button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Drafts Card */}
        <div className="bg-white dark:bg-[#151A23] border border-gray-100 dark:border-gray-800 rounded-xl p-6 flex flex-col justify-between shadow-sm h-40">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {selectedContent[localizationKeys.drafts]}
            </span>
            <div className="text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {draftProducts || 0}
            </div>
            <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 dark:bg-gray-500 rounded-full"
                style={{ width: draftProducts > 0 ? "33%" : "0%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* In Progress Card */}
        <div className="bg-white dark:bg-[#151A23] border border-gray-100 dark:border-gray-800 rounded-xl p-6 flex flex-col justify-between shadow-sm h-40">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {selectedContent[localizationKeys.inProgress]}
            </span>
            <div className="text-[#FDC02A]">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {inProgressProducts || 0}
            </div>
            <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FDC02A] rounded-full"
                style={{ width: inProgressProducts > 0 ? "33%" : "0%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Out of Stock Card */}
        <div className="bg-white dark:bg-[#151A23] border border-gray-100 dark:border-gray-800 rounded-xl p-6 flex flex-col justify-between shadow-sm h-40">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {selectedContent[localizationKeys.outOfStock]}
            </span>
            <div className="text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {outOfStockProducts || 0}
            </div>
            <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-300 dark:bg-gray-600 rounded-full"
                style={{ width: outOfStockProducts > 0 ? "33%" : "0%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Sold Out Card */}
        <div className="bg-white dark:bg-[#151A23] border border-gray-100 dark:border-gray-800 rounded-xl p-6 flex flex-col justify-between shadow-sm h-40">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {selectedContent[localizationKeys.soldOut]}
            </span>
            <div className="text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {soldOutProducts || 0}
            </div>
            <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-300 dark:bg-gray-600 rounded-full"
                style={{ width: soldOutProducts > 0 ? "33%" : "0%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalMyProducts;
