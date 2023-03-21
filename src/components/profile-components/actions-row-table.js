import React from "react";

import { truncateString } from "../../utils/truncate-string";
import AuctionsStatus from "../shared/status/auctions-status";
import emtyPhotosIcon from "../../../src/assets/icons/emty-photos-icon.svg";
import { useHistory } from "react-router-dom";

const ActionsRowTable = ({
  status,
  title,
  description,
  img,
  totalBids,
  lastPrice,
  endingTime,
  goToDetails,
}) => {
  const history = useHistory();

  return (
    <div className="bg-background drop-shadow rounded-lg py-4 px-4 mb-2 animate-in">
      <div className="flex justify-between ">
        <div className="flex gap-x-4">
          <div className="relative w-28 h-20 rounded-lg bg-[#F9F9F9]   ">
            {img ? (
              <img
                className="w-28 h-20 object-cover rounded-lg "
                src={img ? img : emtyPhotosIcon}
                alt="img"
              />
            ) : (
              <img
                className="w-8 h-8 mx-auto mt-7 object-cover rounded-lg  "
                src={emtyPhotosIcon}
                alt="img"
              />
            )}
            <AuctionsStatus status={status} />
          </div>
          <div>
            <h1 className="text-gray-dark text-sm font-medium">{title}</h1>
            <p className="text-gray-med text-xs font-normal pt-1">
              {truncateString(description, 80)}
            </p>
            <div className="pt-2 flex gap-x-10">
              <div>
                <h1 className="text-gray-veryLight text-[10px] font-normal">
                  Total Bids
                </h1>
                <p className="text-gray-dark text-[10px] font-normal">
                  {totalBids} Bid
                </p>
              </div>
              <div>
                <h1 className="text-gray-veryLight text-[10px] font-normal">
                  Last Price
                </h1>
                <p className="text-gray-dark text-[10px] font-normal">
                  {lastPrice} AED
                </p>
              </div>
              <div>
                <h1 className="text-gray-veryLight text-[10px] font-normal">
                  Ending Time
                </h1>
                <p className="text-gray-dark text-[10px] font-normal">
                  {/* 02 days.05 hrs.02 min */}
                  {endingTime}
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => history.push(goToDetails)}
          className="bg-primary-dark text-white text-sm font-normal w-32 h-8 rounded-lg mt-14"
        >
          View details
        </button>
      </div>
    </div>
  );
};

export default ActionsRowTable;
