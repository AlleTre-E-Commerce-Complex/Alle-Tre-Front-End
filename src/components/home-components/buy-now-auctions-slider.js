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

const BuyNowAuctionsSlider = () => {
  const { search } = useLocation();
  const { user } = useAuthState();

  const { run: runAuctions, isLoading: isLoadingAuctions } = useAxios([]);

  const [Auctions, setAuctions] = useState();
  const [pagination, setpagination] = useState();
  const [page, setPage] = useState(6);

  useEffect(() => {
    runAuctions(
      axios
        .get(`${api.app.auctions.getBuyNow}?page=1&perPage=${page}`)
        .then((res) => {
          setAuctions(res?.data?.data);
          setpagination(res?.data?.pagination);
        })
    );
  }, [page, runAuctions, search, user]);

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
    <div className="ezd-content relative">
      <div className="text-center">
        <h1 className="text-gray-dark text-base font-bold">Buy Now</h1>
        <p className="text-gray-med text-base font-normal">
          Lorem ipsum dolor sit amet, consetetur
        </p>
      </div>
      <Dimmer className="animate-pulse " active={isLoadingAuctions} inverted>
        <Loader active />
      </Dimmer>
      <div className="ezd-snapslider pt-10">
        <div className="snapslider-wrapper">
          <div ref={swiperRef2} className={`snapslider-overflow`}>
            <div className={`snapslider-scroll swiper-wrapper py-2`}>
              {Auctions?.map((e) => (
                <div class="snapslider-card swiper-slide">
                  <AuctionCard
                    auctionId={e?.id}
                    price={e?.acceptedAmount}
                    title={e?.product?.title}
                    status={e?.status}
                    adsImg={e?.product?.images[0].imageLink}
                    totalBods={15}
                    WatshlistState={e?.isSaved}
                    endingTime={e?.expiryDate}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleNextClick}
              className={`swiper-button-next absolute top-1/2 -right-3`}
            >
              <img
                className="rounded-full bg-white cursor-pointer z-20 w-14 h-14 "
                src={AnglesRight}
                alt="AnglesRight"
              />
            </button>
            <button
              onClick={handlePrevClick}
              className={`swiper-button-prev absolute top-1/2 -left-5 `}
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