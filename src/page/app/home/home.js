import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dimmer, Loader } from "semantic-ui-react";
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
import ShowFilterSections from "../../../component/home-components/show-filter-sections";
import listicon from "../../../../src/assets/icons/bullet.svg";
import menuicon from "../../../../src/assets/icons/grid-06.svg";
import { ReactComponent as EmtyHome } from "../../../../src/assets/icons/emty-home-page.svg";
import AuctionCardList from "../../../component/home-components/auction-card-list";
import BannerTop from "component/home-components/BannerTop";
import WelcomeBonusModal from "component/shared/WelcomeBonusModal/WelcomeBonusModal";
import { welcomeBonus } from "redux-store/welcom-bonus-slice";
// import { useSocket } from "context/socket-context";
import { useSocket } from "context/socket-context";
import LiveAuctionsSlider from "component/home-components/live-auctions-slider";
import ListedProducts from "component/home-components/ListedProducts";

const Home = () => {
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
  const [isGrid, setIsGrid] = useState(true);
  const socket = useSocket();
  const [open, setOpen] = useState(false);
  const [mainAuctions, setMainAuctions] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [sponsoredAuctions, SetSponsoredAuctions] = useState([]);
  // const [showRewardModal, setShowRewardModal] = useState(true);
  const [openWelcomeBonusModal, setOpenWelcomeBonusModal] = useState(false);
  const { run: runMainAuctions, isLoading: isLoadingMainAuctions } = useAxios(
    []
  );
  const {
    run: runSponsoredAuctions,
    isLoading: isLoadingrunSponsoredAuctions,
  } = useAxios([]);

  //socket listening for new auction
  useEffect(() => {
    if (!socket) return;

    const handleNewAuction = (data) => {
      setMainAuctions((prev) => [
        ...prev, // Spread the previous state
        data.auction, // Add the new auction
      ]);
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
    if (search.includes("page") && search.includes("perPage"))
      if (!user) {
        runMainAuctions(
          axios.get(`${api.app.auctions.getMain}${search}`).then((res) => {
            setMainAuctions(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
          })
        );
        runSponsoredAuctions(
          axios.get(`${api.app.auctions.sponsored}`).then((res) => {
            console.log(
              "response of runMainAuctions when user not  have XXX",
              res
            );
            SetSponsoredAuctions(res?.data?.data);
          })
        );
      } else {
        runMainAuctions(
          authAxios.get(`${api.app.auctions.getMain}${search}`).then((res) => {
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
  }, [runMainAuctions, runSponsoredAuctions, search, user]);

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
      <div className="z-20 md:h-[464px] w-full h-[200px] px-4 mx-auto py-10 ">
        {/* <ImageSlider
          myRef={myRef}
          images={sponsoredAuctions?.map((img) => img?.product?.images)}
          slidesData={sponsoredAuctions}
          emtystateImg={bigSliderEmtyState}
        /> */}
        <BannerTop />
      </div>
      <div className="pt-10 text-center mt-16 md:mt-0">
        <h1 ref={myRef} className="text-gray-dark text-base font-bold ">
          {selectedContent[localizationKeys.popularCategories]}
        </h1>
        <p className="text-gray-med text-base font-normal">
          {selectedContent[localizationKeys.PopularPicksPerfectChoices]}
        </p>
      </div>
      <div className="mt-11 mb-20">
        <SliderRow />
      </div>
      <div className="flex justify-between  lg:mx-auto mx-2 px-4 pb-4 ">
        <div className="flex  gap-x-60">
          <h6 className=" text-gray-med text-base font-normal pt-3 ">
            {mainAuctions?.length} {selectedContent[localizationKeys.results]}
          </h6>
          <div className="">
            <ShowFilterSections />
          </div>
        </div>
        <div className={mainAuctions?.length === 0 ? "hidden" : "mt-auto"}>
          {isGrid ? (
            <button
              onClick={() => setIsGrid((p) => !p)}
              className="flex items-center gap-x-3  h-9 text-primary-light bg-primary-light/20 rounded-lg p-2"
            >
              <img src={menuicon} alt="menuiconicon" />
              <p className="flex items-center">
                {" "}
                {selectedContent[localizationKeys.Grid]}
              </p>
            </button>
          ) : (
            <button
              onClick={() => setIsGrid((p) => !p)}
              className="flex items-center gap-x-3  h-9 text-primary-light bg-primary-light/20 rounded-lg p-2"
            >
              <img src={listicon} alt="listicon" />
              <p className="flex items-center">
                {" "}
                {selectedContent[localizationKeys.List]}
              </p>
            </button>
          )}
        </div>
      </div>
      <div className="px-4 lg:mx-auto mx-2">
        <div className="flex gap-5 px-4 lg:mx-auto mx-2">
          {/* left filter sections */}
          <FilterSections myRef={myRef} />
          {/* right card sections */}
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
              {isGrid ? (
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 sm:gap-5 gap-3 h-fit mx-auto ">
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
              ) : (
                <div className="w-full">
                  {mainAuctions?.map((e) => (
                    <AuctionCardList
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
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
          <PaginationApp totalPages={totalPages} perPage={28} myRef={myRef} />
        </div>
      </div>
      <div className="px-4 mx-auto py-10">
        {/* <LiveAuctionsSlider /> */}
        <ListedProducts />
      </div>
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
