import React from "react";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "localization/localization-keys";
import { Button, Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";
// import ShowBankDetailsModal from "../withdrawalModal/ShowBankDetailsModal";

const PaymentSelectionOnAuctionPurchase = ({
  isWalletPayment,
  isLoading,
  setIsWalletPayment,
  handleSubmitPayment,
  walletBalance,
  isAUCTION_PURCHASE,
  setIsBankTransfer,
  isBankTransfer,

}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  return (
    <div className="mt-10  h-auto rounded-2xl bg-white border border-primary">
        <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="">
        <div className="px-3 py-2 my-5 text-center font-semibold text-lg">
          <h1>
            {
              selectedContent[
                localizationKeys.WhichPaymentMethodWouldYouLikeToSelect
              ]
            }
          </h1>
        </div>
        <div className="flex justify-evenly my-5">
{walletBalance && (
  <div>
    <input
      type="radio"
      className="mx-2 cursor-pointer accent-primary"
      name="PaymentMethod"
      id="walletPayment"
      onChange={() => {
        setIsWalletPayment(true);
        setIsBankTransfer(false);
      }}
      checked={isWalletPayment === true}
    />
    <label htmlFor="walletPayment" className="cursor-pointer">
      {selectedContent[localizationKeys.walletPayment]}
    </label>
  </div>
)}
{isAUCTION_PURCHASE && (
  <div>
    <input
      type="radio"
      className="mx-2 cursor-pointer accent-primary"
      name="PaymentMethod"
      id="bankTransfer"
      onChange={() => {
        setIsBankTransfer(true);
        setIsWalletPayment(false);
      }}
      checked={isBankTransfer === true}
    />
    <label htmlFor="bankTransfer" className="cursor-pointer">
      {selectedContent[localizationKeys.BankTransfer]}
    </label>
  </div>
)}
<div>
  <input
    type="radio"
    className="mx-2 cursor-pointer accent-primary"
    name="PaymentMethod"
    id="onlinePayment"
    onChange={() => {
      setIsWalletPayment(false);
      setIsBankTransfer(false);
    }}
    checked={!isWalletPayment && !isBankTransfer}
  />
  <label htmlFor="onlinePayment" className="cursor-pointer">
    {selectedContent[localizationKeys.onlinePayment]}
  </label>
</div>

        </div>
        <div className="mx-5 my-3">
          <Button
            className="bg-primary hover:bg-primary-dark w-full border border-primary-light text-white py-2 px-3 rounded-md my-2"
            onClick={handleSubmitPayment}
            loading={isLoading}
          >
            {selectedContent[localizationKeys.Submit]}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelectionOnAuctionPurchase;
