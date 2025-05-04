import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, Dimmer } from "semantic-ui-react";
import { toast } from "react-hot-toast";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import routes from "../../../routes";
import { formatCurrency } from "../../../utils/format-currency";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";
import { authAxios } from "../../../config/axios-config";
import useAxios from "hooks/use-axios";
import api from "api";
import { useLanguage } from "context/language-context";

export default function CheckoutFormPayDeposite({ payPrice, auctionId, onError,bidAmount }) {
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();
  const { run, isLoading: isLoadingRun } = useAxios([]);
  const [message, setMessage] = useState(null);
  const [isStripeLoading, setIsStripeLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lang] = useLanguage("");

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
          setMessage("Payment succeeded!");
          toast.success("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          toast.loading("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          toast.error("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          toast.error("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe.js hasn't loaded yet");
      return;
    }
    setIsLoading(true);
    setMessage(null);
    
    try {
      const lockAuctionRes = await authAxios.post(api.app.auctions.lockAuction,{auctionId, bidAmount})
      if(lockAuctionRes.data.success){
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${process.env.REACT_APP_STRIPE_RETURN_URL}${routes.app.home}/payDeposite?auctionId=${auctionId}`,
          },
        });
  
        if (error) {
          const errorMessage = error.message || "An unexpected error occurred.";
          setMessage(errorMessage);
          toast.error(errorMessage);
          if (onError) {
            onError(errorMessage);
          }
        }
      }else {

        toast.error("Failed to lock the auction. Please try again.");
      }
     
    } catch (err) {
      console.error("Payment confirmation error:", err);
      const errorMessage =err.response.data.message[lang] || "Failed to process payment. Please try again.";
      setMessage(errorMessage);
      toast.error(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const paymentElementOptions = {
    layout: "tabs",
    loader: "always",
  };

  if (!stripe || !elements) {
    return (
      <div className="text-center p-4">
        <LodingTestAllatre />
        <p className="mt-2">Loading payment system...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading || isStripeLoading}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>

      <form className="w-full mx-auto" id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement 
          id="payment-element" 
          options={paymentElementOptions} 
          onReady={() => setIsStripeLoading(false)}
          onChange={(event) => {
            if (event.error) {
              setMessage(event.error.message);
              if (onError) {
                onError(event.error.message);
              }
            }
          }}
        />

        {message && (
          <div className="text-red-500 mt-4 text-center">
            {message}
          </div>
        )}

        <Button
          className="bg-primary hover:bg-primary-dark opacity-100 font-normal text-base ltr:font-serifEN rtl:font-serifAR text-white w-full h-[48px] rounded-lg mt-6"
          loading={isLoading}
          disabled={isLoading || !stripe || !elements || isStripeLoading}
          id="submit"
        >
          {isLoading ? "Processing..." : `Pay ${formatCurrency(payPrice)}`}
        </Button>
      </form>
    </div>
  );
}
