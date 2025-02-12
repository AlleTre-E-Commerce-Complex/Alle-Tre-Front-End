import React, { useState } from "react";
import RangeSlider from "react-range-slider-input";
import { BsDashLg } from "react-icons/bs";
import "react-range-slider-input/dist/style.css";
import "./range-input.css";
import useFilter from "../../hooks/use-filter";
import { useDebouncedCallback } from "use-debounce";

const RangeInput = ({ title, myRef }) => {
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(1000000);
  const [PriceFrom, setPriceFrom] = useFilter("priceFrom", "");
  const [PriceTo, seTpriceTo] = useFilter("priceTo", "");
  
  const debouncedFrom = useDebouncedCallback((value) => {
    setPriceFrom(value);
    window.scrollTo({ behavior: "smooth", top: myRef?.current?.offsetTop });
  }, 850);

  const debouncedTo = useDebouncedCallback((value) => {
    seTpriceTo(value);
    window.scrollTo({ behavior: "smooth", top: myRef?.current?.offsetTop });
  }, 850);

  const handleSliderChange = (value) => {
    setMinValue(value[0]);
    debouncedFrom(value[0]);
    setMaxValue(value[1]);
    debouncedTo(value[1]);
  };

  return (
    <div className="group w-full max-w-xs p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
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
          <input
            className="border border-gray-300 text-gray-700 w-full px-3 py-2 rounded-lg focus:ring focus:ring-gray-200 outline-none transition"
            type="number"
            id="minValue"
            value={minValue}
            onChange={(e) => {
              setMinValue(e.target.value);
              debouncedFrom(e.target.value);
            }}
          />
          <BsDashLg className="text-gray-500 text-2xl" />
          <input
            className="border border-gray-300 text-gray-700 w-full px-3 py-2 rounded-lg focus:ring focus:ring-gray-200 outline-none transition"
            type="number"
            id="maxValue"
            value={maxValue}
            onChange={(e) => {
              setMaxValue(e.target.value);
              debouncedTo(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RangeInput;
