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
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import localizationKeys from "../../localization/localization-keys";
import { toast } from "react-toastify";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const WatingForDeliveryBids = ({ OnReload }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [activeAuctionData, setActiveAuctionData] = useState();
  const [totalPages, setTotalPages] = useState();

  const history = useHistory();
  const { search } = useLocation();

  const { run, isLoading } = useAxios([]);
  const { run: runConfirmDelivery, isLoading: isLoadingConfirmDelivery } =
    useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
      run(
        authAxios
          .get(
            `${api.app.auctions.getAllMyBids}${search}&status=WAITING_FOR_DELIVERY`
          )
          .then((res) => {
            setActiveAuctionData(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
          })
      );
  }, [run, forceReload, search]);

  const handelConfirmDelivery = (auctionId) => {
    runConfirmDelivery(
      authAxios
        .post(api.app.auctions.ConfirmDelivery(auctionId))
        .then((res) => {
          onReload();
          OnReload();
          history.push(routes.app.profile.myBids.completed);
          toast.success("This auctions is Confirm Delivery success");
        })
        .catch((err) => {
          console.log("====================================");
          console.log(err);
          console.log("====================================");
        })
    );
  };
  return (
    <div className="">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading || isLoadingConfirmDelivery}
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
            <p className="text-gray-dark text-center mt-8 ">
              There is no bids yet on Waiting for delivery auctions right now
            </p>
          </div>
        </div>
      ) : (
        <div>
          {activeAuctionData?.map((e) => (
            <ActionsRowTable
              key={e?.auction?.id}
              isBidsButtons
              textButton={"Confirm delivery"}
              buttonActions={() => handelConfirmDelivery(e?.auction?.id)}
              status={"WAITING_FOR_DELIVERY"}
              title={e?.auction?.product?.title}
              description={e?.auction?.product?.description}
              img={e?.auction?.product?.images[0]?.imageLink}
              totalBids={e?._count?.bids}
              lastPrice={e?.auction?.bids[0]?.amount}
              endingTime={e?.expiryDate}
              goToDetails={routes.app.homeDetails(e?.auction?.id)}
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

export default WatingForDeliveryBids;
