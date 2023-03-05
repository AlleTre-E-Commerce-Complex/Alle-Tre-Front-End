import { Field } from "formik";
import { DateInput } from "semantic-ui-calendar-react";

import "../../../../src/assets/style/formik-date.css";

function FormikDate({ label, name, error, ...props }) {
  return (
    <div className="Edit_FormikDate relative">
      <Field name={name}>
        {({ form, field }) => {
          const { setFieldTouched, setFieldValue, errors, touched } = form;
          const { value } = field;
          return (
            <DateInput
              label={
                <label htmlFor={name} className="font-normal  text-base">
                  {label}
                </label>
              }
              id={name}
              clearable
              closable
              value={value}
              iconPosition="left"
              {...field}
              {...props}
              onBlur={() => setFieldTouched(name, true)}
              onChange={(e, { value }) => setFieldValue(name, value)}
              error={(touched[name] && errors[name]) || error}
            />
          );
        }}
      </Field>
    </div>
  );
}

export default FormikDate;
