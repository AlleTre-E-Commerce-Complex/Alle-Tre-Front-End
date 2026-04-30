import axios from "axios";
import React, { useEffect } from "react";
import api from "../api";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetGatogry = (isHome = false) => {
  const [lang] = useLanguage();
  const [GatogryOptions, setGatogryOptions] = React.useState([]);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    run(axios.get(api.app.category.default)).then(({ data }) => {
      const allCategories = data.data || [];
      const baseCategories = allCategories.filter((d) => d.status === true);
      const options = [];

      if (isHome) {
        // Advanced Split Logic for Home Page
        baseCategories.sort((a, b) => {
          if (a.id === 4) return -1;
          if (b.id === 4) return 1;
          if (a.id === 3) return -1;
          if (b.id === 3) return 1;
          return a.id - b.id;
        }).forEach((d) => {
          if (d.id === 4 || d.id === 3) {
            const isCar = d.id === 4;
            const isProperty = d.id === 3;
            
            const saleSubId = isCar ? 14 : undefined;
            const rentSubId = isCar ? 15 : undefined;
            const saleUsageStatus = isProperty ? "NEW" : undefined;
            const rentUsageStatus = isProperty ? "USED" : undefined;

            // Add For Sale entry
            options.push({
              name: (lang === "en" ? "Sale " + (d.id === 3 ? "Properties" : d?.nameEn) : d?.nameAr + " للبيع"),
              text: (lang === "en" ? "Sale " + (d.id === 3 ? "Properties" : d?.nameEn) : d?.nameAr + " للبيع"),
              key: `${d?.id}-sale`,
              value: d.id,
              subCategoryId: saleSubId,
              usageStatus: saleUsageStatus,
              sliderLink: d?.sliderLink,
              bannerLink: d?.bannerLink,
              sliderLinkAr: d?.sliderLinkAr,
              bannerLinkAr: d?.bannerLinkAr,
              hasUsageCondition: d?.hasUsageCondition,
              maxStartPrice: d?.maxStartPrice,
            });

            // Add For Rent entry
            options.push({
              name: (lang === "en" ? "Rent " + (d.id === 3 ? "Properties" : d?.nameEn) : d?.nameAr + " للإيجار"),
              text: (lang === "en" ? "Rent " + (d.id === 3 ? "Properties" : d?.nameEn) : d?.nameAr + " للإيجار"),
              key: `${d?.id}-rent`,
              value: d.id,
              subCategoryId: rentSubId,
              usageStatus: rentUsageStatus,
              sliderLink: d?.sliderLink,
              bannerLink: d?.bannerLink,
              sliderLinkAr: d?.sliderLinkAr,
              bannerLinkAr: d?.bannerLinkAr,
              hasUsageCondition: d?.hasUsageCondition,
              maxStartPrice: d?.maxStartPrice,
            });
          } else {
            options.push({
              name: lang === "en" ? d?.nameEn : d?.nameAr,
              text: lang === "en" ? d?.nameEn : d?.nameAr,
              key: d?.id,
              value: d.id,
              sliderLink: d?.sliderLink,
              bannerLink: d?.bannerLink,
              sliderLinkAr: d?.sliderLinkAr,
              bannerLinkAr: d?.bannerLinkAr,
              hasUsageCondition: d?.hasUsageCondition,
              maxStartPrice: d?.maxStartPrice,
            });
          }
        });
      } else {
        // Standard dropdown logic (no split)
        baseCategories.sort((a, b) => {
          if (a.id === 4) return -1;
          if (b.id === 4) return 1;
          if (a.id === 3) return -1;
          if (b.id === 3) return 1;
          return a.id - b.id;
        }).forEach((d) => {
          options.push({
            name: lang === "en" ? d?.nameEn : d?.nameAr,
            text: lang === "en" ? d?.nameEn : d?.nameAr,
            key: d?.id,
            value: d.id,
            sliderLink: d?.sliderLink,
            bannerLink: d?.bannerLink,
            sliderLinkAr: d?.sliderLinkAr,
            bannerLinkAr: d?.bannerLinkAr,
            hasUsageCondition: d?.hasUsageCondition,
            maxStartPrice: d?.maxStartPrice,
          });
        });
      }

      setGatogryOptions(options);
    });
  }, [lang, run, isHome]);

  return {
    GatogryOptions,
    loadingGatogry: isLoading,
    errorGatogry: error,
    isErrorGatogry: isError,
  };
};

export default useGetGatogry;
