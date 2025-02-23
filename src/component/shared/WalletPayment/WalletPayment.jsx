import { authAxios } from "config/axios-config";
import { useLanguage } from "context/language-context";
import useAxios from "hooks/use-axios";
import content from "localization/content";
import localizationKeys from "localization/localization-keys";
import React from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import routes from "routes";
import { Button } from "semantic-ui-react";

const WalletPayment = ({
  setIsPaymentCompleted,
  amount,
  walletBalance,
  auctionId,
  paymentAPI,
  setShwoPaymentSelection,
  setShowWalletPaymentMethod,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { run, isLoading } = useAxios([]);
  const submitWalletPayment = () => {
    const body = {
      auctionId,
      amount,
    };
    run(
      authAxios
        .post(paymentAPI, body)
        .then((res) => {
          if (res?.data?.success) {
            toast.success("Payment successful", {
              position: "top-right", // Position of the toast
            });
            setIsPaymentCompleted(true);
            // history.push(routes.app.profile.myAuctions.active);
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
    setShowWalletPaymentMethod();
    setShwoPaymentSelection();
  };
  return (
    <div className="bg-gray-100 h-4/5 rounded-xl p-4 border relative">
      <h1 className="flex flex-col justify-center items-center text-center text-xl font-bold absolute inset-0 m-auto">
        {selectedContent[localizationKeys.yourWalletBalanceIsAED]}
        {walletBalance}/-
      </h1>
      <div className="absolute bottom-4 right-4 flex gap-4">
        <Button
          className="border border-solid border-gray-400 bg-white text-gray-700 w-[120px] h-[56px] rounded-lg text-base font-normal transition-all duration-300 hover:border-primary hover:text-primary"
          loading={isLoading}
          onClick={handleGoBack}
        >
          {selectedContent[localizationKeys.GoBack]}
        </Button>

        <Button
          className="bg-primary text-white w-[155px] h-[56px] rounded-lg text-base font-normal"
          loading={isLoading}
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

export default WalletPayment;
