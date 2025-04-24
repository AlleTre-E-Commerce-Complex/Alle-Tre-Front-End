import { useState, useEffect, memo } from "react";
import AuctionsStatus from "component/shared/status/auctions-status";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useLanguage } from "../../context/language-context";
import useCountdown from "../../hooks/use-countdown";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import routes from "../../routes";
import { formatCurrency } from "../../utils/format-currency";
import { truncateString } from "../../utils/truncate-string";
import { BsBookmark, BsBookmarkFill, BsPlayCircleFill } from "react-icons/bs";
import { RiShareForwardFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useAuthState } from "../../context/auth-context";
import useAxios from "../../hooks/use-axios";
import { toast } from "react-hot-toast";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import { Open } from "../../redux-store/auth-model-slice";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";


const CountdownDisplay = memo(
  ({ timeLeft, status, formattedstartDate, selectedContent }) => {
    const formattedTimeLeft = `${timeLeft.days} ${selectedContent[localizationKeys.days]
      } : ${timeLeft.hours} ${selectedContent[localizationKeys.hrs]} : 
    ${timeLeft.minutes} ${selectedContent[localizationKeys.min]} : 
    ${timeLeft.seconds} ${selectedContent[localizationKeys.sec]}`;

    return (
      <p
        className={`${timeLeft.days === 0 ? "text-red" : "text-gray-800"} font-medium text-[10px] md:text-xs`}
      >

        {status === "IN_SCHEDULED" ? formattedstartDate : formattedTimeLeft}
      </p>
    );
  }
);

