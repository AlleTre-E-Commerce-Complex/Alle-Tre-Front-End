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
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { RiShareForwardFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useAuthState } from "../../context/auth-context"
import useAxios from "../../hooks/use-axios";
import { toast } from "react-hot-toast";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import { Open } from "../../redux-store/auth-model-slice";

const AuctionCardList = ({
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
}) => {
  const [isWatshlist, setWatshlist] = useState(WatshlistState);
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
        className="h-auto my-2 rounded-lg border border-gray-200 hover:border-primary shadow-md hover:shadow-lg group p-4 flex md:flex-row flex-col justify-between"
        onClick={() => handelGoDetails(auctionId)}
      >
        <div className="flex gap-x-4">
          <div className="w-[103px] min-w-[80px] md:h-[112px] h-[100px] rounded-lg relative overflow-hidden bg-gray-light">
            <img
              onClick={() => handelGoDetails(auctionId)}
              className="w-full h-full object-scale-down group-hover:scale-110 duration-300 ease-in-out transform"
              src={adsImg}
              alt="adsImg"
            />
            <div
              onClick={() => handelGoDetails(auctionId)}
              className="price-button-list absolute bg-[#e04868] text-white text-[10px] top-0 w-auto px-1 h-[24px] flex justify-center items-center"
            >
              {formatCurrency(price)}
            </div>
          </div>

          <div>
            <h1
              onClick={() => handelGoDetails(auctionId)}
              className="text-gray-dark font-medium text-sm pt-3 mb-2 h-10 ltr:pr-4 rtl:pl-4"
            >
              {truncateString(title, 250)}
            </h1>
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
                  {formatCurrency(price)}
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
        <div className="flex flex-col gap-y-5 justify-end">
          {isMyAuction ? (
            <div className={isPurchased ? "hidden" : "flex gap-x-3"}>
              <button
                onClick={() => handelGoDetails(auctionId)}
                className="bg-primary hover:bg-primary-dark text-white md:w-[128px] w-full h-[32px] rounded-lg"
              >
                {selectedContent[localizationKeys.viewDetails]}
              </button>
            </div>
          ) : (
            <div
              className={`${
                isPurchased ? "hidden" : "flex gap-x-3"
              } justify-end flex md:flex-col flex-row gap-y-2 mt-auto`}
            >
              {isBuyNowAllowed && (
                <button
                  onClick={() => handelGoDetails(auctionId)}
                  className="border-primary border-[1px] text-primary md:w-[128px] w-full h-[32px] rounded-lg"
                >
                  {selectedContent[localizationKeys.buyNow]}
                </button>
              )}
              <button
                onClick={() => handelGoDetails(auctionId)}
                className="bg-primary hover:bg-primary-dark text-white md:w-[128px] w-full h-[32px] rounded-lg"
              >
                {selectedContent[localizationKeys.bidNow]}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionCardList;
