import React from "react";
import { Field } from "formik";
import { Form } from "semantic-ui-react";
import { get } from "wild-wild-path";
import { BiErrorCircle } from "react-icons/bi";
import "../../../../src/assets/style/formik-dropdown.css";

function FormikMultiDropdown({
  label,
  name,
  className,
  onChange,
  multiple,
  ...props
}) {
  return (
    <Field name={name}>
      {({ form, field }) => {
        const { setFieldValue, setFieldTouched, errors, touched } = form;
        const isError = Boolean(get(touched, name) && get(errors, name));

        return (
          <div 
            className={`flex flex-col mt-1.5 relative Edit_FormikMultiDropdown ${className || ""}`}
          >
            <Form.Dropdown
              id={name}
              label={
                label ? (
                  <div className="flex justify-between items-center w-full mb-1">
                    <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer m-0">
                      {label}
                    </label>
                    {isError && (
                      <div className="text-xs font-normal flex items-center text-red-700 m-0">
                        <BiErrorCircle className="ltr:mr-1 rtl:ml-1 w-3 h-3" />
                        {get(errors, name)}
                      </div>
                    )}
                  </div>
                ) : null
              }
              {...field}
              {...props}
              error={isError}
              onBlur={() => setFieldTouched(name, true)}
              onChange={(e, { value }) => {
                setFieldValue(name, value);
                if (typeof onChange === "function") onChange(value);
              }}
              search={props.search !== undefined ? props.search : true}
              fluid
              selection
              multiple={multiple}
            >
              {props.children}
            </Form.Dropdown>
          </div>
        );
      }}
    </Field>
  );
}

export default FormikMultiDropdown;
