import { Field } from "formik";
import InputForm from "../input-filed/input-form";
import ErrorMessage from "./error-message";

function FormikInput({ label, name, className, placeholder, value, ...props }) {
  return (
    <>
      <Field name={name}>
        {({ form, field }) => {
          const { errors, touched } = form;
          const isError = Boolean(touched[name] && errors[name]); // Calculate the error status

          return (
            <div>
              <InputForm
                label={label}
                placeholder={placeholder}
                type={props.type}
                value={value}
                {...field}
                {...props}
                error={isError ? "true" : undefined} // Pass as string "true" or omit it if not an error
              />
              {isError && <ErrorMessage message={errors[name]} />}
            </div>
          );
        }}
      </Field>
    </>
  );
}

export default FormikInput;
