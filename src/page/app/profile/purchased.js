import React, { useEffect, useState } from "react";
import { Dimmer } from "semantic-ui-react";
import api from "../../../api";
import { authAxios } from "../../../config/axios-config";
import useAxios from "../../../hooks/use-axios";
import AuctionCard from "../../../component/home-components/auction-card";
import EmtyWatchlist from "../../../../src/assets/icons/empty-watch-list.svg";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";

const Purchased = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [purchased, setpurchased] = useState();
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const { run: runWatshlist, isLoading: isLoadingWatshlist } = useAxios([]);
  useEffect(() => {
    runWatshlist(
      authAxios.get(`${api.app.profile.purchased}`).then((res) => {
        setpurchased(res?.data?.data);
      })
    );
  }, [runWatshlist, forceReload]);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingWatshlist}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="mx-4 ltr:ml-4 rtl:mr-4 md:ltr:ml-8 md:rtl:mr-8  animate-in">
        {purchased?.length === 0 ? (
          <div className="flex justify-center items-center pt-56 ">
            <div>
              <img
                className="w-28 mx-auto"
                src={EmtyWatchlist}
                alt="EmtyWatchlist"
              />
              <h1 className="text-gray-dark pt-10">
                {selectedContent[localizationKeys.ThereAreNoPurchasedYet]}
              </h1>
            </div>
          </div>
        ) : (
          <h1 className="text-center md:text-2xl lg:text-3xl font-extrabold text-gray-700 dark:text-gray-300 drop-shadow-md mb-8">
            {selectedContent[localizationKeys.yourPurchased]}
          </h1>
        )}
          <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-4 h-30 mx-auto w-full">
          {purchased?.map((e) => (
            <AuctionCard
              auctionId={e?.id}
              price={e?.acceptedAmount || e?.auction?.startBidAmount}
              title={e?.product?.title}
              status={e?.status}
              adsImg={e?.product?.images}
              totalBods={e?._count?.bids}
              isPurchased
              PurchasedTime={e?.Payment[0]?.createdAt}
              onReload={onReload}
              latestBidAmount={e?.bids[0]?.amount}
              startBidAmount={e?.startBidAmount}
              usageStatus={e?.product?.usageStatus}
              category={e?.product?.categoryId}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Purchased;
