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
import { useDispatch } from "react-redux";
import UpComingAuctionsSlider from "../../../components/home-components/up-coming-auctions";

const Home = () => {
  const { search } = useLocation();
  const history = useHistory();
  const { user } = useAuthState();
  const myRef = useRef();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [mainAuctions, setMainAuctions] = useState();
  const [sponsoredAuctions, SetSponsoredAuctions] = useState();

  const { run: runMainAuctions, isLoading: isLoadingMainAuctions } = useAxios(
    []
  );
  const {
    run: runSponsoredAuctions,
    isLoading: isLoadingrunSponsoredAuctions,
  } = useAxios([]);
  useEffect(() => {
    if (!user) {
      runMainAuctions(
        axios.get(`${api.app.auctions.getMain}${search}`).then((res) => {
          setMainAuctions(res?.data?.data);
        })
      );
      runSponsoredAuctions(
        axios.get(`${api.app.auctions.sponsored}`).then((res) => {
          SetSponsoredAuctions(res?.data?.data);
        })
      );
    }
    runMainAuctions(
      authAxios.get(`${api.app.auctions.getMain}${search}`).then((res) => {
        setMainAuctions(res?.data?.data);
      })
    );
    runSponsoredAuctions(
      authAxios.get(`${api.app.auctions.sponsored}`).then((res) => {
        SetSponsoredAuctions(res?.data?.data);
      })
    );
  }, [runMainAuctions, runSponsoredAuctions, search, user]);

  const [hasCompletedProfile, setHasCompletedProfile] = useLocalStorage(
    "hasCompletedProfile",
    false, // set the default value to false if no data is stored
    (val) => {
      try {
        return JSON.parse(val);
      } catch (e) {
        console.error("Error parsing stored data", e);
        return false; // return false if there is an error parsing the stored data
      }
    }
  );

  const handelCreatOuction = () => {
    if (user) {
      if (hasCompletedProfile) {
        history.push(routes.app.createAuction.productDetails);
      } else setOpen(true);
    } else dispatch(Open());
  };

  return (
    <div className="lg:mt-36 md:mt-32 mt-24 py-6 home">
      <Dimmer
        className="animate-pulse fixed w-full h-full top-0"
        active={isLoadingMainAuctions || isLoadingrunSponsoredAuctions}
        inverted
      >
        <Loader active />
      </Dimmer>
      <div className="z-20 lg:h-[561px] md:h-[350px] h-[200px]">
        <ImageSlider
          myRef={myRef}
          images={sponsoredAuctions?.map((img) => img?.product?.images)}
          slidesData={sponsoredAuctions}
        />
      </div>
      <div className="pt-32 text-center">
        <h1 ref={myRef} className="text-gray-dark text-base font-bold">
          Popular Categories
        </h1>
        <p className="text-gray-med text-base font-normal">
          Lorem ipsum dolor sit amet, consetetur<br></br> sadipscing elitr, sed
          diam nonumy eirmod
        </p>
      </div>
      <div className="mt-11 mb-20">
        <SliderRow />
      </div>
      <h6 className="max-w-[1440px] mx-auto pb-4 text-gray-med text-base font-normal">
        {mainAuctions?.length} Results
      </h6>
      <div className="flex gap-3 max-w-[1440px] lg:mx-auto md:mx-12">
        {/* left filter sections */}
        <FilterSections myRef={myRef} />
        {/* right card sections */}
        <div className="lg:grid lg:grid-cols-4 md:flex lg:flex-nowrap md:flex-wrap gap-5 h-fit mx-auto">
          {mainAuctions?.map((e) => (
            <AuctionCard
              auctionId={e?.id}
              price={e?.acceptedAmount || e?.startBidAmount}
              title={e?.product?.title}
              status={e?.status}
              adsImg={e?.product?.images[0].imageLink}
              totalBods={15}
              WatshlistState={e?.isSaved}
              endingTime={e?.expiryDate}
              isBuyNowAllowed={e?.isBuyNowAllowed}
              isMyAuction={e?.isMyAuction}
            />
          ))}
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
          Create Auction Now
        </button>
        <button
          onClick={() => handelCreatOuction()}
          className="w-[128px] h-[32px] text-base font-normal bg-primary hover:bg-primary-dark rounded-lg text-white absolute bottom-[60px] right-[25px] md:hidden block"
        >
          Create Auction
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

      <AddLocationModel open={open} setOpen={setOpen} TextButton={"Proceed"} />
    </div>
  );
};

export default Home;
