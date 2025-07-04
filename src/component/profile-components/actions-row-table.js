import React, { lazy, Suspense, useState } from "react";
import { truncateString } from "../../utils/truncate-string";
import AuctionsStatus from "../shared/status/auctions-status";
import emtyPhotosIcon from "../../../src/assets/icons/emty-photos-icon.svg";
import { useHistory } from "react-router-dom";
import { formatCurrency } from "../../utils/format-currency";
import moment from "moment";
import useCountdown from "../../hooks/use-countdown";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import routes from "../../routes";
import TotalBidsTableModel from "../auctions-details-components/total-bids-table-model";
import DeliveryIssueModal from "component/shared/DeliveryIssueModal/DeliveryIssueModal";
import BuyerObjectionModal from "component/shared/BuyerObjectionModal/BuyerObjectionModal";
import WarningModal from "component/shared/warningModal/WarningModal";
import SuccessModal from "component/shared/successModal/SuccessModal";
import DeliverysentModal from "component/shared/DeliveryModal/DeliveryModal";
import ContactDetails from "component/shared/contactDetailsModal/ContactDetails";
// const ContactDetails = lazy(() =>
//   import("component/shared/contactDetailsModal/ContactDetails")
// );

const ActionsRowTable = ({
  isBidsButtons,
  buttonActions,
  textButton,
  auctionsId,
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
  filterJoinState,
  isItemSendForDelivery,
  deliveryType,
  isBankStatementUploaded,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const [openContactDetailsModal, setContactDetailsModal] = useState(false);
  const [userType, setUserType] = useState("");
  const [openDeliveryIssueModal, setDeleveryIssueModal] = useState(false);
  const [openBuyerObjectionModal, setBuyerObjectionModal] = useState(false);
  const [openDeliverySentModal, setDeliverySentModal] = useState(false);
  const [openSuccessModal, setSuccessModal] = useState(false);
  const [openCancelAuctionModal, setCancelAuctionModal] = useState(false);
  const [cancelWarningMessage, setCancelWarningMessage] = useState("");
  const [openTotalBid, setOpenTotalBidsModel] = useState(false);
  const ending_Time = useCountdown(endingTime);
  const starting_Date = useCountdown(startingDate);
  const startingDateLeft = `${starting_Date.days} ${
    selectedContent[localizationKeys.days]
  } : ${starting_Date.hours} ${selectedContent[localizationKeys.hrs]} : ${
    starting_Date.minutes
  } ${selectedContent[localizationKeys.min]}`;
  const endingTimeLeft = `${ending_Time.days} ${
    selectedContent[localizationKeys.days]
  } : ${ending_Time.hours} ${selectedContent[localizationKeys.hrs]} : ${
    ending_Time.minutes
  } ${selectedContent[localizationKeys.min]} : ${
    ending_Time.seconds
  } ${selectedContent[localizationKeys.sec]}` 
  ;

  const handleContactDetailsModal = (userType) => {
    setUserType(userType);
    setContactDetailsModal(true);
  };
  return (
    <div className="bg-background drop-shadow rounded-lg py-4 px-4 mb-2 animate-in">
      <div className="flex flex-col lg:flex-row justify-between overflow-clip gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-28 h-48 sm:h-20 rounded-lg bg-[#F9F9F9] cursor-default">
            {img ? (
              <img
                className="w-full sm:w-28 h-48 sm:h-20 object-cover rounded-lg"
                src={img ? img : emtyPhotosIcon}
                alt="img"
              />
            ) : (
              <img
                className="w-8 h-8 mx-auto mt-7 object-cover rounded-lg"
                src={emtyPhotosIcon}
                alt="img"
              />
            )}
            <AuctionsStatus status={status} small absolute />
          </div>
          <div className="flex flex-col w-full lg:w-[400px]">
            <div>
              <h1 className="text-gray-dark text-sm font-medium">
                {truncateString(title, 80)}
              </h1>
              <p className="text-gray-med text-xs font-normal pt-1 ">
                {truncateString(description, 80)}
              </p>
            </div>
            {/* auctions */}
            {status === "ACTIVE" && (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.totalBids]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {totalBids}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.lastPrice]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(lastPrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.endingTime]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* 02 days.05 hrs.02 min */}
                    {endingTimeLeft}
                  </p>
                </div>
              </div>
            )}
            {status === "PENDING_OWNER_DEPOIST" && (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5 w-full  ">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal w-16">
                    {selectedContent[localizationKeys.endingTime]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal  ">
                    {formatCurrency(startingPrice)}
                  </p>
                </div>
                <div className="">
                  <h1 className="text-gray-veryLight text-[10px] font-normal w-20">
                    Creation Date
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* March,23 2023 */}
                    {moment(startingDate).local().format("MMMM, DD YYYY")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    window.localStorage.setItem("auctionId", auctionsId);
                    history.push(routes.app.createAuction.paymentDetails);
                  }}
                  className="bg-secondary-light text-white text-xs px-2 rounded h-6 my-auto cursor-pointer w-auto"
                >
                  {selectedContent[localizationKeys.pendingDeposit]}
                </button>
              </div>
            )}
            {status === "IN_SCHEDULED" && (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.startingPrice]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(startingPrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.purchasePrice]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(purchasePrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.startDate]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* 02 days.05 hrs.02 min */}
                    {startingDateLeft}
                  </p>
                </div>
              </div>
            )}
            {status === "EXPIRED" || status === "SOLD" ? (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.totalBids]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {totalBids}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.price]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(price)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.endingDate]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* March,23 2023 */}
                    {moment(endingDate).local().format("MMMM, DD YYYY")}
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}
            {status === "CANCELLED_AFTER_EXP_DATE" ||
              status === "CANCELLED_BEFORE_EXP_DATE" ? (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.totalBids]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {status}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.price]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(price)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.endingDate]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* March,23 2023 */}
                    {moment(endingDate).local().format("MMMM, DD YYYY")}
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* bids */}
            {status === "IN_PROGRESS" && (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.totalBids]}
                  </h1>
                  <p
                    onClick={() => setOpenTotalBidsModel(true)}
                    className="text-gray-dark text-[10px] font-normal underline cursor-pointer"
                  >
                    {totalBids}
                    {/* {selectedContent[localizationKeys.bid]} */}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.purchasePrice]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(lastPrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.endingTime]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* 02 days.05 hrs.02 min */}
                    {endingTimeLeft}
                  </p>
                </div>
              </div>
            )}

            {status === "PENDING_PAYMENT" ||
              status === "WAITING_FOR_DELIVERY" ||
              status === "PAYMENT_EXPIRED" ||
              status === "COMPLETED" ? (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div
                  className={
                    status === "WAITING_FOR_DELIVERY" ? "hidden" : "block"
                  }
                >
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.totalBids]}
                  </h1>
                  <p
                    onClick={() => setOpenTotalBidsModel(true)}
                    className="text-gray-dark text-[10px] font-normal underline cursor-pointer"
                  >
                    {totalBids}
                    {/* {selectedContent[localizationKeys.bid]} */}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.lastestPrice]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(lastPrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-red-dark text-[10px] font-normal">
                    {selectedContent[localizationKeys.endingTime]}
                  </h1>
                  <p className="text-red text-[10px] font-normal">
                    {/* 02 days.05 hrs.02 min */}
                    {status === "COMPLETED" || status === "PAYMENT_EXPIRED"
                      ? moment(endingDate).local().format("MMMM, DD YYYY")
                      : endingTimeLeft}
                  </p>
                </div>
                <div
                  className={status === "PAYMENT_EXPIRED" ? "block" : "hidden"}
                >
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    status
                  </h1>
                  {filterJoinState === "PAYMENT_EXPIRED" ? (
                    <p className="text-gray-verydark text-[10px] font-normal flex gap-x-1.5">
                      <p className="w-2 h-2 rounded-full bg-gray-verydark my-auto"></p>
                      <p>Payment Expired</p>
                    </p>
                  ) : (
                    <p className="text-[#B9BDCD] text-[10px] font-normal flex gap-x-1.5">
                      <p className="w-2 h-2 rounded-full bg-[#B9BDCD] my-auto"></p>
                      <p>Lost Auction</p>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 w-full">
          {status === "SOLD" && (
            <h1 className="cursor-default text-primary text-sm font-normal w-full sm:w-[145px] mt-2 sm:mt-14">
              <b>Delivery Type</b> :{" "}
              {deliveryType === "DELIVERY"
                ? "Delivery Will be handled by company"
                : deliveryType === "PICKUP"
                  ? "The buyer will pick up the item"
                  : "Not selected"}
            </h1>
          )}
        </div>
        {isBidsButtons ? (
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 w-full">
            {status === "WAITING_FOR_DELIVERY" && (
              <button
                onClick={() => setDeleveryIssueModal(true)}
                className="border-primary border text-primary text-sm font-normal w-full sm:w-[145px] py-2 rounded-lg"
              >
                {selectedContent[localizationKeys.AnyCompliants]}
              </button>
            )}
            {status === "WAITING_FOR_DELIVERY" && (
              <button
                onClick={() => handleContactDetailsModal("SELLER")}
                className="border-primary border text-primary text-sm font-normal w-full sm:w-[145px] py-2 rounded-lg"
              >
                {selectedContent[localizationKeys.sellerContactDetails]}
              </button>
            )}

            {status === "PENDING_PAYMENT" && isBankStatementUploaded && (
              <button
                className={`border-primary border text-primary text-sm font-normal font-si sm:w-[228px] w-full py-2 rounded-lg`}
              >
                Status : Bank statement submitted
              </button>
            )}

            {!isBankStatementUploaded && (
              <button
                onClick={buttonActions}
                className={`${textButton === "Delivery by company"
                    ? "border-secondery border text-primary font-bold cursor-auto"
                    : "border-primary border text-primary font-normal cursor-pointer"
                  } text-sm  w-full sm:w-[158px] py-2 rounded-lg`}
              >
                {textButton}
              </button>
            )}

            <button
              onClick={() => history.push(goToDetails)}
              className="bg-primary hover:bg-primary-dark text-white text-sm font-normal w-full sm:w-[128px] py-2 rounded-lg"
            >
              {selectedContent[localizationKeys.viewDetails]}
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 w-full sm:mt-10 sm:h-10">
            {status === "COMPLETED" && (
              <button
                onClick={() => setBuyerObjectionModal(true)}
                className="border-primary border text-primary text-sm font-normal w-full sm:w-[145px] py-2 rounded-lg"
              >
                {selectedContent[localizationKeys.AnyObjection]}
              </button>
            )}
            {(status === "ACTIVE" || status === "PENDING_OWNER_DEPOIST" || status === "IN_SCHEDULED") && (
              <button
                onClick={() => {
                  setCancelAuctionModal(true);
                  Number(totalBids) > 0
                    ? setCancelWarningMessage(
                        selectedContent[
                          localizationKeys.CancellAuctionWarningMessageWithBidders
                        ]
                      )
                    : setCancelWarningMessage(
                        selectedContent[
                          localizationKeys.CancellAuctionWarningMessageWithZeroBidders
                        ]
                      );
                }}
                className="border-primary border text-primary text-sm font-normal w-full sm:w-[145px] py-2 rounded-lg"
              >
                {selectedContent[localizationKeys.cancelTheAuction]}
              </button>
            )}
            {(status === 'ACTIVE' || status === 'IN_SCHEDULED') && (
              <button
                className="bg-primary text-white text-sm font-normal px-8 py-2 rounded-lg transition hover:bg-primary-dark"
                onClick={() => {
                  const navigationState = {
                    auctionId: auctionsId,
                    isEditing: true
                  };
                  history.replace({
                    pathname: routes.app.createAuction.productDetails,
                    state: navigationState
                  });
                }}
              >
                {selectedContent[localizationKeys.edit]}
              </button>
            )}
            <button
              onClick={() => history.push(goToDetails)}
              className="bg-primary-dark hover:bg-primary text-white text-sm font-normal w-full sm:w-[128px] py-2 rounded-lg"
            >
              {selectedContent[localizationKeys.viewDetails]}
            </button>
            {status === "WAITING_FOR_PAYMENT" && (
              <button
                onClick={() => {
                  setCancelAuctionModal(true);
                  setCancelWarningMessage(
                    selectedContent[
                      localizationKeys.CancellAuctionWarningMessageWithBidders
                    ]
                  );
                }}
                className="border-primary border text-primary text-sm font-normal px-4 py-2 rounded-lg transition hover:bg-primary hover:text-white "
              >
                {selectedContent[localizationKeys.cancelTheAuction]}
              </button>
            )}
            {status === "SOLD" && (
              <button
                onClick={() => handleContactDetailsModal("BUYER")}
                className="border-primary border text-primary text-sm font-normal w-full sm:w-[145px] py-2 rounded-lg"
              >
                {selectedContent[localizationKeys.buyerContactDetails]}
              </button>
            )}
            {/* {status === "SOLD" && !isItemSendForDelivery && (
              <button
                onClick={() => setDeliverySentModal(true)}
                className="border-primary border-[1px] text-primary mx-3 text-sm font-normal sm:w-[145px] w-full sm:h-8 h-10 rounded-lg sm:mt-14 mt-5 "
              >
                Is Item Sent?
              </button>
            )} */}
            {/* {status === "SOLD" && isItemSendForDelivery && (
              <button className="border-primary cursor-default border-[1px] text-primary mx-3 text-sm font-normal sm:w-[145px] w-full sm:h-8 h-10 rounded-lg sm:mt-14 mt-5 ">
                You have sent the item.
              </button>
            )} */}

            {status === "PENDING_OWNER_DEPOIST" && (
              <button
                onClick={() => {
                  window.localStorage.setItem("auctionId", auctionsId);
                  history.push(routes.app.createAuction.paymentDetails);
                }}
                className="border-primary border text-primary text-sm font-normal w-full sm:w-[145px] py-2 rounded-lg"
              >
                {selectedContent[localizationKeys.completePayment]}
              </button>
            )}
          </div>
        )}
      </div>
      <TotalBidsTableModel
        auctionsIdB={auctionsId}
        setOpen={setOpenTotalBidsModel}
        open={openTotalBid}
      />
      <DeliveryIssueModal
        auctionId={auctionsId}
        open={openDeliveryIssueModal}
        setOpen={setDeleveryIssueModal}
      />

      <BuyerObjectionModal
        auctionId={auctionsId}
        open={openBuyerObjectionModal}
        setOpen={setBuyerObjectionModal}
      />
      <WarningModal
        auctionId={auctionsId}
        open={openCancelAuctionModal}
        setOpen={setCancelAuctionModal}
        setSuccessModal={setSuccessModal}
        message={cancelWarningMessage}
      />
      <SuccessModal
        open={openSuccessModal}
        setOpen={setSuccessModal}
        message={
          selectedContent[localizationKeys.YouSuccessfullyCancelledTheAuction]
        }
        returnUrl={routes.app.profile.myAuctions.active}
      />
      <DeliverysentModal
        auctionId={auctionsId}
        open={openDeliverySentModal}
        setOpen={setDeliverySentModal}
        setSuccessModal={setSuccessModal}
      />
      <ContactDetails
        open={openContactDetailsModal}
        onClose={() => setContactDetailsModal(false)}
        userType={userType}
        auctionId={auctionsId}
      />
      {/* <Suspense fallback={<div>Loading...</div>}>
      <ContactDetails
        open={openContactDetailsModal}
        onClose={() => setContactDetailsModal(false)}
        userType={userType}
        auctionId={auctionsId}
      />
        </Suspense> */}
    </div>
  );
};

export default React.memo(ActionsRowTable);
