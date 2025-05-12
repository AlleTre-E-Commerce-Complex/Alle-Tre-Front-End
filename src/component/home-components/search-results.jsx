import React from 'react';
import { useLanguage } from '../../context/language-context';
import content from '../../localization/content';
import localizationKeys from '../../localization/localization-keys';
import AuctionCard from './auction-card';
import ProductCard from './ProductCard';

const SearchResults = ({ auctions, products, isLoading, searchQuery }) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  const filteredAuctions = auctions?.filter(auction => 
    auction?.product?.title?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  const filteredProducts = products?.filter(product => 
    product?.product?.title?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="loader"></div>
      </div>
    );
  }

  const hasResults = filteredAuctions?.length > 0 || filteredProducts?.length > 0;

  if (!hasResults) {
    return (
      <div className="w-full text-center py-8">
   
        <p className="text-gray-500 font-medium md:text-3xl text-xl mt-40">{selectedContent[localizationKeys.noResultsFound]}</p>
      </div>
    );
  }

  return (
    <div className="search-results-container p-4">
      {filteredAuctions?.length > 0 && (
        <div className="mb-8">
          <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
            {selectedContent[localizationKeys.trendingAuctions]}
          </h1>
          <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
            {filteredAuctions.map((e) => (
              <AuctionCard
                key={e?.id}
                auctionId={e?.id}
                price={e?.acceptedAmount || e?.startBidAmount}
                title={e?.product?.title}
                status={e?.status}
                adsImg={e?.product?.images}
                totalBods={e?._count?.bids}
                WatshlistState={e?.isSaved}
                endingTime={e?.expiryDate}
                StartDate={e?.startDate}
                isBuyNowAllowed={e?.isBuyNowAllowed}
                isMyAuction={e?.isMyAuction}
                latestBidAmount={e?.bids[0]?.amount}
                CurrentBid={e?.currentBid?.bidAmount}
                startBidAmount={e?.startBidAmount}
                usageStatus={e?.product?.usageStatus}
                category={e?.product?.categoryId}
              />
            ))}
          </div>
        </div>
      )}

      {filteredProducts?.length > 0 && (
        <div>
          <h1
            className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8"
          >
            {selectedContent[localizationKeys.listedProduct]}
          </h1>
          <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
            {filteredProducts.map((e) => (
              <ProductCard
                key={e?.id}
                price={e?.ProductListingPrice}
                adsImg={e?.product?.images}
                title={e?.product?.title}
                userId={e?.userId}
                id={e?.product?.id}
                city={
                  lang === "en"
                    ? e?.location?.city?.nameEn
                    : e?.location?.city?.nameEn
                }
                country={
                  lang === "en"
                    ? e?.location?.country?.nameEn
                    : e?.location?.country?.nameEn
                }
                createdAt={e?.createdAt}
                usageStatus={e?.product?.usageStatus}
                category={e?.product?.categoryId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
