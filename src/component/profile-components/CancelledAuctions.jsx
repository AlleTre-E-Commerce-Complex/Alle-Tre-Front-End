import React, { useEffect, useState } from "react";

import api from "../../api";
import routes from "../../routes";
import useAxios from "../../hooks/use-axios";
import { useHistory } from "react-router-dom";
import { authAxios } from "../../config/axios-config";

import ActionsRowTable from "./actions-row-table";
import { Dimmer, Loader } from "semantic-ui-react";
import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Auction-Icon.svg";
import PaginationApp from "../shared/pagination/pagination-app";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";
const CancelledAuctions = () => {
    const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const [cancelledAuctionData, setCancelledAuctionData] = useState();

  const [totalPages, setTotalPages] = useState();

  const history = useHistory();
  const { search } = useLocation();

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage")) {
      // Array to store combined auction data
      let allCancelledAuctions = [];
  
      // Run the first API call
      run(
        authAxios
          .get(`${api.app.auctions.getAllOwnesAuctions}${search}&status=CANCELLED_BEFORE_EXP_DATE`)
          .then((res) => {
            const beforeExpAuctions = res?.data?.data || [];
            
  
            // Add results from the first API call to allCancelledAuctions
            allCancelledAuctions = [...allCancelledAuctions, ...beforeExpAuctions];
  
            // Run the second API call
            run(
              authAxios
                .get(`${api.app.auctions.getAllOwnesAuctions}${search}&status=CANCELLED_AFTER_EXP_DATE`)
                .then((res) => {
                  const afterExpAuctions = res?.data?.data || [];
                  
  
                  // Combine data from both API calls
                  allCancelledAuctions = [...allCancelledAuctions, ...afterExpAuctions];
  
                    // Run the second API call
            run(
              authAxios
                .get(`${api.app.auctions.getAllOwnesAuctions}${search}&status=CANCELLED_BY_ADMIN`)
                .then((res) => {
                  const afterExpAuctions = res?.data?.data || [];
                  
  
                  // Combine data from both API calls
                  allCancelledAuctions = [...allCancelledAuctions, ...afterExpAuctions];
                   // Update state with the combined data
                   setCancelledAuctionData(allCancelledAuctions);
  
                   // Set the total pages based on pagination of both calls
                   const totalPages = Math.max(
                     res?.data?.pagination?.totalPages || 1,
                     beforeExpAuctions.length ? 1 : 0
                   );
                   setTotalPages(totalPages);
  
                  
                })
            );
                })
            );
          })
      );
    }
  }, [run, forceReload, search]);
  


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
          {cancelledAuctionData?.length}{" "}
          {selectedContent[localizationKeys.totalCancel]}
        </p>
      </div>
      {cancelledAuctionData?.length === 0 ? (
        <div className="flex justify-center mt-32">
          <div>
            <AuctionIcon className="mx-auto" />
            <p className="text-primary-light text-center mt-8 ">
              {selectedContent[localizationKeys.oppsCancelled]}
              <br></br> {selectedContent[localizationKeys.youCanCreateOne]}
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
          {cancelledAuctionData?.map((e) => (
            <ActionsRowTable
              key={e?.id}
              status={e?.status}
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
}

export default CancelledAuctions
