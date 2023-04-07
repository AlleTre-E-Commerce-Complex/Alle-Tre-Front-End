import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import api from "../../../api";
import AuctionCard from "../../../components/home-components/auction-card";
import AuctionFilterCard from "../../../components/home-components/auction-filter-card";
import AuctionFilterCardList from "../../../components/home-components/auction-filter-card-list";

import ImageSlider from "../../../components/home-components/image-slider";
import SliderRow from "../../../components/shared/slider-categories/slider-row";
import { authAxios } from "../../../config/axios-config";
import { useAuthState } from "../../../context/auth-context";
import useAxios from "../../../hooks/use-axios";
import useGetALLBrand from "../../../hooks/use-get-all-brands";
import useGetAllCountries from "../../../hooks/use-get-all-countries";
import useGetGatogry from "../../../hooks/use-get-category";

const Home = () => {
  const { search } = useLocation();
  const history = useHistory();
  const { user } = useAuthState();
  const myRef = useRef();
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { AllBranOptions, loadingAllBranOptions } = useGetALLBrand();
  const { AllCountriesOptions, loadingAllCountries } = useGetAllCountries();

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

  return (
    <div className="lg:mt-36 md:mt-32 mt-24 py-6 home">
      <Dimmer className="animate-pulse" active={isLoadingMainAuctions} inverted>
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
      <div className="flex gap-5 max-w-[1440px] lg:mx-auto md:mx-12">
        {/* left filter sections */}
        <div className="flex flex-col gap-y-5">
          <AuctionFilterCardList
            title={"Categories"}
            seeAll={GatogryOptions?.length}
            name="categories"
            values={GatogryOptions?.map((CategoryName) => ({
              name: CategoryName?.text,
              value: `${CategoryName?.value}`,
            })).filter(Boolean)}
            myRef={myRef}
          />
          <AuctionFilterCardList
            title={"Brand"}
            seeAll={AllBranOptions?.length}
            name="brands"
            values={AllBranOptions?.map((brandName) => ({
              name: brandName?.text,
              value: `${brandName?.value}`,
            })).filter(Boolean)}
            myRef={myRef}
          />
          <AuctionFilterCard
            title={"Selling Type"}
            seeAll={2}
            name="sellingType"
            values={[
              { name: "Auction", value: "Auction" },
              { name: "Buy Now", value: "Buy_Now" },
            ].filter(Boolean)}
            myRef={myRef}
          />
          <AuctionFilterCard
            title={"Auction state"}
            seeAll={2}
            name="auctionStatus"
            values={[
              { name: "Coming soon", value: "IN_SCHEDULES" },
              { name: "Live Auction", value: "ACTIVE" },
            ].filter(Boolean)}
            myRef={myRef}
          />
          <AuctionFilterCardList
            title={"Location"}
            seeAll={AllCountriesOptions?.length}
            name="countries"
            values={AllCountriesOptions?.map((countryName) => ({
              name: countryName?.text,
              value: `${countryName?.value}`,
            })).filter(Boolean)}
            myRef={myRef}
          />
          <AuctionFilterCardList
            title={"Condition"}
            seeAll={3}
            name="usageStatus"
            values={[
              { name: "New", value: "NEW" },
              { name: "Used", value: "USED" },
              { name: "Open Box", value: "OPEN_BOX" },
            ].filter(Boolean)}
            myRef={myRef}
          />
        </div>
        {/* right card sections */}
        <div className="lg:grid lg:grid-cols-4 md:flex lg:flex-nowrap md:flex-wrap gap-5 h-fit mx-auto">
          {mainAuctions?.map((e) => (
            <AuctionCard
              auctionId={e?.id}
              price={e?.acceptedAmount}
              title={e?.product?.title}
              status={e?.status}
              adsImg={e?.product?.images[0].imageLink}
              totalBods={15}
              WatshlistState={e?.isSaved}
              endingTime={e?.expiryDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
