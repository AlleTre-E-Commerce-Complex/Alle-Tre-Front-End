import React, { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/format-currency";
import { truncateString } from "../../utils/truncate-string";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Button } from "semantic-ui-react";
import useCountdown from "../../hooks/use-countdown";
import AuctionsStatus from "../shared/status/auctions-status";
import SubmitBidModel from "./submit-bid-model";
import TotalBidsTableModel from "./total-bids-table-model";
import { useSocket } from "context/socket-context";
import moment from "moment";
import { toast } from "react-hot-toast";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { socketAuctionId } from "redux-store/socket-auctionId-slice";
import api from "../../api";
import { authAxios } from "../../config/axios-config";
import { useAuthState } from "../../context/auth-context";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { Open } from "../../redux-store/auth-model-slice";
import { buyNow } from "../../redux-store/bid-amount-slice";
import routes from "../../routes";
import AddLocationModel from "../create-auction-components/add-location-model";
import { FiPlus, FiMinus } from "react-icons/fi";
import DeliverySelectingModal from "component/shared/DeliveryTypeModal/DeleverySelectingModal";

const SummaryHomeAuctionSections = ({
  bidderDepositFixedAmount,
  isDepositPaid,
  numberStare,
  totalReviews,
  title,
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
  PurchasedTime,
  onReload,
  isOffer,
}) => {
  // console.log("SummaryHomeAuctionSections");
  const { user } = useAuthState();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { pathname } = useLocation();
  const { auctionId } = useParams();
  const history = useHistory();
  const [openSubmitBid, setSubmitBidOpen] = useState(false);
  const [submitBidValue, setSubmitBidValue] = useState();
  const [lastestBid, setLastestBid] = useState(latestBidAmount);
  const [openTotaltBid, setTotalBidOpen] = useState(false);
  const [openMakeDefultLocations, setOpenMakeDefultLocations] = useState(false);
  const [openDeliverySelectingModal, setOpenDeliverySelectingModal] =
    useState(false);

  const dispatch = useDispatch();
  dispatch(socketAuctionId(auctionId));

  const handelBuyNow = () => {
    const isCompletedProfile = window.localStorage.getItem(
      "hasCompletedProfile"
    );
    if (user) {
      if (JSON.parse(isCompletedProfile)) {
        // history.push(routes.app.buyNow(auctionId));
        setOpenDeliverySelectingModal(true);
      } else setOpenMakeDefultLocations(true);
    } else {
      dispatch(Open());
    }
  };
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("bid:submitted", (data) => {
        setLastestBid(data);
      });
    }

    return () => {
      if (socket) {
        socket.off("bid:submitted");
      }
    };
  }, [socket]);

  const timeLeft = useCountdown(TimeLeft);
  const formattedTimeLeft = `${timeLeft.days} ${
    selectedContent[localizationKeys.days]
  } : ${timeLeft.hours} ${selectedContent[localizationKeys.hrs]} : ${
    timeLeft.minutes
  } ${selectedContent[localizationKeys.min]} : ${timeLeft.seconds} ${
    selectedContent[localizationKeys.sec]
  }`;

  const startDate = useCountdown(StartDate);

  const formattedstartDate = `${startDate.days} ${
    selectedContent[localizationKeys.days]
  } : ${startDate.hours} ${selectedContent[localizationKeys.hrs]} : ${
    startDate.minutes
  } ${selectedContent[localizationKeys.min]} : ${startDate.seconds} ${
    selectedContent[localizationKeys.sec]
  }`;

  const { run, isLoading } = useAxios();

  const handelSubmitBidButton = () => {
    const newValue = Number(submitBidValue);
    const isCompletedProfile = window.localStorage.getItem(
      "hasCompletedProfile"
    );

    if (user) {
      if (JSON.parse(isCompletedProfile)) {
        if (validateBidAmount(newValue)) {
          if (isDepositPaid) {
            sendSubmitBid(newValue);
          } else {
            setSubmitBidValue(newValue);
            if (isOffer) {
              submitBidWithoutSecurityDeposit();
            } else {
              setSubmitBidOpen(true);
            }
          }
        } else
          toast.error(
            selectedContent[
              localizationKeys
                .submitValueIsRequiredAndMustBeBiggerThanCurrentBid
            ]
          );
      } else setOpenMakeDefultLocations(true);
    } else {
      dispatch(Open());
    }
  };

  const [isPaymentWithout_SD_Success, setIsPaymentWithout_SD_Success] =
    useState(null);
  const submitBidWithoutSecurityDeposit = () => {
    const body = {
      auctionId,
      amount: 0,
      submitBidValue,
    };
    run(
      authAxios
        .post(api.app.auctions.walletPayDepositByBidder, body)
        .then((res) => {
          setIsPaymentWithout_SD_Success(res?.data?.success);
          if (res?.data?.success) {
            toast.success("Payment successful", {
              position: "top-right", // Position of the toast
            });
            history.push(routes.app.profile.myBids.inPogress);
          }
        })
        .catch((error) => {
          toast.error("Payment Failed", {
            position: "top-right",
          });
        })
    );
  };
  const validateBidAmount = (newValue) => {
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
    if (user) {
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
    } else {
      dispatch(Open());
    }
  };

  const handleIncrement = () => {
    const currentBidValue =
      Number(submitBidValue) ||
      Number(lastestBid?.bidAmount || CurrentBid || startBidAmount);
    setSubmitBidValue(currentBidValue + 50);
  };

  const handleDecrement = () => {
    const minBidValue = Number(
      lastestBid?.bidAmount || CurrentBid || startBidAmount
    );
    const currentBidValue = Number(submitBidValue) || minBidValue;

    if (currentBidValue > minBidValue) {
      setSubmitBidValue(currentBidValue - 50);
    }
  };
  return (
    <div>
      {/* Title Section */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>

      {/* Status and Rating Section */}
      <div className="flex items-center gap-x-5">
        <AuctionsStatus status={status} big />
        {/* Rating Section (uncomment when needed) */}
        {/* <div className="flex items-center gap-x-2">
      <RatingStare max={numberStare} size="huge" />
      <p className="text-sm text-gray-600">
        ({totalReviews} {selectedContent[localizationKeys.reviews]})
      </p>
    </div> */}
      </div>

      {/* Description */}
      <div className="pt-8 overflow-clip">
        <h3 className="text-base font-light text-gray-600 mb-2">
          {selectedContent[localizationKeys.description]}
        </h3>
        <p className="text-lg text-gray-700 mb-4">
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
      <div className="pt-6 mb-8 flex flex-wrap gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">
            {selectedContent[localizationKeys.category]}
          </p>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
            {category}
          </button>
        </div>
        {subCategory && (
          <div>
            <p className="text-sm text-gray-500 mb-2">
              {selectedContent[localizationKeys.subCategory]}
            </p>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
              {subCategory}
            </button>
          </div>
        )}
      </div>
      {/* Time Left and  Total Bids sections */}
      <div className="pt-6 grid grid-cols-2  ">
        <div>
          <p className="text-gray-med text-base font-normal pb-2">
            {status === "IN_SCHEDULED"
              ? selectedContent[localizationKeys.startDate]
              : status === "SOLD"
              ? "Purchased Time"
              : selectedContent[localizationKeys.timeLeft]}
          </p>

          {status === "SOLD" ? (
            <p className="cursor-default text-base font-bold text-gray-verydark">
              {moment(PurchasedTime).local().format("MMMM, DD YYYY")}
            </p>
          ) : (
            <p
              className={`${
                timeLeft.days === 0 ? "text-red" : "text-gray-verydark"
              } cursor-default text-base font-bold`}
            >
              {status === "IN_SCHEDULED"
                ? formattedstartDate
                : formattedTimeLeft}
            </p>
          )}
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
        {((Number(lastestBid?.bidAmount) || Number(CurrentBid)) <
          Number(acceptedAmount) ||
          (lastestBid?.bidAmount === undefined &&
            CurrentBid === undefined)) && (
          <div
            className={
              isBuyNowAllowed ? "block mt-auto pt-6 sm:pt-0" : "hidden"
            }
          >
            <div className="relative inline-block">
              <div className="relative inline-block group">
                <button
                  disabled={
                    status === "SOLD" ||
                    status === "EXPIRED" ||
                    status === "IN_SCHEDULED"
                      ? true
                      : false
                  }
                  onClick={() => {
                    handelBuyNow();
                    dispatch(buyNow(acceptedAmount));
                  }}
                  className={`${
                    status === "SOLD" ||
                    status === "EXPIRED" ||
                    status === "IN_SCHEDULED"
                      ? "border-primary/50 text-primary/50 cursor-not-allowed"
                      : "border-primary text-primary"
                  } border-[1px] w-[304px] h-[48px] rounded-lg font-bold hover:bg-primary hover:text-white`}
                >
                  {selectedContent[localizationKeys.buyNow] + " "}
                  <span className="font-bold">{`for ${acceptedAmount} AED`}</span>
                </button>

                {/* Message directly under the button */}
                <p className="text-gray-500 text-base font-normal pt-2 text-left ml-2">
                  {
                    selectedContent[
                      localizationKeys.whyWaitingBuyItNowOnThisPrice
                    ]
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Bid sections */}
      <div className="pt-6 grid md:grid-cols-2 sm:grid-cols-1">
        <div className="flex items-center space-x-2 w-full">
          <button
            type="button"
            disabled={
              Number(submitBidValue) <=
                Number(lastestBid?.bidAmount || CurrentBid || startBidAmount) ||
              [
                "SOLD",
                "EXPIRED",
                "IN_SCHEDULED",
                "WAITING_FOR_PAYMENT",
              ].includes(status)
            }
            onClick={handleDecrement}
            className={`h-[48px] min-w-[48px] flex items-center justify-center rounded-lg transition-all duration-200 ${
              Number(submitBidValue) <=
              Number(lastestBid?.bidAmount || CurrentBid || startBidAmount)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-primary/10 text-primary hover:bg-primary hover:text-white active:scale-95"
            }`}
          >
            <FiMinus size={20} className="stroke-[2.5]" />
          </button>

          <input
            className="min-w-[0px] flex-1 h-[48px] px-4 rounded-lg border-2 border-gray-200 focus:border-primary outline-none transition-colors duration-200"
            type="number"
            value={submitBidValue}
            onChange={(e) => setSubmitBidValue(e?.target?.value)}
            placeholder={`min. ${formatCurrency(
              lastestBid?.bidAmount || CurrentBid || startBidAmount
            )}`}
          />

          <button
            disabled={
              status === "SOLD" ||
              status === "EXPIRED" ||
              status === "IN_SCHEDULED" ||
              status === "WAITING_FOR_PAYMENT"
                ? true
                : false
            }
            type="button"
            onClick={handleIncrement}
            className="h-[48px] min-w-[48px] flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 active:scale-95 "
          >
            <FiPlus size={20} className="stroke-[2.5] " />
          </button>
        </div>

        <Button
          disabled={
            status === "SOLD" ||
            status === "EXPIRED" ||
            status === "IN_SCHEDULED" ||
            status === "WAITING_FOR_PAYMENT"
              ? true
              : false
          }
          loading={isLoading}
          onClick={handelSubmitBidButton}
          className="w-full h-[48px] bg-primary hover:bg-primary-dark text-white rounded-lg 
            mt-6 md:mt-0 md:ml-3 opacity-100 ltr:font-serifEN rtl:font-serifAR text-base"
        >
          {selectedContent[localizationKeys.submitBid]}
        </Button>
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
      <AddLocationModel
        open={openMakeDefultLocations}
        setOpen={setOpenMakeDefultLocations}
        TextButton={selectedContent[localizationKeys.add]}
        onReload={onReload}
      />
      <DeliverySelectingModal
        open={openDeliverySelectingModal}
        setOpen={setOpenDeliverySelectingModal}
        auctionId={auctionId}
        paymentType={"BUY_NOW"}
        // lastPrice={lastPrice}
      />
    </div>
  );
};

export default React.memo(SummaryHomeAuctionSections);
