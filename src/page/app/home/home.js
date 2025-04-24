import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dimmer } from "semantic-ui-react";
import api from "../../../api";
import AuctionCard from "../../../component/home-components/auction-card";
import BuyNowAuctionsSlider from "../../../component/home-components/buy-now-auctions-slider";
import FilterSections from "../../../component/home-components/filter-sections";
import SliderRow from "../../../component/shared/slider-categories/slider-row";
import { authAxios } from "../../../config/axios-config";
import { useAuthState } from "../../../context/auth-context";
import useAxios from "../../../hooks/use-axios";
import AddLocationModel from "../../../component/create-auction-components/add-location-model";
import { useDispatch } from "react-redux";
import UpComingAuctionsSlider from "../../../component/home-components/up-coming-auctions";
import PaginationApp from "../../../component/shared/pagination/pagination-app";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";
import listicon from "../../../../src/assets/icons/bullet.svg";
import menuicon from "../../../../src/assets/icons/grid-06.svg";
import AuctionCardList from "../../../component/home-components/auction-card-list";
import BannerTop from "component/home-components/BannerTop";
import WelcomeBonusModal from "component/shared/WelcomeBonusModal/WelcomeBonusModal";
import { welcomeBonus } from "redux-store/welcom-bonus-slice";
// import { useSocket } from "context/socket-context";
import { useSocket } from "context/socket-context";
// import LiveAuctionsSlider from "component/home-components/live-auctions-slider";
import ProductCard from "component/home-components/ProductCard";
import ProductCardList from "component/home-components/products-card-list";
import { ReactComponent as NoAuctionImg } from "../../../../src/assets/images/no auction new.svg";
import { ReactComponent as NoProductImg } from "../../../../src/assets/images/no products new.svg";
import queryString from "query-string";
import { DEFAULT_PAGE, getDefaultPerPage } from "../../../constants/pagination";

