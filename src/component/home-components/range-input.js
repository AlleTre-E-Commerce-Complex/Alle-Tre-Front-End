import React, { useState } from "react";
import RangeSlider from "react-range-slider-input";
import { BsDashLg } from "react-icons/bs";
import "react-range-slider-input/dist/style.css";
import "./range-input.css";
import useFilter from "../../hooks/use-filter";
import { useDebouncedCallback } from "use-debounce";

const RangeInput = ({ title, myRef, isFullPage }) => {
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(1000000);
  const [, setPriceFrom] = useFilter("priceFrom", "");
  const [, setPriceTo] = useFilter("priceTo", "");

  const debouncedFrom = useDebouncedCallback((value) => {
    setPriceFrom(value.toString()); // Convert to string since backend expects string
    window.scrollTo({ behavior: "smooth", top: myRef?.current?.offsetTop });
  }, 850);

  const debouncedTo = useDebouncedCallback((value) => {
    setPriceTo(value.toString()); // Convert to string since backend expects string
    window.scrollTo({ behavior: "smooth", top: myRef?.current?.offsetTop });
  }, 850);

  const handleSliderChange = (value) => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
    debouncedFrom(value[0]);
    debouncedTo(value[1]);
  };

  const handleInputChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    if (type === "min") {
      setMinValue(numValue);
      debouncedFrom(numValue);
    } else {
      setMaxValue(numValue);
      debouncedTo(numValue);
    }
  };

  return (
    <div className="w-full">
      {/* Slider */}
      <div className="px-2 mb-6 mt-2">
        <RangeSlider
          id="range-slider-edit"
          max={1000000}
          step={100}
          value={[minValue, maxValue]}
          onInput={handleSliderChange}
          className="custom-range-slider h-2"
        />
      </div>

      {/* Input Fields */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <input
            type="number"
            value={minValue}
            onChange={(e) => handleInputChange("min", e.target.value)}
            className="w-full px-4 py-2 text-[13px] text-gray-700 bg-white border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-serifEN shadow-sm"
            placeholder="Min"
          />
        </div>
        <BsDashLg className="text-gray-400 shrink-0" />
        <div className="flex-1">
          <input
            type="number"
            value={maxValue}
            onChange={(e) => handleInputChange("max", e.target.value)}
            className="w-full px-4 py-2 text-[13px] text-gray-700 bg-white border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-serifEN shadow-sm"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
};

export default RangeInput;
