import api from "api";
import { authAxios } from "config/axios-config";
import { useLanguage } from "context/language-context";
import useAxios from "hooks/use-axios";
import content from "localization/content";
import localizationKeys from "localization/localization-keys";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import routes from "routes";
import { Button } from "semantic-ui-react";

const WalletPaymentForBidderFullPayment = ({
  amount,
  walletBalance,
  auctionId,
  paymentAPI,
  setShowWalletPaymentMethod,
  setShwoPaymentSelection,
}) => {
  const history = useHistory();
  const [isWalletPaymentSuccess, setIsWalletPaymentSuccess] = useState(null);
  const { run, isLoading } = useAxios([]);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const submitWalletPayment = () => {
    const body = {
      auctionId,
    };
    run(
      authAxios
        .post(paymentAPI, body)
        .then((res) => {
          setIsWalletPaymentSuccess(res?.data?.success);
          if (res?.data?.success) {
            toast.success("Payment successful", {
              position: "top-right", // Position of the toast
            });
            history.push(routes.app.profile.myBids.waitingForDelivery);
          }
        })
        .catch((error) => {
          toast.error("Payment Failed", {
            position: "top-right",
          });
        })
    );
  };
  const handleGoBack = () => {
    setShowWalletPaymentMethod()
    setShwoPaymentSelection()
  }
  return (
    <div className="flex flex-col justify-center bg-gray-200  h-4/5 rounded-xl p-4 border">
      <h1 className="text-center text-xl font-bold mb-20">
        Your Wallet Balance is AED {walletBalance}/-
      </h1>
      <div className="flex gap-3">
      <Button
          className="bg-white hover:bg-slate-100 border border-slate-400 opacity-100 font-normal text-base text-primary w-full h-[48px] rounded-lg mt-6"
          loading={isLoading}
          onClick={handleGoBack}
          >
          {selectedContent[localizationKeys.GoBack]}
        </Button>
      <Button
        className="bg-primary hover:bg-primary-dark opacity-100 font-normal text-base ltr:font-serifEN rtl:font-serifAR text-white w-full h-[48px] rounded-lg mt-6"
        loading={isLoading}
        id="submit"
        onClick={submitWalletPayment}
      >
        Pay AED {amount} From Wallet
      </Button>
      </div>
    </div>
  );
};

export default WalletPaymentForBidderFullPayment;