const Home = ({ selectedType, isFilterOpen, setIsFilterOpen }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { search } = useLocation();
  const history = useHistory();
  const { user } = useAuthState();
  const myRef = useRef();
  const myRef1 = useRef();
  const dispatch = useDispatch();
  const isWelcomeBonus = useSelector(
    (state) => state.welcomeBonus.welcomeBonus
  );
  const [isGrid, setIsGrid] = useState(() => {
    return JSON.parse(localStorage.getItem("isGrid")) ?? true;
  });
  const socket = useSocket();
  const [open, setOpen] = useState(false);
  const [mainAuctions, setMainAuctions] = useState([]);
  const [listedProducts, setListedProducts] = useState([]);
  const [totalPagesListed, setTotalPagesListed] = useState();
  const [totalpagesAuction, setTotalpagesAuction] = useState();
  const [sponsoredAuctions, SetSponsoredAuctions] = useState([]);
  const [auctionPageNumber, setAuctionPageNumber] = useState(
    Number(DEFAULT_PAGE)
  );
  const [listedPageNumber, setListedPageNumber] = useState(
    Number(DEFAULT_PAGE)
  );

  const [openWelcomeBonusModal, setOpenWelcomeBonusModal] = useState(false);
  const { run: runMainAuctions, isLoading: isLoadingMainAuctions } = useAxios(
    []
  );
  const { run: runListedProduct, isLoading: isLoadingListedProduct } = useAxios(
    []
  );
  const {
    run: runSponsoredAuctions,
    isLoading: isLoadingrunSponsoredAuctions,
  } = useAxios([]);

  useEffect(() => {
    localStorage.setItem("isGrid", JSON.stringify(isGrid));
  }, [isGrid]);

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    let page = Number(queryParams.get("auctionPage") || DEFAULT_PAGE);
    let perPage = Number(queryParams.get("perPage") || getDefaultPerPage());

    if (!queryParams.has("auctionPage") || !queryParams.has("perPage")) {
      queryParams.set("auctionPage", page.toString());
      queryParams.set("perPage", perPage.toString());
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

    if (!user) {
      runMainAuctions(
        axios.get(`${api.app.auctions.getMain}?${queryStr}`).then((res) => {
          setMainAuctions(res?.data?.data);
          setTotalpagesAuction(res?.data?.pagination?.totalPages);
        })
      );
      runSponsoredAuctions(
        axios.get(`${api.app.auctions.sponsored}`).then((res) => {
          SetSponsoredAuctions(res?.data?.data);
        })
      );
    } else {
      runMainAuctions(
        authAxios.get(`${api.app.auctions.getMain}?${queryStr}`).then((res) => {
          setMainAuctions(res?.data?.data);
          setTotalpagesAuction(res?.data?.pagination?.totalPages);
        })
      );
      runSponsoredAuctions(
        authAxios.get(`${api.app.auctions.sponsored}`).then((res) => {
          SetSponsoredAuctions(res?.data?.data);
        })
      );
    }
  }, [search, user, auctionPageNumber, history, runMainAuctions]);

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    let page = Number(queryParams.get("productPage") || DEFAULT_PAGE);
    let perPage = Number(queryParams.get("perPage") || getDefaultPerPage());

    if (!queryParams.has("productPage") || !queryParams.has("perPage")) {
      queryParams.set("productPage", page.toString());
      queryParams.set("perPage", perPage.toString());
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

    if (!user) {
      runListedProduct(
        axios
          .get(`${api.app.productListing.getAllListedProducts}?${queryStr}`)
          .then((res) => {
            setListedProducts(res?.data?.data);
            setTotalPagesListed(res?.data?.pagination?.totalPages);
          })
      );
    } else {
      runListedProduct(
        axios
          .get(`${api.app.productListing.getAllListedProducts}?${queryStr}`)
          .then((res) => {
            setListedProducts(res?.data?.data);
            setTotalPagesListed(res?.data?.pagination?.totalPages);
          })
      );
    }
  }, [search, user, listedPageNumber, history, runListedProduct]);

  useEffect(() => {
    if (!socket) return;

    const handleNewAuction = (data) => {
      setMainAuctions((prev) => [...prev, data.auction]);
    };

    const handleAuctionCancelled = (data) => {
      setMainAuctions((prev) =>
        prev.filter((auction) => auction.id !== data.auctionId)
      );
    };

    const handleBuyNowAuctionPurchase = (data) => {
      setMainAuctions((prev) =>
        prev.filter((auction) => auction.id !== data.auctionId)
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
                  bidAmount: data.auction.bids[0]?.amount,
                },
              }
            : auction
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
    if (isWelcomeBonus) {
      setOpenWelcomeBonusModal(true);
      dispatch(welcomeBonus(false));
    }
  }, [isWelcomeBonus, dispatch]);

  return (
    <div className="relative">
      {isFilterOpen && (
        <FilterSections
          isFullPage={true}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
      <div className="">
        <div className="lg:mt-36 md:mt-32 mt-24 py-6 home ">
          <Dimmer
            className="fixed w-full h-full top-0 bg-white/50"
            active={
              isLoadingMainAuctions ||
              isLoadingrunSponsoredAuctions ||
              isLoadingListedProduct
            }
            inverted
          >
            <LodingTestAllatre />
          </Dimmer>
          <div className="z-20  w-full px-4 mx-auto py-5">
            <BannerTop />
          </div>
          <div className="text-center mt-1 md:mt-3 lg:mt-5">
            <h1
              ref={myRef}
              className=" text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md "
            >
              {selectedContent[localizationKeys.popularCategories]}
            </h1>
            <p className="text-gray-med text-base font-normal md:text-lg lg:text-xl">
              {selectedContent[localizationKeys.PopularPicksPerfectChoices]}
            </p>
          </div>
          <div className="mt-8 mb-20">
            <SliderRow />
          </div>
          <div className="flex justify-between  lg:mx-auto mx-2 px-4 pb-2 ">
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
                                latestBidAmount={e?.bids[0]?.amount}
                                CurrentBid={e?.currentBid?.bidAmount}
                                startBidAmount={e?.startBidAmount}
                                usageStatus={e?.product?.usageStatus}
                                category={e?.product?.categoryId}
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
                                latestBidAmount={e?.bids[0]?.amount}
                                CurrentBid={e?.currentBid?.bidAmount}
                                startBidAmount={e?.startBidAmount}
                                usageStatus={e?.product?.usageStatus}
                                category={e?.product?.categoryId}
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
                                adsImg={e?.product?.images}
                                userId={e?.userId}
                                id={e?.product?.id}
                                city={
                                  lang === "en"
                                    ? e?.location?.city?.nameEn
                                    : e?.location?.city?.nameEn
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
                                    : e?.location?.city?.nameEn
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
                                latestBidAmount={e?.bids[0]?.amount}
                                CurrentBid={e?.currentBid?.bidAmount}
                                startBidAmount={e?.startBidAmount}
                                usageStatus={e?.product?.usageStatus}
                                category={e?.product?.categoryId}
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
                                    : e?.location?.city?.nameEn
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
                              latestBidAmount={e?.bids[0]?.amount}
                              CurrentBid={e?.currentBid?.bidAmount}
                              startBidAmount={e?.startBidAmount}
                              usageStatus={e?.product?.usageStatus}
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
                                  : e?.location?.city?.nameEn
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
          </div>

          <AddLocationModel
            open={open}
            setOpen={setOpen}
            TextButton={selectedContent[localizationKeys.proceed]}
          />
          <WelcomeBonusModal
            open={openWelcomeBonusModal}
            setOpen={setOpenWelcomeBonusModal}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);
