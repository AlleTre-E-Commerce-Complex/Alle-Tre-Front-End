import { useLanguage } from "context/language-context";
import content from "localization/content";
import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { truncateString } from "utils/truncate-string";
import routes from "../../routes";
// import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { RiShareForwardFill } from "react-icons/ri";
import { useAuthState } from "../../context/auth-context";
import useAxios from "../../hooks/use-axios";
import localizationKeys from "../../localization/localization-keys";
import { useDispatch } from "react-redux";

const ProductCard = ({
  imageLink,
  title,
  price,
  WatshlistState,
  className,
  auctionId,
  location,
  id,
  createdAt,
}) => {
  const [lang] = useLanguage("");
  // const [isWatshlist, setWatshlist] = useState(WatshlistState);
  const selectedContent = content[lang];
  const history = useHistory();
  // const { user } = useAuthState();
  // const { run, isLoading } = useAxios([]);
  // const dispatch = useDispatch();

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
      } catch (error) {
        console.error("Error sharing post:", error);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  const getTimeDifference = (createdAt) => {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const diffInMs = today - createdDate;

    // Convert milliseconds to different units
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    return {
      days: diffInDays,
      weeks: diffInWeeks,
      months: diffInMonths,
    };
  };

  const difference = getTimeDifference(createdAt);

  // useEffect(() => {
  //   if (WatshlistState) setWatshlist(WatshlistState);
  // }, [WatshlistState]);
  // const handelAddNewWatshlist = (id) => {
  //   if (user) {
  //     const body = {
  //       id: id,
  //     };
  //     if (watshlistForceState || isWatshlist) {
  //       run(
  //         authAxios
  //           .delete(api.app.WatchList.delete(id))
  //           .then((res) => {
  //             setWatshlist(false);
  //             toast.success(
  //               selectedContent[
  //                 localizationKeys
  //                   .thisAuctionDeleteFromWatchListBeenSuccessfully
  //               ]
  //             );
  //             onReload();
  //           })
  //           .catch((err) => {
  //             onReload();
  //           })
  //       );
  //     } else {
  //       run(
  //         authAxios
  //           .post(api.app.WatchList.add, body)
  //           .then((res) => {
  //             setWatshlist(true);
  //             toast.success(
  //               selectedContent[
  //                 localizationKeys.thisAuctionAddToWatchListBeenSuccessfully
  //               ]
  //             );
  //             onReload();
  //           })
  //           .catch((err) => {
  //             onReload();
  //           })
  //       );
  //     }
  //   } else {
  //     dispatch(Open());
  //     onReload();
  //   }
  // };

  const handelGoDetails = (id) => {
    history.push(routes.app.listProduct.details(id));
  };

  return (
    <div className={className}>
      <div className="group lg:w-[272px] l:w-[367px]  md:h-auto h-[335px] rounded-2xl hover:border-primary border-transparent border-[1px] shadow p-4 cursor-pointer">
        <div className="lg:w-[240px] l:w-[335px]  md:h-[165px] h-[120px] rounded-2xl mx-auto round bg-[#F9F9F9] relative overflow-hidden">
          <div className="relative group">
            {/* Card Content */}
            <div className="absolute top-3 right-1 z-20 flex items-center space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* {!isMyAuction && (
                <button
                  onClick={() => handelAddNewWatshlist(id)}
                  className="border-primary border-2 border-solid bg-white group/watchlist rounded-xl w-10 h-10 md:w-12 md:h-12 hover:bg-primary transition-all duration-300 cursor-pointer flex items-center justify-center"
                >
                  {isWatshlist ? (
                    <BsBookmarkFill className="text-primary group-hover/watchlist:text-white text-2xl md:text-2xl" />
                  ) : (
                    <BsBookmark className="text-primary group-hover/watchlist:text-white text-2xl md:text-2xl" />
                  )}
                </button>
              )} */}
              <div
                onClick={handleShare}
                className="border-primary border-2 border-solid bg-white rounded-xl w-10 h-10 md:w-12 md:h-12 hover:bg-primary group/share transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                <RiShareForwardFill className="text-primary group-hover/share:text-white transition-all duration-300 text-2xl md:text-2xl" />
              </div>
            </div>
          </div>
          <img
            className="w-full h-full mx-auto rounded-lg  object-cover group-hover:scale-110 duration-300 ease-in-out transform  "
            src={imageLink}
            alt="adsImd"
            onClick={() => handelGoDetails(id)}
          />
          <div
            onClick={() => handelGoDetails(id)}
            className="price-button absolute bg-orang text-white text-[10px] top-0 w-auto px-1 h-[24px] flex justify-center items-center"
          >
            AED {price}
          </div>
        </div>
        <h1
          onClick={() => handelGoDetails(id)}
          className="text-gray-dark font-medium text-sm pt-3 mb-2 h-10 ltr:pr-4 rtl:pl-4"
        >
          {truncateString(title, 250)}
        </h1>
        <div className="mt-2" onClick={() => handelGoDetails(id)}>
          <div>
            <h6 className="text-gray-med font-normal md:text-[10px] text-[8px]">
              {/* {selectedContent[localizationKeys.totalBids]} */}
              Location
            </h6>
            <p
              className="text-gray-dark font-medium md:text-[10px] text-[8px]"
              onClick={() => handelGoDetails(id)}
            >
              {location}
            </p>
          </div>
          <div className="flex justify-between mt-2">
            <div>
              <h6 className="text-gray-med font-normal md:text-[10px] text-[8px]">
                {/* {selectedContent[localizationKeys.totalBids]} */}
                Listed
              </h6>
              <p
                className="text-gray-dark font-medium md:text-[10px] text-[8px]"
                onClick={() => handelGoDetails(id)}
              >
                {difference.days > 0 && `${difference.days} days ago`}
                {difference.days === 0 &&
                  difference.weeks > 0 &&
                  `${difference.weeks} weeks ago`}
                {difference.weeks === 0 &&
                  difference.months > 0 &&
                  `${difference.months} months ago`}
                {difference.days === 0 &&
                  difference.weeks === 0 &&
                  difference.months === 0 &&
                  `Today`}
              </p>
            </div>
            <div>
              <button
                onClick={() => handelGoDetails(id)}
                className="bg-primary hover:bg-primary-dark text-white rounded-lg w-full sm:w-auto h-[35px] sm:h-[35px] px-4 sm:px-6 text-sm sm:text-base flex items-center justify-center"
              >
                {selectedContent[localizationKeys.buyNow]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
