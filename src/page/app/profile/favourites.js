import React, { useEffect, useState } from "react";
import { Dimmer } from "semantic-ui-react";
import api from "../../../api";
import { authAxios } from "../../../config/axios-config";
import useAxios from "../../../hooks/use-axios";
import AuctionCard from "../../../component/home-components/auction-card";
import ProductCard from "../../../component/home-components/ProductCard";

import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import LoadingTest3arbon from "../../../component/shared/lotties-file/loading-test-3arbon";
import routes from "../../../routes";
import { useHistory } from "react-router-dom";
import { HiOutlineHeart } from "react-icons/hi";

const Favourites = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [favourites, setFavourites] = useState([]);
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const history = useHistory();
  const { run: runFavourites, isLoading: isLoadingFavourites } = useAxios([]);

  useEffect(() => {
    runFavourites(
      authAxios.get(`${api.app.WatchList.get}`).then((res) => {
        setFavourites(res?.data?.data || []);
      })
    );
  }, [runFavourites, forceReload]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingFavourites}
        inverted
      >
        <LoadingTest3arbon />
      </Dimmer>
      <div className="mx-4 ltr:ml-4 rtl:mr-4 md:ltr:ml-8 md:rtl:mr-8 animate-in">
        {favourites?.length === 0 ? (
          <div className="flex flex-col justify-center items-center min-h-[70vh] animate-in">
            <div className="text-center max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full" />
                <div className="flex items-center justify-center relative z-10 mx-auto w-32 h-32 rounded-full border-2 border-dashed border-gray dark:border-primary-light bg-transparent">
                  <HiOutlineHeart 
                    className="text-primary dark:text-primary-light w-16 h-16"
                    strokeWidth={1}
                  />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-14">
                {selectedContent[localizationKeys.thereAreNoFavouritesYet]}
              </h2>
              <button
                onClick={() => history.push(routes.app.home)}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                {selectedContent[localizationKeys.exploreCategories]}
              </button>
            </div>
          </div>
        ) : (
          <h1 className="text-gray-dark pb-14 pt-4 font-bold">
            {selectedContent[localizationKeys.yourFavourites]}
          </h1>
        )}
        <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full pb-5 animate-in ">
          {favourites?.map((e) => {
            if (e?.auction) {
              return (
                <AuctionCard
                  key={`auction-${e.auction.id}`}
                  auctionId={e?.auction?.id}
                  price={e?.auction?.acceptedAmount || e?.auction?.startBidAmount}
                  title={e?.auction?.product?.title}
                  status={e?.auction?.status}
                  adsImg={e?.auction?.product?.images}
                  totalBods={e?.auction?._count?.bids}
                  WatshlistState={true}
                  watshlistForceState={true}
                  endingTime={e?.auction?.expiryDate}
                  StartDate={e?.auction?.startDate}
                  isBuyNowAllowed={e?.auction?.isBuyNowAllowed}
                  isMyAuction={e?.auction?.isMyAuction}
                  onReload={onReload}
                  startBidAmount={e?.auction?.startBidAmount}
                  latestBidAmount={e?.auction?.bids?.[0]?.amount}
                  category={e?.auction?.product?.categoryId}
                />
              );
            } else if (e?.product) {
              return (
                <ProductCard
                  key={`product-${e.product.id}`}
                  id={e.product.id}
                  adsImg={e.product.images}
                  title={e.product.title}
                  price={e.product.ProductListingPrice}
                  usageStatus={e.product.usageStatus}
                  category={e.product.categoryId}
                  isSaved={true}
                  onReload={onReload}
                  // These might need to be passed if available in the relation
                  city={lang === "en" ? e.product.city?.nameEn : e.product.city?.nameAr}
                  country={lang === "en" ? e.product.country?.nameEn : e.product.country?.nameAr}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </>
  );
};

export default Favourites;
