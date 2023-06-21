import React from "react";
import CheckoutPageCompletePayment from "../shared/stripe-payment/checkout-page-complete-payment";

const MyBidsCompletePayment = () => {
  return (
    <div className="mx-4 sm:mx-0 sm:ltr:ml-4 sm:rtl:mr-4">
      <CheckoutPageCompletePayment />
    </div>
  );
};

export default MyBidsCompletePayment;
