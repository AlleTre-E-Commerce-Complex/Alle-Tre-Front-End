import api from 'api';
import axios from 'axios';
import { authAxios } from 'config/axios-config';
import { useAuthState } from 'context/auth-context';
import { useLanguage } from 'context/language-context';
import useAxios from 'hooks/use-axios';
import content from 'localization/content';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';
import AnglesRight from "../../../src/assets/icons/arrow-right.svg";
import AnglesLeft from "../../../src/assets/icons/arrow-left.svg";
import Swiper from 'swiper';
import { Dimmer, Loader } from 'semantic-ui-react';
import LodingTestAllatre from 'component/shared/lotties-file/loding-test-allatre';
import AuctionCard from './auction-card';

const ListedProducts = () => {
    
  const { search } = useLocation();
  const { user } = useAuthState();
  const [lang] = useLanguage("");

  const selectedContent = content[lang];
 
  const { run: runListedProduct, isLoading: isLoadingListedProduct } = useAxios([]);

  const [listedProducts, setListedProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(20);

  const swiperOptions = {
    cssMode: true,
    speed: 1000,
    navigation: {
      nextEl: `.swiper-next`,
      prevEl: `.swiper-prev`,
    },
    slidesPerView: "auto",
    mousewheel: true,
    keyboard: true,
  };

  const loginData = useSelector((state) => state?.loginDate?.loginDate);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
      if (user) {
        runListedProduct(
          authAxios
            .get(`${api.app.productListing.getAllListedProducts}?page=1&perPage=${page}`)
            .then((res) => {
                console.log('listed products :', res)
              setListedProducts(res?.data?.data);
              setPagination(res?.data?.pagination);
            })
        );
      } else {
        runListedProduct(
          axios
            .get(`${api.app.productListing.getAllListedProducts}?page=1&perPage=${page}`)
            .then((res) => {
              setListedProducts(res?.data?.data);
              setPagination(res?.data?.pagination);
            })
        );
      }
  }, [page, runListedProduct, search, user]);
  const swiperRef1 = useRef(null);
  const swiper1 = new Swiper(swiperRef1?.current, { ...swiperOptions });

  useEffect(() => {
    return () => {
      swiper1?.destroy();
    };
  }, []);

  const handleNextClick = () => {
    if (pagination?.totalItems > pagination?.perPage) {
      swiper1?.slideNext();
      setPage(page + 5);
    } else swiper1?.slideNext();
  };

  const handlePrevClick = () => {
    swiper1?.slidePrev();
  };

  return (
    <div>
      <div className="text-center">
        <h1 className="text-gray-dark text-base font-bold">
          {/* {selectedContent[localizationKeys.liveAuction]} */}
          Listed Product
        </h1>
        <p className="text-gray-med text-base font-normal pb-10">
          {/* {selectedContent[localizationKeys.BidWinRepeat]} */}
          Find and Reach the Product
        </p>
      </div>
      {listedProducts?.length === 0 ? (
        <div>
          {/* <img
            className="w-full h-full object-cover rounded-2xl shadow"
            src={liveEmty}
            alt="liveEmty"
          /> */}
          {/* <BannerSingle />   */}
        </div>
      ) : (
        <div className="ezd-content  relative ">
          <Dimmer className=" bg-" active={isLoadingListedProduct} inverted>
            <Loader active />
            <LodingTestAllatre />
          </Dimmer>
          <div className="ezd-snapslider pt-10">
            <div className="snapslider-wrapper">
              <div ref={swiperRef1} className={`snapslider-overflow `}>
                <div
                  className={`${
                    listedProducts?.length > 4
                      ? ""
                      : "md:justify-center justify-start"
                  } snapslider-scroll swiper-wrapper py-2`}
                >
                  {listedProducts?.map((e) => (
                    <div className="snapslider-card swiper-slide">
                      <AuctionCard
                        className="min-w-[272px]"
                        auctionId={e?.id}
                        price={e?.startBidAmount || e?.acceptedAmount}
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
      )}
    </div>
  );
}

export default ListedProducts
