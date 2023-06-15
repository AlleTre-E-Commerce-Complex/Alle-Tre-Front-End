import React from "react";
import DonutChart from "./donut-chart";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const TotalAuctions = ({
  active,
  drafted,
  sold,
  scheduled,
  expired,
  pending,
  watingForPayment,
  totalcount,
}) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  return (
    <div className="bg-gray-veryLight/20 rounded-lg drop-shadow-complete-profile shadow-sm flex flex-wrap gap-x-20 sm:ltr:pr-28 sm:rtl:pl-28 ltr:pr-8 rtl:pl-8 overflow-hidden ">
      <h1 className="text-gray-dark font-semibold text-base ltr:pl-6 rtl:pr-6 pt-6  ">
        {selectedContent[localizationKeys.totalAuctions]}
      </h1>
      <div className="ltr:pl-6 rtl:pr-6 ltr:md:pl-0 rtl:md:pr-0">
        <DonutChart
          isTotalAuctions
          active={active}
          drafted={drafted}
          sold={sold}
          scheduled={scheduled}
          watingForPayment={watingForPayment}
          expired={expired}
          pending={pending}
          totalcount={totalcount}
        />
      </div>
      <div className="my-auto sm:w-72 w-full ltr:pl-6 rtl:pr-6 md:ltr:pl-0 md:rtl:pr-0 ">
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-green"></p>
            <p className="text-base font-normal text-gray-med">
              {selectedContent[localizationKeys.activeAuctions]}
            </p>
          </div>
          <p className="text-gray-verydark">
            {active}{" "}
            <span className="px-1">
              {" "}
              {selectedContent[localizationKeys.auction]}
            </span>{" "}
          </p>
        </div>
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-cyan"></p>
            <p className="text-base font-normal text-gray-med">
              {" "}
              {selectedContent[localizationKeys.drafts]}
            </p>
          </div>
          <p className="text-gray-verydark">
            {drafted}{" "}
            <span className="px-1">
              {" "}
              {selectedContent[localizationKeys.auction]}
            </span>{" "}
          </p>
        </div>
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-primary-light"></p>
            <p className="text-base font-normal text-gray-med">
              {" "}
              {selectedContent[localizationKeys.sold]}
            </p>
          </div>
          <p className="text-gray-verydark">
            {sold}{" "}
            <span className="px-1">
              {" "}
              {selectedContent[localizationKeys.auction]}
            </span>{" "}
          </p>
        </div>
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-yellow"></p>
            <p className="text-base font-normal text-gray-med">
              {" "}
              {selectedContent[localizationKeys.Scheduled]}
            </p>
          </div>
          <p className="text-gray-verydark">
            {scheduled}{" "}
            <span className="px-1">
              {" "}
              {selectedContent[localizationKeys.auction]}
            </span>{" "}
          </p>
        </div>
      </div>
      <div className="pt-2 sm:w-72 w-full pl-6 md:pl-0">
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-gray-med"></p>
            <p className="text-base font-normal text-gray-med">
              {" "}
              Wating For Payment
            </p>
          </div>
          <p className="text-gray-verydark">
            {watingForPayment}{" "}
            <span className="px-1">
              {" "}
              {selectedContent[localizationKeys.auction]}
            </span>{" "}
          </p>
        </div>
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-gray-med"></p>
            <p className="text-base font-normal text-gray-med">
              {" "}
              {selectedContent[localizationKeys.expired]}
            </p>
          </div>
          <p className="text-gray-verydark">
            {expired}{" "}
            <span className="px-1">
              {" "}
              {selectedContent[localizationKeys.auction]}
            </span>{" "}
          </p>
        </div>
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-secondary"></p>
            <p className="text-base font-normal text-gray-med">
              {" "}
              {selectedContent[localizationKeys.pending]}
            </p>
          </div>
          <p className="text-gray-verydark">
            {pending}{" "}
            <span className="px-1">
              {" "}
              {selectedContent[localizationKeys.auction]}
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalAuctions;
