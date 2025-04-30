import React, { useState, useEffect, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import AuctionCard from "./auction-card";
import { useLanguage } from "../../context/language-context";
import { formatCurrency } from "../../utils/format-currency";
import AuctionsStatus from "../shared/status/auctions-status";
import moment from "moment";
import { BiSolidPurchaseTag } from "react-icons/bi";
import Timer from "../../assets/icons/time.png";
import TimmerGif from "../../assets/icons/timer2.gif";
import Hummer from "../../assets/icons/bid.png";
import HummerGif from "../../assets/icons/HummerGifFin.gif";
import useCountdown from "../../hooks/use-countdown";
import localizationKeys from "../../localization/localization-keys";
import content from "../../localization/content";
import routes from "../../routes";
import { useHistory } from "react-router-dom";

const CountdownTimer = memo(({ startDate, expiryDate, status }) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const timeLeft = useCountdown(status === "IN_SCHEDULED" ? startDate : expiryDate);

  const formattedTime = `${timeLeft.days} ${selectedContent[localizationKeys.days]} : ${timeLeft.hours} ${selectedContent[localizationKeys.hrs]} : ${timeLeft.minutes} ${selectedContent[localizationKeys.min]} : ${timeLeft.seconds} ${selectedContent[localizationKeys.sec]}`;

  return (
    <p className={`${timeLeft.days === 0 ? "text-red" : "text-gray-800"} font-medium text-[10px] md:text-xs`}>
      {formattedTime}
    </p>
  );
});

