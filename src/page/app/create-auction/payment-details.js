import React from "react";
import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import StepperApp from "../../../components/shared/stepper/stepper-app";

const PaymentDetails = () => {
  return (
    <div className="mt-44 animate-in ">
      <div className="mx-20 h-14 my-7 py-4 ">
        <CreateAuctionBreadcrumb />
      </div>
      <div className="flex justify-center">
        <StepperApp />
      </div>
    </div>
  );
};

export default PaymentDetails;
