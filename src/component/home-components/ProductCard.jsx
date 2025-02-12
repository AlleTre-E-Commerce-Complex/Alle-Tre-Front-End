import { useLanguage } from "context/language-context";
import content from "localization/content";
import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { truncateString } from "utils/truncate-string";
import routes from "../../routes";
// import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { RiShareForwardFill } from "react-icons/ri";
import localizationKeys from "../../localization/localization-keys";

const ProductCard = ({
  imageLink,
  title,
  price,
  location,
  city,
  country,
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
          url: `${getDomain()}/alletre/my-product/${id}/details`,
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
    <div>
      <div
        className="group max-w-[190px] w-full h-auto rounded-lg border border-gray-200 hover:border-primary shadow-md hover:shadow-lg p-3 cursor-pointer transition-all duration-300 
         sm:max-w-sm sm:p-4"
      >
        <div className="w-[160px] h-[100px] sm:w-[210px] sm:h-[125px] rounded-lg bg-[#F9F9F9] relative overflow-hidden flex items-start justify-start">
          <div className=" group">
            <div className="absolute top-0 right-0 z-30 flex items-center space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
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
                className="border-primary border-2 border-solid bg-white/90 rounded-lg w-9 h-10 md:w-11 md:h-12 hover:bg-primary group/share transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                <RiShareForwardFill className="text-primary group-hover/share:text-white transition-all duration-300 text-2xl md:text-2xl" />
              </div>
            </div>
          </div>

          <img
            className="w-full h-full mx-auto rounded-lg object-scale-down group-hover:scale-110 duration-300 ease-in-out transform  "
            src={imageLink}
            alt="adsImd"
            onClick={() => handelGoDetails(id)}
          />
          <div
            onClick={() => handelGoDetails(id)}
            className="price-button absolute bg-orang text-white text-[10px] top-0 w-auto px-2 h-[24px] flex justify-center items-center"
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
              {selectedContent[localizationKeys.location]}
            </h6>
            {/* <p
              className="text-gray-dark font-medium md:text-[10px] text-[8px]"
              onClick={() => handelGoDetails(id)}
            >
              {location}
            </p> */}
            <p
              className="text-gray-dark font-medium md:text-[11px] text-[10px] mt-1"
              onClick={() => handelGoDetails(id)}
            >
              {city}, {country}
            </p>
          </div>
          <div className="flex justify-between mt-4">
            <div>
              <h6 className="text-gray-med font-normal md:text-[10px] text-[8px]">
                {selectedContent[localizationKeys.listed]}
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
                className="bg-primary hover:bg-primary-dark text-white rounded-lg w-full sm:w-auto h-[30px] sm:h-[35px] px-4 sm:px-6 text-sm sm:text-base flex items-center justify-center"
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
