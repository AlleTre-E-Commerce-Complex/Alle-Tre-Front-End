import React, { useState } from "react";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import AuctionsStatus from "../../components/shared/status/auctions-status";
import { formatCurrency } from "../../utils/format-currency";

const AuctionCard = ({
  price,
  title,
  adsImg,
  status,
  totalBods,
  endingTime,
  bidNow,
  WatshlistState,
}) => {
  const [isWatshlist, setWatshlist] = useState(false);

  return (
    <div>
      <div className="group w-[299px] max-h-[363px] rounded-2xl hover:border-primary border-transparent border-[1px] shadow p-4">
        <div className="w-[267px] h-[170px] rounded-2xl mx-auto round bg-[#F9F9F9] relative ">
          <img
            className="w-[204px] h-[149px] mx-auto pt-6 object-contain group-hover:scale-110 duration-300 ease-in-out transform  "
            src={adsImg}
            alt="adsImd"
          />
          <div className="price-button absolute bg-orang text-white text-[10px] top-0 w-auto px-1 h-[24px] flex justify-center items-center">
            {formatCurrency(price)}
          </div>
          <div className="bg-white rounded-lg w-[38px] h-[44px] absolute top-2 right-2">
            <div
              onClick={() => setWatshlist((p) => !p)}
              className="flex justify-center items-center mt-2.5 cursor-pointer "
            >
              {isWatshlist ? (
                <BsBookmark className="text-gray-med" size={25} />
              ) : (
                <BsBookmarkFill className="text-primary" size={25} />
              )}
            </div>
          </div>
        </div>
        <h1 className="text-gray-dark font-medium text-sm pt-2">{title}</h1>
        <div>
          <AuctionsStatus status={status} small />
          <div className="flex justify-between mt-2">
            <div>
              <h6 className="text-gray-veryLight font-normal text-[10px]">
                Total Bids
              </h6>
              <p className="text-gray-dark font-medium text-[10px]">
                {totalBods} Bid
              </p>
            </div>
            <div>
              <h6 className="text-gray-veryLight font-normal text-[10px]">
                Ending Time
              </h6>
              <p className="text-gray-dark font-medium text-[10px]">
                {endingTime}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="bg-primary hover:bg-primary-dark text-white w-[128px] h-[32px] rounded-lg">
              Bid Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
