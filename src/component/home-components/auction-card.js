import React, { useEffect, useState, memo } from "react";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { RiShareForwardFill } from "react-icons/ri";
import { socketAuctionId } from "redux-store/socket-auctionId-slice";
import { useDispatch } from "react-redux";
import { useAuthState } from "../../context/auth-context";
import { formatCurrency } from "../../utils/format-currency";
import { Open } from "../../redux-store/auth-model-slice";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import { toast } from "react-hot-toast";
import api from "../../api";
import useCountdown from "../../hooks/use-countdown";
import routes from "../../routes";
import { useHistory } from "react-router-dom";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import moment from "moment";
import { truncateString } from "../../utils/truncate-string";
import AuctionsStatus from "component/shared/status/auctions-status";
import { useSocket } from "context/socket-context";
import expiredImg from "../../../src/assets/images/expired auction-03.svg";
const CountdownDisplay = memo(
  ({ timeLeft, status, formattedstartDate, selectedContent }) => {
    const formattedTimeLeft = `${timeLeft.days} ${
      selectedContent[localizationKeys.days]
    } : ${timeLeft.hours} ${selectedContent[localizationKeys.hrs]} : 
    ${timeLeft.minutes} ${selectedContent[localizationKeys.min]} : 
    ${timeLeft.seconds} ${selectedContent[localizationKeys.sec]}`;

    return (
      <p
        className={`${
          timeLeft.days === 0 ? "text-red" : "text-gray-dark"
        } font-medium text-xs md:text-sm`}
      >
        {status === "IN_SCHEDULED" ? formattedstartDate : formattedTimeLeft}
      </p>
    );
  }
);

