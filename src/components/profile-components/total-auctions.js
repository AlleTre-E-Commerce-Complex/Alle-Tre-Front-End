import React from "react";
import DonutChart from "./donut-chart";

const TotalAuctions = ({
  active,
  drafted,
  sold,
  scheduled,
  expired,
  pending,
  totalcount,
}) => {
  return (
    <div className="bg-gray-veryLight/20 rounded-lg drop-shadow-complete-profile shadow-sm flex justify-between  pr-28  ">
      <h1 className="text-gray-dark font-semibold text-base pl-6 pt-6 ">
        Total Auctions
      </h1>
      <div className="">
        <DonutChart
          active={active}
          drafted={drafted}
          sold={sold}
          scheduled={scheduled}
          expired={expired}
          pending={pending}
          totalcount={totalcount}
        />
      </div>
      <div className="my-auto w-72">
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-[#45BF55]"></p>
            <p className="text-base font-normal text-gray-med">
              Active Auctions
            </p>
          </div>
          <p className="text-[#515151]">
            {active} <span className="px-1"> Auction</span>{" "}
          </p>
        </div>
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-[#67C6B9]"></p>
            <p className="text-base font-normal text-gray-med">Drafts</p>
          </div>
          <p className="text-[#515151]">
            {drafted} <span className="px-1"> Auction</span>{" "}
          </p>
        </div>
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-primary-light"></p>
            <p className="text-base font-normal text-gray-med">sold</p>
          </div>
          <p className="text-[#515151]">
            {sold} <span className="px-1"> Auction</span>{" "}
          </p>
        </div>
      </div>
      <div className="my-auto w-72">
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-[#FBAE4C]"></p>
            <p className="text-base font-normal text-gray-med">Scheduled</p>
          </div>
          <p className="text-[#515151]">
            {scheduled} <span className="px-1"> Auction</span>{" "}
          </p>
        </div>
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-gray-med"></p>
            <p className="text-base font-normal text-gray-med">Expired</p>
          </div>
          <p className="text-[#515151]">
            {expired} <span className="px-1"> Auction</span>{" "}
          </p>
        </div>
        <div className="flex justify-between py-1.5">
          <div className="flex gap-x-2">
            <p className="w-4 h-4 rounded-full mt-1 bg-secondary"></p>
            <p className="text-base font-normal text-gray-med">Pending</p>
          </div>
          <p className="text-[#515151]">
            {pending} <span className="px-1"> Auction</span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalAuctions;
