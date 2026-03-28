import AuctionCardList from "component/home-components/auction-card-list";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import SearchResults from "../../../component/home-components/search-results";
import { Dimmer } from "semantic-ui-react";
import { HiHeart } from "react-icons/hi";
import addImage from "../../../../src/assets/icons/add-image-icon.png";
import api from "../../../api";
import AddLocationModel from "../../../component/create-auction-components/add-location-model";
import AuctionCard from "../../../component/home-components/auction-card";
import FilterSections from "../../../component/home-components/filter-sections";
import LoadingTest3arbon from "../../../component/shared/lotties-file/loading-test-3arbon";
import PaginationApp from "../../../component/shared/pagination/pagination-app";
import SubCategorySlider from "../../../component/shared/slider-categories/sub-category-slider";
import { authAxios, axios } from "../../../config/axios-config";
import { useAuthState } from "../../../context/auth-context";
import { useLanguage } from "../../../context/language-context";
import useAxios from "../../../hooks/use-axios";
import useGetGatogry from "../../../hooks/use-get-category";
import useGetSubGatogry from "../../../hooks/use-get-sub-category";
import useLocalStorage from "../../../hooks/use-localstorage";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { DEFAULT_PAGE, getDefaultPerPage } from "../../../constants/pagination";
import ProductCard from "component/home-components/ProductCard";
import ProductCardList from "../../../component/home-components/products-card-list";
import SortDropdown from "../../../component/home-components/SortDropdown";
import MobileSortToggle from "../../../component/home-components/MobileSortToggle";
import queryString from "query-string";
// import BuyNowAuctionsSlider from "component/home-components/buy-now-auctions-slider";
// import UpComingAuctionsSlider from "component/home-components/up-coming-auctions";
import routes from "routes";

