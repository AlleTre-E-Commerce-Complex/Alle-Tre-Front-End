import { Field } from "formik";
import InputForm from "../input-filed/input-form";
import ErrorMessage from "./error-message";

function FormikInput({
  label,
  name,
  className,
  placeholder,
  type = "text",
  value,
  ...props
}) {
  // Function to prevent non-numeric input
  const handleKeyDown = (event) => {


    if (type === "number") {
      if (
        [46, 8, 9, 27, 13, 110, 190].includes(event.keyCode) ||
        (event.keyCode === 65 && event.ctrlKey === true) ||
        (event.keyCode === 67 && event.ctrlKey === true) ||
        (event.keyCode === 86 && event.ctrlKey === true) ||
        (event.keyCode === 88 && event.ctrlKey === true) ||
        (event.keyCode >= 35 && event.keyCode <= 39)
      ) {
        return;
      }
      if (
        (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
        (event.keyCode < 96 || event.keyCode > 105)
      ) {
        event.preventDefault();
      }
    }
  };

  return (
    <>
      <Field name={name}>
        {({ form, field }) => {
          const { errors, touched } = form;
          const isError = Boolean(touched[name] && errors[name]);

          return (
            <div>
              <InputForm
                label={label}
                placeholder={placeholder}
                type={type}
                inputMode={type === "number" ? "numeric" : "text"}
                value={value}
                {...field}
                {...props}
                error={isError ? "true" : undefined}
                onKeyDown={type === "number" ? handleKeyDown : undefined}
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
