import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "semantic-ui-react";
import { toast } from "react-hot-toast";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import routes from "../../../routes";
import { formatCurrency } from "../../../utils/format-currency";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export default function CheckoutFormPaymentDetails({ payPrice }) {
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();
  const { pathname, auctionId } = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  console.log("====================================");
  console.log({ pathname });
  console.log("====================================");

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          toast.success("Payment succeeded!");
          break;
        case "processing":
          toast.loading("Your payment is processing.");
          break;
        case "requires_payment_method":
          toast.error("Your payment was not successful, please try again.");
          break;
        default:
          toast.error("Something went wrong.");
          break;
      }
    });
  }, [history, stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        // return_url: `http://localhost:3000${routes.app.createAuction.paymentSucsess}`,
        return_url: `https://allatre-front.vercel.app/${routes.app.createAuction.paymentSucsess}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form className="w-full mx-auto" id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Button
        className="bg-primary hover:bg-primary-dark opacity-100 font-normal text-base ltr:font-serifEN rtl:font-serifAR text-white w-full h-[48px] rounded-lg mt-6"
        loading={isLoading}
        disabled={isLoading || !stripe || !elements}
        id="submit"
      >
        Pay {formatCurrency(payPrice)}
      </Button>
    </form>
  );
}
