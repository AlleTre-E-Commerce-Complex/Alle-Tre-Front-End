import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/format-currency";
import { truncateString } from "../../utils/truncate-string";

import RatingStare from "../shared/rating-star/rating-star";

import AnglesRight from "../../../src/assets/icons/angles-right-wihte.png";

import { useSocket } from "context/socket-context";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { socketAuctionId } from "redux-store/socket-auctionId-slice";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import AuctionsStatus from "../shared/status/auctions-status";
import TotalBidsTableModel from "./total-bids-table-model";

const SummaryAuctionSections = ({
  numberStare,
  totalReviews,
  description,
  category,
  subCategory,
  startingPrice,
  endingPrice,
  totalBids,
  endingTime,
  setActiveIndexTab,
  status,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { pathname } = useLocation();
  const [openTotaltBid, setTotalBidOpen] = useState(false);
  const [lastestBid, setLastestBid] = useState();

  const dispatch = useDispatch();
  const { auctionId } = useParams();
  dispatch(socketAuctionId(auctionId));

  const socket = useSocket();
  useEffect(() => {
    if (socket) {
      socket.on("bid:submitted", (data) => {
        setLastestBid(data);
      });
    }

    return () => {
      if (socket) {
        socket.off("bid:submitted");
      }
    };
  }, [socket]);
  return (
    <div>
      {/* rating */}
      <div className="flex  gap-x-5">
        <AuctionsStatus status={status} big />
        {/* <RatingStare max={numberStare} size="huge" />
        <p className="text-gray-dark text-base font-normal">
          ( {totalReviews} {selectedContent[localizationKeys.reviews]} )
        </p> */}
      </div>
      {/* Description */}
      <div className="pt-8 overflow-clip">
        <h3 className="text-gray-dark text-base font-normal">
          {selectedContent[localizationKeys.description]}
        </h3>
        <p className="text-gray-dark text-2xl font-normal pt-4 pb-6">
          {truncateString(description, 250)}
        </p>
        <HashLink
          className="underline text-gray-dark text-sm font-normal cursor-pointer pt-6"
          smooth
          to={`${pathname}#itemDescription`}
          onClick={() => setActiveIndexTab(0)}
        >
          {selectedContent[localizationKeys.viewDetails]}
        </HashLink>
      </div>
      {/* Category sections */}
      <div className="pt-6 flex flex-wrap gap-x-3">
        {/* Category left */}
        <div>
          <p className="text-gray-med text-base font-normal pb-2">
            {selectedContent[localizationKeys.category]}
          </p>
          <button className="border-[1px] border-gray-dark rounded-lg text-gray-dark px-12 py-1 cursor-default">
            {category}
          </button>
        </div>
        <div className={subCategory ? "block " : "hidden"}>
          <p className="text-gray-med text-base font-normal pb-2">
            {selectedContent[localizationKeys.subCategory]}
          </p>
          <button className="border-[1px] border-gray-dark rounded-lg text-gray-dark px-12 py-1 cursor-default">
            {subCategory}
          </button>
        </div>
      </div>
      {/* Prices  sections */}
      <div className="pt-6 grid md:grid-cols-2 sm:grid-cols-1  ">
        <div>
          <p className="text-gray-med text-base font-normal pb-2">
            {selectedContent[localizationKeys.startingPrice]}
          </p>
          <p className="text-gray-verydark cursor-default text-2xl">
            {formatCurrency(startingPrice)}
          </p>
        </div>
        <div>
          <p className="text-gray-med text-base font-normal pb-2">
            {selectedContent[localizationKeys.endingPrice]}
          </p>
          <p className="text-gray-verydark cursor-default text-2xl">
            {formatCurrency(lastestBid?.bidAmount) ||
              formatCurrency(endingPrice) ||
              "--"}
          </p>
        </div>
      </div>
      {/* Bids  sections */}
      <div className="pt-6 grid md:grid-cols-2 sm:grid-cols-1 ">
        <div>
          <p className="text-gray-med text-base font-normal pb-2">
            {selectedContent[localizationKeys.totalBids]}
          </p>
          <p className="text-gray-verydark cursor-default text-2xl flex gap-12">
            <p>{lastestBid?.totalBids || totalBids}</p>
            <div className="my-auto">
              <button
                onClick={() => setTotalBidOpen(true)}
                className="w-20 h-6 text-xs font-normal bg-primary rounded text-white flex justify-center gap-x-2 pt-1 "
              >
                <p> {selectedContent[localizationKeys.viewAll]}</p>
                <img
                  className="w-2.5 h-2.5 mt-[2px]"
                  src={AnglesRight}
                  alt="AnglesRight"
                />
              </button>
            </div>
          </p>
        </div>
        <div>
          <p className="text-gray-med text-base font-normal pb-2">
            {selectedContent[localizationKeys.endingTime]}
          </p>
          <p className="text-gray-verydark cursor-default text-2xl">
            {moment(endingTime).format("hh:mmA DD MMM YYYY")}
          </p>
        </div>
      </div>
      <TotalBidsTableModel setOpen={setTotalBidOpen} open={openTotaltBid} />
    </div>
  );
};

export default SummaryAuctionSections;
