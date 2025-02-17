import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";

import useAxios from "../../../hooks/use-axios";
import { Dimmer } from "semantic-ui-react";
import routes from "../../../routes";
import { useHistory } from "react-router-dom";

import { ReactComponent as BidIcon } from "../../../../src/assets/icons/Bids-icon.svg";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";
import localizationKeys from "../../../localization/localization-keys";
import TotalMyProducts from "component/profile-components/Total-my-products";
import MyProductsTab from "component/profile-components/my-produts-tab";

const MyProducts = () => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const history = useHistory();
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [analyticsData, setAnalyticsData] = useState();
  const { run: runAlyticsData, isLoading: isLoadingAnalyticsData } = useAxios(
    []
  );
  useEffect(() => {
    runAlyticsData(
      authAxios.get(api.app.productListing.productAnalytics).then((res) => {
        setAnalyticsData(res?.data?.data);
      })
    );
  }, [runAlyticsData, forceReload]);

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
    "IN_PROGRESS" || null,
    "OUT_OF_STOCK" || null,
    "SOLD_OUT" || null,
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
              <BidIcon className="mx-auto" />
              <p className="text-gray-dark text-center mt-12 ">
                {selectedContent[localizationKeys.thereAreNoListedProductsAtTheMomentListYouFirstProductNow]}
              </p>
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => history.push(routes.app.home)}
                  className="text-white text-sm font-normal bg-primary hover:bg-primary-dark rounded-lg px-6 h-8 "
                >
                  {
                    selectedContent[
                      localizationKeys.startBidding
                    ]
                  }
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* DoughnutChart */}
            <TotalMyProducts
              inProgressProducts={0}
              outOfStockProducts={0}
              soldOutProducts={0}
            />
            <div className="mt-4">
              <MyProductsTab onReload={onReload} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyProducts;
