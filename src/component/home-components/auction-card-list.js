import { useState, useEffect } from "react";
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
  const formattedTimeLeft = `${timeLeft.days} ${
    selectedContent[localizationKeys.days]
  } :
  ${timeLeft.hours} ${selectedContent[localizationKeys.hrs]} : 
  ${timeLeft.minutes} ${selectedContent[localizationKeys.min]} `;

  const formattedBid = formatCurrency(
    latestBidAmount || CurrentBid || startBidAmount
  );

  const startDate = useCountdown(StartDate);

  const formattedstartDate = `${startDate.days} ${
    selectedContent[localizationKeys.days]
  } : ${startDate.hours} ${selectedContent[localizationKeys.hrs]} : ${
    startDate.minutes
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
    <div className="cursor-pointer relative group">
      <div
        className={`absolute top-4 ${
          lang === "ar" ? "left-4" : "right-5"
        } z-20 flex items-center  ${
          lang === "ar" ? "gap-2" : "space-x-1 sm:space-x-2"
        } opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      >
        {!isMyAuction && (
          <button
            onClick={() => handelAddNewWatshlist(auctionId)}
            className="border-primary border-2 bg-white/90 rounded-lg w-8 h-9 md:w-11 md:h-12 group/watchlist hover:bg-primary transition-all duration-300 flex items-center justify-center"
          >
            {isWatshlist ? (
              <BsBookmarkFill className="text-primary group-hover/watchlist:text-white text-lg md:text-xl" />
            ) : (
              <BsBookmark className="text-primary group-hover/watchlist:text-white text-lg md:text-xl" />
            )}
          </button>
        )}
        <div
          onClick={handleShare}
          className="border-primary border-2 bg-white/90 rounded-lg w-8 h-9 md:w-11 md:h-12 hover:bg-primary group/share transition-all duration-300 flex items-center justify-center"
        >
          <RiShareForwardFill className="text-primary group-hover/share:text-white text-lg md:text-2xl" />
        </div>
      </div>

      <div
        className="h-auto my-2 rounded-lg border border-gray-200 hover:border-primary shadow-md hover:shadow-lg group p-4 flex flex-col mb-4"
        onClick={() => handelGoDetails(auctionId)}
      >
        <div className="flex gap-x-4">
          <div className="w-[103px] min-w-[80px] md:h-[112px] h-[100px] rounded-lg relative overflow-hidden bg-gray-light">
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
              className="price-button-list absolute bg-[#e04868] text-white text-[10px] top-0 w-auto px-1 h-[24px] flex justify-center items-center"
            >
              {formattedBid}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center  gap-x-2 md:gap-x-4">
              <h1
                onClick={() => handelGoDetails(auctionId)}
                className="text-gray-dark font-medium text-sm pt-3 min-h-[30px] line-clamp-2 overflow-hidden"
              >
                {truncateString(title, 70)}
              </h1>
              <div
                className={`state-button px-2 mt-2 py-0.5 rounded-md text-xs font-medium text-white transition-colors ${
                  usageStatus === "NEW"
                    ? "bg-primary-light hover:bg-primary bg-opacity-70"
                    : "bg-gray-dark hover:bg-gray-verydark bg-opacity-80"
                }`}
              >
                {usageStatus?.charAt(0).toUpperCase() +
                  usageStatus?.slice(1).toLowerCase()}
              </div>
            </div>

            <div>
              <AuctionsStatus status={status} small />
            </div>
            <div className="flex md:gap-x-10 gap-x-6 mt-2">
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
                  {selectedContent[localizationKeys.lastestPrice]}
                </h6>
                <p className="text-gray-dark font-medium md:text-[10px] text-[8px]">
                  {formattedBid}
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
                  <p className="font-medium md:text-[10px] text-[8px] text-gray-dark">
                    {moment(PurchasedTime).local().format("MMMM, DD YYYY")}
                  </p>
                ) : (
                  <p
                    className={`${
                      timeLeft.days === 0 ? "text-red" : "text-gray-dark"
                    } font-medium md:text-[10px] text-[8px] `}
                  >
                    {status === "IN_SCHEDULED"
                      ? formattedstartDate
                      : formattedTimeLeft}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col md:flex-row md:justify-end gap-2">
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            {isMyAuction ? (
              <button
                onClick={() => handelGoDetails(auctionId)}
                className="bg-primary hover:bg-primary-dark text-white w-full md:w-[128px] h-[32px] rounded-lg"
              >
                {selectedContent[localizationKeys.viewDetails]}
              </button>
            ) : (
              <>
                {isBuyNowAllowed && (
                  <button
                    onClick={() => handelGoDetails(auctionId)}
                    className="border-primary border-[1px] text-primary w-full md:w-[128px] h-[32px] rounded-lg"
                  >
                    {selectedContent[localizationKeys.buyNow]}
                  </button>
                )}
                <button
                  onClick={() => handelGoDetails(auctionId)}
                  className="bg-primary hover:bg-primary-dark text-white w-full md:w-[128px] h-[32px] rounded-lg"
                >
                  {selectedContent[localizationKeys.bidNow]}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCardList;
