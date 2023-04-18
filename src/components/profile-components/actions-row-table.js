import React from "react";

import { truncateString } from "../../utils/truncate-string";
import AuctionsStatus from "../shared/status/auctions-status";
import emtyPhotosIcon from "../../../src/assets/icons/emty-photos-icon.svg";
import { useHistory } from "react-router-dom";
import { formatCurrency } from "../../utils/format-currency";
import moment from "moment";
import useCountdown from "../../hooks/use-countdown";

const ActionsRowTable = ({
  status,
  title,
  description,
  img,
  totalBids,
  startingPrice,
  startingDate,
  lastPrice,
  purchasePrice,
  price,
  endingTime,
  endingDate,
  goToDetails,
}) => {
  const history = useHistory();
  const ending_Time = useCountdown(endingTime);
  const starting_Date = useCountdown(startingDate);
  const startingDateLeft = `${starting_Date.days} days : ${starting_Date.hours} hrs : ${starting_Date.minutes} min`;
  const endingTimeLeft = `${ending_Time.days} days : ${ending_Time.hours} hrs : ${ending_Time.minutes} min`;
  return (
    <div className="bg-background drop-shadow rounded-lg py-4 px-4 mb-2 animate-in">
      <div className="flex flex-wrap justify-between">
        <div className="flex gap-x-4">
          <div className="relative w-28 h-20 rounded-lg bg-[#F9F9F9] cursor-default  ">
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
            <AuctionsStatus status={status} small absolute />
          </div>
          <div>
            <h1 className="text-gray-dark text-sm font-medium">{title}</h1>
            <p className="text-gray-med text-xs font-normal pt-1">
              {truncateString(description, 80)}
            </p>
            {status === "ACTIVE" && (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    Total Bids
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {totalBids}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    Last Price
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(lastPrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    Ending Time
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* 02 days.05 hrs.02 min */}
                    {endingTimeLeft}
                  </p>
                </div>
              </div>
            )}
            {status === "PENDING_OWNER_DEPOIST" && (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    Starting Price
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(startingPrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    Starting Date
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* March,23 2023 */}
                    {moment.utc(startingDate).format("MMMM, DD YYYY")}
                  </p>
                </div>
                <button className="bg-secondary-light text-white text-xs px-2 rounded h-6 my-auto cursor-default w-1/2 sm:w-auto">
                  Pending Deposit
                </button>
              </div>
            )}
            {status === "IN_SCHEDULED" && (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    Starting Price
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {startingPrice}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    Purchase Price
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(purchasePrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    Starting Date
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* 02 days.05 hrs.02 min */}
                    {startingDateLeft}
                  </p>
                </div>
              </div>
            )}
            {status === "SOLD" ||
              (status === "EXPIRED" && (
                <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                  <div>
                    <h1 className="text-gray-veryLight text-[10px] font-normal">
                      Total Bids
                    </h1>
                    <p className="text-gray-dark text-[10px] font-normal">
                      {totalBids}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-gray-veryLight text-[10px] font-normal">
                      Price
                    </h1>
                    <p className="text-gray-dark text-[10px] font-normal">
                      {formatCurrency(price)}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-gray-veryLight text-[10px] font-normal">
                      Ending Date
                    </h1>
                    <p className="text-gray-dark text-[10px] font-normal">
                      {/* March,23 2023 */}
                      {moment.utc(endingDate).format("MMMM, DD YYYY")}
                    </p>
                  </div>
                </div>
              ))}

            <div className="pt-2  gap-x-10 hidden">
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
                  {endingTimeLeft}
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => history.push(goToDetails)}
          className="bg-primary-dark text-white text-sm font-normal sm:w-32 w-full sm:h-8 h-10 rounded-lg sm:mt-14 mt-5 "
        >
          View details
        </button>
      </div>
    </div>
  );
};

export default ActionsRowTable;
