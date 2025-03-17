import React, { useState, useEffect } from "react";

import api from "../../../api";
import { useParams } from "react-router-dom";
import useAxios from "../../../hooks/use-axios";
import { authAxios, axios } from "../../../config/axios-config";

import { Dimmer, Loader } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";

import ImgSlider from "../../../component/shared/img-slider/img-slider";
import {
  AuctionDetailsBreadcrumb,
  AuctionHomeDetailsBreadcrumb,
} from "../../../component/shared/bread-crumb/Breadcrumb";
import SummaryAuctionSections from "../../../component/auctions-details-components/summary-auction-sections";
import AuctionDetailsTabs from "../../../component/auctions-details-components/auction-details-tabs";
import { useAuthState } from "../../../context/auth-context";
import { useSelector } from "react-redux";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";

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
            console.log('***---***>>> ',res.data.data)
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

  const images = auctionsDetailsData?.product?.images.filter(
    image => image.imagePath && !image.imagePath.toLowerCase().endsWith('.pdf')
  );
  const relatedDocuments = auctionsDetailsData?.product?.images.filter(
    image => image.imagePath && image.imagePath.toLowerCase().endsWith('.pdf')
  );

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="mt-44 animate-in mx-5 ">
        <div className="px-4 mx-auto">
          <div className="px-4 mx-auto h-14 px-4 py-4 sm:block hidden ">
            <AuctionDetailsBreadcrumb details={auctionId} />
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
                  isMyAuction={true}
                  isListProduct={false}
                />
              </div>
              <div className="ltr:sm:ml-12 rtl:sm:mr-12 ltr:ml-4 rtl:mr-4 mt-10 md:mt-0">
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
                  startingTime={auctionsDetailsData?.startDate}
                  endingPrice={auctionsDetailsData?.latestBidAmount}
                  totalBids={auctionsDetailsData?._count?.bids}
                  endingTime={auctionsDetailsData?.expiryDate}
                  setActiveIndexTab={setActiveIndexTab}
                  status={auctionsDetailsData?.status}
                  relatedDocument={relatedDocuments}
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
    </>
  );
};

export default ProfileAuctionDetails;
