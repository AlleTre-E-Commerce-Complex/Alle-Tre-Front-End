import React from "react";
import DonutChart from "./donut-chart";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const TotalMyProducts = ({
  inProgressProducts,
  outOfStockProducts,
  soldOutProducts,
}) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  return (
    <div className="bg-gray-veryLight/20 rounded-lg drop-shadow-complete-profile shadow-sm flex flex-wrap gap-x-20 sm:ltr:pr-28 sm:rtl:pl-28 ltr:pr-8 rtl:pl-8 overflow-hidden ">
      <h1 className="text-gray-dark font-semibold text-base ltr:pl-6 rtl:pr-6 pt-6  ">
        {selectedContent[localizationKeys.AllMyProducts]}
      </h1>
      {/* <div className="ltr:pl-6 rtl:pr-6 ltr:md:pl-0 rtl:md:pr-0">
        <DonutChart
          inProgressAuction={inProgressAuction}
          pendingAuction={pendingAuction}
          completedAuction={completedAuction}
          expiredAuctions={expiredAuctions}
          waitingForDeliveryAuctions={waitingForDeliveryAuctions}
          cancelledBids={cancelledAuction}
          totalcount={totalcount}
        />
      </div> */}
      <div className="my-auto sm:w-80 w-full ltr:pl-6 rtl:pr-6 md:ltr:pl-0 md:rtl:pr-0 ">
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-green"></p>
            <p className="text-base font-normal text-gray-med">
              {selectedContent[localizationKeys.inProgress]}
            </p>
          </div>
          <p className="text-gray-verydark">
            {inProgressProducts}{" "}
            <span className="px-1">
              {" "}
              {selectedContent[localizationKeys.products]}
            </span>{" "}
          </p>
        </div>
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-cyan"></p>
            <p className="text-base font-normal text-gray-med">
              {" "}
              {selectedContent[localizationKeys.outOfStock]}
            </p>
          </div>
          <p className="text-gray-verydark">
            {outOfStockProducts}
            <span className="px-1">
              {" "}
              {selectedContent[localizationKeys.products]}
            </span>{" "}
          </p>
        </div>
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-primary-light"></p>
            <p className="text-base font-normal text-gray-med">
              {" "}
              {selectedContent[localizationKeys.soldOut]}
            </p>
          </div>
          <p className="text-gray-verydark">
            {soldOutProducts}
            <span className="px-1">
              {" "}
              {selectedContent[localizationKeys.products]}
            </span>{" "}
          </p>
        </div>
      </div>
      {/* <div className="mt-[24px] sm:w-80 w-full pl-6 md:pl-0 ">
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-gray-med"></p>
            <p className="text-base font-normal text-gray-med">
              {" "}
              {selectedContent[localizationKeys.expiredAuctions]}
            </p>
          </div>
          <p className="text-gray-verydark">
            {expiredAuctions}{" "}
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
              {selectedContent[localizationKeys.waitingForDelivery]}
            </p>
          </div>
          <p className="text-gray-verydark">
            {waitingForDeliveryAuctions}{" "}
            <span className="px-1">
              {" "}
              {selectedContent[localizationKeys.auction]}
            </span>{" "}
          </p>
        </div>
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-red-600"></p>
            <p className="text-base font-normal text-gray-med">
              {" "}
              {selectedContent[localizationKeys.cancelledAuctions]}
            </p>
          </div>
          <p className="text-gray-verydark">
            {cancelledAuction}{" "}
            <span className="px-1">
              {" "}
              {selectedContent[localizationKeys.auction]}
            </span>{" "}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default TotalMyProducts;
