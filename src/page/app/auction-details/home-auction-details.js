import React, { useState, useEffect } from "react";

import api from "../../../api";
import { useParams } from "react-router-dom";
import useAxios from "../../../hooks/use-axios";

import { Dimmer, Loader } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";

import ImgSlider from "../../../component/shared/img-slider/img-slider";
import {
  AuctionHomeDetailsBreadcrumb,
  MyBidsBreadcrumb,
} from "../../../component/shared/bread-crumb/Breadcrumb";

import AuctionDetailsTabs from "../../../component/auctions-details-components/auction-details-tabs";
import SummaryAuctionSections from "../../../component/auctions-details-components/summary-auction-sections";
import SummaryHomeAuctionSections from "../../../component/auctions-details-components/summary-home-auction-sections";
import { useAuthState } from "../../../context/auth-context";
import { authAxios, axios } from "../../../config/axios-config";
// import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import routes from "../../../routes";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";
import SilmilarProductsSlider from "../../../component/auctions-details-components/silmilar-products-slider";
import useLocalStorage from "../../../hooks/use-localstorage";
import { Helmet } from "react-helmet-async";

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
  const [hasCompletedProfile, setHasCompletedProfile] = useLocalStorage(
    "hasCompletedProfile",
    ""
  );

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
  }, [auctionId, run, user, hasCompletedProfile]);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      <Helmet>
        <title>
          {auctionsDetailsData?.product?.title || "Auction Details - Alletre"}
        </title>
        <meta
          name="description"
          content={
            auctionsDetailsData?.product?.description ||
            "Explore our latest auction details on Alletre."
          }
        />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.alletre.com${pathname}`} />
        <meta property="og:title" content={auctionsDetailsData?.product?.title || "Auction Details - Alletre"} />
        <meta property="og:description" content={auctionsDetailsData?.product?.description || "Explore our latest auction details on Alletre."} />
        <meta property="og:site_name" content="Alletre" />
        
        {/* Ensure og:image is always explicitly provided */}
        <meta property="og:image" content={auctionsDetailsData?.product?.images?.[0]?.imageLink || "https://www.alletre.com/static/images/default-share.jpg"} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={auctionsDetailsData?.product?.title || "Alletre Auction"} />
        <meta property="og:image:type" content="image/jpeg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://www.alletre.com${pathname}`} />
        <meta name="twitter:title" content={auctionsDetailsData?.product?.title || "Auction Details - Alletre"} />
        <meta name="twitter:description" content={auctionsDetailsData?.product?.description || "Explore our latest auction details on Alletre."} />
        <meta name="twitter:image" content={auctionsDetailsData?.product?.images?.[0]?.imageLink || "https://www.alletre.com/static/images/default-share.jpg"} />
        <meta name="twitter:image:alt" content={auctionsDetailsData?.product?.title || "Alletre Auction"} />
      </Helmet>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="mt-44 animate-in mx-5 ">
        <div className="sm:px-4 px-0 mx-auto">
          <div className="px-4 mx-auto h-14 px-4 py-4 sm:block hidden ">
            {pathname.startsWith(routes.app.home) ? (
              <AuctionHomeDetailsBreadcrumb details={auctionId} />
            ) : (
              <MyBidsBreadcrumb details={auctionId} />
            )}
          </div>
          {/* up sections */}
          <div>
            <div className="grid md:grid-cols-2 grid-cols-1">
              <div className="">
                <ImgSlider
                  images={auctionsDetailsData?.product?.images}
                  auctionId={auctionsDetailsData?.id}
                  WatshlistState={auctionsDetailsData?.isSaved}
                  isMyAuction={auctionsDetailsData?.isMyAuction}
                  isListProduct={false}
                />
              </div>
              <div className="ltr:sm:ml-12 rtl:sm:mr-12 ltr:ml-4 rtl:mr-4 mt-10 md:mt-0">
                {auctionsDetailsData?.isMyAuction ? (
                  <SummaryAuctionSections
                    numberStare={3}
                    totalReviews={20}
                    title={auctionsDetailsData?.product?.title}
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
                    startingTime={auctionsDetailsData?.startDate}
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
                    title={auctionsDetailsData?.product?.title}
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
                    isOffer={auctionsDetailsData?.product?.isOffer}
                    onReload={onReload}
                    // TODO add PurchasedTime
                    PurchasedTime={""}
                    sellerLocation={auctionsDetailsData?.location}
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
        <div className="px-4 mx-auto ">
          <SilmilarProductsSlider
            categoriesId={auctionsDetailsData?.product?.category?.id}
            isListProduct={false}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(HomeAuctionDetails);
