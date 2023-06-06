import React from "react";
import CheckoutPage from "../shared/stripe-payment/checkout-page";

const PayDeposite = () => {
  return (
    <div>
      <div>
        <CheckoutPage payDeposite />
      </div>
    </div>
  );
};

export default PayDeposite;
