import axios from "axios";
import React, { useEffect } from "react";
import api from "../api";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetSubGatogry = (categoryId) => {
  const [lang] = useLanguage();
  const [SubGatogryOptions, setSubGatogryOptions] = React.useState([]);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    if (categoryId) {
      run(axios.get(api.app.subCategory.default(categoryId))).then(
        ({ data }) => {
          const SubGatogryOptions = data.data;
          const options = [];

          SubGatogryOptions.forEach((d) => {
            let text = lang === "en" ? d?.nameEn : d?.nameAr;
            if (lang === "en") {
              if (text === "For Sale") text = "Sale";
              if (text === "For Rent") text = "Rent";
            }
            options.push({
              text: text,
              key: d?.id,
              value: d?.id,
              imageLink: d?.imageLink,
            });
          });
          setSubGatogryOptions(options);
        }
      );
    }else{
      setSubGatogryOptions([])
    }
  }, [categoryId]);

  return {
    SubGatogryOptions,
    loadingSubGatogry: isLoading,
    errorSubGatogry: error,
    isErrorSubGatogry: isError,
  };
};

export default useGetSubGatogry;
