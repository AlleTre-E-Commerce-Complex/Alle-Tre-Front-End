import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Dimmer } from "semantic-ui-react";
import Swiper from "swiper";
import AnglesLeft from "../../../src/assets/icons/angles-left-icon.png";
import AnglesRight from "../../../src/assets/icons/angles-right-icon.png";
import api from "../../api";
import { authAxios } from "../../config/axios-config";
import { useAuthState } from "../../context/auth-context";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";
import content from "../../localization/content";
import AuctionCard from "../home-components/auction-card";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";
import "./auctions-slider.scss";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const SilmilarProductsSlider = ({ categoriesId }) => {
  const [lang] = useLanguage("");
  const { auctionId } = useParams();

  const selectedContent = content[lang];
  const { search } = useLocation();
  const { user } = useAuthState();

  const { run: runAuctions, isLoading: isLoadingAuctions } = useAxios([]);

  const [auctions, setAuctions] = useState();
  const [pagination, setpagination] = useState();
  const [page, setPage] = useState(20);
  const loginData = useSelector((state) => state?.loginDate?.loginDate);
  useEffect(() => {
    if (categoriesId)
      if (user) {
        runAuctions(
          authAxios
            .get(`${api.app.auctions.SimilarAuctions(auctionId)}`)
            .then((res) => {
              setAuctions(res?.data?.data);
              setpagination(res?.data?.pagination);
            })
        );
      } else {
        runAuctions(
          axios
            .get(`${api.app.auctions.SimilarAuctions(auctionId)}`)
            .then((res) => {
              setAuctions(res?.data?.data);
              setpagination(res?.data?.pagination);
            })
        );
      }
  }, [categoriesId, page, runAuctions, user]);

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

  const swiperRef6 = useRef(null);
  const swiper6 = new Swiper(swiperRef6?.current, { ...swiperOptions });

  useEffect(() => {
    return () => {
      swiper6 && swiper6?.destroy();
    };
  }, []);

  const handleNextClick = () => {
    if (pagination?.totalItems > pagination?.perPage) {
      swiper6?.slideNext();
      setPage(page + 5);
    } else swiper6?.slideNext();
  };

  const handlePrevClick = () => {
    swiper6?.slidePrev();
  };
  return (
    <div
      className={auctions?.length === 0 ? "hidden" : "ezd-content relative  "}
    >
      <div className="text-center">
        <h1 className="text-gray-dark text-base font-bold">Similar Products</h1>
        <p className="text-gray-med text-base font-normal">
          Explore Related Find
        </p>
      </div>
      <Dimmer className=" bg-white/50" active={isLoadingAuctions} inverted>
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="ezd-snapslider pt-10">
        <div className="snapslider-wrapper">
          <div ref={swiperRef6} className={`snapslider-overflow`}>
            <div
              className={`${
                auctions?.length > 4 ? "" : "md:justify-center justify-start"
              } snapslider-scroll swiper-wrapper py-2`}
            >
              {auctions?.map((e) => (
                <div className="snapslider-card swiper-slide">
                  <AuctionCard
                    className="min-w-[272px]"
                    auctionId={e?.id}
                    price={e?.acceptedAmount || e?.startBidAmount}
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

export default SilmilarProductsSlider;
