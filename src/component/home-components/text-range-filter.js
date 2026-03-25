import React from 'react';
import { useDebouncedCallback } from "use-debounce";
import useFilter from "../../hooks/use-filter";

const TextRangeFilter = ({ minKey, maxKey, placeholderMin, placeholderMax, myRef, lang }) => {
  const [minVal, setMinVal] = useFilter(minKey, "");
  const [maxVal, setMaxVal] = useFilter(maxKey, "");
  
  const debouncedMin = useDebouncedCallback((val) => {
    setMinVal(val);
    window.scrollTo({ behavior: "smooth", top: myRef?.current?.offsetTop });
  }, 850);
  
  const debouncedMax = useDebouncedCallback((val) => {
    setMaxVal(val);
    window.scrollTo({ behavior: "smooth", top: myRef?.current?.offsetTop });
  }, 850);
  
  return (
    <div className="flex items-center justify-between gap-3 px-4 pb-4">
      <div className="flex-1">
        <label className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1 block uppercase">{lang === "ar" ? "من" : "From"}</label>
        <input type="number" defaultValue={minVal} onChange={(e) => debouncedMin(e.target.value)} className="w-full px-4 py-2 text-[13px] text-gray-700 bg-white border border-gray-200 dark:border-[#d4af37]/40 dark:bg-primary-dark dark:text-white rounded-lg focus:outline-none focus:border-[#d4af37]" placeholder={placeholderMin} />
      </div>
      <div className="flex-1">
        <label className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1 block uppercase">{lang === "ar" ? "إلى" : "Up to"}</label>
        <input type="number" defaultValue={maxVal} onChange={(e) => debouncedMax(e.target.value)} className="w-full px-4 py-2 text-[13px] text-gray-700 bg-white border border-gray-200 dark:border-[#d4af37]/40 dark:bg-primary-dark dark:text-white rounded-lg focus:outline-none focus:border-[#d4af37]" placeholder={placeholderMax} />
      </div>
    </div>
  );
};

export default TextRangeFilter;
