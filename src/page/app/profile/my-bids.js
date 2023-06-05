import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import useAxios from "../../../hooks/use-axios";
import { Dimmer } from "semantic-ui-react";
import MyBidsTabs from "../../../components/profile-components/my-bids-tabs";
import TotalMyBids from "../../../components/profile-components/total-my-bids";
import routes from "../../../routes";

const MyBids = () => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const history = useHistory();

  // const [analyticsData, setAnalyticsData] = useState();
  // const { run: runAlyticsData, isLoading: isLoadingAnalyticsData } = useAxios(
  //   []
  // );
  // useEffect(() => {
  //   runAlyticsData(
  //     authAxios.get(api.app.profile.analytics).then((res) => {
  //       setAnalyticsData(res?.data?.data);
  //     })
  //   );
  // }, [runAlyticsData]);

  // const analyticsDataObject = {};
  // let totalCount = 0;
  // analyticsData?.forEach((item) => {
  //   totalCount += item.count;
  //   if (!analyticsDataObject[item.status]) {
  //     analyticsDataObject[item.status] = { count: item.count };
  //   } else {
  //     analyticsDataObject[item.status].count += item.count;
  //   }
  // });
  // const allStatuses = [
  //   "DRAFTED" || null,
  //   "PENDING_OWNER_DEPOIST" || null,
  //   "IN_SCHEDULED" || null,
  //   "SOLD" || null,
  //   "EXPIRED" || null,
  //   "ACTIVE" || null,
  // ];
  // allStatuses?.forEach((status) => {
  //   if (!analyticsDataObject[status]) {
  //     analyticsDataObject[status] = { count: 0 };
  //   }
  // });
  // analyticsDataObject.totalcount = totalCount;

  useEffect(() => {
    window.scrollTo({ top: 1, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="mx-4 sm:mx-0 sm:ltr:ml-4 sm:rtl:mr-4 relative animate-in  ">
      <Dimmer
        className="animate-pulse"
        // active={isLoadingAnalyticsData}
        inverted
      >
        {/* <Loader active /> */}
      </Dimmer>
      {false ? (
        <div className="align-middle pt-52">
          <div>
            {/* <AuctionIcon className="mx-auto" /> */}
            <p className="text-gray-dark text-center mt-12 ">
              {/* {
                selectedContent[
                  localizationKeys
                    .thereAreNoAuctionsCurrentlyMakeYourFirstAuctionRightAway
                ]
              } */}
            </p>
            <div className="flex justify-center mt-8">
              <button
                // onClick={() => history.push(routes.app.createAuction.default)}
                className="text-white text-sm font-normal bg-primary rounded-lg w-32 h-8 "
              >
                {/* {selectedContent[localizationKeys.createNow]} */}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* DoughnutChart */}
          <TotalMyBids
            inProgressAuction={1}
            pendingAuction={1}
            completedAuction={1}
            expiredAuctions={1}
            waitingForDeliveryAuctions={1}
            totalcount={5}
          />
          <div className="mt-4">
            <MyBidsTabs />
          </div>
        </>
      )}
    </div>
  );
};

export default MyBids;
