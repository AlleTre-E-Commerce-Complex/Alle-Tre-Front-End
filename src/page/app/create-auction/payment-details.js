import React, { useEffect, useState } from "react";
import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import StepperApp from "../../../components/shared/stepper/stepper-app";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import queryString from "query-string";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Dimmer, Loader, Message, Segment } from "semantic-ui-react";

const stripePromise = loadStripe(
  "pk_test_51MehXoKYIYT2tvx9Hx9653xzlh4ajpFwb90zTds8euPnWTGMIPfilBNVuaXQdG7MGMArdCxl5DCWdqDDuQ6goo5I00n7B99KDF"
);

const PaymentDetails = () => {
  const history = useHistory();
  const location = useLocation();
  const [statusModal, setStatusModal] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentIntentId, setPaymentIntentId] = useState();

  useEffect(() => {
    const { payment_intent: paymentIntentId } = queryString.parse(
      location.search
    );
    if (paymentIntentId) {
      setPaymentIntentId(paymentIntentId);
      setStatusModal(true);
    }
  }, [location.search]);

  return (
    <div className="mt-44 animate-in ">
      <div className="mx-20 h-14 my-7 py-4 ">
        <CreateAuctionBreadcrumb />
      </div>
      <div className="flex justify-center">
        <StepperApp />
      </div>
      <div>
        <div className="max-w-xl">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              setStatusModal={setStatusModal}
              clientSecret={clientSecret}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;

const CheckoutForm = ({ clientSecret, setStatusModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();

  useEffect(() => {
    const { payment_intent: paymentIntentId } = queryString.parse(
      location.search
    );

    const retrievePaymentIntent = async () => {
      if (stripe && clientSecret && paymentIntentId) {
        try {
          const { paymentIntent } = await stripe.retrievePaymentIntent(
            clientSecret
          );
          switch (paymentIntent.status) {
            case "succeeded":
              setStatusModal("succeeded");
              break;
            case "processing":
              // Payment processing, we'll update you once the payment is received
              break;
            case "required_payment_method":
              // Payment failed, please try another payment method
              break;
            default:
              break;
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    retrievePaymentIntent();

    // Cleanup function
    return () => {
      // Any cleanup tasks can be performed here
    };
  }, [clientSecret, location.search, setStatusModal, stripe]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
      });

      if (error) {
        console.log(error);
        setErrorMessage(error.message);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col mt-8">
      <Segment className="border-none shadow-none bg-transparent w-full">
        {errorMessage && <Message error content={errorMessage} />}

        <Dimmer active={isLoading} inverted>
          <Loader active={true} />
        </Dimmer>
        <PaymentElement />
        <div className="flex items-center justify-center">
          <Button
            primary
            className="my-4 px-16 mx-auto"
            disabled={!stripe}
            onClick={handleSubmit}
          >
            Checkout securely
          </Button>
        </div>
      </Segment>
    </div>
  );
};
