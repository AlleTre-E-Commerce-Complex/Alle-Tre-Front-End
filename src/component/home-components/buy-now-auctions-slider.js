import React, { useEffect, useRef } from "react";
import Swiper from "swiper";
import AnglesRight from "../../../src/assets/icons/arrow-right.svg";
import AnglesLeft from "../../../src/assets/icons/arrow-left.svg";
import "./auctions-slider.scss";
import AuctionCard from "./auction-card";
// import { useLocation } from "react-router-dom";
// import { useAuthState } from "../../context/auth-context";
import useAxios from "../../hooks/use-axios";
import { useState } from "react";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import { Dimmer } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
// import { useSelector } from "react-redux";
import { ReactComponent as NoExpAuctionImg } from "../../../src/assets/images/noExpiredAuction.svg";
import LodingTestAllatre from "component/shared/lotties-file/loding-test-allatre";

const BuyNowAuctionsSlider = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  // const { search } = useLocation();
  // const { user } = useAuthState();
  const { isLoading: isLoadingAuctions } = useAxios([]);

  const [auctions, setAuctions] = useState([]);
  const [pagination, setpagination] = useState(null);
  const [page, setPage] = useState(20);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await authAxios.get(
          `${api.app.auctions.getExpiredAuctions}?page=1&perPage=${page}`
        );
        const auctionsData = response?.data?.data || [];
        setAuctions(auctionsData);
        setpagination(response?.data?.pagination);
      } catch (error) {
        console.error('Error fetching auctions:', error);
        setAuctions([]);
      }
    };

    fetchAuctions();
  }, [page]);

  const swiperOptions = {
    cssMode: true,
    speed: 1000,
    navigation: {
      nextEl: `.swiper-button-next`,
      prevEl: `.swiper-button-prev`,
    },
    slidesPerView: "auto",
    mousewheel: true,
    keyboard: true,
  };

  const swiperRef2 = useRef(null);
  const swiper2 = useRef(null);

  useEffect(() => {
    if (swiperRef2.current) {
      swiper2.current = new Swiper(swiperRef2.current, swiperOptions);
    }
    return () => {
      if (swiper2.current) {
        swiper2.current.destroy();
      }
    };
  }, [auctions]);

  const handleNextClick = () => {
    if (pagination?.totalItems > pagination?.perPage) {
      swiper2.current?.slideNext();
      setPage(page + 5);
    } else swiper2.current?.slideNext();
  };

  const handlePrevClick = () => {
    swiper2.current?.slidePrev();
  };

  return (
    <>
      {" "}
      <Dimmer className=" bg-white/50" active={isLoadingAuctions} inverted>
        <LodingTestAllatre />
      </Dimmer>
      <div>
        <div className="text-center">
          <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md ">
            {selectedContent[localizationKeys.expiredAuctions]}
          </h1>
          <p className="text-gray-med text-base font-normal pb-1">
            {selectedContent[localizationKeys.theBestDealsYouMissed]}
          </p>
        </div>
        {auctions?.length === 0 ? (
          <div className="flex flex-col items-center">
            <NoExpAuctionImg className="w-40 h-40" />
          </div>
        ) : (
          <div className="ezd-content relative">
            <div className="ezd-snapslider pt-6 pb-4">
              <div className="snapslider-wrapper relative px-4 md:px-8">
                <div ref={swiperRef2} className="snapslider-overflow">
                  <div
                    className={`${
                      auctions?.length > 4
                        ? ""
                        : "md:justify-center justify-start"
                    } snapslider-scroll swiper-wrapper gap-3`}
                  >
                    {auctions?.map((e) => (
                      <div
                        key={e?.id}
                        className="snapslider-card swiper-slide !w-[44%] sm:!w-[28%] md:!w-[17%] lg:!w-[13%]"
                      >
                        <AuctionCard
                          isExpired={e?.status === "EXPIRED"}
                          auctionId={e?.id}
                          price={e?.acceptedAmount || e?.startBidAmount}
                          title={e?.product?.title}
                          status={e?.status}
                          adsImg={e?.product?.images}
                          totalBods={e?._count?.bids}
                          WatshlistState={e?.isSaved}
                          endingTime={e?.expiryDate}
                          isBuyNowAllowed={e?.isBuyNowAllowed}
                          isMyAuction={e?.isMyAuction}
                          latestBidAmount={e?.bids[0]?.amount}
                          startBidAmount={e?.startBidAmount}
                          hideButton={true}
                          usageStatus={e?.product?.usageStatus}
                          category={e?.product?.categoryId}
                        />
                      </div>
                    ))}
                    {auctions?.length >= 2 && (
                      <div className="swiper-slide !w-[48%] sm:!w-[31%] md:!w-[19%] lg:!w-[15.6%] flex items-center justify-center mx-auto h-full mt-32">
                        <div className="text-center p-4 pt-12 w-full self-center my-auto">
                          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={
                                  lang === "ar"
                                    ? "M19 12H5M12 19l-7-7 7-7"
                                    : "M5 12h14M12 5l7 7-7 7"
                                }
                              />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-sm font-medium">
                            {selectedContent[localizationKeys.noMoreAuctions]}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={lang === "ar" ? handlePrevClick : handleNextClick}
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
                    onClick={lang === "ar" ? handleNextClick : handlePrevClick}
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
    </>
  );
};

export default BuyNowAuctionsSlider;
