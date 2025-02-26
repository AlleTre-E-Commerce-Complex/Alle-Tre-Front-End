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
  const [priceFrom, setPriceFrom] = useFilter("priceFrom", "");
  const [priceTo, setPriceTo] = useFilter("priceTo", "");
  
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
    if (type === 'min') {
      setMinValue(numValue);
      debouncedFrom(numValue);
    } else {
      setMaxValue(numValue);
      debouncedTo(numValue);
    }
  };

  return (
    <div className={`group w-full ${!isFullPage ? 'max-w-xs' : ''} p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      {/* Title */}
      <div className="flex justify-between border-b pb-3 border-gray-200">
        <h1 className="text-gray-700 text-lg font-semibold">{title}</h1>
      </div>

      {/* Slider */}
      <div className="mt-4">
        <RangeSlider
          id="range-slider-edit"
          max={1000000}
          step={100}
          value={[minValue, maxValue]}
          onInput={handleSliderChange}
          className="custom-range-slider"
        />
        
        {/* Input Fields */}
        <div className="flex items-center justify-between gap-4 mt-5">
          <div className="flex-1">
            <input
              type="number"
              value={minValue}
              onChange={(e) => handleInputChange('min', e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-primary"
              placeholder="Min"
            />
          </div>
          <BsDashLg className="text-gray-400" />
          <div className="flex-1">
            <input
              type="number"
              value={maxValue}
              onChange={(e) => handleInputChange('max', e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-primary"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangeInput;
