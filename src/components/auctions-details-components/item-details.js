import React, { useEffect, useState } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import api from "../../api";
import { axios } from "../../config/axios-config";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";

const ItemDetails = ({ itemDetailsData }) => {
  console.log(itemDetailsData);

  const [lang, setLang] = useLanguage("");
  const [sysField, setSysField] = useState([]);
  const itemDetailsDataObject = Object.keys(itemDetailsData || {});
  const itemDetailsArray = sysField
    .map((field) => {
      const matchedKey = itemDetailsDataObject.find((key) => key === field.key);
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

  console.log("====================================");
  console.log();
  console.log("====================================");

  const { run: runSysField, isLoading: isLoadingysField } = useAxios([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(api.app.customField.systemField);
      setSysField(res?.data?.data?.filter((field) => !!field) || []);
    };

    runSysField(fetchData());
  }, [runSysField]);

  return (
    <div className="animate-in relative">
      <Dimmer className="animate-pulse" active={isLoadingysField} inverted>
        <Loader active />
      </Dimmer>
      {/* item description */}
      <div
        id="itemDescription"
        className="text-gray-dark text-base font-normal"
      >
        <h1 className="pb-8">About The Brand:</h1>
        <p>{itemDetailsData?.description}</p>
      </div>
      <div className="grid grid-rows-4 grid-flow-col gap-x-4 mt-4 mb-40">
        {itemDetailsArray.map((field, index) => {
          const colors = ["bg-[#F2F2F2]", "bg-[#FEFEFE]"];
          const bgColor = colors[index % colors.length];
          return (
            <div
              className={`flex ${bgColor} drop-shadow my-2 py-3 rounded ${
                itemDetailsArray.length > 3 ? "w-auto" : "w-1/2"
              }`}
              key={index}
            >
              <p className="text-gray-med font-normal text-sm  px-5 w-1/2">
                {field?.label[lang]} :
              </p>
              <p className="text-gray-dark font-normal text-sm flex justify-start w-full mx-auto ">
                {field?.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemDetails;
