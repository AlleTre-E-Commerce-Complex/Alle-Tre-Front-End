import axios from "axios";
import { useEffect, useState } from "react";
import { Dimmer } from "semantic-ui-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import api from "../../api";
import { authAxios } from "../../config/axios-config";
import { useAuthState } from "../../context/auth-context";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";
import content from "../../localization/content";
import AuctionCard from "../home-components/auction-card";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";
import "./auctions-slider.scss";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import ProductCard from "component/home-components/ProductCard";
import localizationKeys from "../../localization/localization-keys";

const SilmilarProductsSlider = ({ categoriesId, isListProduct }) => {
  const [lang] = useLanguage("");
  const { auctionId } = useParams();
  const { productId } = useParams();

  const selectedContent = content[lang];
  // const { search } = useLocation();
  const { user } = useAuthState();

  const { run: runAuctions, isLoading: isLoadingAuctions } = useAxios([]);

  const [auctions, setAuctions] = useState();
  const [pagination, setpagination] = useState();
  const [page, setPage] = useState(20);
  const [swiperInst, setSwiperInst] = useState(null);

  useEffect(() => {
    if (
      !isListProduct
      //  && categoriesId
    ) {
      if (user) {
        runAuctions(
          authAxios
            .get(`${api.app.auctions.SimilarAuctions(auctionId)}`)
            .then((res) => {
              setAuctions(res?.data?.data);
              setpagination(res?.data?.pagination);
            }),
        );
      } else {
        runAuctions(
          axios
            .get(`${api.app.auctions.SimilarAuctions(auctionId)}`)
            .then((res) => {
              setAuctions(res?.data?.data);
              setpagination(res?.data?.pagination);
            }),
        );
      }
    } else {
      runAuctions(
        authAxios
          .get(`${api.app.productListing.SimilarProduct(productId)}`)
          .then((res) => {
            setAuctions(res?.data?.data);
            setpagination(res?.data?.pagination);
          }),
      );
    }
  }, [
    // categoriesId,
    page,
    runAuctions,
    user,
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const handleNextClick = () => {
    if (pagination?.totalItems > pagination?.perPage) {
      swiperInst?.slideNext();
      setPage((prevPage) => prevPage + 5);
    } else swiperInst?.slideNext();
  };

  const handlePrevClick = () => {
    swiperInst?.slidePrev();
  };

  return (
    <>
      <Dimmer className=" bg-white/50" active={isLoadingAuctions} inverted>
        <LodingTestAllatre />
      </Dimmer>
      {auctions?.length === 0 ? null : (
        <div
          className={
            auctions?.length === 0
              ? "hidden"
              : "ezd-content relative py-12 md:py-16 mt-8 border-t border-gray-100 dark:border-slate-800"
          }
        >
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 -mt-24 -mr-24 pointer-events-none" />

          <div
            className={`flex flex-col items-start justify-start mb-8 md:mb-12 w-full max-w-7xl px-4 ${lang === "ar" ? "text-right" : "text-left"}`}
          >
            <div className="flex gap-3 mb-2">
              <div className="w-1.5 h-6 md:h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
              <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                {selectedContent[localizationKeys.similarProducts]}
              </h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium px-5 md:px-6">
              {selectedContent[localizationKeys.exploreRelatedFind]}
            </p>
          </div>

          <div className="relative group/slider">
            <div className="relative py-4">
              <Swiper
                onSwiper={setSwiperInst}
                speed={800}
                slidesPerView="auto"
                grabCursor={true}
                dir={lang === "ar" ? "rtl" : "ltr"}
                centerInsufficientSlides={true}
                className="w-full overflow-visible"
                breakpoints={{
                  320: { spaceBetween: 16 },
                  640: { spaceBetween: 20 },
                  768: { spaceBetween: 24 },
                  1024: { spaceBetween: 32 },
                }}
              >
                {auctions?.map((e, index) => (
                  <SwiperSlide
                    className="swiper-slide !w-[45%] sm:!w-[30%] md:!w-[20%] lg:!w-[15%] xl:!w-[13%] transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 rounded-2xl"
                    onClick={() =>
                      window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                    }
                  >
                    {isListProduct ? (
                      <ProductCard
                        key={e?.id}
                        price={e?.product?.ProductListingPrice}
                        title={e?.product?.title}
                        adsImg={e?.product?.images}
                        id={e?.product?.id}
                        city={
                          lang === "en"
                            ? e?.location?.city?.nameEn
                            : e?.location?.city?.nameAr
                        }
                        country={
                          lang === "en"
                            ? e?.location?.country?.nameEn
                            : e?.location?.country?.nameEn
                        }
                        createdAt={e?.createdAt}
                        usageStatus={e?.product?.usageStatus}
                        category={e?.product?.categoryId}
                      />
                    ) : (
                      <AuctionCard
                        auctionId={e?.id}
                        startBidAmount={e?.acceptedAmount || e?.startBidAmount}
                        title={e?.product?.title}
                        status={e?.status}
                        adsImg={e?.product?.images}
                        totalBods={e?._count?.bids}
                        WatshlistState={e?.isSaved}
                        endingTime={e?.expiryDate}
                        StartDate={e?.startDate}
                        isBuyNowAllowed={e?.isBuyNowAllowed}
                        isMyAuction={e?.isMyAuction}
                        latestBidAmount={e?.bids[0]?.amount || 0}
                        usageStatus={e?.product?.usageStatus}
                        category={e?.product?.categoryId}
                        fullHeight={true}
                      />
                    )}
                  </SwiperSlide>
                ))}
                {auctions?.length >= 2 && (
                  <SwiperSlide className="!w-[45%] sm:!w-[30%] md:!w-[20%] lg:!w-[15%] xl:!w-[13%] flex items-center justify-center">
                    {/* <div className="text-center p-4">
                      <div className="w-12 h-16 mx-auto mb-4 rounded-full bg-gray-50 dark:bg-slate-800/50 backdrop-blur-sm flex items-center justify-center mt-24 md:mt-36 ring-1 ring-gray-100 dark:ring-slate-700/50 shadow-sm transition-transform hover:scale-105">
                        <svg
                          className="w-8 h-8 text-gray-400 dark:text-gray-500"
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
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        {selectedContent[localizationKeys.noMoreAuctions]}
                      </p>
                    </div> */}
                  </SwiperSlide>
                )}
              </Swiper>
              <button
                type="button"
                onClick={lang === "ar" ? handlePrevClick : handleNextClick}
                className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 z-10 transition-all duration-300 hover:scale-110 disabled:opacity-50 lg:hidden"
              >
                <div className="bg-primary-light dark:bg-slate-800/90  p-3 md:p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 group transition-colors">
                  <BsChevronRight className="text-gray-900 dark:text-white text-lg md:text-xl transition-transform group-hover:scale-110" />
                </div>
              </button>
              <button
                type="button"
                onClick={lang === "ar" ? handleNextClick : handlePrevClick}
                className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 z-10 transition-all duration-300 hover:scale-110 disabled:opacity-50 lg:hidden"
              >
                <div className="bg-primary-light dark:bg-slate-800/90 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 group transition-colors">
                  <BsChevronLeft className="text-gray-900 dark:text-white text-lg md:text-xl transition-transform group-hover:scale-110" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SilmilarProductsSlider;
