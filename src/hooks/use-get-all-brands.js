import React, { useEffect } from "react";
import api from "../api";
import { axios } from "../config/axios-config";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetAllBrands = () => {
  const [lang] = useLanguage();
  const [allBrands, setAllBrands] = React.useState([]);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    run(axios.get(api.app.brand.all)).then(({ data }) => {
      const brands = data.data;
      const options = brands
        .filter(d => d?.name) // Filter out items without names
        .map(d => ({
          name: d.name,
          key: d.id,
          value: d.name // Use name for filtering since backend uses the brand field
        }));
      setAllBrands(options);
    });
  }, [lang, run]);

  return {
    allBrands,
    loadingBrands: isLoading,
    errorBrands: error,
    isErrorBrands: isError,
  };
};

export default useGetAllBrands;
