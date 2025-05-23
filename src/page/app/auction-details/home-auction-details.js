import React, { useState, useEffect } from "react";

import api from "../../../api";
import { useParams } from "react-router-dom";
import useAxios from "../../../hooks/use-axios";

import { Dimmer } from "semantic-ui-react";
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

// Move getShareImage function outside of component
const getShareImage = (imageUrl) => {
  if (!imageUrl) {
    return "https://www.alletre.com/logo512.png";
  }
  // Remove any query parameters for cleaner URL
  const baseUrl = imageUrl.split("?")[0];
  // Add back only the necessary Firebase parameters
  const firebaseParams = imageUrl.includes("firebase")
    ? `?alt=media&token=${imageUrl.split("token=")[1]}`
    : "";
  return baseUrl + firebaseParams;
};

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

  const images = auctionsDetailsData?.product?.images.filter(
    (image) =>
      image.imagePath && !image.imagePath.toLowerCase().endsWith(".pdf")
  );
  const relatedDocuments = auctionsDetailsData?.product?.images.filter(
    (image) => image.imagePath && image.imagePath.toLowerCase().endsWith(".pdf")
  );

  // Get the main image URL for sharing
  const mainImageUrl = auctionsDetailsData?.product?.images?.[0]?.imageLink;
  const shareImageUrl = getShareImage(mainImageUrl);

  // Function to determine image type from URL
  const getImageType = (url) => {
    if (!url) return "image/png"; // default for logo
    if (
      url.toLowerCase().includes(".jpg") ||
      url.toLowerCase().includes(".jpeg")
    )
      return "image/jpeg";
    if (url.toLowerCase().includes(".png")) return "image/png";
    if (url.toLowerCase().includes(".gif")) return "image/gif";
    if (url.toLowerCase().includes(".webp")) return "image/webp";
    return "image/jpeg"; // default for unknown
  };

  const calculateSecurityDeposit = (auction, auctionCategory) => {
    const categoryName = auctionCategory?.nameEn;

    //calculate the seller security deposite
    const startBidAmount = auction?.startBidAmount;
    let amount = Number(auctionCategory?.bidderDepositFixedAmount);
    //checking whether the auction is luxuary or not
    if (
      auctionCategory?.luxuaryAmount &&
      Number(startBidAmount) > Number(auctionCategory?.luxuaryAmount)
    ) {
      let total;
      //calculating the security deposite
      total = Number(
        (Number(startBidAmount) *
          Number(auctionCategory?.percentageOfLuxuarySD_forBidder)) /
        100
      );

      if (categoryName === "Cars" || categoryName === "Properties") {
        total = Number(
          ((auctionsDetailsData?.latestBidAmount
            ? auctionsDetailsData?.latestBidAmount
            : Number(startBidAmount)) *
            Number(auctionCategory?.percentageOfLuxuarySD_forBidder)) /
          100
        );
      }
      //checking the total is less than minimum security deposite
      if (
        auctionCategory?.minimumLuxuarySD_forBidder &&
        total < Number(auctionCategory?.minimumLuxuarySD_forBidder)
      ) {
        amount = Number(auctionCategory?.minimumLuxuarySD_forBidder);
      } else {
        amount = total;
      }
    }
    return amount;
  };
  return (
    <div>
      <Helmet prioritizeSeoTags={true}>
        {/* Base tags */}
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

        {/* Open Graph / Facebook - Explicitly provided first */}
        <meta property="og:image" content={shareImageUrl} key="og:image" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Alletre" />
        <meta
          property="og:url"
          content={`https://www.alletre.com${pathname}`}
        />
        <meta
          property="og:title"
          content={
            auctionsDetailsData?.product?.title || "Auction Details - Alletre"
          }
        />
        <meta
          property="og:description"
          content={
            auctionsDetailsData?.product?.description ||
            "Explore our latest auction details on Alletre."
          }
        />
        <meta property="og:image:secure_url" content={shareImageUrl} />
        <meta property="og:image:type" content={getImageType(mainImageUrl)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content={auctionsDetailsData?.product?.title || "Alletre Auction"}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@alletre" />
        <meta name="twitter:creator" content="@alletre" />
        <meta
          name="twitter:url"
          content={`https://www.alletre.com${pathname}`}
        />
        <meta
          name="twitter:title"
          content={
            auctionsDetailsData?.product?.title || "Auction Details - Alletre"
          }
        />
        <meta
          name="twitter:description"
          content={
            auctionsDetailsData?.product?.description ||
            "Explore our latest auction details on Alletre."
          }
        />
        <meta name="twitter:image" content={shareImageUrl} />
        <meta
          name="twitter:image:alt"
          content={auctionsDetailsData?.product?.title || "Alletre Auction"}
        />

        {/* Additional SEO */}
        <link rel="canonical" href={`https://www.alletre.com${pathname}`} />
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
          <div className="px-4 mx-auto h-14 px-4 py-4  ">
            {pathname.startsWith(routes.app.home) ? (
              <AuctionHomeDetailsBreadcrumb details={auctionId} category={lang === "en"
                ? auctionsDetailsData?.product?.category?.nameEn
                : auctionsDetailsData?.product?.category?.nameAr} 
                 categoryId={auctionsDetailsData?.product?.category?.id}
                />
            ) : (
              <MyBidsBreadcrumb details={auctionId} category={lang === "en"
                ? auctionsDetailsData?.product?.category?.nameEn
                : auctionsDetailsData?.product?.category?.nameAr} 
                categoryId={auctionsDetailsData?.product?.category?.id}
                />
            )}
          </div>
          {/* up sections */}
          <div>
            <div className="grid md:grid-cols-2 grid-cols-1">
              <div className="">
                <ImgSlider
                  // images={auctionsDetailsData?.product?.images}
                  images={images}
                  auctionId={auctionsDetailsData?.id}
                  WatshlistState={auctionsDetailsData?.isSaved}
                  isMyAuction={auctionsDetailsData?.isMyAuction}
                  isListProduct={false}
                  relatedDocument={relatedDocuments}
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
                    relatedDocuments={relatedDocuments}
                  />
                ) : (
                  <SummaryHomeAuctionSections
                    // bidderDepositFixedAmount={
                    //   auctionsDetailsData?.product?.category
                    //     ?.bidderDepositFixedAmount
                    // }
                    bidderDepositFixedAmount={calculateSecurityDeposit(
                      auctionsDetailsData,
                      auctionsDetailsData?.product?.category
                    )}
                    isDepositPaid={auctionsDetailsData?.isDepositPaid || false}
                    numberStare={3}
                    totalReviews={20}
                    title={auctionsDetailsData?.product?.title}
                    description={auctionsDetailsData?.product?.description}
                    categoryData={auctionsDetailsData?.product?.category}
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
                    userName={auctionsDetailsData?.user?.userName}
                    userId={auctionsDetailsData?.user?.id}
                    userPhone={auctionsDetailsData?.user?.phone}
                    userImage={auctionsDetailsData?.user?.imageLink}
                    usageStatus={auctionsDetailsData?.product?.usageStatus}
                    relatedDocuments={relatedDocuments}
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
