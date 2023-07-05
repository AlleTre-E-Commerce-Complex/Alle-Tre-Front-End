import React, { useState } from "react";
import localizationKeys from "../../localization/localization-keys";
import content from "../../localization/content";
import { useLanguage } from "../../context/language-context";
import MultiButtonFilter from "component/shared/buttons/multi-button-filter";

const AuctionFilterCardList = ({ title, seeAll, name, values, myRef }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [IsseeAll, setSeeAll] = useState(false);
  return (
    <div>
      <div
        className={
          name === "brands"
            ? IsseeAll
              ? " h-fit shadow group w-auto p-4 rounded-2xl"
              : " h-[228px] overflow-hidden shadow group w-auto p-4 rounded-2xl"
            : "group w-auto h-fit rounded-2xl shadow p-4 "
        }
      >
        <div className="flex justify-between border-b-[1px] border-[#EEEEEE] mt-4 pb-4">
          <h1 className="text-gray-dark text-base font-bold ">{title}</h1>
          <p
            onClick={() => setSeeAll((p) => !p)}
            className={`${
              name === "brands" ? "cursor-pointer" : "cursor-default"
            }  text-gray-med text-xs font-normal `}
          >
            {name === "brands" && IsseeAll
              ? selectedContent[localizationKeys.seeLess]
              : selectedContent[localizationKeys.seeAll]}{" "}
            {` (${seeAll})`}
          </p>
        </div>
        <MultiButtonFilter name={name} values={values} myRef={myRef} />
      </div>
    </div>
  );
};

export default AuctionFilterCardList;
