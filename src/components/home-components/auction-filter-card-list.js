import React from "react";
import MultiButtonFilter from "../shared/buttons/multi-button-filter";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const AuctionFilterCardList = ({ title, seeAll, name, values, myRef }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  return (
    <div>
      <div className="group lg:w-[272px] w-[299px]  h-fit rounded-2xl shadow p-4">
        <div className="flex justify-between border-b-[1px] border-[#EEEEEE] mt-4 pb-4">
          <h1 className="text-gray-dark text-base font-bold ">{title}</h1>
          <p className="text-gray-med text-xs font-normal cursor-default">
            {selectedContent[localizationKeys.seeAll]} ({seeAll})
          </p>
        </div>
        <MultiButtonFilter name={name} values={values} myRef={myRef} />
      </div>
    </div>
  );
};

export default AuctionFilterCardList;
