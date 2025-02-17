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

const ProductCardList = ({
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
  const selectedContent = content[lang];
  const history = useHistory();

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
    <div className="cursor-pointer " onClick={() => handelGoDetails(id)}>
      <div className=" h-auto my-2  group rounded-lg border border-gray-200 hover:border-primary shadow-md hover:shadow-lg  p-4 flex md:flex-row flex-col justify-between ">
        <div className="flex  gap-x-4">
          {/* img */}
          <div className="w-[103px] min-w-[80px] md:h-[112px] h-[100px] rounded-lg relative overflow-hidden bg-gray-light ">
            <img
              onClick={() => handelGoDetails(id)}
              className="w-full h-full object-scale-down group-hover:scale-110 duration-300 ease-in-out transform "
              src={imageLink}
              alt="adsImd"
            />
            <div
              onClick={() => handelGoDetails(id)}
              className="price-button-list absolute  bg-[#e04868]  text-white text-[10px] top-0 w-auto px-1 h-[24px] flex justify-center items-center"
            >
              {formatCurrency(price)}
            </div>
          </div>
          {/* data */}
          <div>
            <h1
              onClick={() => handelGoDetails(id)}
              className="text-gray-dark font-medium text-sm pt-3 mb-2 h-10 ltr:pr-4 rtl:pl-4"
            >
              {truncateString(title, 250)}
            </h1>

            <div className="flex md:gap-x-10 gap-x-6 mt-2">
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
                  {selectedContent[localizationKeys.location]}
                </h6>
                <p
                  className="text-gray-dark font-medium md:text-[11px] text-[10px] mt-1"
                  onClick={() => handelGoDetails(id)}
                >
                  {city}, {country}
                </p>
              </div>
              <div>
                <h6 className="text-gray-med font-normal md:text-[11px] text-[8px]">
                  {selectedContent[localizationKeys.listed]}
                </h6>
                <p
                  className="text-gray-dark font-medium md:text-[11px] text-[8px]"
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
          </div>
        </div>
        {/* buttons */}
        <div className=" my-auto flex flex-col gap-y-5">
          <button
            onClick={() => handelGoDetails(id)}
            className="border-primary border-[1px] text-primary md:w-[128px] w-full h-[32px] rounded-lg"
          >
            {selectedContent[localizationKeys.buyNow]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;
