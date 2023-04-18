import React, { useEffect, useState } from "react";

import api from "../../api";
import routes from "../../routes";
import useAxios from "../../hooks/use-axios";
import { useHistory } from "react-router-dom";
import { authAxios } from "../../config/axios-config";

import ActionsRowTable from "./actions-row-table";
import { Dimmer, Loader } from "semantic-ui-react";
import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Auction-Icon.svg";

const ActiveAuctions = () => {
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [activeAuctionData, setActiveAuctionData] = useState();

  const history = useHistory();

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    run(
      authAxios.get(api.app.auctions.getAllactive).then((res) => {
        setActiveAuctionData(res?.data?.data);
      })
    );
  }, [run, forceReload]);

  console.log("====================================");
  console.log(activeAuctionData);
  console.log("====================================");

  return (
    <div className="relative">
      <Dimmer className="animate-pulse" active={isLoading} inverted>
        <Loader active />
      </Dimmer>
      <div>
        <p className="pb-5 text-gray-med text-xs font-normal">
          {activeAuctionData?.length} Total Active Auctions..
        </p>
      </div>
      {activeAuctionData?.length === 0 ? (
        <div className="flex justify-center mt-32">
          <div>
            <AuctionIcon className="mx-auto" />
            <p className="text-primary-light text-center mt-8 ">
              Ops, there are no active auctions yet.<br></br> You can create one
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => history.push(routes.app.createAuction.default)}
                className="text-white text-sm font-normal bg-primary rounded-lg w-32 h-8 "
              >
                Create Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        activeAuctionData?.map((e) => (
          <ActionsRowTable
            key={e?.id}
            status={e?.status}
            title={e?.product?.title}
            description={e?.product?.description}
            img={e?.product?.images[0]?.imageLink}
            totalBids={""}
            lastPrice={e?.startBidAmount}
            endingTime={e?.expiryDate}
            goToDetails={routes.app.profile.myAuctions.activeDetails(e?.id)}
          />
        ))
      )}
    </div>
  );
};

export default ActiveAuctions;
