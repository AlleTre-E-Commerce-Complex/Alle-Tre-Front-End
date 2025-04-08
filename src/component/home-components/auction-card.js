import React, { useEffect, useState, memo } from "react";
import { BsBookmarkFill, BsBookmark, BsPlayCircleFill } from "react-icons/bs";
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
import Hummer from "../../../src/assets/icons/bid.png";
import Timer from "../../../src/assets/icons/time.png";
import HummerGif from "../../../src/assets/icons/HummerGifFin.gif";
import TimmerGif from "../../../src/assets/icons/timer2.gif"
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const CountdownDisplay = memo(
  ({ timeLeft, status, formattedstartDate, selectedContent }) => {
    const formattedTimeLeft = `${timeLeft.days} ${selectedContent[localizationKeys.days]
      } : ${timeLeft.hours} ${selectedContent[localizationKeys.hrs]} : 
    ${timeLeft.minutes} ${selectedContent[localizationKeys.min]} : 
    ${timeLeft.seconds} ${selectedContent[localizationKeys.sec]}`;

    return (
      <p
        className={`${timeLeft.days === 0 ? "text-red" : "text-gray-800"
          } font-medium text-[10px] md:text-xs`}
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
    const prevIndex =
      currentImageIndex === 0 ? adsImg.length - 1 : currentImageIndex - 1;
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

      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = item.imageLink;

      setPreloadedVideos((prev) => new Set([...prev, item.imageLink]));
    };

    const nextIndex = (currentImageIndex + 1) % adsImg.length;
    preloadVideo(nextIndex);

    const prevIndex =
      currentImageIndex === 0 ? adsImg.length - 1 : currentImageIndex - 1;
    preloadVideo(prevIndex);
  }, [currentImageIndex, adsImg, preloadedVideos]);

  const formattedBid = formatCurrency(
    latestBidAmount || CurrentBid || startBidAmount
  );

  const formattedstartDate = `${startDate.days} ${selectedContent[localizationKeys.days]
    } : ${startDate.hours} ${selectedContent[localizationKeys.hrs]} : ${startDate.minutes
    } ${selectedContent[localizationKeys.min]}: ${startDate.seconds} ${selectedContent[localizationKeys.sec]
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
    <div className="group w-full max-w-[240px] sm:max-w-[280px] h-[400px] sm:h-[420px] rounded-lg bg-white border border-gray-100 hover:border-primary hover:border-opacity-20 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden p-1.5 sm:p-2">
      <div className="relative w-full h-[63%]  bg-primary-veryLight rounded-lg">
        <div className="relative group">
          <div
            className={`absolute top-2 ${lang === "ar" ? "left-2" : "right-2"
              } z-20 flex items-center ${lang === "ar" ? "gap-2" : "space-x-2"
              } opacity-100 transition-opacity duration-300`}
          >
            {!isMyAuction && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handelAddNewWatshlist(auctionId);
                }}
                className="border-primary border-2 bg-white/95 shadow-md rounded-full w-7 h-7 sm:w-8 sm:h-8 hover:bg-primary group/watchlist transition-all duration-300 cursor-pointer flex items-center justify-center active:scale-95"
              >
                {isWatshlist ? (
                  <BsBookmarkFill className="text-primary group-hover/watchlist:text-white text-xs sm:text-sm" />
                ) : (
                  <BsBookmark className="text-primary group-hover/watchlist:text-white text-xs sm:text-sm" />
                )}
              </button>
            )}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="border-primary border-2 bg-white/95 shadow-md rounded-full w-7 h-7 sm:w-8 sm:h-8 hover:bg-primary group/share transition-all duration-300 cursor-pointer flex items-center justify-center active:scale-95"
            >
              <RiShareForwardFill className="text-primary group-hover/share:text-white text-xs sm:text-sm" />
            </div>
          </div>
        </div>

        <div
          className="relative w-full h-full group touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => handelGoDetails(auctionId)}
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
                <div className="relative w-full h-full group/video rounded-lg">
                  <video
                    key={adsImg[currentImageIndex].imageLink}
                    onClick={() => handelGoDetails(auctionId)}
                    className="w-full h-full object-cover cursor-pointer rounded-lg"
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
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/video:bg-black/50 transition-all duration-300 cursor-pointer z-[5] rounded-lg">
                    <BsPlayCircleFill className="text-white text-4xl opacity-70 group-hover/video:opacity-100 transition-opacity duration-300 cursor-pointer" />
                  </div>
                </div>
              ) : (
                <img
                  onClick={() => handelGoDetails(auctionId)}
                  className="w-full h-full object-cover transition-transform duration-300 rounded-lg"
                  src={adsImg[currentImageIndex].imageLink}
                  alt={`Product ${currentImageIndex + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "fallback-image-url.jpg";
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
                      className="absolute z-[5] left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-primary/70 hover:bg-primary px-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity duration-300 h-6 sm:h-7 flex items-center justify-center"
                    >
                      <MdNavigateBefore className="text-white text-base sm:text-lg" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="absolute z-[5] right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-primary/70 hover:bg-primary px-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity duration-300 h-6 sm:h-7 flex items-center justify-center"
                    >
                      <MdNavigateNext className="text-white text-base sm:text-lg" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {adsImg.map((_, index) => (
                      <div
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentImageIndex
                          ? "bg-primary w-2.5 sm:w-3"
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

        <div className="absolute top-0  z-20 bg-gradient-to-r from-primary to-primary-light px-2 py-1 sm:px-3 sm:py-2 rounded-md shadow-sm backdrop-blur-sm bg-opacity-75">
          <span className="text-white font-medium text-[11px] sm:text-sm flex items-center">
            <span className="text-white/80 text-[9px] sm:text-xs mr-1">
              AED
            </span>
            {formattedBid.replace("AED", "")}
          </span>
        </div>
      </div>

      <div className="flex flex-col h-[40%] justify-between py-1.5 sm:py-2">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-start justify-between gap-1.5 sm:gap-2">
            <h1
              onClick={() => handelGoDetails(auctionId)}
              className="text-gray-dark font-medium text-sm sm:text-sm line-clamp-2 hover:text-primary transition-colors duration-200 h-[2.8em] sm:h-11"
            >
              {truncateString(title, 50)}
            </h1>
            <div
              className={`state-button shrink-0 px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-xs font-medium transition-colors ${usageStatus === "NEW"
                ? "bg-primary-veryLight text-primary"
                : "bg-gray-100 text-gray-700"
                }`}
            >
              {usageStatus?.charAt(0).toUpperCase() +
                usageStatus?.slice(1).toLowerCase()}
            </div>
          </div>

          <AuctionsStatus status={status} small />
          <div className="flex justify-between items-center gap-0.5 mt-4 sm:mt-1">
            <div className="flex items-center gap-1">
              {hideButton ? (
                <img
                  className="w-20 h-20 sm:w-24 sm:h-16 object-contain"
                  src={expiredImg}
                  alt="Footer Banner"
                />
              ) : (
                <div className="flex items-center gap-1">
                  <h6 className="text-gray-500 font-medium inline-flex items-center">
                    {status === "IN_SCHEDULED" ? (
                      <img
                        className="w-4 h-4 object-contain mb-0.5 sm:mb-1"
                        src={Timer}
                        alt="Footer Banner"
                      />
                    ) : status === "SOLD" ? (
                      "Purchased Time"
                    ) : (
                      <img
                         className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] object-contain"
                        src={TimmerGif}
                        alt="Footer Banner"
                       
                      />
                    )}
                  </h6>
                  {status === "SOLD" ? (
                    <p className="text-gray-800 text-[10px] sm:text-xs">
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
            <div className="flex items-center gap-0.5 sm:gap-1">
              {status === "IN_SCHEDULED" || status === "SOLD" || status === "EXPIRED"  ? <img
                src={Hummer}
                alt="Gavel Icon"
                className="w-3 h-3 sm:w-4 sm:h-4 object-contain"
              /> : <img
                src={HummerGif}
                alt="Gavel Icon"
               className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] object-contain"
              />}
              <p className="text-gray-800 font-semibold text-[10px] sm:text-xs inline-block">
                {totalBods || 0}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-1 sm:pt-2">
            {isMyAuction ? (
              <div
                className={
                  isPurchased || isExpired ? "hidden" : "flex justify-end"
                }
              >
                {!hideButton && (
                  <button
                    onClick={() => handelGoDetails(auctionId)}
                    className="bg-primary-veryLight text-primary hover:bg-primary hover:text-white rounded-lg w-full py-1.5 sm:py-2 text-[11px] sm:text-sm font-medium transition-all duration-200 flex items-center justify-center active:scale-95"
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
                    : `flex gap-2 ${!hideButton && !isBuyNowAllowed ? "justify-end" : ""
                    }`
                }
              >
                {!hideButton && isBuyNowAllowed && (
                  <button
                    onClick={() => handelGoDetails(auctionId)}
                    className="border-primary border text-primary hover:bg-primary hover:text-white rounded-lg flex-1 py-1 sm:py-1.5 text-[11px] sm:text-sm font-medium transition-all duration-200 active:scale-95"
                  >
                    {selectedContent[localizationKeys.buyNow]}
                  </button>
                )}
                {!hideButton && (
                  <button
                    onClick={() => handelGoDetails(auctionId)}
                    className="bg-primary hover:bg-primary-dark text-white rounded-lg flex-1 py-1 sm:py-1.5 text-[11px] sm:text-sm font-medium transition-all duration-200 active:scale-95"
                  >
                    {selectedContent[localizationKeys.bidNow]}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AuctionCard);
