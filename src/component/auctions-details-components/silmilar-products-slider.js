import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Dimmer } from "semantic-ui-react";
import Swiper from "swiper";
import AnglesLeft from "../../../src/assets/icons/arrow-left.svg";
import AnglesRight from "../../../src/assets/icons/arrow-right.svg";
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
  // const loginData = useSelector((state) => state?.loginDate?.loginDate);
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
            })
        );
      } else {
        runAuctions(
          axios
            .get(`${api.app.auctions.SimilarAuctions(auctionId)}`)
            .then((res) => {
              setAuctions(res?.data?.data);
              setpagination(res?.data?.pagination);
            })
        );
      }
    } else {
      runAuctions(
        authAxios
          .get(`${api.app.productListing.SimilarProduct(productId)}`)
          .then((res) => {
            setAuctions(res?.data?.data);
            setpagination(res?.data?.pagination);
          })
      );
    }
  }, [
    // categoriesId,
    page,
    runAuctions,
    user,
  ]);

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
    breakpoints: {
      320: {
        spaceBetween: 8,
        slidesPerView: "auto",
      },
      480: {
        spaceBetween: 12,
        slidesPerView: "auto",
      },
      768: {
        spaceBetween: 16,
        slidesPerView: "auto",
      },
      1024: {
        spaceBetween: 18,
        slidesPerView: "auto",
      },
    },
  };

  const swiperRef = useRef(null);
  const swiper = new Swiper(swiperRef?.current, { ...swiperOptions });

  useEffect(() => {
    return () => {
      swiper?.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const handleNextClick = () => {
    if (pagination?.totalItems > pagination?.perPage) {
      swiper?.slideNext();
      setPage(page + 5);
    } else swiper?.slideNext();
  };

  const handlePrevClick = () => {
    swiper?.slidePrev();
  };

  return (
    <>
      <Dimmer className=" bg-white/50" active={isLoadingAuctions} inverted>
        <LodingTestAllatre />
      </Dimmer>
      {auctions?.length === 0 ? null : (
        <div
          className={
            auctions?.length === 0 ? "hidden" : "ezd-content relative  "
          }
        >
          <div className="text-center">
            <h1 className="text-gray-dark text-base font-bold">
              {selectedContent[localizationKeys.similarProducts]}
            </h1>
            <p className="text-gray-med text-base font-normal">
              {selectedContent[localizationKeys.exploreRelatedFind]}
            </p>
          </div>

          <div className="ezd-snapslider pt-10">
            <div className="snapslider-wrapper relative ">
              <div ref={swiperRef} className="snapslider-overflow">
                <div
                  className={`${
                    auctions?.length > 4
                      ? ""
                      : "md:justify-center justify-start"
                  } snapslider-scroll swiper-wrapper py-2`}
                >
                  {auctions?.map((e) => (
                    <div
                      className="snapslider-card swiper-slide !w-[44%] sm:!w-[28%] md:!w-[17%] lg:!w-[13%]"
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
                          startBidAmount={
                            e?.acceptedAmount || e?.startBidAmount
                          }
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
                        />
                      )}
                    </div>
                  ))}
                   {auctions?.length >= 2 && (
                    <div className="swiper-slide !w-[44%] sm:!w-[28%] md:!w-[17%] lg:!w-[13%] flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center mt-36">
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
    </>
  );
};

export default SilmilarProductsSlider;
