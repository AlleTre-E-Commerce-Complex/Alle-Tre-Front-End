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

      // Custom sort to show Cars first, then sort by ID
      GatogryOptions.sort((a, b) => {
        // If one is Cars category (id: 4), prioritize it
        if (a.id === 4) return -1;
        if (b.id === 4) return 1;
        // Otherwise sort by ID
        return a.id - b.id;
      }).forEach((d) => {
        if (d.status === true) {
          options.push({
            name: lang === "en" ? d?.nameEn : d?.nameAr,
            text: lang === "en" ? d?.nameEn : d?.nameAr,
            key: d?.id,
            value: d.id,
            sliderLink: d?.sliderLink,
            bannerLink: d?.bannerLink,
            // sliderLinkAr: d?.sliderLinkAr,
            // bannerLinkAr: d?.bannerLinkAr,
            hasUsageCondition: d?.hasUsageCondition,
            maxStartPrice: d?.maxStartPrice,
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
