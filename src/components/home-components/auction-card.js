import React, { useEffect, useState } from "react";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { useDispatch } from "react-redux";
import AuctionsStatus from "../../components/shared/status/auctions-status";
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
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { user } = useAuthState();
  const dispatch = useDispatch();
  const history = useHistory();
  const { run, isLoading } = useAxios([]);
  const [isWatshlist, setWatshlist] = useState(WatshlistState);
  const timeLeft = useCountdown(endingTime);
  const formattedTimeLeft = `${timeLeft.days} ${
    selectedContent[localizationKeys.days]
  } :
  ${timeLeft.hours} ${selectedContent[localizationKeys.hrs]} : 
  ${timeLeft.minutes} ${selectedContent[localizationKeys.min]} `;

  useEffect(() => {
    if (WatshlistState) setWatshlist(WatshlistState);
  }, [WatshlistState]);

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
                "This auction delete from WatchList been successfully"
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
              toast.success("This auction add to WatchList been successfully");
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
      <div className="group lg:w-[272px] md:w-[299px] max-h-[363px] rounded-2xl hover:border-primary border-transparent border-[1px] shadow p-4 cursor-pointer">
        <div className="lg:w-[240px] md:w-[267px] h-[165px] rounded-2xl mx-auto round bg-[#F9F9F9] relative overflow-hidden ">
          <div
            className={
              isMyAuction
                ? "hidden"
                : "bg-white rounded-lg w-[38px] h-[44px] absolute z-20 top-2 ltr:right-2 rtl:left-2 "
            }
          >
            <div
              onClick={() => handelAddNewWatshlist(auctionId)}
              className="flex justify-center items-center mt-2.5 cursor-pointer "
            >
              {watshlistForceState || isWatshlist ? (
                <BsBookmarkFill className="text-primary" size={25} />
              ) : (
                <BsBookmark className="text-gray-med" size={25} />
              )}
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
            {formatCurrency(price)}
          </div>
        </div>
        <h1
          onClick={() => handelGoDetails(auctionId)}
          className="text-gray-dark font-medium text-sm pt-3 mb-2 h-10"
        >
          {title}
        </h1>
        <div onClick={() => handelGoDetails(auctionId)}>
          <AuctionsStatus status={status} small />
          <div className="flex justify-between mt-2">
            <div>
              <h6 className="text-gray-veryLight font-normal text-[10px]">
                {selectedContent[localizationKeys.totalBids]}
              </h6>
              <p className="text-gray-dark font-medium text-[10px]">
                {totalBods} {selectedContent[localizationKeys.bid]}
              </p>
            </div>
            <div>
              <h6 className="text-gray-veryLight font-normal text-[10px]">
                {selectedContent[localizationKeys.endingTime]}
              </h6>
              <p
                className={`${
                  timeLeft.days === 0 ? "text-red" : "text-gray-dark"
                } font-medium text-[10px] `}
              >
                {formattedTimeLeft}
              </p>
            </div>
          </div>
          {isMyAuction ? (
            <div className="mt-4 flex gap-x-3 justify-end">
              <button
                onClick={() => handelGoDetails(auctionId)}
                className="bg-primary hover:bg-primary-dark text-white w-[128px] h-[32px] rounded-lg"
              >
                {selectedContent[localizationKeys.viewDetails]}
              </button>
            </div>
          ) : (
            <div
              className={`${
                isBuyNowAllowed ? "justify-between" : "justify-end"
              } mt-4 flex gap-x-3`}
            >
              {isBuyNowAllowed && (
                <button
                  onClick={() => handelGoDetails(auctionId)}
                  className="border-primary border-[1px] text-primary w-[128px] h-[32px] rounded-lg"
                >
                  {selectedContent[localizationKeys.buyNow]}
                </button>
              )}
              <button
                onClick={() => handelGoDetails(auctionId)}
                className="bg-primary hover:bg-primary-dark text-white w-[128px] h-[32px] rounded-lg"
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

export default AuctionCard;
