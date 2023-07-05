import axios from "axios";
import React, { useEffect } from "react";
import api from "../api";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetAllHomeCategory = () => {
  const [lang] = useLanguage();
  const [allHomecategoryOptions, setAllHomecategoryOptions] = React.useState(
    []
  );

  const { run, isLoading } = useAxios();

  useEffect(() => {
    run(axios.get(api.app.allHomecategory.default)).then(({ data }) => {
      const GatogryOptions = data.data;
      const options = [];

      GatogryOptions.forEach((d) =>
        options.push({
          categoty: {
            text: lang === "en" ? d?.nameEn : d?.nameAr,
            key: d?.id,
            value: d.id,
            bannerLink: d?.bannerLink,
          },
          subcategoty: d?.subCategories.map((e) => {
            return {
              categoryId: e?.categoryId,
              key: e?.id,
              value: e.id,
              text: lang === "en" ? e?.nameEn : e?.nameAr,
            };
          }),
        })
      );

      setAllHomecategoryOptions(options);
    });
  }, [lang, run]);

  return {
    allHomecategoryOptions,
    loadingallHomecategory: isLoading,
  };
};

export default useGetAllHomeCategory;
