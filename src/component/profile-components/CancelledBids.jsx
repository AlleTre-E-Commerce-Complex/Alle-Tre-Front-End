
import React, { useEffect, useState } from "react";
import {
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import content from "../../localization/content";
import { useLanguage } from "../../context/language-context";
import { Dimmer } from "semantic-ui-react";
import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Bids-icon.svg";
import routes from "../../routes";
import ActionsRowTable from "./actions-row-table";
import PaginationApp from "../shared/pagination/pagination-app";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import localizationKeys from "../../localization/localization-keys";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const CancelledBids = () => {
    const [lang] = useLanguage("");
    const selectedContent = content[lang];
    const [forceReload, setForceReload] = useState(false);
    const onReload = React.useCallback(() => setForceReload((p) => !p), []);
    const [AuctionData, setAuctionData] = useState();
    const [totalPages, setTotalPages] = useState();
  
  
    const { search } = useLocation();
  
    const { run, isLoading } = useAxios([]);
    useEffect(() => {
        if (search.includes("page") && search.includes("perPage")) {
          // Array to store combined auction data
          let allAuctionData = [];
      
          // Run the first API call
          run(
            authAxios
              .get(`${api.app.auctions.getAllMyBids}${search}&status=CANCELLED_BEFORE_EXP_DATE`)
              .then((res) => {
                const beforeExpAuctions = res?.data?.data || [];
      
                // Add results from the first API call to allAuctionData
                allAuctionData = [...allAuctionData, ...beforeExpAuctions];
      
                // Run the second API call
                run(
                  authAxios
                    .get(`${api.app.auctions.getAllMyBids}${search}&status=CANCELLED_AFTER_EXP_DATE`)
                    .then((res) => {
                      const afterExpAuctions = res?.data?.data || [];
      
                      // Combine data from both API calls
                      allAuctionData = [...allAuctionData, ...afterExpAuctions];
      
                      // Update state with the combined data
                      setAuctionData(allAuctionData);
      
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
          {AuctionData?.length}{" "}
          {selectedContent[localizationKeys.totalCancel]}
        </p>
      </div>
      {AuctionData?.length === 0 ? (
        <div className="flex justify-center mt-32">
          <div>
            <AuctionIcon className="mx-auto" />
            <p className="text-gray-dark text-center mt-8 ">
              {
                selectedContent[
                  localizationKeys.ThereIsNoBidsyetCancelledAuctionsRightNow 
                ]
              }
            </p>
          </div>
        </div>
      ) : (
        <div>
          {AuctionData?.map((e) => (
            <ActionsRowTable
              key={e?.id}
              // isBidsButtons
              // textButton={"Confirm delivery"}
              auctionsId={e?.auction?.id}
              status={e?.auction?.status}
              title={e?.auction?.product?.title}
              description={e?.auction?.product?.description}
              img={e?.auction?.product?.images[0]?.imageLink}
              totalBids={e?.auction?._count?.bids}
              lastPrice={e?.auction?.startBidAmount}
              endingDate={e?.auction?.endDate}
              goToDetails={routes.app.profile.myBids.completedDetails(
                e?.auction?.id
              )}
            />
          ))}
          <div className="flex justify-end mt-7 ltr:mr-2 rtl:ml-2">
            <PaginationApp totalPages={totalPages} perPage={5} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CancelledBids
