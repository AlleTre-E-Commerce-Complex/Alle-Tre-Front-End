import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import api from "../../../api";
import AuctionCard from "../../../components/home-components/auction-card";
import BuyNowAuctionsSlider from "../../../components/home-components/buy-now-auctions-slider";
import FilterSections from "../../../components/home-components/filter-sections";

import ImageSlider from "../../../components/home-components/image-slider";
import LiveAuctionsSlider from "../../../components/home-components/live-auctions-slider";
import SliderRow from "../../../components/shared/slider-categories/slider-row";
import { authAxios } from "../../../config/axios-config";
import { useAuthState } from "../../../context/auth-context";
import useAxios from "../../../hooks/use-axios";
import createAuctionimgBGfrom from "../../../../src/assets/img/create_auction_img_BG.png";
import createAuctionimgSm from "../../../../src/assets/img/create_auction_img_SM.png";
import routes from "../../../routes";
import AddLocationModel from "../../../components/create-auction-components/add-location-model";
import useLocalStorage from "../../../hooks/use-localstorage";
import CreaAuctionText from "../../../../src/assets/img/creat_auction_text.png";
import { Open } from "../../../redux-store/auth-model-slice";
import { useDispatch, useSelector } from "react-redux";
import UpComingAuctionsSlider from "../../../components/home-components/up-coming-auctions";
import PaginationApp from "../../../components/shared/pagination/pagination-app";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";

const Home = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { search } = useLocation();
  const history = useHistory();
  const { user } = useAuthState();
  const myRef = useRef();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [mainAuctions, setMainAuctions] = useState();
  const [totalPages, setTotalPages] = useState();
  const [sponsoredAuctions, SetSponsoredAuctions] = useState();

  const { run: runMainAuctions, isLoading: isLoadingMainAuctions } = useAxios(
    []
  );
  const {
    run: runSponsoredAuctions,
    isLoading: isLoadingrunSponsoredAuctions,
  } = useAxios([]);
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
    <div className="lg:mt-36 md:mt-32 mt-24 py-6 home overflow-hidden">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingMainAuctions || isLoadingrunSponsoredAuctions}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="z-20 md:h-[541px] h-[200px] ">
        <ImageSlider
          myRef={myRef}
          images={sponsoredAuctions?.map((img) => img?.product?.images)}
          slidesData={sponsoredAuctions}
        />
      </div>
      <div className="pt-32 text-center">
        <h1 ref={myRef} className="text-gray-dark text-base font-bold ">
          {selectedContent[localizationKeys.popularCategories]}
        </h1>
        <p className="text-gray-med text-base font-normal">
          Lorem ipsum dolor sit amet, consetetur<br></br> sadipscing elitr, sed
          diam nonumy eirmod
        </p>
      </div>
      <div className="mt-11 mb-20">
        <SliderRow />
      </div>
      <h6 className="max-w-[1440px] lg:mx-auto mx-2 pb-4 text-gray-med text-base font-normal">
        {mainAuctions?.length} {selectedContent[localizationKeys.results]}
      </h6>
      <div className="max-w-[1440px] lg:mx-auto mx-2">
        <div className="flex gap-5 max-w-[1440px] lg:mx-auto mx-2">
          {/* left filter sections */}
          <FilterSections myRef={myRef} />
          {/* right card sections */}
          {/* <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-5 gap-3 h-fit mx-auto "> */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 sm:gap-5 gap-3 h-fit mx-auto ">
            {mainAuctions?.map((e) => (
              <AuctionCard
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
        </div>
        <div className="flex justify-end mt-7 mb-12 ltr:mr-2 rtl:ml-2 ">
          <PaginationApp totalPages={totalPages} perPage={28} myRef={myRef} />
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto">
        <LiveAuctionsSlider />
      </div>
      <div className="relative py-12">
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
      </div>
      <div className="max-w-[1440px] mx-auto">
        <UpComingAuctionsSlider />
      </div>
      <div className="max-w-[1440px] mx-auto">
        <BuyNowAuctionsSlider />
      </div>

      <AddLocationModel
        open={open}
        setOpen={setOpen}
        TextButton={selectedContent[localizationKeys.proceed]}
      />
    </div>
  );
};

export default Home;