const BannerTop = ({ auctions = [] }) => {

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [forceReload, setForceReload] = useState(false);
  const [lang] = useLanguage();
  const selectedContent = content[lang];
   const history = useHistory();
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      onReload();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onReload, lang]);

  const handelGoDetails = (auction) => {
    if (auction?.isMyAuction) {
      if (auction?.status === "ACTIVE") {
        history.push(routes.app.profile.myAuctions.activeDetails(auction.id));
      }
      if (auction?.status === "IN_SCHEDULED") {
        history.push(routes.app.profile.myAuctions.scheduledDetails(auction.id));
      }
      if (auction?.status === "SOLD") {
        history.push(routes.app.profile.myAuctions.soldDetails(auction.id));
      }
      if (auction?.status === "PENDING_OWNER_DEPOIST") {
        history.push(routes.app.profile.myAuctions.pendingDetails(auction.id));
      }
      if (auction?.status === "EXPIRED") {
        history.push(routes.app.profile.myAuctions.activeDetails(auction.id));
      }
    } else history.push(routes.app.homeDetails(auction.id));
  };

  useEffect(() => {
    if (auctions.length > 0) {
      onReload();
    }
  }, [auctions, onReload, lang]);

  return isMobile ? (
    <div className="w-full px-1 py-1 ">
      <div className="mb-3 flex justify-between items-center">
      </div>
      <Swiper
        key={`swiper-mobile-${forceReload}-${auctions.length}`}
        slidesPerView={1.05}
        spaceBetween={12}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Autoplay, Pagination]}
        className="!pb-3 "
      >
        {auctions?.slice(0, 6).map((auction, index) => (
          <SwiperSlide key={auction?.id || index}>
            <div className="w-full h-[180px] rounded-xl overflow-hidden shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 mx-auto flex">
              <div className="w-[45%] h-full relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group">
                <img
                  src={auction?.product?.images?.[0]?.imageLink}
                  alt={auction?.product?.title || 'Auction item'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {auction?.status && (
                  <div className="absolute top-0 ">
                    <AuctionsStatus status={auction.status} />
                  </div>
                )}
              </div>
              <div className="flex-1 p-3 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50/80">
                <div className="flex flex-col h-full justify-between py-1">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h1 className="text-gray-800 font-semibold text-md line-clamp-2 hover:text-primary transition-colors duration-200 mb-4 group-hover:text-primary">
                        {auction?.product?.title}
                      </h1>
                      <div className={`shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-medium ${auction?.product?.usageStatus === "NEW" ? "bg-primary-veryLight text-primary" : "bg-gray-100 text-gray-700"}`}>
                        {auction?.product?.usageStatus?.charAt(0).toUpperCase() + auction?.product?.usageStatus?.slice(1).toLowerCase()}
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-0.5 mt-1">
                      <div className="flex items-center gap-1">
                        {auction?.status === "IN_SCHEDULED" ? (
                          <img className="w-4 h-4 object-contain mb-0.5" src={Timer} alt="Timer" />
                        ) : auction?.status === "SOLD" ? (
                          <div className="text-primary"><BiSolidPurchaseTag /></div>
                        ) : (
                          <img className="w-[14px] h-[14px] object-contain" src={TimmerGif} alt="Timer" />
                        )}
                        {auction?.status === "SOLD" ? (
                          <p className="text-gray-800 text-[10px] sm:text-md text-sm py-8">
                            {moment(auction?.Payment[0]?.createdAt).local().format("DD-MMMM-YYYY")}
                          </p>
                        ) : (
                          <CountdownTimer
                            startDate={auction?.startDate}
                            expiryDate={auction?.expiryDate}
                            status={auction?.status}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <img src={auction?.status === "IN_SCHEDULED" ? Hummer : HummerGif} alt="Gavel" className="w-3 h-3 object-contain" />
                        <p className="text-gray-800 font-semibold text-[10px]">{auction?._count?.bids || 0}</p>
                      </div>
                    </div>

                    <div className="mt-1" onClick={() => handelGoDetails(auction)} >
                      <div className="text-[11px] text-gray-600 font-medium mt-3"> {selectedContent[localizationKeys.currentBid]}</div>
                      <div className="text-primary font-bold text-sm bg-primary-veryLight/50 px-2 py-1 rounded-md inline-block">
                        {formatCurrency(auction?.currentBid?.bidAmount || auction?.startBidAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-1">
                    {auction?.isBuyNowAllowed && (
                      <button onClick={() => handelGoDetails(auction)} className="border-primary border text-primary hover:bg-primary hover:text-white rounded-lg flex-1 py-1.5 text-[11px] font-semibold transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md">
                        {selectedContent[localizationKeys.buyNow]}
                      </button>
                    )}
                    <button onClick={() => handelGoDetails(auction)} className="bg-primary hover:bg-primary-dark text-white rounded-lg flex-1 py-1.5 text-[11px] font-semibold transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg">
                      {selectedContent[localizationKeys.bidNow]}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
      .swiper-pagination {
        bottom: 0px !important;
      }
      .swiper-pagination-bullet {
        background: rgba(0,0,0,0.3) !important;
        width: 8px !important;
        height: 8px !important;
        opacity: 1 !important;
      }
      .swiper-pagination-bullet-active {
        background: #5b0c1f !important;
        width: 16px !important;
        border-radius: 4px !important;
      }
    `}</style>
    </div>
  ) : (
    <div className="rounded-lg bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative w-full mx-auto py-2 md:py-4 lg:py-6 shadow-lg">
      <div className="w-full mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/3 relative group">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/90 pb-3 mb-8 transition-all duration-500 group-hover:translate-x-2">
            {selectedContent[localizationKeys.hotAuctions]}
            <span
              className="absolute -bottom-4 left-0 w-3/4 h-1 bg-gradient-to-r from-[#ff4d6d] via-[#ff758f] to-[#ff8fa3] rounded-full shadow-lg shadow-[#ff4d6d]/30 group-hover:w-2/4 group-hover:from-[#ff758f] group-hover:to-[#ff4d6d] transition-all duration-500"></span>

          </h1>
          <p className="mt-4 text-white/80 text-lg sm:text-xl font-medium max-w-lg transition-all duration-300 group-hover:text-white group-hover:translate-x-2">
          {selectedContent[localizationKeys.discoverTrendingAuctionsWithExclusiveDeals]} 
          </p>

        </div>
        <div className="w-full md:w-2/3 pl-32 md:pl-44">
          <Swiper
            key={`swiper-${forceReload}-${auctions.length}`}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={lang === "ar" ? 3.3 : 3.5}
            spaceBetween={0}
            loop={true}
            initialSlide={1}
            loopedSlides={6}
            width={lang === 'ar' ? 900 : 880}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            coverflowEffect={{
              stretch: 0,
              depth: lang === 'ar' ? 100 : 80,
              rotate: 5,
              modifier: lang === 'ar' ? 2.5 : 2,
              slideShadows: false,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              enabled: true,
              reverseDirection: false,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="swiper-container py-4"
          >
            {auctions?.slice(0, 6).map((auction, index) => (
              <SwiperSlide key={auction?.id || index}>
                <div className="relative w-full max-w-[280px] h-full rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <AuctionCard
                    auctionId={auction?.id}
                    price={auction?.acceptedAmount || auction?.startBidAmount}
                    title={auction?.product?.title}
                    status={auction?.status}
                    adsImg={auction?.product?.images}
                    totalBods={auction?._count?.bids}
                    WatshlistState={auction?.isSaved}
                    endingTime={auction?.expiryDate}
                    StartDate={auction?.startDate}
                    isBuyNowAllowed={auction?.isBuyNowAllowed}
                    isMyAuction={auction?.isMyAuction}
                    latestBidAmount={auction?.bids[0]?.amount}
                    CurrentBid={auction?.currentBid?.bidAmount}
                    startBidAmount={auction?.startBidAmount}
                    usageStatus={auction?.product?.usageStatus}
                    category={auction?.product?.categoryId}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <style jsx global>{`
        .swiper-pagination {
          margin-top: 2rem !important;
        }
        .swiper-pagination-bullet {
          background: rgba(255,255,255,0.5) !important;
          width: 8px !important;
          height: 8px !important;
          transition: all 0.3s !important;
          margin: -14px 6px !important;
        }
        .swiper-pagination-bullet-active {
          background: #5b0c1f !important;
          width: 24px !important;
          border-radius: 4px !important;
        }
      `}</style>
    </div>

  );
};

export default BannerTop;
