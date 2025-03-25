import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/use-axios";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../../component/shared/lotties-file/loding-test-allatre";
import userProfileicon from "../../../src/assets/icons/user-Profile-icon.png";
import AuctionCard from "component/home-components/auction-card";
import ProductCard from "component/home-components/ProductCard";
import { useLanguage } from "../../context/language-context";
import localizationKeys from "../../localization/localization-keys";
import content from "../../localization/content";

const UserDetailsPage = () => {
  const [activeProductData, setActiveProductData] = useState();
  const [activeAuctionData, setActiveAuctionData] = useState();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [activeTab, setActiveTab] = useState("auctions");
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const { run, isLoading: isLoadingMainAuctions } = useAxios([]);
  const { isLoading: isLoadingListedProduct } = useAxios([]);
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const username = searchParams.get("username");
  const userId = searchParams.get("id");
  const userImage = searchParams.get("imageLink");
  const userPhone = searchParams.get("phone");

  useEffect(() => {
    if (userId) {
      run(
        authAxios.get(`${api.app.auctions.getOtherUsersAuction(userId)}`)
      ).then((res) => {
        setActiveAuctionData(res?.data?.data);
        // setTotalPages(res?.data?.pagination?.totalPages);
      });
    }
  }, [username, run, forceReload]);

  useEffect(() => {
    if (userId) {
      run(
        authAxios.get(`${api.app.productListing.getOtherUserProducts(userId)}`)
      )
        .then((res) => {
          setActiveProductData(res?.data?.data);
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
        });
    }
  }, [username, run, forceReload]);

  if (!userId) {
    return (
      <div className="mt-40 pt-4">
        {selectedContent[localizationKeys.noUserSpecified]} 
      </div>
    );
  }

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingMainAuctions || isLoadingListedProduct || forceReload}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <div className="mt-40 pt-4 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Card */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-44">
              <div className="h-32 bg-gradient-to-r from-primary-dark via-primary to-primary-light relative">
                <div className="absolute -bottom-12 inset-x-0 flex justify-center">
                  <div className="ring-4 ring-white rounded-full">
                    <img
                      className="w-24 h-24 rounded-full object-cover"
                      src={userImage || userProfileicon}
                      alt="userProfileicon"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-14 pb-6 px-4">
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  {username}
                </h1>
                {userPhone && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 py-2 px-4 rounded-full">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-sm">{userPhone}</span>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-2">
                  <button
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      activeTab === "auctions"
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("auctions")}
                  >
                    {selectedContent[localizationKeys.activeAuctions]}
                  </button>
                  <button
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      activeTab === "products"
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("products")}
                  >
                    {selectedContent[localizationKeys.listedProducts]}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {activeTab === "auctions"
                  ? "Active Auctions"
                  : "Listed Products"}
              </h2>

              {activeTab === "auctions" && (
                <div className="space-y-6">
                  {activeAuctionData?.length > 0 ? (
                    <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
                      {activeAuctionData?.map((e) => (
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
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <svg
                          className="w-8 h-8 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">
                        {selectedContent[localizationKeys.noActiveAuctions]}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {
                          selectedContent[
                            localizationKeys.thisUserHasntPostedAnyAuctionsYet
                          ]
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "products" && (
                <div className="mb-8">
                  {activeProductData?.length > 0 ? (
                    <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-fit mx-auto w-full">
                      {activeProductData?.map((e) => (
                        <ProductCard
                          key={e?.id}
                          price={e?.ProductListingPrice}
                          title={e?.product?.title}
                          imageLink={e?.product?.images[0].imageLink}
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
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <svg
                          className="w-8 h-8 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">
                        {selectedContent[localizationKeys.noListedProducts]}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {
                          selectedContent[
                            localizationKeys.thisUserHasntListedAnyProductsYet
                          ]
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetailsPage;
