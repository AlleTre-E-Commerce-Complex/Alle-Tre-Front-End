import React, { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import AnglesRight from "../../../src/assets/icons/arrow-right.svg";
import AnglesLeft from "../../../src/assets/icons/arrow-left.svg";
import "./auctions-slider.scss";
import AuctionCard from "./auction-card";
import { useLocation } from "react-router-dom";
import { useAuthState } from "../../context/auth-context";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import axios from "axios";
import api from "../../api";
import { Dimmer } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import LodingTestAllatre from "component/shared/lotties-file/loding-test-allatre";
import { ReactComponent as NoUpcomingImg } from "../../../src/assets/images/noUpcoming Auction.svg";

const UpComingAuctionsSlider = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { search } = useLocation();
  const { user } = useAuthState();
  const { run: runAuctions, isLoading: isLoadingAuctions } = useAxios([]);
  const [auctions, setAuctions] = useState();
  const [pagination, setPagination] = useState();
  const [page, setPage] = useState(20);

  const swiperRef = useRef(null);
  const swiperInstance = useRef(null);

  useEffect(() => {
    if (search.includes("page") && search.includes("perPage") && user) {
      runAuctions(
        authAxios
          .get(`${api.app.auctions.getUpComming}?page=1&perPage=${page}`)
          .then((res) => {
            setAuctions(res?.data?.data);
            setPagination(res?.data?.pagination);
          })
      );
    } else {
      runAuctions(
        axios
          .get(`${api.app.auctions.getUpComming}?page=1&perPage=${page}`)
          .then((res) => {
            setAuctions(res?.data?.data);
            setPagination(res?.data?.pagination);
          })
      );
    }
  }, [page, runAuctions, search, user]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperInstance.current = new Swiper(swiperRef.current, {
        cssMode: true,
        speed: 1000,
        navigation: {
          nextEl: `.swiper-button-next`,
          prevEl: `.swiper-button-prev`,
        },
        slidesPerView: "auto",
        mousewheel: true,
        keyboard: true,
      });
    }

    return () => {
      if (swiperInstance.current) {
        swiperInstance.current.destroy(true, true);
        swiperInstance.current = null;
      }
    };
  }, [auctions]);

  const handleNextClick = () => {
    if (pagination?.totalItems > pagination?.perPage) {
      swiperInstance.current?.slideNext();
      setPage((prevPage) => prevPage + 5);
    } else {
      swiperInstance.current?.slideNext();
    }
  };

  const handlePrevClick = () => {
    swiperInstance.current?.slidePrev();
  };

  return (
    <div>
      <div className="text-center">
        <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md ">
          {selectedContent[localizationKeys.upComingAuctions]}
        </h1>
        <p className="text-gray-med text-base font-normal pb-1">
          {selectedContent[localizationKeys.ComingSoonGetReadytoBid]}
        </p>
      </div>

      {auctions?.length === 0 ? (
        <div className="flex flex-col items-center ">
          <NoUpcomingImg className="w-40 h-40" />
        </div>
      ) : (
        <div className="ezd-content relative">
          <Dimmer className="bg-white/50" active={isLoadingAuctions} inverted>
            <LodingTestAllatre />
          </Dimmer>
          <div className="ezd-snapslider pt-6 pb-4">
            <div className="snapslider-wrapper relative px-4 md:px-8">
              <div ref={swiperRef} className="snapslider-overflow">
                <div
                  className={`${
                    auctions?.length > 4
                      ? ""
                      : "md:justify-center justify-start"
                  } snapslider-scroll swiper-wrapper gap-4`}
                >
                  {auctions?.map((e) => (
                    <div key={e?.id} className="snapslider-card swiper-slide !w-[48%] sm:!w-[31%] md:!w-[19%] lg:!w-[15.6%]">
                      <AuctionCard
                        auctionId={e?.id}
                        startBidAmount={e?.startBidAmount || e?.acceptedAmount}
                        title={e?.product?.title}
                        status={e?.status}
                        adsImg={e?.product?.images[0].imageLink}
                        totalBods={e?._count?.bids}
                        WatshlistState={e?.isSaved}
                        endingTime={e?.expiryDate}
                        StartDate={e?.startDate}
                        isBuyNowAllowed={e?.isBuyNowAllowed}
                        isMyAuction={e?.isMyAuction}
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleNextClick}
                  className="swiper-button-next absolute top-1/2 -translate-y-1/2 -right-2 md:right-0 z-10 transition-transform hover:scale-105"
                >
                  <div className="rounded-full bg-white shadow-lg p-2 cursor-pointer w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                    <img
                      className="w-6 h-6 md:w-8 md:h-8"
                      src={AnglesRight}
                      alt="Next"
                    />
                  </div>
                </button>
                <button
                  onClick={handlePrevClick}
                  className="swiper-button-prev absolute top-1/2 -translate-y-1/2 -left-2 md:left-0 z-10 transition-transform hover:scale-105"
                >
                  <div className="rounded-full bg-white shadow-lg p-2 cursor-pointer w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                    <img
                      className="w-6 h-6 md:w-8 md:h-8"
                      src={AnglesLeft}
                      alt="Previous"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpComingAuctionsSlider;
