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

const WalletPaymentForBiddingDeoposit = ({
  amount,
  walletBalance,
  auctionId,
  paymentAPI,
  bidAmount,
  setShwoPaymentSelection,
  setShowWalletPaymentMethod,
}) => {
  const history = useHistory();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const [isWalletPaymentSuccess, setIsWalletPaymentSuccess] = useState(null);
  const { run, isLoading } = useAxios([]);
  const submitWalletPayment = () => {
    if (isLoading) return; // Prevent multiple clicks
    const body = {
      auctionId,
      amount,
      bidAmount,
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
            history.push(routes.app.homeDetails(auctionId));
          }
        })
        .catch((error) => {
          console.log('WalletPymentForBiddingDeposit Error:',error)
          console.log('WalletPymentForBiddingDeposit Error:',error?.response?.data?.message)
          if(error?.response?.data?.message === 'Internal server error'){
            toast.error('Payment Failed! please try once again', {
              position: "top-right",
            });
            return
          }
          const errorMessage1 =
            lang === "en"
              ? error?.response?.data?.message?.en
              : error?.response?.data?.message?.ar;
          const errorMessage2 = error?.response?.data?.message[0];
          toast.error(errorMessage1 || errorMessage2  || "Payment Failed", {
            position: "top-right",
          });
        })
    );
  };
  const handleGoBack = () => {
    setShowWalletPaymentMethod();
    setShwoPaymentSelection();
  };
  return (
    <div className="bg-gray-100 h-4/5 rounded-xl p-4 border relative flex flex-col">
      <h1 className="flex flex-col justify-center items-center text-center text-xl md:text-2xl font-bold mb-20 md:mb-0 md:absolute md:inset-0 md:m-auto">
        {selectedContent[localizationKeys.yourWalletBalanceIsAED]}{" "}
        {walletBalance}/-
      </h1>
      <div className="flex flex-col md:flex-row gap-4 md:absolute md:bottom-4 md:right-4 mt-auto">
        <Button
          className="border border-solid border-gray-400 bg-white text-gray-700 w-full md:w-[120px] h-[48px] md:h-[56px] rounded-lg text-base font-normal transition-all duration-300 hover:border-primary hover:text-primary"
          disabled={isLoading}
          onClick={handleGoBack}
        >
          {selectedContent[localizationKeys.GoBack]}
        </Button>

        <Button
          className="bg-primary text-white w-full md:w-[155px] h-[48px] md:h-[56px] rounded-lg text-base font-normal"
          loading={isLoading}
          disabled={isLoading}
          id="submit"
          onClick={submitWalletPayment}
        >
          {selectedContent[localizationKeys.payAED]} {amount}{" "}
          {selectedContent[localizationKeys.fromWallet]}
        </Button>
      </div>
    </div>
  );
};

export default WalletPaymentForBiddingDeoposit;
