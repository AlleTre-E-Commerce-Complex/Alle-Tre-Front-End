import React, { useEffect, useState } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
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
        (key) => key === field.resKey
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
      })
    );
  }, [runSysField]);
  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingysField}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="animate-in  mx-auto">
        {/* item description */}
        <div
          id="itemDescription"
          className="bg-white rounded-xl p-6 shadow-sm mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {selectedContent[localizationKeys.aboutTheBrand]}
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {itemDetailsData?.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          {itemDetailsArray.map((field, index) => {
            if (field.value === null) return null;
            
            return (
              <div
                key={index}
                className="bg-[#F2F2F2] rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="text-gray-500 font-medium text-sm sm:w-1/3">
                    {field?.label[lang]}
                  </p>
                  <p className="text-gray-800 font-medium text-sm sm:w-2/3">
                    {field.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ItemDetails;
