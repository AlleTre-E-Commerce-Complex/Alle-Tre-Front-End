import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dimmer } from "semantic-ui-react";
import api from "../../../api";
// import FilterSections from "../../../component/home-components/filter-sections";
import SliderRow from "../../../component/shared/slider-categories/slider-row";
import { authAxios } from "../../../config/axios-config";
import { useAuthState } from "../../../context/auth-context";
import useAxios from "../../../hooks/use-axios";
import AddLocationModel from "../../../component/create-auction-components/add-location-model";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import LoadingTest3arbon from "../../../component/shared/lotties-file/loading-test-3arbon";
// import BannerTop from "component/home-components/BannerTop";
import BannerTopNew from "component/home-components/Banner-top-new";
import WelcomeModal from "component/shared/WelcomeBonusModal/WelcomeBonusModal";
import { welcomeBonus } from "redux-store/welcom-bonus-slice";
import { useSocket } from "context/socket-context";
// import LiveAuctionsSlider from "component/home-components/live-auctions-slider";
import queryString from "query-string";
import { DEFAULT_PAGE, getDefaultPerPage } from "../../../constants/pagination";
import SideBanner from "../../../component/home-components/SideBanner";
import BannerBottom from "component/home-components/BannerBottom";
import SearchResults from "component/home-components/search-results";
// import MobileFilterBar from "../../../component/home-components/mobile-filter-bar";

import FilterSections from "../../../component/home-components/filter-sections";


