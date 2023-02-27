import React from "react";
import { useHistory } from "react-router-dom";
import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import Stepper from "../../../components/shared/stepper/stepper-app";
import routes from "../../../routes";

const AuctionDetails = () => {
  const history = useHistory();

  return (
    <div className="mt-44 animate-in ">
      <div className="mx-20 h-14 my-7 py-4 ">
        <CreateAuctionBreadcrumb />
      </div>
      <div className="flex justify-center">
        <Stepper />
      </div>
      <button
        onClick={() => history.push(routes.createAuction.shippingDetails)}
      >
        go to shippingDetails
      </button>
    </div>
  );
};

export default AuctionDetails;
