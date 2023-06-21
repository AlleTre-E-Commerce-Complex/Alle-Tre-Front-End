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
    window.scrollTo({
      behavior: "smooth",
      top: myRef?.current?.offsetTop,
    });
  }, 850);

  const debouncedTo = useDebouncedCallback((value) => {
    seTpriceTo(value);
    window.scrollTo({
      behavior: "smooth",
      top: myRef?.current?.offsetTop,
    });
  }, 850);

  const handleSliderChange = (value) => {
    setMinValue(value[0]);
    debouncedFrom(value[0]);
    setMaxValue(value[1]);
    debouncedTo(value[1]);
  };

  const handleMinInputChange = (event) => {
    debouncedFrom(event.target.value);
    setMinValue(event.target.value);
  };

  const handleMaxInputChange = (event) => {
    setMaxValue(event.target.value);
    debouncedTo(event.target.value);
  };

  return (
    <div className="group lg:w-[272px] w-[299px] h-fit rounded-2xl shadow p-4">
      <div className="flex justify-between border-b-[1px] border-[#EEEEEE] mt-4 pb-4">
        <h1 className="text-gray-dark text-base font-bold ">{title}</h1>
      </div>
      <div className="mt-6">
        <RangeSlider
          id="range-slider-edit"
          max={1000000}
          step={100}
          value={[minValue, maxValue]}
          onInput={handleSliderChange}
        />
        <div className="flex justify-between gap-x-7 mt-6 text-[#DDDDDD] w-full">
          <input
            className="border-[1px] border-[#DDDDDD] text-gray-med w-full px-2.5 py-3 outline-none"
            type="number"
            id="minValue"
            value={minValue}
            onChange={handleMinInputChange}
          />
          <BsDashLg className="text-gray-med" size={40} />
          <input
            className="border-[1px] border-[#DDDDDD] text-gray-med w-full px-2.5 py-3 outline-none"
            type="number"
            id="maxValue"
            value={maxValue}
            onChange={handleMaxInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default RangeInput;
