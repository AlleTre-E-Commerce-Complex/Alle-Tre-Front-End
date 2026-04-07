import React, { useState } from "react";
import { BiErrorCircle, BiCalendar } from "react-icons/bi";
import { HiEye, HiEyeOff } from "react-icons/hi";
import "./input-form.css";

const InputForm = ({
  type,
  placeholder,
  label,
  width,
  value,
  errorMessage,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-2 w-full text-left rtl:text-right">
      {label && (
        <div className="flex justify-between items-center w-full">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
            {label}
          </label>
          {errorMessage && errorMessage !== "true" && (
            <div className="text-xs font-normal flex items-center text-red-700 m-0">
              <BiErrorCircle className="ltr:mr-1 rtl:ml-1 w-3 h-3" />
              {errorMessage}
            </div>
          )}
        </div>
      )}
      <div className="relative w-full flex items-center">
        <input
          className={`w-full rounded-lg border ${
            error
              ? "border-red-600 focus:border-red-600 focus:ring-red-600"
              : "border-gray-300 dark:border-[#d4af37]/40 focus:border-primary dark:focus:border-yellow focus:ring-primary"
          } h-[48px] focus:ring-1 rtl:font-serifAR ltr:font-serifEN px-4 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-primary-dark text-gray-900 dark:text-white transition-colors dark:[color-scheme:dark] ${
            type === "date" ? "has-custom-date" : ""
          } ${isPassword ? "pr-11 rtl:pl-11" : ""} ${props.className || ""}`}
          type={inputType}
          value={value}
          placeholder={placeholder}
          {...props}
        />
        {type === "date" && (
          <BiCalendar className="absolute ltr:right-4 rtl:left-4 w-5 h-5 text-primary dark:text-gray-400 pointer-events-none" />
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute ltr:right-3 rtl:left-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 active:scale-90 transition-all text-gray-400 hover:text-primary dark:hover:text-[#d4af37]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <HiEyeOff size={20} className="transition-opacity duration-300" />
            ) : (
              <HiEye size={20} className="transition-opacity duration-300" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputForm;
