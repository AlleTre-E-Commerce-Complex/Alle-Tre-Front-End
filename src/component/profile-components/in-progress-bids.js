import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
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
import IncreaseBidModel from "./increase-bid-model";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const InProgressBids = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [activeAuctionData, setActiveAuctionData] = useState();
  const [totalPages, setTotalPages] = useState();

  const { search } = useLocation();

  const [openIncreaseModel, setOpenIncreaseModel] = useState(false);
  const [auctionId, setAuctionId] = useState();
  const [compareValue, setCompareValue] = useState();

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
      run(
        authAxios
          .get(`${api.app.auctions.getAllMyBids}${search}&status=IN_PROGRESS`)
          .then((res) => {
            setActiveAuctionData(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
          })
          .catch((error)=>{
            console.log('InProgressBids error',error)
          })
      );
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
          {activeAuctionData?.length} {selectedContent[localizationKeys.total]}
        </p>
      </div>
      {activeAuctionData?.length === 0 ? (
        <div className="flex justify-center mt-32">
          <div>
            <AuctionIcon className="mx-auto" />
            <p className="text-gray-dark text-center mt-8 ">
              {
                selectedContent[
                  localizationKeys.youHaveNotPlacedAnyBidsAtThisTime
                ]
              }
            </p>
          </div>
        </div>
      ) : (
        <div>
          {activeAuctionData?.map((e) => (
            <ActionsRowTable
              key={e?.auction?.id}
              auctionsId={e?.auction?.id}
              isBidsButtons
              textButton={selectedContent[localizationKeys.increaseBid]}
              buttonActions={() => {
                setOpenIncreaseModel(true);
                setAuctionId(e?.auction?.id);
                setCompareValue(e?.auction?.bids[0]?.amount);
              }}
              status={"IN_PROGRESS"}
              title={e?.auction?.product?.title}
              description={e?.auction?.product?.description}
              img={e?.auction?.product?.images[0]?.imageLink}
              totalBids={e?.auction?._count?.bids}
              lastPrice={e?.auction?.startBidAmount}
              endingTime={e?.auction?.expiryDate}
              goToDetails={routes.app.profile.myBids.inPogressDetails(
                e?.auction?.id
              )}
            />
          ))}
          <div className="flex justify-end mt-7 ltr:mr-2 rtl:ml-2">
            <PaginationApp totalPages={totalPages} perPage={10} />
          </div>
        </div>
      )}

      <IncreaseBidModel
        open={openIncreaseModel}
        setOpen={setOpenIncreaseModel}
        onReload={onReload}
        auctionId={auctionId}
        compareValue={compareValue}
      />
    </div>
  );
};

export default InProgressBids;
