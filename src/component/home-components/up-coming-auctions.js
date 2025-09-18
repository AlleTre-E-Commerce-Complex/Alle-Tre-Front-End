import React, { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import AnglesRight from "../../../src/assets/icons/arrow-right.svg";
import AnglesLeft from "../../../src/assets/icons/arrow-left.svg";
import "./auctions-slider.scss";
import AuctionCard from "./auction-card";
import { useHistory, useLocation } from "react-router-dom";
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
import AuctionCardList from "./auction-card-list";
import PaginationApp from "../shared/pagination/pagination-app";
import { DEFAULT_PAGE, getDefaultPerPage } from "../../constants/pagination";
import queryString from "query-string";

const UpComingAuctionsSlider = (isGrid) => {
  // const queryParams = new URLSearchParams(search);

  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { search } = useLocation();
  const { user } = useAuthState();
  const myRef = useRef();
  const { run: runAuctions, isLoading: isLoadingAuctions } = useAxios([]);
  const [auctions, setAuctions] = useState();
  const [pagination, setPagination] = useState();
  const history = useHistory();
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const queryParams = new URLSearchParams(search);
  const [perPage, setPerPage] = useState(
    Number(queryParams.get("perPage") || getDefaultPerPage())
  );
  const [upcomingAuctionPageNumber, setUpcomingAuctionPageNumber] = useState(
    Number(queryParams.get("UpcomingauctionPage") || DEFAULT_PAGE)
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    let page = Number(
      queryParams.get("UpcomingauctionPage") || upcomingAuctionPageNumber
    );
    let urlPerPage = Number(queryParams.get("perPage") || perPage);

    if (
      !queryParams.has("UpcomingauctionPage") ||
      !queryParams.has("perPage")
    ) {
      queryParams.set("UpcomingauctionPage", page.toString());
      queryParams.set("perPage", urlPerPage.toString());
      history.replace({ search: queryParams.toString() });
      return;
    }
    const parsed = queryString.parse(search, { arrayFormat: "bracket" });

    const filterParams = {
      page: page,
      perPage: perPage,
      categories: parsed.categories ? parsed.categories.map(Number) : undefined,
      subCategory: parsed.subCategory
        ? parsed.subCategory.map(Number)
        : undefined,
      brands: parsed.brands ? parsed.brands.map(Number) : undefined,
      sellingType: parsed.sellingType || undefined,
      auctionStatus: parsed.auctionStatus || undefined,
      usageStatus: parsed.usageStatus ? [parsed.usageStatus] : undefined,
      priceFrom: parsed.priceFrom ? Number(parsed.priceFrom) : undefined,
      priceTo: parsed.priceTo ? Number(parsed.priceTo) : undefined,
    };

    Object.keys(filterParams).forEach((key) => {
      if (filterParams[key] === undefined) {
        delete filterParams[key];
      }
    });

    const queryStr = queryString.stringify(filterParams, {
      arrayFormat: "bracket",
    });
    if (user) {
      runAuctions(
        authAxios
          .get(`${api.app.auctions.getUpComming}?${queryStr}`)
          .then((res) => {
            setAuctions(res?.data?.data);
            setPagination(res?.data?.pagination?.totalPages);
          })
          .catch((error) => {
            console.error("API Error:", error.response?.data || error);
          })
      );
    } else {
      runAuctions(
        axios
          .get(`${api.app.auctions.getUpComming}?${queryStr}`)
          .then((res) => {
            setAuctions(res?.data?.data);
            setPagination(res?.data?.pagination?.totalPages);
          })
          .catch((error) => {
            console.error("API Error:", error.response?.data || error);
          })
      );
    }
  }, [runAuctions, search, user, upcomingAuctionPageNumber, perPage]);

  // Handler to change page and sync with URL
  const handleUpcomingAuctionPageChange = (newPage) => {
    setUpcomingAuctionPageNumber(Number(newPage));
    const queryParams = new URLSearchParams(search);

    // Preserve all existing parameters
    const parsed = queryString.parse(search, { arrayFormat: "bracket" });
    Object.entries(parsed).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => queryParams.append(`${key}[]`, v));
      } else if (value) {
        queryParams.set(key, value);
      }
    });

    // Update the page number
    queryParams.set("UpcomingauctionPage", newPage.toString());
    history.replace({ search: queryParams.toString() });
  };

  // Listen for screen resize and update perPage in URL and state
  useEffect(() => {
    const handleResize = () => {
      const newPerPage = Number(getDefaultPerPage());
      if (newPerPage !== perPage) {
        setPerPage(newPerPage);
        const queryParams = new URLSearchParams(search);
        queryParams.set("perPage", newPerPage.toString());
        history.replace({ search: queryParams.toString() });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [perPage, search, history]);

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

  const swiperRef2 = useRef(null);
  const swiper2 = new Swiper(swiperRef2?.current, { ...swiperOptions });

  useEffect(() => {
    return () => {
      swiper2?.destroy();
    };
  }, []);

  // const handleNextClick = () => {
  //   if (pagination?.totalItems > pagination?.perPage) {
  //     swiper2?.slideNext();
  //     setPage(page + 5);
  //   } else swiper2?.slideNext();
  // };

  // const handlePrevClick = () => {
  //   swiper2?.slidePrev();
  // };

  return (
    <div>
      {auctions?.length !== 0 ? (
        <div className="text-center">
          <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md ">
            {selectedContent[localizationKeys.upComingAuctions]}
          </h1>
          <p className="text-gray-med text-base font-normal pb-1">
            {selectedContent[localizationKeys.ComingSoonGetReadytoBid]}
          </p>
        </div>
      ) : null}

      <div className="ezd-content relative">
        <Dimmer className="bg-white/50" active={isLoadingAuctions} inverted>
          <LodingTestAllatre />
        </Dimmer>
        <div className="pt-6 pb-4 ">
          {isGrid.isGrid ? (
            <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
              {auctions?.map((e) => (
                <div key={e?.id} className="snapslider-card">
                  <AuctionCard
                    auctionId={e?.id}
                    startBidAmount={e?.startBidAmount || e?.acceptedAmount}
                    title={e?.product?.title}
                    status={e?.status}
                    adsImg={e?.product?.images}
                    onReload={onReload}
                    totalBods={e?._count?.bids}
                    WatshlistState={e?.isSaved}
                    endingTime={e?.expiryDate}
                    StartDate={e?.startDate}
                    isBuyNowAllowed={e?.isBuyNowAllowed}
                    isMyAuction={e?.isMyAuction}
                    usageStatus={e?.product?.usageStatus}
                    category={e?.product?.categoryId}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1 gap-2">
              {auctions?.map((e) => (
                <AuctionCardList
                  key={e?.id}
                  auctionId={e?.id}
                  price={e?.acceptedAmount || e?.startBidAmount}
                  title={e?.product?.title}
                  status={e?.status}
                  adsImg={e?.product?.images}
                  totalBods={e?._count?.bids}
                  WatshlistState={e?.isSaved}
                  endingTime={e?.expiryDate}
                  StartDate={e?.startDate}
                  isBuyNowAllowed={e?.isBuyNowAllowed}
                  isMyAuction={e?.isMyAuction}
                  CurrentBid={e?.currentBid?.bidAmount}
                  startBidAmount={e?.startBidAmount}
                  usageStatus={e?.product?.usageStatus}
                />
              ))}
            </div>
          )}
        </div>
        {/* Pagination for upcoming auctions */}
        <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
          {auctions?.length !== 0 ? (
            <PaginationApp
              totalPages={pagination}
              myRef={myRef}
              perPage={perPage}
              type={"upcomingAuction"}
              setUpcomingAuctionPageNumber={handleUpcomingAuctionPageChange}
              activePage={upcomingAuctionPageNumber}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UpComingAuctionsSlider;
