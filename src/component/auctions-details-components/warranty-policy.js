import React from "react";
import localizationKeys from "localization/localization-keys";
import content from "localization/content";
import { useLanguage } from "context/language-context";

const WarrantyPolicy = ({ dataTabs }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  return (
    <div className="animate-in">
      <div className=" mb-40">
        <div className={`flex bg-[#F2F2F2] drop-shadow  py-3 rounded ${""}`}>
          <p className="text-gray-med font-normal text-sm px-5 w-1/2">
            {selectedContent[localizationKeys.WarrantyPolicy]}:
          </p>
          <p className="text-gray-dark font-normal text-sm flex justify-start w-full mx-auto ">
            {dataTabs.warrantyPolicyDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPolicy;
