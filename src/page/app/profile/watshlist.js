import React, { useEffect, useState } from "react";
import {
  Dimmer,
  // Loader
} from "semantic-ui-react";
import api from "../../../api";
import { authAxios } from "../../../config/axios-config";
import useAxios from "../../../hooks/use-axios";
import AuctionCard from "../../../component/home-components/auction-card";
import EmtyWatchlist from "../../../../src/assets/icons/empty-watch-list.svg";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";

const Watshlist = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [watshlist, setWatshlist] = useState();
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const { run: runWatshlist, isLoading: isLoadingWatshlist } = useAxios([]);
  useEffect(() => {
    runWatshlist(
      authAxios.get(`${api.app.WatchList.get}`).then((res) => {
        setWatshlist(res?.data?.data);
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
      <div className="mx-4 ltr:ml-4 rtl:mr-4 md:ltr:ml-8 md:rtl:mr-8 animate-in">
        {watshlist?.length === 0 ? (
          <div className="flex justify-center items-center pt-56 ">
            <div>
              <img
                className="w-28 mx-auto"
                src={EmtyWatchlist}
                alt="EmtyWatchlist"
              />
              <h1 className="text-gray-dark pt-10">
                {selectedContent[localizationKeys.thereAreNoWatchlistYet]}
              </h1>
            </div>
          </div>
        ) : (
          <h1 className="text-gray-dark pb-14 pt-4 font-bold">
            {selectedContent[localizationKeys.yourWatchlist]}
          </h1>
        )}
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-5 gap-3 h-fit mx-auto pb-5 animate-in ">
          {watshlist?.map((e) => (
            <AuctionCard
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
              className=""
              startBidAmount={e?.auction?.startBidAmount}
              latestBidAmount={e?.auction?.bids[0]?.amount}
              category={e?.product?.categoryId}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Watshlist;
