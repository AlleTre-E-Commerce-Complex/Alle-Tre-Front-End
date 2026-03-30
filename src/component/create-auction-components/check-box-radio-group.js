import React from "react";

import "../../../src/assets/style/checkbox-radio-group.css";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

export const CheckboxRadioProductDetails = ({
  valueRadio,
  setRadioValue,
  isProperty,
  categoryId,
  subCategoryId,
  isAuction,
  showError,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const isAnimal = categoryId === 7;

  if ((isAnimal && subCategoryId === 23) || (isAnimal && isAuction)) {
    return null;
  }

  const getOptionLabel = (isNew) => {
    if (isProperty || (isAnimal && subCategoryId === 22)) {
      return isNew
        ? selectedContent[localizationKeys.sell]
        : selectedContent[localizationKeys.rent];
    }
    return isNew
      ? selectedContent[localizationKeys.new]
      : selectedContent[localizationKeys.used];
  };

  const getOptionDescription = (isNew) => {
    if (isProperty) {
      return isNew
        ? selectedContent[
            localizationKeys.premiumRealEstateAvailableForExclusiveOwnership
          ]
        : selectedContent[
            localizationKeys.exceptionalPropertiesCuratedForDiscerningRenters
          ];
    }
    if (isAnimal && subCategoryId === 22) {
      return isNew
        ? selectedContent[
            localizationKeys.discoverExceptionalBreedsAndLovingCompanions
          ]
        : selectedContent[
            localizationKeys.provideAForeverHomeToARemarkableRescue
          ];
    }
    return isNew
      ? selectedContent[
          localizationKeys.pristineConditionUntouchedWithOriginalTagsOrPackaging
        ]
      : selectedContent[
          localizationKeys.preOwnedExcellenceShowingOnlyMinorToLightSignsOfWear
        ];
  };

  const options = [
    {
      value: "NEW",
      label: getOptionLabel(true),
      description: getOptionDescription(true),
    },
    {
      value: "USED",
      label: getOptionLabel(false),
      description: getOptionDescription(false),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full pb-[10px]">
      {options.map((option) => {
        const isSelected = valueRadio === option.value;
        return (
          <div
            key={option.value}
            onClick={() => setRadioValue(option.value)}
            className={`flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer border-2 transition-all duration-300 h-full ${
              isSelected
                ? "border-yellow bg-primary/5 dark:border-yellow dark:bg-yellow-200/10"
                : showError
                ? "border-red-600 bg-red-50 dark:bg-red-900/10 border-2"
                : "border-transparent bg-gray-50 dark:bg-[#1A1F2C] hover:bg-gray-100 dark:hover:bg-[#22283A]"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-2 uppercase tracking-wide ${
                isSelected ? "text-primary dark:text-yellow" : "text-gray-900 dark:text-white"
              }`}
            >
              {option.label}
            </h3>
            <p
              className={`text-sm text-center font-medium ${
                isSelected ? "text-[#2a3a54]/80 dark:text-[#d4af37]/60" : "text-[#2a3a54]/80 dark:text-gray-400/60"
              }`}
            >
              {option.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export const CheckboxRadioAuctionDetails = ({ valueRadio, setRadioValue }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  
  const options = [
    { value: "Quick Auction", label: selectedContent[localizationKeys.quickAuction], description: selectedContent[localizationKeys.maximumDurationMustBeDay] },
    { value: "Long Auction", label: selectedContent[localizationKeys.longAuction], description: selectedContent[localizationKeys.durationMoreThanOneDayFromStartingDate] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full pb-[10px]">
      {options.map((option) => {
        const isSelected = valueRadio === option.value;
        return (
          <div
            key={option.value}
            onClick={() => setRadioValue(option.value)}
            className={`flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer border-2 transition-all duration-300 h-full ${
              isSelected
                ? "border-primary bg-primary/5 dark:border-yellow dark:bg-[#1A2538]"
                : "border-transparent bg-gray-50 dark:bg-[#1A1F2C] hover:bg-gray-100 dark:hover:bg-[#22283A]"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-2 uppercase tracking-wide ${
                isSelected ? "text-primary dark:text-yellow" : "text-gray-900 dark:text-white"
              }`}
            >
              {option.label}
            </h3>
            <p
              className={`text-sm text-center ${
                isSelected ? "text-primary/80 dark:text-yellow/80" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {option.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