const Categories = ({ selectedType, isFilterOpen, setIsFilterOpen }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { user } = useAuthState();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const titleParam = queryParams.get("title");
  const { categoryId } = useParams();
  const myRef = useRef();
  const myRef1 = useRef();
  const dispatch = useDispatch();
  const [auctionPageNumber, setAuctionPageNumber] = useState(
    Number(DEFAULT_PAGE),
  );
  const [listedPageNumber, setListedPageNumber] = useState(
    Number(DEFAULT_PAGE),
  );

  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [isGrid, setIsGrid] = useState(() => {
    return JSON.parse(localStorage.getItem("isGrid")) ?? true;
  });
  const [activeTab, setActiveTab] = useState(
    // selectedType === "all" ? "auction" : selectedType,
    selectedType === "all" ? "products" : selectedType,
  );

  useEffect(() => {
    if (selectedType !== "all") {
      setActiveTab(selectedType);
    }
  }, [selectedType]);

  const [open, setOpen] = useState(false);
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { SubGatogryOptions, loadingSubGatogry } = useGetSubGatogry(categoryId);

  const [mainAuctions, setMainAuctions] = useState();
  const [listedProducts, setListedProducts] = useState([]);
  const [totalPagesListed, setTotalPagesListed] = useState();
  const [totalpagesAuction, setTotalpagesAuction] = useState();
  const { run: runCategories, isLoading: isLoadingCategories } = useAxios([]);

  // Disable scroll when loading
  useEffect(() => {
    const isPageLoading =
      loadingSubGatogry || isLoadingCategories || loadingGatogry;
    if (isPageLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loadingSubGatogry, isLoadingCategories, loadingGatogry]);

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
      sortBy: parsed.sortBy || undefined,
      sortOrder: parsed.sortOrder || undefined,
      isHome: false,
    };

    Object.keys(filterParams).forEach((key) => {
      if (filterParams[key] === undefined) {
        delete filterParams[key];
      }
    });

    const queryStr = queryString.stringify(filterParams, {
      arrayFormat: "bracket",
    });
    // if (search.includes("page") && search.includes("perPage"))
    // if (user) {
    //   runCategories(
    //     authAxios.get(`${api.app.auctions.getMain}?${queryStr}`).then((res) => {
    //       setMainAuctions(res?.data?.data);
    //       setTotalpagesAuction(res?.data?.pagination?.totalPages);
    //       // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    //     }),
    //   );
    // } else {
    //   runCategories(
    //     axios.get(`${api.app.auctions.getMain}?${queryStr}`).then((res) => {
    //       setMainAuctions(res?.data?.data);
    //       setTotalpagesAuction(res?.data?.pagination?.totalPages);
    //       // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    //     }),
    //   );
    // }
  }, [categoryId, runCategories, search, user, auctionPageNumber]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

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
      sortBy: parsed.sortBy || undefined,
      sortOrder: parsed.sortOrder || undefined,
      isHome: false,
    };

    Object.keys(filterParams).forEach((key) => {
      if (filterParams[key] === undefined) {
        delete filterParams[key];
      }
    });

    const queryStr = queryString.stringify(filterParams, {
      arrayFormat: "bracket",
    });
    // if (search.includes("page") && search.includes("perPage"))
    if (user) {
      runCategories(
        authAxios
          .get(`${api.app.productListing.getAllListedProducts}?${queryStr}`)
          .then((res) => {
            setListedProducts(res?.data?.data);
            setTotalPagesListed(res?.data?.pagination?.totalPages);
            // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }),
      );
    } else {
      runCategories(
        axios
          .get(`${api.app.productListing.getAllListedProducts}?${queryStr}`)
          .then((res) => {
            setListedProducts(res?.data?.data);
            setTotalPagesListed(res?.data?.pagination?.totalPages);
            // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }),
      );
    }
  }, [categoryId, runCategories, search, user, listedPageNumber]);

  const [selectedCategor, SetselectedCategor] = useState([]);
  useEffect(() => {
    if (categoryId) {
      const selectedCategory = GatogryOptions.find(
        (category) => category.value === parseInt(categoryId),
      );
      if (selectedCategory) SetselectedCategor(selectedCategory);
    }
  }, [GatogryOptions, categoryId]);

  useEffect(() => {
    // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const [hasCompletedProfile, setHasCompletedProfile] = useLocalStorage(
    "hasCompletedProfile",
    "",
  );

  // const handelCreatOuction = () => {
  //   if (user) {
  //     if (JSON.parse(hasCompletedProfile)) {
  //       history.push(routes.app.createAuction.productDetails);
  //     } else setOpen(true);
  //   } else dispatch(Open());
  // };

  useEffect(() => {
    localStorage.setItem("isGrid", JSON.stringify(isGrid));
  }, [isGrid]);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If user scrolls more than 100px, hide the text
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      {isFilterOpen && (
        <FilterSections
          isFullPage={true}
          onClose={() => setIsFilterOpen(false)}
          categoryId={categoryId}
        />
      )}
      <div className="bg-white dark:bg-background">
        <div className="py-0 md:py-6">

          <Dimmer
            className="fixed w-full h-full top-0 bg-white/50"
            active={loadingSubGatogry || isLoadingCategories || loadingGatogry}
            inverted
          >
            {/* <Loader active /> */}
            <LoadingTest3arbon />
          </Dimmer>
          <div className="sticky z-30 relative w-full h-[220px] sm:h-[240px] md:h-[280px] lg:h-[300px] xl:h-[320px] mb-6 overflow-hidden top-[-50px] sm:top-[-90px] md:top-[-155px] lg:top-[-175px] xl:top-[-190px] md:-mt-6">




            <img
              className="w-full h-full object-cover object-center rounded-xl md:rounded-2xl"
              src={
                lang === "ar"
                  ? selectedCategor?.bannerLinkAr ||
                    selectedCategor?.bannerLink ||
                    addImage
                  : selectedCategor?.bannerLink ||
                    selectedCategor?.bannerLinkAr ||
                    addImage
              }
              alt={selectedCategor?.text || "Category Banner"}
              loading="eager"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-[#1b2331]/80 via-[#1b2331]/20 to-transparent lg:mx-4 rounded-xl md:rounded-2xl pointer-events-none"></div> */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10 text-white lg:mx-4 z-10 
                        transition-all duration-500 ease-in-out
                          ${isScrolled ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}`}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serifEN font-bold tracking-wide drop-shadow-md">
                {selectedCategor?.text}
              </h1>
            </div>
          </div>
          <div className={SubGatogryOptions.length === 0 ? "hidden" : "mb-6"}>
            <SubCategorySlider SubGatogryOptions={SubGatogryOptions} />
          </div>
          <div className="flex gap-3 px-4 lg:mx-auto md:mx-12 ">
            {/* left filter sections */}
            <FilterSections
              myRef={myRef}
              categoryId={categoryId}
              hiddenGatogry
            />
            {/* right card sections */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumb / Title / Tabs / Toggle header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-gray-200 dark:border-gray-800 mb-6 gap-y-4">
                <div className="flex flex-col gap-1 max-w-2xl">
                  <div className="flex items-center text-[10px] md:text-[11px] text-gray-500 dark:text-gray-400 gap-1 uppercase font-semibold tracking-wider mb-1">
                    <span
                      className="hover:text-yellow cursor-pointer transition-colors"
                      onClick={() => history.push(routes.app.home)}
                    >
                      HOME
                    </span>
                    <span>&gt;</span>
                    <span className="text-yellow uppercase font-semibold">
                      {selectedCategor?.text}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-serifEN dark:text-white text-primary font-bold">
                    {selectedCategor?.text}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">
                    Discover{" "}
                    {activeTab === "auction"
                      ? mainAuctions?.length || 0
                      : listedProducts?.length || 0}{" "}
                    curated listings from our collection.
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-auto md:mt-0 w-full md:w-auto py-2 flex-wrap">
                  {/* Desktop Sorting Dropdown */}
                  <div className="hidden md:block">
                    <SortDropdown 
                      lang={lang} 
                      selectedContent={selectedContent} 
                      categoryId={categoryId} 
                    />
                  </div>

                  {/* Mobile Sort | Save Bar */}
                  <div className="block md:hidden w-full">
                    <MobileSortToggle 
                      lang={lang} 
                      selectedContent={selectedContent} 
                      categoryId={categoryId} 
                    />
                  </div>

                  {/* Desktop Saved Button (Shortcut to Watchlist) */}
                  <div
                    onClick={() => history.push(routes.app.profile.watchlist)}
                    className="hidden md:flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 h-[42px] cursor-pointer bg-white dark:bg-[#1b2331] hover:border-gray-300 transition-all font-sansEN"
                  >
                    <HiHeart className="dark:text-primary-veryLight text-primary w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {selectedContent[localizationKeys.saved]}
                    </span>
                  </div>

                  {/* Type Toggle (Live Auctions / Fixed Price) */}
                  <div className="flex bg-gray-100 dark:bg-[#1b2331] rounded-lg p-1 flex-1 md:flex-none h-[42px] ml-auto">
                    {/* <button
                      onClick={() => setActiveTab("auction")}
                      className={`flex-1 md:flex-none px-4 py-1.5 text-xs md:text-sm font-semibold rounded-md transition-all duration-300 ${
                        activeTab === "auction"
                          ? "bg-white dark:bg-[#2c3e50] text-[#1e2738] dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      {selectedContent[localizationKeys.liveAuctions]}
                    </button> */}
                    <button
                      onClick={() => setActiveTab("products")}
                      className={`flex-1 md:flex-none px-4 py-1.5 text-xs md:text-sm font-semibold rounded-md transition-all duration-300 ${
                        activeTab === "products"
                          ? "bg-white dark:bg-[#2c3e50] text-[#1e2738] dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      {selectedContent[localizationKeys.listProduct]}
                    </button>
                  </div>

                  {/* Grid / List Icon Buttons */}
                  <div className="flex bg-gray-100 dark:bg-[#1b2331] rounded-lg p-1 gap-1 h-[42px]">
                    <button
                      onClick={() => setIsGrid(true)}
                      className={`p-2 rounded-md transition-all duration-300 ${
                        isGrid
                          ? "bg-[#1e2738] dark:bg-yellow text-white dark:text-[#1e2738] shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={isGrid ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </button>
                    <button
                      onClick={() => setIsGrid(false)}
                      className={`p-2 rounded-md transition-all duration-300 ${
                        !isGrid
                          ? "bg-[#1e2738] dark:bg-yellow text-white dark:text-[#1e2738] shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={!isGrid ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              {/* {mainAuctions?.length === 0 ? (
          <div className="w-full flex justify-center pt-52 bg-[#E5E5E51A] rounded-2xl">
            <div className="mx-auto text-center">
              <EmtyHome className="mx-auto " />
              <p className="text-gray-dark font-normal text-base py-8">
                {
                  selectedContent[
                    localizationKeys
                      .thereAreNoAuctionsCurrentlyMakeYourFirstAuctionRightAway
                  ]
                }
              </p>
              <button
                onClick={() => handelCreatOuction()}
                className="bg-primary hover:bg-primary-dark text-white rounded-lg w-[128px] h-[32px]"
              >
                {selectedContent[localizationKeys.createNow]}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {isGrid ? (
              <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
                {mainAuctions?.map((e) => (
                  <AuctionCard
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
                    startBidAmount={e?.startBidAmount}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full">
                {mainAuctions?.map((e) => (
                  <AuctionCardList
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
                    startBidAmount={e?.startBidAmount}
                  />
                ))}
              </div>
            )}
          </div>
        )} */}

              {titleParam ? (
                <SearchResults
                  auctions={mainAuctions}
                  products={listedProducts}
                  isLoading={isLoadingCategories}
                  searchQuery={titleParam}
                />
              ) : (
                (() => {
                  /* if (isGrid && activeTab === "auction") {
                    return (
                      <div>
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
                              onReload={onReload}
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
                      </div>
                    );
                  } else if (!isGrid && activeTab === "auction") {
                    return (
                      <div>
                        <div className="flex flex-col gap-4 w-full">
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
                      </div>
                    );
                  } else */ if (isGrid && activeTab === "products") {
                    return (
                      <div>
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
                      </div>
                    );
                  } else if (!isGrid && activeTab === "products") {
                    return (
                      <div>
                        <div className="flex flex-col gap-4 w-full">
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
                      </div>
                    );
                  } else if (isGrid && selectedType === "all") {
                    return (
                      <>
                        {/* <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
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
                              onReload={onReload}
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
                        </div> */}
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
                  } else if (!isGrid && selectedType === "all") {
                    return (
                      <>
                        {/* <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-2">
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
                        </div> */}
                        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-2">
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
                })()
              )}
            </div>
          </div>
          {/*!titleParam && (
            <div className="px-4 mx-auto py-10">
              <BuyNowAuctionsSlider />
            </div>
          )*/}
          {/* <div className="flex justify-end ltr:mr-2 rtl:ml-2  mt-7 pb-12 px-4 mx-auto ">
        <PaginationApp totalPages={totalPages} perPage={40} myRef={myRef} />
      </div> */}
          <AddLocationModel
            open={open}
            setOpen={setOpen}
            TextButton={selectedContent[localizationKeys.proceed]}
          />
        </div>
      </div>
    </div>
  );
};

export default Categories;
