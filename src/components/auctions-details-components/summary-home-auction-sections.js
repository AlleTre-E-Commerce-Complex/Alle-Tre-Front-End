import React, { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/format-currency";
import { truncateString } from "../../utils/truncate-string";

import RatingStare from "../shared/rating-star/rating-star";

import AnglesRight from "../../../src/assets/icons/angles-right-wihte.png";

import { HashLink } from "react-router-hash-link";
import { useLocation, useParams } from "react-router-dom";
import AuctionsStatus from "../shared/status/auctions-status";
import useCountdown from "../../hooks/use-countdown";
import { Modal } from "semantic-ui-react";
import SubmitBidModel from "./submit-bid-model";
import TotalBidsTableModel from "./total-bids-table-model";
import { useDispatch, useSelector } from "react-redux";

import { auctionsId } from "../../redux-store/auction-details-slice";
import { useAuthState } from "../../context/auth-context";
import { Open } from "../../redux-store/auth-model-slice";
import { toast } from "react-hot-toast";
import { useSocket } from "../../context/socket-context";
import auth from "../../utils/auth";
import { io } from "socket.io-client";

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
  auctionsID,
  startBidAmount,
  isBuyNowAllowed,
  acceptedAmount,
}) => {
  // const { user } = useAuthState();
  const { pathname } = useLocation();
  const [openSubmitBid, setSubmitBidOpen] = useState(false);
  const [submitBidValue, setSubmitBidValue] = useState();
  const [lastestBid, setLastestBid] = useState();
  const [openTotaltBid, setTotalBidOpen] = useState(false);

  const dispatch = useDispatch();
  dispatch(auctionsId(auctionsID));

  const { auctionId } = useParams();
  const { user, logout } = useAuthState();
  useEffect(() => {
    auth.getToken().then((accessToken) => {
      const headers = {
        Authorization: accessToken ? "Bearer " + accessToken : undefined,
      };
      const URL = process.env.REACT_APP_DEV_WEB_SOCKET_URL;
      const newSocket = io(URL, {
        query: { auctionId: auctionId },
        extraHeaders: Object.entries(headers).reduce(
          (acc, [key, value]) =>
            value !== undefined ? { ...acc, [key]: value } : acc,
          {}
        ),
        path: "/socket.io",
      });
      newSocket?.on("bid:submitted", (data) => {
        console.log("Received data:", data);
        setLastestBid(data);
      });

      return () => {
        newSocket.close();
        logout();
      };
    });
  }, []);

  const timeLeft = useCountdown(TimeLeft);
  const formattedTimeLeft = `${timeLeft.days} days : ${timeLeft.hours} hrs : ${timeLeft.minutes} min`;

  const handelSumbitBid = () => {
    const newValue = Number(submitBidValue);
    if (user) {
      if (newValue <= Math.max(lastestBid?.bidAmount, CurrentBid)) {
        toast.error(
          "Submit value is required and must be bigger than current bid "
        );
      } else setSubmitBidOpen(true);
    } else dispatch(Open());
  };

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
          <p
            onClick={() => setTotalBidOpen(true)}
            className="text-gray-dark text-base font-normal underline cursor-pointer "
          >
            {lastestBid?.totalBids || totalBids}
          </p>
        </div>
      </div>
      {/* Current Bid and Buy Now sections */}
      <div className="pt-6 grid grid-cols-2 ">
        <div>
          <p className="text-gray-med text-base font-normal pb-2">
            {!CurrentBid ? "Starting Bid Amount" : "Current Bid"}
          </p>
          <p className="text-gray-verydark cursor-default text-2xl flex gap-12">
            <p>
              {formatCurrency(
                lastestBid?.bidAmount || CurrentBid || startBidAmount
              )}
            </p>
            <div className="my-auto"></div>
          </p>
        </div>
        <div className={isBuyNowAllowed ? "block" : "hidden"}>
          <button className="border-[1px] border-primary text-primary w-[304px] h-[48px] rounded-lg">
            Buy Now{" "}
            <span className="font-bold">FOR {` ${acceptedAmount} `} AED</span>
          </button>
        </div>
      </div>
      {/* Submit Bid sections */}
      <div className="pt-6 grid grid-cols-2">
        <div>
          <input
            className="border-[1px] border-veryLight h-[48px] w-[310px] rounded-lg px-4 outline-none"
            type="number"
            value={submitBidValue}
            onChange={(e) => setSubmitBidValue(e?.target?.value)}
            placeholder={`min. ${formatCurrency(
              lastestBid?.bidAmount || CurrentBid || startBidAmount
            )}`}
          />
        </div>
        <div>
          <button
            onClick={() => handelSumbitBid()}
            className="bg-primary hover:bg-primary-dark text-white w-[304px] h-[48px] rounded-lg"
          >
            Submit Bid
          </button>
        </div>
      </div>
      <TotalBidsTableModel setOpen={setTotalBidOpen} open={openTotaltBid} />
      <SubmitBidModel
        setOpen={setSubmitBidOpen}
        open={openSubmitBid}
        submitBidValue={submitBidValue}
        setSubmitBidValue={setSubmitBidValue}
      />
    </div>
  );
};

export default SummaryHomeAuctionSections;
