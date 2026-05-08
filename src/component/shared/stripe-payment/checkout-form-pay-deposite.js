import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import api from "../../../api";
import useAxios from "../../../hooks/use-axios";
import { formatCurrency } from "../../../utils/format-currency";

const CheckoutFormPayDeposite = ({
  clientSecret,
  productId,
  auctionId,
  bidAmount,
  isArbon = false,
  payPrice,
  onSuccess,
  onError,
  lang = "en",
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStripeLoading, setIsStripeLoading] = useState(true);
  const authAxios = useAxios();

  useEffect(() => {
    if (!stripe) return;

    const secret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!secret) return;

    stripe.retrievePaymentIntent(secret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const cardElement = elements.getElement(CardElement);

      if (isArbon) {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: { card: cardElement },
          },
        );

        if (error) {
          const errMsg = error.message || "Payment failed.";
          setMessage(errMsg);
          toast.error(errMsg);
          if (onError) onError(errMsg);
        } else if (
          paymentIntent.status === "succeeded" ||
          paymentIntent.status === "requires_capture"
        ) {
          toast.success("Deposit authorized successfully!");
          if (onSuccess) onSuccess(paymentIntent);
          setTimeout(() => {
            window.location.href = `/my-product/${productId}/details`;
          }, 1500);
        }
      } else {
        const res = await authAxios.post(api.app.auctions.lockAuction, {
          auctionId,
          bidAmount,
        });

        if (res.data.success) {
          const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: { card: cardElement },
            },
          );

          if (error) {
            const errMsg = error.message || "Payment failed.";
            setMessage(errMsg);
            toast.error(errMsg);
            if (onError) onError(errMsg);
          } else if (
            paymentIntent.status === "succeeded" ||
            paymentIntent.status === "requires_capture"
          ) {
            toast.success("Bid placed successfully!");
            if (onSuccess) onSuccess(paymentIntent);
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        } else {
          toast.error("Could not lock auction.");
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      const errMsg =
        err?.response?.data?.message?.[lang] || "An error occurred.";
      setMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="text-center p-8 bg-zinc-900/50 rounded-2xl border border-white/5">
        <p className="text-zinc-500 text-sm italic font-medium">
          Initializing Stripe...
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <form className="w-full mx-auto" onSubmit={handleSubmit}>
        <div className="p-5 bg-zinc-800 border border-white/20 rounded-2xl mb-6">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-3">
            Card Details
          </p>
          <div className="w-full min-h-[45px]">
            <CardElement
              onReady={() => setIsStripeLoading(false)}
              options={{
                style: {
                  base: {
                    color: "#ffffff",
                    fontFamily: '"Roboto", sans-serif',
                    fontSmoothing: "antialiased",
                    fontSize: "16px",
                    "::placeholder": { color: "#a1a1aa" },
                  },
                  invalid: { color: "#ef4444", iconColor: "#ef4444" },
                },
              }}
            />
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
            {message}
          </div>
        )}

        <button
          disabled={isLoading || isStripeLoading || !stripe || !elements}
          className="w-full py-4 bg-zinc-100 hover:bg-white disabled:bg-zinc-700 disabled:opacity-50 text-zinc-900 font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-black/20 flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
          ) : (
            <>
              <span>Pay {formatCurrency(payPrice)}</span>
              <i className="fi fi-rr-arrow-right mt-1 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-zinc-500 hover:text-zinc-300 text-xs font-medium transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
          >
            <i className="fi fi-rr-arrow-left mt-0.5" />
            Back to selection
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutFormPayDeposite;
