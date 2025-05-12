import AuctionCardList from "component/home-components/auction-card-list";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import SearchResults from "../../../component/home-components/search-results";
import { Dimmer } from "semantic-ui-react";
import addImage from "../../../../src/assets/icons/add-image-icon.png";
import listicon from "../../../../src/assets/icons/bullet.svg";
import menuicon from "../../../../src/assets/icons/grid-06.svg";
import api from "../../../api";
import AddLocationModel from "../../../component/create-auction-components/add-location-model";
import AuctionCard from "../../../component/home-components/auction-card";
import FilterSections from "../../../component/home-components/filter-sections";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";
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
// import { Open } from "../../../redux-store/auth-model-slice";
// import routes from "../../../routes";
// import { ReactComponent as NoAuctionImg } from "../../../../src/assets/images/no auction new.svg";
// import { ReactComponent as NoProductImg } from "../../../../src/assets/images/no products new.svg";
import { DEFAULT_PAGE, getDefaultPerPage } from "../../../constants/pagination";
import ProductCard from "component/home-components/ProductCard";
import ProductCardList from "component/home-components/products-card-list";
import queryString from "query-string";
import BuyNowAuctionsSlider from "component/home-components/buy-now-auctions-slider";
import UpComingAuctionsSlider from "component/home-components/up-coming-auctions";

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
    Number(DEFAULT_PAGE)
  );
  const [listedPageNumber, setListedPageNumber] = useState(
    Number(DEFAULT_PAGE)
  );

  const [isGrid, setIsGrid] = useState(() => {
    return JSON.parse(localStorage.getItem("isGrid")) ?? true;
  });
  const [open, setOpen] = useState(false);
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { SubGatogryOptions, loadingSubGatogry } = useGetSubGatogry(categoryId);

  const [mainAuctions, setMainAuctions] = useState();
  const [listedProducts, setListedProducts] = useState([]);
  const [totalPagesListed, setTotalPagesListed] = useState();
  const [totalpagesAuction, setTotalpagesAuction] = useState();
  const { run: runCategories, isLoading: isLoadingCategories } = useAxios([]);

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
    // if (search.includes("page") && search.includes("perPage"))
    if (user) {
      runCategories(
        authAxios.get(`${api.app.auctions.getMain}?${queryStr}`).then((res) => {
          setMainAuctions(res?.data?.data);
          setTotalpagesAuction(res?.data?.pagination?.totalPages);
          // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        })
      );
    } else {
      runCategories(
        axios.get(`${api.app.auctions.getMain}?${queryStr}`).then((res) => {
          setMainAuctions(res?.data?.data);
          setTotalpagesAuction(res?.data?.pagination?.totalPages);
          // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        })
      );
    }
  }, [categoryId, runCategories, search, user, auctionPageNumber]);

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
    // if (search.includes("page") && search.includes("perPage"))
    if (user) {
      runCategories(
        axios
          .get(`${api.app.productListing.getAllListedProducts}?${queryStr}`)
          .then((res) => {
            setListedProducts(res?.data?.data);
            setTotalPagesListed(res?.data?.pagination?.totalPages);
            // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          })
      );
    } else {
      runCategories(
        axios
          .get(`${api.app.productListing.getAllListedProducts}?${queryStr}`)
          .then((res) => {
            setListedProducts(res?.data?.data);
            setTotalPagesListed(res?.data?.pagination?.totalPages);
            // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          })
      );
    }
  }, [categoryId, runCategories, search, user, listedPageNumber]);

  const [selectedCategor, SetselectedCategor] = useState([]);

  useEffect(() => {
    if (categoryId) {
      const selectedCategory = GatogryOptions.find(
        (category) => category.value === parseInt(categoryId)
      );
      if (selectedCategory) SetselectedCategor(selectedCategory);
    }
  }, [GatogryOptions, categoryId]);

  useEffect(() => {
    // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const [hasCompletedProfile, setHasCompletedProfile] = useLocalStorage(
    "hasCompletedProfile",
    ""
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

  return (
    <div className="relative">
      {isFilterOpen && (
        <FilterSections
          isFullPage={true}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
      <div className="">
        <div className="mx-auto mt-32 py-3 md:py-6 py-3 ">
          <Dimmer
            className="fixed w-full h-full top-0 bg-white/50"
            active={loadingSubGatogry || isLoadingCategories || loadingGatogry}
            inverted
          >
            {/* <Loader active /> */}
            <LodingTestAllatre />
          </Dimmer>
          <div className="relative w-full aspect-[21/9] max-h-[370px] mb-6 overflow-hidden rounded-lg px-4">
            <img
              className="w-full h-full object-fill object-center rounded-lg"
              src={selectedCategor?.bannerLink || addImage}
              alt={selectedCategor?.text || "Category Banner"}
              loading="eager"
            />
            <div className="">
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                  {selectedCategor?.text}
                </h1>
              </div>
            </div>
          </div>
          <div className={SubGatogryOptions.length === 0 ? "hidden" : "mb-6"}>
            <SubCategorySlider SubGatogryOptions={SubGatogryOptions} />
          </div>
          <div className="flex justify-between px-4 lg:mx-auto mx-2 px-2 pb-4 ">
            <div className="flex  gap-x-60">
              <h6 className=" text-gray-med text-base font-normal pt-3 ">
                {mainAuctions?.length}{" "}
                {selectedContent[localizationKeys.results]}
              </h6>
            </div>
            <div className="mt-auto">
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
          <div className="flex gap-3 px-4 lg:mx-auto md:mx-12 ">
            {/* left filter sections */}
            <FilterSections
              myRef={myRef}
              categoryId={categoryId}
              hiddenGatogry
            />
            {/* right card sections */}
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

            <div className="w-full">
              {titleParam ? (
                <SearchResults
                  auctions={mainAuctions}
                  products={listedProducts}
                  isLoading={isLoadingCategories}
                  searchQuery={titleParam}
                />
              ) : (
                (() => {
                  if (isGrid && selectedType === "auction") {
                    return (
                      <div>
                        {mainAuctions?.length !== 0 && (
                          <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                            {selectedContent[localizationKeys.trendingAuctions]}
                          </h1>
                        )}
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
                        {mainAuctions?.length !== 0 && (
                          <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                            {selectedContent[localizationKeys.trendingAuctions]}
                          </h1>
                        )}
                        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-2">
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
                  } else if (isGrid && selectedType === "products") {
                    return (
                      <div>
                        {listedProducts?.length !== 0 && (
                          <h1
                            ref={myRef1}
                            className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8"
                          >
                            {selectedContent[localizationKeys.listedProduct]}
                          </h1>
                        )}
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
                        {listedProducts?.length !== 0 && (
                          <h1
                            ref={myRef1}
                            className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8"
                          >
                            {selectedContent[localizationKeys.listedProduct]}
                          </h1>
                        )}
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
                        {mainAuctions?.length !== 0 && (
                          <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                            {selectedContent[localizationKeys.trendingAuctions]}
                          </h1>
                        )}
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
                        {listedProducts?.length !== 0 && (
                          <h1
                            ref={myRef1}
                            className="pb-6 text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8"
                          >
                            {selectedContent[localizationKeys.listedProduct]}
                          </h1>
                        )}
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
                        {mainAuctions?.length !== 0 && (
                          <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                            {selectedContent[localizationKeys.trendingAuctions]}
                          </h1>
                        )}
                        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-2">
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
                        {listedProducts?.length !== 0 && (
                          <h1
                            ref={myRef1}
                            className="pb-14 text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8"
                          >
                            {selectedContent[localizationKeys.listedProduct]}
                          </h1>
                        )}
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
                })())}
            </div>
          </div>
          {!titleParam && <div className="px-4 mx-auto py-10">
            <BuyNowAuctionsSlider />
          </div>}
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
