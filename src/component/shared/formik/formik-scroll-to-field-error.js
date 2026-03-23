import { useFormikContext } from "formik";
import { useEffect } from "react";

export const getFieldErrorNames = (formikErrors) => {
  const transformObjectToDotNotation = (obj, prefix = "", result = []) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (!value) return;

      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "object") {
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

    setTimeout(() => {
      const fieldErrorNames = getFieldErrorNames(errors);
      if (fieldErrorNames.length <= 0) return;

      const errorField = fieldErrorNames[0];
      
      // Prioritize explicit IDs (visible SUI Dropdown containers) over name attributes (hidden inputs)
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
        // Calculate specific vertical offset to ensure sticky top headers don't hide the focused element
        const yOffset = -150; 
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      } else {
        // Complete Fallback: User explicitly requested scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);

  }, [submitCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
