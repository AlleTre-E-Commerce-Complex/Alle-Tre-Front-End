import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/format-currency";
import { truncateString } from "../../utils/truncate-string";

// import RatingStare from "../shared/rating-star/rating-star";

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
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "component/shared/lotties-file/loding-test-allatre";
import useAxios from "hooks/use-axios";
import { BiSolidFilePdf } from "react-icons/bi";

const SummaryAuctionSections = ({
  title,
  description,
  category,
  subCategory,
  startingPrice,
  endingPrice,
  totalBids,
  endingTime,
  startingTime,
  setActiveIndexTab,
  status,
  relatedDocuments,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { pathname } = useLocation();
  const [openTotaltBid, setTotalBidOpen] = useState(false);
  const [lastestBid, setLastestBid] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { auctionId } = useParams();
  dispatch(socketAuctionId(auctionId));

  useEffect(() => {
    if (category === undefined) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [category]);

  const { isLoading: isLoadingAuctionById } = useAxios([]);
  const socket = useSocket();
  // useEffect(() => {
  //   if (socket) {
  //     socket.on("bid:submitted", (data) => {
  //       setLastestBid(data);
  //     });
  //   }

  //   return () => {
  //     if (socket) {
  //       socket.off("bid:submitted");
  //     }
  //   };
  // }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
  
    const handleBidSubmitted = (data) => {
      try {
        setLastestBid(data);
      } catch (error) {
        console.error("Error handling bid:submitted:", error);
      }
    };
  
    socket.on("bid:submitted", handleBidSubmitted);
  
    return () => {
      socket.off("bid:submitted", handleBidSubmitted);
    };
  }, [socket]);
  

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingAuctionById || loading}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <div>
        {/* Title Section */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>

        {/* Status and Rating Section */}
        <div className="flex items-center gap-x-5">
          <AuctionsStatus status={status} big />
          {/* Rating Section (uncomment when needed) */}
          {/* <div className="flex items-center gap-x-2">
<RatingStare max={numberStare} size="huge" />
<p className="text-sm text-gray-600">
  ({totalReviews} {selectedContent[localizationKeys.reviews]})
</p>
</div> */}
        </div>
        {/* Description */}
        <div className="pt-8 overflow-clip">
          <h3 className="text-gray-dark text-base font-normal">
            {selectedContent[localizationKeys.description]}
          </h3>
          <p className="text-gray-dark text-2xl font-normal pt-4 pb-1">
            {truncateString(description, 250)}
          </p>
          <HashLink
            className="underline text-gray-dark text-sm font-normal cursor-pointer pt-2"
            smooth
            to={`${pathname}#itemDescription`}
            onClick={() => setActiveIndexTab(0)}
          >
            {selectedContent[localizationKeys.viewDetails]}
          </HashLink>
        </div>
        {/* Documents Section */}
        {relatedDocuments?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-gray-dark text-base font-normal">
            {selectedContent[localizationKeys.relatedDocument]}
            </h3>

            <div className="max-w-md">
                 <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                {/* Document Header */}
                <div className="p-4 bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BiSolidFilePdf className="w-8 h-8 text-red-500" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                        {selectedContent[localizationKeys.document]}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                        {selectedContent[localizationKeys.Pdfdocument]}
                        </p>
                      </div>
                    </div>
                    <a
                      href={relatedDocuments[0].imageLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-primary hover:bg-primary/80 transition-colors duration-300"
                    >
                      {selectedContent?.[localizationKeys.view]}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category sections */}
        <div className="pt-6 mb-8 flex flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              {selectedContent[localizationKeys.category]}
            </p>
            <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
              {category}
            </div>
          </div>
          {subCategory && (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                {selectedContent[localizationKeys.subCategory]}
              </p>
              <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                {subCategory}
              </div>
            </div>
          )}
        </div>
        {/* Prices  sections */}
        <div className="pt-6 grid md:grid-cols-2 sm:grid-cols-1 gap-6">
          <div className="space-y-2">
            <p className="text-gray-med text-base font-normal">
              {selectedContent[localizationKeys.startingPrice]}
            </p>
            <p className="text-gray-verydark cursor-default text-2xl font-semibold">
              {formatCurrency(startingPrice)}
            </p>
          </div>
          <div className="space-y-2">
            {status === "ACTIVE" ? (
              <p className="text-gray-med text-base font-normal">
                {selectedContent[localizationKeys.currentBid]}
              </p>
            ) : (
              <p className="text-gray-med text-base font-normal">
                {selectedContent[localizationKeys.endingPrice]}
              </p>
            )}
            <p className="text-gray-verydark cursor-default text-2xl font-semibold">
              {formatCurrency(lastestBid?.bidAmount) ||
                formatCurrency(endingPrice) ||
                "--"}
            </p>
          </div>

          {/* Bids Section */}
          <div className="space-y-4">
            <p className="text-gray-med text-base font-normal">
              {selectedContent[localizationKeys.totalBids]}
            </p>
            <div className="flex items-center gap-4">
              <p className="text-gray-verydark text-2xl font-semibold">
                {lastestBid?.totalBids || totalBids}
              </p>
              <button
                onClick={() => setTotalBidOpen(true)}
                className="w-24 h-8 text-xs font-medium bg-primary rounded text-white flex items-center justify-center gap-x-2 px-2"
              >
                <span>{selectedContent[localizationKeys.viewAll]}</span>
                <img
                  className="w-2.5 h-2.5"
                  src={AnglesRight}
                  alt="AnglesRight"
                />
              </button>
            </div>
          </div>

          {/* Time Section */}
          <div className="space-y-4">
            {status === "IN_SCHEDULED" && (
              <div className="space-y-2">
                <p className="text-gray-med text-base font-normal">
                  {selectedContent[localizationKeys.startingTime]}
                </p>
                <p className="text-gray-verydark text-2xl font-semibold">
                  {moment(startingTime).format("hh:mm A · DD MMM YYYY")}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-gray-med text-base font-normal">
                {selectedContent[localizationKeys.endingTime]}
              </p>
              <p className="text-gray-verydark text-2xl font-semibold">
                {moment(endingTime).format("hh:mm A · DD MMM YYYY")}
              </p>
            </div>
          </div>
        </div>

        <TotalBidsTableModel setOpen={setTotalBidOpen} open={openTotaltBid} />
      </div>
    </>
  );
};

export default SummaryAuctionSections;
