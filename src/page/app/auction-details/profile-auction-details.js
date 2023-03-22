import React, { useState, useEffect } from "react";

import api from "../../../api";
import { useParams } from "react-router-dom";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";

import { Dimmer, Loader } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";

import ImgSlider from "../../../components/shared/img-slider/img-slider";
import { AuctionDetailsBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import SummaryAuctionSections from "../../../components/auctions-details-components/summary-auction-sections";
import AuctionDetailsTabs from "../../../components/auctions-details-components/auction-details-tabs";

const ProfileAuctionDetails = () => {
  const [lang] = useLanguage();
  const [activeIndexTab, setActiveIndexTab] = useState(0);
  const [auctionsDetailsData, setAuctionsDetailsData] = useState({});
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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mt-44 animate-in mx-5 ">
      <Dimmer className="animate-pulse" active={isLoading} inverted>
        <Loader active />
      </Dimmer>
      <div className="max-w-[1366px] mx-auto">
        <div className="max-w-[1366px] mx-auto h-14 px-4 py-4 sm:block hidden ">
          <AuctionDetailsBreadcrumb details={auctionId} />
        </div>
        {/* up sections */}
        <div>
          <h1 className="text-black font-medium text-2xl py-4">
            {auctionsDetailsData?.product?.title}
          </h1>
          <div className="grid grid-cols-2">
            <div className="">
              <ImgSlider images={auctionsDetailsData?.product?.images} />
            </div>
            <div className=" ml-12">
              <SummaryAuctionSections
                numberStare={3}
                totalReviews={20}
                description={auctionsDetailsData?.product?.description}
                category={
                  lang === "en"
                    ? auctionsDetailsData?.product?.category?.nameEn
                    : auctionsDetailsData?.product?.category?.nameAr
                }
                subCategory={
                  lang === "en"
                    ? auctionsDetailsData?.product?.subCategory?.nameEn
                    : auctionsDetailsData?.product?.subCategory?.nameAr
                }
                startingPrice={auctionsDetailsData?.startBidAmount}
                endingPrice={"42900"}
                totalBids={60}
                endingTime={"06:47pm 07 Feb 2023"}
                setActiveIndexTab={setActiveIndexTab}
                status={auctionsDetailsData?.status}
              />
            </div>
          </div>
        </div>
        {/* under sections */}
        <div className="mt-9">
          <AuctionDetailsTabs
            dataTabs={auctionsDetailsData}
            activeIndexTab={activeIndexTab}
            setActiveIndexTab={setActiveIndexTab}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileAuctionDetails;
