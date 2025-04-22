import React, { useEffect, useState } from "react";

import api from "../../api";
import routes from "../../routes";
import useAxios from "../../hooks/use-axios";
import { useHistory } from "react-router-dom";
import { authAxios } from "../../config/axios-config";

import { Dimmer, Loader } from "semantic-ui-react";
import { DraftsItem } from "../../page/app/create-auction/create-auction";
import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Auction-Icon.svg";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";
import PaginationApp from "component/shared/pagination/pagination-app";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const DraftsAuctions = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [draftAuctionData, setDraftAuctionData] = useState();
  const [totalPages, setTotalPages] = useState();

  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const { search } = useLocation();
  const history = useHistory();

  const { run, isLoading } = useAxios([]);

  useEffect(() => {
    if (search.includes("page") && search.includes("perPage")) {
      run(
        authAxios.get(`${api.app.auctions.getAlldraft}${search}&status=DRAFTED`).then((res) => {
          setDraftAuctionData(res?.data?.data);
          setTotalPages(res?.data?.pagination?.totalPages);
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
          {draftAuctionData?.length}{" "}
          {selectedContent[localizationKeys.totalDraft]}
        </p>
      </div>
      {draftAuctionData?.length === 0 ? (
        <div className="flex justify-center mt-32">
          <div>
            <AuctionIcon className="mx-auto" />
            <p className="text-primary-light text-center mt-8 ">
              {selectedContent[localizationKeys.opsDraft]}
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
        <div className="grid lg:grid-cols-7 md:grid-cols-4 grid-cols-2 animate-in">
          {draftAuctionData?.map((e) => (
            <DraftsItem
              key={e?.id}
              auctionId={e?.id}
              img={e && e?.product?.images[0]?.imageLink}
              itemName={e?.product?.title}
              date={e?.createdAt}
              onReload={onReload}
            />
          ))}
        </div>
      )}
      <div className="flex justify-end mt-7 ltr:mr-2 rtl:ml-2">
        <PaginationApp totalPages={totalPages} perPage={14} />
      </div>
    </div>
  );
};

export default DraftsAuctions;
