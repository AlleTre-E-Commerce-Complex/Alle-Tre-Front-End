import React, { useEffect, useMemo, useState } from "react";

import api from "../../api";
import routes from "../../routes";
import useAxios from "../../hooks/use-axios";
import { useHistory } from "react-router-dom";
import { authAxios } from "../../config/axios-config";

import ActionsRowTable from "./actions-row-table";
import { Dimmer } from "semantic-ui-react";
import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Auction-Icon.svg";
import PaginationApp from "../shared/pagination/pagination-app";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";
import { useAuthState } from "context/auth-context";
import { useDispatch } from "react-redux";
import { Open } from "../../redux-store/auth-model-slice";

const ActiveAuctions = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [activeAuctionData, setActiveAuctionData] = useState();
  const [totalPages, setTotalPages] = useState();

  const history = useHistory();
  const { search } = useLocation();
  const { user } = useAuthState();
  const dispatch = useDispatch();

  const handleOnCreate = () => {
    if (user) {
      history.push(routes.app.createAuction.productDetails)
    } else dispatch(Open());
  };

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
      run(
        authAxios
          .get(`${api.app.auctions.getAllOwnesAuctions}${search}&status=ACTIVE`)
          .then((res) => {
            setActiveAuctionData(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
          })
      );
  }, [run, forceReload, search]);

  const mappedAuctionData = useMemo(
    () => activeAuctionData,
    [activeAuctionData]
  );

  return (
    <div className="">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div>
        <p className="pb-5 text-gray-med text-xs font-normal">
          {activeAuctionData?.length}{" "}
          {selectedContent[localizationKeys.totalActive]}
        </p>
      </div>
      {activeAuctionData?.length === 0 ? (
        <div className="flex justify-center mt-32">
          <div>
            <AuctionIcon className="mx-auto" />
            <p className="text-primary-light text-center mt-8 ">
              {selectedContent[localizationKeys.oppsActive]}
              <br></br> {selectedContent[localizationKeys.youCanCreateOne]}
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleOnCreate}
                className="text-white text-sm font-normal bg-primary rounded-lg w-32 h-8 "
              >
                {selectedContent[localizationKeys.createNow]}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {mappedAuctionData?.map((e, index) => (
            <ActionsRowTable
              key={index}
              status={e?.status}
              auctionsId={e?.id}
              title={e?.product?.title}
              description={e?.product?.description}
              img={e?.product?.images[0]?.imageLink}
              totalBids={e?._count?.bids}
              lastPrice={e?.bids[0]?.amount || e?.startBidAmount}
              endingTime={e?.expiryDate}
              goToDetails={routes.app.profile.myAuctions.activeDetails(e?.id)}
            />
          ))}
          <div className="flex justify-end mt-7 ltr:mr-2 rtl:ml-2">
            <PaginationApp totalPages={totalPages} perPage={10} />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ActiveAuctions);
