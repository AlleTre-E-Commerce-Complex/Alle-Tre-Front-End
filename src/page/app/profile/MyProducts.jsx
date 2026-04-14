import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import useAxios from "../../../hooks/use-axios";
import { Dimmer } from "semantic-ui-react";
import routes from "../../../routes";
import { useHistory } from "react-router-dom";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import LoadingTest3arbon from "../../../component/shared/lotties-file/loading-test-3arbon";
import localizationKeys from "../../../localization/localization-keys";
import TotalMyProducts from "component/profile-components/Total-my-products";
import MyProductsTab from "component/profile-components/my-produts-tab";
import { IoBagHandleOutline } from "react-icons/io5";
import AddLocationModel from "../../../component/create-auction-components/add-location-model";

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
  const [draftCount, setDraftCount] = useState(0);
  const { run: runDrafts, isLoading: isLoadingDrafts } = useAxios([]);

  const [locations, setLocations] = useState([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const { run: runLocations } = useAxios([]);

  useEffect(() => {
    runLocations(
      authAxios.get(api.app.location.get).then((res) => {
        setLocations(res?.data?.data || []);
      })
    );
  }, [runLocations, forceReload]);

  const handleStartListing = () => {
    if (locations.length === 0) {
      setIsLocationModalOpen(true);
    } else {
      history.push(routes.app.listProduct.default);
    }
  };

  useEffect(() => {
    runAlyticsData(
      authAxios.get(api.app.productListing.productAnalytics).then((res) => {
        setAnalyticsData(res?.data?.data);
      })
    );
    runDrafts(
      authAxios.get(`${api.app.auctions.getAlldraft}?page=1&perPage=1&status=DRAFTED&type=LISTED_PRODUCT`).then((res) => {
        setDraftCount(res?.data?.pagination?.totalItems || 0);
      })
    );
  }, [runAlyticsData, runDrafts, forceReload]);

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
          active={isLoadingAnalyticsData || isLoadingDrafts}
          inverted
        >
          {/* <Loader active /> */}
          <LoadingTest3arbon />
        </Dimmer>
        {analyticsData?.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-[#1A1F2C] border border-gray-200 dark:border-[#2C3241] rounded-2xl p-8 mt-10 shadow-sm mx-auto max-w-3xl">
            <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-full mb-6">
              <IoBagHandleOutline className="w-16 h-16 text-primary" />
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mt-2 mb-8 text-base font-medium">
              {
                selectedContent[
                  localizationKeys
                    .thereAreNoListedProductsAtTheMomentListYouFirstProductNow
                ]
              }
            </p>

            <button
              onClick={handleStartListing}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              {selectedContent[localizationKeys.startLisitng]}
              <span className="rtl:rotate-180">➤</span>
            </button>
          </div>
        ) : (
          <>
            {/* DoughnutChart */}
            <TotalMyProducts
              inProgressProducts={analyticsDataObject?.IN_PROGRESS?.count}
              outOfStockProducts={analyticsDataObject?.OUT_OF_STOCK?.count}
              soldOutProducts={analyticsDataObject?.SOLD_OUT?.count}
              draftProducts={draftCount}
              handleStartListing={handleStartListing}
            />
            <div className="mt-8">
              <MyProductsTab 
                onReload={onReload} 
                inProgressProducts={analyticsDataObject?.IN_PROGRESS?.count || 0}
                outOfStockProducts={analyticsDataObject?.OUT_OF_STOCK?.count || 0}
                soldOutProducts={analyticsDataObject?.SOLD_OUT?.count || 0}
                draftProducts={draftCount}
              />
            </div>
          </>
        )}
      </div>
      <AddLocationModel
        open={isLocationModalOpen}
        setOpen={setIsLocationModalOpen}
        TextButton={selectedContent[localizationKeys.proceed]}
        onReload={onReload}
        isListing={true}
      />
    </>
  );
};

export default MyProducts;
