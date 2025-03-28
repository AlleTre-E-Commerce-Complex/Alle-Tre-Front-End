import React, { useEffect, useState } from "react";
import { Dimmer } from "semantic-ui-react";

import api from "../../../api";
import routes from "../../../routes";
import { useHistory } from "react-router-dom";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";

import MyAuctionsTabs from "../../../component/profile-components/my-auctions-tabs";
import TotalAuctions from "../../../component/profile-components/total-auctions";
import { ReactComponent as AuctionIcon } from "../../../../src/assets/icons/Auction-Icon.svg";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";

const MyAuctions = () => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const history = useHistory();

  const [analyticsData, setAnalyticsData] = useState();
  const { run: runAlyticsData, isLoading: isLoadingAnalyticsData } = useAxios(
    []
  );
  useEffect(() => {
    runAlyticsData(
      authAxios.get(api.app.profile.analytics).then((res) => {
        setAnalyticsData(res?.data?.data);
      })
    );
  }, [runAlyticsData]);

  const analyticsDataObject = {};
  let totalCount = 0;
  analyticsData?.forEach((item) => {
    totalCount += item.count;
    if (!analyticsDataObject[item.status]) {
      analyticsDataObject[item.status] = { count: item.count };
    } else {
      analyticsDataObject[item.status].count += item.count;
    }
  });
  const allStatuses = [
    "DRAFTED" || null,
    "PENDING_OWNER_DEPOIST" || null,
    "IN_SCHEDULED" || null,
    "SOLD" || null,
    "EXPIRED" || null,
    "ACTIVE" || null,
    "WAITING_FOR_PAYMENT" || null,
    "CANCELLED_BEFORE_EXP_DATE" || null,
    "CANCELLED_AFTER_EXP_DATE" || null,
  ];
  allStatuses?.forEach((status) => {
    if (!analyticsDataObject[status]) {
      analyticsDataObject[status] = { count: 0 };
    }
  });
  analyticsDataObject.totalcount = totalCount;

  useEffect(() => {
    window.scrollTo({ top: 1, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div className="mx-4 sm:mx-0 sm:ltr:ml-4 sm:rtl:mr-4  animate-in  ">
        <Dimmer
          className="fixed w-full h-full top-0 bg-white"
          active={isLoadingAnalyticsData}
          inverted
        >
          {/* <Loader active /> */}
          <LodingTestAllatre />
        </Dimmer>
        {analyticsData?.length === 0 ? (
          <div className="align-middle pt-52">
            <div>
              <AuctionIcon className="mx-auto" />
              <p className="text-gray-dark text-center mt-12 ">
                {
                  selectedContent[
                    localizationKeys
                      .thereAreNoAuctionsCurrentlyMakeYourFirstAuctionRightAway
                  ]
                }
              </p>
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => history.push(routes.app.createAuction.default)}
                  className="text-white text-sm font-normal bg-primary rounded-lg w-[120px] h-[40px] "
                >
                  {selectedContent[localizationKeys.createNow]}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* DoughnutChart */}
            <TotalAuctions
              active={analyticsDataObject?.ACTIVE?.count}
              drafted={analyticsDataObject?.DRAFTED?.count}
              sold={analyticsDataObject?.SOLD?.count}
              scheduled={analyticsDataObject?.IN_SCHEDULED?.count}
              pending={analyticsDataObject?.PENDING_OWNER_DEPOIST?.count}
              watingForPayment={analyticsDataObject?.WAITING_FOR_PAYMENT?.count}
              cancelledAuction={
                analyticsDataObject?.CANCELLED_BEFORE_EXP_DATE?.count +
                analyticsDataObject?.CANCELLED_AFTER_EXP_DATE?.count
              }
              expired={analyticsDataObject?.EXPIRED?.count}
              totalcount={analyticsDataObject?.totalcount}
            />
            <div className="mt-4">
              <MyAuctionsTabs />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyAuctions;
