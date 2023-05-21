import React, { useEffect, useState } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import api from "../../../api";
import { authAxios } from "../../../config/axios-config";
import useAxios from "../../../hooks/use-axios";
import AuctionCard from "../../../components/home-components/auction-card";
import EmtyWatchlist from "../../../../src/assets/icons/emty-watchlist.png";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

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
    <div className="ltr:ml-8 rtl:mr-8 relative animate-in ">
      <Dimmer className="animate-pulse" active={isLoadingWatshlist} inverted>
        <Loader active />
      </Dimmer>
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
      <div className="grid grid-cols-4 gap-5">
        {watshlist?.map((e) => (
          <AuctionCard
            auctionId={e?.auction?.id}
            price={e?.auction?.acceptedAmount || e?.auction?.startBidAmount}
            title={e?.auction?.product?.title}
            status={e?.auction?.status}
            adsImg={e?.auction?.product?.images[0].imageLink}
            totalBods={15}
            WatshlistState={true}
            watshlistForceState={true}
            endingTime={e?.auction?.expiryDate}
            isBuyNowAllowed={e?.auction?.isBuyNowAllowed}
            isMyAuction={e?.auction?.isMyAuction}
            onReload={onReload}
          />
        ))}
      </div>
    </div>
  );
};

export default Watshlist;
