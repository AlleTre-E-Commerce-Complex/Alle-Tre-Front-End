import React, { useEffect, useRef, useState, useCallback } from "react";
import Swiper from "swiper";
import "./auctions-slider.scss";
import AuctionCard from "./auction-card";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import { Dimmer } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import LoadingTest3arbon from "component/shared/lotties-file/loading-test-3arbon";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const BuyNowAuctionsSlider = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { isLoading: isLoadingAuctions } = useAxios([]);

  const [auctions, setAuctions] = useState([]);
  const perPage = 20;
  const onReload = useCallback(() => setAuctions((prev) => [...prev]), []);

  const swiperRef = useRef(null);
  const swiperInstance = useRef(null);
  const isRtl = lang === "ar";

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await authAxios.get(
          `${api.app.auctions.getExpiredAuctions}?page=1&perPage=${perPage}`,
        );
        setAuctions(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setAuctions([]);
      }
    };
    fetchAuctions();
  }, []);

  useEffect(() => {
    if (!swiperRef.current || auctions.length === 0) return;

    swiperInstance.current = new Swiper(swiperRef.current, {
      slidesPerView: 2,
      spaceBetween: 12,
      freeMode: true,
      mousewheel: false,
      keyboard: { enabled: true },
      speed: 400,
      breakpoints: {
        480: { slidesPerView: 2.5, spaceBetween: 14 },
        640: { slidesPerView: 3.2, spaceBetween: 14 },
        768: { slidesPerView: 4, spaceBetween: 16 },
        1024: { slidesPerView: 5, spaceBetween: 16 },
        1280: { slidesPerView: 6, spaceBetween: 16 },
      },
    });

    return () => {
      if (swiperInstance.current) {
        swiperInstance.current.destroy(true, true);
        swiperInstance.current = null;
      }
    };
  }, [auctions]);

  const handleNext = () => {
    if (isRtl) swiperInstance.current?.slidePrev();
    else swiperInstance.current?.slideNext();
  };

  const handlePrev = () => {
    if (isRtl) swiperInstance.current?.slideNext();
    else swiperInstance.current?.slidePrev();
  };

  if (auctions.length === 0 && !isLoadingAuctions) return null;

  return (
    <div className="relative">
      <Dimmer className="bg-white/50" active={isLoadingAuctions} inverted>
        <LoadingTest3arbon />
      </Dimmer>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#d4af37] rounded-full shrink-0" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1e2738] dark:text-white uppercase tracking-wider leading-none">
              {selectedContent[localizationKeys.expiredAuctions]}
            </h2>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 tracking-wide">
              {selectedContent[localizationKeys.theBestDealsYouMissed]}
            </p>
          </div>
        </div>

        {/* Desktop nav buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2738] hover:border-[#d4af37] hover:bg-[#d4af37] dark:hover:bg-[#d4af37] text-gray-600 dark:text-gray-300 hover:text-white dark:hover:text-[#1e2738] flex items-center justify-center transition-all duration-200 shadow-sm"
            aria-label="Previous"
          >
            <MdNavigateBefore className="text-lg" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2738] hover:border-[#d4af37] hover:bg-[#d4af37] dark:hover:bg-[#d4af37] text-gray-600 dark:text-gray-300 hover:text-white dark:hover:text-[#1e2738] flex items-center justify-center transition-all duration-200 shadow-sm"
            aria-label="Next"
          >
            <MdNavigateNext className="text-lg" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="relative px-4">
        <div ref={swiperRef} className="swiper overflow-hidden">
          <div className="swiper-wrapper">
            {auctions.map((e) => (
              <div key={e?.id} className="swiper-slide !h-auto">
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
                  onReload={onReload}
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
          </div>
        </div>

        {/* Mobile nav buttons */}
        <button
          onClick={handlePrev}
          className="sm:hidden absolute left-0 top-1/3 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-[#1e2738] border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
          aria-label="Previous"
        >
          <MdNavigateBefore className="text-lg" />
        </button>
        <button
          onClick={handleNext}
          className="sm:hidden absolute right-0 top-1/3 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-[#1e2738] border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
          aria-label="Next"
        >
          <MdNavigateNext className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default BuyNowAuctionsSlider;
