import React, { useEffect, useState } from "react";
import api from "../../../api";

import TotalAuctions from "../../../components/profile-components/total-auctions";
import { authAxios } from "../../../config/axios-config";
import useAxios from "../../../hooks/use-axios";

const MyAuctions = () => {
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

  console.log("====================================");
  console.log(analyticsData);
  console.log("====================================");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="mx-4 relative">
      {/* DoughnutChart */}
      <TotalAuctions />
    </div>
  );
};

export default MyAuctions;
