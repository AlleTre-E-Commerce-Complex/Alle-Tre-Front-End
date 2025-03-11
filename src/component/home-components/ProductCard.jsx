import { useLanguage } from "context/language-context";
import content from "localization/content";
import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { truncateString } from "utils/truncate-string";
import routes from "../../routes";
// import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { RiShareForwardFill } from "react-icons/ri";
import localizationKeys from "../../localization/localization-keys";
import { formatCurrency } from "utils/format-currency";
import { useAuthState } from "context/auth-context";

const ProductCard = ({
  imageLink,
  title,
  price,
  location,
  city,
  country,
  id,
  createdAt,
  userId,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { user } = useAuthState();
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

  const handelGoDetails = (id) => {
    history.push(routes.app.listProduct.details(id));
  };

  return (
    <div>
      <div className="group w-full max-w-[240px] h-auto rounded-lg border border-gray-200 hover:border-primary shadow-md hover:shadow-lg p-2 sm:p-4 cursor-pointer">
        <div className="w-full group rounded-lg bg-[#F9F9F9] relative overflow-hidden aspect-[4/5]">
          <div className=" group">
            <div
              className={`absolute ${
                lang === "ar" ? "left-0" : "right-0"
              }  top-0 z-30  space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            >
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
            className="price-button absolute bg-[#e04868]  text-white text-[10px] top-0 w-auto px-2 h-[24px] flex justify-center items-center"
          >
            {formatCurrency(price)}
          </div>
        </div>
        <h1
          onClick={() => handelGoDetails(id)}
          className="text-gray-dark font-medium text-sm pt-3 mb-2 min-h-[30px] line-clamp-2 overflow-hidden"
        >
          {truncateString(title, 250)}
        </h1>
        <div className="mt-0" onClick={() => handelGoDetails(id)}>
          <div className="h-[40px]">
            <h6 className="text-gray-med font-normal md:text-[10px] text-[8px]">
              {selectedContent[localizationKeys.location]}
            </h6>
            <p
              className="text-gray-dark font-medium md:text-[11px] text-[10px] mt-1 line-clamp-2"
              onClick={() => handelGoDetails(id)}
            >
              {city}, {country}
            </p>
          </div>
          <div className="flex justify-between mt-2">
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
          </div>
          {user?.id === userId ? (
            <div className="mt-3 flex items-end justify-end">
              <button
                onClick={() => handelGoDetails(id)}
                className="bg-primary hover:bg-primary-dark text-white rounded-lg w-full sm:w-auto h-[30px] sm:h-[35px] px-4 sm:px-6 text-sm sm:text-base flex items-center justify-center "
              >
                {selectedContent[localizationKeys.viewDetails]}
              </button>
            </div>
          ) : (
            <div className="mt-3 flex items-end justify-end">
              <button
                onClick={() => handelGoDetails(id)}
                className="bg-primary hover:bg-primary-dark text-white rounded-lg w-full sm:w-auto h-[30px] sm:h-[35px] px-4 sm:px-6 text-sm sm:text-base flex items-center justify-center"
              >
                {selectedContent[localizationKeys.buyNow]}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
