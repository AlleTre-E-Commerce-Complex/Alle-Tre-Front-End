import React, { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/format-currency";
import { truncateString } from "../../utils/truncate-string";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Button, Dimmer, Modal } from "semantic-ui-react";
import useCountdown from "../../hooks/use-countdown";
import AuctionsStatus from "../shared/status/auctions-status";
import SubmitBidModel from "./submit-bid-model";
import TotalBidsTableModel from "./total-bids-table-model";
import { useSocket } from "context/socket-context";
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
import LodingTestAllatre from "component/shared/lotties-file/loding-test-allatre";
import { FaRegUser } from "react-icons/fa";

const SummaryHomeAuctionSections = ({
  bidderDepositFixedAmount,
  isDepositPaid,
  title,
  description,
  category,
  subCategory,
  TimeLeft,
  CurrentBid,
  totalBids,
  setActiveIndexTab,
  status,
  startBidAmount,
  isBuyNowAllowed,
  acceptedAmount,
  StartDate,
  latestBidAmount,
  onReload,
  isOffer,
  sellerLocation,
  userName,
}) => {
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
  const [loading, setLoading] = useState(false);
  const [openDeliverySelectingModal, setOpenDeliverySelectingModal] =
    useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

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

  useEffect(() => {
    if (category === undefined) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    // Check if auction is cancelled and show modal
    if (
      [
        "CANCELLED_BEFORE_EXP_DATE",
        "CANCELLED_AFTER_EXP_DATE",
        "CANCELLED_BY_ADMIN",
      ].includes(status)
    ) {
      setShowCancellationModal(true);
    }
  }, [status]);

  const getCancellationMessage = () => {
    switch (status) {
      case "CANCELLED_BEFORE_EXP_DATE":
      case "CANCELLED_AFTER_EXP_DATE":
        return (
          selectedContent[localizationKeys.auctionCancelledBySellerMessage] ||
          "This auction has been cancelled by the seller. Please contact support for more information."
        );
      case "CANCELLED_BY_ADMIN":
        return (
          selectedContent[localizationKeys.auctionCancelledByAdminMessage] ||
          "This auction has been cancelled by the administrator. Please contact support for more information."
        );
      default:
        return "";
    }
  };

  const handleCancellationModalClose = () => {
    setShowCancellationModal(false);
    history.push(routes.app.home);
  };

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
              position: "top-right",
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

  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -220;
    window.scrollTo({
      top: yCoordinate + yOffset,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading || loading}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>

      {/* Cancellation Modal */}
      <Modal
        size="tiny"
        open={showCancellationModal}
        onClose={handleCancellationModalClose}
        closeOnDimmerClick={false}
      >
        <Modal.Header className="text-red-600">
          {selectedContent[localizationKeys.auctionCancelled] ||
            "Auction Cancelled"}
        </Modal.Header>
        <Modal.Content>
          <p>{getCancellationMessage()}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            onClick={handleCancellationModalClose}
            className="bg-primary text-white hover:bg-primary-dark"
          >
            {selectedContent[localizationKeys.backToHome] || "Back to Home"}
          </Button>
        </Modal.Actions>
      </Modal>
      {![
        "CANCELLED_BEFORE_EXP_DATE",
        "CANCELLED_AFTER_EXP_DATE",
        "CANCELLED_BY_ADMIN",
      ].includes(status) && (
        <div>
          {/* Header Section */}
          <div className=" pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {title}
            </h1>
            <div className="flex items-center gap-x-5">
              <AuctionsStatus status={status} big />
            </div>
          </div>

          {/* Seller Info Section */}
          <div className="py-4">
            {userName && (
              <div className="flex items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-2.5">
                    {selectedContent[localizationKeys.postedBy] || "Seller"}
                  </p>
                  <div className="inline-flex items-center px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-gray-700 rounded-lg gap-2.5">
                    <FaRegUser className="text-gray-500" />
                    <span className="text-base font-medium">{userName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="py-6">
            <h3 className="text-base font-medium text-gray-700 mb-3">
              {selectedContent[localizationKeys.description]}
            </h3>
            <p className="text-base text-gray-600 leading-relaxed mb-4">
              {truncateString(description, 80)}
            </p>
            <HashLink
              className="inline-flex items-center text-primary hover:text-primary-dark text-sm font-medium transition-colors duration-200"
              smooth
              scroll={scrollWithOffset}
              to={`${pathname}#itemDescription`}
              onClick={() => setActiveIndexTab(0)}
            >
              {selectedContent[localizationKeys.viewDetails]}
              <svg
                className={`w-4 h-4 ml-1 ${lang === "ar" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </HashLink>
          </div>

          {/* Category Section */}
          <div className="py-6 flex flex-wrap gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2.5">
                {selectedContent[localizationKeys.category]}
              </p>
              <div className="px-4 py-2.5 bg-gray-100 hover:bg-gray-100 transition-colors duration-200 text-gray-700 rounded-lg font-medium">
                {category}
              </div>
            </div>
            {subCategory && (
              <div>
                <p className="text-sm text-gray-500 mb-2.5">
                  {selectedContent[localizationKeys.subCategory]}
                </p>
                <div className="px-4 py-2.5 bg-gray-100 hover:bg-gray-100 transition-colors duration-200 text-gray-700 rounded-lg font-medium">
                  {subCategory}
                </div>
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
                  ? // ? "Purchased Time"
                    ""
                  : selectedContent[localizationKeys.timeLeft]}
              </p>

              {status === "SOLD" ? (
                <p className="cursor-default text-base font-bold text-gray-verydark">
                  {/* {moment(PurchasedTime).local().format("MMMM, DD YYYY")} */}
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
              <p className="text-gray-med text-base font-normal pb-2 ml-3">
                {selectedContent[localizationKeys.totalBids]}
              </p>
              <p
                onClick={() => setTotalBidOpen(true)}
                className="text-gray-dark text-base font-normal underline cursor-pointer ml-3"
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
                <div className="relative w-full">
                  <div className="relative w-full group">
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
                      } mx-2 mr-8 border-[1px] w-full h-[48px] rounded-lg font-bold hover:bg-primary hover:text-white`}
                    >
                      {selectedContent[localizationKeys.buyNow] + " "}
                      <span className="font-bold">{`${acceptedAmount} AED`}</span>
                    </button>

                    {/* Message directly under the button */}
                    <p className="ml-2 w-full text-gray-500 text-base font-normal pt-2 text-left ml-2">
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
                    Number(
                      lastestBid?.bidAmount || CurrentBid || startBidAmount
                    ) ||
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
            sellerLocation={sellerLocation}

            // lastPrice={lastPrice}
          />
        </div>
      )}
    </>
  );
};

export default React.memo(SummaryHomeAuctionSections);
