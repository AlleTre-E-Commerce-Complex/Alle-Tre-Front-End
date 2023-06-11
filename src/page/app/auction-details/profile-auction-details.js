import React, { useState, useEffect } from "react";

import api from "../../../api";
import { useParams } from "react-router-dom";
import useAxios from "../../../hooks/use-axios";
import { authAxios, axios } from "../../../config/axios-config";

import { Dimmer, Loader } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";

import ImgSlider from "../../../components/shared/img-slider/img-slider";
import {
  AuctionDetailsBreadcrumb,
  AuctionHomeDetailsBreadcrumb,
} from "../../../components/shared/bread-crumb/Breadcrumb";
import SummaryAuctionSections from "../../../components/auctions-details-components/summary-auction-sections";
import AuctionDetailsTabs from "../../../components/auctions-details-components/auction-details-tabs";
import { useAuthState } from "../../../context/auth-context";
import { useSelector } from "react-redux";

const ProfileAuctionDetails = ({ isMyAuction }) => {
  const { user } = useAuthState();
  const [lang] = useLanguage();
  const [activeIndexTab, setActiveIndexTab] = useState(0);
  const [auctionsDetailsData, setAuctionsDetailsData] = useState({});
  const { auctionId } = useParams();
  const { run, isLoading } = useAxios([]);
  const loginData = useSelector((state) => state?.loginDate?.loginDate);
  useEffect(() => {
    if (user)
      run(
        authAxios
          .get(api.app.auctions.getAuctionsDetails(auctionId))
          .then((res) => {
            setAuctionsDetailsData(res?.data?.data);
          })
      );
    run(
      axios.get(api.app.auctions.getAuctionsDetails(auctionId)).then((res) => {
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
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-[1440px] mx-auto h-14 px-4 py-4 sm:block hidden ">
          {isMyAuction ? (
            <AuctionDetailsBreadcrumb details={auctionId} />
          ) : (
            <AuctionHomeDetailsBreadcrumb details={auctionId} />
          )}
        </div>
        {/* up sections */}
        <div>
          <h1 className="text-black font-medium text-2xl py-4">
            {auctionsDetailsData?.product?.title}
          </h1>
          <div className="grid md:grid-cols-2 grid-cols-1">
            <div className="">
              <ImgSlider
                images={auctionsDetailsData?.product?.images}
                auctionId={auctionsDetailsData?.id}
                WatshlistState={auctionsDetailsData?.isSaved}
                isMyAuction={auctionsDetailsData?.isMyAuction}
              />
            </div>
            <div className="ltr:sm:ml-12 rtl:sm:mr-12 ltr:ml-4 rtl:mr-4 mt-10 md:mt-0">
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
                endingPrice={auctionsDetailsData?.latestBidAmount}
                totalBids={auctionsDetailsData?._count?.bids}
                endingTime={auctionsDetailsData?.expiryDate}
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
