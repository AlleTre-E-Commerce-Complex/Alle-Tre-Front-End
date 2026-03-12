import React, { useEffect, useState } from "react";
import { Dimmer } from "semantic-ui-react";
import api from "../../api";
import { axios } from "../../config/axios-config";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const ItemDetails = ({ itemDetailsData }) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const [sysField, setSysField] = useState([]);
  const itemDetailsDataObject = Object.keys(itemDetailsData || {});
  const itemDetailsArray = sysField
    .map((field) => {
      const matchedKey = itemDetailsDataObject.find(
        (key) => key === field.resKey,
      );
      if (!matchedKey) return null;
      return {
        label: {
          en: field?.labelEn,
          ar: field?.labelAr,
        },
        value: itemDetailsData?.[matchedKey],
      };
    })
    .filter((item) => item !== null);

  const { run: runSysField, isLoading: isLoadingysField } = useAxios([]);

  useEffect(() => {
    runSysField(
      axios.get(api.app.customField.systemField).then((res) => {
        setSysField(res?.data?.data?.filter((field) => !!field) || []);
      }),
    );
  }, [runSysField]);
  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/20 dark:bg-black/40 backdrop-blur-sm z-[9999]"
        active={isLoadingysField}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>

      <div className="animate-in fade-in duration-700">
        {/* Item Description */}
        <div id="itemDescription" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {selectedContent[localizationKeys.aboutTheBrand]}
            </h2>
          </div>
          <div className="bg-white dark:bg-primary-dark border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-medium">
              {itemDetailsData?.description}
            </p>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {itemDetailsArray.map((field, index) => {
            if (
              field.value === null ||
              field.value === undefined ||
              field.value === ""
            )
              return null;

            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 p-5 rounded-2xl hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300 group"
              >
                <p className="text-[10px] font-black text-gray-500 dark:text-gray-700 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">
                  {field?.label[lang]}
                </p>
                <p className="text-sm font-bold text-primary dark:text-white leading-tight">
                  {field.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ItemDetails;
