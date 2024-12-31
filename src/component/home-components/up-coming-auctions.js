import React, { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import AnglesRight from "../../../src/assets/icons/angles-right-icon.png";
import AnglesLeft from "../../../src/assets/icons/angles-left-icon.png";
import "./auctions-slider.scss";
import AuctionCard from "./auction-card";
import { useLocation } from "react-router-dom";
import { useAuthState } from "../../context/auth-context";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import axios from "axios";
import api from "../../api";
import { Dimmer, Loader } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { useSelector } from "react-redux";
import upCompingEmty from "../../../src/assets/img/up-comping-emty-state.png";
import LodingTestAllatre from "component/shared/lotties-file/loding-test-allatre";
import BannerSingle from "./BannerSingle";

const UpComingAuctionsSlider = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { search } = useLocation();
  const { user } = useAuthState();
  const { run: runAuctions, isLoading: isLoadingAuctions } = useAxios([]);
  const [auctions, setAuctions] = useState();
  const [pagination, setPagination] = useState();
  const [page, setPage] = useState(20);
  const loginData = useSelector((state) => state?.loginDate?.loginDate);

  const swiperRef = useRef(null);
  const swiperInstance = useRef(null); // Ref to hold the Swiper instance

  useEffect(() => {
    if (search.includes("page") && search.includes("perPage") && user) {
      runAuctions(
        authAxios
          .get(`${api.app.auctions.getUpComming}?page=1&perPage=${page}`)
          .then((res) => {
            setAuctions(res?.data?.data);
            setPagination(res?.data?.pagination);
          })
      );
    } else {
      runAuctions(
        axios
          .get(`${api.app.auctions.getUpComming}?page=1&perPage=${page}`)
          .then((res) => {
            setAuctions(res?.data?.data);
            setPagination(res?.data?.pagination);
          })
      );
    }
  }, [page, runAuctions, search, user]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperInstance.current = new Swiper(swiperRef.current, {
        cssMode: true,
        speed: 1000,
        navigation: {
          nextEl: `.swiper-button-next`,
          prevEl: `.swiper-button-prev`,
        },
        slidesPerView: "auto",
        mousewheel: true,
        keyboard: true,
      });
    }

    return () => {
      // Cleanup: destroy Swiper instance if it exists
      if (swiperInstance.current) {
        swiperInstance.current.destroy(true, true);
        swiperInstance.current = null;
      }
    };
  }, [auctions]); // Re-run when auctions change to initialize Swiper correctly

  const handleNextClick = () => {
    if (pagination?.totalItems > pagination?.perPage) {
      swiperInstance.current?.slideNext();
      setPage((prevPage) => prevPage + 5);
    } else {
      swiperInstance.current?.slideNext();
    }
  };

  const handlePrevClick = () => {
    swiperInstance.current?.slidePrev();
  };

  return (
    <div>
      {auctions?.length > 0 && (
        <div className="text-center">
          <h1 className="text-gray-dark text-base font-bold">
            {selectedContent[localizationKeys.upComingAuctions]}
          </h1>
          <p className="text-gray-med text-base font-normal pb-10">
            {selectedContent[localizationKeys.ComingSoonGetReadytoBid]}
          </p>
        </div>
      )}
      {auctions?.length === 0 ? (
        <div>
          {/* <img
            className="w-full h-full object-cover rounded-2xl shadow"
            src={upCompingEmty}
            alt="upCompingEmty"
          /> */}
          <BannerSingle />
        </div>
      ) : (
        <div className="ezd-content relative">
          <Dimmer className="bg-white/50" active={isLoadingAuctions} inverted>
            <LodingTestAllatre />
          </Dimmer>
          <div className="ezd-snapslider pt-10">
            <div className="snapslider-wrapper">
              <div ref={swiperRef} className={`snapslider-overflow`}>
                <div
                  className={`${
                    auctions?.length > 4
                      ? ""
                      : "md:justify-center justify-start"
                  } snapslider-scroll swiper-wrapper py-2`}
                >
                  {auctions?.map((e) => (
                    <div key={e?.id} className="snapslider-card swiper-slide">
                      <AuctionCard
                        className="min-w-[272px]"
                        auctionId={e?.id}
                        startBidAmount={e?.startBidAmount || e?.acceptedAmount}
                        title={e?.product?.title}
                        status={e?.status}
                        adsImg={e?.product?.images[0].imageLink}
                        totalBods={e?._count?.bids}
                        WatshlistState={e?.isSaved}
                        endingTime={e?.expiryDate}
                        StartDate={e?.startDate}
                        isBuyNowAllowed={e?.isBuyNowAllowed}
                        isMyAuction={e?.isMyAuction}
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleNextClick}
                  className="swiper-button-next absolute top-1/2 -right-3"
                >
                  <img
                    className="rounded-full bg-white cursor-pointer z-20 w-14 h-14"
                    src={AnglesRight}
                    alt="AnglesRight"
                  />
                </button>
                <button
                  onClick={handlePrevClick}
                  className="swiper-button-prev absolute top-1/2 -left-5"
                >
                  <img
                    className="rounded-full bg-white cursor-pointer z-20 w-14 h-14"
                    src={AnglesLeft}
                    alt="AnglesLeft"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpComingAuctionsSlider;
