import React from "react";

import { Field } from "formik";
import DatePicker from "@deskpro/react-datepicker-hijri";
import "@deskpro/react-datepicker-hijri/dist/react-datepicker.css";
import momentHijri from "moment-hijri";
import ErrorMessage from "./error-message";

const FormikDateTimePicker = ({ name, label, month, withTime, ...props }) => {
  return (
    <Field name={name}>
      {({ field, form }) => {
        const { setFieldValue, setFieldTouched, errors, touched } = form;
        // const {value} = field
        const value = field.value ? momentHijri(field.value) : "";

        return (
          <div className="flex flex-col">
            <label
              htmlFor={name}
              className="font-bold text-primary text-base mt-5"
            >
              {label}
            </label>
            <DatePicker
              id={name}
              className="mt-1"
              selected={value}
              value={value ? value?.format("DD-MM-YYYY") : ""}
              onChange={(val) => setFieldValue(name, val)}
              onBlur={() => setFieldTouched(true)}
              isClearable={true}
              dateFormat="D MMMM YYYY"
              {...props}
              // {...(month && {
              //   dateFormat: 'MM/yyyy',
              //   showMonthYearPicker: true,
              //   showFullMonthYearPicker: true,
              //   showTwoColumnMonthYearPicker: true,
              // })}
              // timeCaption="time"
              // calendar={field.isHijri ? "hijri" : ""}
              showTimeSelect={withTime}
              showMonthYearPicker
              // timeFormat="h:mm a"
            />

            <div className="mt-4">
              {touched[name] && errors[name] && (
                <ErrorMessage error={errors[name]} />
              )}
            </div>
          </div>
        );
      }}
    </Field>
  );
};

export default FormikDateTimePicker;
