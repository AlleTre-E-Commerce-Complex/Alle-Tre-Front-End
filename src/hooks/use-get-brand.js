import React, { useEffect } from "react";
import api from "../api";
import { authAxios } from "../config/axios-config";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";
import { useAuthState } from "context/auth-context";

const useGetBrand = (categoryId) => {
  const { user } = useAuthState();
  const [lang] = useLanguage();
  const [brandOptions, setBrandOptions] = React.useState([]);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    if (categoryId && user) {
      run(authAxios.get(api.app.brand.default(categoryId))).then(({ data }) => {
        const brands = data.data;
        const options = brands
          .filter(d => d?.name) // Filter out items without names
          .map(d => ({
            name: d.name,
            key: d.id,
            value: d.name // Use name for filtering since backend uses the brand field
          }));
        setBrandOptions(options);
      });
    }
  }, [categoryId, lang, run, user]);

  return {
    brandOptions,
    loadingBrands: isLoading,
    errorBrands: error,
    isErrorBrands: isError,
  };
};

export default useGetBrand;
