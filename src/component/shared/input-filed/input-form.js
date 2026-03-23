import React from "react";
import { BiErrorCircle } from "react-icons/bi";
import "./input-form.css";

const InputForm = ({ type, placeholder, label, width, value, errorMessage, ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full text-left rtl:text-right">
      {label && (
        <div className="flex justify-between items-center w-full">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">{label}</label>
          {errorMessage && errorMessage !== "true" && (
            <div className="text-xs font-normal flex items-center text-red-700 m-0">
              <BiErrorCircle className="ltr:mr-1 rtl:ml-1 w-3 h-3" />
              {errorMessage}
            </div>
          )}
        </div>
      )}
      <input
        className={`w-full rounded-lg border border-gray-300 dark:border-[#d4af37]/40 h-[48px] focus:border-primary dark:focus:border-yellow focus:ring-1 focus:ring-primary rtl:font-serifAR ltr:font-serifEN px-4 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-primary-dark text-gray-900 dark:text-white transition-colors ${props.className || ""}`}
        type={type}
        value={value}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default InputForm;
