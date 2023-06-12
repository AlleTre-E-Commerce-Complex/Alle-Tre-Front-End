import React, { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/format-currency";
import { truncateString } from "../../utils/truncate-string";

import RatingStare from "../shared/rating-star/rating-star";

import AnglesRight from "../../../src/assets/icons/angles-right-wihte.png";

import { HashLink } from "react-router-hash-link";
import { useLocation, useParams } from "react-router-dom";
import AuctionsStatus from "../shared/status/auctions-status";
import useCountdown from "../../hooks/use-countdown";
import { Button, Modal } from "semantic-ui-react";
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
import content from "../../localization/content";
import { useLanguage } from "../../context/language-context";
import localizationKeys from "../../localization/localization-keys";
import moment from "moment";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import api from "../../api";

const SummaryHomeAuctionSections = ({
  bidderDepositFixedAmount,
  isDepositPaid,
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
  StartDate,
  latestBidAmount,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { pathname } = useLocation();
  const [openSubmitBid, setSubmitBidOpen] = useState(false);
  const [submitBidValue, setSubmitBidValue] = useState();
  const [lastestBid, setLastestBid] = useState(latestBidAmount);
  const [openTotaltBid, setTotalBidOpen] = useState(false);

  const dispatch = useDispatch();
  dispatch(auctionsId(auctionsID));
  const loginData = useSelector((state) => state?.loginDate?.loginDate);

  const { auctionId } = useParams();
  const { user, logout } = useAuthState();
  useEffect(() => {
    if (auctionId) {
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
          setLastestBid(data);
        });

        return () => {
          newSocket.close();
          logout();
        };
      });
    }
  }, []);

  const timeLeft = useCountdown(TimeLeft);
  const formattedTimeLeft = `${timeLeft.days} ${
    selectedContent[localizationKeys.days]
  } : ${timeLeft.hours} ${selectedContent[localizationKeys.hrs]} : ${
    timeLeft.minutes
  } ${selectedContent[localizationKeys.min]}`;

  const startDate = useCountdown(StartDate);

  const formattedstartDate = `${startDate.days} ${
    selectedContent[localizationKeys.days]
  } : ${startDate.hours} ${selectedContent[localizationKeys.hrs]} : ${
    startDate.minutes
  } ${selectedContent[localizationKeys.min]}`;

  const { run, isLoading } = useAxios();
  const handelSubmitBidButton = () => {
    const newValue = Number(submitBidValue);
    if (user) {
      if (validateBidAmount(newValue)) {
        if (isDepositPaid) {
          sendSubmitBid(newValue);
        } else {
          setSubmitBidValue(newValue);
          setSubmitBidOpen(true);
        }
      } else
        toast.error(
          selectedContent[
            localizationKeys.submitValueIsRequiredAndMustBeBiggerThanCurrentBid
          ]
        );
    } else {
      dispatch(Open());
    }
  };

  const validateBidAmount = (newValue) => {
    console.log(
      newValue,
      lastestBid?.bidAmount ? lastestBid?.bidAmount : 0,
      latestBidAmount,
      CurrentBid,
      startBidAmount
    );
    if (
      isNaN(newValue) ||
      newValue <=
        Math.max(
          lastestBid?.bidAmount ? lastestBid?.bidAmount : 0,
          latestBidAmount ? latestBidAmount : 0,
          CurrentBid ? CurrentBid : 0,
          startBidAmount ? startBidAmount : 0
        )
    )
      return false;
    return true;
  };

  const sendSubmitBid = (newValue) => {
    const body = {
      bidAmount: newValue,
    };
    run(authAxios.post(api.app.auctions.submitBid(auctionId), body))
      .then((res) => {
        toast.success(
          selectedContent[localizationKeys.yourAddNewSubmitValueSuccessfully]
        );
        setSubmitBidValue("");
      })
      .catch((err) => {
        toast.error(
          lang === "en"
            ? err.message.en || err.message
            : err.message.ar || err.message
        );
      });
  };

  return (
    <div>
      {/* rating */}
      <div className="flex  gap-x-5">
        <AuctionsStatus status={status} big />
        <RatingStare max={numberStare} size="huge" />
        <p className="text-gray-dark text-base font-normal">
          ( {totalReviews} {selectedContent[localizationKeys.reviews]} )
        </p>
      </div>
      {/* Description */}
      <div className="pt-8 overflow-clip">
        <h3 className="text-gray-dark text-base font-normal">
          {" "}
          {selectedContent[localizationKeys.description]}
        </h3>
        <p className="text-gray-dark text-2xl font-normal pt-4 pb-6">
          {truncateString(description, 80)}
        </p>
        <HashLink
          className="underline text-gray-dark text-sm font-normal cursor-pointer pt-6"
          smooth
          to={`${pathname}#itemDescription`}
          onClick={() => setActiveIndexTab(0)}
        >
          {selectedContent[localizationKeys.viewDetails]}
        </HashLink>
      </div>
      {/* Category sections */}
      <div className="pt-6 flex flex-wrap gap-x-3">
        {/* Category left */}
        <div>
          <p className="text-gray-med text-base font-normal pb-2">
            {selectedContent[localizationKeys.category]}
          </p>
          <button className="border-[1px] border-gray-dark rounded-lg text-gray-dark px-12 py-1 cursor-default">
            {category}
          </button>
        </div>
        <div className={subCategory ? "block " : "hidden"}>
          <p className="text-gray-med text-base font-normal pb-2">
            {selectedContent[localizationKeys.subCategory]}
          </p>
          <button className="border-[1px] border-gray-dark rounded-lg text-gray-dark px-12 py-1 cursor-default">
            {subCategory}
          </button>
        </div>
      </div>
      {/* Time Left and  Total Bids sections */}
      <div className="pt-6 grid grid-cols-2  ">
        <div>
          <p className="text-gray-med text-base font-normal pb-2">
            {status === "IN_SCHEDULED"
              ? selectedContent[localizationKeys.startDate]
              : selectedContent[localizationKeys.timeLeft]}
          </p>
          <p
            className={`${
              timeLeft.days === 0 ? "text-red" : "text-gray-verydark"
            } cursor-default text-base font-bold`}
          >
            {status === "IN_SCHEDULED" ? formattedstartDate : formattedTimeLeft}
          </p>
        </div>
        <div>
          <p className="text-gray-med text-base font-normal pb-2 ">
            {selectedContent[localizationKeys.totalBids]}
          </p>
          <p
            onClick={() => setTotalBidOpen(true)}
            className="text-gray-dark text-base font-normal underline cursor-pointer "
          >
            {lastestBid?.totalBids || totalBids}
          </p>
        </div>
      </div>
      {/* Current Bid and Buy Now sections */}
      <div
        className={
          status === "IN_SCHEDULED"
            ? "hidden"
            : "pt-6 grid md:grid-cols-2 sm:grid-cols-1 "
        }
      >
        <div>
          <p className="text-gray-med text-base font-normal pb-2">
            {!CurrentBid
              ? selectedContent[localizationKeys.startingBidAmount]
              : selectedContent[localizationKeys.currentBid]}
          </p>
          <p className="text-gray-verydark cursor-default text-2xl flex flex-wrap gap-12">
            <p>
              {formatCurrency(
                lastestBid?.bidAmount || CurrentBid || startBidAmount
              )}
            </p>
            <div className="my-auto"></div>
          </p>
        </div>
        <div
          className={isBuyNowAllowed ? "block mt-auto pt-6 sm:pt-0" : "hidden"}
        >
          <button className="border-[1px] border-primary text-primary w-[304px] h-[48px] rounded-lg">
            {selectedContent[localizationKeys.buyNow]}
            <span className="font-bold">FOR {` ${acceptedAmount} `} AED</span>
          </button>
        </div>
      </div>
      {/* Submit Bid sections */}
      <div
        className={
          status === "IN_SCHEDULED"
            ? "hidden"
            : "pt-6 grid md:grid-cols-2 sm:grid-cols-1"
        }
      >
        <div>
          <input
            className="border-[1px] border-veryLight h-[48px] w-[304px] rounded-lg px-4 outline-none"
            type="number"
            value={submitBidValue}
            onChange={(e) => setSubmitBidValue(e?.target?.value)}
            placeholder={`min. ${formatCurrency(
              lastestBid?.bidAmount || CurrentBid || startBidAmount
            )}`}
          />
        </div>
        <div>
          <Button
            loading={isLoading}
            onClick={handelSubmitBidButton}
            className="bg-primary hover:bg-primary-dark text-white w-[304px] h-[48px] rounded-lg mt-6 sm:mt-0 opacity-100 ltr:font-serifEN rtl:font-serifAR text-base"
          >
            {selectedContent[localizationKeys.submitBid]}
          </Button>
        </div>
      </div>
      <TotalBidsTableModel setOpen={setTotalBidOpen} open={openTotaltBid} />
      <SubmitBidModel
        bidderDepositFixedAmount={bidderDepositFixedAmount}
        isDepostPay={isDepositPaid}
        open={openSubmitBid}
        setOpen={setSubmitBidOpen}
        submitBidValue={submitBidValue}
        setSubmitBidValue={setSubmitBidValue}
      />
    </div>
  );
};

export default SummaryHomeAuctionSections;
