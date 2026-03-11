import React from "react";
import localizationKeys from "localization/localization-keys";
import content from "localization/content";
import { useLanguage } from "context/language-context";

const WarrantyPolicy = ({ dataTabs }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
              {selectedContent[localizationKeys.warrantyPolicy]}
            </h3>
            <div className="w-12 h-1.5 bg-primary rounded-full" />
          </div>
          <div className="md:w-2/3">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {dataTabs.warrantyPolicyDescription
                ? dataTabs.warrantyPolicyDescription
                : selectedContent[localizationKeys.noWarrantyPolicy]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPolicy;
