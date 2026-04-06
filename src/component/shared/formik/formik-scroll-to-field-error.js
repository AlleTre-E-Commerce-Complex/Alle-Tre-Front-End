import { useFormikContext } from "formik";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { get } from "wild-wild-path";

export const getFieldErrorNames = (formikErrors) => {
  const transformObjectToDotNotation = (obj, prefix = "", result = []) => {
    if (!obj || typeof obj !== "object") return result;

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (!value) return;

      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "object" && !Array.isArray(value)) {
        transformObjectToDotNotation(value, nextKey, result);
      } else {
        result.push(nextKey);
      }
    });

    return result;
  };

  return transformObjectToDotNotation(formikErrors);
};

export const ScrollToFieldError = () => {
  const { submitCount, isValid, errors } = useFormikContext();

  useEffect(() => {
    if (isValid || submitCount === 0) return;

    const fieldErrorNames = getFieldErrorNames(errors);
    if (fieldErrorNames.length <= 0) return;

    // Show toast for the first error
    const firstErrorMessage = get(errors, fieldErrorNames[0]);
    if (firstErrorMessage) {
      const message = Array.isArray(firstErrorMessage)
        ? firstErrorMessage.join(". ")
        : firstErrorMessage;

      if (typeof message === "string") {
        toast.error(message);
      }
    }

    setTimeout(() => {
      const errorField = fieldErrorNames[0];

      // Prioritize explicit IDs
      let element = document.getElementById(errorField);

      // Fallback: Visible inputs with exact name
      if (!element) {
        element = document.querySelector(
          `input:not([type="hidden"])[name='${errorField}'], textarea[name='${errorField}'], select[name='${errorField}']`
        );
      }

      // Ultimate Fallback: Just absolutely anything named the error
      if (!element) {
        element = document.querySelector(`[name='${errorField}']`);
      }

      if (element) {
        let scrollTarget = element;
        // If element is hidden or very small, try to find a visible parent div
        if (element.offsetParent === null || element.offsetHeight === 0) {
          const parentDiv = element.closest("div");
          if (parentDiv) scrollTarget = parentDiv;
        }

        // Use scrollIntoView with 'center' to avoid issues with sticky headers
        scrollTarget.scrollIntoView({ behavior: "smooth", block: "center" });

        // Optionally focus the element if it's an input
        if (typeof element.focus === "function") {
          setTimeout(() => element.focus({ preventScroll: true }), 300);
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 150);
  }, [submitCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
