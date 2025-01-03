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
        } font-medium md:text-[10px] text-[8px] `}
      >
        {status === "IN_SCHEDULED" ? formattedstartDate : formattedTimeLeft}
      </p>
    );
  }
);

const AuctionCard = ({
  price,
  title,
  adsImg,
  status,
  totalBods,
  endingTime,
  bidNow,
  WatshlistState,
  watshlistForceState,
  auctionId,
  className,
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
  const { run, isLoading } = useAxios([]);
  const [isWatshlist, setWatshlist] = useState(WatshlistState);
  const [latestBid, setlatestBid] = useState(latestBidAmount);
  const socket = useSocket();
  console.log("status1111", status);
  const timeLeft = useCountdown(endingTime);
  // const formattedTimeLeft = `${timeLeft.days} ${
  //   selectedContent[localizationKeys.days]
  // } :
  // ${timeLeft.hours} ${selectedContent[localizationKeys.hrs]} :
  // ${timeLeft.minutes} ${selectedContent[localizationKeys.min]} `;

  const formattedBid = formatCurrency(
    latestBid || CurrentBid || startBidAmount
  );

  const startDate = useCountdown(StartDate);

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

  // dispatch(socketAuctionId(auctionId));
  useEffect(() => {
    dispatch(socketAuctionId(auctionId));
  }, [auctionId]);

  useEffect(() => {
    if (socket) {
      const handleBidSubmitted = (data) => {
        if (data && data.bidAmount && data.bidAmount !== latestBid) {
          setlatestBid(data.bidAmount);
        }
      };

      return () => {
        socket.off("bid:submitted", handleBidSubmitted);
      };
    }
  }, [socket, latestBid]);

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
          title,
          text: title,
          // url: `https://www.alletre.com/alletre/home/${auctionId}/details`,
          url: `${getDomain()}/alletre/home/${auctionId}/details`,
        });
        console.log("Post shared successfully!");
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

  return (
    <div className={className}>
      <div className="group lg:w-[272px] l:w-[367px]  md:h-auto h-[335px] rounded-2xl hover:border-primary border-transparent border-[1px] shadow p-4 cursor-pointer">
        <div className="lg:w-[240px] l:w-[335px]  md:h-[165px] h-[120px] rounded-2xl mx-auto round bg-[#F9F9F9] relative overflow-hidden">
          <div className="absolute top-3 right-1 z-20 flex items-center space-x-2">
            {!isMyAuction && (
              <button
                onClick={() => handelAddNewWatshlist(auctionId)}
                className="border-primary border-2 border-solid bg-white group/watchlist rounded-xl md:w-[38px] w-[28px] md:h-[44px] h-[32px] hover:bg-primary transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                {isWatshlist ? (
                  <BsBookmarkFill className="text-primary  group-hover/watchlist:text-white text-2xl md:text-3xl" />
                ) : (
                  <BsBookmark className="text-primary  group-hover/watchlist:text-white text-2xl md:text-3xl" />
                )}
              </button>
            )}
            <div
              onClick={handleShare}
              className="border-primary border-2 border-solid bg-white rounded-xl md:w-[38px] w-[28px] md:h-[44px] h-[32px] hover:bg-primary  group/share transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              <RiShareForwardFill className="text-primary group-hover/share:text-white transition-all duration-300 text-2xl md:text-3xl" />
            </div>
          </div>
          <img
            onClick={() => handelGoDetails(auctionId)}
            className="w-full h-full mx-auto  object-cover group-hover:scale-110 duration-300 ease-in-out transform  "
            src={adsImg}
            alt="adsImd"
          />
          <div
            onClick={() => handelGoDetails(auctionId)}
            className="price-button absolute bg-orang text-white text-[10px] top-0 w-auto px-1 h-[24px] flex justify-center items-center"
          >
            {formattedBid}
          </div>
        </div>
        <h1
          onClick={() => handelGoDetails(auctionId)}
          className="text-gray-dark font-medium text-sm pt-3 mb-2 h-10"
        >
          {truncateString(title, 75)}
        </h1>
        <div onClick={() => handelGoDetails(auctionId)}>
          <AuctionsStatus status={status} small />
          <div className="flex justify-between mt-2 ">
            <div>
              <h6 className="text-gray-med font-normal md:text-[10px] text-[8px]">
                {selectedContent[localizationKeys.totalBids]}
              </h6>
              <p className="text-gray-dark font-medium md:text-[10px] text-[8px]">
                {totalBods || 0} {selectedContent[localizationKeys.bid]}
              </p>
            </div>
            <div>
              <h6 className="text-gray-med font-normal md:text-[10px] text-[8px]">
                {status === "IN_SCHEDULED"
                  ? selectedContent[localizationKeys.startDate]
                  : status === "SOLD"
                  ? "Purchased Time"
                  : selectedContent[localizationKeys.endingTime]}
              </h6>
              {status === "SOLD" ? (
                <p className="font-medium md:text-[10px] text-[8px]  text-gray-dark">
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
          </div>
          {isMyAuction ? (
            <div
              className={
                isPurchased || isExpired
                  ? "hidden"
                  : "mt-4 flex gap-x-3 justify-end"
              }
            >
              {!hideButton && (
                <button
                  onClick={() => handelGoDetails(auctionId)}
                  className="bg-primary hover:bg-primary-dark text-white md:w-[128px] w-full h-[32px] rounded-lg"
                >
                  {selectedContent[localizationKeys.viewDetails]}
                </button>
              )}
            </div>
          ) : (
            <div
              className={` ${
                isPurchased || isExpired
                  ? "hidden"
                  : "mt-4 flex gap-x-3 justify-end"
              }  ${
                isBuyNowAllowed ? "justify-between" : "justify-end"
              } mt-4 flex flex-col md:flex-row gap-x-3 gap-y-3`}
            >
              {!hideButton && isBuyNowAllowed && (
                <button
                  onClick={() => handelGoDetails(auctionId)}
                  className="border-primary border-[1px] text-primary md:w-[128px] w-full h-[32px] rounded-lg"
                >
                  {selectedContent[localizationKeys.buyNow]}
                </button>
              )}
              {!hideButton && (
                <button
                  onClick={() => handelGoDetails(auctionId)}
                  className="bg-primary hover:bg-primary-dark text-white md:w-[128px] w-full h-[32px] rounded-lg"
                >
                  {selectedContent[localizationKeys.bidNow]}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(AuctionCard);
