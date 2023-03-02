import { Field } from "formik";
import { TimeInput } from "semantic-ui-calendar-react";

import ErrorMessage from "./error-message";

function FormikTimePicker({ label, name, ...props }) {
  return (
    <Field name={name}>
      {({ form, field }) => {
        const { setFieldValue, setFieldTouched, errors, touched } = form;
        const { value } = field;

        return (
          <>
            <TimeInput
              id={name}
              closable
              iconPosition="left"
              popupPosition="bottom left"
              timeFormat="AMPM"
              {...field}
              {...props}
              label={
                <label
                  htmlFor={name}
                  className="font-bold text-primary text-base mt-4"
                >
                  {label}
                </label>
              }
              pickerStyle={{ border: "0" }}
              clearable
              hideMobileKeyboard
              duration={0}
              value={value}
              onBlur={() => setFieldTouched(name, true)}
              onChange={(e, { value }) => setFieldValue(name, value)}
              error={Boolean(touched[name] && errors[name])}
            />

            {touched[name] && errors[name] && (
              <ErrorMessage error={errors[name]} />
            )}
          </>
        );
      }}
    </Field>
  );
}

export default FormikTimePicker;
