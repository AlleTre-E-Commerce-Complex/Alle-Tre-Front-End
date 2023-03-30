import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import api from "../../../api";
import AuctionCard from "../../../components/home-components/auction-card";
import AuctionFilterCard from "../../../components/home-components/auction-filter-card";

import ImageSlider from "../../../components/home-components/image-slider";
import { SliderData } from "../../../components/home-components/imge-data";
import SliderRow from "../../../components/shared/slider-categories/slider-row";
import useAxios from "../../../hooks/use-axios";
import useGetALLBrand from "../../../hooks/use-get-all-brands";
import useGetGatogry from "../../../hooks/use-get-category";

const Home = () => {
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { AllBranOptions, loadingAllBranOptions } = useGetALLBrand();

  console.log("====================================");
  console.log(GatogryOptions.map((CategoryName) => CategoryName?.text));
  console.log("====================================");
  const [mainAuctions, setMainAuctions] = useState();

  const { run: runMainAuctions, isLoading: isLoadingMainAuctions } = useAxios(
    []
  );
  useEffect(() => {
    runMainAuctions(
      axios.get(api.app.auctions.getMain).then((res) => {
        setMainAuctions(res?.data?.data);
      })
    );
  }, [runMainAuctions]);

  console.log("====================================");
  console.log(mainAuctions);
  console.log("====================================");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="lg:mt-36 md:mt-32 mt-24 py-6 home">
      <Dimmer className="animate-pulse" active={isLoadingMainAuctions} inverted>
        <Loader active />
      </Dimmer>
      <div className="z-20 ">
        <ImageSlider slides={SliderData} />
      </div>
      <div className="mt-56 text-center">
        <h1 className="text-gray-dark text-base font-bold">
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
      <div className="flex gap-x-5 max-w-[1366px] mx-auto">
        {/* left filter sections */}
        <div className="flex flex-col gap-y-8">
          <AuctionFilterCard
            title={"Categories"}
            seeAll={GatogryOptions?.length}
            name="test"
            values={GatogryOptions?.map((CategoryName) => ({
              name: CategoryName?.text,
              value: CategoryName?.text,
            })).filter(Boolean)}
          />
          <AuctionFilterCard
            title={"Brand"}
            seeAll={AllBranOptions?.length}
            name="test"
            values={AllBranOptions?.map((CategoryName) => ({
              name: CategoryName?.text,
              value: CategoryName?.text,
            })).filter(Boolean)}
          />
        </div>
        {/* right card sections */}
        <div className="grid grid-cols-3 gap-5 h-fit">
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
