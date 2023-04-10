import React, { useEffect, useState } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import api from "../../api";
import { authAxios } from "../../config/axios-config";
import useAxios from "../../hooks/use-axios";
import AuctionCard from "../home-components/auction-card";

const Watshlist = () => {
  const [watshlist, setWatshlist] = useState();
  const { run: runWatshlist, isLoading: isLoadingWatshlist } = useAxios([]);
  useEffect(() => {
    runWatshlist(
      authAxios.get(`${api.app.WatchList.get}`).then((res) => {
        setWatshlist(res?.data?.data);
      })
    );
  }, [runWatshlist]);
  console.log("====================================");
  console.log(watshlist);
  console.log("====================================");
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="mx-4 relative animate-in ">
      <Dimmer className="animate-pulse" active={isLoadingWatshlist} inverted>
        <Loader active />
      </Dimmer>
      <div className="flex  flex-wrap gap-5">
        {watshlist?.map((e) => (
          <AuctionCard
            auctionId={e?.id}
            price={e?.acceptedAmount || e?.startBidAmount}
            title={e?.product?.title}
            status={e?.status}
            adsImg={e?.product?.images[0].imageLink}
            totalBods={15}
            WatshlistState={e?.isSaved}
            endingTime={e?.expiryDate}
            isBuyNowAllowed={e?.isBuyNowAllowed}
            isMyAuction={e?.isMyAuction}
          />
        ))}
      </div>
    </div>
  );
};

export default Watshlist;
