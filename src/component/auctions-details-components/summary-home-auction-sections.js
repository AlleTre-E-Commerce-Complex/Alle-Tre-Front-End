import React, { useEffect, useState } from "react";

import { formatCurrency } from "../../utils/format-currency";
import { truncateString } from "../../utils/truncate-string";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Button, Dimmer, Modal, Icon } from "semantic-ui-react";
import InspectionDetailsModal from "../shared/inspection-details/InspectionDetailsModal";
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
import { BiSolidFilePdf } from "react-icons/bi";
import { IoCall } from "react-icons/io5";
// import { FaWhatsapp } from "react-icons/fa";
// import EditPhoneNumberModel from "component/profile-components/edit-phone-number-model";

const SummaryHomeAuctionSections = ({
  bidderDepositFixedAmount,
  isDepositPaid,
  title,
  description,
  categoryData,
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
  userId,
  userPhone,
  userImage,
  usageStatus,
  relatedDocuments,
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
    if (!socket) return;

    const handleBidSubmitted = (data) => {
      try {
        // You can validate `data` here if needed
        setLastestBid(data);
      } catch (error) {
        console.error("Error handling bid:submitted event:", error);
      }
    };

    socket.on("bid:submitted", handleBidSubmitted);

    return () => {
      socket.off("bid:submitted", handleBidSubmitted);
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
    if (
      categoryData.luxuaryAmount &&
      Number(startBidAmount) < Number(categoryData.luxuaryAmount)
    ) {
      if (
        categoryData.maxBidLimit &&
        newValue > Number(categoryData.maxBidLimit)
      ) {
        toast.error(
          `${
            selectedContent[
              localizationKeys.YourMaximumBidAllowedForThisAuctionIsAED
            ]
          } ${categoryData.maxBidLimit}`
        );
        return;
      }
    }
    const isCompletedProfile = window.localStorage.getItem(
      "hasCompletedProfile"
    );
    const specialCategory = [4];
    if (user) {
      if (JSON.parse(isCompletedProfile)) {
        if (validateBidAmount(newValue)) {
          if (specialCategory.includes(categoryData.id)) {
            if (categoryData.id === 4 && newValue < 5000) {
              sendSubmitBid(newValue);
              return;
            }
          }
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
  const handelUserDetails = () => {
    const queryParams = new URLSearchParams({
      username: userName || "",
      id: userId || "",
      imageLink: userImage || "",
      phone: userPhone || "",
    }).toString();
    history.push(`${routes.app.listProduct.userDetails}?${queryParams}`);
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
          console.log("submit bid error : ", err);
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
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);

  // const [showMobileNumber, setShowMobileNumber] = useState(false);
  // const handleSendInspectionDetails = () => {
  //   if (!user) {
  //     dispatch(Open());
  //     return;
  //   }
  //   const userPhone = user.phone || localStorage.getItem("userPhone");
  //   if (!userPhone) {
  //     toast.error(
  //       selectedContent[
  //         localizationKeys.PleaseRegisterYourPhoneNumberBeforeProceeding
  //       ]
  //     );
  //     setShowMobileNumber(true);
  //     return;
  //   }
  //   run(
  //     authAxios
  //       .post(api.app.whatsApp.sendInspectionDetails(auctionId))
  //       .then((res) => {
  //         console.log("handleSendInspectionDetails resoponse:", res);
  //         if (res.data.success) {
  //           toast.success(
  //             selectedContent[
  //               localizationKeys.WeHaveSentTheInspectionDetailsToYourWhatsApp
  //             ]
  //           );
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("handle Send inpecton Details:", error);
  //       })
  //   );
  // };

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
          <div className="pb-6 flex items-center gap-x-2 md:gap-x-5">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {title}
            </h1>
            {usageStatus && (
              <div
              className={`state-button shrink-0 px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-xs font-medium transition-colors ${
                usageStatus === "NEW"
                  ? "bg-primary-veryLight text-primary"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {category === "Properties" ||
              category === "عقارات" ||
              category === "Animals" ||
              category === "حيوانات"
                ? usageStatus === "NEW"
                  ? selectedContent[localizationKeys.sell]
                  : category === "Animals" || category === "حيوانات"
                  ? selectedContent[localizationKeys.adoption]
                  : selectedContent[localizationKeys.rent]
                : usageStatus?.charAt(0).toUpperCase() +
                  usageStatus?.slice(1).toLowerCase()}
            </div>
          )}
          </div>

          <div className="flex items-center gap-x-6">
            <AuctionsStatus status={status} big />
          </div>

          {/* Seller Info Section */}
          <div className="py-4">
            {userName && (
              <div className="flex items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-2.5">
                    {selectedContent[localizationKeys.postedBy]}
                  </p>
                  <div
                    onClick={() => handelUserDetails()}
                    className="inline-flex items-center px-4 py-2.5 bg-gray-50 hover:bg-gray-300 transition-colors duration-200 text-gray-700 rounded-lg gap-2.5 cursor-pointer"
                  >
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
            <p className="text-base text-gray-600 leading-relaxed mb-2">
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
          {/* <div className="getSellerDetailsOnWhatsApp">
            <button
              onClick={handleSendInspectionDetails}
              className="border-primary border-[1px] text-primary md:w-[220px] w-full h-[35px] md:h-[40px] rounded-lg flex items-center justify-center space-x-2 hover:border-primary-dark hover:text-primary-dark"
            >
              <span>
                <FaWhatsapp />
              </span>
              <span>
                {" "}
                {selectedContent[localizationKeys.GetInspectionDetails]}
              </span>
            </button>
       
            <div style={{ display: "none" }}>
              <EditPhoneNumberModel
                onReload={onReload}
                oldPhoneNumber={user?.phone}
                isOpen={showMobileNumber}
                setShowMobileNumber={setShowMobileNumber}
              />
            </div>
          </div> */}
          <div className="getInspectionDetails mt-4">
            <button
              onClick={() => setIsInspectionModalOpen(true)}
              className="border-primary border-[1px] text-primary md:w-[220px] w-full h-[35px] md:h-[40px] rounded-lg flex items-center justify-center space-x-2 hover:border-primary-dark hover:text-primary-dark transition-colors duration-200"
            >
              {category === "Animals" || category === "حيوانات" ? (
                <>
                  <span>
                    <IoCall />
                  </span>
                  <span>{selectedContent[localizationKeys.contactSeller]}</span>
                </>
              ) : (
                <>
                  <span>
                    <Icon name="search" />
                  </span>
                  <span>
                    {selectedContent[localizationKeys.GetInspectionDetails]}
                  </span>
                </>
              )}
            </button>

            <InspectionDetailsModal
              open={isInspectionModalOpen}
              onClose={() => setIsInspectionModalOpen(false)}
              inspectionDetails={{
                name: userName,
                cityEn: sellerLocation?.city?.nameEn,
                cityAr: sellerLocation?.city?.nameAr,
                countryEn: sellerLocation?.country?.nameEn,
                countryAr: sellerLocation?.country?.nameAr,
                lat: sellerLocation?.lat,
                lng: sellerLocation?.lng,
                date: new Date(StartDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
                time: new Date(StartDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }),
                contactPerson: userName,
                phone: userPhone,
              }}
            />
          </div>

          {relatedDocuments?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-gray-dark text-base font-normal">
                {selectedContent[localizationKeys.relatedDocument]}
              </h3>

              <div className="max-w-md">
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  {/* Document Header */}
                  <div className="p-4 bg-white border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <BiSolidFilePdf className="w-8 h-8 text-red-500" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {selectedContent[localizationKeys.inspectionReport]}
                          </h4>
                          {/* <p className="text-xs text-gray-500 mt-0.5">
                            {selectedContent[localizationKeys.Pdfdocument]}
                          </p> */}
                        </div>
                      </div>
                      <a
                        href={relatedDocuments[0].imageLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-primary hover:bg-primary/80 transition-colors duration-300"
                      >
                        {selectedContent[localizationKeys.view]}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              <div className="flex flex-col items-start space-y-2">
                <p className="text-gray-med text-base font-normal">
                  {!CurrentBid
                    ? selectedContent[localizationKeys.startingBidAmount]
                    : selectedContent[localizationKeys.currentBid]}
                </p>
                <p className="text-gray-verydark font-bold text-2xl">
                  {formatCurrency(
                    lastestBid?.bidAmount || CurrentBid || startBidAmount
                  )}
                </p>
              </div>
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
                          : "border-primary text-primary  hover:bg-primary hover:text-white"
                      } mx-2 mr-8 border-[1px] w-full h-[48px] rounded-lg font-bold transition duration-300`}
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
          <div className="pt-6 flex flex-col space-y-4 md:space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex items-center space-x-2 w-full order-1 md:order-none">
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
                  className={`h-[48px] min-w-[48px] flex items-center justify-center rounded-lg transition-all duration-200 
    ${
      Number(submitBidValue) <=
      Number(lastestBid?.bidAmount || CurrentBid || startBidAmount)
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-primary/10 text-primary hover:bg-primary hover:text-white active:scale-95"
    }
    ${lang === "ar" ? "ml-2" : ""}`}
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
            opacity-100 ltr:font-serifEN rtl:font-serifAR text-base order-2 md:order-none"
              >
                {selectedContent[localizationKeys.submitBid]}
              </Button>
            </div>
            {(category === "Cars" || category === "سيارات") &&
              Math.max(
                Number(lastestBid?.bidAmount || 0),
                Number(CurrentBid || 0),
                Number(startBidAmount || 0),
                Number(submitBidValue || 0)
              ) < 5000 && (
                <div className="md:w-1/2 w-full">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-0 md:mt-3">
                    <p
                      className={`text-yellow-800 text-md text-center ${
                        lang === "ar" ? "md:text-right rtl" : "md:text-left ltr"
                      }`}
                    >
                      {
                        selectedContent[
                          localizationKeys
                            .above5000YouHaveToPayASecurityDepositToContinueBidding
                        ]
                      }
                    </p>
                  </div>
                </div>
              )}
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
