import React from "react";

import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { RadioButtonsFilter } from "components/shared/buttons/radio-buttons-filter";

const AuctionFilterCard = ({ title, seeAll, name, values, myRef }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  return (
    <div>
      <div className="group w-auto h-fit rounded-2xl shadow p-4">
        <div className="flex justify-between border-b-[1px] border-[#EEEEEE] mt-4 pb-4">
          <h1 className="text-gray-dark text-base font-bold ">{title}</h1>
          <p className="text-gray-med text-xs font-normal cursor-default">
            {selectedContent[localizationKeys.seeAll]} ({seeAll})
          </p>
        </div>
        <RadioButtonsFilter valueRadio={values} name={name} myRef={myRef} />
      </div>
    </div>
  );
};

export default AuctionFilterCard;