const Home = ({
  selectedType,
  isFilterOpen,
  setIsFilterOpen,
  isDropdownOpen,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { search } = useLocation();
  const history = useHistory();
  const { user } = useAuthState();
  const dispatch = useDispatch();
  const isWelcomeBonus = useSelector(
    (state) => state.welcomeBonus.welcomeBonus,
  );
  // const [isGrid, setIsGrid] = useState(() => {
  //   return JSON.parse(localStorage.getItem("isGrid")) ?? true;
  // });
  const socket = useSocket();
  const [open, setOpen] = useState(false);
  const [mainAuctions, setMainAuctions] = useState([]);
  const [listedProducts, setListedProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const searchQuery = queryParams.get("title") || "";
    handleSearch(searchQuery);
  }, [search]);

  const getCategoryCounts = () => {
    const counts = {};

    (mainAuctions || []).forEach((auction) => {
      const categoryId = auction?.product?.categoryId;
      if (categoryId) {
        counts[categoryId] = counts[categoryId] || { auctions: 0, listings: 0 };
        counts[categoryId].auctions++;
      }
    });

    (listedProducts || []).forEach((listing) => {
      const categoryId = listing?.product?.categoryId;
      if (categoryId) {
        counts[categoryId] = counts[categoryId] || { auctions: 0, listings: 0 };
        counts[categoryId].listings++;
      }
    });

    return counts;
  };

  const categoryCounts = getCategoryCounts();
  // const [totalPagesListed, setTotalPagesListed] = useState();
  // const [totalpagesAuction, setTotalpagesAuction] = useState();
  // const [sponsoredAuctions, SetSponsoredAuctions] = useState([]);
  // const [auctionPageNumber, setAuctionPageNumber] = useState(
  //   Number(DEFAULT_PAGE)
  // );
  // const [listedPageNumber, setListedPageNumber] = useState(
  //   Number(DEFAULT_PAGE)
  // );

  const [openWelcomeBonusModal, setOpenWelcomeBonusModal] = useState(false);
  const { run: runMainAuctions, isLoading: isLoadingMainAuctions } = useAxios(
    [],
  );
  const { run: runListedProduct, isLoading: isLoadingListedProduct } = useAxios(
    [],
  );
  // const {
  //   run: runSponsoredAuctions,
  //   isLoading: isLoadingrunSponsoredAuctions,
  // } = useAxios([]);

  // useEffect(() => {
  //   localStorage.setItem("isGrid", JSON.stringify(isGrid));
  // }, [isGrid]);

  const handleSearch = async (query) => {
    setIsSearching(true);
    setSearchQuery(query);

    try {
      const params = queryString.parse(search);
      const [auctionsResponse, productsResponse] = await Promise.all([
        authAxios.get(`${api.app.auctions.getMain}`, {
          params: {
            ...params,
            title: query,
            page: DEFAULT_PAGE,
            perPage: getDefaultPerPage(),
          },
        }),
        authAxios.get(`${api.app.productListing.getAllListedProducts}`, {
          params: {
            ...params,
            title: query,
            page: DEFAULT_PAGE,
            perPage: getDefaultPerPage(),
          },
        }),
      ]);

      // Filter results based on the search term
      const searchTerm = query?.toLowerCase() || "";
      const filteredAuctions = auctionsResponse.data.data.filter(
        (auction) =>
          !searchTerm ||
          auction?.product?.title?.toLowerCase().includes(searchTerm),
      );
      const filteredProducts = productsResponse.data.data.filter(
        (product) =>
          !searchTerm ||
          product?.product?.title?.toLowerCase().includes(searchTerm),
      );

      setMainAuctions(filteredAuctions);
      setListedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }

    setIsSearching(false);
  };

  useEffect(() => {
    const params = queryString.parse(search);
    if (params.title) {
      handleSearch(params.title);
    }
  }, [search]);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const queryParams = new URLSearchParams(search);
        let page = Number(queryParams.get("auctionPage") || DEFAULT_PAGE);
        let perPage = Number(queryParams.get("perPage") || getDefaultPerPage());

        const parsed = queryString.parse(search, { arrayFormat: "bracket" });

        const filterParams = {
          ...parsed,
          page,
          perPage,
          categories: Array.isArray(parsed.categories)
            ? parsed.categories.map(Number)
            : undefined,
          subCategory: Array.isArray(parsed.subCategory)
            ? parsed.subCategory.map(Number)
            : undefined,
          brands: Array.isArray(parsed.brands)
            ? parsed.brands.map(Number)
            : undefined,
          sellingType: parsed.sellingType,
          auctionStatus: parsed.auctionStatus,
          usageStatus: parsed.usageStatus ? [parsed.usageStatus] : undefined,
          priceFrom: parsed.priceFrom ? Number(parsed.priceFrom) : undefined,
          priceTo: parsed.priceTo ? Number(parsed.priceTo) : undefined,
          isHome: true, // ensure backend can parse this correctly!
        };

        // Remove undefined keys
        Object.keys(filterParams).forEach((key) => {
          if (filterParams[key] === undefined) {
            delete filterParams[key];
          }
        });

        const queryStr = queryString.stringify(filterParams, {
          arrayFormat: "bracket",
        });

        try {
          const axiostToUse = user ? authAxios : axios;
          const [liveRes, upcomingRes] = await Promise.all([
            axiostToUse.get(`${api.app.auctions.getMain}?${queryStr}`),
            axiostToUse.get(`${api.app.auctions.getUpComming}?${queryStr}`),
          ]);

          // Log detailed data structure
          console.log("Live Data:", {
            liveData: liveRes?.data?.data,
            isArray: Array.isArray(liveRes?.data?.data),
            length: liveRes?.data?.data?.length,
            firstItem: liveRes?.data?.data?.[0],
          });

          console.log("Upcoming Data:", {
            upcomingData: upcomingRes?.data?.data,
            isArray: Array.isArray(upcomingRes?.data?.data),
            length: upcomingRes?.data?.data?.length,
            firstItem: upcomingRes?.data?.data?.[0],
          });

          // Ensure we have valid arrays and validate each item
          const liveData = Array.isArray(liveRes?.data?.data)
            ? liveRes.data.data.filter(
                (item) => item && typeof item === "object",
              )
            : [];

          const upcomingData = Array.isArray(upcomingRes?.data?.data)
            ? upcomingRes.data.data.filter(
                (item) => item && typeof item === "object",
              )
            : [];

          const combinedData = [...liveData, ...upcomingData].map((item) => ({
            ...item,
            product: item.product || {},
            _count: item._count || { bids: 0 },
          }));

          setMainAuctions(combinedData);
        } catch (error) {
          console.error("Error fetching auctions:", error);
          console.error("Error details:", {
            name: error.name,
            message: error.message,
            response: error.response,
            request: error.request,
          });
          setMainAuctions([]);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchAuctions();
  }, [search, user]);

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    let page = Number(queryParams.get("productPage") || DEFAULT_PAGE);
    let perPage = Number(queryParams.get("perPage") || getDefaultPerPage());

    const parsed = queryString.parse(search, { arrayFormat: "bracket" });

    const filterParams = {
      ...parsed,
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
      isHome: true, // ensure backend can parse this correctly!
    };

    Object.keys(filterParams).forEach((key) => {
      if (filterParams[key] === undefined) {
        delete filterParams[key];
      }
    });

    const queryStr = queryString.stringify(filterParams, {
      arrayFormat: "bracket",
    });

    if (!user) {
      runListedProduct(
        axios
          .get(`${api.app.productListing.getAllListedProducts}?${queryStr}`)
          .then((res) => {
            setListedProducts(res?.data?.data);
            // setTotalPagesListed(res?.data?.pagination?.totalPages);
          })
          .catch((error) => {
            console.log(error);
          }),
      );
    } else {
      runListedProduct(
        authAxios
          .get(`${api.app.productListing.getAllListedProducts}?${queryStr}`)
          .then((res) => {
            setListedProducts(res?.data?.data);
            // setTotalPagesListed(res?.data?.pagination?.totalPages);
          })
          .catch((error) => {
            console.log(error);
          }),
      );
    }
  }, [search, user, history, runListedProduct]);

  useEffect(() => {
    if (!socket) return;

    const handleNewAuction = (data) => {
      setMainAuctions((prev) => [...prev, data.auction]);
    };

    const handleAuctionCancelled = (data) => {
      setMainAuctions((prev) =>
        prev.filter((auction) => auction.id !== data.auctionId),
      );
    };

    const handleBuyNowAuctionPurchase = (data) => {
      setMainAuctions((prev) =>
        prev.filter((auction) => auction.id !== data.auctionId),
      );
    };

    const handleIncreaseBid = (data) => {
      setMainAuctions((prev) => {
        const updatedAuctions = prev.map((auction) =>
          auction.id === data.auction.id
            ? {
                ...auction,
                bids: data.auction.bids,
                startBidAmount: data.auction.startBidAmount,
                _count: {
                  ...auction._count,
                  bids: (auction._count.bids || 0) + 1,
                },
                currentBid: {
                  bidAmount:
                    Array.isArray(data.auction.bids) &&
                    data.auction.bids.length > 0
                      ? data.auction.bids[0].amount
                      : (auction.currentBid?.bidAmount ?? null),
                },
              }
            : auction,
        );
        return updatedAuctions;
      });
    };

    socket.on("auction:buyNowPurchase", handleBuyNowAuctionPurchase);
    socket.on("auction:newAuctionListed", handleNewAuction);
    socket.on("auction:cancelled", handleAuctionCancelled);
    socket.on("auction:increaseBid", handleIncreaseBid);

    return () => {
      socket.off("auction:buyNowPurchase", handleBuyNowAuctionPurchase);
      socket.off("auction:newAuctionListed", handleNewAuction);
      socket.off("auction:cancelled", handleAuctionCancelled);
      socket.off("auction:increaseBid", handleIncreaseBid);
    };
  }, [socket]);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (user && !hasSeenWelcome) {
      setOpenWelcomeBonusModal(true);
      localStorage.setItem("hasSeenWelcome", "true");
    }
  }, [user]);

  useEffect(() => {
    if (isWelcomeBonus) {
      setOpenWelcomeBonusModal(true);
      dispatch(welcomeBonus(false));
    }
  }, [isWelcomeBonus, dispatch]);

  return (
    <div
      className={`relative min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-primary-dark dark:via-primary dark:to-primary-dark ${
        isDropdownOpen ? "blur-sm pointer-events-none" : ""
      } transition-all duration-300`}
    >
      {isFilterOpen && (
        <FilterSections
          isFullPage={true}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      <div className="w-full h-full relative z-40 bg-white dark:bg-background transition-colors duration-300">
        <div className="lg:pt-[145px] md:pt-[139px] pt-[125px] home dark:bg-background transition-colors duration-300">
          <Dimmer
            className="fixed w-full h-full top-0 bg-white/50"
            active={
              isLoadingMainAuctions || isLoadingListedProduct || isSearching
            }
            inverted
          >
            <LoadingTest3arbon />
          </Dimmer>
          <div className="w-full px-3 sm:px-4">
            <BannerTopNew auctions={mainAuctions} />
          </div>
          {/* <MobileFilterBar onOpenFullFilters={() => setIsFilterOpen(true)} /> */}


          {/* <div className="text-center mt-1 md:mt-2 lg:mt-3">
            <h1
              ref={myRef}
              className=" text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md "
            >
              {selectedContent[localizationKeys.popularCategories]}
            </h1>
            <p className="text-gray-med text-base font-normal md:text-lg lg:text-xl">
              {selectedContent[localizationKeys.PopularPicksPerfectChoices]}
            </p>
          </div> */}
          <div className="flex md:flex-row flex-col gap-4 px-4">
            <div className={`${searchQuery ? "w-full" : "md:w-4/5 w-full"}`}>
              {!searchQuery && (
                <div className="mb-10">
                  <SliderRow categoryCounts={categoryCounts} />
                </div>
              )}
              <div className="container mx-auto px-4 py-8">
                {searchQuery && (
                  <SearchResults
                    auctions={mainAuctions}
                    products={listedProducts}
                    isLoading={isSearching}
                    searchQuery={searchQuery}
                  />
                )}
                <BannerBottom />
              </div>
            </div>
            {!searchQuery && <SideBanner />}{" "}
          </div>
          {/* <div className="flex justify-between  lg:mx-auto mx-2 px-4 pb-2 ">
            <div className="flex  ">
              <h6 className="text-gray-dark text-base font-normal pt-3 lg:pl-3 px-4 lg:px-0 w-full lg:w-auto">
                {mainAuctions?.length}{" "}
                {selectedContent[localizationKeys.results]}
              </h6>
            </div>
            <div
              className={
                mainAuctions?.length === 0 && listedProducts?.length === 0
                  ? "hidden"
                  : "mt-auto"
              }
            >
              {isGrid ? (
                <button
                  onClick={() => setIsGrid((prev) => !prev)}
                  className="flex items-center gap-x-3 h-9 text-primary-light bg-primary-light/20 rounded-lg p-4 mr-3"
                >
                  <img src={menuicon} alt="menuicon" />
                  <p className="flex items-center">
                    {selectedContent[localizationKeys.Grid]}
                  </p>
                </button>
              ) : (
                <button
                  onClick={() => setIsGrid((prev) => !prev)}
                  className="flex items-center gap-x-3 h-9 text-primary-light bg-primary-light/20 rounded-lg p-4 mr-3"
                >
                  <img src={listicon} alt="listicon" className="w-5 h-5" />
                  <p className="flex items-center">
                    {selectedContent[localizationKeys.List]}
                  </p>
                </button>
              )}
            </div>
          </div>
          <div className=" lg:mx-auto mx-2">
            <div className="flex gap-5 sm:px-4 mx-2 ">
              <FilterSections myRef={myRef} />
              <div className="w-full">
                {(() => {
                  if (isGrid && selectedType === "auction") {
                    return (
                      <div>
                        <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                          {selectedContent[localizationKeys.trendingAuctions]}
                        </h1>
                        {mainAuctions?.length === 0 ? (
                          <div className="flex flex-col items-center mt-20">
                            <NoAuctionImg className="w-40 h-40" />
                          </div>
                        ) : (
                          <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
                            {mainAuctions?.map((e) => (
                              <AuctionCard
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
                                latestBidAmount={e?.bids?.[0]?.amount}
                                CurrentBid={e?.currentBid?.bidAmount}
                                startBidAmount={e?.startBidAmount}
                                usageStatus={e?.product?.usageStatus}
                                category={e?.product?.categoryId}
                                currency={e?.location?.country?.currency}
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                          {mainAuctions?.length !== 0 ? (
                            <PaginationApp
                              totalPages={totalpagesAuction}
                              perPage={getDefaultPerPage()}
                              myRef={myRef}
                              type={"auction"}
                              setAuctionPageNumber={setAuctionPageNumber}
                              setListedPageNumber={setListedPageNumber}
                            />
                          ) : null}
                        </div>
                        <div>
                          <UpComingAuctionsSlider isGrid={isGrid} />
                        </div>
                      </div>
                    );
                  } else if (!isGrid && selectedType === "auction") {
                    return (
                      <div>
                        <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                          {selectedContent[localizationKeys.trendingAuctions]}
                        </h1>
                        {mainAuctions?.length === 0 ? (
                          <div className="flex flex-col items-center mt-20">
                            <NoAuctionImg className="w-40 h-40" />
                          </div>
                        ) : (
                          <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1 gap-2">
                            {mainAuctions?.map((e) => (
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
                                latestBidAmount={e?.bids?.[0]?.amount}
                                CurrentBid={e?.currentBid?.bidAmount}
                                startBidAmount={e?.startBidAmount}
                                usageStatus={e?.product?.usageStatus}
                                category={e?.product?.categoryId}
                                currency={e?.location?.country?.currency}
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                          {mainAuctions?.length !== 0 ? (
                            <PaginationApp
                              totalPages={totalpagesAuction}
                              perPage={getDefaultPerPage()}
                              myRef={myRef}
                              type={"auction"}
                              setAuctionPageNumber={setAuctionPageNumber}
                              setListedPageNumber={setListedPageNumber}
                            />
                          ) : null}
                        </div>
                        <div>
                          <UpComingAuctionsSlider isGrid={isGrid} />
                        </div>
                      </div>
                    );
                  } else if (isGrid && selectedType === "products") {
                    return (
                      <div>
                        <h1
                          ref={myRef1}
                          className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8"
                        >
                          {selectedContent[localizationKeys.listedProduct]}
                        </h1>
                        {listedProducts?.length === 0 ? (
                          <div className="flex flex-col items-center mt-20">
                            <NoProductImg className="w-40 h-40" />
                          </div>
                        ) : (
                          <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
                            {listedProducts?.map((e) => (
                              <ProductCard
                                key={e?.id}
                                price={e?.ProductListingPrice}
                                title={e?.product?.title}
                                userId={e?.userId}
                                id={e?.product?.id}
                                city={
                                  lang === "en"
                                    ? e?.location?.city?.nameEn
                                    : e?.location?.city?.nameAr
                                }
                                country={
                                  lang === "en"
                                    ? e?.location?.country?.nameEn
                                    : e?.location?.country?.nameAr
                                }
                                createdAt={e?.createdAt}
                                usageStatus={e?.product?.usageStatus}
                                category={e?.product?.categoryId}
                                isSaved={e?.isSaved}
                                currency={e?.location?.country?.currency}
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                          {listedProducts?.length !== 0 ? (
                            <PaginationApp
                              totalPages={totalPagesListed}
                              perPage={getDefaultPerPage()}
                              myRef={myRef1}
                              type={"products"}
                              setAuctionPageNumber={setAuctionPageNumber}
                              setListedPageNumber={setListedPageNumber}
                            />
                          ) : null}
                        </div>
                      </div>
                    );
                  } else if (!isGrid && selectedType === "products") {
                    return (
                      <div>
                        <h1
                          ref={myRef1}
                          className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8"
                        >
                          {selectedContent[localizationKeys.listedProduct]}
                        </h1>
                        {listedProducts?.length === 0 ? (
                          <div className="flex flex-col items-center mt-20">
                            <NoProductImg className="w-40 h-40" />
                          </div>
                        ) : (
                          <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1 gap-2">
                            {listedProducts?.map((e) => (
                              <ProductCardList
                                key={e?.id}
                                price={e?.ProductListingPrice}
                                title={e?.product?.title}
                                userId={e?.userId}
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
                                    : e?.location?.country?.nameAr
                                }
                                createdAt={e?.createdAt}
                                usageStatus={e?.product?.usageStatus}
                                category={e?.product?.categoryId}
                                isSaved={e?.isSaved}
                                currency={e?.location?.country?.currency}
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                          {listedProducts?.length !== 0 ? (
                            <PaginationApp
                              totalPages={totalPagesListed}
                              perPage={getDefaultPerPage()}
                              myRef={myRef1}
                              type={"products"}
                              setAuctionPageNumber={setAuctionPageNumber}
                              setListedPageNumber={setListedPageNumber}
                            />
                          ) : null}
                        </div>
                      </div>
                    );
                  } else if (isGrid && selectedType === "all") {
                    return (
                      <>
                        <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                          {selectedContent[localizationKeys.trendingAuctions]}
                        </h1>
                        {mainAuctions?.length === 0 ? (
                          <div className="flex flex-col items-center mt-20">
                            <NoAuctionImg className="w-40 h-40" />
                          </div>
                        ) : (
                          <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
                            {mainAuctions?.map((e) => (
                              <AuctionCard
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
                                latestBidAmount={e?.bids?.[0]?.amount}
                                CurrentBid={e?.currentBid?.bidAmount}
                                startBidAmount={e?.startBidAmount}
                                usageStatus={e?.product?.usageStatus}
                                category={e?.product?.categoryId}
                                isSaved={e?.isSaved}
                                currency={e?.location?.country?.currency}
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                          {mainAuctions?.length !== 0 ? (
                            <PaginationApp
                              totalPages={totalpagesAuction}
                              perPage={getDefaultPerPage()}
                              myRef={myRef}
                              type={"auction"}
                              setAuctionPageNumber={setAuctionPageNumber}
                              setListedPageNumber={setListedPageNumber}
                            />
                          ) : null}
                        </div>
                        <div>
                          <UpComingAuctionsSlider isGrid={isGrid} />
                        </div>
                        <h1
                          ref={myRef1}
                          className="pt-14 pb-4 text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8"
                        >
                          {selectedContent[localizationKeys.listedProduct]}
                        </h1>
                        {listedProducts?.length === 0 ? (
                          <div className="flex flex-col items-center mt-20">
                            <NoProductImg className="w-40 h-40" />
                          </div>
                        ) : (
                          <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full mt-6">
                            {listedProducts?.map((e) => (
                              <ProductCard
                                key={e?.id}
                                price={e?.ProductListingPrice}
                                title={e?.product?.title}
                                userId={e?.userId}
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
                                    : e?.location?.country?.nameAr
                                }
                                createdAt={e?.createdAt}
                                usageStatus={e?.product?.usageStatus}
                                category={e?.product?.categoryId}
                                isSaved={e?.isSaved}
                                currency={e?.location?.country?.currency}
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                          {listedProducts?.length !== 0 ? (
                            <PaginationApp
                              totalPages={totalPagesListed}
                              perPage={getDefaultPerPage()}
                              myRef={myRef1}
                              type={"products"}
                              setAuctionPageNumber={setAuctionPageNumber}
                              setListedPageNumber={setListedPageNumber}
                            />
                          ) : null}
                        </div>
                      </>
                    );
                  } else if (!isGrid && selectedType === "all") {
                    return (
                      <>
                        <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                          {selectedContent[localizationKeys.trendingAuctions]}
                        </h1>
                        <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1 gap-2">
                          {mainAuctions?.map((e) => (
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
                              latestBidAmount={e?.bids?.[0]?.amount}
                              CurrentBid={e?.currentBid?.bidAmount}
                              startBidAmount={e?.startBidAmount}
                              usageStatus={e?.product?.usageStatus}
                                 currency={e?.product?.location?.country?.currency}
                              category={e?.product?.categoryId}
                            />
                          ))}
                        </div>
                        <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                          {mainAuctions?.length !== 0 ? (
                            <PaginationApp
                              totalPages={totalpagesAuction}
                              perPage={getDefaultPerPage()}
                              myRef={myRef}
                              type={"auction"}
                              setAuctionPageNumber={setAuctionPageNumber}
                              setListedPageNumber={setListedPageNumber}
                            />
                          ) : null}
                        </div>
                        <div>
                          <UpComingAuctionsSlider isGrid={isGrid} />
                        </div>
                        <h1
                          ref={myRef1}
                          className="pt-14 pb-4 text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md "
                        >
                          {selectedContent[localizationKeys.listedProduct]}
                        </h1>
                        <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1 gap-2">
                          {listedProducts?.map((e) => (
                            <ProductCardList
                              key={e?.id}
                              price={e?.ProductListingPrice}
                              title={e?.product?.title}
                              userId={e?.userId}
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
                                  : e?.location?.country?.nameAr
                              }
                              createdAt={e?.createdAt}
                              usageStatus={e?.product?.usageStatus}
                                 currency={e?.product?.location?.country?.currency}
                              category={e?.product?.categoryId}
                              isSaved={e?.isSaved}
                            />
                          ))}
                        </div>
                        <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                          {listedProducts?.length !== 0 ? (
                            <PaginationApp
                              totalPages={totalPagesListed}
                              perPage={getDefaultPerPage()}
                              myRef={myRef1}
                              type={"products"}
                              setAuctionPageNumber={setAuctionPageNumber}
                              setListedPageNumber={setListedPageNumber}
                            />
                          ) : null}
                        </div>
                      </>
                    );
                  } else {
                    return null;
                  }
                })()}
              </div>
            </div>
          </div>

          <div className="px-4 mx-auto py-10">
            <BuyNowAuctionsSlider />
          </div> */}

          <AddLocationModel
            open={open}
            setOpen={setOpen}
            TextButton={selectedContent[localizationKeys.proceed]}
          />
          <WelcomeModal
            open={openWelcomeBonusModal}
            setOpen={setOpenWelcomeBonusModal}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);
