import React from "react";
import "./input-form.css";

const InputForm = ({ type, placeholder, label, width, value, ...props }) => {
  return (
    <div id="floatContainer1" class="float-container text-primary-dark ">
      <label className="label_Input_Form">{label}</label>
      <input
        className="rounded-lg border-[1px] h-[48px] focus:border-primary text-primary-dark  .input_Input_Form rtl:font-serifAR ltr:font-serifEN"
        type={type}
        value={value}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default InputForm;
