import React from "react";
import localizationKeys from "localization/localization-keys";
import content from "localization/content";
import { useLanguage } from "context/language-context";

const DeliveryPolicy = ({ dataTabs }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  return (
    <div className="grid sm:grid-rows-5 sm:grid-flow-col gap-x-4 mt-4 animate-in">
      <div className="mb-4">
        <div className={"flex bg-[#F2F2F2] drop-shadow  py-3 rounded "}>
          <p className="text-gray-med font-normal text-sm px-5 w-1/2">
            {selectedContent[localizationKeys.expectedDeliveryDays]}:
          </p>
          <p className="text-gray-dark font-normal text-sm flex justify-start w-full mx-auto ">
            {dataTabs?.numOfDaysOfExpecetdDelivery}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <div className={"flex bg-[#FEFEFE] drop-shadow  py-3 rounded "}>
          <p className="text-gray-med font-normal text-sm px-5 w-1/2">
            {selectedContent[localizationKeys.deliveryFees]}:
          </p>
          <p className="text-gray-dark font-normal text-sm flex justify-start w-full mx-auto ">
            {dataTabs?.DeliveryFees}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <div className={"flex bg-[#F2F2F2] drop-shadow  py-3 rounded "}>
          <p className="text-gray-med font-normal text-sm px-5 w-1/2">
            {selectedContent[localizationKeys.deliveryPolicy]}:
          </p>
          <p className="text-gray-dark font-normal text-sm flex justify-start w-full mx-auto ">
            {dataTabs?.deliveryPolicyDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPolicy;
