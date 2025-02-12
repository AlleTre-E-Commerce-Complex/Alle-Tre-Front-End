import React from "react";
import useFilter from "../../../hooks/use-filter";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";

const removeFromArray = (arr, v) => arr.filter((a) => a !== v);

const MultiButtonFilter = ({ name, values, history, myRef }) => {
  const [filter, setFilter] = useFilter(name, []);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  return (
    <div className="mb-4 ">
      <h4 className="text-md font-semibold text-gray-900 mb-3">
        {selectedContent[localizationKeys.selectOptions]}
      </h4>
      <div className="grid grid-cols-2 gap-2 px-0.1 max-h-[350px] overflow-y-auto">
        {values.map((v, index) => (
          <div key={index} className="flex items-center justify-center">
            <p
              onClick={() => {
                setFilter(
                  filter.includes(v?.value)
                    ? removeFromArray(filter, v?.value)
                    : [...filter, v?.value]
                );
                window.scrollTo({
                  behavior: "smooth",
                  top: myRef?.current?.offsetTop,
                });
              }}
              className={`text-base font-medium p-1 cursor-pointer rounded-lg transition-all duration-200 ease-in-out
                min-w-[100px] min-h-[45px] flex justify-center items-center text-center
                ${
                  filter.includes(v?.value)
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-dark border border-gray-300 hover:border-primary hover:text-primary"
                }`}
            >
              {v?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiButtonFilter;
