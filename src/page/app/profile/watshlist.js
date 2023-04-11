import React, { useEffect, useState } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import api from "../../../api";
import { authAxios } from "../../../config/axios-config";
import useAxios from "../../../hooks/use-axios";
import AuctionCard from "../../../components/home-components/auction-card";

const Watshlist = () => {
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
  console.log("====================================");
  console.log(watshlist);
  console.log("====================================");
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="ml-8 relative animate-in ">
      <Dimmer className="animate-pulse" active={isLoadingWatshlist} inverted>
        <Loader active />
      </Dimmer>
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
