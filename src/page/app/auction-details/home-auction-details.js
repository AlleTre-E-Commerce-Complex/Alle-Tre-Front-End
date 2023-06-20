import React, { useState, useEffect } from "react";

import api from "../../../api";
import { useParams } from "react-router-dom";
import useAxios from "../../../hooks/use-axios";

import { Dimmer, Loader } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";

import ImgSlider from "../../../components/shared/img-slider/img-slider";
import {
  AuctionHomeDetailsBreadcrumb,
  MyBidsBreadcrumb,
} from "../../../components/shared/bread-crumb/Breadcrumb";

import AuctionDetailsTabs from "../../../components/auctions-details-components/auction-details-tabs";
import SummaryAuctionSections from "../../../components/auctions-details-components/summary-auction-sections";
import SummaryHomeAuctionSections from "../../../components/auctions-details-components/summary-home-auction-sections";
import { useAuthState } from "../../../context/auth-context";
import { authAxios, axios } from "../../../config/axios-config";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import routes from "../../../routes";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import SilmilarProductsSlider from "../../../components/auctions-details-components/silmilar-products-slider";

const HomeAuctionDetails = () => {
  const { user } = useAuthState();
  const [lang] = useLanguage();
  const [activeIndexTab, setActiveIndexTab] = useState(0);
  const [auctionsDetailsData, setAuctionsDetailsData] = useState({});
  const { auctionId } = useParams();
  const { run, isLoading } = useAxios([]);
  const { pathname } = useLocation();

  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  useEffect(() => {
    if (user) {
      run(
        authAxios
          .get(api.app.auctions.getUserAuctionsDetails(auctionId))
          .then((res) => {
            setAuctionsDetailsData(res?.data?.data);
          })
      );
    } else {
      run(
        axios
          .get(api.app.auctions.getUserAuctionsDetails(auctionId))
          .then((res) => {
            setAuctionsDetailsData(res?.data?.data);
          })
      );
    }
  }, [auctionId, run, user, forceReload]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="mt-44 animate-in mx-5 ">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-[1440px] mx-auto h-14 px-4 py-4 sm:block hidden ">
            {pathname.startsWith(routes.app.home) ? (
              <AuctionHomeDetailsBreadcrumb details={auctionId} />
            ) : (
              <MyBidsBreadcrumb details={auctionId} />
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
                {auctionsDetailsData?.isMyAuction ? (
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
                ) : (
                  <SummaryHomeAuctionSections
                    bidderDepositFixedAmount={
                      auctionsDetailsData?.product?.category
                        ?.bidderDepositFixedAmount
                    }
                    isDepositPaid={auctionsDetailsData?.isDepositPaid || false}
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
                    TimeLeft={auctionsDetailsData?.expiryDate}
                    startBidAmount={auctionsDetailsData?.startBidAmount}
                    StartDate={auctionsDetailsData?.startDate}
                    CurrentBid={auctionsDetailsData?.latestBidAmount}
                    totalBids={auctionsDetailsData?._count?.bids}
                    setActiveIndexTab={setActiveIndexTab}
                    status={auctionsDetailsData?.status}
                    auctionsID={auctionsDetailsData?.id}
                    isBuyNowAllowed={auctionsDetailsData?.isBuyNowAllowed}
                    acceptedAmount={auctionsDetailsData?.acceptedAmount}
                    latestBidAmount={auctionsDetailsData?.latestBidAmount}
                    onReload={onReload}
                    // TODO add PurchasedTime
                    PurchasedTime={""}
                  />
                )}
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
        <div className="max-w-[1440px] mx-auto ">
          <SilmilarProductsSlider
            categoriesId={auctionsDetailsData?.product?.category?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeAuctionDetails;
