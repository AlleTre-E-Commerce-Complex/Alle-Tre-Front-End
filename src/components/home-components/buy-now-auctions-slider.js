import React, { useEffect, useRef } from "react";
import Swiper from "swiper";
import AnglesRight from "../../../src/assets/icons/angles-right-icon.png";
import AnglesLeft from "../../../src/assets/icons/angles-left-icon.png";
import "./auctions-slider.scss";
import AuctionCard from "./auction-card";
import { useLocation } from "react-router-dom";
import { useAuthState } from "../../context/auth-context";
import useAxios from "../../hooks/use-axios";
import { useState } from "react";
import { authAxios } from "../../config/axios-config";
import axios from "axios";
import api from "../../api";
import { Dimmer, Loader } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { useSelector } from "react-redux";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const BuyNowAuctionsSlider = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { search } = useLocation();
  const { user } = useAuthState();

  const { run: runAuctions, isLoading: isLoadingAuctions } = useAxios([]);

  const [auctions, setAuctions] = useState();
  const [pagination, setpagination] = useState();
  const [page, setPage] = useState(20);
  const loginData = useSelector((state) => state?.loginDate?.loginDate);

  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
      if (user) {
        runAuctions(
          authAxios
            .get(`${api.app.auctions.getBuyNow}?page=1&perPage=${page}`)
            .then((res) => {
              setAuctions(res?.data?.data);
              setpagination(res?.data?.pagination);
            })
        );
      } else {
        runAuctions(
          axios
            .get(`${api.app.auctions.getBuyNow}?page=1&perPage=${page}`)
            .then((res) => {
              setAuctions(res?.data?.data);
              setpagination(res?.data?.pagination);
            })
        );
      }
  }, [page, runAuctions, search]);

  const swiperOptions = {
    cssMode: true,
    speed: 1000,
    navigation: {
      nextEl: `.swiper-button-next`,
      prevEl: `.swiper-button-prev`,
    },
    slidesPerView: "auto",
    mousewheel: true,
    keyboard: true,
  };

  const swiperRef2 = useRef(null);
  const swiper2 = new Swiper(swiperRef2?.current, { ...swiperOptions });

  useEffect(() => {
    return () => {
      swiper2?.destroy();
    };
  }, []);

  const handleNextClick = () => {
    if (pagination?.totalItems > pagination?.perPage) {
      swiper2?.slideNext();
      setPage(page + 5);
    } else swiper2?.slideNext();
  };

  const handlePrevClick = () => {
    swiper2?.slidePrev();
  };
  return (
    <div
      className={auctions?.length === 0 ? "hidden" : "ezd-content relative  "}
    >
      <div className="text-center">
        <h1 className="text-gray-dark text-base font-bold">
          {selectedContent[localizationKeys.buyNow]}
        </h1>
        <p className="text-gray-med text-base font-normal">
          Lorem ipsum dolor sit amet, consetetur
        </p>
      </div>
      <Dimmer className=" bg-white/50" active={isLoadingAuctions} inverted>
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="ezd-snapslider pt-10">
        <div className="snapslider-wrapper">
          <div ref={swiperRef2} className={`snapslider-overflow`}>
            <div
              className={`snapslider-scroll swiper-wrapper py-2 justify-center`}
            >
              {auctions?.map((e) => (
                <div className="snapslider-card swiper-slide">
                  <AuctionCard
                    auctionId={e?.id}
                    price={e?.acceptedAmount}
                    title={e?.product?.title}
                    status={e?.status}
                    adsImg={e?.product?.images[0].imageLink}
                    totalBods={e?._count?.bids}
                    WatshlistState={e?.isSaved}
                    endingTime={e?.expiryDate}
                    isBuyNowAllowed={e?.isBuyNowAllowed}
                    isMyAuction={e?.isMyAuction}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleNextClick}
              className={`swiper-button-next absolute top-1/2 -right-3 `}
            >
              <img
                className="rounded-full bg-white cursor-pointer z-20 w-14 h-14 "
                src={AnglesRight}
                alt="AnglesRight"
              />
            </button>
            <button
              onClick={handlePrevClick}
              className={`swiper-button-prev absolute top-1/2 -left-5  `}
            >
              <img
                className="rounded-full bg-white cursor-pointer z-20 w-14 h-14 "
                src={AnglesLeft}
                alt="AnglesLeft"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowAuctionsSlider;
