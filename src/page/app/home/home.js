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
import routes from "../../../routes";
import AddLocationModel from "../../../component/create-auction-components/add-location-model";
import useLocalStorage from "../../../hooks/use-localstorage";
import { Open } from "../../../redux-store/auth-model-slice";
import { useDispatch } from "react-redux";
import UpComingAuctionsSlider from "../../../component/home-components/up-coming-auctions";
import PaginationApp from "../../../component/shared/pagination/pagination-app";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";
import listicon from "../../../../src/assets/icons/bullet.svg";
import menuicon from "../../../../src/assets/icons/grid-06.svg";
import { ReactComponent as EmtyHome } from "../../../../src/assets/icons/emty-home-page.svg";
import AuctionCardList from "../../../component/home-components/auction-card-list";
import BannerTop from "component/home-components/BannerTop";
import WelcomeBonusModal from "component/shared/WelcomeBonusModal/WelcomeBonusModal";
import { welcomeBonus } from "redux-store/welcom-bonus-slice";
// import { useSocket } from "context/socket-context";
import { useSocket } from "context/socket-context";
// import LiveAuctionsSlider from "component/home-components/live-auctions-slider";
import ProductCard from "component/home-components/ProductCard";
import ProductCardList from "component/home-components/products-card-list";

const Home = ({ selectedType }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { search } = useLocation();
  const history = useHistory();
  const { user } = useAuthState();
  const myRef = useRef();
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
  const [totalPages, setTotalPages] = useState();
  const [sponsoredAuctions, SetSponsoredAuctions] = useState([]);
  const [page, setPage] = useState(20);

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

  // useEffect(() => {
  //   localStorage.setItem("isGrid", JSON.stringify(isGrid));
  // }, [isGrid]);

  // useEffect(() => {
  //   const queryParams = new URLSearchParams();
  //   queryParams.set("page", currentPage);
  //   queryParams.set("perPage", itemsPerPage);

  //   const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
  //   history.pushState({}, "", newUrl);
  // }, [currentPage, itemsPerPage]);

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

    // Register socket listeners
    socket.on("auction:newAuctionListed", handleNewAuction);
    socket.on("auction:cancelled", handleAuctionCancelled);

    // Cleanup to avoid memory leaks
    return () => {
      socket.off("auction:newAuctionListed", handleNewAuction);
      socket.off("auction:cancelled", handleAuctionCancelled);
    };
  }, [socket]);

  useEffect(() => {
    if (isWelcomeBonus) {
      setOpenWelcomeBonusModal(true);
      dispatch(welcomeBonus(false));
    }
  }, [isWelcomeBonus]);

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const page = queryParams.get("page");
    const perPage = queryParams.get("perPage");

    if (page && perPage) {
      if (!user) {
        runMainAuctions(
          axios
            .get(`${api.app.auctions.getMain}?page=${page}&perPage=${perPage}`)
            .then((res) => {
              setMainAuctions(res?.data?.data);
              setTotalPages(res?.data?.pagination?.totalPages);
            })
        );
        runSponsoredAuctions(
          axios.get(`${api.app.auctions.sponsored}`).then((res) => {
            SetSponsoredAuctions(res?.data?.data);
          })
        );
      } else {
        runMainAuctions(
          authAxios
            .get(`${api.app.auctions.getMain}?page=${page}&perPage=${perPage}`)
            .then((res) => {
              setMainAuctions(res?.data?.data);
              setTotalPages(res?.data?.pagination?.totalPages);
            })
        );
        runSponsoredAuctions(
          authAxios.get(`${api.app.auctions.sponsored}`).then((res) => {
            SetSponsoredAuctions(res?.data?.data);
          })
        );
      }
    }
  }, [search, user]);

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const pageParam = queryParams.get("page");
    const perPageParam = queryParams.get("perPage");

    if (pageParam && perPageParam) {
      if (user) {
        runListedProduct(
          axios
            .get(
              `${api.app.productListing.getAllListedProducts}?page=${pageParam}&perPage=${perPageParam}`
            )
            .then((res) => {
              setListedProducts(res?.data?.data);
              setTotalPages(res?.data?.totalPages);
            })
        );
      } else {
        runListedProduct(
          axios
            .get(
              `${api.app.productListing.getAllListedProducts}?page=${pageParam}&perPage=${perPageParam}`
            )
            .then((res) => {
              setListedProducts(res?.data?.data);
              setTotalPages(res?.data?.totalPages);
            })
        );
      }
    }
  }, [page, search, user]);

  const [hasCompletedProfile, setHasCompletedProfile] = useLocalStorage(
    "hasCompletedProfile",
    ""
  );

  const handelCreatOuction = () => {
    if (user) {
      if (JSON.parse(hasCompletedProfile)) {
        history.push(routes.app.createAuction.productDetails);
      } else setOpen(true);
    } else dispatch(Open());
  };

  return (
    <div className="lg:mt-36 md:mt-32 mt-24 py-6 home ">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingMainAuctions || isLoadingrunSponsoredAuctions}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="z-20  w-full px-4 mx-auto py-5">
        <BannerTop />
      </div>
      <div className="text-center mt-1 md:mt-3 lg:mt-5">
        <h1
          ref={myRef}
          className="text-gray-dark text-base font-bold md:text-2xl lg:text-3xl"
        >
          {selectedContent[localizationKeys.popularCategories]}
        </h1>
        <p className="text-gray-med text-base font-normal md:text-lg lg:text-xl">
          {selectedContent[localizationKeys.PopularPicksPerfectChoices]}
        </p>
      </div>
      <div className="mt-11 mb-20">
        <SliderRow />
      </div>
      <div className="flex justify-between  lg:mx-auto mx-2 px-4 pb-2 ">
        <div className="flex  ">
          <h6 className=" text-gray-dark text-base font-normal pt-3 pl-3 ">
            {mainAuctions?.length} {selectedContent[localizationKeys.results]}
          </h6>
          {/* <div className="">
            <ShowFilterSections />
          </div> */}
        </div>
        <div className={mainAuctions?.length === 0 ? "hidden" : "mt-auto"}>
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
              <img src={listicon} alt="listicon" />
              <p className="flex items-center">
                {selectedContent[localizationKeys.List]}
              </p>
            </button>
          )}
        </div>
      </div>
      <div className=" lg:mx-auto mx-2">
        <div className="flex gap-5  px-2 sm:px-4 mx-2 ">
          {/* left filter sections */}
          <FilterSections myRef={myRef} />
          {/* <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-5 gap-3 h-fit mx-auto "> */}
          {mainAuctions?.length === 0 ? (
            <div className="w-full flex justify-center pt-52 bg-[#E5E5E51A] rounded-2xl">
              <div className="mx-auto text-center">
                <EmtyHome className="mx-auto" />
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
              {(() => {
                if (isGrid && selectedType === "auction") {
                  return (
                    <div>
                      <h1 className="text-center text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                        {selectedContent[localizationKeys.trendingAuctions]}
                      </h1>

                      <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
                        {mainAuctions?.map((e) => (
                          <AuctionCard
                            key={e?.id}
                            auctionId={e?.id}
                            price={e?.acceptedAmount || e?.startBidAmount}
                            title={e?.product?.title}
                            status={e?.status}
                            adsImg={e?.product?.images[0].imageLink}
                            totalBods={e?._count?.bids}
                            WatshlistState={e?.isSaved}
                            endingTime={e?.expiryDate}
                            StartDate={e?.startDate}
                            isBuyNowAllowed={e?.isBuyNowAllowed}
                            isMyAuction={e?.isMyAuction}
                            latestBidAmount={e?.bids[0]?.amount}
                            CurrentBid={e?.currentBid?.bidAmount}
                            startBidAmount={e?.startBidAmount}
                          />
                        ))}
                      </div>
                      <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                        <PaginationApp
                          totalPages={totalPages}
                          perPage={28}
                          myRef={myRef}
                        />
                      </div>
                    </div>
                  );
                } else if (!isGrid && selectedType === "auction") {
                  return (
                    <div>
                      <h1 className="text-center text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                        {selectedContent[localizationKeys.trendingAuctions]}
                      </h1>
                      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-2">
                        {mainAuctions?.map((e) => (
                          <AuctionCardList
                            key={e?.id}
                            auctionId={e?.id}
                            price={e?.acceptedAmount || e?.startBidAmount}
                            title={e?.product?.title}
                            status={e?.status}
                            adsImg={e?.product?.images[0].imageLink}
                            totalBods={e?._count?.bids}
                            WatshlistState={e?.isSaved}
                            endingTime={e?.expiryDate}
                            StartDate={e?.startDate}
                            isBuyNowAllowed={e?.isBuyNowAllowed}
                            isMyAuction={e?.isMyAuction}
                          />
                        ))}
                      </div>
                      <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                        <PaginationApp
                          totalPages={totalPages}
                          perPage={28}
                          myRef={myRef}
                        />
                      </div>
                    </div>
                  );
                } else if (isGrid && selectedType === "products") {
                  return (
                    <div>
                      <h1 className="text-center text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                        {selectedContent[localizationKeys.listedProduct]}
                      </h1>
                      <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
                        {listedProducts?.map((e) => (
                          <ProductCard
                            key={e?.id}
                            price={e?.ProductListingPrice}
                            title={e?.product?.title}
                            imageLink={e?.product?.images[0].imageLink}
                            id={e?.product?.id}
                            city={
                              lang === "en"
                                ? e?.product?.user?.locations[0]?.city?.nameEn
                                : e?.product?.user?.locations[0]?.city?.nameAr
                            }
                            country={
                              lang === "en"
                                ? e?.product?.user?.locations[0]?.country
                                    ?.nameEn
                                : e?.product?.user?.locations[0]?.country
                                    ?.nameAr
                            }
                            createdAt={e?.product?.user?.createdAt}
                          />
                        ))}
                      </div>
                      <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                        <PaginationApp
                          totalPages={totalPages}
                          perPage={28}
                          myRef={myRef}
                        />
                      </div>
                    </div>
                  );
                } else if (!isGrid && selectedType === "products") {
                  return (
                    <div>
                      <h1 className="text-center text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                        {selectedContent[localizationKeys.listedProduct]}
                      </h1>
                      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-2">
                        {listedProducts?.map((e) => (
                          <ProductCardList
                            key={e?.id}
                            price={e?.ProductListingPrice}
                            title={e?.product?.title}
                            imageLink={e?.product?.images[0].imageLink}
                            id={e?.product?.id}
                            city={
                              lang === "en"
                                ? e?.product?.user?.locations[0]?.city?.nameEn
                                : e?.product?.user?.locations[0]?.city?.nameAr
                            }
                            country={
                              lang === "en"
                                ? e?.product?.user?.locations[0]?.country
                                    ?.nameEn
                                : e?.product?.user?.locations[0]?.country
                                    ?.nameAr
                            }
                            createdAt={e?.product?.user?.createdAt}
                          />
                        ))}
                      </div>
                      <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                        <PaginationApp
                          totalPages={totalPages}
                          perPage={28}
                          myRef={myRef}
                        />
                      </div>
                    </div>
                  );
                } else if (isGrid && selectedType === "all") {
                  return (
                    <>
                      <h1 className="text-center text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                        {selectedContent[localizationKeys.trendingAuctions]}
                      </h1>
                      <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
                        {mainAuctions?.map((e) => (
                          <AuctionCard
                            key={e?.id}
                            auctionId={e?.id}
                            price={e?.acceptedAmount || e?.startBidAmount}
                            title={e?.product?.title}
                            status={e?.status}
                            adsImg={e?.product?.images[0].imageLink}
                            totalBods={e?._count?.bids}
                            WatshlistState={e?.isSaved}
                            endingTime={e?.expiryDate}
                            StartDate={e?.startDate}
                            isBuyNowAllowed={e?.isBuyNowAllowed}
                            isMyAuction={e?.isMyAuction}
                            latestBidAmount={e?.bids[0]?.amount}
                            CurrentBid={e?.currentBid?.bidAmount}
                            startBidAmount={e?.startBidAmount}
                          />
                        ))}
                      </div>
                      <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                        <PaginationApp
                          totalPages={totalPages}
                          perPage={28}
                          myRef={myRef}
                        />
                      </div>
                      <h1 className="pb-6 text-center text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                        {selectedContent[localizationKeys.listedProduct]}
                      </h1>
                      <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full mt-6">
                        {listedProducts?.map((e) => (
                          <ProductCard
                            key={e?.id}
                            price={e?.ProductListingPrice}
                            title={e?.product?.title}
                            imageLink={e?.product?.images[0].imageLink}
                            id={e?.product?.id}
                            city={
                              lang === "en"
                                ? e?.product?.user?.locations[0]?.city?.nameEn
                                : e?.product?.user?.locations[0]?.city?.nameAr
                            }
                            country={
                              lang === "en"
                                ? e?.product?.user?.locations[0]?.country
                                    ?.nameEn
                                : e?.product?.user?.locations[0]?.country
                                    ?.nameAr
                            }
                            createdAt={e?.product?.user?.createdAt}
                          />
                        ))}
                      </div>
                      <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                        <PaginationApp
                          totalPages={totalPages}
                          perPage={28}
                          myRef={myRef}
                        />
                      </div>
                    </>
                  );
                } else if (!isGrid && selectedType === "all") {
                  return (
                    <>
                      <h1 className="text-center text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                        {selectedContent[localizationKeys.trendingAuctions]}
                      </h1>
                      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-2">
                        {mainAuctions?.map((e) => (
                          <AuctionCardList
                            key={e?.id}
                            auctionId={e?.id}
                            price={e?.acceptedAmount || e?.startBidAmount}
                            title={e?.product?.title}
                            status={e?.status}
                            adsImg={e?.product?.images[0].imageLink}
                            totalBods={e?._count?.bids}
                            WatshlistState={e?.isSaved}
                            endingTime={e?.expiryDate}
                            StartDate={e?.startDate}
                            isBuyNowAllowed={e?.isBuyNowAllowed}
                            isMyAuction={e?.isMyAuction}
                          />
                        ))}
                      </div>
                      <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                        <PaginationApp
                          totalPages={totalPages}
                          perPage={28}
                          myRef={myRef}
                        />
                      </div>
                      <h1 className="pb-14 text-center text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
                        {selectedContent[localizationKeys.listedProduct]}
                      </h1>
                      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-2">
                        {listedProducts?.map((e) => (
                          <ProductCardList
                            key={e?.id}
                            price={e?.ProductListingPrice}
                            title={e?.product?.title}
                            imageLink={e?.product?.images[0].imageLink}
                            id={e?.product?.id}
                            city={
                              lang === "en"
                                ? e?.product?.user?.locations[0]?.city?.nameEn
                                : e?.product?.user?.locations[0]?.city?.nameAr
                            }
                            country={
                              lang === "en"
                                ? e?.product?.user?.locations[0]?.country
                                    ?.nameEn
                                : e?.product?.user?.locations[0]?.country
                                    ?.nameAr
                            }
                            createdAt={e?.product?.user?.createdAt}
                          />
                        ))}
                      </div>
                      <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
                        <PaginationApp
                          totalPages={totalPages}
                          perPage={28}
                          myRef={myRef}
                        />
                      </div>
                    </>
                  );
                } else {
                  return null; // Default case (optional)
                }
              })()}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 mx-auto py-10">{/* <LiveAuctionsSlider /> */}</div>
      {/* <div className="relative py-14 ">
        <img
          className="w-full h-[257px] object-cover md:block hidden "
          src={createAuctionimgBGfrom}
          alt="createAuctionimgBGfrom"
        />
        <img
          className="w-full h-auto object-cover  block md:hidden "
          src={createAuctionimgSm}
          alt="createAuctionimgSm"
        />
        <button
          onClick={() => handelCreatOuction()}
          className="w-[304px] h-[48px] text-base font-normal bg-primary hover:bg-primary-dark rounded-lg text-white absolute bottom-[90px] right-[90px] hidden md:block"
        >
          {selectedContent[localizationKeys.createAuctionNow]}
        </button>
        <button
          onClick={() => handelCreatOuction()}
          className="w-[128px] h-[32px] text-base font-normal bg-primary hover:bg-primary-dark rounded-lg text-white absolute bottom-[60px] right-[25px] md:hidden block"
        >
          {selectedContent[localizationKeys.createAuction]}
        </button>
        <img
          className="lg:w-[700px] w-[500px] absolute bottom-[90px] left-[90px] hidden md:block"
          src={CreaAuctionText}
          alt="CreaAuctionText"
        />
      </div> */}
      <div className="px-4 mx-auto py-10">
        <UpComingAuctionsSlider />
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
  );
};

export default React.memo(Home);
