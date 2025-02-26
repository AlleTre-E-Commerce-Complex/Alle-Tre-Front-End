import axios from "axios";
import React, { useEffect } from "react";
import api from "../api";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetGatogry = () => {
  const [lang] = useLanguage();
  const [GatogryOptions, setGatogryOptions] = React.useState([]);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    run(axios.get(api.app.category.default)).then(({ data }) => {
      const GatogryOptions = data.data;
      const options = [];

      GatogryOptions.sort((a, b) => a.id - b.id).forEach((d) => {
        if (d.status === true) {
          options.push({
            name: lang === "en" ? d?.nameEn : d?.nameAr,
            text: lang === "en" ? d?.nameEn : d?.nameAr,
            key: d?.id,
            value: d.id,
            sliderLink: d?.sliderLink,
            bannerLink: d?.bannerLink,
            hasUsageCondition: d?.hasUsageCondition,
          });
        }
      });

      setGatogryOptions(options);
    });
  }, [lang, run]);

  return {
    GatogryOptions,
    loadingGatogry: isLoading,
    errorGatogry: error,
    isErrorGatogry: isError,
  };
};

export default useGetGatogry;