const AuctionCard = ({
  title,
  adsImg,
  status,
  totalBods,
  endingTime,
  WatshlistState,
  watshlistForceState,
  auctionId,
  isBuyNowAllowed,
  isMyAuction,
  onReload,
  StartDate,
  isPurchased,
  PurchasedTime,
  isExpired,
  CurrentBid,
  startBidAmount,
  latestBidAmount,
  hideButton,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { user } = useAuthState();
  const dispatch = useDispatch();
  const history = useHistory();
  const { run } = useAxios([]);
  const [isWatshlist, setWatshlist] = useState(WatshlistState);
  const socket = useSocket();
  const timeLeft = useCountdown(endingTime);
  const startDate = useCountdown(StartDate);

  const formattedBid = formatCurrency(
    latestBidAmount || CurrentBid || startBidAmount
  );

  const formattedstartDate = `${startDate.days} ${
    selectedContent[localizationKeys.days]
  } : ${startDate.hours} ${selectedContent[localizationKeys.hrs]} : ${
    startDate.minutes
  } ${selectedContent[localizationKeys.min]}: ${startDate.seconds} ${
    selectedContent[localizationKeys.sec]
  }`;

  useEffect(() => {
    if (WatshlistState) setWatshlist(WatshlistState);
  }, [WatshlistState]);

  useEffect(() => {
    dispatch(socketAuctionId(auctionId));
  }, [auctionId, dispatch]);

  useEffect(() => {
    if (!socket) return;

    // const handleBidSubmitted = (data) => {
    //   if (data.auctionId === auctionId) {
    //     console.log("Bid submitted for auction:", auctionId);
    //   }
    // };

    socket.on("bid:submitted");
    return () => {
      socket.off("bid:submitted");
    };
  }, [socket, auctionId]);

  const getDomain = () => {
    const { protocol, hostname, port } = window.location;
    return port
      ? `${protocol}//${hostname}:${port}`
      : `${protocol}//${hostname}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: { title },
          text: "Check out this auction!",
          url: `${getDomain()}/alletre/home/${auctionId}/details`,
        });
      } catch (error) {
        console.error("Error sharing post:", error);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  const handelAddNewWatshlist = (auctionId) => {
    if (user) {
      const body = {
        auctionId: auctionId,
      };
      if (watshlistForceState || isWatshlist) {
        run(
          authAxios
            .delete(api.app.WatchList.delete(auctionId))
            .then((res) => {
              setWatshlist(false);
              toast.success(
                selectedContent[
                  localizationKeys
                    .thisAuctionDeleteFromWatchListBeenSuccessfully
                ]
              );
              onReload();
            })
            .catch((err) => {
              onReload();
            })
        );
      } else {
        run(
          authAxios
            .post(api.app.WatchList.add, body)
            .then((res) => {
              setWatshlist(true);
              toast.success(
                selectedContent[
                  localizationKeys.thisAuctionAddToWatchListBeenSuccessfully
                ]
              );
              onReload();
            })
            .catch((err) => {
              onReload();
            })
        );
      }
    } else {
      dispatch(Open());
      onReload();
    }
  };

  const handelGoDetails = (id) => {
    if (isMyAuction) {
      if (status === "ACTIVE") {
        history.push(routes.app.profile.myAuctions.activeDetails(id));
      }
      if (status === "IN_SCHEDULED") {
        history.push(routes.app.profile.myAuctions.scheduledDetails(id));
      }
      if (status === "SOLD") {
        history.push(routes.app.profile.myAuctions.soldDetails(id));
      }
      if (status === "PENDING_OWNER_DEPOIST") {
        history.push(routes.app.profile.myAuctions.pendingDetails(id));
      }
      if (status === "EXPIRED") {
        history.push(routes.app.profile.myAuctions.activeDetails(id));
      }
    } else history.push(routes.app.homeDetails(id));
  };

  const isStartDateZero =
    startDate.days === 0 &&
    startDate.hours === 0 &&
    startDate.minutes === 0 &&
    startDate.seconds === 0;

  const isEndDateZero =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (status === "IN_SCHEDULED" && isStartDateZero) {
    return null;
  } else if (status === "ACTIVE" && isEndDateZero) {
    return null;
  }

  return (
    <div className="group w-full max-w-[240px] h-full flex flex-col rounded-lg border border-gray-200 hover:border-primary shadow-md hover:shadow-lg p-2 sm:p-4 cursor-pointer">
      <div className="w-full group rounded-lg bg-[#F9F9F9] relative overflow-hidden aspect-[16/10]">
        <div className="relative group">
          <div
            className={`absolute top-0 ${
              lang === "ar" ? "left-0" : "right-0"
            } z-20 flex items-center ${
              lang === "ar" ? "gap-2" : "space-x-1 sm:space-x-2"
            } opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          >
            {!isMyAuction && (
              <button
                onClick={() => handelAddNewWatshlist(auctionId)}
                className="border-primary border-2 bg-white/90 rounded-lg w-8 h-9 md:w-11 md:h-12 group/watchlist hover:bg-primary transition-all duration-300 flex items-center justify-center"
              >
                {isWatshlist ? (
                  <BsBookmarkFill className="text-primary group-hover/watchlist:text-white text-lg sm:text-xl" />
                ) : (
                  <BsBookmark className="text-primary group-hover/watchlist:text-white text-lg sm:text-xl" />
                )}
              </button>
            )}
            <div
              onClick={handleShare}
              className="border-primary border-2 bg-white/90 rounded-lg w-8 h-9 md:w-11 md:h-12 hover:bg-primary group/share transition-all duration-300 flex items-center justify-center"
            >
              <RiShareForwardFill className="text-primary group-hover/share:text-white text-lg sm:text-2xl" />
            </div>
          </div>
        </div>

        <img
          onClick={() => handelGoDetails(auctionId)}
          className="w-full h-full object-scale-down group-hover:scale-110 duration-300 ease-in-out transform"
          src={adsImg}
          alt="adsImg"
        />

        <div
          onClick={() => handelGoDetails(auctionId)}
          className="price-button absolute top-0 bg-[#e04868] text-white text-xs px-2 h-6 flex items-center"
        >
          {formattedBid}
        </div>
      </div>

      <h1
        onClick={() => handelGoDetails(auctionId)}
         className="text-gray-dark font-medium text-sm pt-3 mb-2 min-h-[40px] line-clamp-2 overflow-hidden"
      >
        {truncateString(title, 75)}
      </h1>

      <div
        className="flex flex-col flex-grow"
        onClick={() => handelGoDetails(auctionId)}
      >
        <AuctionsStatus status={status} small />
        <div className="grid grid-cols-2 gap-4 mt-2 items-center text-xs">
          <div className="flex flex-col">
            <h6 className="text-gray-500 font-medium -mt-5">
              {selectedContent[localizationKeys.totalBids]}
            </h6>
            <p className="text-gray-800 font-semibold">
              {totalBods || 0} {selectedContent[localizationKeys.bid]}
            </p>
          </div>

          {hideButton ? (
            <img
              className="object-cover"
              src={expiredImg}
              alt="Footer Banner"
            />
          ) : (
            <div className="flex flex-col items-start min-h-[68px]">
              <h6 className="text-gray-500 font-medium">
                {status === "IN_SCHEDULED"
                  ? selectedContent[localizationKeys.startDate]
                  : status === "SOLD"
                  ? "Purchased Time"
                  : selectedContent[localizationKeys.endingTime]}
              </h6>
              {status === "SOLD" ? (
                <p className="text-gray-800 font-sm">
                  {moment(PurchasedTime).local().format("MMMM, DD YYYY")}
                </p>
              ) : (
                <CountdownDisplay
                  timeLeft={timeLeft}
                  status={status}
                  formattedstartDate={formattedstartDate}
                  selectedContent={selectedContent}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto pt-3">
        {isMyAuction ? (
          <div
            className={isPurchased || isExpired ? "hidden" : "flex justify-end"}
          >
            {!hideButton && (
              <button
                onClick={() => handelGoDetails(auctionId)}
                className="bg-primary hover:bg-primary-dark text-white rounded-lg w-full w-full sm:w-auto h-[30px] sm:h-[33px] px-4 sm:px-6 text-sm flex items-center justify-center transition-all duration-300"
              >
                {selectedContent[localizationKeys.viewDetails]}
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              isPurchased || isExpired
                ? "hidden"
                : `flex flex-col sm:flex-row gap-y-3 sm:gap-x-3 ${!hideButton && !isBuyNowAllowed ? "sm:justify-end" : ""}`
            }
          >
            {!hideButton && isBuyNowAllowed && (
              <button
                onClick={() => handelGoDetails(auctionId)}
                className="border-primary border-[1px] text-primary w-full sm:w-auto h-[30px] sm:h-[33px] px-4 sm:px-6 text-sm flex items-center justify-center rounded-lg transition-all duration-300 hover:bg-primary hover:text-white"
              >
                {selectedContent[localizationKeys.buyNow]}
              </button>
            )}
            {!hideButton && (
              <button
                onClick={() => handelGoDetails(auctionId)}
                className="bg-primary hover:bg-primary-dark text-white rounded-lg w-full sm:w-auto h-[30px] sm:h-[33px] px-4 sm:px-6 text-sm flex items-center justify-center transition-all duration-300"
              >
                {selectedContent[localizationKeys.bidNow]}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(AuctionCard);
