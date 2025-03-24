import React, { useEffect, useState, memo } from "react";
import {
  BsBookmarkFill,
  BsBookmark,
  BsPlayCircleFill,
} from "react-icons/bs";
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
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

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
  usageStatus,
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
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [preloadedVideos, setPreloadedVideos] = useState(new Set());

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNext();
    }
    if (touchEnd - touchStart > 75) {
      handlePrevious();
    }
  };

  const handleNext = () => {
    if (!Array.isArray(adsImg) || !adsImg.length) return;
    setIsLoading(true);
    const nextIndex = (currentImageIndex + 1) % adsImg.length;
    setCurrentImageIndex(nextIndex);
  };

  const handlePrevious = () => {
    if (!Array.isArray(adsImg) || !adsImg.length) return;
    setIsLoading(true);
    const prevIndex = currentImageIndex === 0 ? adsImg.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (!Array.isArray(adsImg) || adsImg.length <= 1) return;

    const preloadVideo = (index) => {
      if (index < 0 || index >= adsImg.length) return;
      
      const item = adsImg[index];
      if (!item?.imagePath?.match(/\.(mp4|mov|webm|avi)$/i)) return;
      if (preloadedVideos.has(item.imageLink)) return;

      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = item.imageLink;
      
      setPreloadedVideos(prev => new Set([...prev, item.imageLink]));
    };

    const nextIndex = (currentImageIndex + 1) % adsImg.length;
    preloadVideo(nextIndex);
    
    const prevIndex = currentImageIndex === 0 ? adsImg.length - 1 : currentImageIndex - 1;
    preloadVideo(prevIndex);
  }, [currentImageIndex, adsImg, preloadedVideos]);

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
      <div className="w-full group rounded-lg bg-[#F9F9F9] relative overflow-hidden aspect-[10/10]">
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

        <div
          className="relative w-full h-full group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {isLoading && (
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 z-10">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {Array.isArray(adsImg) &&
          adsImg.length > 0 &&
          adsImg[currentImageIndex]?.imageLink ? (
            <>
              {adsImg[currentImageIndex].imagePath.match(
                /\.(mp4|mov|webm|avi)$/i
              ) ? (
                <div className="relative w-full h-full group/video">
                  <video
                    key={adsImg[currentImageIndex].imageLink}
                    onClick={() => handelGoDetails(auctionId)}
                    className="w-full h-full object-cover cursor-pointer"
                    preload="metadata"
                    playsInline
                    muted
                    onLoadedMetadata={() => setIsLoading(false)}
                    onLoadStart={() => setIsLoading(true)}
                  >
                    <source
                      src={adsImg[currentImageIndex].imageLink}
                      type="video/mp4"
                    />
                  </video>
                  <div onClick={(e) => {
                      e.stopPropagation();
                      handelGoDetails(auctionId);
                    }} className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/video:bg-black/50 transition-all duration-300 cursor-pointer z-[5]">
                    <BsPlayCircleFill onClick={(e) => {
                      e.stopPropagation();
                      handelGoDetails(auctionId);
                    }} className="text-white text-4xl opacity-70 group-hover/video:opacity-100 transition-opacity duration-300 cursor-pointer" />
                  </div>
                </div>
              ) : (
                <img
                  onClick={() => handelGoDetails(auctionId)}
                  className="w-full h-full object-cover transition-transform duration-300"
                  src={adsImg[currentImageIndex].imageLink}
                  alt={`Product ${currentImageIndex + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "fallback-image-url.jpg"; // You can add a fallback image URL here
                  }}
                  onLoad={handleImageLoad}
                />
              )}

              {adsImg.length > 1 && (
                <>
                  <div className="absolute inset-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevious();
                      }}
                      className="absolute z-[5] left-2 top-1/2 -translate-y-1/2 bg-primary/60 hover:bg-primary px-0.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-7 sm:block hidden"
                    >
                      <MdNavigateBefore className="flex justify-center text-white text-md item-center" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="absolute z-[5] right-2 top-1/2 -translate-y-1/2 bg-primary/60 hover:bg-primary px-0.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-7 sm:block hidden"
                    >
                      <MdNavigateNext className="flex justify-center text-white text-md item-center" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {adsImg.map((_, index) => (
                      <div
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          index === currentImageIndex
                            ? "bg-primary w-3"
                            : "bg-white/80 hover:bg-white"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : null}
        </div>

        <div
          onClick={() => handelGoDetails(auctionId)}
          className="price-button absolute top-0 bg-[#e04868] text-white text-xs px-2 h-6 flex items-center z-10"
        >
          {formattedBid}
        </div>
      </div>

      <div className="flex items-center justify-between gap-x-2">
        <h1
          onClick={() => handelGoDetails(auctionId)}
          className="text-gray-dark font-medium text-sm pt-3  min-h-[30px] line-clamp-2 overflow-hidden"
        >
          {truncateString(title, 75)}
        </h1>
        <div
          className={`state-button px-2 py-0.5 rounded-md text-xs font-medium text-white transition-colors ${
            usageStatus === "NEW"
              ? "bg-primary-light hover:bg-primary bg-opacity-70"
              : "bg-gray-dark hover:bg-gray-verydark bg-opacity-80"
          }`}
        >
          {usageStatus?.charAt(0).toUpperCase() +
            usageStatus?.slice(1).toLowerCase()}
        </div>
      </div>
      <div
        className="flex flex-col flex-grow"
        onClick={() => handelGoDetails(auctionId)}
      >
        <AuctionsStatus status={status} small />
        <div className="grid grid-cols-2 gap-4 mt-1 items-center text-xs">
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
      <div className="mt-auto">
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
                : `flex flex-col sm:flex-row gap-y-3 sm:gap-x-3 ${
                    !hideButton && !isBuyNowAllowed ? "sm:justify-end" : ""
                  }`
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
