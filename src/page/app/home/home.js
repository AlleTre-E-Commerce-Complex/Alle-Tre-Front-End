import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Dimmer, Loader } from "semantic-ui-react";
import api from "../../../api";
import AuctionCard from "../../../components/home-components/auction-card";
import AuctionFilterCardList from "../../../components/home-components/auction-filter-card-list";
import AuctionFilterCard from "../../../components/home-components/auction-filter-card-list";

import ImageSlider from "../../../components/home-components/image-slider";
import { SliderData } from "../../../components/home-components/imge-data";
import SliderRow from "../../../components/shared/slider-categories/slider-row";
import useAxios from "../../../hooks/use-axios";
import useGetALLBrand from "../../../hooks/use-get-all-brands";
import useGetAllCountries from "../../../hooks/use-get-all-countries";
import useGetGatogry from "../../../hooks/use-get-category";
import routes from "../../../routes";

const Home = () => {
  const { search } = useLocation();
  const history = useHistory();
  const myRef = useRef();
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { AllBranOptions, loadingAllBranOptions } = useGetALLBrand();
  const { AllCountriesOptions, loadingAllCountries } = useGetAllCountries();

  const [mainAuctions, setMainAuctions] = useState();

  const { run: runMainAuctions, isLoading: isLoadingMainAuctions } = useAxios(
    []
  );
  useEffect(() => {
    runMainAuctions(
      axios.get(`${api.app.auctions.getMain}${search}`).then((res) => {
        setMainAuctions(res?.data?.data);
      })
    );
  }, [runMainAuctions, search]);

  return (
    <div className="lg:mt-36 md:mt-32 mt-24 py-6 home">
      <Dimmer className="animate-pulse" active={isLoadingMainAuctions} inverted>
        <Loader active />
      </Dimmer>
      <div className="z-20">
        <ImageSlider myRef={myRef} slides={SliderData} />
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
      <div className="flex flex-wrap gap-5 max-w-[1440px] mx-auto">
        {/* left filter sections */}
        <div className="flex flex-col gap-y-8">
          <AuctionFilterCard
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
          <AuctionFilterCardList
            title={"Selling Type"}
            seeAll={2}
            name="sellingType"
            values={[
              { name: "Auction", value: "Auction" },
              { name: "Buy Now", value: "Buy Now" },
            ].filter(Boolean)}
          />
        </div>
        {/* right card sections */}
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 h-fit">
          {mainAuctions?.map((e) => (
            <AuctionCard
              price={e?.acceptedAmount}
              title={e?.product?.title}
              status={e?.status}
              adsImg={e?.product?.images[0].imageLink}
              totalBods={15}
              endingTime={"02 days.05 hrs.02 min"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
