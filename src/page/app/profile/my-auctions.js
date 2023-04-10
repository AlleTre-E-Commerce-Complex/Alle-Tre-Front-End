import React, { useEffect, useState } from "react";
import { Dimmer } from "semantic-ui-react";

import api from "../../../api";
import routes from "../../../routes";
import { useHistory } from "react-router-dom";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";

import MyAuctionsTabs from "../../../components/profile-components/my-auctions-tabs";
import TotalAuctions from "../../../components/profile-components/total-auctions";
import { ReactComponent as AuctionIcon } from "../../../../src/assets/icons/Auction-Icon.svg";

const MyAuctions = () => {
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
    <div className="animate-in ">
      <div className="ml-4 relative ">
        <Dimmer
          className="animate-pulse"
          active={isLoadingAnalyticsData}
          inverted
        >
          {/* <Loader active /> */}
        </Dimmer>
        {analyticsData?.length === 0 ? (
          <div className="align-middle pt-52">
            <div>
              <AuctionIcon className="mx-auto" />
              <p className="text-gray-dark text-center mt-12 ">
                There are no auctions currently. Make your first auction right
                away.
              </p>
              <div className="flex justify-center mt-8">
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
          <>
            {/* DoughnutChart */}
            <TotalAuctions
              active={analyticsDataObject?.ACTIVE?.count}
              drafted={analyticsDataObject?.DRAFTED?.count}
              sold={analyticsDataObject?.SOLD?.count}
              scheduled={analyticsDataObject?.IN_SCHEDULED?.count}
              expired={analyticsDataObject?.EXPIRED?.count}
              pending={analyticsDataObject?.PENDING_OWNER_DEPOIST?.count}
              totalcount={analyticsDataObject?.totalcount}
            />
            <div className="mt-4">
              <MyAuctionsTabs />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyAuctions;