const AuctionCardList = ({
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
  isExpired,
  CurrentBid,
  startBidAmount,
  latestBidAmount,
  PurchasedTime,
  usageStatus,
  category
}) => {
  const [isWatshlist, setWatshlist] = useState(WatshlistState);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [preloadedVideos, setPreloadedVideos] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const timeLeft = useCountdown(endingTime);
  const dispatch = useDispatch();
  const { user } = useAuthState();
  const { run } = useAxios([]);
  // const formattedTimeLeft = `${timeLeft.days} ${selectedContent[localizationKeys.days]
  //   } :
  // ${timeLeft.hours} ${selectedContent[localizationKeys.hrs]} : 
  // ${timeLeft.minutes} ${selectedContent[localizationKeys.min]} `;

  const formattedBid = formatCurrency(
    latestBidAmount || CurrentBid || startBidAmount
  );

  const startDate = useCountdown(StartDate);

  const formattedstartDate = `${startDate.days} ${selectedContent[localizationKeys.days]
    } : ${startDate.hours} ${selectedContent[localizationKeys.hrs]} : ${startDate.minutes
    } ${selectedContent[localizationKeys.min]}`;

  useEffect(() => {
    if (WatshlistState) setWatshlist(WatshlistState);
  }, [WatshlistState]);

  const getDomain = () => {
    const { protocol, hostname, port } = window.location;
    return port
      ? `${protocol}//${hostname}:${port}`
      : `${protocol}//${hostname}`;
  };

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

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 my-2 group rounded-lg border border-gray-200 hover:border-primary shadow-md hover:shadow-lg p-2 lg:p-3">
        <div
          className="flex flex-col sm:flex-row gap-4"
          onClick={() => handelGoDetails(auctionId)}
        >
          <div className="w-full sm:w-[200px] h-[180px] sm:h-[150px] min-w-full sm:min-w-[200px] rounded-lg relative overflow-hidden bg-gray-light">
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
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handelGoDetails(auctionId);
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/video:bg-black/50 transition-all duration-300 cursor-pointer z-[5]"
                      >
                        <BsPlayCircleFill
                          onClick={(e) => {
                            e.stopPropagation();
                            handelGoDetails(auctionId);
                          }}
                          className="text-white text-4xl opacity-70 group-hover/video:opacity-100 transition-opacity duration-300 cursor-pointer"
                        />
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
                          className="absolute z-[5] left-2 top-1/2 -translate-y-1/2 bg-primary/60 hover:bg-primary px-0.3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-7 sm:block hidden"
                        >
                          <MdNavigateBefore className="flex justify-center text-white text-sm item-center" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                          className="absolute z-[5] right-2 top-1/2 -translate-y-1/2 bg-primary/60 hover:bg-primary px-0.3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-7 sm:block hidden"
                        >
                          <MdNavigateNext className="flex justify-center text-white text-sm item-center" />
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
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentImageIndex
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
              className="absolute top-0 left-0 z-20 bg-gradient-to-r from-primary to-primary-light px-1 sm:px-2 py-0.5 sm:py-1 rounded-br-lg shadow-sm backdrop-blur-sm bg-opacity-75"
            >
              <span className="text-white font-medium text-xs sm:text-sm flex items-center">

                {formattedBid}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h1
                    onClick={() => handelGoDetails(auctionId)}
                    className="text-gray-dark font-medium text-sm sm:text-lg flex-1 line-clamp-2 hover:text-primary transition-colors duration-200 w-20 h-12"
                  >
                    {truncateString(title, 70)}
                  </h1>
                  <div
              className={`state-button shrink-0 px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-xs font-medium transition-colors ${
                usageStatus === "NEW"
                  ? "bg-primary-veryLight text-primary"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {category === 3 
                ? usageStatus === "NEW" 
                  ? selectedContent[localizationKeys.sell] 
                  : selectedContent[localizationKeys.rent]
                : usageStatus?.charAt(0).toUpperCase() +
                  usageStatus?.slice(1).toLowerCase()}
            </div>
                </div>

                <div className="mt-2">
                  <AuctionsStatus status={status} small />
                </div>

                <div className="flex flex-wrap gap-y-3 gap-x-6 mt-3">
                  <div className="min-w-[80px]">
                    <h6 className="text-gray-med font-normal text-xs">
                      {selectedContent[localizationKeys.totalBids]}
                    </h6>
                    <p className="text-gray-800 font-medium text-xs">
                      {totalBods || 0} {selectedContent[localizationKeys.bid]}
                    </p>
                  </div>
                  <div className="min-w-[80px]">
                    <h6 className="text-gray-med font-normal text-xs">
                      {selectedContent[localizationKeys.lastestPrice]}
                    </h6>
                    <p className="text-gray-800 font-medium text-xs">
                      {formattedBid}
                    </p>
                  </div>
                  <div className="min-w-[80px]">
                    <h6 className="text-gray-med font-normal text-xs">
                      {status === "IN_SCHEDULED"
                        ? selectedContent[localizationKeys.startDate]
                        : status === "SOLD"
                          ? "Purchased Time"
                          : selectedContent[localizationKeys.endingTime]}
                    </h6>
                    {status === "SOLD" ? (
                      <p className="font-medium text-xs text-gray-dark">
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
              </div>

              <div className="flex sm:flex-col gap-2 sm:h-full sm:justify-between">
                <div className="hidden sm:block" /> {/* This pushes content to the bottom on desktop */}
                <div className="flex sm:flex-col gap-2">
                  {!isMyAuction && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handelAddNewWatshlist(auctionId);
                      }}
                      className="border-primary border-2 bg-white rounded-lg w-9 h-9 sm:w-10 sm:h-10 group/watchlist hover:bg-primary transition-all duration-300 flex items-center justify-center"
                    >
                      {isWatshlist ? (
                        <BsBookmarkFill className="text-primary group-hover/watchlist:text-white text-lg sm:text-xl" />
                      ) : (
                        <BsBookmark className="text-primary group-hover/watchlist:text-white text-lg sm:text-xl" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    className="border-primary border-2 bg-white rounded-lg w-9 h-9 sm:w-10 sm:h-10 group/share hover:bg-primary transition-all duration-300 flex items-center justify-center"
                  >
                    <RiShareForwardFill className="text-primary group-hover/share:text-white text-xl sm:text-2xl" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-row  gap-2 w-full">
              {isMyAuction ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handelGoDetails(auctionId);
                  }}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white px-6 h-11 rounded-lg text-sm font-medium"
                >
                  {selectedContent[localizationKeys.viewDetails]}
                </button>
              ) : (
                <>
                  {isBuyNowAllowed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handelGoDetails(auctionId);
                      }}
                      className="flex-1 border-primary border text-primary px-6 h-11 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                    >
                      {selectedContent[localizationKeys.buyNow]}
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handelGoDetails(auctionId);
                    }}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white px-6 h-11 rounded-lg text-sm font-medium"
                  >
                    {selectedContent[localizationKeys.bidNow]}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCardList;
