import React, { useEffect, useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import content from "../../localization/content";
import { useLanguage } from "../../context/language-context";
import { Dimmer, Loader } from "semantic-ui-react";
import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Bids-icon.svg";
import routes from "../../routes";
import ActionsRowTable from "./actions-row-table";
import PaginationApp from "../shared/pagination/pagination-app";
import api from "../../api";
import { authAxios } from "../../config/axios-config";
import useAxios from "../../hooks/use-axios";
import localizationKeys from "../../localization/localization-keys";
import { useDispatch, useSelector } from "react-redux";
import { completePaymentData } from "../../redux-store/complete-payment-slice";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";
import useLocalStorage from "../../hooks/use-localstorage";
import MakeDefultLocations from "../shared/locations-models/make-defult-locations";

const PendingBids = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [activeAuctionData, setActiveAuctionData] = useState();
  const [totalPages, setTotalPages] = useState();

  const history = useHistory();
  const { search } = useLocation();

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
      run(
        authAxios
          .get(
            `${api.app.auctions.getAllMyBids}${search}&status=PENDING_PAYMENT`
          )
          .then((res) => {
            setActiveAuctionData(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
          })
      );
  }, [run, forceReload, search]);

  const dispatch = useDispatch();

  const [hasCompletedProfile, setHasCompletedProfile] = useLocalStorage(
    "hasCompletedProfile",
    ""
  );

  const handelCompletePayment = (auctionsId, lastPrice) => {
    if (JSON.parse(hasCompletedProfile)) {
      history.push(routes.app.profile.myBids.completePayment);
      dispatch(
        completePaymentData({
          auctionsId,
          lastPrice,
        })
      );
    }
  };

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
                  localizationKeys.ThereIsNoBidsYetPendingAuctionsRightNow
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
              isBidsButtons
              auctionsId={e?.auction?.id}
              textButton={selectedContent[localizationKeys.completePayment]}
              buttonActions={() => {
                handelCompletePayment(
                  e?.auction?.id,
                  e?.auction?.bids[0]?.amount
                );
              }}
              status={"PENDING_PAYMENT"}
              title={e?.auction?.product?.title}
              description={e?.auction?.product?.description}
              img={e?.auction?.product?.images[0]?.imageLink}
              totalBids={e?.auction?._count?.bids}
              lastPrice={e?.auction?.bids[0]?.amount}
              endingTime={e?.auction?.expiryDate}
              goToDetails={routes.app.profile.myBids.pendingDetails(
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
  );
};

export default PendingBids;
