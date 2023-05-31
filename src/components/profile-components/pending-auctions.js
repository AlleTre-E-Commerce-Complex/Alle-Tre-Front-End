import React, { useEffect, useState } from "react";

import api from "../../api";
import routes from "../../routes";
import useAxios from "../../hooks/use-axios";
import { useHistory, useLocation } from "react-router-dom";
import { authAxios } from "../../config/axios-config";

import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Auction-Icon.svg";
import ActionsRowTable from "./actions-row-table";

import { Dimmer, Loader } from "semantic-ui-react";
import { formatCurrency } from "../../utils/format-currency";
import PaginationApp from "../shared/pagination/pagination-app";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const PendingAuctions = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [pendingAuctionsData, setPendingAuctionsData] = useState();
  const [totalPages, setTotalPages] = useState();

  const history = useHistory();
  const { search } = useLocation();

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search) {
      run(
        authAxios
          .get(
            `${api.app.auctions.getAllOwnesAuctions}${search}&status=PENDING_OWNER_DEPOIST`
          )
          .then((res) => {
            setPendingAuctionsData(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
          })
      );
    }
  }, [run, forceReload, search]);

  console.log("====================================");
  console.log(pendingAuctionsData);
  console.log("====================================");

  return (
    <div className="relative">
      <Dimmer className="animate-pulse" active={isLoading} inverted>
        <Loader active />
      </Dimmer>
      <div>
        <p className="pb-5 text-gray-med text-xs font-normal">
          {pendingAuctionsData?.length}{" "}
          {selectedContent[localizationKeys.totalPending]}
        </p>
      </div>
      {pendingAuctionsData?.length === 0 ? (
        <div className="flex justify-center mt-32">
          <div>
            <AuctionIcon className="mx-auto" />
            <p className="text-primary-light text-center mt-8 ">
              {selectedContent[localizationKeys.opsPending]}.<br></br>{" "}
              {selectedContent[localizationKeys.youCanCreateOne]}
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => history.push(routes.app.createAuction.default)}
                className="text-white text-sm font-normal bg-primary rounded-lg w-32 h-8 "
              >
                {selectedContent[localizationKeys.createNow]}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {pendingAuctionsData?.map((e) => (
            <ActionsRowTable
              key={e?.id}
              auctionsId={e?.id}
              status={e?.status}
              title={e?.product?.title}
              description={e?.product?.description}
              img={e?.product?.images[0]?.imageLink}
              startingPrice={e?.startBidAmount}
              startingDate={e?.startDate}
              goToDetails={routes.app.profile.myAuctions.pendingDetails(e?.id)}
            />
          ))}
          <div className="flex justify-end mt-7 ltr:mr-2 rtl:ml-2">
            <PaginationApp totalPages={totalPages} perPage={5} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingAuctions;
