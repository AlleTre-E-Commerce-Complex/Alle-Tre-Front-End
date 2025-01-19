import { useLanguage } from 'context/language-context';
import content from 'localization/content';
import React from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { formatCurrency } from 'utils/format-currency';
import { truncateString } from 'utils/truncate-string';

const ProductCard = ({imageLink, title, price }) => {
  console.log('=====>',imageLink,title,price)
  const [lang] = useLanguage("");
  const selectedContent = content[lang]; 
  const history = useHistory();
  return (
    <div className="cursor-pointer " 
      // onClick={() => handelGoDetails(auctionId)}
    >
      <div className=" h-auto my-2 rounded-lg group hover:border-primary border-transparent border-[1px] shadow-md p-4 flex md:flex-row flex-col justify-between ">
        <div className="flex  gap-x-4">
          {/* img */}
          <div className="w-[103px] min-w-[80px] md:h-[112px] h-[100px] rounded-lg relative overflow-hidden bg-gray-light ">
            <img
              // onClick={() => handelGoDetails(auctionId)}
              className="w-full h-full mx-auto rounded-lg  object-cover group-hover:scale-110 duration-300 ease-in-out transform  "
              src={imageLink}
              alt="adsImd"
            />
            <div
              // onClick={() => handelGoDetails(auctionId)}
              className="price-button-list absolute bg-orang text-white text-[10px] top-0 w-auto px-1 h-[24px] flex justify-center items-center"
            >
              {formatCurrency(price)}
            </div>
          </div>
          {/* data */}
          <div>
            <h1
              // onClick={() => handelGoDetails(auctionId)}
              className="text-gray-dark font-medium text-sm pt-3 mb-2 h-10 ltr:pr-4 rtl:pl-4"
            >
              {truncateString(title, 250)}
            </h1>
            <div>
              {/* <AuctionsStatus status={status} small /> */}
            </div>
            <div className="flex md:gap-x-10 gap-x-6 mt-2">
              {/* <div>
                <h6 className="text-gray-veryLight font-normal md:text-[10px] text-[8px]">
                  {selectedContent[localizationKeys.totalBids]}
                </h6>
                <p className="text-gray-dark font-medium md:text-[10px] text-[8px]">
                  {totalBods || 0} {selectedContent[localizationKeys.bid]}
                </p>
              </div> */}
              {/*  */}
              <div>
                {/* <h6 className="text-gray-veryLight font-normal md:text-[10px] text-[8px]">
                  {selectedContent[localizationKeys.lastPrice]}
                </h6> */}
                {/* <p className="text-gray-dark font-medium md:text-[10px] text-[8px]">
                  {formatCurrency(price)}
                </p> */}
              </div>
              {/*  */}
              {/* <div>
                <h6 className="text-gray-veryLight font-normal md:text-[10px] text-[8px]">
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
              </div> */}
            </div>
          </div>
        </div>
        {/* buttons */}
        {/* <div className=" my-auto flex flex-col gap-y-5">
          {isMyAuction ? (
            <div className={isPurchased ? "hidden" : " flex gap-x-3 "}>
              <button
                onClick={() => handelGoDetails(auctionId)}
                className="bg-primary hover:bg-primary-dark text-white md:w-[128px] w-full h-[32px] rounded-lg"
              >
                {selectedContent[localizationKeys.viewDetails]}
              </button>
            </div>
          ) : (
            <div
              className={` ${isPurchased ? "hidden" : " flex gap-x-3 "}  ${
                isBuyNowAllowed ? "justify-between" : "justify-end"
              } mt-4 flex md:flex-col flex-row gap-y-4 `}
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
        </div> */}
      </div>
    </div>
  );
}

export default ProductCard
