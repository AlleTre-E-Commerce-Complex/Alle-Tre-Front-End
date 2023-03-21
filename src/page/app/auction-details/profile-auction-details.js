import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import api from "../../../api";
import { AuctionDetailsBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import ImgSlider from "../../../components/shared/img-slider/img-slider";
import { authAxios } from "../../../config/axios-config";
import useAxios from "../../../hooks/use-axios";

const ProfileAuctionDetails = () => {
  const [auctionsDetailsData, setAuctionsDetailsData] = useState();
  const { auctionId } = useParams();
  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    run(
      authAxios
        .get(api.app.auctions.getAuctionsDetails(auctionId))
        .then((res) => {
          setAuctionsDetailsData(res?.data?.data);
        })
    );
  }, [auctionId, run]);

  console.log("====================================");
  console.log(auctionsDetailsData);
  console.log("====================================");

  return (
    <div className="mt-44 animate-in mx-5 ">
      <Dimmer className="animate-pulse" active={isLoading} inverted>
        <Loader active />
      </Dimmer>
      <div className="max-w-[1366px] mx-auto">
        <div className="max-w-[1366px] mx-auto h-14 px-4 py-4 sm:block hidden ">
          <AuctionDetailsBreadcrumb details={auctionId} />
        </div>
        <div>
          <h1 className="text-black font-medium text-2xl py-4">
            {auctionsDetailsData?.product?.title}
          </h1>
          <div className="grid grid-cols-2">
            <div className="bg-red-300 ">
              <ImgSlider images={auctionsDetailsData?.product?.images} />
            </div>
            <div className="bg-green-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAuctionDetails;
