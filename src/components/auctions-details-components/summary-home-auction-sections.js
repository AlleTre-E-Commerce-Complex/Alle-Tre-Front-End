import React from "react";
import { formatCurrency } from "../../utils/format-currency";
import { truncateString } from "../../utils/truncate-string";

import RatingStare from "../shared/rating-star/rating-star";

import AnglesRight from "../../../src/assets/icons/angles-right-wihte.png";

import { HashLink } from "react-router-hash-link";
import routes from "../../routes";
import { useLocation, useParams } from "react-router-dom";
import AuctionsStatus from "../shared/status/auctions-status";
import useCountdown from "../../hooks/use-countdown";

const SummaryHomeAuctionSections = ({
  numberStare,
  totalReviews,
  description,
  category,
  subCategory,
  TimeLeft,
  endingPrice,
  CurrentBid,
  totalBids,
  endingTime,
  setActiveIndexTab,
  status,
}) => {
  const { pathname } = useLocation();
  const timeLeft = useCountdown(TimeLeft);
  const formattedTimeLeft = `${timeLeft.days} days : ${timeLeft.hours} hrs : ${timeLeft.minutes} min`;
  return (
    <div>
      {/* rating */}
      <div className="flex  gap-x-5">
        <AuctionsStatus status={status} big />
        <RatingStare max={numberStare} size="huge" />
        <p className="text-gray-dark text-base font-normal">
          ( {totalReviews} reviews )
        </p>
      </div>
      {/* Description */}
      <div className="pt-8">
        <h3 className="text-gray-dark text-base font-normal">Description</h3>
        <p className="text-gray-dark text-2xl font-normal pt-4 pb-6">
          {truncateString(description, 80)}
        </p>
        <HashLink
          className="underline text-gray-dark text-sm font-normal cursor-pointer pt-6"
          smooth
          to={`${pathname}#itemDescription`}
          onClick={() => setActiveIndexTab(0)}
        >
          View Details
        </HashLink>
      </div>
      {/* Category sections */}
      <div className="pt-6 flex flex-wrap gap-x-3">
        {/* Category left */}
        <div>
          <p className="text-gray-med text-base font-normal pb-2">Category</p>
          <button className="border-[1px] border-gray-dark rounded-lg text-gray-dark px-12 py-1 cursor-default">
            {category}
          </button>
        </div>
        <div className={subCategory ? "block " : "hidden"}>
          <p className="text-gray-med text-base font-normal pb-2">
            Sub-Category
          </p>
          <button className="border-[1px] border-gray-dark rounded-lg text-gray-dark px-12 py-1 cursor-default">
            {subCategory}
          </button>
        </div>
      </div>
      {/* Time Left and  Total Bids sections */}
      <div className="pt-6 grid grid-cols-2 ">
        <div>
          <p className="text-gray-med text-base font-normal pb-2">Time Left</p>
          <p
            className={`${
              timeLeft.days === 0 ? "text-red" : "text-gray-verydark"
            } cursor-default text-base font-bold`}
          >
            {formattedTimeLeft}
          </p>
        </div>
        <div>
          <p className="text-gray-med text-base font-normal pb-2">Total Bids</p>
          <p className="text-gray-dark cursor-default text-base font-normal underline ">
            {totalBids}
          </p>
        </div>
      </div>
      {/* Current Bid and Buy Now sections */}
      <div className="pt-6 grid grid-cols-2 ">
        <div>
          <p className="text-gray-med text-base font-normal pb-2">
            Current Bid
          </p>
          <p className="text-gray-verydark cursor-default text-2xl flex gap-12">
            <p>{formatCurrency(CurrentBid)}</p>
            <div className="my-auto">
              {/* <button className="w-20 h-6 text-xs font-normal bg-primary rounded text-white flex justify-center gap-x-2 pt-1.5 ">
                <p>View All</p>
                <img
                  className="w-2.5 h-2.5 mt-[1px]"
                  src={AnglesRight}
                  alt="AnglesRight"
                />
              </button> */}
            </div>
          </p>
        </div>
        <div>
          <button className="border-[1px] border-primary text-primary w-[304px] h-[48px] rounded-lg">
            Buy Now <span className="font-bold">FOR 20000 AED</span>
          </button>
        </div>
      </div>
      {/* Submit Bid sections */}
      <div className="pt-6 grid grid-cols-2  ">
        <div>
          <input
            className="border-[1px] border-veryLight h-[48px] w-[310px] rounded-lg px-4 outline-none"
            placeholder="min. AED 40000"
          />
        </div>
        <div>
          <button className="bg-primary hover:bg-primary-dark text-white w-[304px] h-[48px] rounded-lg">
            Submit Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryHomeAuctionSections;
